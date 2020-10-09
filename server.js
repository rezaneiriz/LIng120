var express = require('express');
var app = express();
const session = require('express-session');
var fs = require('fs');

app.set('view engine', 'ejs');

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET' 
}));

var path = require('path');

var Engine = require('./TestEngine.js');

// middleware
app.use(express.json());
app.use(express.urlencoded());
//The function to return the input page
app.get('/', function(req, res) {
  res.render('pages/auth');
  //res.sendFile(__dirname + '/Home.html');
});

app.get('/results', function(req, res){
  res.render('pages/results',{
    t1score : "NA",
    t2score : "NA",
    t3score : "NA",
    t4score : "NA"
  });
})
app.post('/StudentResult', function(req, res){
  fs.readFile('Answers.json', 'utf8', function(err, data){
    if (err){
        console.log(err);
    } else {
      var obj = JSON.parse(data); //now it an object
      obj = obj[req.body.stu];
      res.render('pages/results',{
        t1score : obj.haigyPaigy.feedback.score,
        t2score : obj.articleReplacement.feedback.score,
        t3score : obj.turkishPlurals.feedback.score,
        t4score : obj.corpusCleaning.feedback.score
      })
    }
    })
})

//The function to return the test resutlts
app.post('/TestThis', function(req, res){
  try{

    var myres = Engine.testRegex(req.body.response, req.body.task);
  }
  catch(e){
    myres = {score: "undefined", passFail: "undefined"}
  }
  var obj;
  console.log(myres);
  fs.readFile('Answers.json', 'utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
    } else {
      obj = JSON.parse(data); //now it an object
      if (obj[req.body.user] == undefined){
        var tasks = {
          "articleReplacement" : {"answer": "", "feedback": ""},
          "corpusCleaning" : {"answer": "", "feedback": ""},
          "haigyPaigy" : {"answer": "", "feedback": ""},
          "turkishPlurals" : {"answer": "", "feedback": ""}
        }
        obj[req.body.user] = tasks;
      }
      obj[req.body.user][req.body.task].answer = req.body.response;
      obj[req.body.user][req.body.task].feedback = myres;
      var saving = JSON.stringify(obj);
      fs.writeFile('Answers.json', saving, 'utf8', function(err, data){
        console.log(err);
      });
  }});

  res.json(myres);
});

app.use(express.static(path.join(__dirname, '/')));

const port = process.env.PORT || 3000;
app.listen(port , () => console.log('App listening on port ' + port));




const passport = require('passport');
var userProfile;

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

app.get('/success', function(req, res){
  var obj = {};
  fs.readFile('Answers.json', 'utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
    } else {
      obj = JSON.parse(data);
      var fb = obj[userProfile.emails[0].value];
      res.render('pages/Home', {
        user: userProfile,
        feedback: fb
      });
    }});

});
app.get('/check', function(req, res){
  if (userProfile == null){
    res.render('pages/auth');
  }
  else{
    res.render('pages/Home', {
      user: userProfile
    });
  }
})
app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});



/*  Google AUTH  */
 
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = '1078166362170-bu5qgaptl4ta6hv04rhj2vd7cc4k7o0j.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = 'AZEGq-sxTPk09iTmP-Duzp-L';
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }
));
 
app.get('/auth/google', 
  passport.authenticate('google', { scope : ['profile', 'email'] }));
 
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    // Successful authentication, redirect success.
    res.redirect('/success');
  });
