Polymer {
  is: 'productive-hobby-website-use'
  properties: {
    domains: {
      type: Array
      value: []
      observer: 'domainsChanged'
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
  }
  domainsChanged: (newdomains) ->
    for x in newdomains
      this.classifications[x] = null
  occupationChanged: (evt) ->
    this.occupation = evt.target.value
  hobbiesChanged: (evt) ->
    this.hobbies = evt.target.value
  radioGroupChanged: (evt) ->
    this.classifications[evt.target.sitename] = evt.target.selected
}
