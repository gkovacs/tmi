// Generated by LiveScript 1.4.0
(function(){
  var get_experiments, list_available_experiments_for_location, out$ = typeof exports != 'undefined' && exports || this;
  out$.get_experiments = get_experiments = memoizeSingleAsync(function(callback){
    return $.get('/experiments/experiments_list.yaml', function(experiments_list_text){
      var experiments_list, output;
      console.log(experiments_list_text);
      experiments_list = jsyaml.safeLoad(experiments_list_text);
      console.log(experiments_list);
      output = {};
      return async.mapSeries(experiments_list, function(experiment_name, ncallback){
        return $.get("/experiments/" + experiment_name + "/experiment.yaml", function(experiment_info_text){
          var experiment_info, res$, i$, ref$, len$, x;
          experiment_info = jsyaml.safeLoad(experiment_info_text);
          if (experiment_info.nomatches == null) {
            experiment_info.nomatches = [];
          }
          if (experiment_info.matches == null) {
            experiment_info.matches = [];
          }
          if (experiment_info.scripts == null) {
            experiment_info.scripts = [];
          }
          if (experiment_info.css == null) {
            experiment_info.css = [];
          }
          res$ = [];
          for (i$ = 0, len$ = (ref$ = experiment_info.matches).length; i$ < len$; ++i$) {
            x = ref$[i$];
            res$.push(new RegExp(x));
          }
          experiment_info.match_regexes = res$;
          res$ = [];
          for (i$ = 0, len$ = (ref$ = experiment_info.nomatches).length; i$ < len$; ++i$) {
            x = ref$[i$];
            res$.push(new RegExp(x));
          }
          experiment_info.nomatch_regexes = res$;
          output[experiment_name] = experiment_info;
          return ncallback(null, null);
        });
      }, function(errors, results){
        return callback(output);
      });
    });
  });
  out$.list_available_experiments_for_location = list_available_experiments_for_location = function(location, callback){
    return get_experiments(function(all_experiments){
      var possible_experiments, experiment_name, experiment_info, blacklisted, i$, ref$, len$, regex, matches;
      possible_experiments = [];
      for (experiment_name in all_experiments) {
        experiment_info = all_experiments[experiment_name];
        blacklisted = false;
        for (i$ = 0, len$ = (ref$ = experiment_info.nomatch_regexes).length; i$ < len$; ++i$) {
          regex = ref$[i$];
          if (regex.test(location)) {
            blacklisted = true;
            break;
          }
        }
        if (blacklisted) {
          continue;
        }
        matches = false;
        for (i$ = 0, len$ = (ref$ = experiment_info.match_regexes).length; i$ < len$; ++i$) {
          regex = ref$[i$];
          if (regex.test(location)) {
            matches = true;
            break;
          }
        }
        if (matches) {
          possible_experiments.push(experiment_name);
        }
      }
      return callback(possible_experiments);
    });
  };
}).call(this);