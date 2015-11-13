(function(){
  var mousemoved, throttled_mousemoved;
  console.log('running browsing_time_by_site');
  mousemoved = function(){
    var item;
    item = {
      host: window.location.host,
      url: window.location.href,
      timestamp: Date.now(),
      time: new Date().toString(),
      interval: 5
    };
    console.log(item);
    return addtolist('browsing_time_by_site', item);
  };
  throttled_mousemoved = _.throttle(mousemoved, 5000, {
    trailing: false
  });
  throttled_mousemoved();
  window.addEventListener('mousemove', function(){
    return throttled_mousemoved();
  });
  /*
  main = ->
    #console.log 'running main in browsing_history'
    setInterval ->
      item = {host: window.location.host, url: window.location.href, timestamp: Date.now(), time: new Date().toString()}
  
  
    , 5000
    addtolist 'browsing_time_by_site', item
  */
}).call(this);
