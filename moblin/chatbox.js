function replaceEmotesInMessage(message, emotes) {
  if (!emotes) return message;
  const sorted = Object.entries(emotes).sort((a, b) => b[1][0].length - a[1][0].length);

  for (const [id, positions] of sorted) {
    for (const pos of positions) {
      const [start, end] = pos.split('-').map(Number);
      const word = message.substring(start, end + 1);
      const img = `<img src="https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/dark/1.0" alt="${word}" style="height:1em; vertical-align:middle;">`;
      message = message.replace(word, img);
    }
  }

  return message;
}

window.addEventListener('onEventReceived', function (obj) {
  const listener = obj.detail.listener;
  const data = obj.detail.event;
  if (listener !== 'message') return;

  const msgData = data.data;
  const message = msgData.text || msgData.snippet?.textMessageDetails?.messageText || '';
  if (!message || message.startsWith('!')) return;

  const platform = data.platform;
  const displayName = msgData.displayName || msgData.nick || 'Unbekannt';
  const isMod = msgData.isModerator || msgData.badges?.some(b => b.type === 'moderator');
  const badges = msgData.badges || [];
  const emotes = msgData.emotes || null;

  const chat = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.classList.add('chat-entry');
  if (isMod) div.classList.add('moderator');

  const platformIcon = platform === 'youtube'
    ? `<img src="https://cdn-icons-png.flaticon.com/24/1384/1384060.png" class="chat-icon" alt="YT">`
    : `<img src="https://raw.githubusercontent.com/vnxcnt/maltairl/refs/heads/main/images/icon_twitch.webp" class="chat-icon" alt="Twitch">`;

const allowedBadges = ['moderator', 'subscriber', 'vip', 'broadcaster'];
const badgeHTML = badges
  .filter(b => allowedBadges.includes(b.type))
  .map(b => `<img src="${b.url}" class="chat-icon" alt="${b.type}">`)
  .join('');
  const emoteMessage = replaceEmotesInMessage(message, emotes);

  div.innerHTML = `
    <div class="chat-sender">${badgeHTML} ${platformIcon} ${displayName}</div>
    <div class="chat-message">${emoteMessage}</div>
  `;

  chat.prepend(div);
  if (chat.children.length > 100) {
    chat.removeChild(chat.lastChild);
  }
});
