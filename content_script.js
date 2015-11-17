(function(){
  var sendBackground, load_experiment_for_location;
  chrome.runtime.onMessage.addListener(function(req, sender, sendResponse){
    var type, data, permissions_list, i$, len$, x;
    type = req.type, data = req.data;
    if (type === 'confirm_permissions') {
      permissions_list = [];
      for (i$ = 0, len$ = data.length; i$ < len$; ++i$) {
        x = data[i$];
        if (x.description != null) {
          permissions_list.push(x.description);
        } else {
          permissions_list.push(x.name);
        }
      }
      swal({
        title: 'Data Access Request',
        type: 'info',
        showCancelButton: true,
        allowEscapeKey: false,
        confirmButtonText: 'Approve',
        cancelButtonText: 'Deny',
        html: true,
        text: 'This page would like access to the following data <a target="_blank" href="http://localhost:8080/previewdata.html?fields=' + (function(){
          var i$, ref$, len$, results$ = [];
          for (i$ = 0, len$ = (ref$ = data).length; i$ < len$; ++i$) {
            x = ref$[i$];
            results$.push(x.name);
          }
          return results$;
        }()).join(',') + '">(preview)</a>:<br><br>' + permissions_list.join('<br>')
      }, function(accepted){
        console.log('result was: ');
        console.log(accepted);
        return sendResponse(accepted);
      });
    }
    return true;
  });
  (function(){
    var ndiv;
    ndiv = document.createElement('div');
    ndiv.id = 'autosurvey_content_script_loaded';
    return document.body.appendChild(ndiv);
  })();
  console.log('content_script loaded');
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
