Polymer {
  is: 'auto-field'
  properties: {
    field: {
      type: String
      observer: 'fieldChanged'
    }
  }
  fieldChanged: ->
    field_name = this.field
    self = this
    value <- getvar field_name
    experiment_info <- getExperimentInfo field_name
    experiment_title = experiment_info.title
    self.$$('#field_description').innerText = experiment_title
    self.$$('#field_value').innerText = value
}
