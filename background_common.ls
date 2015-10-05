export get_experiments = memoizeSingleAsync (callback) ->
  $.get '/experiments/experiments_list.yaml', (experiments_list_text) ->
    console.log experiments_list_text
    experiments_list = jsyaml.safeLoad experiments_list_text
    console.log experiments_list
    output = {}
    errors,results <- async.mapSeries experiments_list, (experiment_name, ncallback) ->
      experiment_info_text <- $.get "/experiments/#{experiment_name}/experiment.yaml"
      experiment_info = jsyaml.safeLoad experiment_info_text
      if not experiment_info.nomatches?
        experiment_info.nomatches = []
      if not experiment_info.matches?
        experiment_info.matches = []
      if not experiment_info.scripts?
        experiment_info.scripts = []
      if not experiment_info.css?
        experiment_info.css = []
      experiment_info.match_regexes = [new RegExp(x) for x in experiment_info.matches]
      experiment_info.nomatch_regexes = [new RegExp(x) for x in experiment_info.nomatches]
      output[experiment_name] = experiment_info
      ncallback null, null
    callback output

export list_available_experiments_for_location = (location, callback) ->
  all_experiments <- get_experiments()
  possible_experiments = []
  for experiment_name,experiment_info of all_experiments
    blacklisted = false
    for regex in experiment_info.nomatch_regexes
      if regex.test(location)
        blacklisted = true
        break
    if blacklisted
      continue
    matches = false
    for regex in experiment_info.match_regexes
      if regex.test(location)
        matches = true
        break
    if matches
      possible_experiments.push experiment_name
  callback possible_experiments

