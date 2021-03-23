import aws from 'aws-sdk'

export default async function handler (req, res) {
  aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_LIFTER,
    secretAccessKey: process.env.AWS_PASSWORD_LIFTER,
    region: process.env.AWS_REGION_LIFTER,
    signatureVersion: 'v4'
  })

  // console.log(req.body.file.files[0], req.body.expression)
  // const file = req.body.files[0]
  const filename = encodeURIComponent(req.body.file.name)
  const s3 = new aws.S3()
  const post = await s3.createPresignedPost({
    Bucket: process.env.AWS_BUCKET_NAME,
    Fields: {
      key: filename
    },
    Expires: 60, // seconds
    Conditions: [
      ['content-length-range', 0, 1048576] // up to 1 MB
    ]
  })
  console.log(post)
  res.status(200).json({ success: true })
}
