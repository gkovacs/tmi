Polymer {
  is: 'autofill-data'
  properties: {
    fields: {
      type: String
    }
    fields_array: {
      type: Array
      computed: 'computeFieldsArray(fields)'
      observer: 'fieldsChanged'
    }
    data: Object
  }
  computeFieldsArray: (fields) ->
    return levn.parse('[String]', fields)
  fieldsChanged: (newfields, oldfields) ->
    self = this
    console.log newfields
    console.log 'sendMessage called'
    # once content script is loaded
    once_available '#autosurvey_content_script_loaded', ->
      sendExtension 'getfields', newfields, (response) ->
        console.log 'response received from sendMessage'
        self.data = response
        self.fire 'have-data', response
}
