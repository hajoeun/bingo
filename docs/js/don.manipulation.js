!function($) {
  // if (window.jQuery) window.jq = window.jQuery;
  var ___ = {};
  var slice = Array.prototype.slice;
  function _(func) {
    var parts1 = [], parts2 = [],
      parts = slice.call(arguments, 1),
      ___idx = parts.length;

    for (var i in parts)
      if (parts[i] == ___) ___idx = i;
      else if (i < ___idx) parts1.push(parts[i]);
      else parts2.push(parts[i]);

    return function() {
      var args1 = parts1.slice(), args2 = parts2.slice(),
        rest = slice.call(arguments);

      for (var i in args1) if (args1[i] == _) args1[i] = rest.shift();
      for (var i in args2) if (args2[i] == _) args2[i] = rest.pop();

      return func.apply(null, args1.concat(rest.concat(args2)));
    }
  }

  var documentElement = document.documentElement;

  function _is_win(obj) { return obj != null && obj == obj.window; }
  function _is_win_el_or_els(els) { return _is_win(els) || _is_win(els[0]) }
  function _get_win(els) { return _is_win_el_or_els(els) ? window : _check_doc(els) ? window : false; }
  function _is_document(obj) { return obj != null && obj.nodeType == 9; }
  function _check_doc(els) { return _is_document(els) || _is_document(els[0]) }
  function _is_el_or_els(els) { return _is_el(els) || _is_el(els[0]) }

  function _length(arr) { return arr == null ? undefined : arr.length; }
  function _is_object(obj) { return typeof obj == 'object' && !!obj; }
  function _keys(obj) { return _is_object(obj) ? Object.keys(obj) : []; }

  function _contains(list, value) {
    return find(list, function(val){return val == value}) != undefined;
  }

  function _each(arr, iter) {
    for (var i = 0, len = _length(arr); i < len; i++) iter(arr[i], i);
    return arr;
  }
  function _each2(obj, iter) {
    for (var i = 0, keys = _keys(obj), len = keys.length; i < len; i++) iter(obj[keys[i]], keys[i]);
    return obj;
  }
  function _eachr(arr, iter) {
    for (var i = _length(arr)-1; i > -1; i--) iter(arr[i], i);
    return arr;
  }
  function _map(arr, iter) {
    for (var res = [], i = 0, len = _length(arr); i < len; i++) res[i] = iter(arr[i], i);
    return res;
  }
  function _mapr(arr, iter) {
    for (var res = [], i = _length(arr)-1; i > -1; i--) res[i] = iter(arr[i], i);
    return res;
  }
  /*function _map2(coll, iter) {
   for (var res = [], i = 0, keys = _keys(coll), len = keys.length; i < len; i++)
   res[i] = iter(coll[keys[i]], keys[i]);
   return res;
   }*/
  function _find(arr, predi) {
    for (var i = 0, len = _length(arr); i < len; i++) if (predi(arr[i], i)) return arr[i];
    return undefined;
  }

  function _idtt(v) { return v; }

  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var _is_anf = _is_arr_like_not_form;
  function _is_arr_like_not_form(coll) {
    if (coll && coll.nodeType == 1) return false;
    var length = _length(coll);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX && !_is_win(coll);
  }

  function _flat(new_arr, arr, noDeep, start){
    _each(arr, function(v) {
      if (!_is_anf(v) || (!Array.isArray(v) && !(!!(v && v.callee)))) return new_arr.push(v);
      noDeep ? _each(v, function(v) { new_arr.push(v); }) : _flat(new_arr, v, noDeep);
    }, start);
    return new_arr;
  }
  function _flatten(arr, noDeep, start) { return _flat([], arr, noDeep, start); }

  function _is_fn(o) { return typeof o == 'function'; }
  function _is_str(o) { return typeof o == 'string'; }
  function _is_numeric(n) { return !isNaN(parseFloat(n)) && isFinite(n); }
  function _is_el(obj) { return !!(obj && obj.nodeType === 1) }

  function handle_class(method, class_name) {
    var is_fn = _is_fn(class_name);
    return function(el, i) {
      var val = is_fn ? class_name(i, el) : class_name;
      if (val)
        if (/\s/.test(val)) _each(val.split(" "), function(v) { el.classList[method](v); });
        else el.classList[method](val);
    }
  }
  $.add_class = $.addClass = function f(els, class_name) {
    if (arguments.length == 1) return _(f, _, els);
    var add_class = handle_class('add', class_name);
    _is_anf(els) ? _each(els, add_class) : add_class(els, 0);
    return els;
  };

  $.remove_class = $.removeClass = function f(els, class_name) {
    if (arguments.length == 1) return _(f, _, els);
    var remove_class = handle_class('remove', class_name);
    _is_anf(els) ? _each(els, remove_class) : remove_class(els, 0);
    return els;
  };

  $.has_class = $.hasClass = function f(els, class_name) {
    if (arguments.length == 1) return _(f, _, els);
    function some_class(el) { return el.classList.contains(class_name); }
    return _is_anf(els) ? (_find(els, some_class) !== undefined) : some_class(els);
  };

  $.toggle_class = $.toggleClass = function f(els, class_name) {
    if (arguments.length == 1) return _(f, _, els);
    var toggle_class = handle_class('toggle', class_name);
    _is_anf(els) ? _each(els, toggle_class) : toggle_class(els, 0);
    return els;
  };

  $.attr = function f(els, attr_value, attr_value) {
    if (_is_str(els)) return arguments.length == 1 ? _(f, _, els) : _(f, _, els, attr_value);
    if (_is_fn(attr_value)) {
      var exec_fn = function(el, i) { f(el, attr_value, attr_value(i, el.getAttribute(attr_value), el)) };
      return _is_anf(els) ? _each(els, exec_fn) : exec_fn(els), els;
    }

    if (arguments.length == 2) {
      var get_iter = function(el) {
        var value = el.getAttribute(attr_value);
        if (_is_numeric(value)) return parseFloat(value);
        if (value == "true") return true;
        if (value == "false") return false;
        if (value == "null") return null;
        return value;
      };
      return _is_anf(els) ? _map(els, get_iter) : get_iter(els);
    }

    if (attr_value == undefined) return els;

    var set_iter = function(el) { el.setAttribute(attr_value, attr_value); };
    return _is_anf(els) ? _each(els, set_iter) : set_iter(els), els;
  };

  var css_number = {
    "animationIterationCount": true,
    "columnCount": true,
    "fillOpacity": true,
    "flexGrow": true,
    "flexShrink": true,
    "fontWeight": true,
    "lineHeight": true,
    "opacity": true,
    "order": true,
    "orphans": true,
    "widows": true,
    "zIndex": true,
    "zoom": true
  };

  function _check_css_num (value, p_name) {
    if (_is_str(value)) return value;
    return css_number[p_name] ? value : value + "px"
  }

  $.css = function f(els, prop_name, prop_value) {
    var len = _length(arguments);
    if (els == undefined || els.length == 0) return [];
    if (!(_is_el(els) || _is_el(els[0]))) {
      if (len == 1) return _(f, _, els);
      return _(f, _, els, prop_name);
    }

    if (len == 2 && (_is_str(prop_name) || _is_anf(prop_name))) {
      var get_iter = _is_str(prop_name) ?
        function(el) { return el.ownerDocument.defaultView.getComputedStyle(el, null)[prop_name]; } :
        function(el) { return _map(prop_name, function(p) { return el.ownerDocument.defaultView.getComputedStyle(el, null)[p]; }) };
      return _is_anf(els) ? _map(els, get_iter) : get_iter(els);
    }

    var set_iter = len == 2 ?
      function(el) { _each2(prop_name, function(attr, name) { el.style[name] = _check_css_num(attr, name); }) } :
      function(el, i) {
        var val = _is_fn(prop_value) ? prop_value(i, el) : prop_value;
        if (val) el.style[prop_name] = _check_css_num(val, prop_name);
      };
    _is_anf(els) ? _each(els, set_iter) : set_iter(els);
    return els;
  };

  $.remove = function f(els, selector) {
    if (_is_str(els)) return _(f, _, els);
    if (selector) {
      var match_sel = function(el) { return el.matches(selector) };
      if (_is_anf(els)) els = els.filter(match_sel);
      else if (!match_sel(els)) return els;
    }

    var remove_child = function(el) { el.parentNode.removeChild(el); };
    _is_anf(els) ? _each(els, remove_child) : remove_child(els, 0);
    return els;
  };

  function make_set_iter(maybe_fn, prop) {
    return function(el, i) {
      var val = _is_fn(maybe_fn) ? maybe_fn(i, el[prop]) : maybe_fn;
      if (val) el[prop] = val;
    }
  }

  $.text = function f(els, text) {
    if (_is_str(els) || _is_fn(els)) return _(f, _, els);
    if (text == undefined)
      return _is_anf(els) ? _map(els, function(el) { return el.textContent; }) : els.textContent;

    var iter = make_set_iter(text, 'textContent');
    _is_anf(els) ? _each(els, iter) : iter(els, 0);
    return els;
  };

  $.html = function f(els, html) {
    if (_is_str(els) || _is_fn(els)) return _(f, _, els);
    if (html == undefined)
      return _is_anf(els) ? els[0].innerHTML : els.innerHTML;

    var iter = make_set_iter(html, 'innerHTML');
    _is_anf(els) ? _each(els, iter) : iter(els, 0);
    return els;
  };

  function _insert(type, reverse) {
    return function f(els, content) {
      if (arguments.length == 1) return _(f, _, els);

      var target = els, elem = content;
      if (reverse) { target = _is_str(content) ? document.querySelectorAll(content) : content, elem = els; }
      if (arguments.length > 2) { elem = _flatten(slice.call(arguments, 1)); }
      if (_is_fn(elem)) {
        var fn = elem, exec_fn = function(el, i) { f(el, fn(i, el.innerHTML)); };
        return _is_anf(target) ? _each(target, exec_fn) : exec_fn(target, 0), target;
      }
      if (elem == undefined) return els;
      if (_is_str(elem)) {
        if (/^<.*>.*/.test(elem)) {
          var insert_html = function(te) { te.insertAdjacentHTML(type, elem); };
          return _is_anf(target) ? _each(target, insert_html) : insert_html(target), target;
        }
        if (reverse) elem = document.querySelectorAll(elem);

        else {
          var insert_text = function(te) { te.insertAdjacentText(type, elem); };
          return _is_anf(target) ? _each(target, insert_text) : insert_text(target), target;
        }
      }
      if (_is_anf(elem)) {
        if (reverse) return _flatten(_map(elem, function(el) { return f(el, target) }));
        return _each(elem, function(el) { f(target, el) }), target;
      }

      var last = target.length-1 || 0,
        insert_elem = function(te, i) { return te.insertAdjacentElement(type, last == i ? elem : elem.cloneNode(true)) };

      if (reverse) return _is_anf(target) ? _map(target, insert_elem) : insert_elem(target, 0);
      return _is_anf(target) ? _each(target, insert_elem) : insert_elem(target, 0), target;
    }
  }

  $.before = _insert('beforebegin');
  $.after = _insert('afterend');
  $.prepend = _insert('afterbegin');
  $.append = _insert('beforeend');

  $.insert_before = $.insertBefore = _insert('beforebegin', true);
  $.insert_after = $.insertAfter = _insert('afterend', true);
  $.prepend_to = $.prependTo = _insert('afterbegin', true);
  $.append_to = $.appendTo = _insert('beforeend', true);

  // 기존 append가 훨씬 좋다. 첫번째 방법으로 가자, 코드를 조금만 더 다듬고 다른 녀석들에게 adjacent를 붙여주자

  $.append2 = _make_insert('append');
  $.appendTo2 = _make_insert('append', true);

  $.prepend2 = _make_insert('prepend');
  $.prependTo2 = _make_insert('prepend', true);

  $.after2 = _make_insert('after');
  $.insertAfter2 = _make_insert('after', true);

  $.before2 = _make_insert('before');
  $.insertBefore2 = _make_insert('before', true);

  function _make_insert(type, reverse) {

    var _insert = function(target, elem) {
      var last = target.length - 1 || 0;
      var fns = {
        append: function(te, i) { return te.appendChild(last == i ? elem : elem.cloneNode(true)) },
        prepend: function(te, i) { return te.insertBefore(last == i ? elem : elem.cloneNode(true), te.firstChild) },
        after: function(te, i) { return te.parentNode.insertBefore(last == i ? elem : elem.cloneNode(true), te.nextSibling) },
        before: function(te, i) { return te.parentNode.insertBefore(last == i ? elem : elem.cloneNode(true), te) }
      };

      if (_is_anf(target)) {
        if (reverse) return _map(target, fns[type]);
        _each(target, fns[type]);
      } else {
        fns[type](target, 0);
      }

      return reverse ? elem : target;
    };

    return function f(els, content) {
      if (arguments.length == 1) return _(f, _, els);

      var target = els, elem = content;
      if (reverse) target = _is_str(content) ? $(content) : content, elem = els;
      if (arguments.length > 2) elem = _flatten(slice.call(arguments, 1));

      if (_is_el(elem)) return _insert(target, elem);

      if (_is_fn(elem)) {
        var fn = elem, exec_fn = function(el, i) {
          if (reverse) return f(fn(i, el.innerHTML), el);
          f(el, fn(i, el.innerHTML));
        };
        return _is_anf(target) ? _each(target, exec_fn) : exec_fn(target, 0);
      }

      if (elem == undefined) return reverse ? elem : target;
      if (_is_str(elem)) {
        if (/^<.*>.*/.test(elem)) {
          var tmp = document.createElement('div');
          tmp.insertAdjacentHTML('afterbegin', elem);
          if (reverse) return f(_map(tmp.childNodes, _idtt), target);
          return f(target, _map(tmp.childNodes, _idtt));
        }
        if (reverse) elem = document.querySelectorAll(elem);
        else return _insert(target, document.createTextNode(elem));
      }

      if (_is_anf(elem)) {
        if (type == 'append') {
          if (reverse) return _flatten(_map(elem, function(el) { return f(el, target) }));
          _each(elem, function(el) { f(target, el) });
        } else {
          if (reverse) return _flatten(_mapr(elem, function(el) { return f(el, target) }));
          _eachr(elem, function(el) { f(target, el) });
        }
      }
      return reverse ? elem : target;
    }
  }

  var default_display = {};

  function _get_default_display(el) {
    var node_name = el.nodeName, display = default_display[node_name];

    if (display) return display;

    var temp, doc = el.ownerDocument;

    temp = doc.body.appendChild(doc.createElement(node_name));
    display = $.css(temp, 'display');
    temp.parentNode.removeChild(temp);

    if (display == 'none') display = 'block';

    return default_display[node_name] = display;
  }

  function _show_hide(show) {
    var show_hide;
    if (show) {
      show_hide = function(el) {
        if (el.style.display != 'none') {
          if (el.hidden) el.style.display = _get_default_display(el);
          return;
        }

        if (el._priv_display) el.style.display = el._priv_display;
        else el.style.display = '';
      };
    } else {
      show_hide = function(el) {
        if (el.style.display == 'none') return;
        if (el.style.display) el._priv_display = el.style.display;
        el.style.display = 'none';
      };
    }

    return function(els) {
      return _is_anf(els) ? _each(els, show_hide) : show_hide(els), els;
    };
  }

  $.show = _show_hide(true);
  $.hide = _show_hide(false);

  var is_hidden_within_tree = function(el) {
    return el.style.display == 'none' ||
      el.style.display == '' &&
      (el.ownerDocument && el.ownerDocument.contains(el)) &&
      $.css(el, 'display') == 'none';
  };

  $.toggle = function(els, state) {
    if (typeof state === "boolean") { return $[state ? 'show' : 'hide'](els); }

    var fn = function(el) { $[is_hidden_within_tree(el) ? 'show' : 'hide'](el); };
    return _is_anf(els) ? _each(els, fn) : fn(els);
  };

  $.clone = function(els) {
    var clone_node = function(el) { return el.cloneNode(true); };
    return _is_anf(els) ? _map(els, clone_node) : clone_node(els)
  };

  $.empty = function() {};

  function _check_boxSizing (el) {
    return $.css(el, "boxSizing") == "border-box"
  }
  //
  // function parseFloat (value) {
  //   return _is_str(value) ? value.split("px")[0] : value
  // }


  function _display_is_none (el) {
    return $.css(el, 'display') == "none"
  }
  function _lower_case_first_letter (str) {
    return str.charAt(0).toLowerCase() + str.slice(1)
  }

  function _upper_case_first_letter (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }


  function _key_val_arr_like(els, key) {
    return _is_anf(els) ? els.map(function(v) { return v[key] }) : els[key];
  }

  function wid_hei_fn(wid_hei_type, wid_hei, window_width_type) {

    function _get_doc_wid_hei(els, wid_hei) {
      var w_h = _upper_case_first_letter(wid_hei)
      var body = els.body || els[0].body;
      var html = els.documentElement || els[0].documentElement;
      return w_h == "width" ? Math.max( body.offsetWidth, body.scrollWidth, html.offsetWidth, html.offsetWidth, html.clientWidth )
        : Math.max( body.offsetHeight, body.scrollHeight, html.offsetHeight, html.offsetHeight, html.clientHeight )
    }

    function get_wid_hei_val (wid_hei_get, wid_hei_inner_outer, wid_hei, outer_margin_bool) {
      return function(el) {
        var left_top, right_bottom;
        if (wid_hei == "width") {
          left_top = "Left";
          right_bottom = "Right";
        } else {
          left_top = "Top";
          right_bottom = "Bottom";
        }

        var styles = window.getComputedStyle(el),
          width = _display_is_none(el) ? parseFloat(styles.width) : el.getBoundingClientRect()[wid_hei],
          borderLeft_Top = parseFloat(styles["border" + left_top + "Width"]),
          borderRight_Bottom = parseFloat(styles["border" + right_bottom + "Width"]),
          paddingLeft_Top = parseFloat(styles["padding" + left_top]),
          paddingRight_Bottom = parseFloat(styles["padding" + right_bottom]),
          res;

        switch (wid_hei_inner_outer) {
          case 1:
            var marginLeft_Top = parseFloat(styles["margin" + left_top]);
            var marginRight_Bottom = parseFloat(styles["margin" + right_bottom]);
            res = !wid_hei_get ? _check_boxSizing(el) ? 0 : - (paddingLeft_Top + paddingRight_Bottom + borderLeft_Top + borderRight_Bottom)
              : outer_margin_bool ? ( width + marginLeft_Top + marginRight_Bottom ) : ( width );
            break;
          case 2:
            res = wid_hei_get ? (width - borderLeft_Top - borderRight_Bottom)
              : _check_boxSizing(el) ? borderLeft_Top + borderRight_Bottom : - (paddingLeft_Top + paddingRight_Bottom);
            break;
          case 3:
            res = wid_hei_get ? (width - borderRight_Bottom - borderLeft_Top - paddingLeft_Top - paddingRight_Bottom)
              : _check_boxSizing(el) ? paddingLeft_Top + paddingRight_Bottom + borderLeft_Top + borderRight_Bottom : 0;
            break;
        }

        return res;
      }
    };

    // width_type 1: outer, 2: innerWidth, 3: width

    return function f(els, value) {
      if (!(_is_el_or_els(els) || _is_win_el_or_els(els) || _check_doc(els))) return _(f, _, els);

      var get_wid_hei = get_wid_hei_val(true, wid_hei_type, wid_hei, value);

      if (arguments.length == 1 || value == true) {
        if(_is_win_el_or_els(els)) return _key_val_arr_like(els, window_width_type);
        if (_check_doc(els)) return _get_doc_wid_hei(els, wid_hei);
        return _is_anf(els) ? els.map(get_wid_hei) : get_wid_hei(els);
      }

      function cal_width (el, value) {
        var res_val = get_wid_hei_val(false, wid_hei_type, wid_hei)(el) + parseFloat(value);
        var res = res_val < 0 ? 0 : res_val;
        el.style[wid_hei] = res + "px"
      }

      var set_width = _is_fn(value) ?
        function(el,i) {
          var val = value(i, get_wid_hei(el), el);
          if (val) cal_width(el, val)
        } :
        function(el) { cal_width(el, value) };

      return _is_anf(els) ? _each(els, set_width) : set_width(els), els;
    }

  };


  $.width = wid_hei_fn(3, "width", "innerWidth");
  $.innerWidth = wid_hei_fn(2, "width", "innerWidth");
  $.outerWidth = wid_hei_fn(1, "width", "clientWidth");

  $.height = wid_hei_fn(3, "height", "innerHeight");
  $.innerHeight = wid_hei_fn(2, "height", "innerHeight");
  $.outerHeight = wid_hei_fn(1, "height", "clientHeight");


  $.offsetParent = function f(els) {

    function offsetParent_iter(el) {
      var offsetParent = el.offsetParent;
      while (offsetParent && $.css( offsetParent, "position" ) === "static") {
        offsetParent = offsetParent.offsetParent;
      }
      return offsetParent || documentElement;
    }

    return _is_anf(els) ? _map(els, offsetParent_iter) : offsetParent_iter(els);
  }

  function is_node_name(el, name) {
    return el && el.nodeName && el.nodeName.toLowerCase() === name.toLowerCase();
  }

  $.position = function f(els) {

    function position_iter(el) {
      var offsetParent, offset, parentOffset = { top: 0, left: 0 };

      if ($.css( el, "position" ) === "fixed") {

        offset = el.getBoundingClientRect();

      } else {
        offsetParent = $.offsetParent(el);
        offset = $.offset(el);
        if (!is_node_name(offsetParent, "html")) {
          parentOffset = $.offset(offsetParent);
        }
        parentOffset = {
          top: parentOffset.top + offsetParent.clientTop,
          left: parentOffset.left + offsetParent.clientLeft
        };

      }
      return {
        top: offset.top - parentOffset.top - parseFloat($.css(el, "marginTop")) + documentElement.clientTop,
        left: offset.left - parentOffset.left - parseFloat($.css(el, "marginLeft")) + documentElement.clientLeft
      };
    }

    return _is_anf(els) ? _map(els, position_iter) : position_iter(els)
  };

  $.offset = function f(els, options) {

    // options : function or coordinates
    if (!_is_el_or_els(els)) return _(f, _, els);

    //setoffset
    if (options) {

      function offset_iter_set (el, i) {
        if (_is_fn(options)) return f(el, options(i, offset_iter_get(el), el));

        var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
          position = $.css(el, "position"),
          props = {};

        if (position === "static") {
          el.style.position = "relative";
        }

        curOffset = $.offset(el);
        curCSSTop = $.css(el, "top");
        curCSSLeft = $.css(el, "left");
        calculatePosition = (position === "absolute" || position === "fixed") && (curCSSTop + curCSSLeft).indexOf("auto") > -1;

        if (calculatePosition) {
          curPosition = $.position(el);
          curTop = curPosition.top;
          curLeft = curPosition.left;

        } else {
          curTop = parseFloat(curCSSTop) || 0;
          curLeft = parseFloat(curCSSLeft) || 0;
        }

        if (options.top != null) {
          props.top = (options.top - curOffset.top) + curTop;
        }
        if (options.left != null) {
          props.left = (options.left - curOffset.left) + curLeft;
        }

        return $.css(el, props), el;
      }
      return _is_anf(els) ? _map(els, offset_iter_set) : offset_iter_set(els)
    }

    function offset_iter_get (el) {
      var rect = el.getBoundingClientRect();
      if (rect.width || rect.height) {
        var doc = el.ownerDocument;
        var win = _get_win(doc);
        var docElem = doc.documentElement;

        return {
          top: rect.top + win.pageYOffset - docElem.clientTop,
          left: rect.left + win.pageXOffset - docElem.clientLeft
        };
      }
      return { top: 0, left: 0 };
    }

    return _is_anf(els) ? _map(els, offset_iter_get) : offset_iter_get(els)

  };

  function parse_int_only_numeric(n) {
    return _is_numeric(n) ? parseFloat(n) : n;
  }
  function push_map (list, iter) {
    var res = [];
    var val;
    for (var i=0; i < list.length; i++) {
      if (val = iter(list[i], i, list)) res.push(val)
    }
    return res;
  }

  function _contains (list, value) {
    return _find(list, function(val) {return val == value}) ? true : false
  }

  $.val = function f(els, value) {
    if (!_is_el_or_els(els)) return _(f, _, els);

    if (arguments.length == 1) {
      function get_iter(el) {
        if (is_node_name(el, "select")) {

          function select_iter(el) { return el.selected && el.value }
          return push_map(el.options, select_iter);

        } else if (el.type == "radio" || el.type == "number") {

          return parse_int_only_numeric(el.value);

        } else {
          var ret = el.value;
          // Handle most common string cases
          if (typeof ret === "string") {
            return ret.replace(/\r/g, "");
          }

          return ret == null ? "" : ret;
        }
      }
      return _is_anf(els) ? _map(els, get_iter) : get_iter(els);
    }

    function set_iter(el, i){
      if (_is_fn(value)) return f(el, value(i, f(el), el));

      var val = value;
      if (value == null) {
        val = "";
      } else if (typeof value === "number") {
        val += "";
      }

      if ((el.type == "radio" || el.type == "checkbox") && Array.isArray(value)) {
        el.checked = _is_str(_find(value, function(val) {return val == el.value}))
        return;
      } else if (is_node_name(el, "select")) {
        if (Array.isArray(value)) {

          var list = value;
          _each(el.options, function(option) {
            option.selected = _contains(list, option.value);
          });
          return;
        } else {
          _each(el.options, function(option) {
            option.selected = option.value == value ? true : false;
          });
          return;
        }
      }
      el.value = val;
    }

    return _is_anf(els) ? _each(els, set_iter) : set_iter(els, 0), els
  }




  function _scroll_fn (el, val, prop, method) {
    var top = prop == "pageYOffset" ? true : false;
    var win = _get_win( el );
    if (val == undefined) return win ? win[ prop ] : el[ method ];
    if (win) {
      win.scrollTo(
        !top ? val : win.pageXOffset,
        top ? val : win.pageYOffset
      );
    } else {
      el[method] = val;
    }
    return el
  }

  $.el = function f(html) {
    if (/^</.test(html)) {
      var div = document.createElement('div');
      div.innerHTML = html;
      return div.children;
    } else {
      return document.createElement(html);
    }
  };

  $.frag = function f(html) {
    var docFrag = document.createDocumentFragment();
    if (/^</.test(html)) {
      var div = document.createElement('div');
      div.innerHTML= html;
      var len = div.children.length
      for (var i=0; i<len; i++) {
        docFrag.appendChild(div.children[0]);
      }
    } else {
      var some = document.createElement(html);
      docFrag.append(some);
    }

    return docFrag;
  };

  $.scrollTop = function f(el, val) {
    if(!(_is_el(el) || _is_win(el) || _is_document(el))) return _(f, _, el);
    return _scroll_fn(el, val, "pageYOffset", "scrollTop");
  }

  $.scrollLeft = function f(el, val) {
    if(!(_is_el(el) || _is_win(el) || _is_document(el))) return _(f, _, el);
    return _scroll_fn(el, val, "pageXOffset", "scrollLeft");
  }

}(D);
