let map, marker;

window.addEventListener('onWidgetLoad', function (obj) {
  const fieldData = obj.detail.fieldData;

  const MAPBOX_TOKEN = fieldData.mapbox_token;
  const CUSTOM_STYLE = fieldData.custom_style;
  const FALLBACK_STYLE = fieldData.fallback_style;
  const RTIRL_API_URL = fieldData.rtirl_api_url;

  function createTileLayer(styleId) {
    return L.tileLayer(`https://api.mapbox.com/styles/v1/${styleId}/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`, {
      tileSize: 512,
      zoomOffset: -1,
      attribution: ''
    });
  }

async function initializeMap() {
  try {
    const res = await fetch(RTIRL_API_URL);
    const data = await res.json();

    const lat = data?.location?.latitude;
    const lon = data?.location?.longitude;

    if (typeof lat !== 'number' || typeof lon !== 'number') {
      throw new Error("Kein gültiger Standort verfügbar");
    }

    setTimeout(() => {
      const mapDiv = document.getElementById('map');
      if (!mapDiv) {
        console.warn('❌ Kein #map-Element im DOM gefunden!');
        return;
      }

      map = L.map('map', { zoomControl: false }).setView([lat, lon], 13);

      const tileLayer = createTileLayer(CUSTOM_STYLE);
      tileLayer.on('tileerror', function () {
        console.warn('⚠️ Benutzerdefinierter Style fehlgeschlagen – wechsle zu Fallback');
        createTileLayer(FALLBACK_STYLE).addTo(map);
      });
      tileLayer.addTo(map);

      const gtaIcon = L.divIcon({
        html: `<div class="gta-dot"></div>`,
        iconSize: [16, 16],
        className: ''
      });

      marker = L.marker([lat, lon], { icon: gtaIcon }).addTo(map);
    }, 50);

    setInterval(updatePosition, 3000);
  } catch (err) {
    console.warn('❌ Fehler beim Initialisieren der Map:', err);
  }
}

  async function updatePosition() {
    try {
      const res = await fetch(RTIRL_API_URL);
      const data = await res.json();
      const lat = data?.location?.latitude;
      const lon = data?.location?.longitude;

      if (typeof lat === 'number' && typeof lon === 'number') {
        if (marker) marker.setLatLng([lat, lon]);
        if (map) map.setView([lat, lon]);
      }
    } catch (err) {
      console.warn('❌ Fehler beim Aktualisieren der Position:', err);
    }
  }

  function toggleMap(show) {
    const container = document.getElementById('minimap-container');
    if (!container) return;

    if (show) {
      container.classList.add('visible');
    } else {
      container.classList.remove('visible');
    }
  }

  async function initializeMapVisibility() {
    try {
      const mapState = await SE_API.counters.get('Map');
      toggleMap(mapState?.count > 0);
    } catch (err) {
      console.warn('❌ Fehler beim Abrufen des Map-Counters:', err);
    }
  }

  window.addEventListener('onEventReceived', function (obj) {
    const listener = obj.detail.listener;
    const data = obj.detail.event;

    if (listener === 'bot:counter' && data.counter === 'Map') {
      toggleMap(data.value > 0);
    }
  });

  // Start
  initializeMapVisibility();
  initializeMap();
});
