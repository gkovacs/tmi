(function(){
  var getUrlParameters, once_available, shuffle_array, out$ = typeof exports != 'undefined' && exports || this;
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
  out$.shuffle_array = shuffle_array = function(arr){
    var i, j, tempi, tempj;
    i = arr.length;
    if (i === 0) {
      return false;
    }
    while (--i) {
      j = Math.floor(Math.random() * (i + 1));
      tempi = arr[i];
      tempj = arr[j];
      arr[i] = tempj;
      arr[j] = tempi;
    }
    return arr;
  };
}).call(this);
