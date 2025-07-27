var mongoose  = require('mongoose');

imageSchema = mongoose.Schema({

    foodStoreIDFK:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'foodStoreMaster'
    },

    image:{
        type:String
       
    },
    imageType:{
        type:String
    },
    isActive:{
        type:Boolean,
        default:true
       
    },

    addedOn:{
        type:String,
    },

});
module.exports=mongoose.model("imageMaster",imageSchema);