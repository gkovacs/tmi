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
    },
    time_spent_composing_emails_gmail_in_past_24_hours: function(callback){
      return getlist('browsing_time_by_site', function(browsing_time_by_site){
        var time_on_gmail, res$, i$, len$, x, time_composing_emails, curtime, time_composing_emails_in_past_24_hours;
        res$ = [];
        for (i$ = 0, len$ = browsing_time_by_site.length; i$ < len$; ++i$) {
          x = browsing_time_by_site[i$];
          if (x.host === 'mail.google.com') {
            res$.push(x);
          }
        }
        time_on_gmail = res$;
        res$ = [];
        for (i$ = 0, len$ = time_on_gmail.length; i$ < len$; ++i$) {
          x = time_on_gmail[i$];
          if (x.url.endsWith('?compose=new')) {
            res$.push(x);
          }
        }
        time_composing_emails = res$;
        curtime = Date.now();
        res$ = [];
        for (i$ = 0, len$ = time_composing_emails.length; i$ < len$; ++i$) {
          x = time_composing_emails[i$];
          if (curtime - x.timestamp < 24 * 3600 * 1000) {
            res$.push(x);
          }
        }
        time_composing_emails_in_past_24_hours = res$;
        return callback(prelude.sum((function(){
          var i$, ref$, len$, results$ = [];
          for (i$ = 0, len$ = (ref$ = time_composing_emails_in_past_24_hours).length; i$ < len$; ++i$) {
            x = ref$[i$];
            results$.push(x.interval);
          }
          return results$;
        }())));
      });
    },
    time_spent_composing_emails_gmail: function(callback){
      return getlist('browsing_time_by_site', function(browsing_time_by_site){
        var time_on_gmail, res$, i$, len$, x, time_composing_emails;
        res$ = [];
        for (i$ = 0, len$ = browsing_time_by_site.length; i$ < len$; ++i$) {
          x = browsing_time_by_site[i$];
          if (x.host === 'mail.google.com') {
            res$.push(x);
          }
        }
        time_on_gmail = res$;
        res$ = [];
        for (i$ = 0, len$ = time_on_gmail.length; i$ < len$; ++i$) {
          x = time_on_gmail[i$];
          if (x.url.endsWith('?compose=new')) {
            res$.push(x);
          }
        }
        time_composing_emails = res$;
        return callback(prelude.sum((function(){
          var i$, ref$, len$, results$ = [];
          for (i$ = 0, len$ = (ref$ = time_composing_emails).length; i$ < len$; ++i$) {
            x = ref$[i$];
            results$.push(x.interval);
          }
          return results$;
        }())));
      });
    },
    num_gmail_visits_per_day: function(callback){
      return getlist('gmail_visits', function(gmail_visits){
        var curtime, first_visit, x, num_days;
        curtime = Date.now();
        first_visit = prelude.minimum((function(){
          var i$, ref$, len$, results$ = [];
          for (i$ = 0, len$ = (ref$ = gmail_visits).length; i$ < len$; ++i$) {
            x = ref$[i$];
            results$.push(x.timestamp);
          }
          return results$;
        }()));
        num_days = prelude.max(1)(
        Math.round(
        (curtime - first_visit) / (24 * 3600 * 1000)));
        return callback(gmail_visits.length / num_days);
      });
    },
    time_spent_composing_email_per_day_gmail: function(callback){
      return getlist('browsing_time_by_site', function(browsing_time_by_site){
        var time_on_gmail, res$, i$, len$, x, time_composing_emails, curtime, first_visit, num_days;
        res$ = [];
        for (i$ = 0, len$ = browsing_time_by_site.length; i$ < len$; ++i$) {
          x = browsing_time_by_site[i$];
          if (x.host === 'mail.google.com') {
            res$.push(x);
          }
        }
        time_on_gmail = res$;
        res$ = [];
        for (i$ = 0, len$ = time_on_gmail.length; i$ < len$; ++i$) {
          x = time_on_gmail[i$];
          if (x.url.endsWith('?compose=new')) {
            res$.push(x);
          }
        }
        time_composing_emails = res$;
        curtime = Date.now();
        first_visit = prelude.minimum((function(){
          var i$, ref$, len$, results$ = [];
          for (i$ = 0, len$ = (ref$ = time_composing_emails).length; i$ < len$; ++i$) {
            x = ref$[i$];
            results$.push(x.timestamp);
          }
          return results$;
        }()));
        num_days = prelude.max(1)(
        Math.round(
        (curtime - first_visit) / (24 * 3600 * 1000)));
        return callback(prelude.sum((function(){
          var i$, ref$, len$, results$ = [];
          for (i$ = 0, len$ = (ref$ = time_composing_emails).length; i$ < len$; ++i$) {
            x = ref$[i$];
            results$.push(x.interval);
          }
          return results$;
        }())) / num_days);
      });
    },
    time_spent_on_gmail_in_past_24_hours: function(callback){
      return getlist('browsing_time_by_site', function(browsing_time_by_site){
        var time_on_gmail, res$, i$, len$, x, curtime, time_on_gmail_in_past_24_hours;
        res$ = [];
        for (i$ = 0, len$ = browsing_time_by_site.length; i$ < len$; ++i$) {
          x = browsing_time_by_site[i$];
          if (x.host === 'mail.google.com') {
            res$.push(x);
          }
        }
        time_on_gmail = res$;
        curtime = Date.now();
        res$ = [];
        for (i$ = 0, len$ = time_on_gmail.length; i$ < len$; ++i$) {
          x = time_on_gmail[i$];
          if (curtime - x.timestamp < 24 * 3600 * 1000) {
            res$.push(x);
          }
        }
        time_on_gmail_in_past_24_hours = res$;
        return callback(prelude.sum((function(){
          var i$, ref$, len$, results$ = [];
          for (i$ = 0, len$ = (ref$ = time_on_gmail_in_past_24_hours).length; i$ < len$; ++i$) {
            x = ref$[i$];
            results$.push(x.interval);
          }
          return results$;
        }())));
      });
    },
    time_spent_on_gmail: function(callback){
      return getlist('browsing_time_by_site', function(browsing_time_by_site){
        var time_on_gmail, res$, i$, len$, x;
        res$ = [];
        for (i$ = 0, len$ = browsing_time_by_site.length; i$ < len$; ++i$) {
          x = browsing_time_by_site[i$];
          if (x.host === 'mail.google.com') {
            res$.push(x);
          }
        }
        time_on_gmail = res$;
        return callback(prelude.sum((function(){
          var i$, ref$, len$, results$ = [];
          for (i$ = 0, len$ = (ref$ = time_on_gmail).length; i$ < len$; ++i$) {
            x = ref$[i$];
            results$.push(x.interval);
          }
          return results$;
        }())));
      });
    },
    time_spent_on_gmail_per_day: function(callback){
      return getlist('browsing_time_by_site', function(browsing_time_by_site){
        var time_on_gmail, res$, i$, len$, x, curtime, first_visit, num_days;
        res$ = [];
        for (i$ = 0, len$ = browsing_time_by_site.length; i$ < len$; ++i$) {
          x = browsing_time_by_site[i$];
          if (x.host === 'mail.google.com') {
            res$.push(x);
          }
        }
        time_on_gmail = res$;
        curtime = Date.now();
        first_visit = prelude.minimum((function(){
          var i$, ref$, len$, results$ = [];
          for (i$ = 0, len$ = (ref$ = time_on_gmail).length; i$ < len$; ++i$) {
            x = ref$[i$];
            results$.push(x.timestamp);
          }
          return results$;
        }()));
        num_days = prelude.max(1)(
        Math.round(
        (curtime - first_visit) / (24 * 3600 * 1000)));
        return callback(prelude.sum((function(){
          var i$, ref$, len$, results$ = [];
          for (i$ = 0, len$ = (ref$ = time_on_gmail).length; i$ < len$; ++i$) {
            x = ref$[i$];
            results$.push(x.interval);
          }
          return results$;
        }())) / num_days);
      });
    }
  };
}).call(this);
