export infobox_item_type_matches = (item_type, infobox) -->
  datastore_text = infobox.getAttribute('data-store')
  if not datastore_text?
    return false
  datastore = JSON.parse datastore_text
  return datastore['context_item_type_as_string'] == item_type

export infobox_contains_child = (selector, infobox) -->
  return infobox.querySelector(selector) != null

export get_infoboxes = (callback) ->
  once_available '._1zw6._md0._5vb9', callback

export get_infobox_text = (list_of_filters, callback) ->
  infoboxes <- get_infoboxes()
  console.log 'infoboxes are'
  console.log infoboxes
  matching_infoboxes = []
  for filter_func in list_of_filters
    if matching_infoboxes.length == 1
      break
    matching_infoboxes = filter_list filter_func, infoboxes
  if matching_infoboxes.length == 0
    callback()
    return
  callback matching_infoboxes[0].innerText

export call_if_on_facebook_profile = (callback) ->
  facebook_link <- getvar 'facebook_link'
  if facebook_link? and facebook_link.length > 0
    if window.location.href.indexOf(facebook_link) > -1
      callback()