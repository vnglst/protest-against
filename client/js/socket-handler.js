import { Howl } from 'howler'
import * as dom from './dom'
import * as utils from './utils'

const protestSound = new Howl({
  src: ['media/boo.mp3']
})

export default class SocketHandler {
  constructor(socket) {
    this.socket = socket
    this.myId = new Date().getTime()
    this.handleConnect = this.handleConnect.bind(this)
    this.handleJoin = this.handleJoin.bind(this)
    this.handleLeave = this.handleLeave.bind(this)
    this.handleProtesting = this.handleProtesting.bind(this)
  }

  handleConnect() {
    const topic = utils.getTopicFromQueryString()
    this.socket.emit('add protester', {
      id: this.myId,
      topic
    })
    dom.renderTopic(topic)
  }

  handleJoin({ id, protesters }) {
    this.updateApp({ id, protesters })
  }

  handleLeave({ id, protesters }) {
    this.updateApp({ id, protesters })
  }

  updateApp({ id, protesters }) {
    dom.renderProtesterCount(protesters.length)
    dom.renderProtesters({ protesters, joined: id, myId: this.myId })
  }

  handleProtesting({ id }) {
    dom.renderProtesting({ id })
    protestSound.play()
  }
}
