var mongoose  = require('mongoose');

cartSchema = mongoose.Schema({

    userIDFK:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'userMaster'
    },
    totalAmount:{
        type:String
       
    },
    addedOn:{
        type:String,
    },
});
module.exports=mongoose.model("cartMaster",cartSchema);