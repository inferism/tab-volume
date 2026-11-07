const slider = document.getElementById("slider");
const valueEl = document.getElementById("value");
const hintEl = document.getElementById("hint");
const muteBtn = document.getElementById("mute");
const presets = [...document.querySelectorAll(".presets button")];
let tabId;
let lastNonZero = 100;

function show(pct) {
  slider.value = pct;
  valueEl.textContent = pct;
  slider.style.setProperty("--r", pct / 400);
  slider.style.setProperty("--b", Math.min(pct, 100) / 400);
  document.body.classList.toggle("boosted", pct > 100);
  muteBtn.setAttribute("aria-pressed", String(pct === 0));
  muteBtn.setAttribute("aria-label", pct === 0 ? "Unmute this tab" : "Mute this tab");
  muteBtn.title = pct === 0 ? "Unmute" : "Mute";
  presets.forEach((b) => b.setAttribute("aria-pressed", String(Number(b.dataset.v) === pct)));
  setHint(pct > 100 ? "Above 100% can distort loud audio." : "");
}

function setHint(text, isError = false) {
  hintEl.textContent = text;
  hintEl.classList.toggle("error", isError);
}

async function apply(pct) {
  show(pct);
  if (pct > 0) lastNonZero = pct;
  const res = await chrome.runtime.sendMessage({
    target: "background", type: "set", tabId, volume: pct / 100
  });
  if (res && !res.ok) setHint("Can't adjust this tab. Chrome pages and some protected audio aren't supported.", true);
}

slider.addEventListener("input", () => apply(Number(slider.value)));
muteBtn.addEventListener("click", () => apply(Number(slider.value) === 0 ? lastNonZero : 0));
presets.forEach((b) => b.addEventListener("click", () => apply(Number(b.dataset.v))));

(async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  tabId = tab.id;
  document.getElementById("tab-title").textContent = tab.title || "This tab";
  if (tab.favIconUrl) {
    const icon = new Image(16, 16);
    icon.id = "favicon";
    icon.alt = "";
    icon.onload = () => document.querySelector("header").prepend(icon);
    icon.src = tab.favIconUrl;
  }
  const res = await chrome.runtime.sendMessage({ target: "background", type: "get", tabId });
  const pct = Math.round((res?.volume ?? 1) * 100);
  if (pct > 0) lastNonZero = pct;
  show(pct);
})();
