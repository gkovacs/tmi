(function(){
  var express, https, fs, forceSsl, requestIp, LZString, MongoClient, mongourl, ref$, app, https_options, selfSignedHttps, hasusernamecompleted, hasuseridcompleted, addcompletioncode, getMongoDb, getCollection, addlog, logsurvey;
  express = require('express');
  https = require('https');
  fs = require('fs');
  forceSsl = require('force-ssl');
  requestIp = require('request-ip');
  LZString = require('lz-string');
  MongoClient = require('mongodb').MongoClient;
  mongourl = (ref$ = process.env.MONGOHQ_URL) != null
    ? ref$
    : (ref$ = process.env.MONGOLAB_URI) != null
      ? ref$
      : (ref$ = process.env.MONGOSOUP_URL) != null ? ref$ : 'mongodb://localhost:27017/default';
  app = express();
  if (process.env.PORT != null) {
    app.listen(process.env.PORT, '0.0.0.0');
    app.use(forceSsl);
  } else if (fs.existsSync('/var/ssl_tmi/ssl.key')) {
    https_options = {
      key: fs.readFileSync('/var/ssl_tmi/ssl.key'),
      cert: fs.readFileSync('/var/ssl_tmi/ssl.crt'),
      ca: fs.readFileSync('/var/ssl_tmi/intermediate.crt'),
      requestCert: false,
      rejectUnauthorized: false
    };
    https.createServer(https_options, app).listen(443, '0.0.0.0');
    app.listen(80, '0.0.0.0');
    forceSsl.https_port = 443;
    app.use(forceSsl);
  } else {
    selfSignedHttps = require('self-signed-https');
    selfSignedHttps(app).listen(8081, '0.0.0.0');
    app.listen(8080, '0.0.0.0');
    forceSsl.https_port = 8081;
    app.use(forceSsl);
  }
  app.use(express['static'](__dirname));
  app.use(require('body-parser').text({
    limit: '1000mb'
  }));
  app.get('/somefunc', function(req, res){
    return res.send('hello world');
  });
  app.post('/logsurvey_compressed', function(req, res){
    var data_compressed, data, surveyname;
    data_compressed = req.body;
    data = JSON.parse(LZString.decompressFromEncodedURIComponent(data_compressed));
    surveyname = data.surveyname;
    if (surveyname == null) {
      res.send('need surveyname param');
      return;
    }
    data.ip = req.ip;
    return logsurvey(data_compressed, surveyname, function(){
      return res.send('done');
    });
  });
  app.post('/addlog', function(req, res){
    var data;
    data = req.body;
    if (typeof data === 'string') {
      data = JSON.parse(data);
    }
    return addlog(data, function(){
      return res.send('done');
    });
  });
  app.get('/get_ip_address.js', function(req, res){
    res.set('Content-Type', 'text/javascript');
    return res.send('window.client_ip_address = "' + requestIp.getClientIp(req) + '";');
  });
  app.get('/hasuseridcompleted', function(req, res){
    var userid;
    userid = req.body;
    return hasuseridcompleted(userid, function(yesorno){
      res.set('Content-Type', 'text/javascript');
      if (yesorno) {
        return res.send('has_userid_completed(true);');
      } else {
        return res.send('has_userid_completed(false);');
      }
    });
  });
  app.get('/hasusernamecompleted', function(req, res){
    var username;
    username = req.body;
    return hasusernamecompleted(username, function(yesorno){
      res.set('Content-Type', 'text/javascript');
      if (yesorno) {
        return res.send('has_username_completed(true);');
      } else {
        return res.send('has_username_completed(false);');
      }
    });
  });
  app.post('/addcompletioncode', function(req, res){
    var data;
    data = req.body;
    if (typeof data === 'string') {
      data = JSON.parse(data);
    }
    return addcompletioncode(data, function(){
      return res.send('done');
    });
  });
  hasusernamecompleted = function(username, callback){
    return getCollection('completioncodes', function(collection, db){
      return collection.findOne({
        username: username
      }, function(err, doc){
        if (doc != null) {
          return callback(true);
        } else {
          return callback(false);
        }
      });
    });
  };
  hasuseridcompleted = function(userid, callback){
    return getCollection('completioncodes', function(collection, db){
      return collection.findOne({
        userid: userid
      }, function(err, doc){
        if (doc != null) {
          return callback(true);
        } else {
          return callback(false);
        }
      });
    });
  };
  addcompletioncode = function(data, callback){
    return getCollection('completioncodes', function(collection, db){
      return collection.insert(data, function(err, docs){
        if (err != null) {
          console.log('error upon insertion');
          console.log(err);
        } else {
          if (callback != null) {
            callback();
          }
        }
        return db.close();
      });
    });
  };
  /*
  app.post '/logsurvey', (req, res) ->
    data = req.body
    {surveyname} = data
    if not surveyname?
      res.send 'need surveyname param'
      return
    data.ip = req.ip
    logsurvey data, ->
      res.send 'done'
  
  app.get '/listsurvey', (req, res) ->
    {surveyname} = req.query
    if not surveyname?
      res.send 'need surveyname param'
      return
    get-collection surveyname, (collection, db) ->
      collection.find({}).toArray (err, results) ->
        res.send JSON.stringify(results)
        db.close()
  */
  /*
  app.get '/listsurvey', (req, res) ->
    {surveyname} = req.query
    if not surveyname?
      res.send 'need surveyname param'
      return
    get-collection surveyname, (collection, db) ->
      collection.find({}).toArray (err, results) ->
        output = []
        for {data} in results
          output.push JSON.parse LZString.decompressFromEncodedURIComponent(data)
        res.set 'Content-Type', 'text/plain'
        res.send JSON.stringify(output, null, 2)
        db.close()
  */
  app.get('/viewlogs', function(req, res){
    return getCollection('logs', function(collection, db){
      return collection.find({}).toArray(function(err, results){
        res.set('Content-Type', 'text/plain');
        res.send(JSON.stringify(results, null, 2));
        return db.close();
      });
    });
  });
  getMongoDb = function(callback){
    return MongoClient.connect(mongourl, function(err, db){
      if (err) {
        return console.log('error getting mongodb');
      } else {
        return callback(db);
      }
    });
  };
  getCollection = function(collection_name, callback){
    return getMongoDb(function(db){
      return callback(db.collection(collection_name), db);
    });
  };
  addlog = function(data, callback){
    return getCollection('logs', function(collection, db){
      return collection.insert(data, function(err, docs){
        if (err != null) {
          console.log('error upon insertion');
          console.log(err);
        } else {
          console.log('insertion done');
          if (callback != null) {
            callback();
          }
        }
        return db.close();
      });
    });
  };
  logsurvey = function(data_compressed, surveyname, callback){
    return getCollection(surveyname, function(collection, db){
      return collection.insert({
        data: data_compressed
      }, function(err, docs){
        if (err != null) {
          console.log('error upon insertion');
          console.log(err);
        } else {
          console.log('insertion done');
          if (callback != null) {
            callback();
          }
        }
        return db.close();
      });
    });
  };
  /*
  logsurvey = (data, callback) ->
    {surveyname} = data
    if not surveyname?
      console.log 'missing surveyname'
      return
    data.time = Date.now()
    data.localtime = new Date().toString()
    console.log 'performing insertion'
    console.log data
    get-collection surveyname, (collection, db) ->
      console.log 'have collection:'
      console.log collection
      collection.insert data, (err, docs) ->
        if err?
          console.log 'error upon insertion'
          console.log err
        else
          console.log 'insertion done'
          if callback?
            callback()
        db.close()
  */
}).call(this);
