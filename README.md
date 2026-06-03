# eBay Profit Calculator Chrome Extension

A free, open-source Chrome extension that helps eBay sellers and dropshippers instantly calculate net profit, ROI, and all associated fees on any eBay listing — without leaving the page.

## Features

- **Real-time profit calculation** directly in the browser popup
- **Auto-detects listing price and shipping** on eBay item pages via content script overlay
- **Accurate eBay fee rates** for all major categories (Most Items 13.25%, Clothing 15%, Collectibles 6.5%, etc.)
- **Payment processing fees** included (configurable)
- **ROI and profit margin** calculations
- **Draggable overlay widget** injected on eBay listing pages
- **Persistent storage** — remembers your last entered values
- **Auto-recalculates** as you type
- Works on `ebay.com/itm/*` and `ebay.com/sch/*`

## Why This Exists

Dropshippers and resellers on eBay often lose money because they don't account for all the fees eating into their margins:

- eBay final value fees (up to 15%)
- Payment processing fees (~3%)
- Shipping costs
- Item sourcing cost
- Sales tax

This tool makes it dead simple to know your exact profit **before** you list or purchase an item. Built by an active eBay seller who needed this daily.

## Installation

### From Chrome Web Store
*(Coming soon)*

### Manual Installation (Developer Mode)

1. Clone this repository:
   ```bash
   git clone https://github.com/Trilli222/Ebay_Profit_Calculator_Chrome_Extension.git
   ```
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **Developer mode** (top right toggle)
4. Click **Load unpacked**
5. Select the cloned repository folder
6. The extension icon will appear in your toolbar

## Usage

### Popup Calculator
1. Click the extension icon in your Chrome toolbar
2. Enter the **Sale Price**, **Item Cost**, and **Shipping Cost**
3. Select your **eBay Category** (determines fee %)
4. Click **Calculate Profit**
5. Instantly see your net profit, ROI, and margin

### Page Overlay (on eBay listings)
1. Navigate to any eBay item page (`ebay.com/itm/...`)
2. A floating **Profit Calculator** widget appears automatically
3. The sale price and shipping are pre-detected from the listing
4. Enter your item cost and click **Calculate**
5. Drag the widget anywhere on the page

## Supported Fee Categories

| Category | eBay Fee |
|---|---|
| Most Categories | 13.25% |
| Clothing & Accessories | 15.00% |
| Heavy Equipment | 9.15% |
| Musical Instruments | 8.65% |
| Select Collectibles | 6.50% |
| Custom | User-defined |

## File Structure

```
Ebay_Profit_Calculator_Chrome_Extension/
|-- manifest.json       # Chrome Extension Manifest v3
|-- popup.html          # Extension popup UI
|-- popup.js            # Popup calculation logic
|-- content.js          # Injected overlay on eBay pages
|-- styles.css          # Shared styles for popup and overlay
|-- icons/              # Extension icons
```

## Tech Stack

- **JavaScript** (ES6+) — no frameworks, no dependencies
- **HTML5 / CSS3**
- **Chrome Extension Manifest v3**
- **Chrome Storage API** for persistence

## Roadmap

- [ ] Amazon sourcing price lookup integration
- [ ] Bulk profit calculator (CSV import)
- [ ] Historical profit tracking dashboard
- [ ] Support for eBay international sites
- [ ] Dark/light theme toggle
- [ ] Export results to spreadsheet

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License

MIT License — free to use, modify, and distribute.

## Author

Built and maintained by **Trilli222** — active eBay seller and dropshipper.

If this tool saves you money, consider starring the repo!
