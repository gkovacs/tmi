(function(){
  var main;
  main = function(){
    var self_link, facebook_name;
    self_link = document.querySelectorAll('._2dpe._1ayn');
    if (self_link.length === 1) {
      facebook_name = self_link[0].innerText;
      console.log("set facebook_name to " + facebook_name);
      return setvar('facebook_name', facebook_name);
    }
  };
  main();
  onpageupdate(main);
}).call(this);
