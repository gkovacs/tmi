export getUrlParameters = ->
  url = window.location.href
  hash = url.lastIndexOf('#')
  if hash != -1
    url = url.slice(0, hash)
  map = {}
  parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m,key,value) ->
    #map[key] = decodeURI(value).split('+').join(' ').split('%2C').join(',') # for whatever reason this seems necessary?
    map[key] = decodeURIComponent(value).split('+').join(' ') # for whatever reason this seems necessary?
  )
  return map

export once_available = (selector, callback) ->
  current_result = document.querySelectorAll(selector)
  if current_result.length > 0
    callback current_result
  else
    setTimeout ->
      once_available selector, callback
    , 1000

# Randomizes the order of elements in the passed in array in place.
export shuffle_array = (arr) ->
  i = arr.length
  if i == 0
    return false
  while --i
    j = Math.floor(Math.random() * (i+1))
    tempi = arr[i]
    tempj = arr[j]
    arr[i] = tempj
    arr[j] = tempi
  return arr
