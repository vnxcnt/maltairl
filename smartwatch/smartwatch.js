async function fetchRTIRLData() {
  try {
    const res = await fetch("https://rtirl.com/api/pull?key=2v73gk40qeham29k");
    const data = await res.json();

    const speed = Math.round(data?.speed_kph ?? 0);
    const altitude = Math.round(data?.altitude ?? 0);
    const heading = Math.round(data?.heading ?? 0);

    document.getElementById("watch-speed").innerText = speed;
    document.getElementById("watch-altitude").innerText = altitude;
    document.getElementById("watch-heading").innerText = heading;
  } catch (err) {
    console.warn("❌ Fehler beim Abrufen von RTIRL-Daten:", err);
  }
}

// alle 3 Sekunden aktualisieren
setInterval(fetchRTIRLData, 3000);
fetchRTIRLData(); // initialer Abruf

function toggleWatch(show) {
  const watch = document.getElementById('apple-watch-container');
  if (!watch) return;

  if (show) {
    watch.classList.add('visible');
  } else {
    watch.classList.remove('visible');
  }
}

async function initializeWatchVisibility() {
  try {
    const watchState = await SE_API.counters.get('Watch');
    const isVisible = watchState?.count > 0;
    toggleWatch(isVisible);
  } catch (e) {
    console.warn('❌ Fehler beim Abrufen des Watch-Zustands:', e);
  }
}

window.addEventListener('onEventReceived', function (obj) {
  const listener = obj.detail.listener;
  const data = obj.detail.event;

  if (listener === 'bot:counter' && data.counter === 'Watch') {
    toggleWatch(data.value > 0);
  }
});

// Initialer Zustand laden
initializeWatchVisibility();
