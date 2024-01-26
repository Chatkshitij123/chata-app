//video 19
const router = require('express').Router();

const authController = require("../controllers/auth");
const userController = require("../controllers/user");

router.patch('/update-me',authController.protect, userController.updateMe);

router.get("/get-users", authController.protect, userController.getUsers);//video 25
router.get("/get-friends", authController.protect, userController.getFriends);//video 26
router.get("/get-friend-requests", authController.protect, userController.getRequests);

//hhtps://localhost:3000/v1/user/update-me

module.exports = router;