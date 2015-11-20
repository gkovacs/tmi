(function(){
  Polymer({
    is: 'front-page',
    properties: {
      experiment_list: {
        type: Array,
        value: [
          {
            title: 'How stereotypical is my Facebook profile?',
            icon: 'stereotypical_icon.svg',
            available: 'Now'
          }, {
            title: 'How popular am I?',
            icon: 'popularity_icon.svg',
            available: 'Now'
          }, {
            title: 'How addicted am I to email?',
            icon: 'email_icon.svg',
            available: '2 weeks'
          }, {
            title: 'How addicted am I to social media?',
            icon: 'facebook_icon.svg',
            available: '2 weeks'
          }, {
            title: 'Who is more sexist: me or my friends?',
            icon: 'sexism_icon.svg',
            available: '2 weeks'
          }, {
            title: 'Who is more racist: me or my friends?',
            icon: 'racism_icon.svg',
            available: '2 weeks'
          }, {
            title: 'How fake is my Facebook profile?',
            icon: 'fake_icon.svg',
            available: '2 weeks'
          }, {
            title: 'How much do I contribute to the Internet?',
            icon: 'contribute_icon.svg',
            available: '2 weeks'
          }, {
            title: 'How much time do I spend slacking off?',
            icon: 'slacking_icon.svg',
            available: '2 weeks'
          }, {
            title: 'What words do I overuse?',
            icon: 'chatting_icon.svg',
            available: '2 weeks'
          }, {
            title: 'What dialect of English do I most resemble?',
            icon: 'dialect_icon.svg',
            available: '2 weeks'
          }, {
            title: 'How sophisticated is the language I read and write online?',
            icon: 'graduate_icon.svg',
            available: '2 weeks'
          }, {
            title: 'How smart am I compared to my Facebook friends?',
            icon: 'brain_icon.svg',
            available: '2 weeks'
          }, {
            title: 'How multicultural am I?',
            icon: 'culture_icon.svg',
            available: '2 weeks'
          }, {
            title: 'Which foreign countries do my interests best match?',
            icon: 'eiffel_tower_icon.svg',
            available: '2 weeks'
          }, {
            title: 'Which professions do my interests best match?',
            icon: 'gears_icon.svg',
            available: '2 weeks'
          }, {
            title: 'Which college major do my interests best match?',
            icon: 'degree_icon.svg',
            available: '2 weeks'
          }
        ]
      }
    }
    /*
    properties: {
      experiment_list: Array
    }
    ready: ->
      self = this
      experiment_list_text <- $.get 'experiment_list.yaml'
      self.experiment_list = jsyaml.safeLoad experiment_list_text
    */
  });
}).call(this);
