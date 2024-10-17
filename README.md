# The Dove: Website Blocker, Goal Setting, & Pomodoro
A Chrome plugin that helps you create peaceful breaks between productive study sessions. 
The Dove gives you verses or encouraging statements on your current tab. It blocks websites depending on the rest/work pomodoro interval, with a built in to-do list! It's your life balance helper.

### Features:
- **Interactive Dove**: On your active tab, the dove will fly down and talk to you with bible verses or maybe a question (you will also be able to reply). If you want the dove to fly away, simply double click it! If you want the dove to never fly down, you can change this in the settings too.
- **Website Blocker**: Automatically blocks distracting websites during your work sessions and reopens access during rest periods.
- **Pomodoro Timer**: Set your work/rest cycles, and let the timer guide you through productive intervals and breaks.
- **Encouraging Messages**: Receive verses or uplifting statements on your current tab to motivate and inspire during your sessions.
- **To-Do List**: Stay on top of your tasks with a built-in to-do list that helps you prioritize and manage your goals.
- **Strict Mode**: Set how much you want to get tempted by removing 'stop timer' buttons, removing 'unblock website' buttons, and more!
- **Notifications**: Desktop notifications inform users when it's time to switch between work and rest modes.

### How It Works:
1. **Start a Pomodoro Session**: Input the number of cycles and duration for both work and rest sessions.
2. **Website Blocking**: During work periods, the extension blocks access to websites you choose. When a rest period begins, these sites will be accessible again (while your sites on the rest mode will be blocked).
3. **Visual Timers and Reminders**: Keep track of your session with a countdown timer visible on the Chrome toolbar icon.
4. **Cycle Skipping**: Need to skip a cycle? Simply click "Skip Cycle" from the popup to jump to the next phase, whether it’s a work or rest session. Unless you've turned this off in the settings' Strict Mode!


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
- `chrome.notifications`
- `chrome.storage.sync`
- `chrome.action`

If you want to modify or contribute to this project, follow these steps:

1. Clone the repository and make changes to the `background.js`, `content-script.js`, or `popup.js` files as needed.
2. After making changes, reload the extension in the Chrome **Extensions** page by clicking the **Reload** button.

### Key Files
- **`background.js`**: Manages the timer logic, alarms, blocking, and notifications.
- **`content-script.js`**: The script which gets injected into the current active tab, has all the information on the dove flying down and the quotes it produces.
- **`popup.js`**: All things in the popup extension - it handles the settings, the user input and communicates with `background.js` for the pomodoro timer and blocking sites.

## Author Notes
Thank you to MDDN390 at Victoria Univerisity of Wellington for giving me the time to create an awesome extension. Thanks to all the user testers, your feedback has helped me greatly!

Feel free to add a review on the Chrome Web Store if you have enjoyed this extension.


By Arianna Mulligan
