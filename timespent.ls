/*
startPage = ->
  params = getUrlParameters()
  tagname = params.tag
  {survey} = params
  if not tagname?
    if survey?
      tagname = survey + '-survey'
    else
      tagname = 'intro-page'
      #tagname = 'experiment-view'
  tag = $("<#{tagname}>")
  for k,v of params
    if k == 'tag'
      continue
    v = jsyaml.safeLoad(v)
    tag.prop k, v
  tag.appendTo '#contents'

$(document).ready ->
  console.log window.location
  startPage()
  return
*/

display_time_on_domains = (domain_to_timespent) ->
  timespent_and_domain = []
  for domain,timespent of domain_to_timespent
    timespent_and_domain.push [timespent, domain]
  timespent_and_domain = prelude.sortBy (.[0]), timespent_and_domain
  timespent_and_domain.reverse()
  output = []
  for [timespent,domain] in timespent_and_domain
    output.push "<div>#{domain} #{timespent / 1000.0 / 3600.0}</div>"
  document.querySelector('#time_on_domains').innerHTML = output.join('\n')


document.addEventListener 'DOMContentLoaded', ->
  document.querySelector('#autofill').addEventListener 'have-data', (results) ->
    console.log 'have-data callback'
    console.log results.detail
    display_time_on_domains(results.detail.chrome_history_timespent_domain)
    document.querySelector('#displayresults').innerText = JSON.stringify(results.detail, null, 2)
