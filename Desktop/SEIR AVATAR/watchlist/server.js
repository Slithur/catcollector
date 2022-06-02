//Require Dependencies
require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");

const session = require('express-session');

app.use(
  session({
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: false
  }));

//Import Model
const Anime = require("./models/anime");

//Database Connection 
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
// Database Connection Error/Success
const db = mongoose.connection
db.on('error', (err) => console.log(err.message + ' is mongo not running?'));
db.on('connected', () => console.log('mongo connected'));
db.on('disconnected', () => console.log('mongo disconnected'));

//MIDDLEWARE & BODY PARSER
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
const userController = require('./controllers/users');
app.use('/users', userController);

//ROUTES
const PORT = 3000;


// Routes / Controllers
const sessionsController = require('./controllers/sessions');
app.use('/sessions', sessionsController);

const seedAnime = require('./models/animes.js');
app.get('/seed', (req, res) => {
  Anime.deleteMany({}, (error, allAnimes) => {});
  Anime.create(seedAnime, (error, data) => {
    res.redirect('/animes');
  });
});

app.get('/home', (req,res) => {
    res.render("home.ejs")

});


app.get('/you', (req,res) => {
  res.render("you.ejs")

});

app.get("/animes", (req,res)=>{
    Anime.find({}, (err, allAnimes)=>{
        res.render("index.ejs", {
            animes: allAnimes,
        });
    });
});


app.get("/animes/new", (req, res) => {
	res.render("new.ejs");
});

app.delete("/animes/:id", (req,res)=>{
  Anime.findByIdAndRemove(req.params.id, (err,deletedAnime)=>{
      res.redirect("/animes");
  });

});

app.get('/animes/:id', (req, res) => {
  Anime.findById(req.params.id, (err, data) => {
    res.render("show.ejs", {
      Anime:data
    })
  })

});

app.put("/animes/:id", (req, res) => {
    if (req.body.completed === "on") {
      req.body.completed = true;
    } else {
      req.body.completed = false;
    }
    Anime.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        },
        (error, updatedAnime) => {
          res.redirect(`/animes/${req.params.id}`)
        });
  });

  app.post("/animes", (req,res)=>{
    Anime.create(req.body, (err,createdAnime)=>{
        if (err) console.log (err);
        res.redirect("/animes");
    });
});

app.get("/animes/:id/edit", (req, res) => {
  Anime.findById(req.params.id, (error, foundAnime) => {
    res.render("edit.ejs", {
      anime: foundAnime,
    });
  });
});



app.listen(PORT, () =>
    console.log("jarvis is online" , PORT)
);

