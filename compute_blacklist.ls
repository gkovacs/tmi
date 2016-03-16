require! {
  fs
}

worker_ids = fs.readFileSync 'worker_ids.txt', 'utf-8'
console.log worker_ids.split('\n').map((x) -> x.trim()).filter((x) -> x.length > 0)