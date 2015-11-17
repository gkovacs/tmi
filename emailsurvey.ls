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

document.addEventListener 'DOMContentLoaded', ->
  document.querySelector('#autofill').addEventListener 'have-data', (results) ->
    console.log 'have-data callback'
    console.log results.detail
    data = results.detail
    for k,v of data
      $('#' + k + '_display').text(v)
    $('#diagnosis_display').text 'You are in desperate need of email-withdrawal therapy. Act before it is too late! Join your local chapter of Gmail Addicts Anonymous.'
    #document.querySelector('#displayresults').innerText = JSON.stringify(results.detail, null, 2)
