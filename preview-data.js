(function(){
  Polymer({
    is: 'preview-data',
    properties: {
      fields: String,
      field_info_and_data_list: Array
    },
    havedata: function(){
      var fields_array, data, field_descriptions, field_info_and_data_list, i$, len$, name, output;
      console.log('have data');
      fields_array = this.$$('#autofill').fields_array;
      data = this.$$('#autofill').data;
      field_descriptions = this.$$('#autofill').field_descriptions;
      field_info_and_data_list = [];
      for (i$ = 0, len$ = fields_array.length; i$ < len$; ++i$) {
        name = fields_array[i$];
        output = {
          name: name
        };
        if (field_descriptions[name] != null) {
          output.description = field_descriptions[name];
        }
        if (data[name] != null) {
          output.data = data[name];
        }
        field_info_and_data_list.push(output);
      }
      this.field_info_and_data_list = field_info_and_data_list;
      return console.log(field_info_and_data_list);
    }
  });
}).call(this);
