(function(){
  var express, LZString, MongoClient, mongourl, ref$, app, getMongoDb, getCollection, logsurvey;
  express = require('express');
  LZString = require('lz-string');
  MongoClient = require('mongodb').MongoClient;
  mongourl = (ref$ = process.env.MONGOHQ_URL) != null
    ? ref$
    : (ref$ = process.env.MONGOLAB_URI) != null
      ? ref$
      : (ref$ = process.env.MONGOSOUP_URL) != null ? ref$ : 'mongodb://localhost:27017/default';
  app = express();
  app.set('port', (ref$ = process.env.PORT) != null ? ref$ : 8080);
  app.use(express['static'](__dirname));
  app.use(require('body-parser').text({
    limit: '1000mb'
  }));
  app.listen(app.get('port'), '0.0.0.0');
  app.get('/somefunc', function(req, res){
    return res.send('hello world');
  });
  app.post('/logsurvey_compressed', function(req, res){
    var data_compressed, data, surveyname;
    data_compressed = req.body;
    console.log(data_compressed);
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
  app.get('/listsurvey', function(req, res){
    var surveyname;
    surveyname = req.query.surveyname;
    if (surveyname == null) {
      res.send('need surveyname param');
      return;
    }
    return getCollection(surveyname, function(collection, db){
      return collection.find({}).toArray(function(err, results){
        var output, i$, len$, data;
        output = [];
        for (i$ = 0, len$ = results.length; i$ < len$; ++i$) {
          data = results[i$].data;
          output.push(JSON.parse(LZString.decompressFromEncodedURIComponent(data)));
        }
        res.set('Content-Type', 'text/plain');
        res.send(JSON.stringify(output, null, 2));
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
  logsurvey = function(data_compressed, surveyname, callback){
    return getCollection(surveyname, function(collection, db){
      console.log('have collection:');
      console.log(collection);
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
