(function(){
  Polymer({
    is: 'experiment-button',
    properties: {
      title: String,
      available: String,
      icon: String,
      link: String
    },
    boxclicked: function(evt, obj){
      console.log(evt);
      console.log(obj);
      if (this.link != null) {
        return window.open(this.link);
      }
    }
  });
}).call(this);
