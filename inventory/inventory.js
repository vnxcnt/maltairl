// 🔗 Icon-Zuordnung: itemName → Icon-URL
function getItemIcon(name) {
  const iconMap = {
    apple: "https://cdn-icons-png.flaticon.com/512/3081/3081559.png",
    Wasserflasche: "https://cdn-icons-png.flaticon.com/512/3126/3126580.png",
    gun:   "https://cdn-icons-png.flaticon.com/512/3081/3081964.png",
    // Weitere Items ...
  };
  return iconMap[name] || "https://cdn-icons-png.flaticon.com/512/1040/1040230.png"; // Fallback
}

// 🧱 Erstellt leere Slots (fix 25 Stück) & füllt sie mit Items
function renderInventory(itemList) {
  const grid = document.getElementById('inventory-grid');
  grid.innerHTML = '';

  // Schritt 1: Items aufrücken → ohne Lücken
  const compactItems = itemList.filter(item => item && item.count > 0);

  // Schritt 2: Grid mit 25 Slots rendern
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

// 🟢 Listener für Events von StreamElements
window.addEventListener('onEventReceived', function (obj) {
  if (obj.detail.listener === 'inventory-update') {
    const data = obj.detail.event;
    const items = [];

    // Alle definierten Slots durchsuchen
    for (let i = 1; i <= 25; i++) {
      const name = data[`slot${i}_item`];
      const count = parseInt(data[`slot${i}_count`]);

      if (name && count > 0) {
        items.push({ icon: getItemIcon(name), count });
      }
    }

    renderInventory(items);
  }
});

// 🧪 Optionale Startanzeige mit leerem Inventar
renderInventory([]); // Zeigt leeres Grid mit 25 Slots
