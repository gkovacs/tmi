Polymer {
  is: 'preview-data'
  properties: {
    fields: String
    field_info_and_data_list: Array
  }
  havedata: ->
    console.log 'have data'
    fields_array = this.$$('#autofill').fields_array
    data = this.$$('#autofill').data
    field_descriptions = this.$$('#autofill').field_descriptions
    field_info_and_data_list = []
    for name in fields_array
      output = {name}
      if field_descriptions[name]?
        output.description = field_descriptions[name]
      if data[name]?
        output.data = data[name]
      field_info_and_data_list.push output
    this.field_info_and_data_list = field_info_and_data_list
    console.log field_info_and_data_list
}
