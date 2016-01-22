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
        prelude.take(5)(
        prelude.reverse(
        prelude.sortBy(function(it){
          return it[1];
        }, data))));
        console.log(top_sites);
        return self.$$('#ratedomains').domains = top_sites;
      });
    },
    submitsurvey: function(){
      var ref$, occupation, hobbies, classifications, sssv_questions, answers, k, v, data, compressed_data;
      ref$ = this.$$('#ratedomains'), occupation = ref$.occupation, hobbies = ref$.hobbies, classifications = ref$.classifications;
      ref$ = this.$$('#surveyquestions'), sssv_questions = ref$.sssv_questions, answers = ref$.answers;
      if (!(window.skipchecks != null && window.skipchecks)) {
        if (occupation == null || occupation === '') {
          swal('Please fill out your occupation');
          return;
        }
        if (hobbies == null || hobbies === '') {
          swal('Please fill out your hobbies');
          return;
        }
        for (k in classifications) {
          v = classifications[k];
          if (v === null) {
            swal('Please indicate the primary reason you visit ' + k);
            return;
          }
        }
        for (k in answers) {
          v = answers[k];
          if (v === null) {
            swal('Please answer survey question ' + (parseInt(k) + 1));
            return;
          }
        }
      }
      data = {
        autofill: this.$$('#autofill').data,
        notes: this.$$('#notes').value,
        occupation: occupation,
        hobbies: hobbies,
        classifications: classifications,
        sssv_questions: sssv_questions,
        answers: answers,
        surveyname: 'sensationseeking1',
        time: Date.now(),
        localtime: new Date().toString()
      };
      console.log('compressing data');
      compressed_data = LZString.compressToEncodedURIComponent(JSON.stringify(data));
      console.log('posting data');
      return $.ajax({
        type: 'POST',
        url: '/logsurvey_compressed',
        contentType: 'text/plain',
        data: compressed_data,
        error: function(err){
          console.log('have error');
          return console.log(err);
        },
        complete: function(a){
          console.log(a);
          console.log('finished posting survey results');
          return swal('finished posting survey results');
        }
      });
    }
  });
}).call(this);
