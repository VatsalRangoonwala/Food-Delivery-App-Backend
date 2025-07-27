var mongoose =require('mongoose');
citySchema= mongoose.Schema({    
    cityName:{
        type:String
    },
    isActive:{
        type:Boolean,
        default:true
    },
    addedOn:{
        type:String
    }
});
module.exports=mongoose.model("cityMaster",citySchema);