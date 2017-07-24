!function($) {
  var data_check, u_num = 2, b_num = 2, isChecked = e => e.classList.contains('checked');

  _.go($('body'),
    $.on('click', 'button#start', function() {
      b_num = $.val($('input[name="b_num"]'));
      u_num = $.val($('input[name="u_num"]'));
      data_check = game_start(u_num, b_num);
      $.text($('#goal'), b_num);
      $.hide($('.before_start'));
      $.show($('.after_start'));
    }),

    $.on('click', 'button#pop', function() {
      _.go('.admin_board td',
        $,
        _.reject(isChecked),
        _.shuffle, _.first,
        $.trigger('click'));
    }),

    $.on('click', 'button#restart', function() {
      $.remove($('table'));
      $.off($('button#reset'), 'click');
      $.empty($('#goal'));
      $.toggle($('.input_group div'))
    }),

    $.on('click', 'button#reset', function() {
      _.go('td.checked', $,
        $.remove_class('checked line'),
        _.c(data_check.user_datas),
        _.each(d => {
          d.bingo = false;
          d.line = { x1: false, x2: false, total: 0 };
        }));
    })
  );

  function game_start(u_num, b_num) {
    var admin_data = [], user_datas = [], game_done = false;

    var keep_data = data =>
      _.tap($,
        $.find('td'),
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
    };

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
      `), $.el);

    var make_user_board = __(
      _.shuffle, make_bingo,
      cut, make_bingo_table,
      keep_data(user_datas),
      $.appendTo($('.user_board')));

    var addLine = __($, $.addClass('line')),
        xLine1 = (c, i) => c[i],
        xLine2 = (c, i, l) => c[l.length-1-i];

    var make_admin_board = __(
      make_bingo, make_bingo_table,
      keep_data(admin_data),
      $.on('click', 'td', function() {
        $.addClass(this, 'checked');
        var targetText = this.innerText,
            idx = find_idx(targetText);

        _.each(user_datas, (data, i) => {
          _.each(data[idx], (td, i, col_tds) => {
            if (td.innerText == targetText) {
              var $td = $(td),
                  $row_tds = _.go($td, $.closest('tr'), $.find('td'));
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

          if (!data.bingo && (b_num == data.line.total)) {
            alert("User " + (i+1) + " BINGO!");
            data.bingo = game_done = true;
          }
        })
      }),
      $.appendTo($('.admin_board')));

  _.all(
      base_arr,
      _.go(
        _.range(u_num),
        _.map(_.c(make_user_board)),
        ubs => [make_admin_board].concat(ubs)));

  return { user_datas: user_datas, admin_data: admin_data };
  }
}(D);