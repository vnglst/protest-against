import io from 'socket.io-client'

export const pre = c => (c === 1 ? 'is' : 'are')
export const title = c => (c === 1 ? 'person' : 'people')

export const initProtest = () => {
  const socket = io()

  socket.on('connect', () => {
    //   socket.emit('room', currentRoom)
  })

  socket.on('users', count => {
    const element = document.getElementById('users')
    element.innerHTML = `${pre(count)} ${count} ${title(count)}`
  })
}
