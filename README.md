# Crypto Casino Data

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Platforms](https://img.shields.io/badge/Platforms-17-blue.svg)](data/platforms.json)
[![Countries](https://img.shields.io/badge/Countries-20-orange.svg)](data/countries.json)
[![Last Updated](https://img.shields.io/badge/Updated-April_2026-brightgreen.svg)](#changelog)

An open, structured dataset of cryptocurrency casinos and sportsbooks. Covers platform features, supported cryptocurrencies, bonus information, game availability, and country-level regulatory status.

Built for developers, researchers, and analysts who need reliable crypto gambling data without scraping.

## Data Files

| File | Description | Records |
|------|-------------|---------|
| [`platforms.json`](data/platforms.json) | Core platform data (ratings, features, licenses) | 17 |
| [`bonuses.json`](data/bonuses.json) | Current bonus offers and wagering requirements | 17 |
| [`supported-cryptos.json`](data/supported-cryptos.json) | Cryptocurrencies accepted per platform | 17 |
| [`countries.json`](data/countries.json) | Legal status and platform availability by country | 20 |
| [`games.json`](data/games.json) | Game type availability across platforms | 8 |

## Quick Start

### JavaScript / Node.js

```javascript
const platforms = require('./data/platforms.json');

// Find platforms with provably fair games
const provablyFair = platforms.filter(p => p.features.provably_fair);
console.log(`${provablyFair.length} platforms support provably fair games`);

// Top-rated platforms
const top = platforms.sort((a, b) => b.rating - a.rating).slice(0, 5);
top.forEach(p => console.log(`${p.name}: ${p.rating}/10`));
```

### Python

```python
import json

with open('data/platforms.json') as f:
    platforms = json.load(f)

# Platforms supporting Ethereum
eth_platforms = [p for p in platforms if 'ETH' in p['supported_cryptos']]
print(f"{len(eth_platforms)} platforms accept ETH")

# Average rating
avg = sum(p['rating'] for p in platforms) / len(platforms)
print(f"Average rating: {avg:.1f}/10")
```

### Fetch from GitHub (no install)

```javascript
const res = await fetch(
  'https://raw.githubusercontent.com/mkleo2731/crypto-casino-data/main/data/platforms.json'
);
const platforms = await res.json();
```

## Schema

Platform entries follow a strict JSON Schema defined in [`schema/platform.schema.json`](schema/platform.schema.json).

**Key fields:**

```
id                 Unique slug (e.g., "stake", "bc-game")
name               Display name
url                Platform URL
founded_year       Year established
license            Licensing jurisdiction
rating             0-10 score
categories         ["casino", "sports", "esports", "originals", ...]
supported_cryptos  ["BTC", "ETH", "USDT", ...]
features           { provably_fair, kyc_required, vpn_friendly, live_dealer, mobile_app }
min_deposit        Minimum deposit (e.g., "0.0001 BTC")
withdrawal_speed   Typical withdrawal time
pros / cons        Notable advantages and disadvantages
```

## Validation

```bash
node scripts/validate.js
```

Checks all data files for structural correctness, required fields, ID uniqueness, valid ranges, and cross-file consistency.

## Data Sources

Platform data is compiled from public sources: official platform websites, license registries, and community reports. Ratings reflect a composite of game variety, security features, withdrawal speed, crypto support breadth, and user experience.

Live data, full reviews, and country-specific guides:

- [CoinBetPro.com](https://coinbetpro.com) — Global crypto prediction markets & casino reviews
- [BTCGamblePro.com](https://btcgamblepro.com) — Bitcoin gambling guide for Nigeria
- [BTCBettingGuide.com](https://btcbettingguide.com) — Crypto betting guide for Brazil
- [BitcoinBetPro.com](https://bitcoinbetpro.com) — Bitcoin sports betting for India
- [CryptoSlotsPro.com](https://cryptoslotspro.com) — Crypto slots & casino guide for Vietnam

## Contributing

We welcome contributions! Here's how:

1. **Add a platform** -- Submit a PR adding an entry to `data/platforms.json` following the schema. Include the corresponding entries in `bonuses.json` and `supported-cryptos.json`.
2. **Update data** -- If a platform changes its bonus, supported cryptos, or features, submit a correction PR.
3. **Add a country** -- Add regulatory data to `data/countries.json` with a source link.
4. **Report an error** -- Open an issue describing the inaccuracy with evidence.

Before submitting, run `node scripts/validate.js` to ensure your changes pass validation.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for release history.

## License

[MIT](LICENSE) -- free to use in commercial and non-commercial projects. Attribution appreciated but not required.
