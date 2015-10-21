#birthdate_icon = document.querySelectorAll('.img.sp_R5jvPQ7MPiF.sx_b7b338')

console.log 'running browsing_time_by_site'

mousemoved = ->
  console.log 'mouse moved'

throttled_mousemoved = _.throttle mousemoved, 5000

window.addEventListener 'mousemove', ->
  throttled_mousemoved()

/*
main = ->
  #console.log 'running main in browsing_history'
  setInterval ->
    item = {host: window.location.host, url: window.location.href, timestamp: Date.now(), time: new Date().toString()}


  , 5000
  addtolist 'browsing_time_by_site', item
*/

#main()
