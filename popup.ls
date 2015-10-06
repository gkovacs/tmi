# note: it seems that we can send to background page, but the response callback is not called?

/*
getLocation = (callback) ->
  sendBackground 'getLocation', {}, (location) ->
    console.log 'got location'
    console.log location

sendBackground = (type, data, callback) ->
  console.log 'sendBackground sent: '
  console.log type
  console.log data
  chrome.runtime.sendMessage {type, data}, (response) ->
    console.log 'got response!'
    callback response
*/

getLocation = (callback) ->
  #sendTab 'getLocation', {}, callback
  getTabInfo (tabinfo) ->
    callback tabinfo.url

getTabInfo = (callback) ->
  chrome.tabs.query {active: true, lastFocusedWindow: true}, (tabs) ->
    if tabs.length == 0
      return
    chrome.tabs.get tabs[0].id, callback

reloadTab = (callback) ->
  chrome.tabs.query {active: true, lastFocusedWindow: true}, (tabs) ->
    if tabs.length == 0
      return
    chrome.tabs.reload tabs[0].id, callback

$(document).ready ->
  #alert 'hello world'
  #alert window.location.href
  #chrome.extension.onMessage.addListener (request, sender, sendResponse) ->
  #setInterval ->
  $('#open_options_page').click ->
    chrome.runtime.openOptionsPage()
  do ->
    console.log 'message sent askdfjl!'
    #$.get 'https://edufeed.cloudant.com/', (response) ->
    #  console.log 'response received'
    #  console.log response
    location <- getLocation()
    console.log 'received location'
    console.log location
    {hostname, path} = new URL("/aa/bb/", location)
    $('#sitename').text hostname
    possible_experiments <- list_available_experiments_for_location(location)
    all_experiments <- get_experiments()
    console.log possible_experiments
    for let experiment_name in possible_experiments
      experiment_info = all_experiments[experiment_name]
      experiment_selector = $('<div>').css {'margin-bottom': '5px'}
      experiment_selector.append $('<span>').text(experiment_info.title)
      experiment_selector_button = $('<paper-button raised="raised" style="background: #4285f4; color: #fff">').text('Participate')
      enabled_experiments = JSON.parse(localStorage.getItem('experiments')) ? []
      experiment_enabled = enabled_experiments.indexOf(experiment_name) != -1
      if experiment_enabled
        experiment_selector_button.text('Leave Experiment')
      if not experiment_enabled
        experiment_selector_button.click ->
          console.log 'activated experiment: ' + experiment_name
          enabled_experiments = JSON.parse(localStorage.getItem('experiments')) ? []
          enabled_experiments = enabled_experiments.filter (x) -> possible_experiments.indexOf(x) == -1
          enabled_experiments.push experiment_name
          localStorage.setItem 'experiments', JSON.stringify(enabled_experiments)
          reloadTab()
          window.location.reload()
          #alert 'activated experiment: ' + experiment_name
      else
        experiment_selector_button.click ->
          console.log 'left experiment: ' + experiment_name
          enabled_experiments = JSON.parse(localStorage.getItem('experiments')) ? []
          enabled_experiments = enabled_experiments.filter (x) -> possible_experiments.indexOf(x) == -1
          localStorage.setItem 'experiments', JSON.stringify(enabled_experiments)
          reloadTab()
          window.location.reload()
          #alert 'activated experiment: ' + experiment_name
      experiment_selector_button.appendTo experiment_selector
      experiment_selector.appendTo $('#experiment_list')
  #, 2000
  #chrome.extension.onMessage.add
