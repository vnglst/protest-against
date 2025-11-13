import { WebSocketClient } from './websocket-client.js';
import * as dom from './dom.js';
import { getTopicFromQueryString, sanitizeTopic } from './utils.js';

// Simple Howler.js replacement for playing audio
class AudioPlayer {
  constructor(src) {
    this.audio = new Audio(src);
    this.audio.preload = 'auto';
  }

  play() {
    this.audio.currentTime = 0;
    this.audio.play().catch(err => console.error('Audio play failed:', err));
  }
}

class ProtestApp {
  constructor() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    this.socket = new WebSocketClient(wsUrl);
    this.myId = Date.now();
    this.protestSound = new AudioPlayer('/media/boo.mp3');

    this.setupSocketHandlers();
    this.setupUIHandlers();
  }

  start() {
    this.socket.connect();
  }

  setupSocketHandlers() {
    this.socket.on('connect', () => {
      const topic = getTopicFromQueryString();
      this.socket.emit('add protester', {
        id: this.myId,
        topic: topic
      });
      dom.renderTopic(topic);
    });

    this.socket.on('protester joined', (data) => {
      this.updateApp(data);
    });

    this.socket.on('protester left', (data) => {
      this.updateApp(data);
    });

    this.socket.on('protesting', (data) => {
      dom.renderProtesting({ id: data.id });
      this.protestSound.play();
    });
  }

  updateApp({ id, protesters, topicsWithCounts }) {
    dom.renderTopics({ topicsWithCounts });
    dom.renderProtesterCount(protesters.length);
    dom.renderProtesters({ protesters, joined: id, myId: this.myId });
  }

  setupUIHandlers() {
    const button = document.getElementById('protest-button');
    button.addEventListener('click', () => {
      this.socket.emit('protesting');
    });

    const inputSubmit = document.getElementById('new-topic-button');
    inputSubmit.addEventListener('click', (e) => {
      e.preventDefault();
      const input = document.getElementById('new-topic');
      const insecureValue = input.value || 'hunger';
      let secureValue = 'trump';

      if (/^[a-zA-Z]+$/.test(insecureValue)) {
        secureValue = insecureValue;
      } else {
        window.alert('Only characters allowed, defaulting to trump');
      }

      window.location.search = `?topic=${secureValue}`;
    });
  }
}

// Start the app
const app = new ProtestApp();
app.start();
