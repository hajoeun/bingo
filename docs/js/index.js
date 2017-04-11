var m_bingo = function(arr) {
  return _.groupBy(arr, function(num) {
    if (num <= 15) return "B";
    if (num <= 30) return "I";
    if (num <= 45) return "N";
    if (num <= 60) return "G";
    return "O";
  });
}

var m_bingo2 = _.reduce((o, n) => {
  if (n <= 15) return o['B'].push(n), o;
  if (n <= 30) return o['I'].push(n), o;
  if (n <= 45) return o['N'].push(n), o;
  if (n <= 60) return o['G'].push(n), o;
  return o['O'].push(n), o;
}, _.obj(['B', 'I', 'N', 'G', 'O'], [[],[],[],[],[]]));


var cut = _.reduce((o, v, k) => (o[k] = _.first(v, 5), o), {})

var m_arr = () => {
  var arr = new Array(75), i = 0;
  while (i < 75) arr[i++] = i;

  return arr;
}

var bingo = __(m_arr, m_bingo2)
var m_bingo_board2 = __(m_arr, _.shuffle, m_bingo2, cut)

console.log(
  
)