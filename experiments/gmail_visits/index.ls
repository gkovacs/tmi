console.log 'running gmail_visits'

main = ->
  console.log 'running main in gmail_visits'
  if window.location.host != 'mail.google.com'
    console.log 'not on mail.google.com'
    console.log window.location.host
    return
  item = {timestamp: Date.now(), time: new Date().toString()}
  console.log 'added item for gmail_visits'
  console.log item
  addtolist 'gmail_visits', item

main()

#onpageupdate main
#onhashchanged main

