import Handler from './handler'

export default class Protest {
  constructor(socket) {
    this.socket = socket
    this.handler = new Handler(socket)
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
  }
}
