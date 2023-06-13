const aws = require("aws-sdk");
const fs = require("fs");

const AwsS3Service = {
    async uploadFile(file, filepath) {
        aws.config.update({ region: process.env.AWS_REGION });
        const fileContent = fs.readFileSync(file.path);
        // console.log(file.filename);
        const params = {
            Bucket: "cvscreeningsystem",
            Key: filepath,
            Body: fileContent,
            ContentType: file.mimetype
        };
  
        const s3 = new aws.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });

        try {
            // Upload file to AWS S3
            const data = await s3.upload(params).promise();
            console.log("File uploaded successfully");
            return data.Location; // Return the uploaded file URL
        } catch (err) {
            console.log(err);
            return null; // Return null if an error occurs
        }
    },

    // async downloadFile(filename) {
    //     // Config
    //     aws.config.update({ region: process.env.AWS_REGION });
    //     const params = {
    //         Bucket: "cvscreeningsystem",
    //         Key: filename
    //     }
    //     // Setup AWS Connection
    //     const s3 = new aws.S3({
    //         accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    //         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    //     });
    //     // Get File
    //     try {
    //         const data = await s3.getObject(params).promise();
    //         console.log("File downloaded successfully!");
    //         return data.Body;
    //     } catch (err) {
    //         console.log(err);
    //         return null;
    //     }
    // },

    async deleteFile(fileUrl) {
        // Config
        aws.config.update({ region: process.env.AWS_REGION });
        const filename = getFileNameFromUrl(fileUrl);
        const decodedFilename = decodeURIComponent(filename);
        const params = {
            Bucket: "cvscreeningsystem",
            Key: decodedFilename
        }
        const s3 = new aws.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });

        try {
            await s3.deleteObject(params).promise();
            console.log("File deleted successfully");
            return true;
        } catch (err) {
            console.log(err);
            return false; // Return null if an error occurs
        }
    }
}

function getFileNameFromUrl(fileUrl) {
    // Extract the file name from the file URL
    const urlParts = fileUrl.split("/");
    return urlParts[urlParts.length - 1];
}

module.exports = AwsS3Service;