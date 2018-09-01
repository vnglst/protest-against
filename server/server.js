const express = require('express')
const path = require('path')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const validator = require('validator')
const TopicsDB = require('./topics-db')

const DIST_DIR = path.join(__dirname, '..', 'dist')
const DEFAULT_TOPIC = 'world-hunger'

const db = new TopicsDB(DEFAULT_TOPIC)

const onConnection = socket => {
  socket.protesterAdded = false

  socket.on('add protester', ({ id, topic: dirtyTopic }) => {
    const topic = validator.isAlpha(dirtyTopic) ? dirtyTopic : DEFAULT_TOPIC

    if (socket.protesterAdded) return

    const ip =
      socket.handshake.headers['x-forwarded-for'] || socket.handshake.address

    const protester = { id, ip }
    db.addProtester(topic, protester)

    socket.protesterAdded = true
    socket.protesterId = id
    socket.topic = topic
    socket.join(topic)

    io.to(topic).emit('protester joined', {
      id,
      protesters: db.getProtesters(socket.topic)
    })
  })

  socket.on('protesting', () => {
    io.to(socket.topic).emit('protesting', {
      id: socket.protesterId
    })
  })

  socket.on('disconnect', () => {
    if (socket.protesterAdded) {
      db.removeProtester(socket.topic, socket.protesterId)
      socket.in(socket.topic).emit('protester left', {
        id: socket.protesterId,
        protesters: db.getProtesters(socket.topic)
      })
    }
  })
}

io.on('connection', onConnection)

app.use(express.static(DIST_DIR))

app.get('/', (req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'))
})

http.listen(3000, () => {
  console.log('listening on http://localhost:3000')
})
