(function(){
  var slice$ = [].slice;
  Polymer({
    is: 'productive-hobby-website-use2',
    properties: {
      domains: {
        type: Array,
        value: [],
        observer: 'domainsChanged'
      },
      duplicated_domains: {
        type: Array,
        computed: 'compute_duplicated_domains(domains)'
      },
      domains_with_duplicates: {
        type: Array,
        computed: 'compute_domains_with_duplicates(domains, duplicated_domains)'
      },
      occupation: {
        type: String,
        value: ''
      },
      hobbies: {
        type: String,
        value: ''
      },
      classifications: {
        type: Object,
        value: {}
      },
      domain_to_idx_to_classification: {
        type: Object,
        value: {}
      }
    },
    compute_duplicated_domains: function(domains){
      var extra_five;
      domains = slice$.call(domains, 0);
      if (domains.length < 5) {
        return [];
      }
      shuffle_array(domains);
      extra_five = [domains[0], domains[1], domains[2], domains[3], domains[4]];
      return extra_five;
    },
    compute_domains_with_duplicates: function(domains, duplicated_domains){
      var domains_with_duplicates;
      domains = slice$.call(domains, 0);
      duplicated_domains = slice$.call(duplicated_domains, 0);
      domains_with_duplicates = domains.concat(duplicated_domains);
      shuffle_array(domains_with_duplicates);
      return domains_with_duplicates;
    },
    domainsChanged: function(newdomains){
      var i$, len$, x, results$ = [];
      for (i$ = 0, len$ = newdomains.length; i$ < len$; ++i$) {
        x = newdomains[i$];
        this.classifications[x] = null;
        results$.push(this.domain_to_idx_to_classification[x] = {});
      }
      return results$;
    },
    occupationChanged: function(evt){
      this.occupation = evt.target.value;
      if (this.occupation != null && this.occupation.length > 0) {
        return $('.worksupp').text('(' + this.occupation + ')');
      }
    },
    hobbiesChanged: function(evt){
      this.hobbies = evt.target.value;
      if (this.hobbies != null && this.hobbies.length > 0) {
        return $('.hobbysupp').text('(' + this.hobbies + ')');
      }
    },
    radioGroupChanged: function(evt){
      var domain, idx, classification;
      domain = evt.target.sitename;
      idx = evt.target.idx;
      classification = evt.target.selected;
      this.classifications[domain] = classification;
      if (this.domain_to_idx_to_classification[domain] == null) {
        this.domain_to_idx_to_classification[domain] = {};
      }
      return this.domain_to_idx_to_classification[domain][idx] = classification;
    }
  });
}).call(this);
