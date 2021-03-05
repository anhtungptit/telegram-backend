const mongoose = require('mongoose');

const messageSchema = mongoose. Schema({
    username: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("messages", messageSchema);