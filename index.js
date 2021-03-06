'use strict';
var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var MongoStore = require('connect-mongo')(session);
var config = require('./configs.js');
var User = require('./models/user.js');
var Quest = require('./models/quest.js');
var favicon = require('serve-favicon');
passport.use(new LocalStrategy(
  function (email, password, done) {
    User.findOne({
      email: email
    }, function (err, user) {
      if (err) {
        return done(err);
      }
      console.log('swag');
      if (!user) {
        return done(null, false, {
          message: 'Incorrect username.'
        });
      }
      if (!user.validPassword(password)) {
        return done(null, false, {
          message: 'Incorrect password.'
        });
      }
      return done(null, user);
    }).populate('quest');
  }
));

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {

  User.findById(user._id).populate({
    path: 'quests.details',
    model: 'Quest'
  }).exec(function (err, u) {
    if (err)
      throw err;
    done(null, u);
  });
});
var auth = require('./routes/auth.js');
var quests = require('./routes/quest.js');
var api = require('./routes/api.js');
var stats = require('./routes/stats.js');
app.use(express.static('public'));
app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'secretKeyThing',
  store: new MongoStore({
    url: config.db
  })
}));
app.use(passport.initialize());
app.use(passport.session());
addQuests();
app.use('/auth', auth);
app.use('/quest', quests);
//app.use('/user', user);
app.use('/stats', stats);
app.use('/api', api);

function addQuests() {
  var quests = [{
    "title": "Lux Beginner",
    "type": 0,
    "description": "Get 10 kills on Lux",
    "points": 10,
    "champion": 99,
    "objectives": [{
      "objective": "kills",
      "value": 10
    }]
  }, {
    "title": "Lux Intermediate",
    "type": 0,
    "description": "Get two triple kills on Lux",
    "points": 20,
    "champion": 99,
    "objectives": [{
      "objective": "tripleKills",
      "value": 2
    }]
  }, {
    "title": "Lux Pro",
    "type": 0,
    "description": "Get a pentakill on Lux",
    "points": 25,
    "champion": 99,
    "objectives": [{
      "objective": "pentaKills",
      "value": 1
    }]
  }, {
    "title": "Support Beginner",
    "type": 0,
    "description": "Place 10 wards in one game",
    "points": 10,
    "objectives": [{
      "objective": "numGames",
      "value": 1
    }, {
      "objective": "wardsPlaced",
      "value": 10
    }]
  }, {
    "title": "Support Intermediate",
    "type": 0,
    "description": "Destroy 20 wards",
    "points": 20,
    "objectives": [{
      "objective": "wardsKilled",
      "value": 20
    }]
  }, {
    "title": "Support Pro",
    "type": 0,
    "description": "Destroy a total of 500 wards, place 500 wards and heal 10000 hp",
    "points": 25,
    "objectives": [{
      "objective": "wardsKilled",
      "value": 20
    }, {
      "objective": "wardsPlaced",
      "value": 500
    }, {
      "objective": "healingDone",
      "value": 10000
    }]
  }, {
    "title": "Jungle Beginner",
    "type": 0,
    "description": "Take 15 jungle camps in one game",
    "points": 10,
    "objectives": [{
      "objective": "numGames",
      "value": 1
    }, {
      "objective": "neutralMinionsKilled",
      "value": 15
    }]
  }, {
    "title": "Jungle Intermediate",
    "type": 0,
    "description": "Steal 5 enemy jungle camps in one game",
    "points": 20,
    "objectives": [{
      "objective": "numGames",
      "value": 1
    }, {
      "objective": "neutralMinionsKilledEnemyJungle",
      "value": 5
    }]
  }, {
    "title": "Jungle Pro",
    "type": 0,
    "description": "Steal 5 jungle camps and take a total of 25 jungle camps in one game",
    "points": 25,
    "objectives": [{
      "objective": "numGames",
      "value": 1
    }, {
      "objective": "neutralMinionsKilledEnemyJungle",
      "value": 5
    }, {
      "objective": "neutralMinionsKilled",
      "value": 25
    }]
  }, {
    "title": "Sample quest 1",
    "type": 0,
    "description": "Get 5 kills C:",
    "points": 100,
    "objectives": [{
      "objective": "kills",
      "value": 5
    }]
  }, {
    "title": "Sample quest 2",
    "type": 0,
    "description": "Super difficult quest to get 10 kills in 2 games",
    "points": 100,
    "objectives": [{
      "objective": "kills",
      "value": 20
    }, {
      "objective": "numGames",
      "value": 2
    }]
  }];
  Quest.count({}, function (err, count) {
    if (count === 0)
      Quest.remove({}, function (err) {
        if (err) {
          throw err;
        }
        Quest.collection.insert(quests, function (err) {
          if (err) {
            throw err;
          } else {
            console.log('Stored quests');
          }
        });
      });
  });
}


app.listen(config.port, function () {
  console.log('listening');
});
