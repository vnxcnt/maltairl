// 🔗 Icon-Zuordnung: itemName → Icon-URL
function getItemIcon(name) {
  const iconMap = {
    Wasserflasche: "https://raw.githubusercontent.com/bitc0de/fivem-items-gallery/refs/heads/main/images/drinks/water_bottle.png",
    Cola: "https://raw.githubusercontent.com/bitc0de/fivem-items-gallery/refs/heads/main/images/drinks/cocacola.png",
    iPhone: "https://raw.githubusercontent.com/bitc0de/fivem-items-gallery/refs/heads/main/images/tech/iphone.png",
    Boxhandschuhe: "https://raw.githubusercontent.com/bitc0de/fivem-items-gallery/refs/heads/main/images/clothing/gloves.png",
    Rucksack: "https://raw.githubusercontent.com/bitc0de/fivem-items-gallery/refs/heads/main/images/misc/backpack1.png",
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
  "iPhone"
];

async function loadInventoryFromCounters() {
  const loader = document.getElementById('inventory-loader');
  if (loader) loader.style.display = 'block';
  const items = [];

  for (const itemName of customInventoryItems) {
    try {
      const counter = await SE_API.counters.get(itemName);
      const count = parseInt(counter?.count);
      if (count > 0) {
        items.push({ icon: getItemIcon(itemName), count });
      }
    } catch (e) {
      console.warn(`Item '${itemName}' konnte nicht geladen werden:`, e);
    }
  }

  renderInventory(items);
  if (loader) loader.style.display = 'none';
}

// 👇 Zeigt oder versteckt das Overlay abhängig vom 'Inventory'-Counterwert
async function updateInventoryDisplay(playSoundOnShow = true) {
  const overlay = document.getElementById('inventory-overlay');
  if (!overlay) return;

  try {
    const invCounter = await SE_API.counters.get('Inventory');
    const value = parseInt(invCounter?.count);
    const isCurrentlyVisible = overlay.classList.contains('visible');

    if (value > 0) {
      if (!isCurrentlyVisible && playSoundOnShow) {
        playInventorySound();
      }
      overlay.classList.add('visible');
    } else {
      overlay.classList.remove('visible');
    }
  } catch (e) {
    console.warn('Inventory-Counter konnte nicht geladen werden:', e);
    overlay.classList.remove('visible');
  }

  loadInventoryFromCounters();
}

// 🔊 Sound beim Anzeigen des Inventars
function playInventorySound() {
  const audio = document.createElement('audio');
  audio.src = 'https://cdn.jsdelivr.net/gh/vnxcnt/maltairl/sound/inventory_zip.mp3';
  audio.volume = 0.7;
  audio.autoplay = true;
  audio.style.display = 'none';
  document.body.appendChild(audio);
  audio.addEventListener('ended', () => audio.remove());
}

// 🚀 Automatisch beim Laden starten
window.addEventListener('onWidgetLoad', () => {
  updateInventoryDisplay();
  setInterval(() => {
    updateInventoryDisplay(false);
  }, 7000);
});
