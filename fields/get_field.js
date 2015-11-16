(function(){
  var list_fields, single_fields, custom_fields, get_field_to_getters, getfield, getfields, out$ = typeof exports != 'undefined' && exports || this;
  list_fields = ['google_history', 'bing_history'];
  single_fields = ['facebook_name', 'facebook_link', 'facebook_birthdate', 'facebook_education', 'facebook_hometown', 'facebook_location'];
  custom_fields = {};
  out$.get_field_to_getters = get_field_to_getters = function(callback){
    var output, i$, ref$, len$, k, v;
    output = {};
    for (i$ = 0, len$ = (ref$ = single_fields).length; i$ < len$; ++i$) {
      (fn$.call(this, ref$[i$]));
    }
    for (i$ = 0, len$ = (ref$ = list_fields).length; i$ < len$; ++i$) {
      (fn1$.call(this, ref$[i$]));
    }
    for (k in ref$ = custom_fields) {
      v = ref$[k];
      output[k] = v;
    }
    return callback(output);
    function fn$(field){
      output[field] = function(ncallback){
        return getvar(field, ncallback);
      };
    }
    function fn1$(field){
      output[field] = function(ncallback){
        return getlist(field, ncallback);
      };
    }
  };
  out$.getfield = getfield = function(fieldname, callback){
    return get_field_to_getters(function(field_getters){
      var field_getter;
      field_getter = field_getters[fieldname];
      if (field_getter == null) {
        callback();
        return;
      }
      return field_getter(function(val){
        return callback(val);
      });
    });
  };
  out$.getfields = getfields = function(fieldname_list, callback){
    var output;
    output = {};
    return async.eachSeries(fieldname_list, function(name, ncallback){
      return getfield(name, function(val){
        output[name] = val;
        return ncallback();
      });
    }, function(){
      if (callback != null) {
        return callback(output);
      }
    });
  };
}).call(this);
