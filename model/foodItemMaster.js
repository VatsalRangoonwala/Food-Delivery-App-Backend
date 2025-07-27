var mongoose =require('mongoose');
foodItemSchema=mongoose.Schema({
    name:{
       type:String
    },

    foodstoreIDFK:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'foodStoreMaster',
  },
    price:{
        type:String
    }, 
    image:{
        type:String
    },
    isactive:{
        type:Boolean,
        default:true
    },
    addedOn:{
        type:String
    }
});
module.exports=mongoose.model("foodItemMaster",foodItemSchema);