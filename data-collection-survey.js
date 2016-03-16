(function(){
  Polymer({
    is: 'data-collection-survey',
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
      this.$$('#autofill').fields = "chrome_history_timespent_domain,chrome_history_earliest,extension_username";
      addlog({
        event: 'pageload'
      });
      return this.$$('#autofill').addEventListener('have-data', function(results){
        var data, compressed_data, failed_checks, ref$, chrome_history_earliest, chrome_history_timespent_domain, x, y;
        addlog({
          event: 'havedata'
        });
        window.data_loaded_time = Date.now();
        window.extension_username = '';
        if (results.detail != null && results.detail['extension_username'] != null) {
          window.extension_username = results.detail['extension_username'];
        }
        data = {
          autofill: results.detail,
          surveyname: 'collect1data',
          time: Date.now(),
          localtime: new Date().toString(),
          initial_page_loaded_time: window.initial_page_loaded_time,
          extension_loaded_time: window.extension_loaded_time,
          data_loaded_time: window.data_loaded_time,
          username: window.username,
          extension_username: window.extension_username,
          userid: window.userid,
          client_ip_address: window.client_ip_address
        };
        console.log('compressing data');
        compressed_data = LZString.compressToEncodedURIComponent(JSON.stringify(data));
        console.log('posting data');
        failed_checks = false;
        ref$ = results.detail, chrome_history_earliest = ref$.chrome_history_earliest, chrome_history_timespent_domain = ref$.chrome_history_timespent_domain;
        if (Date.now() < chrome_history_earliest + 1000 * 3600 * 24 * 30) {
          end_spinner();
          self.$$('#showifnoext').style.display = 'none';
          self.$$('#showifrequestdata').style.display = 'none';
          self.$$('#showifloading').style.display = 'none';
          self.$$('#showifdatacleared').style.display = '';
          failed_checks = true;
        } else if (prelude.sum((function(){
          var ref$, results$ = [];
          for (x in ref$ = chrome_history_timespent_domain) {
            y = ref$[x];
            results$.push(y);
          }
          return results$;
        }())) < 1000 * 3600 * 5) {
          end_spinner();
          self.$$('#showifnoext').style.display = 'none';
          self.$$('#showifrequestdata').style.display = 'none';
          self.$$('#showifloading').style.display = 'none';
          self.$$('#showifnotenoughdata').style.display = '';
          failed_checks = true;
        }
        return $.ajax({
          type: 'POST',
          url: '/logsurvey_compressed',
          contentType: 'text/plain',
          data: compressed_data,
          error: function(err){
            console.log('have error');
            console.log(err);
            end_spinner();
            swal('An error occurred while fetching browsing history ' + JSON.stringify(err));
            addlog({
              event: 'submitsurvey_error'
            });
            return addlog({
              event: 'submitsurvey_error_detailed',
              err: err
            });
          },
          complete: function(){
            var data, res$, k, ref$, v, top_sites;
            if (failed_checks) {
              return;
            }
            end_spinner();
            addlog({
              event: 'postdata_complete'
            });
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
          }
        });
      }, 0);
    },
    installextension: function(){
      var url, successCallback;
      if ((typeof chrome != 'undefined' && chrome !== null) && chrome.webstore != null && chrome.webstore.install != null) {
        addlog({
          event: 'extension_install_start'
        });
        return chrome.webstore.install(url = 'https://chrome.google.com/webstore/detail/gfbpfpdbpplbgahmeljkmbbmnbplkdif', successCallback = function(){
          addlog({
            event: 'extension_install_finish'
          });
          console.log('extension install finished');
          return window.location.reload();
        });
      } else {
        return window.open('https://chrome.google.com/webstore/detail/gfbpfpdbpplbgahmeljkmbbmnbplkdif');
      }
    },
    submitsurvey: function(){
      var self, ref$, occupation, hobbies, classifications, duplicated_domains, domains_with_duplicates, domain_to_idx_to_classification, k, v;
      self = this;
      ref$ = this.$$('#ratedomains'), occupation = ref$.occupation, hobbies = ref$.hobbies, classifications = ref$.classifications, duplicated_domains = ref$.duplicated_domains, domains_with_duplicates = ref$.domains_with_duplicates, domain_to_idx_to_classification = ref$.domain_to_idx_to_classification;
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
      }
      addlog({
        event: 'submitsurvey_start'
      });
      start_spinner();
      return setTimeout(function(){
        var data, compressed_data;
        data = {
          notes: self.$$('#notes').value,
          occupation: occupation,
          hobbies: hobbies,
          classifications: classifications,
          duplicated_domains: duplicated_domains,
          domains_with_duplicates: domains_with_duplicates,
          domain_to_idx_to_classification: domain_to_idx_to_classification,
          surveyname: 'collect1survey',
          time: Date.now(),
          localtime: new Date().toString(),
          initial_page_loaded_time: window.initial_page_loaded_time,
          extension_loaded_time: window.extension_loaded_time,
          data_loaded_time: window.data_loaded_time,
          username: window.username,
          extension_username: window.extension_username,
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
