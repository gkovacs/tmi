console.log 'weblab running in background'

execute_content_script = (script_path, callback) ->
  chrome.tabs.query {active: true, lastFocusedWindow: true}, (tabs) ->
    if tabs.length == 0
      if callback?
        callback()
      return
    chrome.tabs.executeScript tabs[0].id, {file: script_path, allFrames: false, runAt: 'document_start'}, ->
      if callback?
        callback()

insert_css = (css_path, callback) ->
  # todo does not do anything currently
  if callback?
    callback()

load_experiment = (experiment_name, callback) ->
  all_experiments <- get_experiments()
  experiment_info = all_experiments[experiment_name]
  <- async.eachSeries experiment_info.scripts, (script_name, ncallback) ->
    execute_content_script "experiments/#{experiment_name}/#{script_name}", ncallback
  <- async.eachSeries experiment_info.css, (css_name, ncallback) ->
    insert_css "experiments/#{experiment_name}/#{css_name}", ncallback
  if callback?
    callback()

load_experiment_for_location = (location, callback) ->
  possible_experiments <- list_available_experiments_for_location()
  console.log 'possible experiments are:'
  console.log possible_experiments
  if possible_experiments.length > 0
    load_experiment possible_experiments[0]


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
  'getLocation': (data, callback) ->
    getLocation (location) ->
      console.log 'getLocation background page:'
      console.log location
      callback location
  'load_experiment': (data, callback) ->
    {experiment_name} = data
    load_experiment experiment_name, ->
      if callback?
        callback()
  'load_experiment_for_location': (data, callback) ->
    {location} = data
    load_experiment_for_location location, ->
      if callback?
        callback()
}

chrome.runtime.onMessage.addListener (request, sender, sendResponse) ->
  {type, data} = request
  console.log type
  console.log data
  message_handler = message_handlers[type]
  if not message_handler?
    return
  message_handler data, (response) ->
    console.log 'message handler response:'
    console.log response
    sendResponse response

