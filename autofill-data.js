(function(){
  Polymer({
    is: 'autofill-data',
    properties: {
      fields: {
        type: String
      },
      fields_array: {
        type: Array,
        computed: 'computeFieldsArray(fields)',
        observer: 'fieldsChanged'
      },
      data: Object
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
        return sendExtension('getfields', newfields, function(response){
          console.log('response received from sendMessage');
          self.data = response;
          return self.fire('have-data', response);
        });
      });
    }
  });
}).call(this);
