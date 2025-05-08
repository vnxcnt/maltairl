// 🔗 Icon-Zuordnung: itemName → Icon-URL
function getItemIcon(name) {
  const iconMap = {
    Wasserflasche: "https://raw.githubusercontent.com/bitc0de/fivem-items-gallery/refs/heads/main/images/drinks/water_bottle.png",
    Cola: "https://raw.githubusercontent.com/bitc0de/fivem-items-gallery/refs/heads/main/images/drinks/cocacola.png",
    iPhone: "https://raw.githubusercontent.com/bitc0de/fivem-items-gallery/refs/heads/main/images/tech/iphone.png",
    Boxhandschuhe: "https://raw.githubusercontent.com/bitc0de/fivem-items-gallery/refs/heads/main/images/clothing/gloves.png",
    Rucksack: "https://raw.githubusercontent.com/bitc0de/fivem-items-gallery/refs/heads/main/images/misc/backpack1.png",
    Bilal: "https://raw.githubusercontent.com/vnxcnt/maltairl/refs/heads/main/images/bilal.png",
    Equipment: "https://raw.githubusercontent.com/bitc0de/fivem-items-gallery/refs/heads/main/images/tech/powerbank.png"
  };
  return iconMap[name] || "https://cdn-icons-png.flaticon.com/512/1040/1040230.png";
}

// 🧱 Erstellt leere Slots (fix 25 Stück) & füllt sie mit Items
function renderInventory(itemList) {
  const grid = document.getElementById('inventory-grid');
  grid.innerHTML = '';
  const compactItems = itemList.filter(item => item && item.count > 0);

  for (let i = 0; i < 25; i++) {
    const slot = document.createElement('div');
    slot.classList.add('inventory-slot');

    const item = compactItems[i];
    if (item) {
      const img = document.createElement('img');
      img.src = item.icon;
      slot.appendChild(img);

      const count = document.createElement('div');
      count.classList.add('item-count');
      count.innerText = item.count + 'x';
      slot.appendChild(count);
    }

    grid.appendChild(slot);
  }
}

const customInventoryItems = [
  "Wasserflasche",
  "Cola",
  "Boxhandschuhe",
  "Equipment",
  "Rucksack",
  "Bilal",
  "iPhone"
];

const inventoryState = {};
let inventoryVisible = false;

function updateInventoryDisplay(force = false) {
  const overlay = document.getElementById('inventory-overlay');
  if (!overlay) return;

  if (inventoryVisible) {
    if (!overlay.classList.contains('visible')) {
      overlay.classList.add('visible');
      if (force) playInventorySound();
    }
  } else {
    overlay.classList.remove('visible');
  }

  const itemList = Object.entries(inventoryState).map(([name, count]) => ({
    icon: getItemIcon(name),
    count
  }));
  renderInventory(itemList);
}

function playInventorySound() {
  const audio = document.createElement('audio');
  audio.src = 'https://cdn.jsdelivr.net/gh/vnxcnt/maltairl/sound/inventory_zip.mp3';
  audio.volume = 0.7;
  audio.autoplay = true;
  audio.style.display = 'none';
  document.body.appendChild(audio);
  audio.addEventListener('ended', () => audio.remove());
}

// 📢 Reagiere auf Event-basierte Inventory-Updates
window.addEventListener('onEventReceived', (obj) => {
  const listener = obj.detail.listener;
  const data = obj.detail.event;

  if (listener === 'bot:counter') {
    const counterName = data.counter;
    const value = parseInt(data.value);
    const normalized = counterName.toLowerCase();

    if (customInventoryItems.map(i => i.toLowerCase()).includes(normalized)) {
      inventoryState[counterName] = value;
      updateInventoryDisplay();
    }

    if (normalized === 'inventory') {
      inventoryVisible = value > 0;
      updateInventoryDisplay(true);
    }
  }
});

// 🚀 Initiale Abfrage bei Widget-Start
window.addEventListener('onWidgetLoad', async () => {
  for (const itemName of customInventoryItems) {
    try {
      const counter = await SE_API.counters.get(itemName);
      const count = parseInt(counter?.count);
      inventoryState[itemName] = isNaN(count) ? 0 : count;
    } catch (e) {
      console.warn(`Fehler beim Abrufen von '${itemName}':`, e);
      inventoryState[itemName] = 0;
    }
  }

  try {
    const inv = await SE_API.counters.get('Inventory');
    inventoryVisible = parseInt(inv?.count) > 0;
  } catch (e) {
    inventoryVisible = false;
  }

  updateInventoryDisplay(true);
});
