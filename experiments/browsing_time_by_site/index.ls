#birthdate_icon = document.querySelectorAll('.img.sp_R5jvPQ7MPiF.sx_b7b338')

console.log 'running browsing_time_by_site'

pageactive = ->
  #console.log 'mouse moved'
  item = {host: window.location.host, url: window.location.href, timestamp: Date.now(), time: new Date().toString(), interval: 5}
  console.log item
  addtolist 'browsing_time_by_site', item

throttled_pageactive = _.throttle pageactive, 5000, {trailing: false}

throttled_pageactive()

window.addEventListener 'mousedown', ->
  throttled_pageactive()

window.addEventListener 'mousemove', ->
  throttled_pageactive()

window.addEventListener 'scroll', ->
  throttled_pageactive()

window.addEventListener 'mousewheel', ->
  throttled_pageactive()

window.addEventListener 'keydown', ->
  throttled_pageactive()

window.addEventListener 'touchstart', ->
  throttled_pageactive()

/*
main = ->
  #console.log 'running main in browsing_history'
  setInterval ->
    item = {host: window.location.host, url: window.location.href, timestamp: Date.now(), time: new Date().toString()}


  , 5000
  addtolist 'browsing_time_by_site', item
*/

#main()
