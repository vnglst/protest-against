const express = require('express')
const path = require('path')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const SocketListener = require('./socket-listener')

const DIST_DIR = path.join(__dirname, '..', 'dist')

const listener = new SocketListener(io)

listener.start()

app.use(express.static(DIST_DIR))

app.get('/', (req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'))
})

const PORT = process.env.PORT || 3000

http.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`)
})
