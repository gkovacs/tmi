#active_experiments = {
#  'www.google.com': 'google_alert'
#}

sendBackground = (type, data, callback) ->
  console.log 'sendBackground sent: '
  console.log type
  console.log data
  chrome.runtime.sendMessage {type, data}, (response) ->
    console.log 'got response!'
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
