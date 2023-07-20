var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var cors = require("cors");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var User = require("./Models/User");
var Task = require("./Models/Tasks");
// var Doktor = require('./Models/Doktor')
// var Admin = require('./Models/Admin')
// var Randevu = require('./Models/Randevular')
const auth = require("./Middleware/Auth");
const Tasks = require("./Models/Tasks");
const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 100000000,
  })
);

const url =
  "mongodb+srv://melihnode:meliherpek1@cluster0.g1oel.mongodb.net/UM?authSource=admin&replicaSet=atlas-77ie5j-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true";
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 100000000,
  })
);

app.use(cors());

mongoose.connect(
  url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  (err) => {
    if (err) {
      throw err;
    }
    console.log("Mongoose ile bağlantı kuruldu.");
  }
);

app.get("/", (req, res) => {
  res.send("çalışıyor");
});

app.post("/Login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    return res.json({ hata: "All blanks must be filled." });
  }
  const user = await User.findOne({ Mail: email });
  if (!user) {
    res.status(400);
    return res.json({ hata: "Wrong E-Mail." });
  }
  const isMatch = await bcrypt.compare(password, user.Sifre);
  if (!isMatch) {
    res.status(400);
    return res.json({ hata: "Wrong Password." });
  }
  const token = jwt.sign({ id: user._id }, "melih");

  res.json({
    token,
    user,
  });
});
app.post("/teams", async (req, res) => {
  const { User2 } = req.body;
  if (User2 === "Taylan Koru") {
    const teams = await User.find();
    res.json(teams);
  } else {
    const teams = await User.find();
    let editedTeams = [];
    teams.map((item, index) => {
      if (item.AdSoyad === User2) {
        editedTeams.push(item);
      } 
    });
  res.json(editedTeams);

  }
});
app.post("/tasks", async (req, res) => {
  const tasks = await Task.find();
  let editedTaskData = [];
  tasks.map((item, index) => {
    if (item.Team === req.body.User) {
      editedTaskData.push(item);
    }
  });
  res.json(editedTaskData);
});
app.post("/editStatus", async (req, res) => {
  const { taskID } = req.body;
  await Tasks.findByIdAndUpdate(taskID, {
    Status: "Completed",
  });
  res.json({ success: true });
});

app.post("/findteam", async (req, res) => {
  const { teamname } = req.body;
  const team = await User.findOne({ _id: teamname });

  if (team) {
    res.json(team);
  } else {
    res.status(400);
    res.json({
      ErrorType: "CompanyDontExist",
      ErrorMessage: "There is no team.",
    });
  }
});
app.post("/addanuser", async (req, res) => {
  const { AdSoyad, Mail, Sifre } = req.body;
  if (!AdSoyad || !Mail || !Sifre) {
    res.status(400);
    return res.json({ hata: "All blanks must be filled." });
  }
  const user = await User.findOne({ Mail });
  if (user) {
    res.status(400);
    return res.json({ hata: "There is an user with that email." });
  }
  const user2 = await User.findOne({ AdSoyad });
  if (user2) {
    res.status(400);
    return res.json({ hata: "There is an user with that name and surname." });
  }
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(Sifre, salt);
  User.create({
    AdSoyad,
    Mail,
    Sifre: passwordHash,
    Role: "Normal",
  });

  res.json("okey");
});
app.post("/addatask", async (req, res) => {
  const { Name, Aciklama, BaslangicTarihi, BitisTarihi, Team } = req.body;
  if (!Name || !Aciklama || !BaslangicTarihi || !BitisTarihi) {
    res.status(400);
    return res.json({ hata: "All blanks must be filled." });
  }
  Task.create({
    Name,
    Aciklama,
    BaslangicTarihi,
    BitisTarihi,
    Team,
    Status: "Ongoing",
  });

  res.json("okey");
});

// app.get("/Register", async (req, res) => {
//   const salt = await bcrypt.genSalt();
//   const passwordHash = await bcrypt.hash("lX5F9y7y1@pZ", salt);
//   User.create({
//     AdSoyad: "Zorluhan Zorlu",
//     Mail: "zorluhanzorlu@gmail.com",
//     Sifre: passwordHash,
//   });

//   res.json("okey");
// });
app.post("/loggedIn", async (req, res) => {
  try {
    const token = req.header("x-auth-token");

    if (!token) return res.json(false);

    jwt.verify(token, "melih");

    res.send(true);
  } catch (err) {
    res.json(false);
  }
});

app.get("/log", auth, async (req, res) => {
  const user = await User.findById(req.user);

  res.json({
    Id: user._id,
    EMail: user.Mail,
    AdSoyad: user.AdSoyad,
    Role: user.Role,
  });
});

app.listen(5000, () => console.log("5000 portunda çalışıyor"));
