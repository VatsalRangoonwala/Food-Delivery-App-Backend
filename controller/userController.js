var express = require("express");
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
var reqimg = require("../model/userReqStoreImg");
var reqstore = require("../model/userRequestStore");
var itemrating = require('../model/foodItemRatingMaster');
var storerating = require('../model/foodRatingMaster');
var driverrating = require('../model/driverRatingMaster');
var auth = require('../model/authMaster');
var bookmark = require('../model/userBookmark');
var storetype = require('../model/storeTypeMaster');
var address = require('../model/addressMaster');
const cartMaster = require("../model/cartMaster");
const cartItem = require("../model/cartItem");
const orderMaster = require("../model/orderMaster");
const orderItem = require("../model/orderItem");

var nodemailer = require('nodemailer');

var storage = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, "./public/upload/imgGallery");

    },

    filename: function (req, file, cb) {
        console.log("FIle Uploaded");
        console.log(file.originalname);
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

//add customer
router.post('/adduser', async (req, res) => {
    var response = [];

    objuser = new user();
    objuser.username = req.body.username,
        objuser.emailid = req.body.emailid,
        objuser.mobileno = req.body.mobileno,
        objuser.isactive = true,
        objuser.addedOn = new Date()
    var inserted = await objuser.save();

    //auth insert
    objAuth = new auth();

    objAuth.user_type = "customer",
        objAuth.userIDFK = inserted._id,
        objAuth.email = inserted.emailid;
    objAuth.password = req.body.password,
        objAuth.added_on = new Date(),
        // console.log(inserted.student_fname);

        insertedAuth = await objAuth.save();
    if (inserted != null) {
        res.json({
            result: "success",
            msg: "User Inserted Successfully",
            data: 1
        });

    } else {
        res.json({
            result: "failure",
            msg: "UnSuccessful",
            data: 0
        });

    }

});


//update
router.post('/updateuser', async (req, res) => {

    const objuser = await user.updateOne({
        _id: req.params.id
    }, {
        username: req.body.username,
        emailid: req.body.emailid,
        address: req.body.address,
        mobileno: req.body.mobileno,

    });
    // res.send(objStudent);
    if (objuser != null) {
        res.json({
            result: "success",
            msg: "User updated Successfully",
            data: 1
        });

    } else {
        res.json({
            result: "failure",
            msg: "UnSuccessful",
            data: 0
        });

    }

});

//delete
router.put('/deleteuser/:id', async (req, res) => {
    const obj = await user.updateOne({
        _id: req.params.id
    }, {

        isactive: false
    });
    res.send(obj);
});

//getByIduser
router.post('/getByIduser', async (req, res) => {
    const objuser = await user.findOne({
        _id: req.body.id,
        isactive: true
    })


    if (objuser != null) {
        res.json({
            result: "success",
            msg: "user List Found",
            data: objuser
        });

    } else {
        res.json({
            result: "failure",
            msg: "user List Not Found",
            data: objuser
        });

    }
});
router.post('/adduser', async (req, res) => {
    var response = [];

    objuser = new user();
    objuser.username = req.body.username,
        objuser.emailid = req.body.emailid,
        objuser.address = "",
        objuser.mobileno = req.body.mobileno,
        objuser.profile = "",
        objuser.isactive = true,
        objuser.addedOn = new Date()
    var inserted = await objuser.save();

    //auth insert
    objAuth = new auth();

    objAuth.user_type = "customer",
        objAuth.userIDFK = inserted._id,
        objAuth.email = inserted.emailid;
    objAuth.password = req.body.password,
        objAuth.added_on = new Date(),
        // console.log(inserted.student_fname);

        insertedAuth = await objAuth.save();
    if (inserted != null) {
        res.json({
            result: "success",
            msg: "User Inserted Successfully",
            data: 1
        });

    } else {
        res.json({
            result: "failure",
            msg: "UnSuccessful",
            data: 0
        });

    }

});

router.post('/updateuserPhoto', upload.single('profile'), async (req, res) => {

    console.log("File");
    console.log(req.file);
    const objuser = await user.updateOne({
        _id: req.body.id
    }, {
        profile: "imgGallery/" + req.file.filename
    });
    if (objuser != null) {
        res.json({
            result: "success",
            msg: "user Photo Updated",
            data: 1
        });
    } else {
        res.json({
            result: "failure",
            msg: "user Photo Not Updated",
            data: 0
        });
    }
});

//reset password



//login

router.post('/loginByUser', async (req, res) => {

    console.log(req.body);
    const objauth = await auth.findOne({
        email: req.body.email,
        password: req.body.password
    });

    console.log(objauth);

    if (objauth != null) {
        res.json({
            result: "success",
            msg: "login Successfully",
            data: objauth
        });
    } else {
        res.json({
            result: "fail",
            msg: "login UnSuccessfuly",
            data: objauth
        });
    }
});

router.get('/getAllUser', async (req, res) => {
    const objuser = await user.find();

    if (objuser != null) {

        res.json({
            result: "success",
            msg: "objuser List Found",
            data: objuser
        });
    } else {
        res.json({
            result: "failure",
            msg: "objuser List Not Found",
            data: objuser
        });
    }
});

//showcity

router.get('/getAllcity', async (req, res) => {
    const objcity = await city.find();

    if (objcity != null) {

        res.json({
            result: "success",
            msg: "objcity List Found",
            data: objcity
        });
    } else {
        res.json({
            result: "failure",
            msg: "objcity List Not Found",
            data: objcity
        });
    }
});

//getarea
router.post('/getarea', async (req, res) => {
    const objarea = await area.find({
        cityIDFK: req.body.cityIDFK,

    }).populate('cityIDFK', 'cityName');

    if (objarea != null) {
        res.json({
            result: "success",
            msg: "area List Found",
            data: objarea
        });
    } else {
        res.json({
            result: "failure",
            msg: "area List Not Found",
            data: objarea
        });
    }
});

//showarea

router.get('/getAllarea', async (req, res) => {
    const objarea = await area.find();

    if (objarea != null) {

        res.json({
            result: "success",
            msg: "area List Found",
            data: objarea
        });
    } else {
        res.json({
            result: "failure",
            msg: "area List Not Found",
            data: objarea
        });
    }
});


//add feedback
router.post('/addfeedback', async (req, res) => {
    var response = [];

    objfeedback = new feedback();
    objfeedback.userIDFK = req.body.userIDFK,
        objfeedback.message = req.body.message,

        objfeedback.isActive = true,
        objfeedback.addedOn = new Date()
    var inserted = await objfeedback.save();


    if (inserted != null) {
        res.json({
            result: "success",
            msg: "feedback Inserted Successfully",
            data: 1
        });

    } else {
        res.json({
            result: "failure",
            msg: "UnSuccessful",
            data: 0
        });

    }

});

//showfoodstore
router.get('/getAllfoodstore', async (req, res) => {
    const objfoodstore = await foodstore.find({
        isactive: true
    });

    if (objfoodstore != null) {

        res.json({
            result: "success",
            msg: "foodstore List Found",
            data: objfoodstore
        });
    } else {
        res.json({
            result: "failure",
            msg: "objcity List Not Found",
            data: objfoodstore
        });
    }
});


router.get('/getAllbookmark', async (req, res) => {
    const objbookmark = await bookmark.find();

    if (objbookmark != null) {

        res.json({
            result: "success",
            msg: "bookmark List Found",
            data: objbookmark
        });
    } else {
        res.json({
            result: "failure",
            msg: "bookmark List Not Found",
            data: objbookmark
        });
    }
});
router.post('/bookmarkByUser', async (req, res) => {

    const objbookmark = await bookmark.find({
            userIDFK: req.body.id,
            isActive: true
        })

        .populate('userIDFK', "username")
        .populate('foodstoreIdFK', ['storeName', 'storeImage', 'vegNonveg', 'isactive'])


    console.log(bookmark);

    if (objbookmark != null) {
        res.json({
            result: "success",
            msg: "bookmark Successfully",
            data: objbookmark
        });
    } else {
        res.json({
            result: "fail",
            msg: "bookmark UnSuccessfuly",
            data: objbookmark
        });
    }
});



//showfooditem

router.get('/getAllfooditem', async (req, res) => {
    const objfooditem = await fooditem.find();

    if (objfooditem != null) {

        res.json({
            result: "success",
            msg: "fooditem List Found",
            data: objfooditem
        });
    } else {
        res.json({
            result: "failure",
            msg: "fooditem List Not Found",
            data: objfooditem
        });
    }
});


//foodstorebytype
router.post('/getstoreBystoretype', async (req, res) => {
    const objstoretype = await storetype.find({
        foodtypeIdFK: req.body.foodtypeIdFK,
        isactive: true
    }).

    populate('foodstoreIdFK', ['storeName', 'storeAddress', 'location']);

    if (objstoretype != null) {
        res.json({
            result: "success",
            msg: "storetype List Found",
            data: objstoretype
        });
    } else {
        res.json({
            result: "failure",
            msg: "storetype List Not Found",
            data: objstoretype
        });
    }
});

router.get('/getAllStoreRating', async (req, res) => {
    const objrating = await storerating.find();

    if (objrating != null) {

        res.json({
            result: "success",
            msg: "storerating List Found",
            data: objrating
        });
    } else {
        res.json({
            result: "failure",
            msg: "storerating List Not Found",
            data: objrating
        });
    }
});







// //adddriver
// router.post('/adddriver', async (req, res) => {
//   var response = [];

//   objdriver= new driver();
//   objdriver.driverName = req.body.userIDFK,
//   objdriver.email = req.body.email,
//   objdriver.mobile=req.body.mobile,
//   objdriver. gender=req.body.gender,
//   objdriver. documents=req.body.documents,
//   objdriver. dob=req.body.dob,
//   objdriver.isActive = true,
//   objdriver.addedOn = new Date()
//   var inserted = await objdriver.save();


//   if (inserted != null) {
//       res.json({ result: "success", msg: "driver Inserted Successfully", data: 1 });

//   } else {
//       res.json({ result: "failure", msg: "UnSuccessful", data: 0 });

//   }

// });


//address
router.post('/addAddress', async (req, res) => {

    const objAdd = await address.find({
        userIDFK: req.body.userIDFK,
        isDefault: true
    });

    console.log(objAdd.length);
    if (objAdd.length === 0) {
        var objaddress = new address();
        objaddress.address = req.body.address,
            objaddress.userIDFK = req.body.userIDFK,
            objaddress.cityName = req.body.cityName,
            objaddress.areaName = req.body.areaName,
            objaddress.isdefault = true,
            objaddress.isactive = true,
            objaddress.addedOn = new Date()

        const inserted = await objaddress.save();

        if (inserted != null) {
            res.json({
                result: "success",
                msg: "Address Inserted",
                data: objaddress
            });
        } else {
            res.json({
                result: "failure",
                msg: "Address Not Inserted",
                data: objaddress
            });
        }
    } else {
        var objaddress = new address();
        objaddress.address = req.body.address,
            objaddress.userIDFK = req.body.userIDFK,
            objaddress.cityName = req.body.cityName,
            objaddress.areaName = req.body.areaName,
            objaddress.isdefault = false,
            objaddress.isactive = true

        const inserted = await objaddress.save();

        if (inserted != null) {
            res.json({
                result: "success",
                msg: "Address Inserted",
                data: objaddress
            });
        } else {
            res.json({
                result: "failure",
                msg: "Address Not Inserted",
                data: objaddress
            });
        }
    }


});


//add reqestedimg
router.post('/addreqimg', upload.single('Image'), async (req, res) => {
    var response = [];

    console.log(req.file + "filename");
    objreqimg = new reqimg();
    objreqimg.userIDFK = req.body.userIDFK,
        objreqimg.Image = req.file.filename,
        objreqimg.foodstoreIdFK = req.body.foodstoreIdFK,
        objreqimg.isActive = true,
        objreqimg.addedOn = new Date()
    var inserted = await objreqimg.save();

    if (inserted != null) {
        res.json({
            result: "success",
            msg: "Userreqimg Inserted Successfully",
            data: 1
        });

    } else {
        res.json({
            result: "failure",
            msg: "UnSuccessful",
            data: 0
        });

    }
});

//add reqestore
router.post('/addreqstore', async (req, res) => {
    var response = [];

    objreqstore = new reqstore();
    objreqstore.userIDFK = req.body.userIDFK,
        objreqstore.storeName = req.body.storeName,
        objreqstore.location = req.body.location,
        objreqstore.address = req.body.address,
        objreqstore.areaIDFK = req.body.areaIDFK,
        objreqstore.timming = req.body.timming,
        objreqstore.contactNo = req.body.contactNo,
        objreqstore.isActive = true,
        objreqstore.addedOn = new Date()
    var inserted = await objreqstore.save();

    if (inserted != null) {
        res.json({
            result: "success",
            msg: "reqstore Inserted Successfully",
            data: 1
        });

    } else {
        res.json({
            result: "failure",
            msg: "UnSuccessful",
            data: 0
        });

    }
});
router.post('/addfeedback', async (req, res) => {
    var response = [];

    objfeedback = new feedback();
    objfeedback.userIDFK = req.body.userIDFK,
        objfeedback.message = req.body.message,

        objfeedback.isActive = true,
        objfeedback.addedOn = new Date()
    var inserted = await objfeedback.save();


    if (inserted != null) {
        res.json({
            result: "success",
            msg: "feedback Inserted Successfully",
            data: 1
        });

    } else {
        res.json({
            result: "failure",
            msg: "UnSuccessful",
            data: 0
        });

    }

});


//getadd
router.post('/getByIdaddress', async (req, res) => {
    const objaddress = await address.find({
            userIDFK: req.body.userIDFK,
            isactive: true
        })

        .populate('userIDFK', "username")


    if (objaddress != null) {
        res.json({
            result: "success",
            msg: "address Found",
            data: objaddress
        });

    } else {
        res.json({
            result: "failure",
            msg: "address  Not Found",
            data: objaddress
        });

    }
});

router.post('/deleteAddress/', async (req, res) => {
    const obj = await address.updateOne({
        _id: req.body.id
    }, {

        isactive: false
    });
    res.send(obj);
});

router.post('/updateAddress', async (req, res) => {

    const objuser = await address.updateOne({
        _id: req.body.id
    }, {
        address: req.body.address,
    });
    // res.send(objStudent);
    if (objuser != null) {
        res.json({
            result: "success",
            msg: "address updated Successfully",
            data: 1
        });

    } else {
        res.json({
            result: "failure",
            msg: "UnSuccessful",
            data: 0
        });

    }

});

router.post("/updateDriver",
    async (req, res) => {
        console.log(req.body.id);

        const objDriver = await driver.updateOne({
            _id: req.body.id
        }, {
            driverName: req.body.driverName,
            email: req.body.email,
            mobile: req.body.mobile,
            dob: req.body.dob,
        });
        if (objDriver != null) {
            res.json({
                result: "success",
                msg: "driver updated Successfully",
                data: 1
            });

        } else {
            res.json({
                result: "failure",
                msg: "UnSuccessful",
                data: 0
            });

        }
    }

);

router.post('/getByIdDriver', async (req, res) => {
    const objdriver = await driver.findOne({
        _id: req.body.id,
        isActive: true
    })


    if (objdriver != null) {
        res.json({
            result: "success",
            msg: "driver List Found",
            data: objdriver
        });

    } else {
        res.json({
            result: "failure",
            msg: "driver List Not Found",
            data: objdriver
        });

    }
});

router.post('/updateDriverdoc', upload.single('documents'), async (req, res) => {

    console.log("File");
    console.log(req.file);
    var fileName = "imgGallery/" + req.file.filename;
    const objdriver = await driver.updateOne({
        _id: req.body.id
    }, {
        documents: fileName
    });
    if (driver != null) {
        res.json({
            result: "success",
            msg: "driver Photo Updated",
            data: 1
        });
    } else {
        res.json({
            result: "failure",
            msg: "driver Photo Not Updated",
            data: 0
        });
    }
});





///mee 
//foodstoreDetailsbyid
router.post('/getStoreDeatilsById', async (req, res) => {
    const objstore = await foodstore.findOne({
        _id: req.body.id,
        isactive: true
    })

    if (objstore != null) {
        res.json({
            result: "success",
            msg: "store List Found",
            data: objstore
        });

    } else {
        res.json({
            result: "failure",
            msg: "store List Not Found",
            data: objstore
        });

    }
});

//foodiembystore
router.post('/getstoreByfooditem', async (req, res) => {
    const objfooditem = await fooditem.find({
        foodstoreIDFK: req.body.foodstoreIDFK,
        isactive: true
    }).
    populate('foodstoreIDFK', ['storeName', 'storeAddress', 'storeImage', 'contactNo', 'vegNonveg', 'contactNo', 'timming']);

    if (objfooditem != null) {
        res.json({
            result: "success",
            msg: "fooditem List Found",
            data: objfooditem
        });
    } else {
        res.json({
            result: "failure",
            msg: "fooditem List Not Found",
            data: objfooditem
        });
    }
});

//imagebyStoreId
router.post('/getImgByStore', async (req, res) => {
    const objimg = await img.find({
        foodStoreIDFK: req.body.foodStoreIDFK,
        isActive: true
    }).
    populate('foodStoreIDFK', 'storeName');

    if (objimg != null) {
        res.json({
            result: "success",
            msg: "image List Found",
            data: objimg
        });
    } else {
        res.json({
            result: "failure",
            msg: "image List Not Found",
            data: objimg
        });
    }
});

//itemDetailbyid
router.post('/getItemDeatilsById', async (req, res) => {
    const objitem = await fooditem.findOne({
        _id: req.body.id,
        isactive: true
    })

    if (objitem != null) {
        res.json({
            result: "success",
            msg: "item List Found",
            data: objitem
        });

    } else {
        res.json({
            result: "failure",
            msg: "item List Not Found",
            data: objitem
        });

    }
});

router.post('/getStoreRatingBystoreID', async (req, res) => {
    const objstorerating = await storerating.find({
            foodstoreIdFK: req.body.foodstoreIdFK,
            isactive: true
        })
        .populate('foodstoreIdFK', 'storeName')
        .populate('userIDFK', ['username', 'profile']);

    if (objstorerating != null) {
        res.json({
            result: "success",
            msg: "storeRating List Found",
            data: objstorerating
        });
    } else {
        res.json({
            result: "failure",
            msg: "storeRating List Not Found",
            data: objstorerating
        });
    }
});

router.post('/addBookmark', async (req, res) => {
    var response = [];

    objbookmark = new bookmark();
    objbookmark.userIDFK = req.body.userIDFK,
        objbookmark.foodstoreIdFK = req.body.foodstoreIdFK,

        objbookmark.isActive = true,
        objbookmark.addedOn = new Date()
    var inserted = await objbookmark.save();


    if (inserted != null) {
        res.json({
            result: "success",
            msg: "bookmark Inserted Successfully",
            data: 1
        });

    } else {
        res.json({
            result: "failure",
            msg: "UnSuccessful",
            data: 0
        });

    }

});

router.delete('/deleteBookmark', async (req, res) => {

    const objbookmark = await bookmark.deleteOne({
        foodstoreIdFK: req.body.foodstoreIdFK,
        userIDFK: req.body.userIDFK
    }, );
    if (objbookmark != null) {
        res.json({
            result: "success",
            msg: "bookmark delete Successfully",
            data: 1
        });
    } else {
        res.json({
            result: "failure",
            msg: "UnSuccessful",
            data: 0
        });
    }
});
//display bookmark by storeid
router.post("/getBookmarkByStoreID", async (req, res) => {
    if (req.body.userIDFK == "" || req.body.foodstoreIdFK == "") {
        res.json({
            result: "failure",
            msg: "user id or store id Not Found",
            data: 0
        });
    } else {
        const objbookmark = await bookmark.findOne({
                userIDFK: req.body.userIDFK,
                foodstoreIdFK: req.body.foodstoreIdFK,
                isActive: true
            }).populate('userIDFK', "username")
            .populate('foodstoreIdFK', ['storeName', 'storeImage', 'vegNonveg', 'isactive'])

        if (objbookmark != null) {
            res.json({
                result: "success",
                msg: "objbookmark Found",
                data: objbookmark
            });
        } else {
            res.json({
                result: "failure",
                msg: "objbookmark Not Found",
                data: objbookmark
            });
        }
    }


});
router.post('/addStoreRating', async (req, res) => {
    var response = [];

    objStorerate = new storerating();
    objStorerate.userIDFK = req.body.userIDFK,
        objStorerate.foodstoreIdFK = req.body.foodstoreIdFK,
        objStorerate.rating = req.body.rating,
        objStorerate.review = req.body.review,

        objStorerate.isactive = true,
        objStorerate.addedOn = new Date();
    var inserted = await objStorerate.save();


    if (inserted != null) {
        res.json({
            result: "success",
            msg: "store rate Inserted Successfully",
            data: 1
        });

    } else {
        res.json({
            result: "failure",
            msg: "UnSuccessful",
            data: 0
        });
    }
});

//add cart master for user
router.post("/addCartMaster", async (req, res) => {
    const objUser = await cartMaster.findOne({
        userIDFK: req.body.userIDFK
    });

    if (objUser != null) {
        res.json({
            result: "success",
            msg: "objUser Found",
            data: objUser._id
        });
    } else {
        var objCart = new cartMaster();
        objCart.userIDFK = req.body.userIDFK,
            objCart.totalAmount = "0"
        objCart.addedOn = new Date();

        const inserted = await objCart.save();

        if (inserted != null) {
            res.json({
                result: "success",
                msg: "User cart Inserted",
                data: inserted._id
            });
        } else {
            res.json({
                result: "failure",
                msg: "User cart Not Inserted",
                data: 0
            });
        }
    }
});


//add products in cart
router.post('/addCartItem', async (req, res) => {

    const objstore = await cartItem.find({
        foodStoreIDFK: {
            $ne: req.body.foodStoreIDFK
        },
        cartIDFK: req.body.cartIDFK
    });

    var oldTotal = 0;

    if (objstore != null) {
        for (const element of objstore) {
            oldTotal += parseInt(element.price) * parseInt(element.quantity);
        }
    }

    const objitemdel = await cartItem.deleteMany({
        cartIDFK: req.body.cartIDFK,
        foodStoreIDFK: {
            $ne: req.body.foodStoreIDFK
        }
    });

    console.log('cartid' + req.body.cartIDFK)


    console.log('in if ' + req.body.cartIDFK)
    var updateCartMaster = await cartMaster.updateOne({
        _id: req.body.cartIDFK
    }, {
        totalAmount: "0"
    });


    var objCartItem = new cartItem();
    objCartItem.cartIDFK = req.body.cartIDFK,
        objCartItem.foodStoreIDFK = req.body.foodStoreIDFK,
        objCartItem.foodItemIDFK = req.body.foodItemIDFK,
        objCartItem.price = req.body.price,
        objCartItem.quantity = req.body.quantity,
        objCartItem.isActive = true,
        objCartItem.addedOn = new Date()

    var inserted = await objCartItem.save();

    console.log(req.body.cartTotal);
    var newTotal = parseInt(req.body.cartTotal) - oldTotal;
    var updateCartMaster = await cartMaster.updateOne({
        _id: req.body.cartIDFK
    }, {
        totalAmount: newTotal
    });

    if (inserted != null) {
        res.json({
            result: "success",
            msg: "objCartItem Inserted Successfully",
            data: 1
        });

    } else {
        res.json({
            result: "failure",
            msg: "UnSuccessful",
            data: 0
        });

    }
});

//get cart master by cart id
router.post("/getCartByID", async (req, res) => {
    const objCart = await cartMaster.findOne({
        _id: req.body.id
    });

    if (objCart != null) {
        res.json({
            result: "success",
            msg: "objCart Found",
            data: objCart
        });
    } else {
        res.json({
            result: "failure",
            msg: "objCart Not Found",
            data: objCart
        });
    }
});

//find cart product by cart id
router.post('/getCartItemByCartID', async (req, res) => {
    const objstorerating = await cartItem.find({
            cartIDFK: req.body.cartIDFK,
            isactive: true
        })
        .populate('foodItemIDFK', ['name', 'image', 'price'])
        .populate('foodStoreIDFK', 'storeName')

    if (objstorerating != null) {
        res.json({
            result: "success",
            msg: "cartItem List Found",
            data: objstorerating
        });
    } else {
        res.json({
            result: "failure",
            msg: "cartItem List Not Found",
            data: objstorerating
        });
    }
});

router.post('/getCartIDByCartItem', async (req, res) => {
    const objstorerating = await cartItem.findOne({
            cartIDFK: req.body.cartIDFK,
            isactive: true
        })
        .populate('cartIDFK', ['totalAmount'])
        .populate('foodItemIDFK', ['name', 'image', 'price'])
        .populate('foodStoreIDFK', 'storeName')

    if (objstorerating != null) {
        res.json({
            result: "success",
            msg: "cartItem List Found",
            data: objstorerating
        });
    } else {
        res.json({
            result: "failure",
            msg: "cartItem List Not Found",
            data: objstorerating
        });
    }
});

//delete product from cart
router.delete('/deleteItemCart', async (req, res) => {
    var updateCartMaster = await cartMaster.updateOne({
        cartIDFK: req.body.cartIDFK
    }, {
        totalAmount: req.body.totalAmount
    });

    const objCartItem = await cartItem.deleteOne({
        foodItemIDFK: req.body.foodItemIDFK,
        foodStoreIDFK: req.body.foodStoreIDFK,
        cartIDFK: req.body.cartIDFK
    });
    // console.log(objCartProduct);
    if (objCartItem != null) {
        res.json({
            result: "success",
            msg: "CartItem deleted Successfully",
            data: 1
        });
    } else {
        res.json({
            result: "failure",
            msg: "UnSuccessful",
            data: 0
        });
    }
});

//update cart
router.post("/updateCart", async (req, res) => {

    var updated = await cartItem.updateOne({
        _id: req.body.id
    }, {
        quantity: req.body.quantity,
        price: req.body.price,
    });

    var updateCartMaster = await cartMaster.updateOne({
        _id: req.body.cartIDFK
    }, {
        totalAmount: req.body.updatedCartTotal
    });

    if (updated != null) {
        res.json({
            result: "success",
            msg: "cart Updated",
            data: 1
        });
    } else {
        res.json({
            result: "failure",
            msg: "cart Not Updated",
            data: 0
        });
    }
});

router.delete("/deleteCartItembyID", async (req, res) => {
    var delCartitem = await cartItem.deleteOne({
        _id: req.body.id
    });

    if (delCartitem != null) {
        res.json({
            result: "success",
            msg: "cartitem deleted",
            data: 1
        });
    } else {
        res.json({
            result: "failure",
            msg: "cartitem deleted",
            data: 0
        });
    }
});

//me




router.post('/additemRating', async (req, res) => {
    var response = [];

    objItemrate = new itemrating();
    objItemrate.userIDFK = req.body.userIDFK,
        objItemrate.foodItemIDFK = req.body.foodItemIDFK,
        objItemrate.rating = req.body.rating,
        objItemrate.review = req.body.review,

        objItemrate.isActive = true,
        objItemrate.addedOn = new Date();
    var inserted = await objItemrate.save();


    if (inserted != null) {
        res.json({
            result: "success",
            msg: " Item Inserted Successfully",
            data: 1
        });

    } else {
        res.json({
            result: "failure",
            msg: "UnSuccessful",
            data: 0
        });
    }
});

router.post('/getItemRatingByItemID', async (req, res) => {
    const objItemrating = await itemrating.find({
            foodItemIDFK: req.body.foodItemIDFK,
            isactive: true
        })
        .populate('foodItemIDFK', 'name')
        .populate('userIDFK', ['username', 'profile']);

    if (objItemrating != null) {
        res.json({
            result: "success",
            msg: "objItemrating List Found",
            data: objItemrating
        });
    } else {
        res.json({
            result: "failure",
            msg: "objItemrating List Not Found",
            data: objItemrating
        });
    }
});

//order master & item

router.post('/addOrder', async (req, res) => {
    const objCart = await cartMaster.findOne({
        _id: req.body.cartIDFK
    });
    console.log(req.body.cartIDFK);
    if (objCart != null) {

        var objOrderMater = new orderMaster();
        objOrderMater.userIDFK = req.body.userIDFK,
            objOrderMater.paymentId = "Cash on Delivery",
            objOrderMater.paymentType = "Cash on Delivery",
            objOrderMater.driverIDFK = "",
            objOrderMater.addressIDFK = req.body.addressIDFK,
            objOrderMater.timeEstimate = "",
            objOrderMater.totalAmount = objCart.totalAmount,
            objOrderMater.status = "0",
            objOrderMater.isActive = true,
            objOrderMater.addedOn = new Date()

        const inserted = await objOrderMater.save();

        console.log(inserted);
        const objcartitem = await cartItem.find({
            cartIDFK: req.body.cartIDFK
        });

        if (objcartitem != null) {
            for (const element of objcartitem) {
                var objOrderItem = new orderItem();
                objOrderItem.orderIDFK = inserted._id,
                    objOrderItem.foodStoreIDFK = element.foodStoreIDFK,
                    objOrderItem.foodItemIDFK = element.foodItemIDFK,
                    objOrderItem.price = element.price,
                    objOrderItem.qunatity = element.quantity,

                    objOrderItem.isActive = true,
                    objOrderItem.addedOn = new Date()

                const orderInsert = await objOrderItem.save();
                console.log(orderInsert);
                var delCartitem = await cartItem.deleteOne({
                    _id: element._id
                });
                console.log(delCartitem);
            }

        }
        var objup = await cartMaster.updateOne({
            _id: req.body.cartIDFK
        }, {
            totalAmount: "0"
        });
        res.json({
            result: "success",
            msg: "Successful",
            data: 1
        });

    } else {
        res.json({
            result: "failure",
            msg: "UnSuccessful",
            data: 0
        });

    }

});

//show order master
router.post("/getOrderByID", async (req, res) => {
    const objOrder = await orderMaster.find({
        userIDFK: req.body.userIDFK
    }).populate('userIDFK', ['username', 'address', 'mobileno'])


    var orderData = [];
    for (const order of objOrder) {
        let objOrderItem = await orderItem.find({
            orderIDFK: order._id,
            isActive: true,

        }).populate('foodStoreIDFK', ['storeName', 'storeAddress', 'storeImage'])
        console.log('orderid ' + order._id);
        var convertedJSON = JSON.parse(JSON.stringify(order));
        convertedJSON.order = objOrderItem;
        console.log(convertedJSON);
        orderData.push(convertedJSON);
    }
    if (orderData != null) {
        res.json({
            result: "success",
            msg: "objOrder Found",
            data: orderData
        });
    } else {
        res.json({
            result: "failure",
            msg: "objOrder Not Found",
            data: orderData
        });
    }
});

//show orderItem
router.post("/getOrderItemByID", async (req, res) => {
    const objOrderItem = await orderItem.find({
            orderIDFK: req.body.orderIDFK
        }).populate('foodItemIDFK', ['name', 'image', 'price'])
        .populate('foodStoreIDFK', ['storeName', 'storeAddress'])
        .populate('orderIDFK', ['totalAmount', 'status']);

    if (objOrderItem != null) {
        res.json({
            result: "success",
            msg: "objOrderItem Found",
            data: objOrderItem
        });
    } else {
        res.json({
            result: "failure",
            msg: "objOrderItem Not Found",
            data: objOrderItem
        });
    }
});

//for find one(not list)
router.post("/getOrderItemByOrderID", async (req, res) => {
    const objOrderItem = await orderItem.findOne({
            orderIDFK: req.body.orderIDFK
        }).populate('foodItemIDFK', ['name', 'image', 'price'])
        .populate('foodStoreIDFK', ['storeName', 'storeAddress', 'storeImage'])
        .populate('orderIDFK', ['totalAmount', 'status']);

    if (objOrderItem != null) {
        res.json({
            result: "success",
            msg: "objOrderItem Found",
            data: objOrderItem
        });
    } else {
        res.json({
            result: "failure",
            msg: "objOrderItem Not Found",
            data: objOrderItem
        });
    }
});

router.get('/getAllordermaster', async (req, res) => {
    const objOrder = await orderMaster.find({
            status: "0"
        })
        .populate('userIDFK', ['username', 'address', 'mobileno'])
        .populate('addressIDFK', 'address')

    var orderData = [];
    for (const order of objOrder) {
        let objOrderItem = await orderItem.find({
            orderIDFK: order._id,
            isActive: true,

        }).populate('foodStoreIDFK', ['storeName', 'storeAddress', 'storeImage'])
        console.log('orderid ' + order._id);
        var convertedJSON = JSON.parse(JSON.stringify(order));
        convertedJSON.order = objOrderItem;
        console.log(convertedJSON);
        orderData.push(convertedJSON);
    }

    if (orderData != null) {
        res.json({
            result: "success",
            msg: "orde List Found",
            data: orderData
        });

    } else {
        res.json({
            result: "failure",
            msg: "orde List Not Found",
            data: orderData
        });

    }
});
//update order status
router.post('/updateOrderStatus', async (req, res) => {

    const objorder = await orderMaster.updateOne({
        _id: req.body.id
    }, {
        status: "1",
        driverIDFK: req.body.driverIDFK,
        timeEstimate: "30 Minitus",
    });
    // res.send(objStudent);
    if (objorder != null) {
        res.json({
            result: "success",
            msg: "objorder updated Successfully",
            data: 1
        });

    } else {
        res.json({
            result: "failure",
            msg: "UnSuccessful",
            data: 0
        });

    }

});



//komu

//for category store wise
router.post('/getByStore', async (req, res) => {
    const objfoodstore = await foodstore.find({
        storeName: {
            $regex: req.body.storeName
        },
        isactive: true
    })


    if (objfoodstore != null) {
        res.json({
            result: "success",
            msg: "foodstore List Found",
            data: objfoodstore
        });

    } else {
        res.json({
            result: "failure",
            msg: "foodstore List Not Found",
            data: objfoodstore
        });

    }
});

router.post('/getItemByStore', async (req, res) => {
    let objfooditem = [];

    var pipline = [{
        '$match': {
            'name': {
                '$regex': req.body.name
            },
            'isactive': true
        }
    }, {
        '$lookup': {
            'from': 'foodstoremasters',
            'localField': 'foodstoreIDFK',
            'foreignField': '_id',
            'as': 'store'
        }
    }, {
        '$group': {
            '_id': {
                'foodstoreIDFK': 'foodstoreIDFK',
                'store': {
                    '$first': '$store'
                }
            }
        }
    }];
    const aggCursor = await fooditem.aggregate(pipline);


    for await (const doc of aggCursor) {
        console.log(doc);
        objfooditem.push(doc);
    }


    if (objfooditem != null) {
        res.json({
            result: "success",
            msg: "fooditem List Found",
            data: objfooditem
        });
    } else {
        res.json({
            result: "failure",
            msg: "fooditem List Not Found",
            data: objfooditem
        });
    }
});

router.post('/getByIdDefaultaddress', async (req, res) => {
    const objaddress = await address.findOne({
            userIDFK: req.body.userIDFK,
            isactive: true,
            isdefault: true
        })

        .populate('userIDFK', "username")


    if (objaddress != null) {
        res.json({
            result: "success",
            msg: "address Found",
            data: objaddress
        });

    } else {
        res.json({
            result: "failure",
            msg: "address  Not Found",
            data: objaddress
        });

    }
});


router.post('/getorderByDriverID', async (req, res) => {
    const objorder = await orderMaster.find({
            driverIDFK: req.body.driverIDFK,
            isactive: true
        })
        .populate('userIDFK', ['username', 'address', 'mobileno'])
        .populate('addressIDFK', 'address');

    var orderData = [];
    for (const order of objorder) {
        let objOrderItem = await orderItem.find({
            orderIDFK: order._id,
            isActive: true,

        }).populate('foodStoreIDFK', ['storeName', 'storeAddress', 'storeImage'])
        console.log('orderid ' + order._id);
        var convertedJSON = JSON.parse(JSON.stringify(order));
        convertedJSON.order = objOrderItem;
        console.log(convertedJSON);
        orderData.push(convertedJSON);
    }
    if (orderData != null) {
        res.json({
            result: "success",
            msg: "objorder List Found",
            data: orderData
        });
    } else {
        res.json({
            result: "failure",
            msg: "objorder List Not Found",
            data: objorder
        });
    }
});


//driver wise order 




//adddriver
// router.post('/adddriver', async (req, res) => {
//     var response = [];

//         objdriver = new driver();
//         objdriver.driverName = req.body.driverName,
//         objdriver.email = req.body.email,
//         objdriver.mobile = req.body.mobile,
//         objdriver.gender = req.body.gender,
//         objdriver.documents = req.body.documents,
//         objdriver.dob = req.body.dob,
//         objdriver.isActive = true,
//         objdriver.addedOn = new Date()
//     var inserted = await objdriver.save();

//     if (inserted != null) {
//         res.json({ result: "success", msg: "driver Inserted Successfully", data: 1 });

//     } else {
//         res.json({ result: "failure", msg: "UnSuccessful", data: 0 });

//     }
//   });


//email otp
router.post('/getemailbydata', async (req, res) => {
    objAuth = await auth.findOne({
        email: req.body.email,
        isActive: true
    });
    var transporter = nodemailer.createTransport({
        host: 'mail.metanoiainfotech.com',
        port: 465,
        secure: true,
        auth: {
            user: 'contact@metanoiainfotech.com',
            pass: 'Metanoia@#$%!2018'
        }
    });

    var mailOptions = {
        from: 'contact@metanoiainfotech.com',
        to: req.body.email,
        subject: 'Sending OTP',
        text: Math.floor(1000 + Math.random() * 9000).toString()
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    res.json({
        result: "success",
        msg: "otp  Found",
        data: mailOptions.text
    });
});

//resert password

router.post('/updatecustomerPassword', async (req, res) => {

    const objcustomer = await auth.updateOne({
        email: req.body.email
    }, {
        password: req.body.password,
    });
    // res.send(objStudent);
    if (objcustomer != null) {
        res.json({
            result: "success",
            msg: "User password updated Successfully",
            data: 1
        });
    } else {
        res.json({
            result: "failure",
            msg: "UnSuccessful",
            data: 0
        });
    }
});


router.post("/getOrderid", async (req, res) => {
    const objOrder = await orderMaster.findOne({
        id: req.body._id
    })
    // var orderData = [];

    let objOrderItem = await orderItem.findOne({
        orderIDFK: objOrder._id,
        isActive: true,

    }).populate('foodStoreIDFK', ['storeName', 'storeAddress', 'storeImage'])
    // console.log('orderid ' + objOrder._id);
    // var convertedJSON = JSON.parse(JSON.stringify(objOrder));
    // convertedJSON.objOrder = objOrderItem;
    // console.log(convertedJSON);
    // orderData.push(convertedJSON);

    if (objOrderItem != null) {
        res.json({
            result: "success",
            msg: "objOrder Found",
            data: objOrderItem
        });
    } else {
        res.json({
            result: "failure",
            msg: "objOrder Not Found",
            data: objOrderItem
        });
    }
});


router.post("/getOrder", async (req, res) => {
    const objOrder = await orderMaster.findOne({
        userIDFK: req.body.userIDFK
    }).populate('userIDFK', ['username', 'address', 'mobileno'])


    //var orderData = [];
    //for (const order of objOrder) {
    let objOrderItem = await orderItem.findOne({
        orderIDFK: objOrder._id,
        isActive: true,

    }).populate('foodStoreIDFK', ['storeName', 'storeAddress', 'storeImage'])
    // console.log('orderid ' + objOrder._id);
    // var convertedJSON = JSON.parse(JSON.stringify(objOrder));
    // convertedJSON.order = objOrderItem;
    // console.log(convertedJSON);
    // objOrderItem.push(convertedJSON);
    //  }
    if (objOrderItem != null) {
        res.json({
            result: "success",
            msg: "objOrder Found",
            data: objOrderItem
        });
    } else {
        res.json({
            result: "failure",
            msg: "objOrder Not Found",
            data: objOrderItem
        });
    }
});
module.exports = router;