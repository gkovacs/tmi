(function(){
  var open_page, open_survey, return_home, view_data, start_spinner, end_spinner, addlog, addcompletioncode, out$ = typeof exports != 'undefined' && exports || this;
  out$.open_page = open_page = function(page_name, options){
    var newpage, k, v;
    newpage = $("<" + page_name + ">");
    if (options != null) {
      for (k in options) {
        v = options[k];
        newpage.attr(k, v);
      }
    }
    return $('#contents').html(newpage);
  };
  out$.open_survey = open_survey = function(survey_name){
    return open_page(survey_name + '-survey');
  };
  out$.return_home = return_home = function(){
    return open_page('popup-view');
  };
  out$.view_data = view_data = function(survey_name){
    return open_page('view-data', {
      survey: survey_name
    });
  };
  out$.start_spinner = start_spinner = function(){
    if ($('#spinoverlay').length === 0) {
      $('<div id="spinoverlay" style="width: 100vw; height: 100vh; position: fixed; top: 0px; left: 0px; pointer-events: none"></div>').appendTo('body');
    }
    return $('#spinoverlay').spin({
      scale: 5.0
    });
  };
  out$.end_spinner = end_spinner = function(){
    return $('#spinoverlay').spin(false);
  };
  out$.addlog = addlog = function(data){
    data = import$({}, data);
    if (window.username != null) {
      data.username = window.username;
    }
    if (window.userid != null) {
      data.userid = window.userid;
    }
    if (window.client_ip_address != null) {
      data.client_ip_address = window.client_ip_address;
    }
    data.time = Date.now();
    data.localtime = new Date().toString();
    return $.ajax({
      type: 'POST',
      url: '/addlog',
      contentType: 'text/plain',
      data: JSON.stringify(data)
    });
  };
  out$.addcompletioncode = addcompletioncode = function(){
    return $.ajax({
      type: 'POST',
      url: '/addcompletioncode',
      contentType: 'text/plain',
      data: JSON.stringify({
        userid: window.userid,
        username: window.username
      })
    });
  };
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
