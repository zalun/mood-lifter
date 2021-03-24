import aws from '../../../helpers/aws'

const ScanDB = (expression) => {
  return new Promise((resolve, reject) => {
    const dbClient = new aws.DynamoDB.DocumentClient()
    const params = {
      TableName: 'mood-lifter-pictures',
      FilterExpression: 'contains(expressions, :expressions)',
      ExpressionAttributeValues: { ':expressions': expression }
    }
    dbClient.scan(params, (err, data) => {
      if (err) {
        console.error('Error', JSON.stringify(err, null, 2))
        reject(err)
      } else {
        resolve(data.Items)
      }
    })
  })
}

export default async function GetPicture(req, res) {
  const { expression } = req.query
  const response = { success: true }
  let code
  let pictures = []
  try {
    pictures = await ScanDB(expression)
  } catch (err) {
    code = 400
  }
  if (!pictures.length) {
    return res.status(code || 404).json(response)
  }
  // get a picture
  // TODO make it intelligent
  response.picture = pictures[Math.floor(Math.random() * pictures.length)]
  return res.status(200).json(response)
}
