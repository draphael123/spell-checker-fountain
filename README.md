# ✨ Fountain Spell Checker

A Chrome extension that helps you learn correct spelling by making you retype misspelled words. Unlike autocorrect, Fountain uses active recall to build lasting muscle memory.

## Features

- 🌐 **Works Everywhere** - Detects text fields on any website (input, textarea, contenteditable)
- ⚡ **Real-Time Detection** - Catches misspellings as you type
- 🧠 **Active Learning** - Forces you to delete and retype words correctly
- 📊 **Track Progress** - Detailed statistics and 30-day activity charts
- 📥 **Export Data** - Download your spelling history as JSON

## Installation

### Method 1: Chrome Web Store (Recommended)
*Coming soon*

### Method 2: Developer Mode

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions`
3. Enable **Developer mode** (toggle in top right)
4. Click **Load unpacked**
5. Select the extension folder
6. Start typing on any website!

## Files

```
Fountain-Spell-Checker/
├── manifest.json       # Extension configuration (MV3)
├── content.js          # Main spell-checking logic + dictionary
├── content.css         # Popup styling
├── background.js       # Service worker for storage
├── popup.html/css/js   # Toolbar popup
├── dashboard.html/css/js # Full stats dashboard
├── landing.html        # Marketing/info page
└── icons/              # Extension icons (16, 48, 128px)
```

## How It Works

1. **Type Naturally** - The extension monitors text fields silently
2. **Get Notified** - A popup appears when you misspell a word
3. **Retype Correctly** - Delete the word and type it correctly
4. **Track & Improve** - Visit the dashboard to see your progress

## Data Storage

All data is stored locally using Chrome's `storage.local` API:

```javascript
{
  misspellings: {
    "word": {
      word: "misspeled",
      correct: "misspelled",
      count: 5,
      correctedCount: 4,
      firstSeen: timestamp,
      lastSeen: timestamp
    }
  },
  stats: {
    totalMisspellings: 0,
    totalCorrected: 0,
    weeklyData: {
      "2024-01-15": { misspellings: 3, corrections: 2 }
    }
  }
}
```

## Dictionary

The extension includes 200+ common misspellings covering:
- Commonly confused words (their/there, your/you're)
- Double letter errors (accommodate, committee)
- Silent letters (Wednesday, February)
- ie/ei confusion (receive, believe)
- Common typos (teh → the, becuase → because)

## Privacy

- ✅ All data stays on your device
- ✅ No external API calls
- ✅ No tracking or analytics
- ✅ Open source

## Tech Stack

- **Manifest V3** - Latest Chrome extension standard
- **Vanilla JavaScript** - No frameworks, fast and lightweight
- **Chrome Storage API** - Local persistence
- **CSS Animations** - Smooth, native animations
- **Canvas API** - Chart rendering

## License

MIT License - Free for personal and commercial use.

---

Made with ✨ by Fountain

