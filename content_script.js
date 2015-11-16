(function(){
  var sendBackground, load_experiment_for_location;
  chrome.runtime.onMessage.addListener(function(req, sender, sendResponse){
    var type, data, accepted;
    type = req.type, data = req.data;
    if (type === 'confirm_permissions') {
      accepted = confirm('Would you like to grant the following permissions:\n\n' + data.join('\n'));
      if (sendResponse != null) {
        return sendResponse(accepted);
      }
    }
  });
  sendBackground = function(type, data, callback){
    console.log('sendBackground sent: ');
    console.log(type);
    console.log(data);
    return chrome.runtime.sendMessage({
      type: type,
      data: data
    }, function(response){
      console.log('got response!');
      if (callback != null) {
        return callback(response);
      }
    });
  };
  load_experiment_for_location = function(location){
    return sendBackground('load_experiment_for_location', {
      location: location
    });
  };
  load_experiment_for_location(window.location.href);
}).call(this);
