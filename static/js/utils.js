const DEFAULT_TOPIC = 'trump';

export function sanitizeTopic(topic) {
  const isAlpha = /^[a-zA-Z]+$/.test(topic);
  return isAlpha ? topic : DEFAULT_TOPIC;
}

export function getTopicFromQueryString() {
  const params = new URLSearchParams(window.location.search);
  const topic = params.get('topic') || DEFAULT_TOPIC;
  return sanitizeTopic(topic);
}
