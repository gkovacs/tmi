(function(){
  Polymer({
    is: 'google-survey',
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
      var self;
      self = this;
      return getlist('google_history', function(searches){
        var queries, res$, i$, len$, x;
        res$ = [];
        for (i$ = 0, len$ = searches.length; i$ < len$; ++i$) {
          x = searches[i$];
          res$.push(x.query);
        }
        queries = res$;
        return self.$$('#displaydata').innerText = JSON.stringify(queries);
      });
    }
  });
}).call(this);
