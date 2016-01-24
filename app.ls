require! {
  express
  https
  fs
  'force-ssl'
}

LZString = require 'lz-string'

{MongoClient} = require 'mongodb'

mongourl = process.env.MONGOHQ_URL ? process.env.MONGOLAB_URI ? process.env.MONGOSOUP_URL ? 'mongodb://localhost:27017/default'

app = express()

if process.env.PORT? # on heroku
  app.listen process.env.PORT, '0.0.0.0'
  app.use forceSsl
else if fs.existsSync('/var/ssl_tmi/ssl.key')
  https_options = {
    key: fs.readFileSync('/var/ssl_tmi/ssl.key')
    cert: fs.readFileSync('/var/ssl_tmi/ssl.crt')
    ca: fs.readFileSync('/var/ssl_tmi/intermediate.crt')
    requestCert: false
    rejectUnauthorized: false
  }
  https.createServer(https_options, app).listen(443, '0.0.0.0')
  app.listen 80, '0.0.0.0'
  forceSsl.https_port = 443
  app.use forceSsl
else
  selfSignedHttps = require 'self-signed-https'
  selfSignedHttps(app).listen(8081, '0.0.0.0')
  app.listen 8080, '0.0.0.0'
  forceSsl.https_port = 8081
  app.use forceSsl

app.use express.static __dirname

#app.use require('body-parser').json()
app.use require('body-parser').text({limit: '1000mb'})

app.get '/somefunc', (req, res) ->
  res.send 'hello world'

app.post '/logsurvey_compressed', (req, res) ->
  data_compressed = req.body
  data = JSON.parse LZString.decompressFromEncodedURIComponent data_compressed
  {surveyname} = data
  if not surveyname?
    res.send 'need surveyname param'
    return
  data.ip = req.ip
  logsurvey data_compressed, surveyname, ->
    res.send 'done'

app.post '/addlog', (req, res) ->
  data = req.body
  if typeof(data) == 'string'
    data = JSON.parse data
  addlog data, ->
    res.send 'done'

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

app.get '/viewlogs', (req, res) ->
  get-collection 'logs', (collection, db) ->
    collection.find({}).toArray (err, results) ->
      res.set 'Content-Type', 'text/plain'
      res.send JSON.stringify(results, null, 2)
      db.close()

get-mongo-db = (callback) ->
  #MongoClient.connect mongourl, {
  #  auto_reconnect: true
  #  poolSize: 20
  #  socketOtions: {keepAlive: 1}
  #}, (err, db) ->
  MongoClient.connect mongourl, (err, db) ->
    if err
      console.log 'error getting mongodb'
    else
      callback db

get-collection = (collection_name, callback) ->
  get-mongo-db (db) ->
    callback db.collection(collection_name), db

addlog = (data, callback) ->
  get-collection 'logs', (collection, db) ->
    collection.insert {data: data_compressed}, (err, docs) ->
      if err?
        console.log 'error upon insertion'
        console.log err
      else
        console.log 'insertion done'
        if callback?
          callback()
      db.close()

logsurvey = (data_compressed, surveyname, callback) ->
  get-collection surveyname, (collection, db) ->
    collection.insert {data: data_compressed}, (err, docs) ->
      if err?
        console.log 'error upon insertion'
        console.log err
      else
        console.log 'insertion done'
        if callback?
          callback()
      db.close()

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

