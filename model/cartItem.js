var mongoose  = require('mongoose');

cartItemSchema = mongoose.Schema({
    cartIDFK:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'cartMaster'
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
        type:String
    },
    quantity:{
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
module.exports=mongoose.model("cartItem",cartItemSchema);