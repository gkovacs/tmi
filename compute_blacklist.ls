require! {
  fs
}

make_unique = (list) ->
  output = []
  output_set = {}
  for x in list
    if not output_set[x]?
      output_set[x] = true
      output.push x
  return output

worker_ids = fs.readFileSync 'worker_ids.txt', 'utf-8'
console.log 'blacklist = ' + JSON.stringify(make_unique(worker_ids.split('\n').map((x) -> x.trim()).filter((x) -> x.length > 0)))
