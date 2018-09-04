import $ from 'jquery'

const SLIDE_IN_ANIMATION_TIME = 1000
const PROTEST_TIME = 1000

// String plurals
const pre = c => (c === 1 ? 'is' : 'are')
const title = c => (c === 1 ? 'person' : 'people')

export const renderTopic = topic => {
  const topicEl = document.getElementById('topic')
  topicEl.textContent = topic.toUpperCase()
}

export const renderProtesterCount = count => {
  const el = document.getElementById('number-of-protesters')
  el.innerHTML = `${pre(count)} ${count} ${title(count)}`
}

export const renderProtesters = ({ protesters, joined, myId }) => {
  protesters = protesters
    .concat({ id: '1234' })
    .concat({ id: '1234' })
    .concat({ id: '1234' })
    .concat({ id: '1234' })
    .concat({ id: '1234' })
    .concat({ id: '1234' })
    .concat({ id: '1234' })
    .concat({ id: '1234' })
    .concat({ id: '1234' })
    .concat({ id: '1234' })
    .concat({ id: '1234' })
    .concat({ id: '1234' })
    .concat({ id: '1234' })
    .concat({ id: '1234' })
    .concat({ id: '1234' })
    .concat({ id: '1234' })
    .concat({ id: '1234' })
    .concat({ id: '1234' })
    .concat({ id: '1234' })
    .concat({ id: '1234' })
    .reverse()

  const prosterContainerEl = document.getElementById('protesters')
  prosterContainerEl.innerHTML = ''
  protesters.forEach(protester => {
    const { id } = protester
    const protesterEl = generateProtesterEl(id)

    const isNewProtester = id === joined
    if (isNewProtester) {
      protesterEl.classList.add('slide-in-right')
      setTimeout(() => {
        protesterEl.classList.remove('slide-in-right')
      }, SLIDE_IN_ANIMATION_TIME)
    }

    const isCurrentUser = id === myId
    if (isCurrentUser) {
      protesterEl.classList.add('current-user')
    }

    const label = isCurrentUser ? "that's you" : 'anonymous'
    const labelEl = document.createElement('p')
    labelEl.textContent = label
    protesterEl.appendChild(labelEl)

    prosterContainerEl.appendChild(protesterEl)
  })

  $('html, body').animate(
    {
      scrollTop: $('.current-user').offset().top
    },
    4000
  )
}

const generateProtesterEl = id => {
  const el = document.createElement('span')
  el.innerHTML = protesterSvg
  el.classList.add('protester')
  el.setAttribute('id', id)
  return el
}

export const renderProtesting = ({ id }) => {
  const activeProtesterEl = document
    .getElementById(id)
    .getElementsByTagName('svg')[0]
  activeProtesterEl.classList.add('shake-vertical')
  setTimeout(() => {
    activeProtesterEl.classList.remove('shake-vertical')
  }, PROTEST_TIME)
}

export const renderTopics = ({ topicsWithCounts }) => {
  const topicsEl = document.getElementById('topics')
  topicsEl.innerHTML = ''
  const nonEmptyTopics = topicsWithCounts.filter(
    topicWithCount => topicWithCount.protesterCount > 0
  )
  nonEmptyTopics.forEach(topicWithCount => {
    const topicEl = document.createElement('li')
    const topicLink = document.createElement('a')
    topicLink.innerText = `${topicWithCount.topicName.toUpperCase()} (${
      topicWithCount.protesterCount
    })`
    topicLink.setAttribute('href', `/?topic=${topicWithCount.topicName}`)
    topicEl.appendChild(topicLink)
    topicsEl.appendChild(topicEl)
  })
}

const protesterSvg = `<svg version="1.1" id="protester" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
viewBox="0 0 495.212 495.212" style="enable-background:new 0 0 495.212 495.212;" xml:space="preserve">
<g id="XMLID_415_">
  <path id="XMLID_417_" d="M171.492,96.586c26.688,0,48.314-21.616,48.314-48.288c0-26.679-21.626-48.295-48.314-48.295
c-26.67,0-48.276,21.616-48.276,48.295C123.216,74.97,144.823,96.586,171.492,96.586z" />
  <path id="XMLID_416_" d="M445.941,48.5L348.798,1.592c-3.811-1.847-8.229-2.096-12.23-0.7c-4.032,1.402-7.328,4.339-9.168,8.164
l-28.026,58.04c-3.86,7.972-0.503,17.558,7.468,21.405l37.408,18.063l-27.884,57.696l-52.64,23.88l-31.689-69.458
c-3.583-7.873-11.506-12.343-19.656-12.006h-81.776c-8.15-0.337-16.054,4.133-19.656,12.006L42.084,269.566
c-4.731,10.374-0.16,22.632,10.229,27.366c10.457,4.762,22.638,0.122,27.369-10.214l33.267-72.909
c0,8.681-0.061,92.467-0.061,256.621c0,13.691,11.101,24.783,24.786,24.783c13.697,0,24.786-11.092,24.786-24.783V322.727h18.072
V470.43c0,13.691,11.101,24.783,24.786,24.783c13.697,0,24.786-11.092,24.786-24.783c0-133.18-0.068-216.322-0.068-256.621
l4.682,10.23c3.468,7.591,10.972,12.086,18.816,12.086c2.834,0,5.744-0.598,8.517-1.856l26.271-11.924l-0.099,0.224
c-2.988,6.164-0.405,13.571,5.763,16.548c1.725,0.84,3.566,1.236,5.37,1.236c4.615,0,9.04-2.575,11.168-7.005l13.04-26.985
l13.845-6.288c10.39-4.709,14.986-16.949,10.278-27.341c-1.165-2.549-2.792-4.737-4.73-6.544l23.589-48.845l37.421,18.066
c3.823,1.847,8.229,2.099,12.249,0.703c4.02-1.405,7.309-4.342,9.168-8.164l28.008-58.044
C457.25,61.933,453.906,52.348,445.941,48.5z" />
</svg>`
