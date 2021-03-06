var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var questSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    required: true
  },
  champion: {
    type: Number,
    required: true,
    default: null
  },
  objectives: [{
      objective: String,
      value: Number
    }]
    // numGames: Number,
    // kills: Number,
    // champion: Number,
    // assists: Number,
    // deaths: Number,
    // goldEarned: Number,
    // minions: Number,
    // winner: Boolean,
    // pentaKills: Number,
    // quadraKills: Number,
    // tripleKills: Number,
    // wardsPlaced: Number,
    // wardsKilled: Number,
    // healingDone: Number,
    // largestKillingSpree: Number,
    // firstBloodKill: Number,
    // neutralMinionsKilled: Number,
    // neutralMinionsKilledEnemyJungle: Number
});

questSchema.statics.random = function (quests, cb) {
  // var ids = [];
  // if (quests.length > 0) {
  //   for (var i = 0; i < quests.length; i++) {
  //     ids.push(quests.details._id);
  //   }
  // }
  // console.log(ids);
  this.count(function (err, count) {
    if (err) {
      return cb(err);
    }
    var rand = Math.floor(Math.random() * count);
    this.find().findOne().skip(rand).exec(cb);
  }.bind(this));
};
module.exports = mongoose.model('Quest', questSchema);
