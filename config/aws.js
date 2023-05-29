const AWS = require('aws-sdk');
const config = require('config');

// Initialize AWS SDK
AWS.config.update({
    accessKeyId: config.get("AWS_ACCESS_KEY_ID"),
    secretAccessKey: config.get("AWS_SECRET_ACCESS_KEY"),
    region: config.get('AWS_REGION')
});
  
const s3 = new AWS.S3();
  
module.exports = s3;