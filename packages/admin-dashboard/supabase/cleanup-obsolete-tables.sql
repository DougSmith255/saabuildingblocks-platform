-- ========================================
-- CLEANUP SCRIPT: Remove Obsolete Tables
-- Generated: 2025-10-29
-- Purpose: Remove test/demo tables no longer needed
-- ========================================

-- ⚠️ CRITICAL WARNINGS:
-- 1. BACKUP MUST BE COMPLETED FIRST (run backup-before-cleanup.sql)
-- 2. This script is IRREVERSIBLE without backup
-- 3. TEST IN STAGING ENVIRONMENT FIRST
-- 4. Requires explicit user approval
-- 5. Monitor application during and after cleanup

-- ========================================
-- Pre-flight checks
-- ========================================

DO $$
BEGIN
  -- Check if backup schema exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.schemata
    WHERE schema_name = 'backup_20251029'
  ) THEN
    RAISE EXCEPTION '❌ SAFETY CHECK FAILED: Backup schema backup_20251029 does not exist. Run backup-before-cleanup.sql first!';
  END IF;

  -- Check if backup table exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'backup_20251029'
    AND table_name = 'dino_high_scores'
  ) THEN
    RAISE EXCEPTION '❌ SAFETY CHECK FAILED: Backup table backup_20251029.dino_high_scores does not exist. Run backup-before-cleanup.sql first!';
  END IF;

  RAISE NOTICE '✅ PRE-FLIGHT CHECK PASSED: Backup verified, proceeding with cleanup';
END $$;

-- ========================================
-- 1. Verify no foreign key dependencies
-- ========================================

DO $$
DECLARE
  fk_count INTEGER;
BEGIN
  -- Check for foreign keys referencing dino_high_scores
  SELECT COUNT(*) INTO fk_count
  FROM information_schema.table_constraints
  WHERE constraint_type = 'FOREIGN KEY'
  AND table_schema = 'public'
  AND table_name = 'dino_high_scores';

  IF fk_count > 0 THEN
    RAISE EXCEPTION '❌ SAFETY CHECK FAILED: dino_high_scores has % foreign key constraints. Cannot delete.', fk_count;
  END IF;

  -- Check for foreign keys targeting dino_high_scores
  SELECT COUNT(*) INTO fk_count
  FROM information_schema.constraint_column_usage
  WHERE table_schema = 'public'
  AND table_name = 'dino_high_scores';

  IF fk_count > 0 THEN
    RAISE EXCEPTION '❌ SAFETY CHECK FAILED: dino_high_scores is referenced by % foreign keys. Cannot delete.', fk_count;
  END IF;

  RAISE NOTICE '✅ DEPENDENCY CHECK PASSED: No foreign key dependencies found';
END $$;

-- ========================================
-- 2. Create cleanup log
-- ========================================

CREATE TABLE IF NOT EXISTS public.cleanup_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cleanup_date TIMESTAMPTZ DEFAULT now(),
  table_name TEXT NOT NULL,
  row_count_before INTEGER,
  table_size_before BIGINT,
  action TEXT NOT NULL CHECK (action IN ('deleted', 'skipped', 'error')),
  reason TEXT,
  error_message TEXT
);

COMMENT ON TABLE public.cleanup_log IS 'Audit log of database cleanup operations';

-- ========================================
-- 3. Begin transaction (ROLLBACK on error)
-- ========================================

BEGIN;

-- ========================================
-- 4. Delete obsolete tables
-- ========================================

-- Delete dino_high_scores (TEST DATA)
DO $$
DECLARE
  row_count INTEGER;
  table_size BIGINT;
BEGIN
  -- Check if table exists
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'dino_high_scores'
  ) THEN
    -- Capture metadata before deletion
    SELECT COUNT(*) INTO row_count FROM public.dino_high_scores;
    SELECT pg_total_relation_size('public.dino_high_scores') INTO table_size;

    -- Log cleanup action
    INSERT INTO public.cleanup_log (
      table_name,
      row_count_before,
      table_size_before,
      action,
      reason
    ) VALUES (
      'dino_high_scores',
      row_count,
      table_size,
      'deleted',
      'Test/demo data - not part of core business logic'
    );

    -- Drop table
    DROP TABLE public.dino_high_scores CASCADE;

    RAISE NOTICE '✅ DELETED: dino_high_scores (%s rows, %s)', row_count, pg_size_pretty(table_size);
  ELSE
    -- Log skip action
    INSERT INTO public.cleanup_log (
      table_name,
      row_count_before,
      table_size_before,
      action,
      reason
    ) VALUES (
      'dino_high_scores',
      0,
      0,
      'skipped',
      'Table does not exist (already deleted or never existed)'
    );

    RAISE NOTICE 'ℹ️  SKIPPED: dino_high_scores (table does not exist)';
  END IF;
END $$;

-- ========================================
-- 5. Verify cleanup
-- ========================================

DO $$
DECLARE
  tables_deleted INTEGER;
  total_space_freed BIGINT;
BEGIN
  -- Count deleted tables
  SELECT COUNT(*) INTO tables_deleted
  FROM public.cleanup_log
  WHERE cleanup_date >= now() - INTERVAL '1 minute'
  AND action = 'deleted';

  -- Calculate space freed
  SELECT COALESCE(SUM(table_size_before), 0) INTO total_space_freed
  FROM public.cleanup_log
  WHERE cleanup_date >= now() - INTERVAL '1 minute'
  AND action = 'deleted';

  RAISE NOTICE '========================================';
  RAISE NOTICE 'CLEANUP SUMMARY';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Tables Deleted: %', tables_deleted;
  RAISE NOTICE 'Space Freed: %', pg_size_pretty(total_space_freed);
  RAISE NOTICE '========================================';

  -- Verify expected table is gone
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'dino_high_scores'
  ) THEN
    RAISE EXCEPTION '❌ VERIFICATION FAILED: dino_high_scores still exists after deletion';
  END IF;

  RAISE NOTICE '✅ VERIFICATION PASSED: All obsolete tables removed';
END $$;

-- ========================================
-- 6. Commit transaction
-- ========================================

COMMIT;

-- ========================================
-- 7. Post-cleanup maintenance
-- ========================================

-- Vacuum to reclaim space
VACUUM ANALYZE;

RAISE NOTICE '✅ VACUUM COMPLETED: Space reclaimed';

-- ========================================
-- 8. Display final summary
-- ========================================

DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'CLEANUP COMPLETE';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Date: %', now();
  RAISE NOTICE 'Tables Deleted: %', (SELECT COUNT(*) FROM public.cleanup_log WHERE action = 'deleted');
  RAISE NOTICE 'Space Freed: %', (SELECT pg_size_pretty(SUM(table_size_before)) FROM public.cleanup_log WHERE action = 'deleted');
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Next Steps:';
  RAISE NOTICE '1. Monitor application logs for 24-48 hours';
  RAISE NOTICE '2. Verify all features working correctly';
  RAISE NOTICE '3. Check for any 500 errors or missing data';
  RAISE NOTICE '4. Keep backup schema for 30 days';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Backup Location: backup_20251029.dino_high_scores';
  RAISE NOTICE 'Retention: Until 2025-11-28';
  RAISE NOTICE '========================================';
END $$;

-- ========================================
-- 9. Cleanup log retention
-- ========================================

-- Add cleanup log retention policy (keep for 90 days)
COMMENT ON TABLE public.cleanup_log IS
  'Audit log of database cleanup operations. ' ||
  'Retention: 90 days. ' ||
  'Created: 2025-10-29. ' ||
  'Contains records of deleted tables: dino_high_scores (test data).';

-- ========================================
-- CLEANUP COMPLETE
-- ========================================

-- ✅ Cleanup completed successfully
-- ⏭️  Next steps:
--    1. Monitor application logs
--    2. Verify features working
--    3. Check error rates
--    4. Keep backup for 30 days

-- ========================================
-- ROLLBACK INSTRUCTIONS (if needed)
-- ========================================

-- If something goes wrong, restore from backup:
--
-- 1. Check backup exists:
--    SELECT * FROM backup_20251029.backup_log;
--
-- 2. Restore table:
--    CREATE TABLE public.dino_high_scores AS
--    SELECT * FROM backup_20251029.dino_high_scores;
--
-- 3. Verify restoration:
--    SELECT COUNT(*) FROM public.dino_high_scores;
--
-- 4. Check application logs:
--    -- Monitor for errors related to dino_high_scores

-- ========================================
-- SAFETY REMINDERS
-- ========================================

-- ⚠️  DO NOT delete backup schema for 30 days
-- ⚠️  Monitor application health closely
-- ⚠️  Keep this script for audit trail
-- ⚠️  Document any issues in cleanup_log table
