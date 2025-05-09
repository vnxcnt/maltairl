async function getLocationName(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'maltairl-overlay/1.0 (https://github.com/vnxcnt/maltairl)'
      }
    });
    const data = await response.json();
    const name =
      data?.address?.city ||
      data?.address?.town ||
      data?.address?.village ||
      data?.address?.hamlet ||
      data?.address?.municipality ||
      data?.display_name;
    return name || 'Unbekannter Ort';
  } catch (err) {
    console.warn('❌ Reverse-Geocoding fehlgeschlagen:', err);
    return 'Ort nicht verfügbar';
  }
}

async function updateLocation() {
  try {
    const res = await fetch('https://rtirl.com/api/pull?key=2v73gk40qeham29k');
    const data = await res.json();
    const lat = data?.location?.latitude;
    const lon = data?.location?.longitude;

    if (lat && lon) {
      const place = await getLocationName(lat, lon);
      document.getElementById('location-name').innerText = place;
    } else {
      document.getElementById('location-name').innerText = 'Koordinaten fehlen';
    }
  } catch (err) {
    console.warn('❌ Fehler beim Abrufen von GPS-Daten:', err);
    document.getElementById('location-name').innerText = 'Ort nicht verfügbar';
  }
}

function toggleLocationWidget(show) {
  const widget = document.getElementById('location-widget');
  if (!widget) return;
  widget.classList.toggle('visible', show);
  widget.classList.toggle('hidden', !show);
}

updateLocation();
setInterval(updateLocation, 60000); // jede Minute aktualisieren

window.addEventListener('onWidgetLoad', async function () {
  try {
    const mapCounter = await SE_API.counters.get('Map');
    toggleLocationWidget(mapCounter?.count > 0);
  } catch (err) {
    console.warn('❌ Fehler beim Initialisieren der Map-Widget-Sichtbarkeit:', err);
  }
});

window.addEventListener('onEventReceived', function (obj) {
  const listener = obj.detail.listener;
  const data = obj.detail.event;
  if (listener === 'bot:counter' && data.counter === 'Map') {
    toggleLocationWidget(data.value > 0);
  }
});
