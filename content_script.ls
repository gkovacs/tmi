#active_experiments = {
#  'www.google.com': 'google_alert'
#}

chrome.runtime.onMessage.addListener (req, sender, sendResponse) ->
  {type, data} = req
  if type == 'confirm_permissions'
    accepted = confirm 'Would you like to grant the following permissions:\n\n' + data.join('\n')
    if sendResponse?
      sendResponse accepted


sendBackground = (type, data, callback) ->
  console.log 'sendBackground sent: '
  console.log type
  console.log data
  chrome.runtime.sendMessage {type, data}, (response) ->
    console.log 'got response!'
    if callback?
      callback response

load_experiment_for_location = (location) ->
  sendBackground 'load_experiment_for_location', {location}

#load_experiment = (experiment_name) ->
#  sendBackground 'load_experiment', {name: experiment_name}

load_experiment_for_location window.location.href

#hostname = window.location.host
#load_experiment_for_location window.location.href
#experiment_name = active_experiments[hostname]
#if experiment_name?
#  load_experiment(experiment_name)
