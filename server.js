const express = require('express')
const path = require('path')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

const DIST_DIR = path.join(__dirname, 'dist')

const getIpFromHandshake = handshake =>
  handshake.headers['x-forwarded-for'] || handshake.address

const getCountryFromHeaders = headers => {
  const acceptLanguage = headers['accept-language']
  const locale = acceptLanguage.split(',')[0]
  const country = locale.split('-')[1]
  return country
}

let protesters = []

io.on('connection', socket => {
  let protesterAdded = false

  const ip = getIpFromHandshake(socket.handshake)
  const country = getCountryFromHeaders(socket.handshake.headers)

  socket.on('add protester', id => {
    if (protesterAdded) return
    protesters.push({ id, ip, country })
    protesterAdded = true
    socket.id = id
    socket.emit('login', {
      protesters
    })
    socket.broadcast.emit('protester joined', {
      id: socket.id,
      protesters
    })
  })

  socket.on('protesting', () => {
    socket.broadcast.emit('protesting', {
      id: socket.id
    })
  })

  socket.on('disconnect', () => {
    if (protesterAdded) {
      const index = protesters.findIndex(p => p.id === socket.id)
      if (index > -1) {
        protesters.splice(index, 1)
      }

      socket.broadcast.emit('protester left', {
        id: socket.id,
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
