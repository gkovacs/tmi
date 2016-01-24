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
    #if this.occupation? and this.occupation.length > 0
    #  $('.workradio').tooltipster({content: this.occupation, position: 'top-right'})
    #  $('.workradio').tooltipster('content', this.occupation)
  hobbiesChanged: (evt) ->
    this.hobbies = evt.target.value
    #if this.hobbies? and this.hobbies.length > 0
    #  $('.hobbyradio').tooltipster({content: this.hobbies, position: 'top-right'})
    #  $('.hobbyradio').tooltipster('content', this.hobbies)
  radioGroupChanged: (evt) ->
    this.classifications[evt.target.sitename] = evt.target.selected
}
