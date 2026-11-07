# Tab Volume

A Chrome extension that sets the volume of individual tabs from 0% to 400%.

## Install (unpacked)

1. Download this repo as a ZIP (Code → Download ZIP) and unzip it.
2. Open `chrome://extensions` and enable **Developer mode**.
3. Click **Load unpacked** and select the unzipped folder.
4. Play audio in a tab, click the extension icon, and move the slider.

## How it works

Chrome has no per-tab volume API, so the extension captures the tab's audio with
`chrome.tabCapture`, runs it through a Web Audio `GainNode` in an offscreen document,
and plays it back at the chosen level.

## Limitations

- A tab is only adjustable after you first use the slider on it.
- DRM-protected audio may not be capturable.
- Chrome shows its "tab is being captured" indicator on adjusted tabs.
