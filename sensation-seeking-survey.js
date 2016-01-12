(function(){
  Polymer({
    is: 'sensation-seeking-survey',
    ready: function(){
      var self;
      self = this;
      return this.$$('#autofill').addEventListener('have-data', function(results){
        var data, res$, k, ref$, v, top_sites;
        console.log('have-data callback');
        console.log(results.detail);
        res$ = [];
        for (k in ref$ = results.detail.chrome_history_timespent_domain) {
          v = ref$[k];
          res$.push([k, v]);
        }
        data = res$;
        top_sites = prelude.map(function(it){
          return it[0];
        })(
        prelude.take(40)(
        prelude.reverse(
        prelude.sortBy(function(it){
          return it[1];
        }, data))));
        console.log(top_sites);
        return self.$$('#ratedomains').domains = top_sites;
      });
    }
  });
}).call(this);
