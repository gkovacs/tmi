/*
getLocation = (callback) ->
  sendBackground 'getLocation', {}, (location) ->
    console.log 'got location'
    console.log location

sendBackground = (type, data, callback) ->
  console.log 'sendBackground sent: '
  console.log type
  console.log data
  chrome.runtime.sendMessage {type, data}, (response) ->
    console.log 'got response!'
    callback response
*/
(function(){
  var getLocation, getTabInfo, reloadTab;
  getLocation = function(callback){
    return getTabInfo(function(tabinfo){
      return callback(tabinfo.url);
    });
  };
  getTabInfo = function(callback){
    return chrome.tabs.query({
      active: true,
      lastFocusedWindow: true
    }, function(tabs){
      if (tabs.length === 0) {
        return;
      }
      return chrome.tabs.get(tabs[0].id, callback);
    });
  };
  reloadTab = function(callback){
    return chrome.tabs.query({
      active: true,
      lastFocusedWindow: true
    }, function(tabs){
      if (tabs.length === 0) {
        return;
      }
      return chrome.tabs.reload(tabs[0].id, callback);
    });
  };
  $(document).ready(function(){
    $('#open_options_page').click(function(){
      return chrome.runtime.openOptionsPage();
    });
    return function(){
      console.log('message sent askdfjl!');
      return getLocation(function(location){
        var ref$, hostname, path;
        console.log('received location');
        console.log(location);
        ref$ = new URL("/aa/bb/", location), hostname = ref$.hostname, path = ref$.path;
        $('#sitename').text(hostname);
        return list_available_experiments_for_location(location, function(possible_experiments){
          return get_experiments(function(all_experiments){
            var i$, ref$, len$, results$ = [];
            console.log(possible_experiments);
            for (i$ = 0, len$ = (ref$ = possible_experiments).length; i$ < len$; ++i$) {
              results$.push((fn$.call(this, ref$[i$])));
            }
            return results$;
            function fn$(experiment_name){
              var experiment_info, experiment_selector, experiment_selector_button, enabled_experiments, ref$, experiment_enabled;
              experiment_info = all_experiments[experiment_name];
              experiment_selector = $('<div>').css({
                'margin-bottom': '5px'
              });
              experiment_selector.append($('<span>').text(experiment_info.title));
              experiment_selector_button = $('<paper-button raised="raised" style="background: #4285f4; color: #fff">').text('Participate');
              enabled_experiments = (ref$ = JSON.parse(localStorage.getItem('experiments'))) != null
                ? ref$
                : [];
              experiment_enabled = enabled_experiments.indexOf(experiment_name) !== -1;
              if (experiment_enabled) {
                experiment_selector_button.text('Leave Experiment');
              }
              if (!experiment_enabled) {
                experiment_selector_button.click(function(){
                  var enabled_experiments, ref$;
                  console.log('activated experiment: ' + experiment_name);
                  enabled_experiments = (ref$ = JSON.parse(localStorage.getItem('experiments'))) != null
                    ? ref$
                    : [];
                  enabled_experiments = enabled_experiments.filter(function(x){
                    return possible_experiments.indexOf(x) === -1;
                  });
                  enabled_experiments.push(experiment_name);
                  localStorage.setItem('experiments', JSON.stringify(enabled_experiments));
                  reloadTab();
                  return window.location.reload();
                });
              } else {
                experiment_selector_button.click(function(){
                  var enabled_experiments, ref$;
                  console.log('left experiment: ' + experiment_name);
                  enabled_experiments = (ref$ = JSON.parse(localStorage.getItem('experiments'))) != null
                    ? ref$
                    : [];
                  enabled_experiments = enabled_experiments.filter(function(x){
                    return possible_experiments.indexOf(x) === -1;
                  });
                  localStorage.setItem('experiments', JSON.stringify(enabled_experiments));
                  reloadTab();
                  return window.location.reload();
                });
              }
              experiment_selector_button.appendTo(experiment_selector);
              return experiment_selector.appendTo($('#experiment_list'));
            }
          });
        });
      });
    }();
  });
}).call(this);
