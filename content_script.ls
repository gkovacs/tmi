#active_experiments = {
#  'www.google.com': 'google_alert'
#}

textToHtml = (str) ->
  tmp = document.createElement('span')
  tmp.innerText = str
  return tmp.innerHTML

chrome.runtime.onMessage.addListener (req, sender, sendResponse) ->
  {type, data} = req
  if type == 'confirm_permissions'
    permissions_list = []
    {fields, pagename} = data
    for x in fields
      if x.description?
        permissions_list.push x.description
      else
        permissions_list.push x.name
    pagehtml = ''
    if pagename?
      pagehtml = '<b>(' + textToHtml(pagename) + ')</b>'
    swal {
      title: 'This page needs your data'
      type: 'info'
      showCancelButton: true
      allowEscapeKey: false
      confirmButtonText: 'Approve'
      cancelButtonText: 'Deny'
      html: true
      text: 'This page ' + pagehtml + ' wants to access the following data <a target="_blank" href="https://tmi.netlify.com/previewdata.html?fields=' + [x.name for x in fields].join(',') + '">(details)</a>:<br><br>' + permissions_list.join('<br>')
    }, (accepted) ->
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
  chrome.runtime.sendMessage {type, data}, (response) ->
    if callback?
      callback response

load_experiment_for_location = (location) ->
  sendBackground 'load_experiment_for_location', {location}

load_experiment_for_location window.location.href
