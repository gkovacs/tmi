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
      return sendExtension('getfields', newfields, function(response){
        console.log('response received from sendMessage');
        console.log(response);
        return self.fire('have-data', response);
      });
    }
  });
}).call(this);
