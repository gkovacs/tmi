(function(){
  var sendExtension, sendExtension2, out$ = typeof exports != 'undefined' && exports || this;
  out$.sendExtension = sendExtension = function(type, data, callback){
    return chrome.runtime.sendMessage(autosurvey_extension_id, {
      type: type,
      data: data
    }, function(response){
      if (callback != null) {
        return callback(response);
      }
    });
  };
  out$.sendExtension2 = sendExtension2 = function(type, data, callback){
    return chrome.runtime.sendMessage(autosurvey_extension_id2, {
      type: type,
      data: data
    }, function(response){
      if (callback != null) {
        return callback(response);
      }
    });
  };
}).call(this);
