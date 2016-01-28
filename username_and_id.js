(function(){
  window.userid = localStorage.getItem('userid');
  if (window.userid == null) {
    window.userid = 100 + Math.floor(Math.random() * 1000000000);
    localStorage.setItem('userid', window.userid);
  }
  window.username = getUrlParameters().username;
  if (window.username == null || window.username === '') {
    window.username = 'guest' + window.userid;
  }
}).call(this);
