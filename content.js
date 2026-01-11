if (!document.getElementById("widgetIcon")) {

  // Create draggable icon
  const icon = document.createElement("div");
  icon.id = "widgetIcon";
  icon.innerText = "⏱";
  document.body.appendChild(icon);

  // Create full widget (hidden by default)
  const widget = document.createElement("div");
  widget.id = "productivityWidget";
  widget.innerHTML = `
    <div id="widgetHeader">
      <span id="widgetTitle">Productivity</span>
      <button id="closeWidget">×</button>
    </div>
    <p><b>Active Time:</b> <span id="activeTime">00:00</span></p>
    <p><b>Screenshots:</b> <span id="ssCount">0</span></p>
    <button id="toggleSS">Pause Screenshots</button>
    <div id="translationBox"></div>
  `;
  document.body.appendChild(widget);

  let isExpanded = false;
  widget.style.display = "none";

  // Toggle widget on icon click
  icon.addEventListener("click", () => {
    isExpanded = !isExpanded;
    widget.style.display = isExpanded ? "block" : "none";
  });

  // Close button
  document.getElementById("closeWidget").onclick = () => {
    isExpanded = false;
    widget.style.display = "none";
  };

  // Drag functionality
  function dragElement(el) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    el.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      el.style.top = (el.offsetTop - pos2) + "px";
      el.style.left = (el.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  dragElement(icon);
  dragElement(widget);

  // Timer and screenshots
  let totalSeconds = 0;
  let screenshotCount = 0;
  let screenshotsEnabled = true;

  // Restore state from storage
  chrome.storage.local.get(["totalSeconds", "screenshotCount", "screenshotsEnabled"], (res) => {
    totalSeconds = res.totalSeconds || 0;
    screenshotCount = res.screenshotCount || 0;
    screenshotsEnabled = res.screenshotsEnabled ?? true;
  });

  // Active timer updates every second
  setInterval(() => {
    totalSeconds++;
    if (totalSeconds >= 43200) totalSeconds = 0; // reset after 12 hours
    chrome.storage.local.set({ totalSeconds });
    document.getElementById("activeTime").innerText = formatMMSS(totalSeconds);
    document.getElementById("ssCount").innerText = screenshotCount;
    document.getElementById("toggleSS").innerText = screenshotsEnabled ? "Pause Screenshots" : "Resume Screenshots";
  }, 1000);

  // Screenshot every 10 minutes
  setInterval(() => {
    if (screenshotsEnabled && totalSeconds % 600 === 0) {
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        if (!tabs || !tabs[0]) return;
        chrome.tabs.captureVisibleTab(tabs[0].windowId, { format: "png" }, (dataUrl) => {
          if (!dataUrl) return;
          screenshotCount++;
          chrome.storage.local.set({ screenshotCount });
          chrome.downloads.download({
            url: dataUrl,
            filename: `screenshots/ss_${Date.now()}.png`,
            saveAs: false
          });
        });
      });
    }
  }, 1000);

  // Toggle screenshots
  document.getElementById("toggleSS").onclick = () => {
    screenshotsEnabled = !screenshotsEnabled;
  };

  // Format seconds to MM:SS
  function formatMMSS(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  // Auto-translate selected text (supports Hinglish + Indian languages)
  document.addEventListener("mouseup", async () => {
    const selected = window.getSelection().toString().trim();
    if (!selected) return;
    const box = document.getElementById("translationBox");
    box.innerText = "Translating…";

    try {
      const encoded = encodeURIComponent(selected);
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encoded}`;
      const res = await fetch(url);
      const data = await res.json();
      box.innerText = data[0]?.[0]?.[0] || "Translation failed";
    } catch {
      box.innerText = "Translation error";
    }
  });
}
