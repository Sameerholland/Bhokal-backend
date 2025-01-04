require("dotenv").config();
const express = require("express");
const server = express();
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const cookieParser = require("cookie-parser");
const passport = require("passport");
const Authrouter = require("./routes/Auth");
const StudentRouter = require("./routes/Students");
const CourseRouter = require("./routes/course");
const QueryRouter = require("./routes/Query");
const DashboardRouter = require("./routes/Dashboard");
const VideoRouter = require("./routes/video");
const LocalStrategy = require("passport-local").Strategy;
const { cookieExtractor, sanitizeUser, rejectionMessage, ConformationMessage, AdminCreatedSuccesfully, AdminCreationrejection, isAuth } = require("./service/common");
const { User } = require("./models/user");
const { video } = require("./models/Vidoes");

server.use(cookieParser());
server.use(express.json());
server.use(cors({
  origin: "http://localhost:3000", // Allow only localhost:3000
  credentials: true, // Allow cookies or authentication headers
}));

var JwtStrategy = require('passport-jwt').Strategy;
const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.JWT_SECRET_KEY;

server.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
  })
);
server.use(passport.authenticate("session"));

// server.get("/", (req, res) => {
//   res.send("Hello World");
// });
server.use(express.static(path.resolve(__dirname, 'build')));
server.use(express.static(path.join(__dirname, "upload/")));

server.use("/user", Authrouter.router);
server.use("/student",   StudentRouter.router);
server.use("/course",   CourseRouter.router);
server.use("/contact",   QueryRouter.router);
server.use("/dashboard",    DashboardRouter.router);
server.use("/class",    VideoRouter.router);

server.get("/image", (req, res) => {
  const imagePath = path.join(__dirname, `uploads/images/${req.query.url}`); // Path to the image file
  res.sendFile(imagePath, (err) => {
    if (err) {
      console.error("Error sending file:", err);
      res.status(500).send("Error sending file");
    }
  });
});

server.get("/video", (req, res) => {
  console.log("Function is invoke");
  const range = req.headers.range;
  const VideoPath = `${__dirname}/uploads/Videos/${req.query._id}`;
  const VideoSize = fs.statSync(VideoPath).size;
  const chunk = 10 ** 5;
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + chunk, VideoSize - 1);
  const contentlength = end - start + 1;

  const headers = {
    "Content-Range": `bytes ${start}-${end}/${VideoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentlength,
    "Content-Type": "video/mp4",
  };

  res.writeHead(206, headers);

  const stream = fs.createReadStream(VideoPath, {
    start,
    end,
  });

  stream.pipe(res);
});


server.get('/confirm-delete',async (req,res)=>{
  console.log('Delete From Mail API Called');
  if(req.query.key1 === 'student'){
    const data = await User.findByIdAndDelete(req.query.key2)
    if(!data){
      res.status(400).send(rejectionMessage())
    }
    else{
      res.status(201).send(ConformationMessage({courseId:req.query.key2}))
    }
  }

  if(req.query.key1 === 'video'){

    const videodata = await video.findByIdAndDelete(req.query.key2)
    if(!videodata){
      res.status(400).send(rejectionMessage())
    }
    else{
      res.status(201).send(ConformationMessage({courseId:req.query.key2}))
    }
  

  }
})

server.get('/confirm-admin', async (req,res)=>{
  console.log("Create Admin API Called");
  
  const modifiedemail = req.query.value2.toLowerCase();  
  const salt = await bcrypt.genSalt(10); // Salt which is used to hash password and store in database
  const hashedPassword = await bcrypt.hash(req.query.value3, salt); // Hash Password to For Security 
  const user = new User({
    Name: req.query.value1,
    password: hashedPassword,
    email: modifiedemail,
    salt: salt,
    role: 'admin', // or 'admin'
  });
  try {
     await user.save();
    res.send(AdminCreatedSuccesfully({Name:req.query.value1,email:req.query.value2,password:req.query.value3}))
     
  } catch (err) {
    console.log(err);
    
    res.send(AdminCreationrejection({email:req.query.value2}))
  }
  
 
  
})






passport.use(
  "local",
  new LocalStrategy({ usernameField: "email" }, async function (
    email,
    password,
    done
  ) {
    // by default passport uses username

    try {
      const user = await User.findOne({ email: email });

      if (!user) {
        return done(null, false, { message: "invalid credentials" }); // for safety
      }
      const hashedPassword = await bcrypt.hash(password , user.salt)

      if(hashedPassword != user.password){
            return done(null, false,{message:'Invalid Credentials'})
      }
      const token = jwt.sign(
        sanitizeUser(user),
        process.env.JWT_SECRET_KEY
      );

      done(null,{data:sanitizeUser(user),token:token})
     ; // this lines sends to serializer 
    } catch (err) {
      done(err);
    }
  })
);

passport.use(
  'jwt',
  
  new JwtStrategy(opts, async function (jwt_payload, done) {
    console.log(jwt_payload,'working');
    try {
      
      

      
      const user = await User.findById(jwt_payload.id);
      if (user) {      
        return done(null, sanitizeUser(user)); // this calls serializer
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);  
    }
  })
);

// this creates session variable req.user on being called from callbacks
passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, { id: user.id, email:user.email, role: user.role });
  });
});

// this changes session variable req.user when called from authorized request

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

//2qAptM77pyZkWcIU
//YOHbtjSXmalG0zyc

"mongodb+srv://bhokaltrader:YOHbtjSXmalG0zyc@cluster0.mo9xo.mongodb.net/"

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(
    "mongodb://127.0.0.1:27017/bhokaltrader"
  );
  console.log("Database Connected");
}

server.listen(process.env.PORT, () => {
  console.log(`server started ${process.env.PORT}`);
});
