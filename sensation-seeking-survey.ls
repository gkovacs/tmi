Polymer {
  is: 'sensation-seeking-survey'
  ready: ->
    self = this
    this.$$('#autofill').addEventListener 'have-data', (results) ->
      console.log 'have-data callback'
      console.log results.detail
      data = [[k, v] for k,v of results.detail.chrome_history_timespent_domain]
      top_sites = prelude.sortBy (.[1]), data |> prelude.reverse |> prelude.take 40 |> prelude.map (.[0])
      console.log top_sites
      self.$$('#ratedomains').domains = top_sites
}