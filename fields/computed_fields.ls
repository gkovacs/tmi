export computed_fields =
  
  google_queries: (callback) ->
    google_history <- getlist 'google_history'
    callback [x.query for x in google_history]

  bing_queries: (callback) ->
    bing_history <- getlist 'bing_history'
    callback [x.query for x in bing_history]

  num_gmail_visits: (callback) ->
    gmail_visits <- getlist 'gmail_visits'
    callback gmail_visits.length

  num_gmail_visits_in_past_24_hours: (callback) ->
    gmail_visits <- getlist 'gmail_visits'
    curtime = Date.now() # milliseconds
    gmail_visits_in_past_24_hours = [x for x in gmail_visits when curtime - x.timestamp < 24*3600*1000]
    callback gmail_visits_in_past_24_hours.length
  

