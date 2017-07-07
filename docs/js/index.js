!function() {

// var u_num = prompt("몇명이 플레이 하시나요?");
// var b_num = prompt("몇 빙고로 할까요?");

// game_start(u_num || 2,  b_num || 2);

game_start(2, 2);

function game_start(u_num, b_num) {
  var admin_data = [], user_datas = [];

  var keep_data = data => 
    _.tap($, 
      _('find', 'td'),
      _.reduce((l, d, i) => {
        var idx = i % 5;
        return l[idx] ? l[idx].push(d) : l[idx] = [d], l; 
      }, []),
      o => (o.line = { x1: false, x2: false, total: 0 }, o.bingo = false, data.push(o)));

  var cut = _.reduce((l, v, i) => (l[i] = _.first(v, 5), l), []);

  var find_idx = n => {
    var i = 4;
    if (n <= 15) i = 0;
    else if (n <= 30) i = 1;
    else if (n <= 45) i = 2;
    else if (n <= 60) i = 3;
    return i;
  }

  var make_bingo = __(
    _.reduce((o, n) => {
      var i = find_idx(n);
      return o[i] = o[i].concat(n), o;
    }, [[],[],[],[],[]]));

  var base_arr = _.go(76, _.range, _.rest);

  var make_bingo_table = __(
    _.unzip,
    _.t('data', `
      table 
        tr
          th B
          th I
          th N
          th G
          th O {{ _.go(data, `, _.teach('d1', `
        tr {{ _.go(d1, `, _.teach('d2',`
          td {{d2}}
        `),`)}}`), 
      `)}}
    `), $);

  var make_user_board = __(
    _.shuffle, make_bingo,
    cut, make_bingo_table, 
    keep_data(user_datas),
    $t => $('.user_board').append($t));

  var make_admin_board = _.once(__(
    make_bingo, make_bingo_table,
    keep_data(admin_data),
    _('on', 'click', 'td', function() {
      $(this).addClass('checked');
      var targetText = this.innerText, idx = find_idx(targetText);
    
      _.each(user_datas, (data, i) => {
        var isChecked = td => $(td).hasClass('checked'), 
            addLine = td => $(td).addClass('line'),
            xLine1 = (c, i) => c[i],
            xLine2 = (c, i, l) => c[l.length-1-i];

        _.each(data[idx], (td, i, col_tds) => {
          if (td.innerText == targetText) {
            var $td = $(td), $row_tds = $td.closest('tr').find('td');

            $td.addClass('checked');
            
            if (_.every($row_tds, isChecked)) 
              _.each($row_tds, addLine), data.line.total++;

            if (_.every(col_tds, isChecked))
              _.each(col_tds, addLine), data.line.total++;
          }
        })

        if (!data.line.x1 && _.every(data, __(xLine1, isChecked))) {
          _.each(data, __(xLine1, addLine)), data.line.total++
          data.line.x1 = true;
        }

        if (!data.line.x2 && _.every(data, __(xLine2, isChecked))) {
          _.each(data, __(xLine2, addLine)), data.line.total++;
          data.line.x2 = true;
        }

        if (!data.bingo && (b_num == data.line.total)) {
          alert("User ", i+1, " BINGO!");
          data.bingo = true;
        }
      })
    }),
    $t => $('.admin_board').append($t)));

  _.all(base_arr,[make_admin_board].concat(_.map(_.range(u_num), _.c(make_user_board))));
}

}()