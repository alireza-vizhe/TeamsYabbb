const User = require("../model/usersModel");
const { sendResumeEmail } = require("../utils/mailer");

exports.handleSendResume = async (req, res) => {
  console.log("blog bodyyyyy", req.body.postName);
  try {
    const acceptor = await User.findOne({ _id: req.body.post.user });
    const sender = await User.find({ _id: req.body.senderUser });
    const senderSave = await User.findOne({ _id: req.body.senderUser });
    senderSave.sended = [...senderSave.sended, req.body.sended];
    await senderSave.save();
    // console.log(
    //   "user is this",
    //   acceptor[0].fullname,
    //   "sender user is",s
    //   sender[0]
    // );
    // console.log("acceptor," , acceptor[0].recieveResumes);
    const { fullname, email } = acceptor;
    acceptor.recieveResumes.push({img: req.body.img ,postName: req.body.postName})
    acceptor.save();
    // console.log("aasas",req.body.img);
    // const url = "https://localhost:5000/"
    sendResumeEmail(
      email,
      fullname,
      "پیشنهاد کاری!",
      `سلام ${fullname} یک پیشنهاد جدید داری برای پیشرفت از طرف ${
        sender[0].fullname 
      } .برای مشاهده و دانلود رزومه وارد داشبورد > مشاهده رزومه های ارسال شده برای من > خود شوید`
    );
    res.send({messageSUC: "رزومه شما با موفقیت ارسال شد"})
  } catch (error) {
    console.log(error);
  }
};