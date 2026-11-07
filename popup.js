const slider = document.getElementById("slider");
const label = document.getElementById("label");
const errorEl = document.getElementById("error");
let tabId;
let lastNonZero = 100;

function show(pct) {
  slider.value = pct;
  label.textContent = pct + "%";
}

async function apply(pct) {
  show(pct);
  if (pct > 0) lastNonZero = pct;
  const res = await chrome.runtime.sendMessage({
    target: "background", type: "set", tabId, volume: pct / 100
  });
  errorEl.textContent = res && !res.ok ? res.error : "";
}

slider.addEventListener("input", () => apply(Number(slider.value)));
document.getElementById("reset").addEventListener("click", () => apply(100));
document.getElementById("mute").addEventListener("click", () =>
  apply(Number(slider.value) === 0 ? lastNonZero : 0)
);

(async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  tabId = tab.id;
  const res = await chrome.runtime.sendMessage({ target: "background", type: "get", tabId });
  show(Math.round((res?.volume ?? 1) * 100));
})();
