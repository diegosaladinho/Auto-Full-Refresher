const KEY = "timers"; // { [tabId]: { seconds, nextAt } }

const getTimers = async () => (await chrome.storage.session.get(KEY))[KEY] || {};
const setTimers = (t) => chrome.storage.session.set({ [KEY]: t });

function badge(tabId, on) {
  chrome.action.setBadgeText({ tabId, text: on ? "ON" : "" }).catch(() => {});
  if (on) chrome.action.setBadgeBackgroundColor({ tabId, color: "#2e7d32" }).catch(() => {});
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  (async () => {
    const timers = await getTimers();

    if (msg.type === "start") {
      timers[msg.tabId] = { seconds: msg.seconds, nextAt: Date.now() + msg.seconds * 1000 };
      await setTimers(timers);
      badge(msg.tabId, true);
      try {
        await chrome.tabs.sendMessage(msg.tabId, { type: "schedule", seconds: msg.seconds });
      } catch {
        // El content script aún no existe en esta pestaña: recarga completa para inyectarlo
        chrome.tabs.reload(msg.tabId, { bypassCache: true });
      }
      sendResponse({ ok: true });

    } else if (msg.type === "stop") {
      delete timers[msg.tabId];
      await setTimers(timers);
      badge(msg.tabId, false);
      chrome.tabs.sendMessage(msg.tabId, { type: "stop" }).catch(() => {});
      sendResponse({ ok: true });

    } else if (msg.type === "status") {
      sendResponse(timers[msg.tabId] || null);

    } else if (msg.type === "hello" && sender.tab) {
      // La página se (re)cargó: reiniciar cuenta atrás si esta pestaña está activa
      const t = timers[sender.tab.id];
      if (t) {
        t.nextAt = Date.now() + t.seconds * 1000;
        await setTimers(timers);
        badge(sender.tab.id, true);
        sendResponse({ seconds: t.seconds });
      } else sendResponse(null);

    } else if (msg.type === "tick" && sender.tab) {
      if (timers[sender.tab.id]) {
        chrome.tabs.reload(sender.tab.id, { bypassCache: true }); // full refresh (Ctrl+Shift+R)
      }
      sendResponse({ ok: true });
    }
  })();
  return true; // respuesta asíncrona
});

chrome.tabs.onRemoved.addListener(async (tabId) => {
  const timers = await getTimers();
  if (timers[tabId]) {
    delete timers[tabId];
    await setTimers(timers);
  }
});
