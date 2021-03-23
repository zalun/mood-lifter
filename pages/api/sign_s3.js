import aws from 'aws-sdk'
export default async function SignS3(req, res) {
  aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_LIFTER,
    secretAccessKey: process.env.AWS_PASSWORD_LIFTER,
    region: process.env.AWS_REGION_LIFTER,
    signatureVersion: 'v4'
  })

  const s3 = new aws.S3()
  const s3Data = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Fields: {
      key: req.query.file
    },
    Expires: 60, // seconds
    Conditions: [
      ['content-length-range', 0, 1048576] // up to 1 MB
    ]
  }
  const post = await s3.createPresignedPost(s3Data)

  res.status(200).json(post)
}
