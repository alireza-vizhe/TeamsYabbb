const { default: axios } = require("axios");
const Related = require("../model/RelatedModel");
const { sendEmail, sendRelatedEmail } = require("../utils/mailer");

exports.relatedAd = (req, res) => {
    try {
        const {fullname, email, recaptchaValue} = req.body;
        axios({
            url: `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response=${recaptchaValue}`,
            method: "POST",
          }).then( async ({data}) => {
            if(data.success){
              const relatedUser = await Related.findOne({email});
              if(relatedUser){
                res.json({message: "کاربری با این ایمیل در خبرنامه شرکت کرده است"});
              }else{
                await Related.create({fullname, email})
                res.json({messageSUC: "با موفقیت در خبرنامه شرکت کردید"});
                sendRelatedEmail(
                 email,
                 fullname,
                 "شرکت در خبرنامه پیامکی تیمزیاب موفقیت آمیز بود",
                 "امیدواریم بتونیم بهترین آگهی های مرتبط با حوزه کاری شما را به شما اطلاع رسانی کنیم که هرچه زودتر شروع به کار کنید!"
               );
              }
            }else {
                res.json({ message: "مشکلی در اعتبار سنجی پیش آمد" });
              }
            })
            .catch((error) => {
              res.json({ message: "کپچا نا معتبر است" });
            });
    } catch (error) {
        console.log(error);
        res.status(500).send("مشکلی از سمت سرور پیش امده است");
    }
}