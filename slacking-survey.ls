Polymer {
  is: 'slacking-survey'
  properties: {
    
  }
  send_data: ->
    console.log 'todo not yet implemented'
  view_data: ->
    view_data 'slacking'
  return_home: ->
    return_home()
  ready: ->
    console.log 'something occurs'
    self = this
    browsing_time_by_site <- getlist 'browsing_time_by_site'
    host_to_browsing_time = {}
    for {host, interval} in browsing_time_by_site
      if not host_to_browsing_time[host]?
        host_to_browsing_time[host] = 0
      host_to_browsing_time[host] += interval
    time_and_host = [[time, host] for host,time of host_to_browsing_time]
    time_and_host.sort (a, b) -> b[0] - a[0]
    total_time = prelude.sum [time for [time,host] in time_and_host]
    self.$$('#total_time').innerText = (total_time / 3600).toPrecision(1)
    position = 0
    slacking_table_header = $('<div>').css({display: 'table', width: '100%'}).append [
      $('<div>').css({display: 'table-cell', 'text-align': 'left', 'font-weight': 'bold'}).text('Website')
      $('<div>').css({display: 'table-cell', 'text-align': 'right', 'font-weight': 'bold'}).text('Time spent')
    ]
    slacking_table_header.appendTo $(self.$$('#slacking_sites'))
    for [time,host] in time_and_host
      current_site = $('<div>').css({display: 'table', width: '100%'}).append [
       $('<div>').css({display: 'table-cell', 'text-align': 'left'}).text(host)
       $('<div>').css({display: 'table-cell', 'text-align': 'right'}).text((time / 3600).toPrecision(1) + ' hours')
      ]
      current_site.appendTo $(self.$$('#slacking_sites'))
      #self.$$('#host' + position).innerText = host
      #self.$$('#time' + position).innerText = (time / 3600).toPrecision(1)
      position += 1
      if position >= 10
        break      
}
