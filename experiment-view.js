(function(){
  Polymer({
    is: 'experiment-view',
    properties: {},
    open_slacking_survey: function(){
      return open_survey('slacking');
    },
    open_facebook_survey: function(){
      return open_survey('facebook');
    },
    ready: function(){
      return console.log('something occurs');
    }
  });
}).call(this);
