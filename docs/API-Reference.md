# API Reference

## Data Schema

### Platform Profile (`platforms.json`)

```json
{
  "id": "platform_abc",
  "name": "Platform ABC",
  "url": "https://example.com",
  "launch_year": 2020,
  "license": "Curacao",
  "supported_coins": ["BTC", "ETH", "USDT", "SOL"],
  "provably_fair": true,
  "min_deposit": {
    "BTC": 0.0001,
    "ETH": 0.01
  },
  "withdrawal_fee": {
    "BTC": 0.0005,
    "ETH": 0.005
  },
  "categories": ["sportsbook", "casino", "dice"],
  "last_verified": "2026-04-15"
}
```

### House Edge Data (`house-edges.json`)

```json
{
  "platform": "platform_abc",
  "games": {
    "blackjack": { "house_edge": 0.5, "variants": ["classic", "multi-hand"] },
    "roulette": { "house_edge": 2.7, "variants": ["european"] },
    "slots": { "house_edge_range": [2.0, 8.0], "rtp_range": [92, 98] },
    "dice": { "house_edge": 1.0 }
  },
  "source": "platform_documentation",
  "verified_date": "2026-04-15"
}
```

### Regional Availability (`regional.json`)

```json
{
  "platform": "platform_abc",
  "countries": ["NG", "BR", "IN", "VN", "US"],
  "restricted_countries": ["GB", "AU"],
  "kyc_required": false,
  "fiat_onramp": ["card", "bank_transfer"],
  "local_currency_support": ["NGN", "BRL", "INR"]
}
```

## Query Patterns

### Cross-Reference: Provably Fair + Low House Edge

```python
import json

with open('data/platforms.json') as f:
    platforms = {p['id']: p for p in json.load(f)}

with open('data/house-edges.json') as f:
    edges = json.load(f)

fair_and_low = [
    e for e in edges
    if platforms.get(e['platform'], {}).get('provably_fair')
    and e['games'].get('dice', {}).get('house_edge', 99) <= 1.0
]

for item in fair_and_low:
    name = platforms[item['platform']]['name']
    edge = item['games']['dice']['house_edge']
    print(f"{name}: {edge}% house edge (provably fair)")
```

To verify provably fair claims independently, use the [provably-fair-verifier](https://github.com/mkleo2731/provably-fair-verifier) tool.

### Regional Market Analysis

```python
from collections import Counter

with open('data/regional.json') as f:
    regional = json.load(f)

country_counts = Counter()
for r in regional:
    for c in r['countries']:
        country_counts[c] += 1

print("Top markets by platform availability:")
for country, count in country_counts.most_common(10):
    print(f"  {country}: {count} platforms")
```

For curated platform guides by region, visit:

- [CoinBetPro](https://coinbetpro.com) — Global coverage of crypto prediction markets
- [BitcoinBetPro](https://bitcoinbetpro.com) — India-focused Bitcoin sports betting
- [BtcGamblePro](https://btcgamblepro.com) — Nigeria-focused Bitcoin gambling
- [BtcBettingGuide](https://btcbettingguide.com) — Brazil-focused crypto betting
- [CryptoSlotsPro](https://cryptoslotspro.com) — Vietnam-focused crypto slot platforms
