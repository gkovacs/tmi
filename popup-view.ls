Polymer {
  is: 'popup-view'
  properties: {
    experiment_list: Array
  }
  open_slacking_survey: ->
    open_survey 'slacking'
  open_facebook_survey: ->
    open_survey 'facebook'
  #  this.fire 'open-survey', 
  ready: ->
    self = this
    experiment_list_text <- $.get 'experiment_list.yaml'
    self.experiment_list = jsyaml.safeLoad experiment_list_text
}
