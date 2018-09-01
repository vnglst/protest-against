import { Howl } from 'howler'
import protesterSvg from './protesterSvg'
import qs from 'query-string'
import isAlpha from 'validator/lib/isAlpha'

const PROTEST_TIME = 1000

const query = qs.parse(window.location.search).topic || 'world hunger'
// FIXME: do validation of server + client via same service
const topic = isAlpha(query) ? query : 'world hunger'

const pre = c => (c === 1 ? 'is' : 'are')
const title = c => (c === 1 ? 'person' : 'people')

const protestSound = new Howl({
  src: ['media/boo.mp3']
})

export default class Handler {
  constructor(socket) {
    this.socket = socket
    this.myId = new Date().getTime()
    this.handleConnect = this.handleConnect.bind(this)
    this.handleJoin = this.handleJoin.bind(this)
    this.handleLeave = this.handleLeave.bind(this)
    this.handleProtesting = this.handleProtesting.bind(this)
  }

  handleConnect() {
    this.socket.emit('add protester', {
      id: this.myId,
      topic: topic
    })
    const topicEl = document.getElementById('topic')
    topicEl.textContent = topic.toUpperCase()
  }

  handleJoin({ id, protesters }) {
    this.updateApp({ id, protesters })
  }

  handleLeave({ id, protesters }) {
    this.updateApp({ id, protesters })
  }

  updateApp({ id, protesters }) {
    console.log(protesters)
    this.renderProtesterCount(protesters.length)
    this.renderProtesters({ protesters, joined: id })
  }

  renderProtesterCount(count) {
    const el = document.getElementById('number-of-protesters')
    el.innerHTML = `${pre(count)} ${count} ${title(count)}`
  }

  renderProtesters({ protesters, joined }) {
    const prosterContainerEl = document.getElementById('protesters')
    prosterContainerEl.innerHTML = ''
    protesters.forEach(protester => {
      const { id } = protester
      const protesterEl = this.generateProtesterEl(id)

      const isNewProtester = id === joined
      if (isNewProtester) {
        protesterEl.classList.add('slide-in-right')
        setTimeout(() => {
          protesterEl.classList.remove('slide-in-right')
        }, 1000)
      }

      const isCurrentUser = id === this.myId
      if (isCurrentUser) {
        protesterEl.classList.add('current-user')
      }

      const label = isCurrentUser ? "that's you" : 'anonymous'
      const labelEl = document.createElement('p')
      labelEl.textContent = label
      protesterEl.appendChild(labelEl)

      prosterContainerEl.appendChild(protesterEl)
    })
  }

  generateProtesterEl(id) {
    const el = document.createElement('span')
    el.innerHTML = protesterSvg
    el.classList.add('protester')
    el.setAttribute('id', id)
    return el
  }

  handleProtesting({ id }) {
    const activeProtesterEl = document
      .getElementById(id)
      .getElementsByTagName('svg')[0]
    activeProtesterEl.classList.add('shake-vertical')
    setTimeout(() => {
      activeProtesterEl.classList.remove('shake-vertical')
    }, PROTEST_TIME)
    protestSound.play()
  }
}
