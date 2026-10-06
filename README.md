# Auto-Full-Refresher
[VIBECODED]
Made this extension for myself

*Need to refresh a website a couple of dozens of times? Well look no further!*
This is a chromium-based browser extension which refresh a website using no stored cache and in a specified time interval. You can browse other websites while this add-on is functioning.

## Installation

1. Download or clone this repository.
2. Open `chrome://extensions` (or `brave://extensions` in Brave).
3. Turn on **Developer mode** (top right).
4. Click **Load unpacked**.
5. Select the folder that contains `manifest.json`.
6. (Optional) Pin the extension icon to your toolbar.

## Usage

1. Open the tab you want to refresh.
2. Click the extension icon.
3. Enter the interval and choose seconds, minutes or hours.
4. Click **Start**. The icon shows an "ON" badge on that tab.
5. Click **Stop** (or close the tab) to disable it.

## Notes

- Each tab has its own independent timer.
- Minimum interval: 1 second.
- If you start the timer on a tab that was open before installing the extension, the page reloads once to activate it.
- It does not work on internal pages (`chrome://`, `brave://`), the Chrome Web Store, or the PDF viewer.

[instructions also vibecoded]
