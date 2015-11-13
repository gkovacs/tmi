(function(){
  var main;
  console.log('running browsing_history');
  main = function(){
    var item;
    console.log('running main in browsing_history');
    item = {
      host: window.location.host,
      url: window.location.href,
      timestamp: Date.now(),
      time: new Date().toString()
    };
    console.log(item);
    return addtolist('browsing_history', item);
  };
  main();
  onpageupdate(main);
}).call(this);
