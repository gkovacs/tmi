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
    console.log possible_experiments
  #, 2000
  #chrome.extension.onMessage.add
