import './app.scss'
import io from 'socket.io-client'
import Protest from './js/protest'

const socket = io()
const protest = new Protest(socket)
protest.start()
