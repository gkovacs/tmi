(function(){
  Polymer({
    is: 'slacking-survey',
    properties: {},
    send_data: function(){
      return console.log('todo not yet implemented');
    },
    view_data: function(){
      return view_data('slacking');
    },
    return_home: function(){
      return return_home();
    },
    ready: function(){
      var self;
      console.log('something occurs');
      self = this;
      return getlist('browsing_time_by_site', function(browsing_time_by_site){
        var host_to_browsing_time, i$, len$, ref$, host, interval, time_and_host, res$, time, total_time, position, slacking_table_header, current_site, results$ = [];
        host_to_browsing_time = {};
        for (i$ = 0, len$ = browsing_time_by_site.length; i$ < len$; ++i$) {
          ref$ = browsing_time_by_site[i$], host = ref$.host, interval = ref$.interval;
          if (host_to_browsing_time[host] == null) {
            host_to_browsing_time[host] = 0;
          }
          host_to_browsing_time[host] += interval;
        }
        res$ = [];
        for (host in host_to_browsing_time) {
          time = host_to_browsing_time[host];
          res$.push([time, host]);
        }
        time_and_host = res$;
        time_and_host.sort(function(a, b){
          return b[0] - a[0];
        });
        total_time = prelude.sum((function(){
          var i$, ref$, len$, ref1$, results$ = [];
          for (i$ = 0, len$ = (ref$ = time_and_host).length; i$ < len$; ++i$) {
            ref1$ = ref$[i$], time = ref1$[0], host = ref1$[1];
            results$.push(time);
          }
          return results$;
        }()));
        self.$$('#total_time').innerText = (total_time / 3600).toPrecision(1);
        position = 0;
        slacking_table_header = $('<div>').css({
          display: 'table',
          width: '100%'
        }).append([
          $('<div>').css({
            display: 'table-cell',
            'text-align': 'left',
            'font-weight': 'bold'
          }).text('Website'), $('<div>').css({
            display: 'table-cell',
            'text-align': 'right',
            'font-weight': 'bold'
          }).text('Time spent')
        ]);
        slacking_table_header.appendTo($(self.$$('#slacking_sites')));
        for (i$ = 0, len$ = time_and_host.length; i$ < len$; ++i$) {
          ref$ = time_and_host[i$], time = ref$[0], host = ref$[1];
          current_site = $('<div>').css({
            display: 'table',
            width: '100%'
          }).append([
            $('<div>').css({
              display: 'table-cell',
              'text-align': 'left'
            }).text(host), $('<div>').css({
              display: 'table-cell',
              'text-align': 'right'
            }).text((time / 3600).toPrecision(1) + ' hours')
          ]);
          current_site.appendTo($(self.$$('#slacking_sites')));
          position += 1;
          if (position >= 10) {
            break;
          }
        }
        return results$;
      });
    }
  });
}).call(this);
