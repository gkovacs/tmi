console.log 'var_utils loaded!'

sendmsg = (type, data, callback) ->
  chrome.runtime.sendMessage {
    type
    data
  }, callback

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

