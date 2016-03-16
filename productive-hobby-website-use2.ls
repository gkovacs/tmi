Polymer {
  is: 'productive-hobby-website-use2'
  properties: {
    domains: {
      type: Array
      value: []
      observer: 'domainsChanged'
    }
    duplicated_domains: {
      type: Array
      computed: 'compute_duplicated_domains(domains)'
    }
    domains_with_duplicates: {
      type: Array
      computed: 'compute_domains_with_duplicates(domains, duplicated_domains)'
    }
    occupation: {
      type: String
      value: ''
    }
    hobbies: {
      type: String
      value: ''
    }
    classifications: {
      type: Object
      value: {}
    }
    domain_to_idx_to_classification: {
      type: Object
      value: {}
    }
  }
  compute_duplicated_domains: (domains) ->
    domains = domains[to]
    if domains.length < 5
      return []
    shuffle_array domains
    extra_five = domains[0 til 5]
    return extra_five
  compute_domains_with_duplicates: (domains, duplicated_domains) ->
    domains = domains[to]
    duplicated_domains = duplicated_domains[to]
    domains_with_duplicates = domains.concat duplicated_domains
    shuffle_array domains_with_duplicates
    return domains_with_duplicates
  domainsChanged: (newdomains) ->
    for x in newdomains
      this.classifications[x] = null
      this.domain_to_idx_to_classification[x] = {}
  occupationChanged: (evt) ->
    this.occupation = evt.target.value
    if this.occupation? and this.occupation.length > 0
      $('.worksupp').text('(' + this.occupation + ')')
    #  $('.workradio').tooltipster({content: this.occupation, position: 'top-right'})
    #  $('.workradio').tooltipster('content', this.occupation)
  hobbiesChanged: (evt) ->
    this.hobbies = evt.target.value
    if this.hobbies? and this.hobbies.length > 0
      $('.hobbysupp').text('(' + this.hobbies + ')')
    #  $('.hobbyradio').tooltipster({content: this.hobbies, position: 'top-right'})
    #  $('.hobbyradio').tooltipster('content', this.hobbies)
  radioGroupChanged: (evt) ->
    domain = evt.target.sitename
    idx = evt.target.idx
    classification = evt.target.selected
    this.classifications[domain] = classification
    if not this.domain_to_idx_to_classification[domain]?
      this.domain_to_idx_to_classification[domain] = {}
    this.domain_to_idx_to_classification[domain][idx] = classification
}
