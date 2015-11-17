/*
self_link = document.querySelectorAll('._2dpe._1ayn')
if self_link.length == 1
  facebook_link = self_link[0].href
  console.log "set facebook_link to #{facebook_link}"
  setvar 'facebook_link', facebook_link
*/


#birthdate_icon = document.querySelectorAll('.img.sp_R5jvPQ7MPiF.sx_b7b338')

console.log 'running google_search'

#chrome.runtime.onMessage.addListener (req, sender, callback) ->
#  if req.event == 'pageupdate'
#    main()

main = ->
  console.log 'running main in google_search'
  if window.location.host != 'www.google.com'
    console.log 'not on www.google.com'
    console.log 'host location is:'
    console.log window.location.host
    return
  hash = window.location.hash
  if hash.indexOf('#q=') != -1
    raw_query = hash.substring(3)
    query = QueryString.decode(raw_query)
    item = {query: query, timestamp: Date.now(), time: new Date().toString()}
    console.log item
    addtolist 'google_history', item
  #item = {host: window.location.host, url: window.location.href, timestamp: Date.now(), time: new Date().toString()}
  #console.log item
  #addtolist 'browsing_history', item

main()
/*
window.addEventListener 'hashchange', (evt) ->
  console.log 'hash changed'
  console.log window.location.hash
window.addEventListener 'onhashchange', (evt) ->
  console.log 'hash changed'
  console.log window.location.hash
window.onhashchange = ->
  console.log 'hash changed'
  console.log window.location.hash
setInterval ->
  console.log 'interval is working for google_search'
, 5000
*/
# onpageupdate main
onhashchanged main


