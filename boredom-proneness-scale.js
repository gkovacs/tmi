(function(){
  Polymer({
    is: 'boredom-proneness-scale',
    properties: {
      answers: {
        type: Object,
        value: {}
      },
      sssv_questions: {
        type: Array,
        observer: 'sssv_questionsChanged',
        value: ['It is easy for me to concentrate on my activities.', 'Frequently when I am working I find myself worrying about other things.', 'Time always seems to be passing slowly.', 'I often find myself at "loose ends", not knowing what to do.', 'I am often trapped in situations where I have to do meaningless things.', 'Having to look at someone\'s home movies or travel slides bores me tremendously.', 'I have projects in mind all the time, things to do.', 'I find it easy to entertain myself.', 'Many things I have to do are repetitive and monotonous.', 'It takes more stimulation to get me going than most people.', 'I get a kick out of most things I do.', 'I am seldom excited about my work.', 'In any situation I can usually find something to do or see to keep me interested.', 'Much of the time I just sit around doing nothing.', 'I am good at waiting patiently.', 'I often find myself with nothing to do - time on my hands.', 'In situations where I have to wait, such as a line or queue, I get very restless.', 'I often wake up with a new idea.', 'It would be very hard for me to find a job that is exciting enough.', 'I would like more challenging things to do in life.', 'I feel that I am working below my abilities most of the time.', 'Many people would say that I am a creative or imaginative person.', 'I have so many interests, I don\'t have time to do everything.', 'Among my friends, I am the one who keeps doing something the longest', 'Unless I am doing something exciting, even dangerous, I feel half-dead and dull.', 'It takes a lot of change and variety to keep me really happy.', 'It seems that the same things are on televisions or the movies all the time; it\'s getting old.', 'When I was young, I was often in monotonous and tiresome situations.', 'It is difficult for me to entertain myself.', 'My work often excites me.', 'I rarely ever wake up with a new idea.', 'Time always seems to be passing quickly.', 'I am bad at waiting patiently.']
      }
    },
    sssv_questionsChanged: function(newval){
      var x;
      return this.answers = (function(){
        var i$, ref$, len$, results$ = [];
        for (i$ = 0, len$ = (ref$ = newval).length; i$ < len$; ++i$) {
          x = ref$[i$];
          results$.push(null);
        }
        return results$;
      }());
    },
    plusone: function(x){
      return x + 1;
    },
    getqclass: function(idx){
      return 'boredom';
    },
    gethighchoice: function(idx){
      var idxp;
      idxp = idx + 1;
      if ([1, 7, 8, 11, 13, 15, 18, 22, 23, 24, 30, 32].indexOf(idxp) !== -1) {
        return 'F';
      }
      return 'T';
    },
    radioGroupChanged: function(evt){
      var selected_text, qidx;
      selected_text = evt.target.atext;
      qidx = parseInt(evt.target.qidx);
      this.answers[qidx] = {
        choice: evt.target.selected,
        text: selected_text,
        'class': evt.target.qclass,
        high: evt.target.highchoice
      };
      if (28 <= qidx && qidx <= 32) {
        return this.answers[qidx].oppidx = {
          28: 7,
          29: 11,
          30: 17,
          31: 2,
          32: 14
        }[qidx];
      }
    }
  });
}).call(this);
