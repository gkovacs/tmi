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
  
  time_spent_composing_emails_gmail_in_past_24_hours: (callback) ->
    browsing_time_by_site <- getlist 'browsing_time_by_site'
    time_on_gmail = [x for x in browsing_time_by_site when x.host == 'mail.google.com']
    time_composing_emails = [x for x in time_on_gmail when x.url.endsWith('?compose=new')]
    curtime = Date.now() # milliseconds
    time_composing_emails_in_past_24_hours = [x for x in time_composing_emails when curtime - x.timestamp < 24*3600*1000]
    callback prelude.sum([x.interval for x in time_composing_emails_in_past_24_hours])

  time_spent_composing_emails_gmail: (callback) ->
    browsing_time_by_site <- getlist 'browsing_time_by_site'
    time_on_gmail = [x for x in browsing_time_by_site when x.host == 'mail.google.com']
    time_composing_emails = [x for x in time_on_gmail when x.url.endsWith('?compose=new')]
    callback prelude.sum([x.interval for x in time_composing_emails])

  num_gmail_visits_per_day: (callback) ->
    gmail_visits <- getlist 'gmail_visits'
    curtime = Date.now() # milliseconds
    first_visit = prelude.minimum([x.timestamp for x in gmail_visits])
    num_days = (curtime - first_visit) / (24*3600*1000) |> Math.round |> prelude.max(1)
    callback gmail_visits.length / num_days

  time_spent_composing_email_per_day_gmail: (callback) ->
    browsing_time_by_site <- getlist 'browsing_time_by_site'
    time_on_gmail = [x for x in browsing_time_by_site when x.host == 'mail.google.com']
    time_composing_emails = [x for x in time_on_gmail when x.url.endsWith('?compose=new')]
    curtime = Date.now() # milliseconds
    first_visit = prelude.minimum([x.timestamp for x in time_composing_emails])
    num_days = (curtime - first_visit) / (24*3600*1000) |> Math.round |> prelude.max(1)
    callback prelude.sum([x.interval for x in time_composing_emails]) / num_days

  time_spent_on_gmail_in_past_24_hours: (callback) ->
    browsing_time_by_site <- getlist 'browsing_time_by_site'
    time_on_gmail = [x for x in browsing_time_by_site when x.host == 'mail.google.com']
    curtime = Date.now() # milliseconds
    time_on_gmail_in_past_24_hours = [x for x in time_on_gmail when curtime - x.timestamp < 24*3600*1000]
    callback prelude.sum([x.interval for x in time_on_gmail_in_past_24_hours])

  time_spent_on_gmail: (callback) ->
    browsing_time_by_site <- getlist 'browsing_time_by_site'
    time_on_gmail = [x for x in browsing_time_by_site when x.host == 'mail.google.com']
    callback prelude.sum([x.interval for x in time_on_gmail])

  time_spent_on_gmail_per_day: (callback) ->
    browsing_time_by_site <- getlist 'browsing_time_by_site'
    time_on_gmail = [x for x in browsing_time_by_site when x.host == 'mail.google.com']
    curtime = Date.now() # milliseconds
    first_visit = prelude.minimum([x.timestamp for x in time_on_gmail])
    num_days = (curtime - first_visit) / (24*3600*1000) |> Math.round |> prelude.max(1)
    callback prelude.sum([x.interval for x in time_on_gmail]) / num_days



