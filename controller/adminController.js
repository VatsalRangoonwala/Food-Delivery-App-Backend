var express = require("express");
// const session = require('express-session');
var router = express.Router();
var multer = require("multer");
var user = require("../model/userMaster");
var driver = require("../model/driverMaster");
var foodstore = require("../model/FoodStoreMaster");
var contactus = require("../model/contactusMaster");
var fooditem = require("../model/foodItemMaster");
var city = require("../model/cityMaster");
var area = require("../model/areaMaster");
var foodtype = require("../model/foodTypeMaster");
var feedback = require("../model/feedbackMaster");
var storetype = require("../model/storeTypeMaster");
var img = require("../model/imageMaster");
var reqimg=require("../model/userReqStoreImg");
var reqstore = require("../model/userRequestStore");
var itemrating = require('../model/foodItemRatingMaster');
var storerating = require('../model/foodRatingMaster');
var driverrating = require('../model/driverRatingMaster');
var auth=require('../model/authMaster');
const orderMaster = require("../model/orderMaster");
const orderItem = require("../model/orderItem");

var storage = multer.diskStorage({
  destination: function (req, res, cb) {
    var documentimg = req.body.documentimg;
    var ftypeimg = req.body.ftypeimg;
    var imggallery = req.body.imggallery;
  //  var fstoreimg = req.body.fstoreimg;

    if (documentimg == "driver") {
      cb(null, "./public/upload/driverDocuments");
    } else if (ftypeimg == "ftype") {
      cb(null, "./public/upload/foodTypeImg");
    } else if (imggallery == "gimag") {
      cb(null, "./public/upload/imgGallery");
    } 
    else if (ftypeimg == "ftype") {
      cb(null, './public/upload/foodTypeImg')
      }
    
     else {
      cb(null, "./public/upload/fooditemImg");
    }
  },

  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
var upload = multer({
  storage: storage,

  limits: {
    fileSize: 1024 * 1024 * 20,
  },
  fileFilter: fileFilter,
});



router.get("/", async (req, res) => {

  sess = req.session;
 
  if (sess.email) {
   
const objuserEjs=await user.find({
  isactive:true
});
const objfoodstoreEJS=await foodstore.find({
  isactive:true
});
const objftypeEJS=await foodtype.find({
  isactive:true
});
const objreqstore=await reqstore.find({
  isActive:true
})
    .populate('userIDFK', 'username')
    .populate('areaIDFK', 'areaName')
    .limit(5);
//     for (var i = 0; i < objreqstore.length; i++) {
//     objreqstore[i].user_value = objreqstore[i].userIDFK.username
//     objreqstore[i].area_value = objreqstore[i].areaIDFK.areaName
// }
const objreqimg = await reqimg
    .find({
      isActive: true,
    })
    .populate("foodstoreIdFK", "storeName")
     .populate("userIDFK", "username")
     .limit(3);
    for (var i = 0; i < objreqimg.length; i++) {
      objreqimg[i].store_value = objreqimg[i].foodstoreIdFK.storeName;
      objreqimg[i].user_value = objreqimg[i].userIDFK.username;
    }

//storerating
    const objfoodrating = await storerating.find({
      isactive: true
  })
  .populate('foodstoreIdFK', 'storeName')
  .populate('userIDFK', 'username')
  .limit(4);


      for (var i = 0; i < objfoodrating.length; i++) {
        objfoodrating[i].store_value = objfoodrating[i].foodstoreIdFK.storeName
        objfoodrating[i].user_value = objfoodrating[i].userIDFK.username
      }

  const objcontactusEjs = await contactus.find({
    isActive:true
  });

     if(sess.user_type === "StoreOwner")
  {

   
  //fooditem
  let objownerfooditem = await fooditem
  .find({
    foodstoreIDFK:sess.objAuth.userIDFK,
    isactive: true,
    
 
  });

//foodtype
 let objstoretype = await storetype
 .find({
  foodstoreIdFK:sess.objAuth.userIDFK,
  isactive: true,
  });


  
  let objownerreqimg = await reqimg
  .find({
    foodstoreIdFK:sess.objAuth.userIDFK,
    isActive: true,
   
  });

var data1=[];

  data1["fooditem"]=objownerfooditem.length;
  data1["storetype"]=objstoretype.length;
  data1["reqimg"]=objownerreqimg.length;


}


 var data=[];

 data["usercount"]=objuserEjs.length;
 data["user"]=objuserEjs;
 data["foodstorecount"]=objfoodstoreEJS.length;
 data["foodtypecount"]=objftypeEJS.length;
 data["reqstorecount"]=objreqstore.length;
 data["reqimg"]=objreqimg;
 data["foodrating"]=objfoodrating;
 data["reqstore"]=objreqstore;
 data["contactcount"]=objcontactusEjs.length;
 data["contact"]=objcontactusEjs;
//  data["fooditem"]=objownerfooditem.length;
//  data["storetype"]=objstoretype.length;
//  data["reqimg"]=objownerreqimg.length;




 
  res.render("index",{"data":data,objauth:req.session.user_type,"data1":data1});
}else {
  res.render('login');
}

});

router.post('/loginEJS', async (req, res) => {

  const objauth = await auth.findOne({
    email: req.body.email, 
    password: req.body.password
  });
  console.log(objauth);
  if (objauth != null) {
      if (objauth.user_type === "Admin") {
        
          sess = req.session;
          sess.email = req.body.email;
          sess.user_type = objauth.user_type;
          // sess.objAuth=objauth;
          res.redirect('/admin');
      }
      else if(objauth.user_type === "StoreOwner"){

        sess = req.session;
          sess.email = req.body.email;
          sess.user_type = objauth.user_type;
          
            sess.objAuth=objauth;
          res.redirect('/admin');

      }
    
      else {
          res.redirect('/admin');
      }
  }else {
      res.redirect('/admin');
  }
});

router.get('/logout',(req,res) => {
  req.session.destroy();
  res.redirect('/admin');
});


router.get("/show-foodstoreowner", async (req, res) => {
    

  const objfoodstoreEJS = await foodstore.find({
    
    _id:sess.objAuth.userIDFK,
    isDeleted: true,
    isactive: true,
  })
     .populate("areaIDFK","areaName");
   for(var i=0;i<objfoodstoreEJS.length;i++)
   {
    objfoodstoreEJS[i].area_value=objfoodstoreEJS[i].areaIDFK.areaName;
   }

  res.render("showFoodStoreowner.html", {
    data: objfoodstoreEJS,
  });
});

router.get("/fetchfoodstoreowner/:id", async (req, res) => {
  const fetchfoodstoreObj = await foodstore.findOne({
    // _id:sess.objAuth.userIDFK,
    _id: req.params.id,
  });
  const fetchAreaObj=await area.find();

  res.render("addFoodStoreOwner.html", {
    operation: "update",
    foodstoreData: fetchfoodstoreObj,
    areaData:fetchAreaObj
  });
});
router.post("/updatefoodstoreownerEJS",upload.single("storeImage"),async (req, res) => {
  console.log(req.body.id);
  if (req.file) 
  {
  const objfoodstore = await foodstore.updateOne(
    {
     
      _id: req.body.id,
    },
    {
      storeName: req.body.storeName,
      location: req.body.location,
      storeAddress: req.body.storeAddress,
      contactNo: req.body.contactNo,
      areaIDFK: req.body.areaIDFK,
      timming: req.body.to +" "+ req.body.from,
      vegNonveg: req.body.vegNonveg,
      storeImage:req.file.filename,
     
    });
    console.log("img"+req.file.filename);
    res.redirect("show-foodstoreowner");
  }
  else {
    const objfoodstore = await foodstore.updateOne(
      { _id: req.body.id },
      {
        storeName: req.body.storeName,
      location: req.body.location,
      storeAddress: req.body.storeAddress,
      contactNo: req.body.contactNo,
      areaIDFK: req.body.areaIDFK,
      timming: req.body.timming,
      vegNonveg: req.body.vegNonveg,
      
      }
    );
    // res.send(objStudent);
    if (objfoodstore != null) {
      res.redirect("show-foodstoreowner");
    } else {
      res.redirect("show-foodstoreowner");
    }
  }
  
 
});

router.post("/deletefoodstoreowner", async (req, res) => {
  const objDeletefoodstore = await foodstore.updateOne({
    _id:sess.objAuth.userIDFK,
    _id: req.body.id,
  },{
    isactive:false
  });

  res.redirect("show-foodstoreowner");
});





// //storeowner
// router.get("/show-storeownerfooditem/:id", async (req, res) => {
//   let objownerfooditem = await fooditem
//     .find({
//       isactive: true,
      
//       foodstoreIDFK: req.params.id,
//     })
//     .populate("foodstoreIDFK", "storeName");

//   for (var i = 0; i < objownerfooditem.length; i++) {
//     objownerfooditem[i].foodstore_value = objownerfooditem[i].foodstoreIDFK.storeName;
//   }
//   res.render("showFoodItem.html", {
//     fooditemData: objownerfooditem,
//     foodstoreData: req.params.id,
//   });
// });







//city API
router.get("/show-city", async (req, res) => {

  const objCityEJS = await city.find({
    isActive: true,
  });
  res.render("showCity.html", {
    data: objCityEJS,
  });
});

//add
router.get("/add-city", async (req, res) => {

  res.render("addCity.html", {
    operation: "insert",
   
  });
});

router.post("/addCityEJS", async (req, res) => {
  const objCity = new city();
  (objCity.cityName = req.body.cityName),
    (objCity.addedOn = new Date()),
    (objCity.isActive = true);
  inserted = await objCity.save();

  res.redirect("show-city");
});

//fetchby id
router.get("/fetchCity/:id", async (req, res) => {
  const objCity = await city.findOne({
    _id: req.params.id,
  });
  res.render("addCity.html", {
    operation: "update",
    cityData: objCity,
   
  });
});
//update
router.post("/updateCityEJS", async (req, res) => {
  console.log(req.body.id);

  const objCity = await city.updateOne(
    {
      _id: req.body.id,
    },
    {
      cityName: req.body.cityName,
    }
  );
  res.redirect("show-city");
});
//delete
router.post("/deleteCity", async (req, res) => {
  console.log(req.body.id);
  const objDeleteCity = await city.updateOne(
    {
      _id: req.body.id,
    },
    {
      isActive: false,
    }
  );
  res.redirect("show-city");
});

//Area API

//showArea
router.get("/show-area", async (req, res) => {
  let objArea = await area
    .find({
      isActive: true,
    })
    .populate("cityIDFK", "cityName");

  for (var i = 0; i < objArea.length; i++) {
    objArea[i].city_value = objArea[i].cityIDFK.cityName;
  }
  res.render("showArea.html", {
    data: objArea,
  });
});
router.get("/fetchArea/:id", async (req, res) => {
  const fetchAreaObj = await area.findOne({
    _id: req.params.id,
  });
  const fetchcityobj = await city.find();
  res.render("addArea.html", {
    operation: "update",
    areaData: fetchAreaObj,
    cityData: fetchcityobj,
  });
});
//add
router.get("/add-area", async (req, res) => {
  // res.render("views/addStudent.html",{"data":" "});
  const objcity = await city.find({ isActive: true });
  res.render("addArea.html", {
    operation: "insert",
    cityData: objcity,
  });
});
router.post("/addAreaEJS", async (req, res) => {
  var response = [];

  // console.log(req.file + "FileName")
  objArea = new area();
  (objArea.areaName = req.body.areaName),
    (objArea.cityIDFK = req.body.cityIDFK),
    (objArea.isActive = true),
    (objArea.addedOn = new Date());
  var inserted = await objArea.save();
  res.redirect("show-area");
});

//update
router.post("/updateAreaEJS", async (req, res) => {
  const objArea = await area.updateOne(
    {
      _id: req.body.id,
    },
    {
      areaName: req.body.areaName,
      cityIDFK: req.body.cityIDFK,
    }
  );

  res.redirect("show-area");
});
//delete
router.post("/deleteArea", async (req, res) => {
  console.log(req.body.id);
  const objDeleteArea = await area.updateOne(
    {
      _id: req.body.id,
    },
    {
      isActive: false,
    }
  );
  res.redirect("show-area");
});

//show user
router.get("/show-user", async (req, res) => {

  const objuserEjs = await user.find({
    isactive:true
  });


  
  res.render("showUser.html", {
    data: objuserEjs, 
  });
});

router.post("/deleteuser", async (req, res) => {
  console.log(req.body.id);
  const objDeleteuser = await user.updateOne(
    {
      _id: req.body.id,
    },
    {
      isactive: false,
    }
  );
  res.redirect("show-user");
});


// router.get('/fetchUser/:id', async (req, res) => {
//     const fetchUserObj = await user.findOne({
//         _id: req.params.id
//     });

//     res.render("addUser.html", {
//         operation: "update",
//         userData: fetchUserObj
//     });
// });
// router.post('/updateUserEJS',upload.single('user_image'), async (req, res) => {
//     console.log(req.body.id)
//     if (req.file) {
//         const objUser = await user.updateOne({
//             _id: req.body.id
//         }, {
//             username: req.body.username,
//             emailid: req.body.emailid,
//             address: req.body.address,
//             mobileno: req.file.mobileno,
//             profile: req.file.filename,
//             addedOn: req.body.addedOn

//         });
//         // console.log(mobileno)
//         // res.send(objTeacher)
//         res.redirect("show-user");
//     } else {

//         const objUser = await user.updateOne({
//             _id: req.body.id
//         }, {
//             username: req.body.username,
//             emailid: req.body.emailid,
//             address: req.body.address,
//             mobileno: req.file.mobileno,
//             profile: req.file.filename,
//             addedOn: req.body.addedOn
//         });
//         // res.send(objTeacher)
//         res.redirect("show-User");
//     }
// });

//add driver

router.get("/show-driver", async (req, res) => {
  const objDriverEJS = await driver.find({
    isActive: true,
  });
  res.render("showDriver.html", {
    data: objDriverEJS,
  });
});

//add
router.get("/add-driver", async (req, res) => {
  res.render("addDriver.html", {
    operation: "insert",
  });
});

router.post("/addDriverEJS", upload.single("documents"), async (req, res) => {
  const objDriver = new driver();
  (objDriver.driverName = req.body.driverName),
    (objDriver.email = req.body.email),
    (objDriver.mobile = req.body.mobile),
    (objDriver.gender = req.body.gender),
    (objDriver.documents = req.file.filename),
    (objDriver.dob = req.body.dob),
    (objDriver.addedOn = new Date()),
    (objDriver.is_active = true);
  inserted = await objDriver.save();

  res.redirect("show-driver");
});

//fetchby id
router.get("/fetchDriver/:id", async (req, res) => {
  const objDriver = await driver.findOne({
    _id: req.params.id,
  });
  res.render("addDriver.html", {
    operation: "update",
    driverData: objDriver,
  });
});
//update
router.post(
  "/updateDriverEJS",
  upload.single("documents"),
  async (req, res) => {
    console.log(req.body.id);
    if (req.file) {
      const objDriver = await driver.updateOne(
        { _id: req.body.id },
        {
          driverName: req.body.driverName,
          email: req.body.email,
          mobile: req.body.mobile,
          gender: req.body.gender,
          documents: req.file.filename,
          dob: req.body.dob,
        }
      );
      res.redirect("show-driver");
    } else {
      const objDriver = await driver.updateOne(
        { _id: req.body.id },
        {
          driverName: req.body.driverName,
          email: req.body.email,
          mobile: req.body.mobile,
          gender: req.body.gender,
          dob: req.body.dob,
        }
      );
      // res.send(objTeacher)
      res.redirect("show-driver");
    }
  }
);
//delete
router.post("/deleteDriver", async (req, res) => {
  console.log(req.body.id);
  const objDeleteDriver = await driver.updateOne(
    {
      _id: req.body.id,
    },
    {
      isActive: false,
    }
  );
  res.redirect("show-driver");
});

//add food store



router.get("/add-foodstore", async (req, res) => {
  const objArea=await area.find({isactive:true});
  res.render("addFoodStore.html", {
    operation: "insert",
    areaData:objArea,
    foodstoreData: req.params.id,
  });
});
//add food store
router.post(
  "/addfoodstoreEJS",
  upload.fields([{ name: "image" },{ name: "menu" },{ name: "storeImage" }]),
  async (req, res) => {

    var response =[];

    const objfoodstore = new foodstore();
    (objfoodstore.storeName = req.body.storeName),
      (objfoodstore.location = req.body.location),
      (objfoodstore.storeAddress = req.body.storeAddress),
      (objfoodstore.contactNo = req.body.contactNo),
      (objfoodstore.areaIDFK = req.body.areaIDFK),
      (objfoodstore.timming = req.body.to + " "+ req.body.from),
      (objfoodstore.vegNonveg = req.body.vegNonveg),
      (objfoodstore.storeImage = req.files["storeImage"][0].filename),
      (objfoodstore.addedOn = new Date()),
      (objfoodstore.isactive = true);
    objfoodstore.isDeleted = true;
    var inserted = await objfoodstore.save();

    
//imagemaste
    var images = req.files["image"];
    var menuImages = req.files["menu"];

    images.forEach(async (element) => {
      objimg = new img();
      objimg.foodStoreIDFK = inserted._id.toString(),
        objimg.image = element.filename,
        objimg.imageType = "store",
        objimg.isActive = true,
        objimg.addedOn = new Date();
        console.log(objimg);
      insert = await objimg.save();
    });

    menuImages.forEach(async (element) => {
        objimg = new img();
        objimg.foodStoreIDFK = inserted._id.toString(),
          objimg.image = element.filename,
          objimg.imageType = "menu",
          objimg.isActive = true,
          objimg.addedOn = new Date();
          console.log(objimg);
        insert = await objimg.save();
      });


        res.redirect("show-foodstore");
  }
);

//shore image galley
router.get("/show-storeimg/:id", async (req, res) => {
  let objimg = await img
    .find({
      isactive: true,
      foodStoreIDFK: req.params.id,
      imageType : "store",
    })
    .populate("foodStoreIDFK", "storeName");

  for (var i = 0; i < objimg.length; i++) {
    objimg[i].storeimg_value = objimg[i].foodStoreIDFK.storeName;
  }
  res.render("showImage.html", {
    imgData: objimg,
    foodstoreData: req.params.id,
  });
});

//menu image
router.get("/show-menuimg/:id", async (req, res) => {
    let objimg = await img
      .find({
        isactive: true,
        foodStoreIDFK: req.params.id,
        imageType : "menu",
      })
      .populate("foodStoreIDFK", "storeName");
  
    for (var i = 0; i < objimg.length; i++) {
      objimg[i].storeimg_value = objimg[i].foodStoreIDFK.storeName;
    }
    res.render("showMenu.html", {
      imgData: objimg,
      foodstoreData: req.params.id,
    });
  });


//owner
  



  //show foodstoe
router.get("/show-foodstore", async (req, res) => {

  const objfoodstoreEJS = await foodstore.find({
    isDeleted: true,
    isactive: true,
  })
     .populate("areaIDFK","areaName");
   for(var i=0;i<objfoodstoreEJS.length;i++)
   {
    objfoodstoreEJS[i].area_value=objfoodstoreEJS[i].areaIDFK.areaName;
   }

  res.render("showFoodStore.html", {
    data: objfoodstoreEJS,
  });
});

router.get("/fetchfoodstore/:id", async (req, res) => {
  const fetchfoodstoreObj = await foodstore.findOne({
    _id: req.params.id,
  });
  const fetchAreaObj=await area.find();

  res.render("addFoodStore.html", {
    operation: "update",
    foodstoreData: fetchfoodstoreObj,
    areaData:fetchAreaObj
  });
});

router.post("/updatefoodstoreEJS",upload.single("storeImage"),async (req, res) => {
  console.log(req.body.id);
  if (req.file) 
  {
  const objfoodstore = await foodstore.updateOne(
    {
      _id: req.body.id,
    },
    {
      storeName: req.body.storeName,
      location: req.body.location,
      storeAddress: req.body.storeAddress,
      contactNo: req.body.contactNo,
      areaIDFK: req.body.areaIDFK,
      timming: req.body.to +" "+ req.body.from,
      vegNonveg: req.body.vegNonveg,
      storeImage:req.file.filename,
     
    });
    console.log("img"+req.file.filename);
    res.redirect("show-foodstore");
  }
  else {
    const objfoodstore = await foodstore.updateOne(
      { _id: req.body.id },
      {
        storeName: req.body.storeName,
      location: req.body.location,
      storeAddress: req.body.storeAddress,
      contactNo: req.body.contactNo,
      areaIDFK: req.body.areaIDFK,
      timming: req.body.timming,
      vegNonveg: req.body.vegNonveg,
      
      }
    );
    // res.send(objStudent);
    if (objfoodstore != null) {
      res.redirect("show-foodstore");
    } else {
      res.redirect("show-foodstore");
    }
  }
  //console.log(teacher_mobileno)
  // res.send(objTeacher)
 
});
router.post("/deletefoodstore", async (req, res) => {
  const objDeletefoodstore = await foodstore.updateOne({
    _id: req.body.id,
  },{
    isactive:false
  });

  res.redirect("show-foodstore");
});

//food sto to food item

// router.get('/fetchfoodstoretoitem/:id', async (req, res) => {
//     const fetchfooditemObj = await fooditem.findOne({
//         _id: req.params.id
//     });

//     res.render("showFoodItem.html", {
//         fooditemData: fetchfooditemObj
//     });
// });

//add foodsto item
// router.get('/addstorefooditem/:id', async (req, res) => {
//     const fetchfooditemObj = await fooditem.find({
//         _id: req.params.id
//     });
//     const fetchfoodstoreObj = await foodstore.findOne({ _id: req.params.id});

//     res.render("addFoodItem.html", {
//         operation: "insert",
//         fooditemData:fetchfooditemObj,
//         foodstoreData: fetchfoodstoreObj
//     });
// });

//food item
router.get("/add-fooditem/:id", async (req, res) => {
  res.render("addFoodItem.html", {
    operation: "insert",
    foodstoreData: req.params.id,
  });
});

router.post("/addfooditemEJS", upload.single("image"), async (req, res) => {
  var response = [];
  objfooditem = new fooditem();

  (objfooditem.name = req.body.name),
    (objfooditem.foodstoreIDFK = req.body.foodstoreIDFK),
    //console.log("foodstoreIDFK"+req.body.foodstoreIDFK);
    (objfooditem.price = req.body.price),
    (objfooditem.image = req.file.filename),
    (objfooditem.addedOn = new Date()),
    (objfooditem.is_active = true);
  console.log(objfooditem);
  inserted = await objfooditem.save();
  // console.log(inserted);
  res.redirect("show-fooditem/" + objfooditem.foodstoreIDFK);
});

router.get("/show-fooditem/:id", async (req, res) => {
  let objfooditem = await fooditem
    .find({
      isactive: true,
      foodstoreIDFK: req.params.id,
    })
    .populate("foodstoreIDFK", "storeName");

  for (var i = 0; i < objfooditem.length; i++) {
    objfooditem[i].foodstore_value = objfooditem[i].foodstoreIDFK.storeName;
  }
  res.render("showFoodItem.html", {
    fooditemData: objfooditem,
    foodstoreData: req.params.id,
  });
});

router.get("/fetchfooditem/:id", async (req, res) => {
  const fetchfooditemObj = await fooditem.findOne({
    _id: req.params.id,
  });
  const fetchfoodstoreObj = await foodstore.find();

  res.render("addFoodItem.html", {
    operation: "update",
    fooditemData: fetchfooditemObj,
    foodstoreData: fetchfoodstoreObj,
  });
});

router.post("/updatefooditemEJS", upload.single("image"), async (req, res) => {
  if (req.file) 
  {

    const objfooditem = await fooditem.updateOne(
      { _id: req.body.id },
      {
        name: req.body.name,
        foodstoreIDFK: req.body.foodstoreIDFK,
        price: req.body.price,
        image: req.file.filename,
      }
    );
    // res.send(objStudent);
    if (objfooditem != null) {
      res.redirect("show-fooditem");
    } else {
      res.redirect("show-fooditem");
    }
  } else {
    const objfooditem = await fooditem.updateOne(
      { _id: req.body.id },
      {
        name: req.body.name,
        foodstoreIDFK: req.body.foodstoreIDFK,
        price: req.body.price,
      }
    );
    // res.send(objStudent);
    if (objfooditem != null) {
      res.redirect("show-fooditem");
    } else {
      res.redirect("show-fooditem");
    }
  }
});
router.post("/deletefooditem", async (req, res) => {
  const objDeletefooditem = await fooditem.updateOne({
    _id: req.body.id,
  },{
    isactive:false
  });

  res.redirect("show-fooditem/"+req.body.foodstoreIDFK);
});

//foodType master
router.get("/show-foodtype", async (req, res) => {
  const objftypeEJS = await foodtype.find({
    isactive: true,
  });
  res.render("showfoodType.html", {
    data: objftypeEJS,
  });
});

//add
router.get("/add-foodtype", async (req, res) => {
  res.render("addfoodType.html", {
    operation: "insert",
  });
});

router.post(
  "/addfoodtypeEJS",
  upload.fields([{ name: "pinImage" }, { name: "image" }]),
  async (req, res) => {
    const objFtype = new foodtype();
    (objFtype.type = req.body.type),
      (objFtype.pinImage = req.files["pinImage"][0].filename),
      (objFtype.image = req.files["image"][0].filename),
      (objFtype.addedOn = new Date()),
      (objFtype.isactive = true);
    inserted = await objFtype.save();

    res.redirect("show-foodtype");
  }
);

//fetchby id
router.get("/fetchfoodType/:id", async (req, res) => {
  const objftype = await foodtype.findOne({
    _id: req.params.id,
  });
  res.render("addfoodType.html", {
    operation: "update",
    foodTypeData: objftype,
  });
});
//update
router.post(
  "/updatefoodTypeEJS",
  upload.fields([{ name: "pinImage" }, { name: "image" }]),
  async (req, res) => {
    console.log(req.body.id);
    if (req.files["pinImage"] && req.files["image"]) {
      const objfoodtype = await foodtype.updateOne(
        { _id: req.body.id },
        {
          type: req.body.type,
          pinImage: req.files["pinImage"][0].filename,
          image: req.files["image"][0].filename,
          dob: req.body.dob,
        }
      );
      res.redirect("show-foodType");
    } else if (req.files["pinImage"]) {
      const objfoodtype = await foodtype.updateOne(
        { _id: req.body.id },
        {
          type: req.body.type,
          pinImage: req.files["pinImage"][0].filename,
          dob: req.body.dob,
        }
      );
      res.redirect("show-foodType");
    } else if (req.files["image"]) {
      const objfoodtype = await foodtype.updateOne(
        { _id: req.body.id },
        {
          type: req.body.type,
          pinImage: req.files["image"][0].filename,
          dob: req.body.dob,
        }
      );
      res.redirect("show-foodType");
    } else {
      const objfoodtype = await foodtype.updateOne(
        {
          _id: req.body.id,
        },
        {
          type: req.body.type,
        }
      );
      res.redirect("show-foodType");
    }
  }
);
//delete
router.post("/deletefoodType", async (req, res) => {
  console.log(req.body.id);
  const objDeleteDriver = await foodtype.updateOne(
    {
      _id: req.body.id,
    },
    {
      isactive: false,
    }
  );
  res.redirect("show-foodtype");
});

//contactus
router.get("/show-contactus", async (req, res) => {
  const objcontactusEjs = await contactus.find({
    isActive:true});
  res.render("showContactus.html", {
    data: objcontactusEjs,
  });
});
//show Feedback
router.get("/show-feedback", async (req, res) => {
  let objfeedback = await feedback
    .find({
      isactive: true,
    })
    .populate("userIDFK", "username");

  for (var i = 0; i < objfeedback.length; i++) {
    objfeedback[i].user_value = objfeedback[i].userIDFK.username;
  }
  res.render("showFeedback.html", 
  { 
    data: objfeedback });
});



//store type
// router.get("/show-storetype", async (req, res) => {
//   let objstoretype = await storetype
//     .find({
//       isActive: true,
//     })
//     .populate("foodstoreIdFK", "storeName")
//     .populate("foodtypeIdFK", "type");

//   for (var i = 0; i < objstoretype.length; i++) {
//     objstoretype[i].foodstore_value = objstoretype[i].foodstoreIdFK.storeName;
//     objstoretype[i].foodtype_value = objstoretype[i].foodtypeIdFK.type;
//   }
//   res.render("showStoreType.html", {
//     data: objstoretype,
//   });
// });

// router.get("/fetchstoretype/:id", async (req, res) => {
//   const fetchstoretypeObj = await storetype.findOne({
//     _id: req.params.id,
//   });

//   const fetchfoodstoreobj = await foodstore.find();
//   const fetchfoodtypeobj = await foodtype.find();
//   res.render("addStoretype.html", {
//     operation: "update",
//     storetypeData: fetchstoretypeObj,
//     foodstoreData: fetchfoodstoreobj,
//     foodtypeData: fetchfoodtypeobj,
//   });
// });
//add
// router.get("/add-storetype", async (req, res) => {
//   // res.render("views/addStudent.html",{"data":" "});
//   const objfoodstore = await foodstore.find({ isActive: true });
//   const objfoodtype = await foodtype.find({ isActive: true });

//   res.render("addStoretype.html", {
//     operation: "insert",
//     foodstoreData: objfoodstore,
//     foodtypeData: objfoodtype,
//   });
// });
// router.post("/addstoretypeEJS", async (req, res) => {
//   var response = [];

//   // console.log(req.file + "FileName")
//   objstoretype = new storetype();

//   (objstoretype.foodtypeIdFK = req.body.foodtypeIdFK),
//     (objstoretype.foodstoreIdFK = req.body.foodstoreIdFK),
//     (objArea.is_active = true),
//     (objArea.added_on = new Date());
//   var inserted = await objstoretype.save();
//   res.redirect("show-storetype");
// });




//store type:
router.get("/show-storetype/:id", async (req, res) => {
  let objstoretype = await storetype
    .find({
      isactive: true,
      foodstoreIdFK: req.params.id,
      
    })
    .populate("foodstoreIdFK", "storeName")
    .populate("foodtypeIdFK", "type");

  for (var i = 0; i < objstoretype.length; i++) {
    objstoretype[i].foodstore_value = objstoretype[i].foodstoreIdFK.storeName;
    objstoretype[i].foodtype_value = objstoretype[i].foodtypeIdFK.type;
  }
  res.render("showStoretype.html", {
    storetypeData: objstoretype,
    foodstoreData: req.params.id,
  });
});

// add store type

router.get("/add-storetype/:id", async (req, res) => {
   const objfoodtype=await  foodtype.find();
  res.render("addStoreType.html", {
    operation: "insert",
    foodstoreData: req.params.id,
    // storetypeData:objstoretype,
    foodtypeData: objfoodtype,
  });
});


router.post("/addStoreTypeEJS", async (req, res) => {
  var response = [];
  objstoretype = new storetype();

    (objstoretype.foodtypeIdFK = req.body.foodtypeIdFK),
    (objstoretype.foodstoreIdFK = req.body.foodstoreIdFK),
    (objstoretype.addedOn = new Date()),
    (objstoretype.is_active = true);
  console.log(objstoretype);
  inserted = await objstoretype.save();
  // console.log(inserted);
  res.redirect("show-storetype/" + objstoretype.foodstoreIdFK);
});

//delete
router.post("/deletestoretype", async (req, res) => {
  const objDeletestoretype = await storetype.updateOne({
    _id: req.body.id,
  },{
    isactive:false
  }
  );

  res.redirect("show-storetype/"+req.body.foodstoreIdFK);
});

//requested image
router.get("/show-reqimg/:id", async (req, res) => {
  let objreqimg = await reqimg
    .find({
      isActive: true,
      foodstoreIdFK: req.params.id,
    })
    .populate("foodstoreIdFK", "storeName")
    .populate("userIDFK", "username");
  
  for (var i = 0; i < objreqimg.length; i++) {
    objreqimg[i].store_value = objreqimg[i].foodstoreIdFK.storeName;
    objreqimg[i].user_value = objreqimg[i].userIDFK.username;
  }
  res.render("showRequestedImg.html", {
    ReqimgData: objreqimg,
    foodstoreData: req.params.id,
  });
});

//deletereqimg
router.post("/deletereqimg", async (req, res) => {
  const objDeletereqimg = await reqimg.updateOne({
    _id: req.body.id,
  },{
    isActive:false
  }
  );

  res.redirect("show-reqimg/"+req.body.foodstoreIdFK);
});

//reqimgdelete and add
//left
router.post("/approvereqimg/:id",upload.single("Image"), async (req, res) => {

  var response = [];
  // let objreqimg = await reqimg
  //   .find({
  //     isActive: true,
  //     // foodstoreIdFK: req.params.id,
      

  //   });

 const objreqimg = new reqimg();
    objreqimg.Image = req.file.filename;
//   objreqimg.userIDFK = req.body.userIDFK;
//   objreqimg.foodstoreIdFK = req.body.foodstoreIdFK;
//   objreqimg.isActive = new Date();

  const objimg = new img();
  
  objimg.imageType = "store";
  objimg.image = req.file.filename;
  objreqimg.foodStoreIDFK = req.body.foodStoreIDFK;
  objimg.isActive = true;
  objimg.addedOn =new Date();
  
  inserted = await objimg.save();


  const objapprovereqimg = await reqimg.updateOne({
    _id: req.body.id,
  },{
    isActive:false
  }
  );

  res.redirect("show-reqimg/"+req.body.foodstoreIdFK);
});




//userReqStore
router.get('/show-userReqStore', async (req, res) => {

  const  objuser = await user.find({
    isActive: true,
  });
  let objreqstore = await reqstore.find({
        isActive: true
      })
      .populate('userIDFK', 'username')
      .populate('areaIDFK', 'areaName')

  //console.log(objreqstore);

  for (var i = 0; i < objreqstore.length; i++) {
      objreqstore[i].user_value = objreqstore[i].userIDFK.username
      objreqstore[i].area_value = objreqstore[i].areaIDFK.areaName
  }
  res.render("showReqStore.html", {
      "data": objreqstore
  });
});

router.get("/fetchReqStore/:id", async (req, res) => {
  const objreqstore = await reqstore.findOne({
    _id: req.params.id,
  });
  const AreaObj = await area.find();
  const userObj = await user.find();
  res.render("addReqStore.html", {
    operation: "update",
    reqstoreData: objreqstore,
    areaData:AreaObj,
    userData:userObj
  });
});
//update
router.post("/updateReqStoreEJS", async (req, res) => {
 
     const objreqstore = await reqstore.updateOne(
      
      { _id: req.body.id, 
      },
      {
        userIDFK:req.body.userIDFK,
        storeName: req.body.storeName,
        location:req.body.location,
        address:req.body.address,
        areaIDFK:req.body.areaIDFK,
       // timming:objreqstore.to +" "+objreqstore.from,
        contactNo:req.body.contactNo,
        
      }
     
     
    
    );
     objfoodstore=new foodstore();
  objfoodstore.storeName=req.body.storeName,
    objfoodstore.location=req.body.location;
     objfoodstore.storeAddress=req.body.storeAddress;
     objfoodstore.contactNo=req.body.contactNo;
   objfoodstore.areaIDFK=req.body.areaIDFK;
    objfoodstore.timming=req.body.to +" "+req.body.from;
   objfoodstore.addedOn = new Date(),
    objfoodstore.isactive = true;
   objfoodstore.isDeleted = true;

  insert = await objfoodstore.save();


  objuser = new user();
  objuser.username = insert.storeName,
      objuser.emailid = insert.storeName+'@gmail.com',
      objuser.address = "",
      objuser.mobileno = insert.contactNo,
      objuser.profile ="",
      objuser.isactive = true,
      objuser.addedOn = new Date()
  var inserted = await objuser.save();

  //auth insert
  objAuth = new auth();
 
  objAuth.user_type = "StoreOwner",
      objAuth.userIDFK = insert._id,
      objAuth.email = inserted.emailid;
      objAuth.password =inserted.mobileno,
      objAuth.added_on = new Date(),
     // console.log(inserted.student_fname);

  insertedAuth = await objAuth.save();



    
   console.log("id"+ req.body.id);
   const objDeletereqstore = await reqstore.updateOne({
    _id: req.body.id,
  },{
    isActive:false
  }
  );
      res.redirect("show-foodstore");
     
    }
  
);



//food Itam rating
//show
router.get('/show-fooditemrating', async (req, res) => {
  let objitemrating = await itemrating.find({
          isActive: true
      }).populate('foodItemIDFK', 'name')
      .populate('userIDKF', 'username')

  for (var i = 0; i < objitemrating.length; i++) {
      objitemrating[i].item_value = objitemrating[i].foodItemIDFK.name
      objitemrating[i].user_value = objitemrating[i].userIDKF.username
  }
  res.render("showFoodItemRating.html", {
      "data": objitemrating
  });
});
//delete
router.post('/deleteFoodItemRating', async (req, res) => {
  console.log(req.body.id)
  const objDeletefooditem = await itemrating.updateOne({
      _id: req.body.id
  }, {
      isActive: false
  });
  res.redirect("show-fooditemrating");
});
//foodstore rating
// show
router.get('/show-storerating', async (req, res) => {
  let objfoodrating = await storerating.find({
          isactive: true
      })
      .populate('foodstoreIDFK', 'storeName')
      .populate('userIDFK', 'username')


  for (var i = 0; i < objfoodrating.length; i++) {
      objfoodrating[i].store_value = objfoodrating[i].foodstoreIDFK.storeName
      objfoodrating[i].user_value = objfoodrating[i].userIDFK.username
  }
  res.render("showFoodStoreRating.html", {
      "data": objfoodrating
  });
});

//delete store rating
router.post('/deleteStoreRating', async (req, res) => {
  console.log(req.body.id)
  const objDeletefoodStore = await storerating.updateOne({
      _id: req.body.id
  }, {
      isActive: false
  });
  res.redirect("show-storerating");
});


router.get('/show-driverRating/:id', async (req, res) => {
  let objdriverrating = await driverrating.find({
          isActive: true,
          driverIdFK: req.params.id,

      }).populate('driverIdFK', 'driverName')
      .populate('userIDFK', 'username')

  console.log(objdriverrating);

  for (var i = 0; i < objdriverrating.length; i++) {
      objdriverrating[i].driver_value = objdriverrating[i].driverIdFK.driverName
      objdriverrating[i].user_value = objdriverrating[i].userIDFK.username
  }
  res.render("showDriverRating.html", {
      "data": objdriverrating,
      driverData: req.params.id
  });
});
// delete
router.post('/deleteDriverRating', async (req, res) => {
  console.log(req.body.id)
  const objDeletedriverrating = await driverrating.updateOne({
      _id: req.body.id
  }, {
      isActive: false
  });
  res.redirect("show-driverRating");
});



//img add
router.get("/add-img/:id", async (req, res) => {
  res.render("showImage",
   {
    foodstoreData: req.params.id,
  });
});

router.post("/addImgEJS",
  upload.fields([{ name: "image" }]),
  async (req, res) => {

    var response =[];  
//imagemaste
    var images = req.files["image"];
    // var menuImages = req.files["menu"];

    images.forEach(async (element) => {
      objimg = new img();
      objimg.foodStoreIDFK = req.body.foodStoreIDFK,
        objimg.image = element.filename,
        objimg.imageType = "store",
        objimg.isActive = true,
        objimg.addedOn = new Date();
        console.log(objimg);
      insert = await objimg.save();
    });
    res.redirect("show-storeimg/"+objimg.foodStoreIDFK);


       
  }
);

//add menuImages
router.get("/add-menuimg/:id", async (req, res) => {
  res.render("showImage",
   {
    foodstoreData: req.params.id,
  });
});

router.post("/addmenuImgEJS",
  upload.fields([{ name: "image" }]),
  async (req, res) => {

    var response =[];  
//imagemaste
    var images = req.files["image"];
    
  
    images.forEach(async (element) => {
        objimg = new img();
        objimg.foodStoreIDFK = req.body.foodStoreIDFK,
          objimg.image = element.filename,
          objimg.imageType = "menu",
          objimg.isActive = true,
          objimg.addedOn = new Date();
          console.log(objimg);
        insert = await objimg.save();
      });
      res.redirect("show-menuimg/"+objimg.foodStoreIDFK);

       
  }
);

router.get('/getAllordermaster', async (req, res) => {
  const objOrder= await orderMaster.find()
  .populate('userIDFK',['username','address','mobileno'])
  .populate('addressIDFK','address')


  var orderData=[];
  for(const order of objOrder){
    console.log(order);
      let objOrderItem = await orderItem.findOne({
          orderIDFK: order._id,
          isActive:true,
      }).populate('foodStoreIDFK', ['storeName','storeAddress','storeImage'])


      console.log(objOrderItem);
      
      console.log('orderid '+order._id);
  var convertedJSON = JSON.parse(JSON.stringify(order));
  
  convertedJSON.user_value = order.userIDFK.username
  convertedJSON.address_value = order.addressIDFK.address
  convertedJSON.store_value = objOrderItem.foodStoreIDFK.storeName
   console.log(convertedJSON);
  orderData.push(convertedJSON);
  }    
  
  res.render("showOrder.html", {
      "data": orderData,
      
    
  });
});



router.get("/getOrderItemByID/:id", async (req, res) => {
  const objOrderItem = await orderItem.find({
     
      orderIDFK: req.params.id

  }).populate('foodItemIDFK', ['name', 'image', 'price'])
  .populate('foodStoreIDFK', ['storeName','storeAddress'])  
  .populate('orderIDFK',['totalAmount','status']); 

  for (var i = 0; i < objOrderItem.length; i++) 
  {
    objOrderItem[i].item_value = objOrderItem[i].foodItemIDFK.name
    objOrderItem[i].store_value = objOrderItem[i].foodStoreIDFK.storeName
    objOrderItem[i].order_value = objOrderItem[i].orderIDFK.totalAmount
    }

  res.render("showOrderitem.html", {
    "data": objOrderItem,
    

     
  
});

});

module.exports = router;
