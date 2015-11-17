# console.log 'weblab running in background'

execute_content_script = (tabid, options, callback) ->
  if not options.run_at?
    options.run_at = 'document_end' # document_start
  if not options.all_frames?
    options.all_frames = false
  #chrome.tabs.query {active: true, lastFocusedWindow: true}, (tabs) ->
  if not tabid?
    if callback?
      callback()
    return
  chrome.tabs.executeScript tabid, {file: options.path, allFrames: options.all_frames, runAt: options.run_at}, ->
    if callback?
      callback()

insert_css = (css_path, callback) ->
  # todo does not do anything currently
  if callback?
    callback()

load_experiment = (experiment_name, callback) ->
  console.log 'start load_experiment ' + experiment_name
  all_experiments <- get_experiments()
  experiment_info = all_experiments[experiment_name]
  tabs <- chrome.tabs.query {active: true, lastFocusedWindow: true}
  tabid = tabs[0].id
  <- async.eachSeries experiment_info.scripts, (options, ncallback) ->
    if typeof options == 'string'
      options = {path: options}
    if options.path[0] == '/'
      options.path = 'experiments' + options.path
    else
      options.path = "experiments/#{experiment_name}/#{options.path}"
    execute_content_script tabid, options, ncallback
  # <- async.eachSeries experiment_info.css, (css_name, ncallback) ->
  #   insert_css "experiments/#{experiment_name}/#{css_name}", ncallback
  console.log 'done load_experiment ' + experiment_name
  if callback?
    callback()

load_experiment_for_location = (location, callback) ->
  possible_experiments <- list_available_experiments_for_location(location)
  errors, results <- async.eachSeries possible_experiments, (experiment, ncallback) ->
    load_experiment experiment, ncallback
  if callback?
    callback()

getLocation = (callback) ->
  #sendTab 'getLocation', {}, callback
  console.log 'calling getTabInfo'
  getTabInfo (tabinfo) ->
    console.log 'getTabInfo results'
    console.log tabinfo
    console.log tabinfo.url
    callback tabinfo.url

getTabInfo = (callback) ->
  chrome.tabs.query {active: true, lastFocusedWindow: true}, (tabs) ->
    console.log 'getTabInfo results'
    console.log tabs
    if tabs.length == 0
      return
    chrome.tabs.get tabs[0].id, callback

sendTab = (type, data, callback) ->
  chrome.tabs.query {active: true, lastFocusedWindow: true}, (tabs) ->
    console.log 'sendTab results'
    console.log tabs
    if tabs.length == 0
      return
    chrome.tabs.sendMessage tabs[0].id, {type, data}, {}, callback

message_handlers = {
  'setvars': (data, callback) ->
    <- async.forEachOfSeries data, (v, k, ncallback) ->
      <- setvar k, v
      ncallback()
    callback()
  'getfield': (name, callback) ->
    getfield name, callback
  'getfields': (namelist, callback) ->
    getfields namelist, callback
  'requestfields': (info, callback) ->
    {fieldnames} = info
    getfields fieldnames, callback
  'getvar': (name, callback) ->
    getvar name, callback
  'getvars': (namelist, callback) ->
    output = {}
    <- async.eachSeries namelist, (name, ncallback) ->
      val <- getvar name
      output[name] = val
      ncallback()
    callback output
  'addtolist': (data, callback) ->
    {list, item} = data
    addtolist list, item, callback
  'getlist': (name, callback) ->
    getlist name, callback
  'getLocation': (data, callback) ->
    getLocation (location) ->
      console.log 'getLocation background page:'
      console.log location
      callback location
  'load_experiment': (data, callback) ->
    {experiment_name} = data
    load_experiment experiment_name, ->
      callback()
  'load_experiment_for_location': (data, callback) ->
    {location} = data
    load_experiment_for_location location, ->
      callback()
}

ext_message_handlers = {
  # 'getfields': message_handers.getfields
  'requestfields': (info, callback) ->
    confirm_permissions info, (accepted) ->
      if not accepted
        return
      getfields info.fieldnames, (results) ->
        console.log 'getfields result:'
        console.log results
        callback results
  'get_field_descriptions': (namelist, callback) ->
    field_info <- get_field_info()
    output = {}
    for x in namelist
      if field_info[x]? and field_info[x].description?
        output[x] = field_info[x].description
    callback output
}

confirm_permissions = (info, callback) ->
  {pagename, fieldnames} = info
  field_info <- get_field_info()
  field_info_list = []
  for x in fieldnames
    output = {name: x}
    if field_info[x]? and field_info[x].description?
      output.description = field_info[x].description
    field_info_list.push output
  sendTab 'confirm_permissions', {pagename, fields: field_info_list}, callback

send_pageupdate_to_tab = (tabId) ->
  chrome.tabs.sendMessage tabId, {event: 'pageupdate'}

onWebNav = (tab) ->
  if tab.frameId == 0 # top-level frame
    {tabId} = tab
    possible_experiments <- list_available_experiments_for_location(tab.url)
    #if possible_experiments.length > 0
    #  chrome.pageAction.show(tabId)
    console.log 'pageupdate sent to tab'
    send_pageupdate_to_tab(tabId)

chrome.webNavigation.onCommitted.addListener onWebNav
chrome.webNavigation.onHistoryStateUpdated.addListener onWebNav

/*
chrome.tabs.onUpdated.addListener (tabId, changeInfo, tab) ->
  if tab.url
    #console.log 'tabs updated!'
    #console.log tab.url
    possible_experiments <- list_available_experiments_for_location(tab.url)
    if possible_experiments.length > 0
      chrome.pageAction.show(tabId)
    send_pageupdate_to_tab(tabId)
    # load_experiment_for_location tab.url
*/

chrome.runtime.onMessageExternal.addListener (request, sender, sendResponse) ->
  console.log 'onMessageExternal'
  console.log request
  console.log 'sender for onMessageExternal is:'
  console.log sender
  {type, data} = request
  message_handler = ext_message_handlers[type]
  if type == 'requestfields'
    # do not prompt for permissions for these urls
    whitelist = [
      'http://localhost:8080/previewdata.html'
      'http://tmi.netlify.com/previewdata.html'
      'https://tmi.netlify.com/previewdata.html'
    ]
    for whitelisted_url in whitelist
      if sender.url.indexOf(whitelisted_url) == 0
        message_handler = message_handlers.requestfields
        break
  if not message_handler?
    return
  #tabId = sender.tab.id
  message_handler data, (response) ~>
    #console.log 'response is:'
    #console.log response
    if sendResponse?
      sendResponse response
  return true # async response

chrome.runtime.onMessage.addListener (request, sender, sendResponse) ->
  {type, data} = request
  console.log type
  console.log data
  message_handler = message_handlers[type]
  if not message_handler?
    return
  # tabId = sender.tab.id
  message_handler data, (response) ->
    console.log 'message handler response:'
    console.log response
    #response_data = {response}
    #console.log response_data
    # chrome bug - doesn't seem to actually send the response back....
    #sendResponse response_data
    if sendResponse?
      sendResponse response
    # {requestId} = request
    # if requestId? # response requested
    #  chrome.tabs.sendMessage tabId, {event: 'backgroundresponse', requestId, response}
  return true
