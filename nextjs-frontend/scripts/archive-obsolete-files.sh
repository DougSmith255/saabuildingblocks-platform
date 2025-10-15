#!/bin/bash
# Archive Obsolete Files Script
# Purpose: Safely move old/duplicate/obsolete files to organized archive structure
# Author: Claude Code - Coder Agent
# Date: 2025-10-15

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ARCHIVE_ROOT="/home/claude-flow/nextjs-frontend/.archive"
MANIFEST_FILE="${ARCHIVE_ROOT}/manifest.json"
DRY_RUN=true
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Archive categories
declare -A ARCHIVE_DIRS=(
    ["configs"]="${ARCHIVE_ROOT}/configs"
    ["documentation"]="${ARCHIVE_ROOT}/documentation"
    ["tests"]="${ARCHIVE_ROOT}/tests"
    ["backups"]="${ARCHIVE_ROOT}/backups"
    ["logs"]="${ARCHIVE_ROOT}/logs"
    ["screenshots"]="${ARCHIVE_ROOT}/screenshots"
    ["scripts"]="${ARCHIVE_ROOT}/scripts"
)

# File patterns to archive
declare -A FILE_PATTERNS=(
    ["backup_configs"]="*.backup *.backup.* *.old *.example *.corrected"
    ["test_scripts"]="test-*.js verify-*.js debug-*.js check-*.js capture-*.js inspect-*.js diagnose-*.js analyze-*.js find-*.js clear-*.js"
    ["obsolete_docs"]="*-SUMMARY.txt *-DELIVERABLES.md *-COMPLETE.md *-STATUS.md *-REPORT.md *-INDEX.md *-QUICK-*.md"
    ["screenshots"]="*.png counter-*.png 404-*.png *-screenshot.png"
    ["old_logs"]="*.log"
    ["deployment_scripts"]="scripts/deploy-*.sh scripts/test-*.sh scripts/verify-*.sh"
)

# Function to print colored messages
log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Function to show usage
show_usage() {
    cat << EOF
Usage: $0 [OPTIONS]

Archive obsolete files to organized directory structure.

OPTIONS:
    --dry-run       Preview what will be archived (default)
    --execute       Actually move files to archive
    --restore FILE  Restore a file from archive
    --list          List all archived files
    --stats         Show archive statistics
    --help          Show this help message

EXAMPLES:
    # Preview archival
    $0 --dry-run

    # Execute archival
    $0 --execute

    # Restore a file
    $0 --restore configs/.env.backup

    # List archived files
    $0 --list

    # Show statistics
    $0 --stats

ARCHIVE STRUCTURE:
    .archive/
    ├── configs/        (old .env, next.config backups)
    ├── documentation/  (old .md files)
    ├── tests/          (test-*, verify-*, debug-* scripts)
    ├── backups/        (*.backup, *.old files)
    ├── logs/           (old log files)
    ├── screenshots/    (*.png files from root)
    └── scripts/        (old deployment scripts)

EOF
    exit 0
}

# Function to create archive directories
create_archive_structure() {
    log_info "Creating archive directory structure..."

    mkdir -p "${ARCHIVE_ROOT}"
    for dir in "${ARCHIVE_DIRS[@]}"; do
        mkdir -p "${dir}"
    done

    # Initialize manifest if it doesn't exist
    if [[ ! -f "${MANIFEST_FILE}" ]]; then
        echo '{"archived_files": [], "metadata": {"created": "'${TIMESTAMP}'", "version": "1.0"}}' > "${MANIFEST_FILE}"
    fi

    log_success "Archive structure created at ${ARCHIVE_ROOT}"
}

# Function to add entry to manifest
add_to_manifest() {
    local source="$1"
    local destination="$2"
    local category="$3"
    local size="$4"

    local entry=$(cat <<EOF
{
    "source": "${source}",
    "destination": "${destination}",
    "category": "${category}",
    "size": ${size},
    "archived_at": "${TIMESTAMP}",
    "archived_date": "$(date -Iseconds)"
}
EOF
    )

    # Add to manifest (simple append for now)
    if [[ "${DRY_RUN}" == "false" ]]; then
        # In production, would use jq to properly update JSON
        log_info "Would add to manifest: ${source} -> ${destination}"
    fi
}

# Function to archive file
archive_file() {
    local source="$1"
    local category="$2"

    if [[ ! -f "${source}" ]]; then
        log_warning "File not found: ${source}"
        return 1
    fi

    local basename=$(basename "${source}")
    local destination="${ARCHIVE_DIRS[$category]}/${TIMESTAMP}_${basename}"
    local size=$(stat -f%z "${source}" 2>/dev/null || stat -c%s "${source}" 2>/dev/null || echo "0")

    if [[ "${DRY_RUN}" == "true" ]]; then
        log_info "[DRY-RUN] Would archive: ${source} -> ${destination}"
        echo "  Category: ${category}, Size: ${size} bytes"
    else
        mv "${source}" "${destination}"
        add_to_manifest "${source}" "${destination}" "${category}" "${size}"
        log_success "Archived: ${source} -> ${destination}"
    fi
}

# Function to scan and archive backup configs
archive_backup_configs() {
    log_info "Scanning for backup configuration files..."
    local count=0

    cd /home/claude-flow/nextjs-frontend

    # Find .env backups
    for file in .env.*.backup .env.backup* .env.*.example; do
        if [[ -f "${file}" ]]; then
            archive_file "${file}" "configs"
            ((count++))
        fi
    done

    # Find next.config backups
    for file in next.config.*.ts next.config.*.js; do
        if [[ "${file}" != "next.config.ts" ]] && [[ -f "${file}" ]]; then
            archive_file "${file}" "configs"
            ((count++))
        fi
    done

    # Find package.json backups
    for file in package.json.*; do
        if [[ -f "${file}" ]]; then
            archive_file "${file}" "backups"
            ((count++))
        fi
    done

    log_success "Found ${count} backup configuration files"
}

# Function to archive test scripts
archive_test_scripts() {
    log_info "Scanning for test/debug/verify scripts in root..."
    local count=0

    cd /home/claude-flow/nextjs-frontend

    # Test scripts
    for pattern in test-*.js verify-*.js debug-*.js check-*.js capture-*.js inspect-*.js diagnose-*.js analyze-*.js find-*.js clear-*.js; do
        for file in ${pattern}; do
            if [[ -f "${file}" ]]; then
                archive_file "${file}" "tests"
                ((count++))
            fi
        done
    done

    log_success "Found ${count} test/debug scripts"
}

# Function to archive obsolete documentation
archive_obsolete_docs() {
    log_info "Scanning for obsolete documentation in root..."
    local count=0

    cd /home/claude-flow/nextjs-frontend

    # Obsolete docs patterns
    local patterns=(
        "*-SUMMARY.txt"
        "*-SUMMARY.md"
        "*-DELIVERABLES.md"
        "*-COMPLETE.md"
        "*-STATUS.md"
        "*-REPORT.md"
        "*-INDEX.md"
        "*-QUICK-*.md"
        "*-VERIFICATION*.md"
        "PHASE*.txt"
        "PHASE*.md"
        "REVIEW_*.txt"
        "COORDINATION_*.md"
    )

    for pattern in "${patterns[@]}"; do
        for file in ${pattern}; do
            if [[ -f "${file}" ]] && [[ "${file}" != "README.md" ]]; then
                archive_file "${file}" "documentation"
                ((count++))
            fi
        done
    done

    log_success "Found ${count} obsolete documentation files"
}

# Function to archive screenshots
archive_screenshots() {
    log_info "Scanning for screenshots in root..."
    local count=0

    cd /home/claude-flow/nextjs-frontend

    for file in *.png; do
        if [[ -f "${file}" ]]; then
            archive_file "${file}" "screenshots"
            ((count++))
        fi
    done

    log_success "Found ${count} screenshot files"
}

# Function to archive old logs
archive_logs() {
    log_info "Scanning for log files..."
    local count=0

    cd /home/claude-flow/nextjs-frontend

    for file in *.log; do
        if [[ -f "${file}" ]]; then
            archive_file "${file}" "logs"
            ((count++))
        fi
    done

    log_success "Found ${count} log files"
}

# Function to list archived files
list_archived_files() {
    log_info "Archived files:"

    if [[ ! -d "${ARCHIVE_ROOT}" ]]; then
        log_warning "Archive directory does not exist yet"
        return
    fi

    for category in "${!ARCHIVE_DIRS[@]}"; do
        local dir="${ARCHIVE_DIRS[$category]}"
        local count=$(find "${dir}" -type f 2>/dev/null | wc -l | tr -d ' ')

        if [[ ${count} -gt 0 ]]; then
            echo -e "\n${GREEN}${category}${NC} (${count} files):"
            find "${dir}" -type f -exec ls -lh {} \; 2>/dev/null | awk '{print "  " $9 " (" $5 ")"}'
        fi
    done
}

# Function to show statistics
show_statistics() {
    log_info "Archive Statistics:"

    if [[ ! -d "${ARCHIVE_ROOT}" ]]; then
        log_warning "Archive directory does not exist yet"
        return
    fi

    local total_files=0
    local total_size=0

    echo ""
    printf "%-20s %10s %15s\n" "Category" "Files" "Size"
    printf "%-20s %10s %15s\n" "--------" "-----" "----"

    for category in "${!ARCHIVE_DIRS[@]}"; do
        local dir="${ARCHIVE_DIRS[$category]}"
        local count=$(find "${dir}" -type f 2>/dev/null | wc -l | tr -d ' ')
        local size=$(du -sh "${dir}" 2>/dev/null | cut -f1 || echo "0")

        printf "%-20s %10s %15s\n" "${category}" "${count}" "${size}"
        total_files=$((total_files + count))
    done

    echo ""
    local archive_size=$(du -sh "${ARCHIVE_ROOT}" 2>/dev/null | cut -f1 || echo "0")
    printf "%-20s %10s %15s\n" "TOTAL" "${total_files}" "${archive_size}"
}

# Function to restore file
restore_file() {
    local file_path="$1"
    local archived_file="${ARCHIVE_ROOT}/${file_path}"

    if [[ ! -f "${archived_file}" ]]; then
        log_error "File not found in archive: ${file_path}"
        return 1
    fi

    # Extract original filename (remove timestamp prefix)
    local basename=$(basename "${archived_file}")
    local original_name=$(echo "${basename}" | sed 's/^[0-9]\{8\}_[0-9]\{6\}_//')
    local restore_path="/home/claude-flow/nextjs-frontend/${original_name}"

    if [[ -f "${restore_path}" ]]; then
        log_warning "File already exists at restore location: ${restore_path}"
        read -p "Overwrite? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "Restore cancelled"
            return 0
        fi
    fi

    cp "${archived_file}" "${restore_path}"
    log_success "Restored: ${archived_file} -> ${restore_path}"
}

# Function to run full archival
run_archival() {
    log_info "Starting archival process..."
    log_info "Mode: $([ "${DRY_RUN}" == "true" ] && echo "DRY-RUN" || echo "EXECUTE")"
    echo ""

    create_archive_structure

    archive_backup_configs
    archive_test_scripts
    archive_obsolete_docs
    archive_screenshots
    archive_logs

    echo ""
    if [[ "${DRY_RUN}" == "true" ]]; then
        log_warning "This was a DRY-RUN. No files were moved."
        log_info "Run with --execute to actually archive files"
    else
        log_success "Archival complete!"
        log_info "Archive location: ${ARCHIVE_ROOT}"
        show_statistics
    fi
}

# Main script logic
main() {
    case "${1:-}" in
        --dry-run)
            DRY_RUN=true
            run_archival
            ;;
        --execute)
            DRY_RUN=false
            log_warning "EXECUTE mode - files will be moved to archive!"
            read -p "Continue? (y/N): " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                run_archival
            else
                log_info "Archival cancelled"
            fi
            ;;
        --restore)
            if [[ -z "${2:-}" ]]; then
                log_error "Please specify a file to restore"
                echo "Usage: $0 --restore <path/to/file>"
                exit 1
            fi
            restore_file "$2"
            ;;
        --list)
            list_archived_files
            ;;
        --stats)
            show_statistics
            ;;
        --help|-h|"")
            show_usage
            ;;
        *)
            log_error "Unknown option: $1"
            show_usage
            ;;
    esac
}

# Run main function
main "$@"
