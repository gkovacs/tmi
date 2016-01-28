export open_page = (page_name, options) ->
  newpage = $("<#{page_name}>")
  if options?
    for k,v of options
      newpage.attr k, v
  $('#contents').html newpage

export open_survey = (survey_name) ->
  open_page survey_name + '-survey'

export return_home = ->
  #open_page 'experiment-view'
  open_page 'popup-view'

export view_data = (survey_name) ->
  # open_page 'view_data?' + $.param {survey: survey_name}
  # window.open 'popup.html?' + $.param {
  #  tag: 'view-data'
  #  survey: survey_name
  #}
  open_page 'view-data', {survey: survey_name}

export start_spinner = ->
  if $('#spinoverlay').length == 0
    $('<div id="spinoverlay" style="width: 100vw; height: 100vh; position: fixed; top: 0px; left: 0px; pointer-events: none"></div>').appendTo('body')
  $('#spinoverlay').spin({scale: 5.0})

export end_spinner = ->
  $('#spinoverlay').spin(false)

export addlog = (data) ->
  data = {} <<< data
  if window.username?
    data.username = window.username
  if window.userid?
    data.userid = window.userid
  if window.client_ip_address?
    data.client_ip_address = window.client_ip_address
  data.time = Date.now()
  data.localtime = new Date().toString()
  $.ajax {
    type: 'POST'
    url: '/addlog'
    contentType: 'text/plain'
    data: JSON.stringify(data)
  }

export addcompletioncode = ->
  $.ajax {
    type: 'POST'
    url: '/addcompletioncode'
    contentType: 'text/plain'
    data: JSON.stringify({userid: window.userid, username: window.username})
  }
