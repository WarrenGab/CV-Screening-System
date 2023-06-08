const mongoose = require('mongoose');
const collectionName = 'cvScreeningSystem';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: collectionName
        });
        console.log("DB Connected")
    } catch (err) {
        console.log(err.message);
        process.exit(1);
    }
}

module.exports = connectDB;