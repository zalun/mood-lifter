import aws from '../../helpers/aws'

export default async function SignS3(req, res) {
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

  return res.status(200).json(post)
}
