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
    document.querySelector('#displayresults').innerText = JSON.stringify(results.detail, null, 2)
