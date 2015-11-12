#birthdate_icon = document.querySelectorAll('.img.sp_R5jvPQ7MPiF.sx_b7b338')

console.log 'running browsing_history'

#chrome.runtime.onMessage.addListener (req, sender, callback) ->
#  if req.event == 'pageupdate'
#    main()

main = ->
  console.log 'running main in browsing_history'
  item = {host: window.location.host, url: window.location.href, timestamp: Date.now(), time: new Date().toString()}
  console.log item
  addtolist 'browsing_history', item

main()
onpageupdate main
