import io from 'socket.io-client'
import qs from 'query-string'
import validator from 'validator'
import { Howl } from 'howler'
import protesterSvg from './protesterSvg'

export const pre = c => (c === 1 ? 'is' : 'are')
export const title = c => (c === 1 ? 'person' : 'people')

const myId = new Date().getTime()
const socket = io()
const query = qs.parse(window.location.search).topic || 'world hunger'
// FIXME: do validation of server + client via same service
const topic = validator.isAlpha(query) ? query : 'world hunger'

const booSound = new Howl({
  src: ['media/boo.mp3']
})

export const initProtest = () => {
  socket.on('connect', () => {
    socket.emit('add protester', {
      id: myId,
      topic: topic
    })
    const topicEl = document.getElementById('topic')
    topicEl.textContent = topic.toUpperCase()
  })

  socket.on('protesting', ({ id }) => {
    const activeProtesterEl = document
      .getElementById(id)
      .getElementsByTagName('svg')[0]
    activeProtesterEl.classList.add('shake-vertical')
    setTimeout(() => {
      activeProtesterEl.classList.remove('shake-vertical')
    }, 1000)
    booSound.play()
  })

  socket.on('protester joined', ({ id, protesters }) => {
    updateCount(protesters.length)
    generateProtesters({ protesters, joined: id })
  })

  socket.on('protester left', ({ id, protesters }) => {
    updateCount(protesters.length)
    generateProtesters({ protesters, joined: id })
  })

  addListeners()
}

const addListeners = () => {
  const button = document.getElementById('protest-button')
  button.addEventListener('click', () => {
    socket.emit('protesting')
  })
}

const updateCount = count => {
  const el = document.getElementById('number-of-protesters')
  el.innerHTML = `${pre(count)} ${count} ${title(count)}`
}

const generateProtesters = ({ protesters, joined }) => {
  console.log('protesters', protesters)
  const parent = document.getElementById('protesters')
  parent.innerHTML = ''
  protesters.forEach(protester => {
    const { id } = protester
    const child = generateProtesterEl(id)
    if (id === joined) {
      child.classList.add('slide-in-right')
      setTimeout(() => {
        child.classList.remove('slide-in-right')
      }, 1000)
    }
    if (id === myId) {
      child.classList.add('current-user')
    }
    const label = id === myId ? "that's you!" : 'anonymous'
    const labelEl = document.createElement('p')
    labelEl.textContent = label
    child.appendChild(labelEl)

    parent.appendChild(child)
  })
}

const generateProtesterEl = id => {
  const el = document.createElement('span')
  el.innerHTML = protesterSvg
  el.classList.add('protester')
  el.setAttribute('id', id)
  return el
}
