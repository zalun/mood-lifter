import aws from 'aws-sdk'

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_LIFTER,
  secretAccessKey: process.env.AWS_PASSWORD_LIFTER,
  region: process.env.AWS_REGION_LIFTER,
  signatureVersion: 'v4'
})

export default aws
