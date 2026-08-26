const mongoose = require("mongoose");
const dns = require("dns");

// Use reliable public DNS servers for MongoDB SRV resolution
dns.setServers([
    "8.8.8.8",
    "1.1.1.1",
]);

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(
            process.env.MONGODB_URI
        );

        console.log(
            `MongoDB connected: ${connection.connection.host}`
        );
    } catch (error) {
        console.error(
            "MongoDB connection failed:"
        );

        console.error(error.message);

        process.exit(1);
    }
};

module.exports = connectDB;