# Getting Started

## Accessing the Dataset

### Clone the Repository

```bash
git clone https://github.com/mkleo2731/crypto-casino-data.git
cd crypto-casino-data
```

### Data Format

The dataset is stored in JSON format under the `data/` directory:

```
data/
  platforms.json       # Core platform profiles
  house-edges.json     # Game-specific house edge data
  regional.json        # Geographic availability matrix
  bonuses.json         # Welcome bonus and promotion data
```

## Quick Queries

### List All Platforms Supporting BTC

```python
import json

with open('data/platforms.json') as f:
    platforms = json.load(f)

btc_platforms = [p for p in platforms if 'BTC' in p['supported_coins']]
print(f"{len(btc_platforms)} platforms accept BTC")
for p in btc_platforms[:5]:
    print(f"  - {p['name']} ({p['license']})")
```

### Find Platforms Available in a Region

```python
with open('data/regional.json') as f:
    regional = json.load(f)

nigeria_platforms = [r for r in regional if 'NG' in r['countries']]
print(f"{len(nigeria_platforms)} platforms available in Nigeria")
```

For curated, region-specific platform guides:

- [BtcGamblePro](https://btcgamblepro.com) — Nigerian market with local payment guides
- [BitcoinBetPro](https://bitcoinbetpro.com) — Indian market platform reviews
- [BtcBettingGuide](https://btcbettingguide.com) — Brazilian crypto betting guide
- [CryptoSlotsPro](https://cryptoslotspro.com) — Vietnamese crypto casino reviews

### Compare House Edges

```python
with open('data/house-edges.json') as f:
    edges = json.load(f)

blackjack = sorted(
    [e for e in edges if 'blackjack' in e['games']],
    key=lambda x: x['games']['blackjack']['house_edge']
)

for p in blackjack[:5]:
    edge = p['games']['blackjack']['house_edge']
    print(f"  {p['platform']}: {edge}%")
```

## Data Freshness

The dataset is updated monthly. Each record includes a `last_verified` timestamp. For real-time platform data and live odds, see [CoinBetPro](https://coinbetpro.com).
