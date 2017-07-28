!function($) {
  var u_num = 2, b_num = 2, admin_data = [], user_datas = [], game_done = false, base_arr = _.go(76, _.range, _.rest);

  var keep_data = data =>
    _.tap($,
      $.find('td'),
      _.reduce((l, d, i) => {
        var idx = i % 5;
        return l[idx] ? l[idx].push(d) : l[idx] = [d], l;
      }, []),
      o => (o.line = { x1: false, x2: false, total: 0 }, o.bingo = false, data.push(o)))

    , reduce_first_5 = _.reduce((l, v, i) => (l[i] = _.first(v, 5), l), [])
    , isChecked = D.has_class('checked')
    , find_idx = n => {
      var i = 4;
      if (n <= 15) i = 0;
      else if (n <= 30) i = 1;
      else if (n <= 45) i = 2;
      else if (n <= 60) i = 3;
      return i;
    }
    , addLine = __($, $.add_class('line'))
    , xLine1 = (c, i) => c[i]
    , xLine2 = (c, i, l) => c[l.length-1-i];


  var make_bingo = function(arr) {
    return arr.reduce(function(o, n) {
      var i = find_idx(n);
      return o[i].push(n), o;
    }, [[],[],[],[],[]])}

    , make_bingo_table = __(
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
      `), $.el)

    , make_user_board = __(
      _.shuffle, make_bingo,
      reduce_first_5, make_bingo_table,
      keep_data(user_datas),
      $.appendTo('.user_board'))

    , make_admin_board = __(
      make_bingo, make_bingo_table,
      keep_data(admin_data),
      $.appendTo('.admin_board'));


  var game_start = function(src) {
    var fns = _.go(
      _.range(u_num),
      _.map(_.c(make_user_board)),
      ubs => [make_admin_board].concat(ubs));
    _.all(src, fns);
  };

  _.go($('body'),

    $.on('click', 'button#start', function() {
      b_num = $.val($('input[name="b_num"]'));
      u_num = $.val($('input[name="u_num"]'));
      game_start(base_arr);
      $.text($('#goal'), b_num);
      $.toggle($('.input_group div'));
    }),

    $.on('click', 'button#pop', function() {
      _.go('.admin_board td', $,
        _.reject(isChecked),
        _.shuffle, _.first,
        $.trigger('click'));
    }),

    $.on('click', 'button#auto', function() {
      var autoId = setInterval(function() {
        $.trigger($('button#pop'), 'click');
        if (game_done) clearInterval(autoId);
      }, 200);

      $.attr(this, 'disabled', true);
    }),

    $.on('click', 'button#restart', function() {
      $.remove($('table'));
      $.empty($('#goal'));
      $.toggle($('.input_group div'));

      $.remove_attr($('button#auto'), 'disabled');
      game_done = false;
    }),

    $.on('click', 'button#reset', function() {
      _.go('td.checked', $,
        $.remove_class('checked line'),
        _.c(user_datas),
        _.each(d => {
          d.bingo = false;
          d.line = { x1: false, x2: false, total: 0 };
        }));

      $.remove_attr($('button#auto'), 'disabled');
      game_done = false;
    }),

    $.on('click', 'td', function() {
      $.addClass(this, 'checked');

      var targetText = this.innerText, idx = find_idx(targetText);

      _.each(user_datas, (data, i) => {
        _.each(data[idx], (td, i, col_tds) => {
          if (td.innerText == targetText) {
            var $td = $(td), $row_tds = _.go($td, $.closest('tr'), $.find('td'));
            $.addClass($td, 'checked');

            if (_.every($row_tds, isChecked)) {
              _.each($row_tds, addLine);
              data.line.total++;
            }

            if (_.every(col_tds, isChecked)) {
              _.each(col_tds, addLine);
              data.line.total++;
            }
          }
        });

        if (!data.line.x1 && _.every(data, __(xLine1, isChecked))) {
          _.each(data, __(xLine1, addLine));
          data.line.total++;
          data.line.x1 = true;
        }

        if (!data.line.x2 && _.every(data, __(xLine2, isChecked))) {
          _.each(data, __(xLine2, addLine));
          data.line.total++;
          data.line.x2 = true;
        }

        if (!data.bingo && (b_num <= data.line.total)) {
          alert("User " + (i+1) + " BINGO!");
          data.bingo = game_done = true;
        }
      })
    })
  );
}(D);