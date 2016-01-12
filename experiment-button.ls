Polymer {
  is: 'experiment-button'
  properties: {
    title: String
    available: String
    icon: String
    link: String
  }
  boxclicked: (evt, obj)->
    console.log evt
    console.log obj
    #window.open '/emailsurvey.html'
    #if not this.link?
    #  alert 'This is not yet ready, come back later'
    #  return
    if this.link?
      window.open this.link
}
