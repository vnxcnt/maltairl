 const phoneStatusMap = {
    0: { text: 'Hidden', color: 'red' },
    1: { text: 'Minimized', color: 'green' },
    2: { text: 'Full', color: 'blue' },
  };

  const mapStatusMap = {
    0: { text: 'Off', color: 'red' },
    1: { text: 'On', color: 'green' },
  };

  const inventoryStatusMap = mapStatusMap;
  const watchStatusMap = mapStatusMap;

  function updateStatus(id, value, map, overrideText = null) {
    const el = document.querySelector(`#status-${id} .status-value`);
    if (!el) return;
    if (map) {
      const status = map[value];
      if (status) {
        el.textContent = status.text;
        el.className = 'status-value ' + status.color;
        return;
      }
    }
    if (overrideText !== null) {
      const color = value > 0 ? 'green' : 'red';
      el.textContent = overrideText;
      el.className = 'status-value ' + color;
    } else {
      el.textContent = value;
      el.className = 'status-value';
    }
  }

  async function fetchInitialStatus() {
    try {
      const phone = await SE_API.counters.get('Phone');
      updateStatus('phone', phone?.count, phoneStatusMap);
    } catch (e) {
      console.warn('Failed to load Phone counter:', e);
    }

    try {
      const map = await SE_API.counters.get('Map');
      updateStatus('map', map?.count, mapStatusMap);
    } catch (e) {
      console.warn('Failed to load Map counter:', e);
    }

    try {
      const inventory = await SE_API.counters.get('Inventory');
      updateStatus('inventory', inventory?.count, inventoryStatusMap);
    } catch (e) {
      console.warn('Failed to load Inventory counter:', e);
    }

    try {
      const watch = await SE_API.counters.get('Watch');
      updateStatus('watch', watch?.count, watchStatusMap);
    } catch (e) {
      console.warn('Failed to load Watch counter:', e);
    }

    try {
      const stars = await SE_API.counters.get('Stars');
      const val = stars?.count ?? 0;
      updateStatus('stars', val, null, val > 0 ? val : 'Hidden');
    } catch (e) {
      console.warn('Failed to load Stars counter:', e);
    }

    try {
      const bg = await SE_API.counters.get('PhoneBackground');
      updateStatus('phonebackground', bg?.count, null);
    } catch (e) {
      console.warn('Failed to load PhoneBackground counter:', e);
    }
  }

  window.addEventListener('onWidgetLoad', fetchInitialStatus);

  window.addEventListener('onEventReceived', function (obj) {
    const { listener, event } = obj.detail;
    if (listener !== 'bot:counter') return;

    switch (event.counter) {
      case 'Phone':
        updateStatus('phone', event.value, phoneStatusMap);
        break;
      case 'Map':
        updateStatus('map', event.value, mapStatusMap);
        break;
      case 'Inventory':
        updateStatus('inventory', event.value, inventoryStatusMap);
        break;
      case 'Watch':
        updateStatus('watch', event.value, watchStatusMap);
        break;
      case 'Stars':
        updateStatus('stars', event.value, null, event.value > 0 ? event.value : 'Hidden');
        break;
      case 'PhoneBackground':
        updateStatus('phonebackground', event.value, null);
        break;
    }
  });
