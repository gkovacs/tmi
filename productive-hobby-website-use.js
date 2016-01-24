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
      this.occupation = evt.target.value;
      if (this.occupation != null && this.occupation.length > 0) {
        return $('.worksupp').text('(' + this.occupation + ')');
      }
    },
    hobbiesChanged: function(evt){
      this.hobbies = evt.target.value;
      if (this.hobbies != null && this.hobbies.length > 0) {
        return $('.hobbysupp').text('(' + this.hobbies + ')');
      }
    },
    radioGroupChanged: function(evt){
      return this.classifications[evt.target.sitename] = evt.target.selected;
    }
  });
}).call(this);
