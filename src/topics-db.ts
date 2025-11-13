export interface Protester {
  id: number;
  ip: string;
}

export interface Topic {
  protesters: Protester[];
}

export interface TopicWithCount {
  topicName: string;
  protesterCount: number;
}

export class TopicsDB {
  private topics: Map<string, Topic>;
  private defaultTopic: string;

  constructor(defaultTopic: string) {
    this.defaultTopic = defaultTopic;
    this.topics = new Map();
    this.topics.set(defaultTopic, { protesters: [] });
  }

  addProtester(topic: string, protester: Protester): void {
    if (!this.topics.has(topic)) {
      this.topics.set(topic, { protesters: [] });
    }
    this.topics.get(topic)!.protesters.push(protester);
  }

  removeProtester(topic: string, protesterId: number): void {
    const topicData = this.topics.get(topic);
    if (!topicData) return;

    const index = topicData.protesters.findIndex((p) => p.id === protesterId);
    if (index > -1) {
      topicData.protesters.splice(index, 1);
    }
  }

  getProtesters(topic: string): Protester[] {
    return this.topics.get(topic)?.protesters || [];
  }

  getTopicsWithCounts(): TopicWithCount[] {
    return Array.from(this.topics.entries()).map(([topicName, topic]) => ({
      topicName,
      protesterCount: topic.protesters.length,
    }));
  }
}
