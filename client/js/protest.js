import SocketHandler from './socket-handler'
import isAlpha from 'validator/lib/isAlpha'

export default class Protest {
  constructor(socket) {
    this.socket = socket
    this.handler = new SocketHandler(socket)
  }

  start() {
    const { socket, handler } = this
    socket.on('connect', handler.handleConnect)
    socket.on('protesting', handler.handleProtesting)
    socket.on('protester joined', handler.handleJoin)
    socket.on('protester left', handler.handleLeave)

    this.addListeners()
  }

  addListeners() {
    const button = document.getElementById('protest-button')
    button.addEventListener('click', () => {
      this.socket.emit('protesting')
    })

    const inputSubmit = document.getElementById('new-topic-button')
    inputSubmit.addEventListener('click', e => {
      e.preventDefault()
      const input = document.getElementById('new-topic')
      const insecureValue = input.value || 'hunger'
      let secureValue = 'trump'
      if (isAlpha(insecureValue)) {
        secureValue = insecureValue
      } else {
        window.alert(
          'Only characters allowed defaulting to trump',
          insecureValue
        )
      }
      window.location.search = `?topic=${secureValue}`
    })
  }
}
