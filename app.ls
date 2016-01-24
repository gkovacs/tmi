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

app.set 'port', process.env.PORT ? 80

if not process.env.PORT?
  #selfSignedHttps = require 'self-signed-https'
  #selfSignedHttps(app).listen(443, '0.0.0.0')
  https.createServer({key: fs.readFileSync('/home/geza2/ssl.key'), cert: fs.readFileSync('/home/geza2/ssl.crt'), ca: fs.readFileSync('/home/geza2/intermediate.crt'), requestCert: false, rejectUnauthorized: false}, app).listen(443, '0.0.0.0')
  app.listen app.get('port'), '0.0.0.0'
  forceSsl.https_port = 443
  app.use forceSsl
else
  app.listen app.get('port'), '0.0.0.0'
  #app.use forceSsl

app.use express.static __dirname

#app.use require('body-parser').json()
app.use require('body-parser').text({limit: '1000mb'})

app.get '/somefunc', (req, res) ->
  res.send 'hello world'

app.post '/logsurvey_compressed', (req, res) ->
  data_compressed = req.body
  console.log data_compressed
  data = JSON.parse LZString.decompressFromEncodedURIComponent data_compressed
  {surveyname} = data
  if not surveyname?
    res.send 'need surveyname param'
    return
  data.ip = req.ip
  logsurvey data_compressed, surveyname, ->
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

logsurvey = (data_compressed, surveyname, callback) ->
  get-collection surveyname, (collection, db) ->
    console.log 'have collection:'
    console.log collection
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

