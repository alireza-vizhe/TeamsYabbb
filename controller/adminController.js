const Post = require("../model/PostsModel");
const axios = require("axios");
const multer = require("multer");
const mutler = require("multer");
const uuid = require("uuid").v4;
const shortId = require("shortid");
const sharp = require("sharp");
const Image = require("../model/ImageModel");

exports.dashboard = async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.json({ message: error });
  }
};

exports.createPost = async (req, res) => {
  console.log(req.body);
  try {
    const { recaptchaValue } = req.body;
    // axios({
    //   url: `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response=${recaptchaValue}`,
    //   method: "POST",
    // })
    //   .then(async ({ data }) => {
    //     if (!data.success) {
          const post = await Post.create({
            ...req.body,
            user: req.body.userId,
          });
          res.json(post);
      //   } else {
      //     res.json({ message: "errمشکلی در اعتبار سنجی کپچا پیش آمد" });
      //   }
      // })
      // .catch((error) => {
      //   res.json({ message: "errکپچا نا معتبر است" });
      // });
  } catch (error) {
    res.json("مشکلی از سمت سرور پیش آمد");
  }
};

exports.deletePost = async (req, res) => {
  try {
    await Post.deleteOne({ _id: req.params.id });
    res.json({ message: "کاربر پاک شد" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

exports.updatePost = async (req, res) => {
  console.log("body", req.body);
  // const p = await Post.find( { _id: req.params.id },
  //   { $set: req.body })
  // console.log("posttttt", p);
  try {
    const { recaptchaValue } = req.body;
    // axios({
    //   url: `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response=${recaptchaValue}`,
    //   method: "POST",
    // })
    //   .then(async ({ data }) => {
    //     console.log("data", data);
    //     if (!data.success) {
          const post = await Post.updateOne(
            { _id: req.params.id },
            { $set: req.body }
          );
          res.json(post);
          console.log(post);
      //   } else {
      //     res.json({ message: "مشکلی در اعتبار سنجی کپچا پیش آمد" });
      //   }
      // })
      // .catch((error) => {
      //   res.json({ message: "کپچا نا معتبر است" });
      // });
  } catch (error) {
    res.json({ message: error.message });
  }
};

exports.getSinglePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.json(post);
  } catch (error) {
    res.json({ message: error.message });
  }
};

exports.handleSearch = async (req, res) => {
  console.log("log", req.body.search);
  try {
    const posts = await Post.find({ $text: { $search: req.body.search } });
    console.log("post", posts);
    res.json(posts);
  } catch (error) {
    res.json({ message: error });
  }
};