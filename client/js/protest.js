import SocketHandler from './socket-handler'

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
  }
}
