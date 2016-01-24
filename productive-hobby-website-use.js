(function(){
  Polymer({
    is: 'productive-hobby-website-use',
    properties: {
      domains: {
        type: Array,
        value: [],
        observer: 'domainsChanged'
      },
      occupation: {
        type: String,
        value: ''
      },
      hobbies: {
        type: String,
        value: ''
      },
      classifications: {
        type: Object,
        value: {}
      }
    },
    domainsChanged: function(newdomains){
      var i$, len$, x, results$ = [];
      for (i$ = 0, len$ = newdomains.length; i$ < len$; ++i$) {
        x = newdomains[i$];
        results$.push(this.classifications[x] = null);
      }
      return results$;
    },
    occupationChanged: function(evt){
      return this.occupation = evt.target.value;
    },
    hobbiesChanged: function(evt){
      return this.hobbies = evt.target.value;
    },
    radioGroupChanged: function(evt){
      return this.classifications[evt.target.sitename] = evt.target.selected;
    }
  });
}).call(this);
