// tabId -> volume (0..4). Lost if the service worker restarts; offscreen doc keeps the real state.
const volumes = new Map();

async function ensureOffscreen() {
  if (await chrome.offscreen.hasDocument()) return;
  await chrome.offscreen.createDocument({
    url: "offscreen.html",
    reasons: ["USER_MEDIA"],
    justification: "Process captured tab audio to change its volume."
  });
}

function setBadge(tabId, volume) {
  const pct = Math.round(volume * 100);
  chrome.action.setBadgeText({ tabId, text: pct === 100 ? "" : String(pct) });
}

async function setVolume(tabId, volume) {
  await ensureOffscreen();
  if (!volumes.has(tabId)) {
    const streamId = await chrome.tabCapture.getMediaStreamId({ targetTabId: tabId });
    await chrome.runtime.sendMessage({ target: "offscreen", type: "start", tabId, streamId });
  }
  volumes.set(tabId, volume);
  await chrome.runtime.sendMessage({ target: "offscreen", type: "volume", tabId, volume });
  setBadge(tabId, volume);
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.target !== "background") return;
  if (msg.type === "get") {
    sendResponse({ volume: volumes.get(msg.tabId) ?? 1 });
    return;
  }
  if (msg.type === "set") {
    setVolume(msg.tabId, msg.volume)
      .then(() => sendResponse({ ok: true }))
      .catch((e) => sendResponse({ ok: false, error: String(e) }));
    return true; // async response
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  if (!volumes.has(tabId)) return;
  volumes.delete(tabId);
  chrome.runtime.sendMessage({ target: "offscreen", type: "stop", tabId }).catch(() => {});
});
