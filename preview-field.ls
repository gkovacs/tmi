Polymer {
  is: 'preview-field'
  properties: {
    name: String
    description: String
    data: Object
    data_display: {
      type: String
      computed: 'compute_data_display(data)'
    }
  }
  compute_data_display: (data) ->
    if typeof data == 'string'
      return data
    return jsyaml.safeDump(data)
}
