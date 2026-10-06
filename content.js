let handle = null;

function schedule(seconds) {
  clearTimeout(handle);
  handle = setTimeout(() => chrome.runtime.sendMessage({ type: "tick" }), seconds * 1000);
}

chrome.runtime.onMessage.addListener((msg, _s, sendResponse) => {
  if (msg.type === "schedule") schedule(msg.seconds);
  if (msg.type === "stop") clearTimeout(handle);
  sendResponse({ ok: true });
});

// Al cargar la página, comprobar si esta pestaña tiene un temporizador activo
chrome.runtime.sendMessage({ type: "hello" }, (res) => {
  if (chrome.runtime.lastError) return;
  if (res && res.seconds) schedule(res.seconds);
});
