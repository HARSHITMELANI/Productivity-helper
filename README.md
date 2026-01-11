Productivity Helper Chrome Extension – Project Documentation
1. Project Overview

The Productivity Helper is a Chrome extension designed to enhance productivity by monitoring active browsing time, automatically taking screenshots, and providing real-time translation of selected text. The extension features a messenger-style floating widget that is draggable anywhere on the screen, ensuring minimal disruption to user workflow.

2. Key Features
2.1 Active Time Tracker

Tracks active browsing time in MM:SS format.

Timer resets after 12 hours to prevent overflow.

Updates every second to provide a live view of time spent on active tabs.

2.2 Automatic Screenshots

Takes screenshots every 10 minutes.

Screenshots can be paused or resumed via a toggle button in the widget.

Downloads are saved automatically to the local system.

2.3 Messenger-style Floating Widget

Draggable anywhere on the screen.

Collapsed mode: Only a small icon is visible.

Expanded mode: Clicking the icon opens the full widget showing active time, screenshots count, and translation box.

Stylish design with hover effects and smooth UI.

2.4 Auto-Translation of Selected Text

Supports all Indian languages, including Hindi, Marathi, Tamil, Telugu, Urdu, etc.

Also supports Hinglish (Romanized Hindi) and English text.

Translation occurs automatically when text is selected.

Uses Google Translate API for accurate and fast translation.

2.5 Pause/Resume Functionality

Screenshots can be paused and resumed.

Ensures that users have control over privacy and data collection.

3. User Scenarios
Scenario 1: Time Tracking

User opens Chrome and starts browsing.

Widget displays active time in MM:SS.

After 12 hours, timer resets automatically.

User can monitor productivity directly from the floating widget.

Scenario 2: Taking Screenshots

Every 10 minutes, a screenshot of the active tab is captured.

Screenshot count is displayed in the widget.

User can pause screenshots during private tasks.

Scenario 3: Auto-Translation

User selects text in any language (native or Romanized).

Widget translates the text automatically into English.

Translation appears in the floating translation box without leaving the page.

Scenario 4: Draggable Widget

User drags the widget to any position on the screen.

Widget can remain collapsed (icon only) to minimize distraction.

Clicking the icon expands the widget to access full features.

4. Technical Implementation
4.1 Manifest File

Defines permissions: storage, tabs, downloads, alarms, activeTab.

Includes background service worker, content scripts, and icons.

4.2 Background Script

Maintains active time and screenshot schedule.

Handles chrome.alarms for periodic screenshots.

Communicates with content scripts via chrome.runtime.sendMessage.

4.3 Content Script

Renders the draggable messenger-style widget.

Updates active time and screenshot count in real-time.

Implements auto-translation using Google Translate API.

Handles toggle screenshot functionality.

4.4 Styling (CSS)

Modern UI design with gradient backgrounds and hover effects.

Collapsible icon with smooth transitions.

Translation box styled for readability.
