(function(){
  var getUrlParameters, open_page, open_survey, return_home, view_data, out$ = typeof exports != 'undefined' && exports || this;
  out$.getUrlParameters = getUrlParameters = function(){
    var url, hash, map, parts;
    url = window.location.href;
    hash = url.lastIndexOf('#');
    if (hash !== -1) {
      url = url.slice(0, hash);
    }
    map = {};
    parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value){
      return map[key] = decodeURIComponent(value).split('+').join(' ');
    });
    return map;
  };
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
}).call(this);
