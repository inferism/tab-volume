// tabId -> { ctx, gain, stream }
const sessions = new Map();

async function start(tabId, streamId) {
  if (sessions.has(tabId)) return;
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      mandatory: { chromeMediaSource: "tab", chromeMediaSourceId: streamId }
    }
  });
  const ctx = new AudioContext();
  const source = ctx.createMediaStreamSource(stream);
  const gain = ctx.createGain();
  source.connect(gain).connect(ctx.destination); // capture mutes the tab; this plays it back
  sessions.set(tabId, { ctx, gain, stream });
}

function stop(tabId) {
  const s = sessions.get(tabId);
  if (!s) return;
  s.stream.getTracks().forEach((t) => t.stop());
  s.ctx.close();
  sessions.delete(tabId);
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.target !== "offscreen") return;
  if (msg.type === "start") {
    start(msg.tabId, msg.streamId).then(() => sendResponse({ ok: true }));
    return true;
  }
  if (msg.type === "volume") {
    const s = sessions.get(msg.tabId);
    if (s) s.gain.gain.value = msg.volume;
    sendResponse({ ok: !!s });
    return;
  }
  if (msg.type === "stop") {
    stop(msg.tabId);
  }
});
