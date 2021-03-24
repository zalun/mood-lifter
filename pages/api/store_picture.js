import aws from '../../helpers/aws'
export default async function StorePicture(req, res) {
  const dbClient = new aws.DynamoDB.DocumentClient()
  const params = {
    TableName: 'mood-lifter-pictures',
    Item: {
      url: req.body.url,
      expressions: req.body.expressions
    }
  }
  console.log(params)
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
