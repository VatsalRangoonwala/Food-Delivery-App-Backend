const dotenv = require("dotenv");
dotenv.config();

var mongoose = require("mongoose");
module.exports = mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("connected");
});