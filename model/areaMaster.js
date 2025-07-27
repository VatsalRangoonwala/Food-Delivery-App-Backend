var mongoose =require('mongoose');
areaSchema= mongoose.Schema({
    areaName:{
        type:String
    },
    cityIDFK:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'cityMaster',
    },
    isActive:{
        type:Boolean,
        default:true
    },
    addedOn:{
        type:String
    }
});
module.exports=mongoose.model("areaMaster",areaSchema);