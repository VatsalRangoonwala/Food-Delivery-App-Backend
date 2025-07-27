const { Timestamp } = require('mongodb');
var mongoose  = require('mongoose');

orderMasterSchema = mongoose.Schema({
    userIDFK:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'userMaster'
    },  
     paymentId:{
        type:String,
     },
     paymentType:{
        type:String,
    },
     driverIDFK:{
        type:String,        
    },
  
    addressIDFK:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'addressMaster' 
    },    
    timeEstimate:{
        type:String,
    
    },
    totalAmount:{
        type:String
       
    },
    status:{
        type:String,
    },    
    addedOn:{
        type:String,
    },
    isActive:{
        type:Boolean,
        default:true
    }

});
module.exports=mongoose.model("orderMaster",orderMasterSchema);