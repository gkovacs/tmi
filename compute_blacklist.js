(function(){
  var fs, worker_ids;
  fs = require('fs');
  worker_ids = fs.readFileSync('worker_ids.txt', 'utf-8');
  console.log(worker_ids.split('\n').map(function(x){
    return x.trim();
  }).filter(function(x){
    return x.length > 0;
  }));
}).call(this);
