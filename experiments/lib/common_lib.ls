pending_requests = {} # requestId -> callback

# listen to responses from the background thread
chrome.runtime.onMessage.addListener (req, sender, callback) ->
  if req.event == 'backgroundresponse'
    {requestId, response} = req
    matching_callback = pending_requests[requestId]
    if matching_callback?
      delete pending_requests[requestId]
      matching_callback(response)

sendmsg = (type, data, callback) ->
  if not callback?
    chrome.runtime.sendMessage {
      type
      data
    }
    return
  requestId = Math.floor(Math.random()*9999999).toString()
  pending_requests[requestId] = callback
  chrome.runtime.sendMessage {
    type
    data
    requestId
  } #, callback

export setvar = (key, value, callback) ->
  data = {}
  data[key] = value
  sendmsg 'setvars', data, callback

export setvars = (data, callback) ->
  sendmsg 'setvars', data, callback

export getvar = (key, callback) ->
  sendmsg 'getvar', key, callback

export getvars = (keylist, callback) ->
  sendmsg 'getvars', keylist, callback

export addtolist = (list, item, callback) ->
  data = {list: list, item: item}
  sendmsg 'addtolist', data, callback

export onpageupdate = (callback) ->
  chrome.runtime.onMessage.addListener (req, sender, sendResponse) ->
    if req.event == 'pageupdate'
      console.log 'onpageupdate event being called'
      callback()

export once_available = (selector, callback) ->
  current_result = document.querySelectorAll(selector)
  if current_result.length > 0
    callback current_result
  else
    setTimeout ->
      once_available selector, callback
    , 1000

# need this because NodeList does not have filter method
export filter_list = (func, list) ->
  return [x for x in list when func(x)]
