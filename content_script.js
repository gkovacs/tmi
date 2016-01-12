(function(){
  var textToHtml, sendBackground, load_experiment_for_location;
  textToHtml = function(str){
    var tmp;
    tmp = document.createElement('span');
    tmp.innerText = str;
    return tmp.innerHTML;
  };
  chrome.runtime.onMessage.addListener(function(req, sender, sendResponse){
    var type, data, permissions_list, fields, pagename, i$, len$, x, pagehtml;
    type = req.type, data = req.data;
    if (type === 'confirm_permissions') {
      permissions_list = [];
      fields = data.fields, pagename = data.pagename;
      for (i$ = 0, len$ = fields.length; i$ < len$; ++i$) {
        x = fields[i$];
        if (x.description != null) {
          permissions_list.push(x.description);
        } else {
          permissions_list.push(x.name);
        }
      }
      pagehtml = '';
      if (pagename != null) {
        pagehtml = '<b>(' + textToHtml(pagename) + ')</b>';
      }
      swal({
        title: 'This page needs your data',
        type: 'info',
        showCancelButton: true,
        allowEscapeKey: false,
        confirmButtonText: 'Approve',
        cancelButtonText: 'Deny',
        html: true,
        text: 'This page ' + pagehtml + ' wants to access the following data <a target="_blank" href="https://tmi.netlify.com/previewdata.html?fields=' + (function(){
          var i$, ref$, len$, results$ = [];
          for (i$ = 0, len$ = (ref$ = fields).length; i$ < len$; ++i$) {
            x = ref$[i$];
            results$.push(x.name);
          }
          return results$;
        }()).join(',') + '">(details)</a>:<br><br>' + permissions_list.join('<br>')
      }, function(accepted){
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
    return chrome.runtime.sendMessage({
      type: type,
      data: data
    }, function(response){
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
