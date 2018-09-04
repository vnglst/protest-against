import qs from 'query-string'
import isAlpha from 'validator/lib/isAlpha'
import { DEFAULT_TOPIC } from '../../common/config'

export const sanatizeTopic = topic => (isAlpha(topic) ? topic : DEFAULT_TOPIC)

export const getTopicFromQueryString = () => {
  const query = qs.parse(window.location.search).topic || DEFAULT_TOPIC
  return sanatizeTopic(query)
}
