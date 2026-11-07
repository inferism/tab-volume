# Tab Volume

A Chrome extension that lets you set the volume of each tab separately, from 0% to 400%. Chrome only gives you mute and unmute, so this fills the gap.

## Features

- Per-tab volume slider from 0% to 400%
- Quick presets: 50%, 100%, 200%, 400%
- One-click mute and unmute that remembers your previous level
- Volume shown on the extension icon badge
- Follows your light or dark theme

## Install

You need Google Chrome (version 116 or newer). The extension isn't on the Chrome Web Store, so you load it manually:

1. Download this repo: click **Code → Download ZIP** on GitHub, then unzip it.
   Or clone it:
   ```bash
   git clone https://github.com/inferism/tab-volume.git
   ```
2. Open `chrome://extensions` in Chrome.
3. Turn on **Developer mode** (top right).
4. Click **Load unpacked** and select the `tab-volume` folder (the one containing `manifest.json`).
5. Optional: click the puzzle-piece icon in the toolbar and pin **Tab Volume**.

## How to use

1. Open a tab that is playing audio.
2. Click the **Tab Volume** icon in the toolbar.
3. Drag the slider, or tap a preset, to change that tab's volume.
4. Use the speaker button to mute or unmute.

Each tab keeps its own volume. When you close a tab, its setting is cleared.

## Updating

If you downloaded a ZIP, download it again and replace the old folder. If you cloned the repo, run `git pull`. Then click the refresh icon on the extension's card at `chrome://extensions`.

## How it works

Chrome has no per-tab volume API. The extension captures the tab's audio with `chrome.tabCapture`, runs it through a Web Audio gain node in an offscreen document, and plays it back at the level you chose.

## Limitations

- A tab is only adjustable after you first use the slider on it.
- Volume above 100% can distort loud audio.
- Chrome pages (`chrome://...`) and some DRM-protected audio can't be captured.
- Chrome shows its "tab is being captured" indicator on adjusted tabs.
- Settings reset when you restart Chrome.

## Project structure

| File | Purpose |
| --- | --- |
| `manifest.json` | Extension configuration (Manifest V3) |
| `background.js` | Service worker: starts capture, tracks volumes, updates the badge |
| `offscreen.html` / `offscreen.js` | Audio processing with Web Audio |
| `popup.html` / `popup.css` / `popup.js` | The popup interface |
| `icons/` | Extension icons |

## License

Add a license here if you plan to share this publicly, such as MIT.
