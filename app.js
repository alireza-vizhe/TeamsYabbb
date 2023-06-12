const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const Image = require("./model/ImageModel");
const Resume = require("./model/ResumeModel");
const User = require("./model/usersModel");
const connectDB = require("./config/db");
const multer = require("multer");
const fs = require("fs");
const sharp = require("sharp");
const Post = require("./model/PostsModel");
const axios = require("axios");
const { authenticated } = require("./middlewares/auth");
const { Server } = require("socket.io");
const bodyParser = require("body-parser")

const app = express();

//* Body Parser
app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

//? Set ENV
dotenv.config({ path: "./config/config.env" });

//! DataBase Connection
connectDB();

// const storage = multer.diskStorage({
//   destination: (req, res, cb) => {
//     cb(null, "uploads");
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });

// const upload = multer({ storage: storage });

// app.post("/upload-image", upload.single("textImage"), async (req, res) => {
//   console.log(req.body, req.file);
//   const saveImage = new Image({
//     name: req.body.name,
//     img: {
//       data: fs.readFileSync("uploads/" + req.file.filename),
//       contentType: "image/png",
//     },
//     userId : req.body.userId
//   });
//   saveImage
//     .save()
//     .then((res) => {
//       console.log("saved")
//     })
//     .catch((err) => {
//       console.log(err);
//     });
//     res.json({message: "savedddd"})
// });

//! Upload Image
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/upload-image", upload.single("textImage"), function (req, res) {
  console.log("filre", req.file, "dataaaaaaa", req.body);
  const { recaptchaValue } = req.body;
  axios({
    url: `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response=${recaptchaValue}`,
    method: "POST",
  })
    .then(async ({ data }) => {
      if (!data.success) {
        console.log("datablulu", data);
        try {
          sharp(req.file.buffer)
            .resize(800, 300)
            .jpeg({ quality: 30 })
            .toBuffer()
            .then((data) => {
              console.log(req.file, "adsdasadasdadsadadasdsada");
              const saveImage = new Post({
                ...req.body,
                nameImg: req.body.name,
                img: {
                  data: data,
                  contentType: req.file.mimeType,
                },
                user: req.body.userId,
                userId: req.body.userId,
                for: req.body.for,
              });
              saveImage
                .save()
                .then(() => {
                  console.log("saved");
                })
                .catch((err) => {
                  console.log(err);
                });
              res.json({ messageSUC: "savedddd" });
            });
        } catch (error) {
          console.log("fgfgfgfgfg");
        }
      } else {
        res.json({ message: "  در اعتبار سنجی کپچا پیش آمد" });
      }
    })
    .catch((error) => {
      res.json({ message: "کپچا نا معتبر است" });
    })
    .catch((err) => {
      console.log(err);
    });
});

//? Upload Profile Image
app.post(
  "/upload-image-profile",
  upload.single("textImage"),
  async function (req, res) {
    // console.log(req.file, "id", req.body.userId);
    const userImg = await Image.findOne({ userId: req.body.userId });
    if (req.file) {
      if (userImg) {
        sharp(req.file.buffer)
          .resize(100, 100)
          .jpeg({ quality: 40 })
          .toBuffer()
          .then(async (data) => {
            // console.log(data);
            const findToSave = await Image.findOne({ userId: req.body.userId });
            const setter = await Image.updateOne(
              { userId: req.body.userId },
              { $set: req.body }
            );
            findToSave.img = {
              data: data,
              contentType: req.file.mimetype,
            };

            findToSave.save();

            console.log("updated");
          });
      } else {
        sharp(req.file.buffer)
          .resize(100, 100)
          .jpeg({ quality: 40 })
          .toBuffer()
          .then((data) => {
            const saveImage = new Image({
              name: req.body.name,
              img: {
                data: data,
                contentType: req.file.mimeType,
              },
              userId: req.body.userId,
              for: req.body.for,
            });
            saveImage
              .save()
              .then(() => {
                console.log("saved");
              })
              .catch((err) => {
                console.log(err);
              });
            res.json({ message: "savedddd" });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } else {
      res.json({ message: "عکسی انتخاب نشده است" });
    }
  }
);

//? Upload Resume Image
app.post(
  "/upload-image-resume",
  upload.single("textImage"),
  async function (req, res) {
    console.log(req.file, "id", req.body);
    const userImg = await Resume.findOne({ userId: req.body.userId });
    const userImgg = await User.findOne({ _id: req.body.userId });
    if (userImgg.img) {
      if (userImgg.img) {
        sharp(req.file.buffer)
          .resize(400, 600)
          .jpeg({ quality: 100 })
          .toBuffer()
          .then(async (data) => {
            console.log("asaasdasdasdw222", data);
            const userUpdator = await User.updateOne(
              { _id: req.body.userId },
              { $set: req.body }
            );
            userImgg.img = {
              data: data,
              contentType: req.file.mimetype,
            };
            // console.log(userImg.img);
            res.json(userImgg.img);
            // res.json({messageSUC: "عکس رزومه بروزرسانی شد"});
            
            userImgg.save();

            console.log("updated");
          });
        } else {
        sharp(req.file.buffer)
          .resize(400, 800)
          .jpeg({ quality: 100 })
          .toBuffer()
          .then((data) => {
            const saveImage = new User({
              name: req.body.name,
              img: {
                data: data,
                contentType: req.file.mimeType,
              },
              userId: req.body.userId,
              for: req.body.for,
            });
            saveImage
            .save()
            .then(() => {
              console.log("saved");
            })
            .catch((err) => {
              console.log(err);
            });
            // res.json({ message: "savedddd" });
            res.json({messageSUC: "عکس رزومه اضافه شد"});
          })
          .catch((err) => {
            console.log(err);
          });
        }
      } else {
        res.json({ message: "عکسی انتخاب نشده است" });
      }
  }
);

app.get("/resume-img", async (req, res) => {
  const alldata = await Resume.find();
  res.json(alldata);
});

app.get("/images", async (req, res) => {
  const alldata = await Image.find();
  // console.log(alldata);
  res.json(alldata);
});
//* Routes
app.use(require("./router/user"));
app.use(require("./router/post"));
app.use(require("./router/related"));
app.use(require("./router/blog"));

//* video Chat
const API_KEY = process.env.daily_API_KEY

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  Authorization: "Bearer " + API_KEY
}

const getRoom = (room) => {
  return fetch(`https://api.daily.co/v1/rooms/${room}`, {
    method: "GET",
    headers
  })
}

const createRoom = (room) => {
  return fetch("https://api.daily.co/v1/rooms", {
    method: "POST",
    headers,
    body: JSON.stringify({
      name: room,
      properties: {
        enable_screenshare: true,
        enable_chat: true,
        start_video_off: true,
        start_audio_off: false,
        lang: "en",
      },
    }),
  });
};

app.get("/video-call/:id", async function (req, res) {
  console.log("yea");
  const roomId = req.params.id;
  const room = await getRoom(roomId);
  if (room.error) {
    const newRoom = await createRoom(roomId);
    res.status(200).send(newRoom);
  } else {
    res.status(200).send(room);
  }
});

app.use(cors());

const http = require("http");

const server = http.createServer(app);

let activeUsers = [];

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  console.log(socket.id);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`USer with id: ${socket.id} joined room ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("recieve_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

//* PORT
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log("server Running"));

// app.listen(PORT, () =>
//   console.log(
//     `Server is Running on Port: ${process.env.PORT} & Mode: ${process.env.NODE_ENV}`
//   )
// );
