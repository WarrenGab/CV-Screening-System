const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __basedir + '/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, `${uuidv4()}-${file.originalname}`);
    }
})

const upload = multer({
    storage: storage,
    fileFilter: function(req, file, callback) {
        if(
            file.mimetype == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
            file.mimetype == "application/pdf"
        ) {
            callback(null, true);
        } else {
            console.log("Only docx & pdf file supported!");
            callback(null, false);
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 1
    }
})

module.exports = upload;