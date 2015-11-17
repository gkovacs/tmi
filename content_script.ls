#active_experiments = {
#  'www.google.com': 'google_alert'
#}

chrome.runtime.onMessage.addListener (req, sender, sendResponse) ->
  {type, data} = req
  if type == 'confirm_permissions'
    permissions_list = []
    for x in data
      if x.description?
        permissions_list.push x.description
      else
        permissions_list.push x.name
    swal {
      title: 'Data Access Request'
      type: 'info'
      showCancelButton: true
      allowEscapeKey: false
      confirmButtonText: 'Approve'
      cancelButtonText: 'Deny'
      html: true
      text: 'This page would like access to the following data <a target="_blank" href="http://localhost:8080/previewdata.html?fields=' + [x.name for x in data].join(',') + '">(preview)</a>:<br><br>' + permissions_list.join('<br>')
    }, (accepted) ->
      console.log 'result was: '
      console.log accepted
      sendResponse accepted
    #accepted = confirm 'Would you like to grant the following permissions:\n\n' + data.join('\n')
    #if sendResponse?
    #  sendResponse accepted
  return true # async response

do ->
  ndiv = document.createElement('div')
  ndiv.id = 'autosurvey_content_script_loaded'
  document.body.appendChild(ndiv)

console.log 'content_script loaded'

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

