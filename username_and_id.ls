window.userid = localStorage.getItem('userid')
if not window.userid?
  window.userid = 100 + Math.floor(Math.random()*1000000000)
  localStorage.setItem('userid', window.userid)
window.username = getUrlParameters().username
if not window.username? or window.username == ''
  window.username = 'guest' + window.userid
