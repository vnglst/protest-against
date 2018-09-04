class TopicsDB {
  constructor(defaultTopic) {
    this.defaultTopic = defaultTopic
    this.topics = {
      [defaultTopic]: {
        protesters: []
      }
    }
  }

  addProtester(topic, prostester) {
    if (this.isNewTopic(topic)) {
      this.createNewTopic(topic)
    }
    this.getProtesters(topic).push(prostester)
  }

  isNewTopic(topic) {
    return this.topics[topic] === undefined
  }

  createNewTopic(topic) {
    this.topics[topic] = {
      protesters: []
    }
  }

  removeProtester(topic, protesterId) {
    const protesters = this.getProtesters(topic)
    const index = protesters.findIndex(p => p.id === protesterId)
    if (index > -1) {
      protesters.splice(index, 1)
    }
  }

  getTopicsWithCounts() {
    const topicNames = Object.keys(this.topics)
    const topicsWithCounts = topicNames.map(topicName => ({
      topicName,
      protesterCount: this.topics[topicName].protesters.length
    }))
    return topicsWithCounts
  }

  getProtesters(topic) {
    return this.topics[topic].protesters
  }
}

module.exports = TopicsDB
