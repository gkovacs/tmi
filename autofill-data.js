(function(){
  Polymer({
    is: 'autofill-data',
    properties: {
      pagename: String,
      fields: {
        type: String
      },
      fields_array: {
        type: Array,
        computed: 'computeFieldsArray(fields)',
        observer: 'fieldsChanged'
      },
      data: Object,
      field_descriptions: Object
    },
    computeFieldsArray: function(fields){
      return levn.parse('[String]', fields);
    },
    fieldsChanged: function(newfields, oldfields){
      var self;
      self = this;
      console.log(newfields);
      console.log('sendMessage called');
      return once_available('#autosurvey_content_script_loaded', function(){
        return sendExtension('requestfields', {
          fieldnames: newfields,
          pagename: self.pagename
        }, function(response){
          console.log('response received from sendMessage');
          self.data = response;
          console.log('self.data set');
          console.log(self.data);
          return sendExtension('get_field_descriptions', newfields, function(field_descriptions){
            self.field_descriptions = field_descriptions;
            return self.fire('have-data', response);
          });
        });
      });
    }
  });
}).call(this);
