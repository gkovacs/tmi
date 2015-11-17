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
  {fields} = getUrlParameters()
  document.querySelector('#datapreview').setAttribute 'fields', fields
