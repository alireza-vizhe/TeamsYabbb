const User = require("../model/usersModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { sendEmail } = require("../utils/mailer");
const request = require("request-promise");


exports.getUser = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).send("مشکلی از سمت سرور پیش امده است");
  }
};

exports.addUser = async (req, res) => {
  console.log(req.body);
  try {
    //! Get Data And Find Email Has And Send Error
    const { fullname, email, password, userType, recaptchaValue } = req.body;

    // axios({
    //   url: `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response=${recaptchaValue}`,
    //   method: "POST",
    // })
    //   .then(async ({ data }) => {
    //     if (!data.success) {
          const userFinder = await User.findOne({ email });
          if (userFinder) {
           await res.json({
              message: "کاربری با این ایمیل موجود است",
            });
          }

          //* Hash Password
          const hash = await bcrypt.hash(password, 10);

          //? Create User
          const users = await User.create({
            fullname,
            email,
            password: hash,
            userType,
          });
          //* Send Welcome Email
          if (userType === "engineer") {
            sendEmail(
              email,
              fullname,
              "خوش آمدی به تیمزیاب",
              "خیلی خوشحالیم که به ما اعتماد کردی و میخوای از تخصصی که داری در زمینه کاری خودت به بهترین شکل ممکن استفاده کنی, ما کنارت هستیم تا بهترین فرصت هارو برات در نظر بگیریم!"
            );
          } else {
            sendEmail(
              email,
              fullname,
              "خوش آمدی به تیمزیاب",
              "خیلی خوشحالیم که یک بیزینس من تصمیم گرفته که چند تا فرصت شغلی برای موفق شدن و پیشرفت برای کارجوها گرفته است, بهترین متخصص ها در حوزه کاری شما را براتون پیشنهاد میدهیم تا بهترین کیفیت رو از بیزینستون داشته باشیم!"
            );
          }
          res.json({messageSUC: "با موفقیت عضو شدید"});
      //   } else {
      //     res.json({ message: "مشکلی در اعتبار سنجی پیش آمد" });
      //   }
      // })
      // .catch((error) => {
      //   res.json({ message: "کپچا نا معتبر است" });
      // });
  } catch (error) {
    console.log(error);
  }
};

exports.handleLogin =async (req, res) => {
   
  try {
    const { email, password, recaptchaValue } = req.body;

    // axios({
    //   url: `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response=${recaptchaValue}`,
    //   method: "POST",
    // })
    //   .then(async ({ data }) => {
    //     console.log(data);
    //     if (data.success) {
          const user = await User.findOne({ email });
          console.log(user);
          if (!user) {
            res.json({ message: "کاربری با این ایمیل یافت نشد" });
            return;
          }

          const isEqual = await bcrypt.compare(password, user.password);

          if (isEqual) {
            const token = jwt.sign(
              {
                user: {
                  userId: user._id.toString(),
                  email: user.email,
                  fullname: user.fullname,
                },
              },
              process.env.JWT_SECRET
            );
            res.status(200).json({ token, userId: user._id.toString() });
          } else {
            res.json({ message: "آدرس ایمیل یا کلمه عبور اشتباه است" });
          }
      //   } else {
      //     res.json({ message: "مشکلی در اعتبار سنجی پیش آمد" });
      //   }
      // })
      // .catch((error) => {
      //   res.json({ message: "کپچا نا معتبر است" });
      // });
  } catch (error) {
    res.json({ message: "مشکلی از سمت سرور پیش آمد" });
  }
};
exports.getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (error) {
    res.json({ message: error.message });
  }
};

exports.handleForgetPassword = async (req,res) => {
  
  try {
    const { email, userId, recaptchaValue } = req.body;
    // axios({
    //   url: `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response=${recaptchaValue}`,
    //   method: "POST",
    // }).then( async ({data}) => {
    //   if(!data.success){

        // console.log(data);
        const user = await User.findOne({email});
        if(!user){
          res.json({message: "کاربری با این ایمیل در پایگاه داده ثبت نشده است"});
          console.log("no data");
        }else{
          // const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {
            //   expiresIn: "1h"
            // })
            
            
            const resetLink = `http://localhost:3000/reset-password/${user._id}`;
          sendEmail(
            user.email,
            user.fullname,
            "فراموشی رمز عبور",
            `جهت تغییر رمز عبور فعلی رو لینک زیر کلیک کنید <a href=${resetLink}>لینک تغییر رمز عبور</a>`
          )
      
          res.json({messageSUC: "لینک ریست کلمه عبور با موفقیت ارسال شد"})
          console.log("sended");
    
        }
    //   }else{
    //     res.json({ message: "مشکلی در اعتبار سنجی پیش آمد" });
    //   }
    // }).catch((error) => {
    //   res.json({ message: "کپچا نا معتبر است" });
    // })
  } catch (error) {
    res.json(error)
  }
}

exports.handleResetPassword = async (req, res) => {
  console.log(req.body);
  
  try {
      const { password, confirmPassword, recaptchaValue } = req.body;
      // axios({
      //   url: `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response=${recaptchaValue}`,
      //   method: "POST",
      // }).then( async ({data}) => {
      //   console.log(data);
      //   if(!data.success){
          // const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
          // if(!decodedToken){
            //   res.json({message: "شما مجوز این عملیات را ندارید"});
            // }
            if (password !== confirmPassword) {
              res.json({ message: "کلمه ها عبور یکسان نمیباشند" });
            }
            
            const user = await User.findOne({_id: req.params.id});
            
            console.log(user);
            
            if(!user){
              res.json({message: "کاربری با این شناسه در پایگاه داده یافت نشد"});
            }
            
            const hash = await bcrypt.hash(password, 10);
            
            user.password = hash;
            await user.save();
            res.json({messageSUC: "عملیات با موفقیت انجام شد"});
      //   }else{
      //     res.json({ message: "مشکلی در اعتبار سنجی پیش آمد" });
      //   }
      // }).catch((error) => {
      //   res.end({ message: "کپچا نا معتبر است" });
      // })
    } catch (error) {
      res.json({message: "ارور"})
      console.log("err");
    }
  };
  
  exports.editUser = async (req, res) => {
    console.log("body guleyley", req.body.sended);
    try {
      const { recaptchaValue, userId, sended } = req.body;
      // const sendedFinder = await User.findById({_id: userId})
      // console.log("shibidillo", sendedFinder.sended);
          const post = await User.updateOne(
            { _id: userId },
            { $set: req.body }
          );
          res.json({messageSUC: "اطلاعات با موفقیت ویرایش شد"});
          // res.json(post);
  } catch (error) {
    res.json({ message: error.message });
  }
}
exports.sendEmailToContactUs = async (req, res) => {
  console.log(req.body);
  const {fullname, email, message} = req.body;
 try {
  sendEmail(
    "alirezavizhe@gmail.com",
    fullname,
    `پیامی از طرف کاربری با ایمیل ${email} دریافت شد`,
    message
  );
 } catch (error) {
  console.log("error", error);
 } 
}

exports.handleBuy = async (req, res) => {
  console.log(req.body);
  try {

    const user = await User.findOne({ _id: req.body.userId }); 

    if(user){
      //! this
      let params = {
        MerchantID: `97221328-b053-11e7-bfb0-005056a205be`,
        Amount: req.price,
        CallbackURL: "http://localhost:3000/success-pay",
        Description: `بابت خرید دوره ${post.name} متشکریم`,
        Email: user.email,
      };
  
      let options = {
        method: "POST",
        url: "https://www.zarinpal.com/pg/rest/WebGate/PaymentRequest.json",
        header: {
          "cache-control": "no-cache",
          "content-type": "application/json",
        },
        body: params,
        json: true,
      };
  
      request(options)
        .then(async (data) => {
          res.json({
            messageURL: `https://zarinpal.com/pg/StartPay/${data.Authority}`,
            courseId: post._id,
          });
          user.coursesIdGeted = [...user.coursesIdGeted, post._id];
          user.save();
        })
        .catch((err) => res.json(err.message));
      //! Until this
    }else{
      res.json({message: "ابتدا وارد شوید"})
    }
      
  } catch (error) {
    console.log(error);
  }
}