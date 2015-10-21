export getDb = memoizeSingleAsync (callback) ->
  new minimongo.IndexedDb {namespace: 'autosurvey'}, callback

export getCollection = (collection_name, callback) ->
  db <- getDb()
  collection = db.collections[collection_name]
  if collection?
    callback collection
    return
  <- db.addCollection collection_name
  callback db.collections[collection_name]

export getVarsCollection = memoizeSingleAsync (callback) ->
  getCollection 'vars', callback

export getListsCollection = memoizeSingleAsync (callback) ->
  getCollection 'lists', callback

export setvar = (name, val, callback) ->
  data <- getVarsCollection()
  result <- data.upsert {_id: name, val: val}
  if callback?
    callback()

export getvar = (name, callback) ->
  data <- getVarsCollection()
  result <- data.findOne {_id: name}
  if result?
    callback result.val
    return
  else
    callback null
    return
  # if var is not set, return null instead

export clearvar = (name, callback) ->
  data <- getVarsCollection()
  <- data.remove name
  if callback?
    callback()

export printvar = (name) ->
  result <- getvar name
  console.log result

export addtolist = (name, val, callback) ->
  data <- getListsCollection()
  result <- data.upsert {name: name, val: val}
  if callback?
    callback()

export getlist = (name, callback) ->
  data <- getListsCollection()
  result <- data.find({name: name}).fetch()
  callback [x.val for x in result]

export clearlist = (name, callback) ->
  data <- getListsCollection()
  result <- data.find({name: name}).fetch()
  <- async.eachSeries result, (item, ncallback) ->
    <- data.remove item['_id']
    ncallback()
  if callback?
    callback()

export printlist = (name) ->
  result <- getlist name
  console.log result

$(document).ready ->
  facebook_name <- getvar 'facebook_name'
  facebook_link <- getvar 'facebook_link'
  facebook_birthdate <- getvar 'facebook_birthdate'
  facebook_occupation <- getvar 'facebook_occupation'
  $('#facebook_name').text facebook_name
  $('#facebook_link').text facebook_link
  $('#facebook_occupation').text facebook_occupation
  $('#facebook_birthdate').text facebook_birthdate
  console.log 'popup is getting rendered'
