const express = require("express");

const UserController = require("../controller/userController");


const router = express.Router();

router.get("/users", UserController.getUser);
router.post("/users", UserController.addUser);
router.post("/login", UserController.handleLogin);
router.get("/user/:id", UserController.getSingleUser);
router.post("/forget-password", UserController.handleForgetPassword);
router.post("/reset-password/:id", UserController.handleResetPassword);
router.post("/edit-user/:id", UserController.editUser);
router.post("/contact-us", UserController.sendEmailToContactUs);

module.exports = router;

