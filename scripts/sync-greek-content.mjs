#!/usr/bin/env node

/**
 * Backward-compatible Greek importer entrypoint.
 * The implementation lives in the mythology-agnostic structured importer.
 */
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('./sync-structured-content.mjs', import.meta.url));
const result = spawnSync(process.execPath, [script, '--mythology=greek', ...process.argv.slice(2)], { stdio: 'inherit' });
process.exit(result.status ?? 1);
