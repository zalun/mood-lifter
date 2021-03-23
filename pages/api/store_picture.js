import aws from 'aws-sdk'
export default async function SignS3(req, res) {
  aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_LIFTER,
    secretAccessKey: process.env.AWS_PASSWORD_LIFTER,
    region: process.env.AWS_REGION_LIFTER,
    signatureVersion: 'v4',
    endpoint: `https://dynamodb.${process.env.AWS_REGION_FILTER}.amazonaws.com`
  })
}
