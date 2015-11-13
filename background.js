(function(){
  var execute_content_script, insert_css, load_experiment, load_experiment_for_location, getLocation, getTabInfo, sendTab, message_handlers, send_pageupdate_to_tab, onWebNav;
  console.log('weblab running in background');
  execute_content_script = function(options, callback){
    if (options.run_at == null) {
      options.run_at = 'document_start';
    }
    if (options.all_frames == null) {
      options.all_frames = false;
    }
    return chrome.tabs.query({
      active: true,
      lastFocusedWindow: true
    }, function(tabs){
      if (tabs.length === 0) {
        if (callback != null) {
          callback();
        }
        return;
      }
      return chrome.tabs.executeScript(tabs[0].id, {
        file: options.path,
        allFrames: options.all_frames,
        runAt: options.run_at
      }, function(){
        if (callback != null) {
          return callback();
        }
      });
    });
  };
  insert_css = function(css_path, callback){
    if (callback != null) {
      return callback();
    }
  };
  load_experiment = function(experiment_name, callback){
    console.log('load_experiment ' + experiment_name);
    return get_experiments(function(all_experiments){
      var experiment_info;
      experiment_info = all_experiments[experiment_name];
      return async.eachSeries(experiment_info.scripts, function(options, ncallback){
        if (typeof options === 'string') {
          options = {
            path: options
          };
        }
        if (options.path[0] === '/') {
          options.path = 'experiments' + options.path;
        } else {
          options.path = "experiments/" + experiment_name + "/" + options.path;
        }
        return execute_content_script(options, ncallback);
      }, function(){
        return async.eachSeries(experiment_info.css, function(css_name, ncallback){
          return insert_css("experiments/" + experiment_name + "/" + css_name, ncallback);
        }, function(){
          if (callback != null) {
            return callback();
          }
        });
      });
    });
  };
  load_experiment_for_location = function(location, callback){
    return list_available_experiments_for_location(location, function(possible_experiments){
      return async.eachSeries(possible_experiments, function(experiment, ncallback){
        return load_experiment(experiment, ncallback);
      }, function(errors, results){
        if (callback != null) {
          return callback();
        }
      });
    });
  };
  getLocation = function(callback){
    console.log('calling getTabInfo');
    return getTabInfo(function(tabinfo){
      console.log('getTabInfo results');
      console.log(tabinfo);
      console.log(tabinfo.url);
      return callback(tabinfo.url);
    });
  };
  getTabInfo = function(callback){
    return chrome.tabs.query({
      active: true,
      lastFocusedWindow: true
    }, function(tabs){
      console.log('getTabInfo results');
      console.log(tabs);
      if (tabs.length === 0) {
        return;
      }
      return chrome.tabs.get(tabs[0].id, callback);
    });
  };
  sendTab = function(type, data, callback){
    return chrome.tabs.query({
      active: true,
      lastFocusedWindow: true
    }, function(tabs){
      console.log('sendTab results');
      console.log(tabs);
      if (tabs.length === 0) {
        return;
      }
      return chrome.tabs.sendMessage(tabs[0].id, {
        type: type,
        data: data
      }, {}, callback);
    });
  };
  message_handlers = {
    'setvars': function(data, callback){
      return async.forEachOfSeries(data, function(v, k, ncallback){
        return setvar(k, v, function(){
          return ncallback();
        });
      }, function(){
        if (callback != null) {
          return callback();
        }
      });
    },
    'getvar': function(name, callback){
      return getvar(name, callback);
    },
    'getvars': function(namelist, callback){
      var output;
      output = {};
      return async.eachSeries(namelist, function(name, ncallback){
        return getvar(name, function(val){
          output[name] = val;
          return ncallback();
        });
      }, function(){
        if (callback != null) {
          return callback(output);
        }
      });
    },
    'addtolist': function(data, callback){
      var list, item;
      list = data.list, item = data.item;
      return addtolist(list, item, callback);
    },
    'getlist': function(name, callback){
      return getlist(name, callback);
    },
    'getLocation': function(data, callback){
      return getLocation(function(location){
        console.log('getLocation background page:');
        console.log(location);
        return callback(location);
      });
    },
    'load_experiment': function(data, callback){
      var experiment_name;
      experiment_name = data.experiment_name;
      return load_experiment(experiment_name, function(){
        if (callback != null) {
          return callback();
        }
      });
    },
    'load_experiment_for_location': function(data, callback){
      var location;
      location = data.location;
      return load_experiment_for_location(location, function(){
        if (callback != null) {
          return callback();
        }
      });
    }
  };
  send_pageupdate_to_tab = function(tabId){
    return chrome.tabs.sendMessage(tabId, {
      event: 'pageupdate'
    });
  };
  onWebNav = function(tab){
    var tabId;
    if (tab.frameId === 0) {
      tabId = tab.tabId;
      return list_available_experiments_for_location(tab.url, function(possible_experiments){
        if (possible_experiments.length > 0) {
          chrome.pageAction.show(tabId);
        }
        console.log('pageupdate sent to tab');
        return send_pageupdate_to_tab(tabId);
      });
    }
  };
  chrome.webNavigation.onCommitted.addListener(onWebNav);
  chrome.webNavigation.onHistoryStateUpdated.addListener(onWebNav);
  /*
  chrome.tabs.onUpdated.addListener (tabId, changeInfo, tab) ->
    if tab.url
      #console.log 'tabs updated!'
      #console.log tab.url
      possible_experiments <- list_available_experiments_for_location(tab.url)
      if possible_experiments.length > 0
        chrome.pageAction.show(tabId)
      send_pageupdate_to_tab(tabId)
      # load_experiment_for_location tab.url
  */
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    var type, data, message_handler, tabId;
    type = request.type, data = request.data;
    console.log(type);
    console.log(data);
    message_handler = message_handlers[type];
    if (message_handler == null) {
      return;
    }
    tabId = sender.tab.id;
    return message_handler(data, function(response){
      var requestId;
      console.log('message handler response:');
      console.log(response);
      requestId = request.requestId;
      if (requestId != null) {
        return chrome.tabs.sendMessage(tabId, {
          event: 'backgroundresponse',
          requestId: requestId,
          response: response
        });
      }
    });
  });
}).call(this);
