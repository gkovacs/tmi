(function(){
  var getUrlParameters, once_available, out$ = typeof exports != 'undefined' && exports || this;
  out$.getUrlParameters = getUrlParameters = function(){
    var url, hash, map, parts;
    url = window.location.href;
    hash = url.lastIndexOf('#');
    if (hash !== -1) {
      url = url.slice(0, hash);
    }
    map = {};
    parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value){
      return map[key] = decodeURIComponent(value).split('+').join(' ');
    });
    return map;
  };
  out$.once_available = once_available = function(selector, callback){
    var current_result;
    current_result = document.querySelectorAll(selector);
    if (current_result.length > 0) {
      return callback(current_result);
    } else {
      return setTimeout(function(){
        return once_available(selector, callback);
      }, 1000);
    }
  };
}).call(this);
