main2 = ->
  fieldname = 'facebook_location'
  infobox_text <- get_infobox_text [
    infobox_item_type_matches('current_city')
    infobox_contains_child('.sx_e7092e')
  ]
  if not infobox_text?
    console.log "no matching infoboxes found for #{fieldname}"
    return
  setvar fieldname, infobox_text

main1 = ->
  call_if_on_facebook_profile main2

main1()
onpageupdate main1
