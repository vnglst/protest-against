const express = require('express')
const path = require('path')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const validator = require('validator')

const DIST_DIR = path.join(__dirname, 'dist')

const getIpFromHandshake = handshake =>
  handshake.headers['x-forwarded-for'] || handshake.address

const getCountryFromHeaders = headers => {
  const acceptLanguage = headers['accept-language']
  const locale = acceptLanguage.split(',')[0]
  const country = locale.split('-')[1]
  return country
}

const topics = {}

io.on('connection', socket => {
  let protesterAdded = false

  const ip = getIpFromHandshake(socket.handshake)
  const country = getCountryFromHeaders(socket.handshake.headers)

  socket.on('add protester', ({ id, topic: dirtyTopic }) => {
    // FIXME: do validation of server + client via same service
    const topic = validator.isAlpha(dirtyTopic) ? dirtyTopic : 'world-hunger'
    // FIXME: this 👇 is stupid, refactor
    if (protesterAdded) return
    if (topics[topic] === undefined) topics[topic] = {}
    if (topics[topic].protesters === undefined) topics[topic].protesters = []
    topics[topic].protesters.push({ id, ip, country })
    protesterAdded = true
    socket.protesterId = id
    socket.topic = topic
    socket.join(topic)
    io.to(socket.topic).emit('protester joined', {
      id: socket.id,
      protesters: topics[topic].protesters
    })
  })

  socket.on('protesting', () => {
    io.to(socket.topic).emit('protesting', {
      id: socket.protesterId
    })
  })

  socket.on('disconnect', () => {
    if (protesterAdded) {
      const { protesters } = topics[socket.topic]
      const index = protesters.findIndex(p => p.id === socket.protesterId)
      if (index > -1) {
        protesters.splice(index, 1)
      }

      socket.in(socket.topic).emit('protester left', {
        id: socket.protesterId,
        protesters
      })
    }
  })
})

app.use(express.static(DIST_DIR))

app.get('/', (req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'))
})

http.listen(3000, () => {
  console.log('listening on http://localhost:3000')
})
