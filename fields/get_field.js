// Generated by LiveScript 1.4.0
/*
list_fields = [
  'google_history'
  'bing_history'

]

single_fields = [
  'facebook_name'
  'facebook_link'
  'facebook_birthdate'
  'facebook_education'
  'facebook_hometown'
  'facebook_location'
]

custom_fields = {
  'google_queries': (callback) ->
    google_history <- getlist 'google_history'
    callback [x.query for x in google_history]
  'bing_queries': (callback) ->
    bing_history <- getlist 'bing_history'
    callback [x.query for x in bing_history]
}

export get_custom_getter_for_field = (field, callback) ->
  getter_text <- $.get 'fields/' + field + '.js'
  callback string_to_function getter_text

export string_to_function = (str) ->
  lines = str.split('\n')
  if lines[0].trim() == '(function(){' and lines[lines.length - 1].trim() == '}).call(this);'
    lines = lines[1 til lines.length - 1]
  return new Function(lines.join('\n'))
*/
(function(){
  var special_aliases, resolve_aliases, get_field_to_getters, getcomp, getfield, getfields, get_field_info, out$ = typeof exports != 'undefined' && exports || this;
  special_aliases = {
    'all_vars': function(callback){
      var output;
      output = [];
      return get_field_info(function(field_info){
        var field, info;
        for (field in field_info) {
          info = field_info[field];
          if (info != null && info.type === 'var') {
            output.push(field);
          }
        }
        return callback(output);
      });
    },
    'all_lists': function(callback){
      var output;
      output = [];
      return get_field_info(function(field_info){
        var field, info;
        for (field in field_info) {
          info = field_info[field];
          if (info != null && info.type === 'list') {
            output.push(field);
          }
        }
        return callback(output);
      });
    },
    'all_data': function(callback){
      var output;
      output = [];
      return get_field_info(function(field_info){
        var field, info;
        for (field in field_info) {
          info = field_info[field];
          if (info != null && info.type != null && ['var', 'list', 'computed'].indexOf(info.type) !== -1) {
            output.push(field);
          }
        }
        return callback(output);
      });
    }
  };
  out$.resolve_aliases = resolve_aliases = function(fieldnames, callback){
    var output;
    output = [];
    return get_field_info(function(field_info){
      return async.eachSeries(fieldnames, function(field, donecb){
        var info, i$, ref$, len$, x, special_alias_getter;
        info = field_info[field];
        console.log(info);
        if (info == null) {
          output.push(field);
          return donecb();
        }
        if (info.type == null) {
          output.push(field);
          return donecb();
        }
        if (['special_alias', 'alias'].indexOf(info.type) === -1) {
          output.push(field);
          return donecb();
        }
        if (info.type === 'alias') {
          for (i$ = 0, len$ = (ref$ = info.member_fields).length; i$ < len$; ++i$) {
            x = ref$[i$];
            output.push(x);
          }
          return donecb();
        }
        special_alias_getter = special_aliases[field];
        if (special_alias_getter == null) {
          output.push(field);
          return donecb();
        }
        return special_alias_getter(function(member_fields){
          var i$, len$, x;
          for (i$ = 0, len$ = member_fields.length; i$ < len$; ++i$) {
            x = member_fields[i$];
            output.push(x);
          }
          return donecb();
        });
      }, function(){
        return callback(output);
      });
    });
  };
  out$.get_field_to_getters = get_field_to_getters = memoizeSingleAsync(function(callback){
    return get_field_info(function(field_info){
      var output;
      output = {};
      return async.forEachOf(field_info, function(info, field, donecb){
        var type;
        type = info.type;
        if (type === 'var') {
          output[field] = function(ncallback){
            return getvar(field, ncallback);
          };
          return donecb();
        }
        if (type === 'list') {
          output[field] = function(ncallback){
            return getlist(field, ncallback);
          };
          return donecb();
        }
        if (type === 'computed') {
          output[field] = computed_fields[field];
          return donecb();
        }
        if (type === 'special_alias') {
          return donecb();
        }
        console.log("field " + field + " has unknown type " + type);
        return donecb();
      }, function(){
        return callback(output);
      });
    });
  });
  out$.getcomp = getcomp = function(fieldname, callback){
    return computed_fields[fieldname](callback);
  };
  out$.getfield = getfield = function(fieldname, callback){
    return get_field_to_getters(function(field_getters){
      var field_getter;
      field_getter = field_getters[fieldname];
      if (field_getter == null) {
        console.log('unknown field name: ' + fieldname);
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
    return resolve_aliases(fieldname_list, function(real_fieldname_list){
      return async.eachSeries(real_fieldname_list, function(name, ncallback){
        return getfield(name, function(val){
          output[name] = val;
          return ncallback();
        });
      }, function(){
        if (callback != null) {
          return callback(output);
        }
      });
    });
  };
  out$.get_field_info = get_field_info = memoizeSingleAsync(function(callback){
    return $.get('fields/field_info.yaml', function(field_info_text){
      var field_info;
      field_info = jsyaml.safeLoad(field_info_text);
      return callback(field_info);
    });
  });
}).call(this);
