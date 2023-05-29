const aws = require("aws-sdk");
const fs = require("fs");
const config = require('config');

const AwsS3Service = {
    async uploadFile(file, filepath, isPublic) {
        aws.config.update({ region: config.get('AWS_REGION') });
        const fileContent = fs.readFileSync(file.path);
        const params = {
            Bucket: "cvscreeningsystem",
            Key: filepath,
            Body: fileContent,
            ContentType: file.mimetype,
        };
  
        // if (isPublic === true) {
        //     params.ACL = "public-read";
        // }
        const s3 = new aws.S3({
            accessKeyId: config.get("AWS_ACCESS_KEY_ID"),
            secretAccessKey: config.get("AWS_SECRET_ACCESS_KEY"),
        });
        
        s3.upload(params, (err, data) => {
            if (err) {
                console.log(err);
            }
        });
    }
}

module.exports = AwsS3Service;