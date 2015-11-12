Polymer {
  is: 'json-list'
  properties: {
    field: {
      type: String
      observer: 'fieldChanged'
    }
    json_lines: Array
  }
  fieldChanged: ->
    field_name = this.field
    self = this
    value <- getlist field_name
    self.json_lines = value
    console.log self.json_lines
  prettyprint: (line) ->
    JSON.stringify(line)
}
