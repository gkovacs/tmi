console.log 'weblab running in background'

execute_content_script = (options, callback) ->
  if not options.run_at?
    options.run_at = 'document_start' # document_end
  if not options.all_frames?
    options.all_frames = false
  chrome.tabs.query {active: true, lastFocusedWindow: true}, (tabs) ->
    if tabs.length == 0
      if callback?
        callback()
      return
    chrome.tabs.executeScript tabs[0].id, {file: options.path, allFrames: options.all_frames, runAt: options.run_at}, ->
      if callback?
        callback()

insert_css = (css_path, callback) ->
  # todo does not do anything currently
  if callback?
    callback()

load_experiment = (experiment_name, callback) ->
  console.log 'load_experiment ' + experiment_name
  all_experiments <- get_experiments()
  experiment_info = all_experiments[experiment_name]
  <- async.eachSeries experiment_info.scripts, (options, ncallback) ->
    if typeof options == 'string'
      options = {path: options}
    if options.path[0] == '/'
      options.path = 'experiments' + options.path
    else
      options.path = "experiments/#{experiment_name}/#{options.path}"
    execute_content_script options, ncallback
  <- async.eachSeries experiment_info.css, (css_name, ncallback) ->
    insert_css "experiments/#{experiment_name}/#{css_name}", ncallback
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
  'getfields': (namelist, callback) ->
    confirm_permissions namelist, (accepted) ->
      if not accepted
        return
      getfields namelist, (results) ->
        console.log 'getfields result:'
        console.log results
        callback results
}

confirm_permissions = (fieldlist, callback) ->
  field_info <- get_field_info()
  field_info_list = []
  for x in fieldlist
    output = {name: x}
    if field_info[x]? and field_info[x].description?
      output.description = field_info[x].description
    field_info_list.push output
  sendTab 'confirm_permissions', field_info_list, callback

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
  if type == 'getfields'
    # do not prompt for permissions for these urls
    whitelist = [
      'http://localhost:8080/previewdata.html'
    ]
    for whitelisted_url in whitelist
      if sender.url.indexOf(whitelisted_url) == 0
        message_handler = message_handers.getfields
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
