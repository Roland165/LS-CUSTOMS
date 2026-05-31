// =============================================================================
// DATA SOURCE CONFIGURATION — single toggle for the whole server
// =============================================================================
//
// USE_DB=true  (default) -> MySQL database
//   - Requires a running MySQL instance
//   - Run back-end/lscustoms_create.sql  then  back-end/lscustoms_insert.sql
//   - Set DB_HOST / DB_USER / DB_PASS / DB_DATABASE in your .env
//
// USE_DB=false -> static JSON files  (no database needed, fully read-only)
//   - Perfect for Vercel / serverless deploys with no free DB tier
//   - Data lives in webapp_serverside/data/*.json
//   - Admin write operations (add / edit / delete) return HTTP 503
//   - Auth works with plain-text demo passwords (see data/users.json)
//
// =============================================================================

const USE_DB = process.env.USE_DB !== 'false';

if (!USE_DB) {
    console.log('[config] JSON mode (USE_DB=false) -- read-only static data, no database needed.');
} else {
    console.log('[config] DB mode  (USE_DB=true)  -- MySQL required.');
}

module.exports = { USE_DB };
