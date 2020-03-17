const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const flatCache = require('flat-cache');

let cache = flatCache.load('migrantsCache');

// Platform checks
const isWin = process.platform === "win32";
const isLinux = process.platform === "linux";
const isMac = process.platform === "darwin";


let dbURL = ['DB_URL];

let db = mongoose.connection;

let connectWithRetry = function() {
  return mongoose.connect(dbURL, { useNewUrlParser: true }, function(error) {
    if (error && (isLinux || isMac)) {
      console.error('Failed to connect to mongo on startup - retrying in 5 sec: ' + error);
      setTimeout(connectWithRetry, 5000);
    }
    else if (error && isWin){
      console.error('Failed to connect to mongo on startup - fix PuTTY tunnel before proceeding and run: npm run node. Retrying in 5 sec: ' + error);
      setTimeout(connectWithRetry, 5000);
    }
  });
};

connectWithRetry();

db.on('connecting', function() {
  console.log('Connecting to MongoDB...');
});

db.on('connected', function() {
  console.log(`MongoDB is connected! Visit http://localhost:3000/map`);
});
db.on('reconnected', function () {
  console.log('MongoDB is reconnected!');
});
db.on('disconnected', function() {
  console.log('MongoDB is disconnected!');
});

// routes/index.js
// Mongoose Schema definition
let Schema = mongoose.Schema;
let JsonSchema = new Schema({
  _id: Schema.Types.ObjectId,
  'name': String,
  'gm_code': Number,
  'provincie': String,
  'date': String,
  'counts': [{
    date: String,
    count: Number
  }],
  'total': Number
});

// Mongoose Model definition
let Json = mongoose.model('jsondata', JsonSchema, 'data');

// create flat cache routes
let flatCacheMiddleware = (req,res, next) => {
  let key =  '__express__' + req.originalUrl || req.url;
  let cacheContent = cache.getKey(key);
  if( cacheContent){
    res.send( cacheContent );
  }else{
    res.sendResponse = res.send;
    res.send = (body) => {
      cache.setKey(key,body);
      cache.save();
      res.sendResponse(body)
    };
    next()
  }
};

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Hoi' });
// });

router.get('/CENSORED_VARIABLE', function (req, res) {
  Json.find({'type': 'CENSORED_VARIABLE'},{'_id': 0, 'name': 1, 'geometry': 1}).distinct('name', function (err, docs) {
    res.json(docs);
  });
});

router.get('/CENSORED_VARIABLE/', function (req, res) {
  console.log(req.params.name);
  if (req.params.name) {
    Json.find({ 'type': "CENSORED_VARIABLE", 'name': req.params.name},{}, function (err, docs) {
      res.json(docs);
    });
  }
});

router.get('/CENSORED_VARIABLE/', function (req, res) {
  console.log(req.params.name);
  if (req.params.name && req.params.date) {
    Json.find({ 'type': "CENSORED_VARIABLE", 'name': req.params.name, "date": req.params.date},{}, function (err, docs) {
      res.json(docs);
    });
  }
});

router.get('/CENSORED_VARIABLE/', function (req, res) {
  console.log(req.params.name);
  if (req.params.name) {
    Json.findOne({ 'type': "CENSORED_VARIABLE", 'name': req.params.name},{'_id': 1, 'geometry':1}, function (err, docs) {
      res.json(docs);
    });
  }
});

router.get('CENSORED_VARIABLE', function (req, res) {
  console.log(req.params.provincie);
  if (req.params.provincie && req.params.date) {
    Json.find({ "type": "CENSORED_VARIABLE", "name": req.params.provincie, "date": req.params.date},{}, function (err, docs) {
      res.json(docs);
    });
  }
});

router.get('/CENSORED_VARIABLE', function (req, res) {
  Json.find({}, {}, function (err, docs) {
    res.json(docs);
  });
});

router.get('/CENSORED_VARIABLE', function (req, res) {
  console.log(req.params.name);
  if (req.params.name) {
    Json.find({ 'type': "CENSORED_VARIABLE", 'name': req.params.name},{"_id": 0, 'counts': 1}, function (err, docs) {
      res.json(docs);
    });
  }
});

router.get('/CENSORED_VARIABLE', function (req, res) {
  Json.find({"type": "CENSORED_VARIABLE", "total": {"$exists": true}}, {'_id': 0, "type": 0, "provincie": 0}, function (err, docs) {
    res.json(docs);
  });
});

router.get('/CENSORED_VARIABLE', function (req, res) {
  Json.find({"type": "CENSORED_VARIABLE", "total": {"$exists": true}}, {'_id': 0, "type": 0}, function (err, docs) {
    res.json(docs);
  });
});

router.get('/CENSORED_VARIABLE', function (req, res) {
  Json.find({"type": "CENSORED_VARIABLE"}, {'_id': 0, "type": 0}, function (err, docs) {
    res.json(docs);
  });
});


router.get('/map', flatCacheMiddleware, function(req, res, next) {
  res.render('map_only', { title: 'CENSORED_VARIABLE' });
});

module.exports = router;
