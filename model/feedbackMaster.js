
var mongoose  = require('mongoose');

feedbackSchema = mongoose.Schema({

    userIDFK:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'userMaster'
    },

   
    message:{
        type:String,
    },
   
    isActive:{
        type:Boolean,
        default:true
       
    },
    addedOn:{
        type:String,
    },
   
});
module.exports=mongoose.model("feedbackMaster",feedbackSchema);