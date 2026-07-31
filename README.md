# The Dove: Bible Verses on Current Tab
The Dove is a Chrome plugin which gives you verses on your current tab.

### Features:
- **Interactive Dove**: On your active tab, the dove will fly down and talk to you with bible verses or maybe a question (you will also be able to reply). If you want the dove to fly away, simply double click it!
- **Encouraging Messages**: Receive verses on your current tab to motivate and inspire during your time on Chrome.

### How It Works:
1. 

## Contribute
If you want to edit, contribute, or make your own version of this Extension, here are the steps. Also, if you have an idea for adding something new, create an issue on the Github and I can see what I can do. You are also very welcome to make the feature yourself.

### Installation

1. Clone or download this repository:
   ```bash
   git clone https://github.com/arimulligan/the-dove.git
   ```

2. Open Chrome and go to the **Extensions** page:
   - Navigate to `chrome://extensions/`.
   - Enable **Developer mode** in the top right corner.

3. Click on **Load unpacked** and select the directory where the project is located.

4. The extension will be loaded into Chrome, and you should see its icon in the toolbar.

## Development
This project uses Chrome Extension V3 APIs, including:
- `chrome.runtime`
- `chrome.alarms`
- `chrome.storage.sync`

If you want to modify or contribute to this project, follow these steps:

1. Clone the repository and make changes to the `background.js`, `content-script.js`, or `popup.js` files as needed.
2. After making changes, reload the extension in the Chrome **Extensions** page by clicking the **Reload** button.

### Key Files
- **`background.js`**: Manages the timer logic according to when the dove should appear.
- **`content-script.js`**: The script which gets injected into the current active tab, has all the information on the dove flying down and the quotes it produces.
- **`popup.js`**: This is where the settings for the Dove and the bible verses are.

## Author Notes
Thank you to MDDN390 at Victoria Univerisity of Wellington for giving me the time to create an awesome extension. Thanks to all the user testers, your feedback has helped me greatly!

Feel free to add a review on the Chrome Web Store if you have enjoyed this extension.


By Arianna Mulligan
