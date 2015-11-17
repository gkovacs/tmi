/*
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
  'google_queries': (callback) ->
    google_history <- getlist 'google_history'
    callback [x.query for x in google_history]
  'bing_queries': (callback) ->
    bing_history <- getlist 'bing_history'
    callback [x.query for x in bing_history]
}

export get_custom_getter_for_field = (field, callback) ->
  getter_text <- $.get 'fields/' + field + '.js'
  callback string_to_function getter_text

export string_to_function = (str) ->
  lines = str.split('\n')
  if lines[0].trim() == '(function(){' and lines[lines.length - 1].trim() == '}).call(this);'
    lines = lines[1 til lines.length - 1]
  return new Function(lines.join('\n'))
*/

export get_field_to_getters = memoizeSingleAsync (callback) ->
  field_info <- get_field_info()
  output = {}
  <- async.forEachOf field_info, (info, field, donecb) ->
    {type} = info
    if type == 'var'
      output[field] = (ncallback) ->
        getvar field, ncallback
      return donecb()
    if type == 'list'
      output[field] = (ncallback) ->
        getlist field, ncallback
      return donecb()
    if type == 'computed'
      output[field] = computed_fields[field]
      return donecb()
    console.log "field #{field} has unknown type #{type}"
    return donecb()
  callback output
  /*
  for let field in single_fields
    output[field] = (ncallback) ->
      getvar field, ncallback
  for let field in list_fields
    output[field] = (ncallback) ->
      getlist field, ncallback
  for k,v of custom_fields
    output[k] = v
  callback output
  */

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

export get_field_info = memoizeSingleAsync (callback) ->
  field_info_text <- $.get 'fields/field_info.yaml'
  field_info = jsyaml.safeLoad field_info_text
  callback field_info
