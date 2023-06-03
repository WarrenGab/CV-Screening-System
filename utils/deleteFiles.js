const fs = require("fs");

const deleteFiles = (reqFiles) => {
    for (let i = 0; i < reqFiles.length; i++) {
        const file = reqFiles[i];
        const path = __basedir + "/uploads/" + file.filename;
        fs.unlink(path, (err) => {
            if (err) {
                console.log(`Failed to unlink file: ${err}`);
            }
        });
    }
}

module.exports = deleteFiles;