Polymer {
  is: 'view-data'
  properties: {
    survey: {
      type: String
      observer: 'surveyChanged'
    }
  }

  send_data: ->
    alert 'todo not yet implemented'
  return_to_survey: ->
    open_survey this.survey
  return_home: ->
    return_home()
  surveyChanged: ->
    self = this
    survey_info <- getSurveyInfo self.survey
    output = {}
    {vars, lists} = survey_info
    vars ?= []
    lists ?= []
    <- async.eachSeries vars, (varname, ncallback) ->
      val <- getvar varname
      if not output.vars?
        output.vars = {}
      output.vars[varname] = val
      ncallback()
    <- async.eachSeries lists, (listname, ncallback) ->
      val <- getlist listname
      if not output.lists?
        output.lists = {}
      output.lists[listname] = val
      ncallback()
    self.$$('#results').innerText = jsyaml.safeDump output
    #console.log 'something occurs'
}
