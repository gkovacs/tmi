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
    console.log 'num_gmail_visits_per_day: getlist'
    gmail_visits <- getlist 'gmail_visits'
    console.log 'num_gmail_visits_per_day: computation'
    curtime = Date.now() # milliseconds
    first_visit = prelude.minimum([x.timestamp for x in gmail_visits])
    num_days = (curtime - first_visit) / (24*3600*1000) |> Math.round |> prelude.max(1)
    console.log 'num_gmail_visits_per_day: computation done'
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

  chrome_history: (callback) ->
    results <- chrome.history.search {text: '', startTime: 0, maxResults: 2**31-1}
    callback results

  chrome_history_facebook: (callback) ->
    history <- getcomp 'chrome_history'
    callback [x for x in history when x.url.indexOf('facebook.com') != -1]

  chrome_history_gmail: (callback) ->
    history <- getcomp 'chrome_history'
    callback [x for x in history when x.url.indexOf('mail.google.com') != -1]

  chrome_history_allvisits_fast: (callback) ->
    results <- chrome.history.search {text: '', startTime: 1447759578870, maxResults: 2**31-1}
    console.log 'got results for chrome_history_allvisits'
    <- async.each results, (item, donecb) ->
      if item.visitCount == 1
        item.visitTime = item.lastVisitTime
        return donecb()
      visits <- chrome.history.getVisits {url: item.url}
      item.visits = visits
      return donecb()
    output = []
    for item in results
      if not item.visits?
        output.push item
        continue
      for visit in item.visits
        newitem = {}
        newitem <<< item
        newitem <<< visit
        output.push newitem
    output = prelude.sortBy (.visitTime), output
    callback output

  chrome_history_allvisits: (callback) ->
    results <- chrome.history.search {text: '', startTime: 1447759578870, maxResults: 2**31-1}
    console.log 'got results for chrome_history_allvisits'
    <- async.each results, (item, donecb) ->
      visits <- chrome.history.getVisits {url: item.url}
      item.visits = visits
      return donecb()
    console.log 'async eachSeries done'
    output = []
    for item in results
      for visit in item.visits
        newitem = {}
        newitem <<< item
        newitem <<< visit
        output.push newitem
    output = prelude.sortBy (.visitTime), output
    callback output

  chrome_history_timespent_url: (callback) ->
    results <- getcomp 'chrome_history_allvisits_fast'
    url_to_timespent = {}
    for item,idx in results
      {visitTime, url} = item
      nextitem = results[idx+1]
      visit_duration = 30*1000 # 30 seconds in milliseconds
      if nextitem?
        nextVisitTime = nextitem.visitTime
        visit_duration = Math.min(visit_duration, nextVisitTime - visitTime)
      if not url_to_timespent[url]?
        url_to_timespent[url] = visit_duration
      else
        url_to_timespent[url] += visit_duration
    callback url_to_timespent

  chrome_history_timespent_domain: (callback) ->
    results <- getcomp 'chrome_history_timespent_url'
    domain_to_timespent = {}
    domain_matcher = new RegExp(':\/\/(.[^\/]+)(.*)')
    for url,timespent of results
      domain_matches = url.match(domain_matcher)
      if not domain_matches? or domain_matches.length < 2
        continue
      domain = domain_matches[1]
      if not domain_to_timespent[domain]?
        domain_to_timespent[domain] = timespent
      else
        domain_to_timespent[domain] += timespent
    callback domain_to_timespent

  real_timespent_domain: (callback) ->
    results <- getlist 'browsing_time_by_site'
    domain_to_timespent = {}
    for item,idx in results
      {host, interval} = item
      if not domain_to_timespent[host]?
        domain_to_timespent[host] = interval * 1000
      else
        domain_to_timespent[host] += interval * 1000
    callback domain_to_timespent

  real_timespent_url: (callback) ->
    results <- getlist 'browsing_time_by_site'
    url_to_timespent = {}
    for item,idx in results
      {url, interval} = item
      if not url_to_timespent[url]?
        url_to_timespent[url] = interval * 1000
      else
        url_to_timespent[url] += interval * 1000
    callback url_to_timespent

  browsing_time_collection_starttime: (callback) ->
    results <- getlist 'browsing_time_by_site'
    earliest_time = Date.now()
    for item,idx in results
      {timestamp} = item
      earliest_time = Math.min(earliest_time, timestamp)
    callback earliest_time
