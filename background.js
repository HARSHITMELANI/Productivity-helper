let totalSeconds = 0;
let screenshotCount = 0;
let screenshotsEnabled = true;

// Restore saved state
chrome.storage.local.get(["totalSeconds", "screenshotCount", "screenshotsEnabled"], (res) => {
  totalSeconds = res.totalSeconds || 0;
  screenshotCount = res.screenshotCount || 0;
  screenshotsEnabled = res.screenshotsEnabled ?? true;
});

// Active timer runs every second using setInterval in background
setInterval(() => {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    if (!tabs || !tabs[0]) return;
    totalSeconds++;
    chrome.storage.local.set({ totalSeconds });
  });
}, 1000);

// Screenshot every 10 minutes
chrome.alarms.create("screenshotTimer", { periodInMinutes: 10 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "screenshotTimer" && screenshotsEnabled) {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      if (!tabs || !tabs[0]) return;

      chrome.tabs.captureVisibleTab(
        tabs[0].windowId,
        { format: "png" },
        (dataUrl) => {
          if (!dataUrl) return;

          screenshotCount++;
          chrome.storage.local.set({ screenshotCount });

          chrome.downloads.download({
            url: dataUrl,
            filename: `screenshots/ss_${Date.now()}.png`,
            saveAs: false
          });
        }
      );
    });
  }
});

// Messages from content.js
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "GET_STATS") {
    sendResponse({ totalSeconds, screenshotCount, screenshotsEnabled });
  }

  if (msg.type === "TOGGLE_SCREENSHOTS") {
    screenshotsEnabled = !screenshotsEnabled;
    chrome.storage.local.set({ screenshotsEnabled });
    sendResponse({ screenshotsEnabled });
  }
});
