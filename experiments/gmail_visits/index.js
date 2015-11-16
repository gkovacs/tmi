(function(){
  var main;
  console.log('running gmail_visits');
  main = function(){
    var item;
    console.log('running main in gmail_visits');
    if (window.location.host !== 'mail.google.com') {
      console.log('not on mail.google.com');
      console.log(window.location.host);
      return;
    }
    item = {
      timestamp: Date.now(),
      time: new Date().toString()
    };
    return addtolist('gmail_visits', item);
  };
  main();
}).call(this);
