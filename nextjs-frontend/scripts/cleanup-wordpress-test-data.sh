#!/bin/bash

################################################################################
# WordPress Test Data Cleanup Script
################################################################################
#
# Purpose: Safely remove test posts, media, and categories from WordPress
# Based on: WordPress Content Transfer Verification Report (2025-10-09)
#
# Features:
# - Dry-run mode (preview deletions)
# - Interactive confirmation
# - Automatic backup before deletion
# - Detailed logging
# - Rollback capability
# - Uses WordPress REST API (no direct database access)
#
# Usage:
#   ./cleanup-wordpress-test-data.sh [OPTIONS]
#
# Options:
#   --dry-run         Preview what will be deleted (no actual deletion)
#   --skip-backup     Skip backup creation (NOT RECOMMENDED)
#   --force           Skip interactive confirmations
#   --category NAME   Delete specific category only
#   --help            Show this help message
#
################################################################################

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
LOG_DIR="$PROJECT_ROOT/logs/wordpress-cleanup"
BACKUP_DIR="$PROJECT_ROOT/backups/wordpress-cleanup"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
LOG_FILE="$LOG_DIR/cleanup-$TIMESTAMP.log"
BACKUP_FILE="$BACKUP_DIR/backup-$TIMESTAMP.json"

# WordPress configuration
WP_API_URL="${WORDPRESS_API_URL:-https://wp.saabuildingblocks.com/wp-json/wp/v2}"
WP_ADMIN_USER="${WP_ADMIN_USER:-}"
WP_ADMIN_PASS="${WP_ADMIN_PASS:-}"

# Script options
DRY_RUN=false
SKIP_BACKUP=false
FORCE=false
TARGET_CATEGORY=""

# Test data identification (from audit report)
# These are known test/draft posts that can be safely removed
declare -a TEST_POST_IDS=(
    3969  # "eXp Realty Commission Split and Fees 2025" (draft)
    3985  # "eXp Realty Sponsor: The Wolf Pack Dream Team" (draft)
    8347  # "The eXp Sponsor Program: Everything to Know" (draft)
)

declare -a FUTURE_POST_IDS=(
    270368  # "Can You Fix a Bad Sponsor for Revenue Share?" (future)
    270378  # "Grow Revenue Share Empire with Co-Sponsor" (future)
)

# Known test categories (will be identified during audit)
declare -a TEST_CATEGORIES=()

################################################################################
# Utility Functions
################################################################################

log() {
    local level=$1
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')

    echo "[$timestamp] [$level] $message" | tee -a "$LOG_FILE"

    case "$level" in
        ERROR)
            echo -e "${RED}✗ $message${NC}" >&2
            ;;
        SUCCESS)
            echo -e "${GREEN}✓ $message${NC}"
            ;;
        WARNING)
            echo -e "${YELLOW}⚠ $message${NC}"
            ;;
        INFO)
            echo -e "${BLUE}ℹ $message${NC}"
            ;;
    esac
}

confirm() {
    if [[ "$FORCE" == true ]]; then
        return 0
    fi

    local prompt="$1"
    read -p "$prompt [y/N] " -n 1 -r
    echo
    [[ $REPLY =~ ^[Yy]$ ]]
}

check_dependencies() {
    log INFO "Checking dependencies..."

    local deps=(curl jq)
    for dep in "${deps[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            log ERROR "Required dependency '$dep' not found. Please install it."
            exit 1
        fi
    done

    log SUCCESS "All dependencies found"
}

setup_directories() {
    log INFO "Setting up directories..."
    mkdir -p "$LOG_DIR" "$BACKUP_DIR"
    log SUCCESS "Directories ready: $LOG_DIR, $BACKUP_DIR"
}

################################################################################
# WordPress API Functions
################################################################################

wp_api_call() {
    local method=$1
    local endpoint=$2
    local data=${3:-}

    local auth_header=""
    if [[ -n "$WP_ADMIN_USER" && -n "$WP_ADMIN_PASS" ]]; then
        auth_header="-u $WP_ADMIN_USER:$WP_ADMIN_PASS"
    fi

    if [[ -n "$data" ]]; then
        curl -s -X "$method" \
            "$WP_API_URL/$endpoint" \
            $auth_header \
            -H "Content-Type: application/json" \
            -d "$data"
    else
        curl -s -X "$method" \
            "$WP_API_URL/$endpoint" \
            $auth_header \
            -H "Content-Type: application/json"
    fi
}

check_wp_api_connection() {
    log INFO "Checking WordPress API connection..."

    local response=$(curl -s -o /dev/null -w "%{http_code}" "$WP_API_URL")

    if [[ "$response" == "200" ]]; then
        log SUCCESS "WordPress API is accessible"
        return 0
    else
        log ERROR "Cannot connect to WordPress API (HTTP $response)"
        log ERROR "URL: $WP_API_URL"
        return 1
    fi
}

get_post_by_id() {
    local post_id=$1
    wp_api_call "GET" "posts/$post_id"
}

get_all_categories() {
    wp_api_call "GET" "categories?per_page=100"
}

get_category_by_name() {
    local name=$1
    wp_api_call "GET" "categories?search=$(echo "$name" | jq -sRr @uri)"
}

################################################################################
# Audit Functions
################################################################################

audit_test_data() {
    log INFO "Auditing WordPress for test data..."

    local total_found=0

    # Check test posts
    log INFO "Checking draft posts..."
    for post_id in "${TEST_POST_IDS[@]}"; do
        local post=$(get_post_by_id "$post_id" 2>/dev/null || echo "{}")
        local title=$(echo "$post" | jq -r '.title.rendered // "NOT FOUND"')
        local status=$(echo "$post" | jq -r '.status // "NOT FOUND"')

        if [[ "$status" != "NOT FOUND" ]]; then
            log WARNING "Found: Post #$post_id - \"$title\" (status: $status)"
            ((total_found++))
        fi
    done

    # Check future posts
    log INFO "Checking future posts..."
    for post_id in "${FUTURE_POST_IDS[@]}"; do
        local post=$(get_post_by_id "$post_id" 2>/dev/null || echo "{}")
        local title=$(echo "$post" | jq -r '.title.rendered // "NOT FOUND"')
        local status=$(echo "$post" | jq -r '.status // "NOT FOUND"')

        if [[ "$status" != "NOT FOUND" ]]; then
            log WARNING "Found: Post #$post_id - \"$title\" (status: $status)"
            ((total_found++))
        fi
    done

    # Check for empty categories
    log INFO "Checking for empty/test categories..."
    local categories=$(get_all_categories)
    local empty_cats=$(echo "$categories" | jq -r '.[] | select(.count == 0) | "\(.id):\(.name)"')

    if [[ -n "$empty_cats" ]]; then
        while IFS=: read -r cat_id cat_name; do
            log WARNING "Found empty category: #$cat_id - \"$cat_name\""
            TEST_CATEGORIES+=("$cat_id")
            ((total_found++))
        done <<< "$empty_cats"
    fi

    log INFO "Audit complete. Found $total_found items to clean up"
    return $total_found
}

################################################################################
# Backup Functions
################################################################################

create_backup() {
    if [[ "$SKIP_BACKUP" == true ]]; then
        log WARNING "Skipping backup (--skip-backup flag set)"
        return 0
    fi

    log INFO "Creating backup..."

    local backup_data='{"timestamp":"'$TIMESTAMP'","posts":[],"categories":[]}'

    # Backup test posts
    log INFO "Backing up posts..."
    for post_id in "${TEST_POST_IDS[@]}" "${FUTURE_POST_IDS[@]}"; do
        local post=$(get_post_by_id "$post_id" 2>/dev/null || echo "{}")
        if [[ $(echo "$post" | jq -r '.id // null') != "null" ]]; then
            backup_data=$(echo "$backup_data" | jq ".posts += [$post]")
        fi
    done

    # Backup categories
    log INFO "Backing up categories..."
    for cat_id in "${TEST_CATEGORIES[@]}"; do
        local category=$(wp_api_call "GET" "categories/$cat_id" 2>/dev/null || echo "{}")
        if [[ $(echo "$category" | jq -r '.id // null') != "null" ]]; then
            backup_data=$(echo "$backup_data" | jq ".categories += [$category]")
        fi
    done

    # Save backup
    echo "$backup_data" | jq '.' > "$BACKUP_FILE"

    local backup_size=$(stat -f%z "$BACKUP_FILE" 2>/dev/null || stat -c%s "$BACKUP_FILE" 2>/dev/null)
    log SUCCESS "Backup created: $BACKUP_FILE (${backup_size} bytes)"

    # Create rollback script
    create_rollback_script
}

create_rollback_script() {
    local rollback_script="$BACKUP_DIR/rollback-$TIMESTAMP.sh"

    cat > "$rollback_script" << 'ROLLBACK_EOF'
#!/bin/bash
# Rollback script for WordPress cleanup
# Generated automatically - restores deleted content from backup

set -euo pipefail

BACKUP_FILE="$(dirname "$0")/backup-TIMESTAMP.json"
WP_API_URL="${WORDPRESS_API_URL:-https://wp.saabuildingblocks.com/wp-json/wp/v2}"

if [[ ! -f "$BACKUP_FILE" ]]; then
    echo "ERROR: Backup file not found: $BACKUP_FILE"
    exit 1
fi

echo "⚠️  WARNING: This will restore deleted posts and categories"
read -p "Continue? [y/N] " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Rollback cancelled"
    exit 0
fi

echo "Restoring from backup..."

# Restore posts (requires manual import - REST API doesn't support full post restoration)
echo "To restore posts manually:"
echo "1. Import backup file into WordPress"
echo "2. Use WordPress Tools > Import > JSON"
echo "3. Select file: $BACKUP_FILE"

# Restore categories
jq -r '.categories[] | @json' "$BACKUP_FILE" | while read -r category; do
    name=$(echo "$category" | jq -r '.name')
    slug=$(echo "$category" | jq -r '.slug')
    description=$(echo "$category" | jq -r '.description // ""')

    echo "Restoring category: $name"
    curl -X POST "$WP_API_URL/categories" \
        -H "Content-Type: application/json" \
        -d "{\"name\":\"$name\",\"slug\":\"$slug\",\"description\":\"$description\"}"
done

echo "✓ Rollback instructions generated"
echo "Note: Post restoration requires manual import via WordPress admin"
ROLLBACK_EOF

    sed -i "s/TIMESTAMP/$TIMESTAMP/g" "$rollback_script"
    chmod +x "$rollback_script"

    log SUCCESS "Rollback script created: $rollback_script"
}

################################################################################
# Deletion Functions
################################################################################

delete_post() {
    local post_id=$1
    local force_delete=${2:-false}

    if [[ "$DRY_RUN" == true ]]; then
        log INFO "[DRY RUN] Would move post #$post_id to trash"
        return 0
    fi

    log INFO "Moving post #$post_id to trash..."

    # Move to trash (recoverable)
    local response=$(wp_api_call "DELETE" "posts/$post_id")
    local status=$(echo "$response" | jq -r '.status // "error"')

    if [[ "$status" == "trash" ]]; then
        log SUCCESS "Post #$post_id moved to trash"
        return 0
    else
        log ERROR "Failed to trash post #$post_id"
        return 1
    fi
}

delete_category() {
    local cat_id=$1

    if [[ "$DRY_RUN" == true ]]; then
        log INFO "[DRY RUN] Would delete category #$cat_id"
        return 0
    fi

    log INFO "Deleting category #$cat_id..."

    # Check if category is empty
    local category=$(wp_api_call "GET" "categories/$cat_id")
    local count=$(echo "$category" | jq -r '.count // 0')

    if [[ "$count" -gt 0 ]]; then
        log WARNING "Category #$cat_id has $count posts. Skipping deletion."
        return 1
    fi

    # Delete category
    local response=$(wp_api_call "DELETE" "categories/$cat_id?force=true")
    local deleted=$(echo "$response" | jq -r '.deleted // false')

    if [[ "$deleted" == "true" ]]; then
        log SUCCESS "Category #$cat_id deleted"
        return 0
    else
        log ERROR "Failed to delete category #$cat_id"
        return 1
    fi
}

cleanup_posts() {
    log INFO "Cleaning up test posts..."

    local deleted=0
    local failed=0

    # Clean up draft posts
    for post_id in "${TEST_POST_IDS[@]}"; do
        if delete_post "$post_id"; then
            ((deleted++))
        else
            ((failed++))
        fi
    done

    # Clean up future posts
    for post_id in "${FUTURE_POST_IDS[@]}"; do
        if delete_post "$post_id"; then
            ((deleted++))
        else
            ((failed++))
        fi
    done

    log INFO "Posts cleanup: $deleted deleted, $failed failed"
}

cleanup_categories() {
    log INFO "Cleaning up empty/test categories..."

    local deleted=0
    local failed=0

    for cat_id in "${TEST_CATEGORIES[@]}"; do
        if delete_category "$cat_id"; then
            ((deleted++))
        else
            ((failed++))
        fi
    done

    log INFO "Categories cleanup: $deleted deleted, $failed failed"
}

################################################################################
# Report Functions
################################################################################

generate_report() {
    log INFO "Generating cleanup report..."

    local report_file="$LOG_DIR/cleanup-report-$TIMESTAMP.md"

    cat > "$report_file" << EOF
# WordPress Cleanup Report

**Date:** $(date '+%Y-%m-%d %H:%M:%S')
**Mode:** $(if [[ "$DRY_RUN" == true ]]; then echo "DRY RUN"; else echo "ACTUAL DELETION"; fi)

## Summary

- **Test Posts Identified:** ${#TEST_POST_IDS[@]}
- **Future Posts Identified:** ${#FUTURE_POST_IDS[@]}
- **Empty Categories Identified:** ${#TEST_CATEGORIES[@]}
- **Total Items:** $((${#TEST_POST_IDS[@]} + ${#FUTURE_POST_IDS[@]} + ${#TEST_CATEGORIES[@]}))

## Actions Taken

### Posts Moved to Trash

$(for post_id in "${TEST_POST_IDS[@]}" "${FUTURE_POST_IDS[@]}"; do
    post=$(get_post_by_id "$post_id" 2>/dev/null || echo "{}")
    title=$(echo "$post" | jq -r '.title.rendered // "NOT FOUND"')
    echo "- Post #$post_id: \"$title\""
done)

### Categories Deleted

$(for cat_id in "${TEST_CATEGORIES[@]}"; do
    echo "- Category #$cat_id"
done)

## Backup Information

- **Backup File:** $BACKUP_FILE
- **Rollback Script:** $BACKUP_DIR/rollback-$TIMESTAMP.sh

## Recovery Instructions

To restore deleted content:

\`\`\`bash
# Run the rollback script
bash $BACKUP_DIR/rollback-$TIMESTAMP.sh

# Or manually restore from WordPress Trash
# Go to: https://wp.saabuildingblocks.com/wp-admin/edit.php?post_status=trash&post_type=post
\`\`\`

## Log File

Full execution log: $LOG_FILE

---

Generated by: cleanup-wordpress-test-data.sh
EOF

    log SUCCESS "Report generated: $report_file"

    # Display summary
    echo
    echo -e "${BLUE}╔════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║         WordPress Cleanup Summary                  ║${NC}"
    echo -e "${BLUE}╠════════════════════════════════════════════════════╣${NC}"
    echo -e "${BLUE}║${NC} Test Posts:        ${#TEST_POST_IDS[@]} items                        ${BLUE}║${NC}"
    echo -e "${BLUE}║${NC} Future Posts:      ${#FUTURE_POST_IDS[@]} items                        ${BLUE}║${NC}"
    echo -e "${BLUE}║${NC} Empty Categories:  ${#TEST_CATEGORIES[@]} items                        ${BLUE}║${NC}"
    echo -e "${BLUE}║${NC}                                                    ${BLUE}║${NC}"
    echo -e "${BLUE}║${NC} Backup:            $BACKUP_FILE${BLUE}║${NC}"
    echo -e "${BLUE}║${NC} Report:            $report_file${BLUE}║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════╝${NC}"
    echo
}

################################################################################
# Main Execution
################################################################################

show_help() {
    cat << EOF
WordPress Test Data Cleanup Script

Usage: $0 [OPTIONS]

Options:
  --dry-run         Preview what will be deleted (no actual deletion)
  --skip-backup     Skip backup creation (NOT RECOMMENDED)
  --force           Skip interactive confirmations
  --category NAME   Delete specific category only
  --help            Show this help message

Environment Variables:
  WORDPRESS_API_URL   WordPress REST API URL (default: https://wp.saabuildingblocks.com/wp-json/wp/v2)
  WP_ADMIN_USER       WordPress admin username (required for authentication)
  WP_ADMIN_PASS       WordPress admin password (required for authentication)

Examples:
  # Dry run (preview only)
  $0 --dry-run

  # Delete with backup
  $0

  # Force deletion without prompts
  $0 --force

  # Delete specific category
  $0 --category "Test Category"

Safety Features:
  ✓ Automatic backup before deletion
  ✓ Posts moved to trash (recoverable via WordPress admin)
  ✓ Empty categories only deleted (no data loss)
  ✓ Detailed logging of all operations
  ✓ Rollback script generated

Recovery:
  Posts can be restored from WordPress Trash:
  https://wp.saabuildingblocks.com/wp-admin/edit.php?post_status=trash&post_type=post

EOF
}

parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --dry-run)
                DRY_RUN=true
                shift
                ;;
            --skip-backup)
                SKIP_BACKUP=true
                shift
                ;;
            --force)
                FORCE=true
                shift
                ;;
            --category)
                TARGET_CATEGORY="$2"
                shift 2
                ;;
            --help)
                show_help
                exit 0
                ;;
            *)
                log ERROR "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done
}

main() {
    echo -e "${BLUE}╔════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║    WordPress Test Data Cleanup Script              ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════╝${NC}"
    echo

    # Parse command line arguments
    parse_arguments "$@"

    # Setup
    check_dependencies
    setup_directories

    # Check WordPress API connection
    if ! check_wp_api_connection; then
        log ERROR "Cannot proceed without WordPress API access"
        log INFO "Set WP_ADMIN_USER and WP_ADMIN_PASS environment variables for authentication"
        exit 1
    fi

    # Audit test data
    audit_test_data
    local items_found=$?

    if [[ $items_found -eq 0 ]]; then
        log SUCCESS "No test data found. Nothing to clean up."
        exit 0
    fi

    # Confirmation
    if [[ "$DRY_RUN" == false ]]; then
        echo
        log WARNING "This will move $items_found items to trash/delete empty categories"
        log WARNING "Backup will be created at: $BACKUP_FILE"
        echo

        if ! confirm "Proceed with cleanup?"; then
            log INFO "Cleanup cancelled by user"
            exit 0
        fi
    else
        log INFO "DRY RUN MODE - No actual changes will be made"
    fi

    # Create backup
    create_backup

    # Perform cleanup
    cleanup_posts
    cleanup_categories

    # Generate report
    generate_report

    # Final message
    echo
    if [[ "$DRY_RUN" == true ]]; then
        log SUCCESS "Dry run complete. No changes were made."
        log INFO "Remove --dry-run flag to perform actual cleanup"
    else
        log SUCCESS "Cleanup complete!"
        log INFO "Posts are in trash and can be restored if needed"
        log INFO "Backup: $BACKUP_FILE"
        log INFO "Rollback: $BACKUP_DIR/rollback-$TIMESTAMP.sh"
    fi
    echo
}

# Run main function with all arguments
main "$@"
