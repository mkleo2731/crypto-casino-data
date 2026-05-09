# Frequently Asked Questions

## About the Dataset

### How often is the data updated?

The dataset is updated monthly. Each record has a `last_verified` field indicating when it was last confirmed accurate. Platform availability and bonus offers change frequently, so always check the `last_verified` date.

### How are house edges calculated?

House edge values are sourced from platform documentation, game rules pages, and independent audits where available. For provably fair games, house edges can be mathematically verified from the source code.

### Can I contribute data?

Yes. Open a pull request with updates to the relevant JSON file. Include a source link for any new data points. We verify all submissions before merging.

## Platform Data

### What makes a platform "provably fair"?

A provably fair platform uses cryptographic algorithms (typically HMAC-SHA256 or SHA-256) to generate game outcomes, and provides players with the ability to independently verify each result. Use [provably-fair-verifier](https://github.com/mkleo2731/provably-fair-verifier) to check claims.

### Why are some platforms restricted in certain countries?

Restrictions arise from licensing conditions, local regulations, or the platform's own risk assessment. The `regional.json` dataset tracks known restrictions but may not capture temporary blocks.

### Do you recommend specific platforms?

This dataset is informational — it does not endorse or recommend platforms. For editorial reviews and comparisons by region:

- [CoinBetPro](https://coinbetpro.com) — Global crypto prediction markets and platform comparison
- [BtcGamblePro](https://btcgamblepro.com) — Curated Nigerian market guides
- [BtcBettingGuide](https://btcbettingguide.com) — Brazilian crypto betting platform reviews
- [BitcoinBetPro](https://bitcoinbetpro.com) — Indian market coverage and analysis
- [CryptoSlotsPro](https://cryptoslotspro.com) — Vietnamese crypto slot and casino reviews

## Technical

### What format is the data in?

All data is stored in JSON files. The schema for each file is documented in the [API Reference](API-Reference.md).

### Can I use this data commercially?

Yes. The dataset is released under the MIT license. Attribution is appreciated but not required.

### How do I report incorrect data?

Open an issue on this repository with the platform name, the incorrect field, and the correct value with a source link.
