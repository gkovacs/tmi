(function(){
  var open_page, open_survey, return_home, view_data, start_spinner, end_spinner, out$ = typeof exports != 'undefined' && exports || this;
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
}).call(this);
