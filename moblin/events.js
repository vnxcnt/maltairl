window.addEventListener('onEventReceived', function (obj) {
  const listener = obj.detail.listener;
  const data = obj.detail.event;
  if (!data || !data.name) return;

  const list = document.getElementById('event-list');
  const div = document.createElement('div');
  div.classList.add('event-entry');

  let message = '';
  let typeClass = '';

  switch (listener) {
    case 'follower-latest':
      message = `📥 Neuer Follower: ${data.name}`;
      typeClass = 'follower';
      break;
    case 'subscriber-latest':
      message = `⭐️ Neues Abo: ${data.name}`;
      typeClass = 'subscriber';
      break;
    case 'tip-latest':
    case 'donation-latest':
      message = `💸 Spende von ${data.name}: ${data.amount}€`;
      typeClass = 'tip';
      break;
    case 'cheer-latest':
      message = `🎉 Cheer von ${data.name}: ${data.amount} Bits`;
      typeClass = 'cheer';
      break;
    case 'raid-latest':
      message = `🚨 Raid von ${data.name} mit ${data.amount} Zuschauern`;
      typeClass = 'raid';
      break;
  }

  if (!message) return;

  div.textContent = message;
  div.classList.add(typeClass);
  list.prepend(div);

  if (list.children.length > 15) {
    list.removeChild(list.lastChild);
  }
});
