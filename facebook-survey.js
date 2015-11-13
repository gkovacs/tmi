(function(){
  Polymer({
    is: 'facebook-survey',
    properties: {},
    send_data: function(){
      return console.log('todo not yet implemented');
    },
    view_data: function(){
      return view_data('facebook');
    },
    return_home: function(){
      return return_home();
    },
    ready: function(){
      return console.log('something occurs');
    }
  });
}).call(this);
