(function(){
  var ref$;
  window.username = (ref$ = getUrlParameters().username) != null ? ref$ : 'guest';
  window.userid = localStorage.getItem('userid');
  if (window.userid == null) {
    window.userid = 100 + Math.floor(Math.random() * 1000000000);
    localStorage.setItem('userid', window.userid);
  }
}).call(this);
