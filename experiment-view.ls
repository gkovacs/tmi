Polymer {
  is: 'experiment-view'
  properties: {
    
  }
  open_slacking_survey: ->
    open_survey 'slacking'
  open_facebook_survey: ->
    open_survey 'facebook'
  #  this.fire 'open-survey', 
  ready: ->
    console.log 'something occurs'
}
