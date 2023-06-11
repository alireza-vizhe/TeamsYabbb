const express = require("express");

const adminControoler = require("../controller/adminController");
const { authenticated } = require("../middlewares/auth");


const router = express.Router();

router.get("/dashboard", adminControoler.dashboard);
// router.get("/dashboard", authenticated, adminControoler.dashboard);
router.post("/dashboard/add-post", adminControoler.createPost);
// router.post("/dashboard/add-post", authenticated, adminControoler.createPost);
router.delete("/dashboard/delete/:id", adminControoler.deletePost);
router.patch("/dashboard/edit-post/:id", adminControoler.updatePost);
router.get("/dashboard/post/:id" , adminControoler.getSinglePost);
// router.post("/search", adminControoler.handleSearch)

module.exports = router;