list_fields = [
  'google_history'
  'bing_history'
]

single_fields = [
  'facebook_name'
  'facebook_link'
  'facebook_birthdate'
  'facebook_education'
  'facebook_hometown'
  'facebook_location'
]

custom_fields = {

}

export get_field_to_getters = (callback) ->
  output = {}
  for let field in single_fields
    output[field] = (ncallback) ->
      getvar field, ncallback
  for let field in list_fields
    output[field] = (ncallback) ->
      getlist field, ncallback
  for k,v of custom_fields
    output[k] = v
  callback output

export getfield = (fieldname, callback) ->
  field_getters <- get_field_to_getters()
  field_getter = field_getters[fieldname]
  if not field_getter?
    callback()
    return
  val <- field_getter()
  callback(val)

export getfields = (fieldname_list, callback) ->
  output = {}
  <- async.eachSeries fieldname_list, (name, ncallback) ->
    val <- getfield name
    output[name] = val
    ncallback()
  if callback?
    callback output
