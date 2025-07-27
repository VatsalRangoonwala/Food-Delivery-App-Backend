
var mongoose  = require('mongoose');

contactusSchema = mongoose.Schema({

    email:{
        type:String
    },
   
     contactno:{
        type:String,
      
    },
  
    name:{
       type:String
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
module.exports=mongoose.model("contactusMaster",contactusSchema);