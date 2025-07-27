
var mongoose  = require('mongoose');

orderItemSchema = mongoose.Schema({

    orderIDFK:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'orderMaster'
    },
    foodStoreIDFK:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'foodStoreMaster'
    },
     foodItemIDFK:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'foodItemMaster'
    },   
    price:{
        type:String,
    },
    qunatity:{
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
module.exports=mongoose.model("orderItem",orderItemSchema);