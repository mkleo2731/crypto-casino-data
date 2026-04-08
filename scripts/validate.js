#!/usr/bin/env node

/**
 * Validates all data files against expected structures.
 * Run: node scripts/validate.js
 */

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const SCHEMA_DIR = path.join(__dirname, "..", "schema");

let errors = 0;
let warnings = 0;

function log(level, file, msg) {
  const prefix = level === "error" ? "\x1b[31mERROR\x1b[0m" : "\x1b[33mWARN\x1b[0m";
  console.log(`  ${prefix} [${file}] ${msg}`);
  if (level === "error") errors++;
  else warnings++;
}

function loadJSON(filename) {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    log("error", filename, "File not found");
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (e) {
    log("error", filename, `Invalid JSON: ${e.message}`);
    return null;
  }
}

function loadSchema(filename) {
  const filePath = path.join(SCHEMA_DIR, filename);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

// ── platforms.json ──────────────────────────────────────────────
function validatePlatforms() {
  console.log("\n\x1b[1mValidating platforms.json\x1b[0m");
  const data = loadJSON("platforms.json");
  if (!data) return;

  if (!Array.isArray(data)) return log("error", "platforms.json", "Must be an array");
  console.log(`  Found ${data.length} platforms`);

  const schema = loadSchema("platform.schema.json");
  const required = schema ? schema.required : [
    "id", "name", "url", "founded_year", "license", "rating",
    "description", "categories", "supported_cryptos", "features",
    "min_deposit", "withdrawal_speed"
  ];

  const ids = new Set();
  for (const p of data) {
    // Required fields
    for (const field of required) {
      if (p[field] === undefined || p[field] === null) {
        log("error", "platforms.json", `Platform "${p.id || p.name || "?"}" missing required field: ${field}`);
      }
    }

    // ID uniqueness
    if (ids.has(p.id)) {
      log("error", "platforms.json", `Duplicate platform ID: ${p.id}`);
    }
    ids.add(p.id);

    // ID format
    if (p.id && !/^[a-z0-9-]+$/.test(p.id)) {
      log("error", "platforms.json", `Invalid ID format: "${p.id}" (must be lowercase alphanumeric + hyphens)`);
    }

    // Rating range
    if (typeof p.rating === "number" && (p.rating < 0 || p.rating > 10)) {
      log("error", "platforms.json", `Rating out of range for ${p.id}: ${p.rating}`);
    }

    // Founded year
    if (typeof p.founded_year === "number" && (p.founded_year < 2010 || p.founded_year > 2030)) {
      log("warn", "platforms.json", `Unusual founded_year for ${p.id}: ${p.founded_year}`);
    }

    // Cryptos should be uppercase
    if (Array.isArray(p.supported_cryptos)) {
      for (const c of p.supported_cryptos) {
        if (c !== c.toUpperCase()) {
          log("warn", "platforms.json", `Crypto ticker should be uppercase for ${p.id}: ${c}`);
        }
      }
    }

    // Features object
    if (p.features && typeof p.features === "object") {
      for (const key of ["provably_fair", "kyc_required", "vpn_friendly", "live_dealer", "mobile_app"]) {
        if (typeof p.features[key] !== "boolean") {
          log("error", "platforms.json", `Feature "${key}" must be boolean for ${p.id}`);
        }
      }
    }
  }
}

// ── bonuses.json ────────────────────────────────────────────────
function validateBonuses() {
  console.log("\n\x1b[1mValidating bonuses.json\x1b[0m");
  const data = loadJSON("bonuses.json");
  if (!data) return;

  if (!Array.isArray(data)) return log("error", "bonuses.json", "Must be an array");
  console.log(`  Found ${data.length} bonus entries`);

  const platforms = loadJSON("platforms.json");
  const platformIds = new Set((platforms || []).map((p) => p.id));

  for (const b of data) {
    if (!b.platform_id) log("error", "bonuses.json", "Missing platform_id");
    if (!b.bonus_type) log("error", "bonuses.json", `Missing bonus_type for ${b.platform_id}`);
    if (b.platform_id && !platformIds.has(b.platform_id)) {
      log("warn", "bonuses.json", `platform_id "${b.platform_id}" not found in platforms.json`);
    }
    if (typeof b.wagering_requirement !== "number") {
      log("error", "bonuses.json", `wagering_requirement must be a number for ${b.platform_id}`);
    }
  }
}

// ── supported-cryptos.json ──────────────────────────────────────
function validateCryptos() {
  console.log("\n\x1b[1mValidating supported-cryptos.json\x1b[0m");
  const data = loadJSON("supported-cryptos.json");
  if (!data) return;

  if (!Array.isArray(data)) return log("error", "supported-cryptos.json", "Must be an array");
  console.log(`  Found ${data.length} entries`);

  for (const entry of data) {
    if (!entry.platform_id) log("error", "supported-cryptos.json", "Missing platform_id");
    if (!Array.isArray(entry.cryptocurrencies) || entry.cryptocurrencies.length === 0) {
      log("error", "supported-cryptos.json", `Empty crypto list for ${entry.platform_id}`);
    }
    if (entry.count !== entry.cryptocurrencies?.length) {
      log("warn", "supported-cryptos.json", `Count mismatch for ${entry.platform_id}: count=${entry.count} vs actual=${entry.cryptocurrencies?.length}`);
    }
  }
}

// ── countries.json ──────────────────────────────────────────────
function validateCountries() {
  console.log("\n\x1b[1mValidating countries.json\x1b[0m");
  const data = loadJSON("countries.json");
  if (!data) return;

  if (!Array.isArray(data)) return log("error", "countries.json", "Must be an array");
  console.log(`  Found ${data.length} countries`);

  const validStatuses = ["regulated", "partially_regulated", "gray_area", "restricted", "unknown"];
  for (const c of data) {
    if (!c.country_code) log("error", "countries.json", "Missing country_code");
    if (!c.country_name) log("error", "countries.json", "Missing country_name");
    if (c.country_code && c.country_code.length !== 2) {
      log("warn", "countries.json", `country_code should be ISO 3166-1 alpha-2: ${c.country_code}`);
    }
    if (c.legal_status && !validStatuses.includes(c.legal_status)) {
      log("warn", "countries.json", `Unknown legal_status for ${c.country_code}: ${c.legal_status}`);
    }
  }
}

// ── games.json ──────────────────────────────────────────────────
function validateGames() {
  console.log("\n\x1b[1mValidating games.json\x1b[0m");
  const data = loadJSON("games.json");
  if (!data) return;

  if (!Array.isArray(data)) return log("error", "games.json", "Must be an array");
  console.log(`  Found ${data.length} game types`);

  const platforms = loadJSON("platforms.json");
  const platformIds = new Set((platforms || []).map((p) => p.id));

  for (const g of data) {
    if (!g.id) log("error", "games.json", "Missing game id");
    if (!g.name) log("error", "games.json", `Missing name for ${g.id}`);
    if (!Array.isArray(g.available_on)) {
      log("error", "games.json", `available_on must be an array for ${g.id}`);
    }
    if (g.platform_count !== g.available_on?.length) {
      log("warn", "games.json", `platform_count mismatch for ${g.id}`);
    }
    // Cross-reference: every platform_id in available_on must exist in platforms.json
    if (Array.isArray(g.available_on)) {
      for (const pid of g.available_on) {
        if (!platformIds.has(pid)) {
          log("error", "games.json", `Game "${g.id}" references unknown platform: ${pid}`);
        }
      }
    }
  }
}

// ── cross-file consistency ──────────────────────────────────────
function validateCrossReferences() {
  console.log("\n\x1b[1mValidating cross-file references\x1b[0m");
  const platforms = loadJSON("platforms.json");
  const bonuses = loadJSON("bonuses.json");
  const cryptos = loadJSON("supported-cryptos.json");
  const countries = loadJSON("countries.json");

  if (!platforms) return;
  const platformIds = new Set(platforms.map((p) => p.id));

  // bonuses.json platform_id references
  if (bonuses) {
    for (const b of bonuses) {
      if (b.platform_id && !platformIds.has(b.platform_id)) {
        log("error", "cross-ref", `bonuses.json references unknown platform: ${b.platform_id}`);
      }
    }
  }

  // supported-cryptos.json platform_id references
  if (cryptos) {
    for (const c of cryptos) {
      if (c.platform_id && !platformIds.has(c.platform_id)) {
        log("error", "cross-ref", `supported-cryptos.json references unknown platform: ${c.platform_id}`);
      }
    }
  }

  // countries.json recommended_platforms references
  if (countries) {
    for (const c of countries) {
      if (Array.isArray(c.recommended_platforms)) {
        for (const pid of c.recommended_platforms) {
          if (!platformIds.has(pid)) {
            log("error", "cross-ref", `countries.json ${c.country_code} references unknown platform: ${pid}`);
          }
        }
      }
    }
  }

  // Every platform in platforms.json should have a bonuses entry
  if (bonuses) {
    const bonusPlatforms = new Set(bonuses.map((b) => b.platform_id));
    for (const pid of platformIds) {
      if (!bonusPlatforms.has(pid)) {
        log("warn", "cross-ref", `Platform "${pid}" has no entry in bonuses.json`);
      }
    }
  }

  // Every platform in platforms.json should have a supported-cryptos entry
  if (cryptos) {
    const cryptoPlatforms = new Set(cryptos.map((c) => c.platform_id));
    for (const pid of platformIds) {
      if (!cryptoPlatforms.has(pid)) {
        log("warn", "cross-ref", `Platform "${pid}" has no entry in supported-cryptos.json`);
      }
    }
  }
}

// ── Run all ─────────────────────────────────────────────────────
console.log("\x1b[1m\x1b[36m=== Crypto Casino Data Validator ===\x1b[0m");

validatePlatforms();
validateBonuses();
validateCryptos();
validateCountries();
validateGames();
validateCrossReferences();

console.log("\n\x1b[1m=== Summary ===\x1b[0m");
console.log(`  Errors:   ${errors}`);
console.log(`  Warnings: ${warnings}`);

if (errors > 0) {
  console.log("\n\x1b[31mValidation FAILED\x1b[0m");
  process.exit(1);
} else {
  console.log("\n\x1b[32mValidation PASSED\x1b[0m");
  process.exit(0);
}
