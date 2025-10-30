-- ========================================
-- BACKUP SCRIPT: Before Table Cleanup
-- Generated: 2025-10-29
-- Purpose: Backup data before removing obsolete tables
-- ========================================

-- ⚠️ CRITICAL: Run this script BEFORE executing cleanup-obsolete-tables.sql

-- ========================================
-- 1. Create backup schema
-- ========================================

-- Create backup schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS backup_20251029;

-- Add comment to backup schema
COMMENT ON SCHEMA backup_20251029 IS 'Backup before cleanup on 2025-10-29 - Contains dino_high_scores table';

-- ========================================
-- 2. Backup tables to be deleted
-- ========================================

-- Backup dino_high_scores table (TEST DATA)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'dino_high_scores'
  ) THEN
    -- Create backup table with all data
    EXECUTE 'CREATE TABLE backup_20251029.dino_high_scores AS SELECT * FROM public.dino_high_scores';

    -- Copy indexes (if any)
    -- Note: Indexes are not automatically copied with CREATE TABLE AS

    RAISE NOTICE '✅ Backed up dino_high_scores table (%s rows)',
      (SELECT COUNT(*) FROM public.dino_high_scores);
  ELSE
    RAISE NOTICE '⚠️ Table dino_high_scores does not exist, skipping backup';
  END IF;
END $$;

-- ========================================
-- 3. Verify backup
-- ========================================

DO $$
DECLARE
  original_count INTEGER;
  backup_count INTEGER;
BEGIN
  -- Check if original table exists
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'dino_high_scores'
  ) THEN
    -- Get row counts
    SELECT COUNT(*) INTO original_count FROM public.dino_high_scores;
    SELECT COUNT(*) INTO backup_count FROM backup_20251029.dino_high_scores;

    -- Verify counts match
    IF original_count = backup_count THEN
      RAISE NOTICE '✅ BACKUP VERIFIED: dino_high_scores (%s rows)', original_count;
    ELSE
      RAISE EXCEPTION '❌ BACKUP FAILED: Row count mismatch (original: %, backup: %)', original_count, backup_count;
    END IF;
  ELSE
    RAISE NOTICE 'ℹ️ Original table does not exist, skipping verification';
  END IF;
END $$;

-- ========================================
-- 4. Export backup metadata
-- ========================================

-- Create backup log table
CREATE TABLE IF NOT EXISTS backup_20251029.backup_log (
  backup_date TIMESTAMPTZ DEFAULT now(),
  table_name TEXT NOT NULL,
  row_count INTEGER NOT NULL,
  backup_size_bytes BIGINT,
  notes TEXT
);

-- Insert backup metadata
INSERT INTO backup_20251029.backup_log (table_name, row_count, backup_size_bytes, notes)
SELECT
  'dino_high_scores',
  COUNT(*),
  pg_total_relation_size('backup_20251029.dino_high_scores'),
  'Backup before cleanup - test/demo data'
FROM backup_20251029.dino_high_scores;

-- ========================================
-- 5. Display backup summary
-- ========================================

DO $$
DECLARE
  backup_summary TEXT;
BEGIN
  SELECT INTO backup_summary
    format(
      E'\n========================================\n' ||
      'BACKUP SUMMARY\n' ||
      '========================================\n' ||
      'Backup Schema: backup_20251029\n' ||
      'Backup Date: %s\n' ||
      'Tables Backed Up: %s\n' ||
      'Total Rows: %s\n' ||
      'Total Size: %s\n' ||
      '========================================\n' ||
      'Retention: Keep for 30 days\n' ||
      'Restore Command: See restore instructions below\n' ||
      '========================================',
      now()::TEXT,
      (SELECT COUNT(DISTINCT table_name) FROM information_schema.tables WHERE table_schema = 'backup_20251029'),
      (SELECT SUM(row_count) FROM backup_20251029.backup_log),
      pg_size_pretty((SELECT SUM(backup_size_bytes) FROM backup_20251029.backup_log))
    );

  RAISE NOTICE '%', backup_summary;
END $$;

-- ========================================
-- 6. Restore instructions (for reference)
-- ========================================

-- To restore dino_high_scores table:
--
-- 1. Verify backup exists:
--    SELECT * FROM backup_20251029.backup_log;
--
-- 2. Restore table:
--    CREATE TABLE public.dino_high_scores AS
--    SELECT * FROM backup_20251029.dino_high_scores;
--
-- 3. Verify restoration:
--    SELECT COUNT(*) FROM public.dino_high_scores;
--
-- 4. Recreate indexes (if any):
--    -- (No indexes documented for this table)

COMMENT ON SCHEMA backup_20251029 IS
  'Backup created 2025-10-29. Contains: dino_high_scores (test data). ' ||
  'Retention: 30 days. Restore with: CREATE TABLE public.dino_high_scores AS SELECT * FROM backup_20251029.dino_high_scores;';

-- ========================================
-- BACKUP COMPLETE
-- ========================================

-- ✅ Backup completed successfully
-- ⏭️  Next step: Review backup, then run cleanup-obsolete-tables.sql
-- ⚠️  DO NOT delete backup schema for at least 30 days
-- 📋 Retention Policy: Keep backup_20251029 schema until 2025-11-28
