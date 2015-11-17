(function(){
  var computed_fields, out$ = typeof exports != 'undefined' && exports || this;
  out$.computed_fields = computed_fields = {
    google_queries: function(callback){
      return getlist('google_history', function(google_history){
        var x;
        return callback((function(){
          var i$, ref$, len$, results$ = [];
          for (i$ = 0, len$ = (ref$ = google_history).length; i$ < len$; ++i$) {
            x = ref$[i$];
            results$.push(x.query);
          }
          return results$;
        }()));
      });
    },
    bing_queries: function(callback){
      return getlist('bing_history', function(bing_history){
        var x;
        return callback((function(){
          var i$, ref$, len$, results$ = [];
          for (i$ = 0, len$ = (ref$ = bing_history).length; i$ < len$; ++i$) {
            x = ref$[i$];
            results$.push(x.query);
          }
          return results$;
        }()));
      });
    },
    num_gmail_visits: function(callback){
      return getlist('gmail_visits', function(gmail_visits){
        return callback(gmail_visits.length);
      });
    },
    num_gmail_visits_in_past_24_hours: function(callback){
      return getlist('gmail_visits', function(gmail_visits){
        var curtime, gmail_visits_in_past_24_hours, res$, i$, len$, x;
        curtime = Date.now();
        res$ = [];
        for (i$ = 0, len$ = gmail_visits.length; i$ < len$; ++i$) {
          x = gmail_visits[i$];
          if (curtime - x.timestamp < 24 * 3600 * 1000) {
            res$.push(x);
          }
        }
        gmail_visits_in_past_24_hours = res$;
        return callback(gmail_visits_in_past_24_hours.length);
      });
    }
  };
}).call(this);
