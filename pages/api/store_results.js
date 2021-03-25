import aws from '../../helpers/aws'
import { v4 as uuidv4 } from 'uuid'

const translate = (expressions) => {
  const data = {}
  expressions.forEach((expression) => {
    data[expression.name] = expression.score
  })
  return data
}

export default async function StorePicture(req, res) {
  const dbClient = new aws.DynamoDB.DocumentClient()
  const expressions = {}
  const measurements = ['initial', 'first-reaction', 'second-reaction']
  measurements.forEach((measurement) => {
    expressions[measurement] = translate(req.body[measurement])
  })
  const params = {
    TableName: process.env.MOOD_LIFTER_TEST_ENV
      ? 'mood-lifter-results-test'
      : 'mood-lifter-results',
    Item: {
      resultId: uuidv4(),
      pictureUrl: req.body.pictureUrl,
      ...expressions
    }
  }
  let response = null
  dbClient.put(params, (err, data) => {
    if (err) {
      console.error('Error', JSON.stringify(err))
      response = res.status(400).json(err)
    } else {
      console.log('YAY!')
      response = res.status(200).json({ success: true })
    }
  })
  return response
}
