Polymer {
  is: 'data-collection-survey'
  extensionloaded: ->
    self = this
    addlog {event: 'extensionloaded'}
    window.extension_loaded_time = Date.now()
    console.log 'extension loaded in sensation-seeking-survey'
    #swal 'extension loaded'
    self.$$('#showifnoext').style.display = 'none'
    self.$$('#showifrequestdata').style.display = ''
    start_spinner()
  ready: ->
    window.initial_page_loaded_time = Date.now()
    self = this
    #this.$$('#autofill').fields="chrome_history_timespent_domain,chrome_history_pages,chrome_history_visits"
    this.$$('#autofill').fields="chrome_history_timespent_domain,chrome_history_earliest"
    #this.$$('#autofill').addEventListener 'extension-loaded', ->
    #  self.$$('#showifnoext').style.display = 'none'
    #  self.$$('#hideifnoext').style.display = ''
    addlog {event: 'pageload'}
    this.$$('#autofill').addEventListener 'have-data', (results) ->
      addlog {event: 'havedata'}
      window.data_loaded_time = Date.now()
      data = {
        autofill: results.detail
        surveyname: 'collect1data'
        time: Date.now()
        localtime: new Date().toString()
        initial_page_loaded_time: window.initial_page_loaded_time
        extension_loaded_time: window.extension_loaded_time
        data_loaded_time: window.data_loaded_time
        username: window.username
        userid: window.userid
        client_ip_address: window.client_ip_address
      }
      console.log 'compressing data'
      compressed_data = LZString.compressToEncodedURIComponent JSON.stringify data
      console.log 'posting data'
      failed_checks = false
      {chrome_history_earliest, chrome_history_timespent_domain} = results.detail
      if Date.now() < (chrome_history_earliest + 1000*3600*24*30)
        end_spinner()
        self.$$('#showifnoext').style.display = 'none'
        self.$$('#showifrequestdata').style.display = 'none'
        self.$$('#showifloading').style.display = 'none'
        self.$$('#showifdatacleared').style.display = ''
        failed_checks = true
      else if prelude.sum([y for x,y of chrome_history_timespent_domain]) < 1000*3600*5
        end_spinner()
        self.$$('#showifnoext').style.display = 'none'
        self.$$('#showifrequestdata').style.display = 'none'
        self.$$('#showifloading').style.display = 'none'
        self.$$('#showifnotenoughdata').style.display = ''
        failed_checks = true
      $.ajax {
        type: 'POST'
        url: '/logsurvey_compressed'
        contentType: 'text/plain'
        data: compressed_data
        #contentType: 'application/json'
        #dataType: 'json'
        #data: JSON.stringify(data)
        error: (err) ->
          console.log 'have error'
          console.log err
          end_spinner()
          swal 'An error occurred while fetching browsing history ' + JSON.stringify(err)
          addlog {event: 'submitsurvey_error'}
          addlog {event: 'submitsurvey_error_detailed', err}
        complete: ->
          if failed_checks
            return
          end_spinner()
          #console.log a
          #console.log 'finished posting survey results'
          #swal 'finished posting survey results. thanks for participating'
          addlog {event: 'postdata_complete'}
          self.$$('#showifnoext').style.display = 'none'
          self.$$('#showifrequestdata').style.display = 'none'
          self.$$('#showifloading').style.display = 'none'
          self.$$('#showifhavedata').style.display = ''
          end_spinner()
          #console.log 'have-data callback'
          #console.log results.detail
          data = [[k, v] for k,v of results.detail.chrome_history_timespent_domain]
          top_sites = prelude.sortBy (.[1]), data |> prelude.reverse |> prelude.take 40 |> prelude.map (.[0])
          console.log top_sites
          self.$$('#ratedomains').domains = top_sites
      }
    , 0
  installextension: ->
    #window.open('https://chrome.google.com/webstore/detail/feed-learn/ebmjdfhplinmlajmdcmhkikideknlgkf')
    #chrome.webstore.install('https://chrome.google.com/webstore/detail/ebmjdfhplinmlajmdcmhkikideknlgkf')
    if chrome? and chrome.webstore? and chrome.webstore.install?
      addlog {event: 'extension_install_start'}
      chrome.webstore.install(
        url='https://chrome.google.com/webstore/detail/gfbpfpdbpplbgahmeljkmbbmnbplkdif',
        successCallback= ->
          addlog {event: 'extension_install_finish'}
          #swal 'extension install finished'
          console.log 'extension install finished'
          window.location.reload()
      )
    else
      window.open('https://chrome.google.com/webstore/detail/gfbpfpdbpplbgahmeljkmbbmnbplkdif')
  submitsurvey: ->
    self = this
    {occupation, hobbies, classifications, duplicated_domains, domains_with_duplicates, domain_to_idx_to_classification} = this.$$('#ratedomains')
    # {sssv_questions, answers} = this.$$('#surveyquestions')
    if not (window.skipchecks? and window.skipchecks)
      if not occupation? or occupation == ''
        swal 'Please fill out your occupation'
        addlog {event: 'submitsurvey_incomplete', missing: 'occupation'}
        return
      if not hobbies? or hobbies == ''
        swal 'Please fill out your hobbies'
        addlog {event: 'submitsurvey_incomplete', missing: 'hobbies'}
        return
      for k,v of classifications
        if v == null
          swal 'Please indicate the primary reason you visit ' + k
          addlog {event: 'submitsurvey_incomplete', missing: 'website_classifications', classifications}
          return
      #for k,v of answers
      #  if v == null
      #    swal 'Please answer survey question ' + (parseInt(k)+1)
      #    addlog {event: 'submitsurvey_incomplete', missing: 'survey_question', answers}
      #    return
    addlog {event: 'submitsurvey_start'}
    start_spinner()
    setTimeout ->
      data = {
        # autofill: self.$$('#autofill').data
        notes: self.$$('#notes').value
        occupation
        hobbies
        classifications
        duplicated_domains
        domains_with_duplicates
        domain_to_idx_to_classification
        #sssv_questions
        #answers
        surveyname: 'collect1survey'
        time: Date.now()
        localtime: new Date().toString()
        initial_page_loaded_time: window.initial_page_loaded_time
        extension_loaded_time: window.extension_loaded_time
        data_loaded_time: window.data_loaded_time
        username: window.username
        userid: window.userid
        client_ip_address: window.client_ip_address
      }
      addcompletioncode()
      console.log 'compressing data'
      compressed_data = LZString.compressToEncodedURIComponent JSON.stringify data
      console.log 'posting data'
      $.ajax {
        type: 'POST'
        url: '/logsurvey_compressed'
        contentType: 'text/plain'
        data: compressed_data
        #contentType: 'application/json'
        #dataType: 'json'
        #data: JSON.stringify(data)
        error: (err) ->
          console.log 'have error'
          console.log err
          end_spinner()
          swal err
          addlog {event: 'submitsurvey_error'}
          addlog {event: 'submitsurvey_error_detailed', err}
        complete: ->
          end_spinner()
          #console.log a
          #console.log 'finished posting survey results'
          #swal 'finished posting survey results. thanks for participating'
          swal 'thanks for participating. your completion code is ' + window.userid
          addlog {event: 'submitsurvey_complete'}
      }
    , 0
}

