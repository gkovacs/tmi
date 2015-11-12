Polymer {
  is: 'google-survey'
  properties: {
    
  }
  send_data: ->
    console.log 'todo not yet implemented'
  view_data: ->
    view_data 'facebook'
    # window.open 'http://www.google.com'
    #console.log 'todo not yet implemented'
  return_home: ->
    return_home()
  ready: ->
    self = this
    searches <- getlist 'google_history'
    queries = [x.query for x in searches]
    self.$$('#displaydata').innerText = JSON.stringify(queries)
}
