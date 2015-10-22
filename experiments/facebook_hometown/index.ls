main2 = ->
  console.log 'running main in facebook_hometown'
  #infoboxes = document.querySelectorAll('._1zw6._md0._5vb9')
  infoboxes <- once_available '._1zw6._md0._5vb9'
  console.log 'found infoboxes:' # need to keep repeating until non-empty
  console.log infoboxes
  for infobox in infoboxes
    datastore_text = infobox.getAttribute('data-store')
    if not datastore_text?
      continue
    datastore = JSON.parse datastore_text
    if datastore['context_item_type_as_string'] == 'hometown'
      facebook_hometown = infobox.innerText
      console.log "setting facebook_hometown #{facebook_hometown}"
      setvar 'facebook_hometown', facebook_hometown
      return

main1 = ->
  console.log 'running facebook_hometown'
  console.log "window.location.href is #{window.location.href}"
  getvar 'facebook_link', (facebook_link) ->
    console.log "facebook_link is #{facebook_link}"
    if facebook_link? and facebook_link.length > 0
      if window.location.href.indexOf(facebook_link) > -1
        main2()

main1()
onpageupdate main1
