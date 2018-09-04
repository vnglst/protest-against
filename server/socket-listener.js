const config = require('../common/config')
const TopicsDB = require('./topics-db')
const utils = require('./utils')

module.exports = class SocketListener {
  constructor(io) {
    this.io = io
    this.db = new TopicsDB(config.DEFAULT_TOPIC)
    this.onConnection = this.onConnection.bind(this)
  }

  start() {
    this.io.on('connection', this.onConnection)
  }

  onConnection(socket) {
    socket.protesterAdded = false

    socket.on('add protester', ({ id, topic: dirtyTopic }) => {
      const topic = utils.sanatizeTopic(dirtyTopic)

      if (socket.protesterAdded) return

      const ip =
        socket.handshake.headers['x-forwarded-for'] || socket.handshake.address

      const protester = { id, ip }
      this.db.addProtester(topic, protester)

      socket.protesterAdded = true
      socket.protesterId = id
      socket.topic = topic
      socket.join(topic)

      this.io.to(topic).emit('protester joined', {
        id,
        protesters: this.db.getProtesters(socket.topic)
      })
    })

    socket.on('protesting', () => {
      this.io.to(socket.topic).emit('protesting', {
        id: socket.protesterId
      })
    })

    socket.on('disconnect', () => {
      if (socket.protesterAdded) {
        this.db.removeProtester(socket.topic, socket.protesterId)
        socket.in(socket.topic).emit('protester left', {
          id: socket.protesterId,
          protesters: this.db.getProtesters(socket.topic)
        })
      }
    })
  }
}
