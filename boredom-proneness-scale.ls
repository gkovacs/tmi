Polymer {
  is: 'boredom-proneness-scale'
  properties: {
    answers: {
      type: Object
      value: {}
    }
    sssv_questions: {
      type: Array
      observer: 'sssv_questionsChanged'
      value: [
        'It is easy for me to concentrate on my activities.' # 1
        'Frequently when I am working I find myself worrying about other things.' # 2
        'Time always seems to be passing slowly.' # 3
        'I often find myself at "loose ends", not knowing what to do.' # 4
        'I am often trapped in situations where I have to do meaningless things.' # 5
        'Having to look at someone\'s home movies or travel slides bores me tremendously.' # 6
        'I have projects in mind all the time, things to do.' # 7
        'I find it easy to entertain myself.' # 8
        'Many things I have to do are repetitive and monotonous.' # 9
        'It takes more stimulation to get me going than most people.' # 10
        'I get a kick out of most things I do.' # 11
        'I am seldom excited about my work.' # 12
        'In any situation I can usually find something to do or see to keep me interested.' # 13
        'Much of the time I just sit around doing nothing.' # 14
        'I am good at waiting patiently.' # 15
        'I often find myself with nothing to do - time on my hands.' # 16
        'In situations where I have to wait, such as a line or queue, I get very restless.' # 17
        'I often wake up with a new idea.' # 18
        'It would be very hard for me to find a job that is exciting enough.' # 19
        'I would like more challenging things to do in life.' # 20
        'I feel that I am working below my abilities most of the time.' # 21
        'Many people would say that I am a creative or imaginative person.' # 22
        'I have so many interests, I don\'t have time to do everything.' # 23
        'Among my friends, I am the one who keeps doing something the longest' # 24
        'Unless I am doing something exciting, even dangerous, I feel half-dead and dull.' # 25
        'It takes a lot of change and variety to keep me really happy.' # 26
        'It seems that the same things are on televisions or the movies all the time; it\'s getting old.' # 27
        'When I was young, I was often in monotonous and tiresome situations.' # 28
        'It is difficult for me to entertain myself.' # 29 extra (T), opposite of 8 (F)
        'My work often excites me.' # 30 extra (F), opposite of 12 (T)
        'I rarely ever wake up with a new idea.' # 31 extra (T), opposite of 18 (F)
        'Time always seems to be passing quickly.' # 32 extra (F), opposite of 3 (T)
        'I am bad at waiting patiently.' # 33 extra (T), opposite of 15 (F)
      ]
    }
  }
  sssv_questionsChanged: (newval) ->
    this.answers = [null for x in newval]
  plusone: (x) -> x+1
  getqclass: (idx) ->
    return 'boredom'
  gethighchoice: (idx) ->
    idxp = idx + 1
    if [1,7,8,11,13,15,18,22,23,24,30,32].indexOf(idxp) != -1 # 30 and 32 are veritifcation questions
      return 'F'
    return 'T'
  radioGroupChanged: (evt) ->
    selected_text = evt.target.atext
    qidx = parseInt evt.target.qidx
    this.answers[qidx] = {
      choice: evt.target.selected
      text: selected_text
      class: evt.target.qclass
      high: evt.target.highchoice
    }
    if 28 <= qidx <= 32
      this.answers[qidx].oppidx = {28: 7, 29: 11, 30: 17, 31: 2, 32: 14}[qidx]
    #console.log this.answers[evt.target.qidx]
}
