(function(){
  Polymer({
    is: 'boredom-proneness-survey',
    extensionloaded: function(){
      var self;
      self = this;
      addlog({
        event: 'extensionloaded'
      });
      window.extension_loaded_time = Date.now();
      console.log('extension loaded in sensation-seeking-survey');
      self.$$('#showifnoext').style.display = 'none';
      self.$$('#showifrequestdata').style.display = '';
      return start_spinner();
    },
    ready: function(){
      var self;
      window.initial_page_loaded_time = Date.now();
      self = this;
      this.$$('#autofill').fields = "chrome_history_timespent_domain,chrome_history_pages,chrome_history_visits";
      addlog({
        event: 'pageload'
      });
      return this.$$('#autofill').addEventListener('have-data', function(results){
        var data, res$, k, ref$, v, top_sites;
        addlog({
          event: 'havedata'
        });
        window.data_loaded_time = Date.now();
        self.$$('#showifnoext').style.display = 'none';
        self.$$('#showifrequestdata').style.display = 'none';
        self.$$('#showifloading').style.display = 'none';
        self.$$('#showifhavedata').style.display = '';
        end_spinner();
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
    },
    installextension: function(){
      var url, successCallback;
      if ((typeof chrome != 'undefined' && chrome !== null) && chrome.webstore != null && chrome.webstore.install != null) {
        addlog({
          event: 'extension_install_start'
        });
        return chrome.webstore.install(url = 'https://chrome.google.com/webstore/detail/mogonddkdjlindkbpkagjfkbckgjjmem', successCallback = function(){
          addlog({
            event: 'extension_install_finish'
          });
          console.log('extension install finished');
          return window.location.reload();
        });
      } else {
        return window.open('https://chrome.google.com/webstore/detail/mogonddkdjlindkbpkagjfkbckgjjmem');
      }
    },
    submitsurvey: function(){
      var self, ref$, occupation, hobbies, classifications, sssv_questions, answers, k, v;
      self = this;
      ref$ = this.$$('#ratedomains'), occupation = ref$.occupation, hobbies = ref$.hobbies, classifications = ref$.classifications;
      ref$ = this.$$('#surveyquestions'), sssv_questions = ref$.sssv_questions, answers = ref$.answers;
      if (!(window.skipchecks != null && window.skipchecks)) {
        if (occupation == null || occupation === '') {
          swal('Please fill out your occupation');
          addlog({
            event: 'submitsurvey_incomplete',
            missing: 'occupation'
          });
          return;
        }
        if (hobbies == null || hobbies === '') {
          swal('Please fill out your hobbies');
          addlog({
            event: 'submitsurvey_incomplete',
            missing: 'hobbies'
          });
          return;
        }
        for (k in classifications) {
          v = classifications[k];
          if (v === null) {
            swal('Please indicate the primary reason you visit ' + k);
            addlog({
              event: 'submitsurvey_incomplete',
              missing: 'website_classifications',
              classifications: classifications
            });
            return;
          }
        }
        for (k in answers) {
          v = answers[k];
          if (v === null) {
            swal('Please answer survey question ' + (parseInt(k) + 1));
            addlog({
              event: 'submitsurvey_incomplete',
              missing: 'survey_question',
              answers: answers
            });
            return;
          }
        }
      }
      addlog({
        event: 'submitsurvey_start'
      });
      start_spinner();
      return setTimeout(function(){
        var data, compressed_data;
        data = {
          autofill: self.$$('#autofill').data,
          notes: self.$$('#notes').value,
          occupation: occupation,
          hobbies: hobbies,
          classifications: classifications,
          sssv_questions: sssv_questions,
          answers: answers,
          surveyname: 'sensationseeking1',
          time: Date.now(),
          localtime: new Date().toString(),
          initial_page_loaded_time: window.initial_page_loaded_time,
          extension_loaded_time: window.extension_loaded_time,
          data_loaded_time: window.data_loaded_time,
          username: window.username,
          userid: window.userid,
          client_ip_address: window.client_ip_address
        };
        addcompletioncode();
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
            console.log(err);
            end_spinner();
            swal(err);
            addlog({
              event: 'submitsurvey_error'
            });
            return addlog({
              event: 'submitsurvey_error_detailed',
              err: err
            });
          },
          complete: function(){
            end_spinner();
            swal('thanks for participating. your completion code is ' + window.userid);
            return addlog({
              event: 'submitsurvey_complete'
            });
          }
        });
      }, 0);
    }
  });
}).call(this);
