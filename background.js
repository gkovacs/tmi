(function(){
  var execute_content_script, insert_css, load_experiment, load_experiment_for_location, getLocation, getTabInfo, sendTab, message_handlers, ext_message_handlers, confirm_permissions, send_pageupdate_to_tab, onWebNav;
  execute_content_script = function(tabid, options, callback){
    if (options.run_at == null) {
      options.run_at = 'document_end';
    }
    if (options.all_frames == null) {
      options.all_frames = false;
    }
    if (tabid == null) {
      if (callback != null) {
        callback();
      }
      return;
    }
    return chrome.tabs.executeScript(tabid, {
      file: options.path,
      allFrames: options.all_frames,
      runAt: options.run_at
    }, function(){
      if (callback != null) {
        return callback();
      }
    });
  };
  insert_css = function(css_path, callback){
    if (callback != null) {
      return callback();
    }
  };
  load_experiment = function(experiment_name, callback){
    console.log('start load_experiment ' + experiment_name);
    return get_experiments(function(all_experiments){
      var experiment_info;
      experiment_info = all_experiments[experiment_name];
      return chrome.tabs.query({
        active: true,
        lastFocusedWindow: true
      }, function(tabs){
        var tabid;
        tabid = tabs[0].id;
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
          return execute_content_script(tabid, options, ncallback);
        }, function(){
          console.log('done load_experiment ' + experiment_name);
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
        return callback();
      });
    },
    'getfield': function(name, callback){
      return getfield(name, callback);
    },
    'getfields': function(namelist, callback){
      return getfields(namelist, callback);
    },
    'requestfields': function(info, callback){
      var fieldnames;
      fieldnames = info.fieldnames;
      return getfields(fieldnames, callback);
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
        return callback(output);
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
        return callback();
      });
    },
    'load_experiment_for_location': function(data, callback){
      var location;
      location = data.location;
      return load_experiment_for_location(location, function(){
        return callback();
      });
    }
  };
  ext_message_handlers = {
    'requestfields': function(info, callback){
      return confirm_permissions(info, function(accepted){
        if (!accepted) {
          return;
        }
        return getfields(info.fieldnames, function(results){
          console.log('getfields result:');
          console.log(results);
          return callback(results);
        });
      });
    },
    'get_field_descriptions': function(namelist, callback){
      return get_field_info(function(field_info){
        var output, i$, ref$, len$, x;
        output = {};
        for (i$ = 0, len$ = (ref$ = namelist).length; i$ < len$; ++i$) {
          x = ref$[i$];
          if (field_info[x] != null && field_info[x].description != null) {
            output[x] = field_info[x].description;
          }
        }
        return callback(output);
      });
    }
  };
  confirm_permissions = function(info, callback){
    var pagename, fieldnames;
    pagename = info.pagename, fieldnames = info.fieldnames;
    return get_field_info(function(field_info){
      var field_info_list, i$, ref$, len$, x, output;
      field_info_list = [];
      for (i$ = 0, len$ = (ref$ = fieldnames).length; i$ < len$; ++i$) {
        x = ref$[i$];
        output = {
          name: x
        };
        if (field_info[x] != null && field_info[x].description != null) {
          output.description = field_info[x].description;
        }
        field_info_list.push(output);
      }
      return sendTab('confirm_permissions', {
        pagename: pagename,
        fields: field_info_list
      }, callback);
    });
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
  chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse){
    var type, data, message_handler, whitelist, i$, len$, whitelisted_url, this$ = this;
    console.log('onMessageExternal');
    console.log(request);
    console.log('sender for onMessageExternal is:');
    console.log(sender);
    type = request.type, data = request.data;
    message_handler = ext_message_handlers[type];
    if (type === 'requestfields') {
      whitelist = ['http://localhost:8080/previewdata.html'];
      for (i$ = 0, len$ = whitelist.length; i$ < len$; ++i$) {
        whitelisted_url = whitelist[i$];
        if (sender.url.indexOf(whitelisted_url) === 0) {
          message_handler = message_handlers.requestfields;
          break;
        }
      }
    }
    if (message_handler == null) {
      return;
    }
    message_handler(data, function(response){
      if (sendResponse != null) {
        return sendResponse(response);
      }
    });
    return true;
  });
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    var type, data, message_handler;
    type = request.type, data = request.data;
    console.log(type);
    console.log(data);
    message_handler = message_handlers[type];
    if (message_handler == null) {
      return;
    }
    message_handler(data, function(response){
      console.log('message handler response:');
      console.log(response);
      if (sendResponse != null) {
        return sendResponse(response);
      }
    });
    return true;
  });
}).call(this);
