const $ = (id) => document.getElementById(id);
let tabId, timer;

async function render() {
  const t = await chrome.runtime.sendMessage({ type: "status", tabId });
  const el = $("status");
  if (!t) {
    el.textContent = "Inactivo en esta pestaña";
    el.className = "";
    return;
  }
  const left = Math.max(0, Math.round((t.nextAt - Date.now()) / 1000));
  el.textContent = `Activo · cada ${t.seconds}s · próxima en ${left}s`;
  el.className = "on";
}

(async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  tabId = tab.id;

  $("start").onclick = async () => {
    const seconds = Math.max(1, Math.floor(Number($("value").value) * Number($("unit").value)));
    await chrome.runtime.sendMessage({ type: "start", tabId, seconds });
    render();
  };
  $("stop").onclick = async () => {
    await chrome.runtime.sendMessage({ type: "stop", tabId });
    render();
  };

  render();
  timer = setInterval(render, 1000);
})();
