var mongoose = require('mongoose');

userRequestStoreSchema = mongoose.Schema({
    userIDFK: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userMaster'
    },
    storeName: {
        type: String,
    },

    location: {
        type: String,
    },
    address: {
        type: String,
    },
    areaIDFK: {
        type: String,
    },
    timming: {
        type: String,
    },
    contactNo: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    addedOn: {
        type: String,
    },

});
module.exports = mongoose.model("userRequestStore", userRequestStoreSchema);