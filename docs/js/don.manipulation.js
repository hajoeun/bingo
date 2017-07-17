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

  function _length(arr) { return arr == null ? undefined : arr.length; }
  function _is_object(obj) { return typeof obj == 'object' && !!obj; }
  function _keys(obj) { return _is_object(obj) ? Object.keys(obj) : []; }
  function _each(arr, iter) {
    for (var i = 0, len = _length(arr); i < len; i++) iter(arr[i], i);
    return arr;
  }
  function _each2(obj, iter) {
    for (var i = 0, keys = _keys(obj), len = keys.length; i < len; i++) iter(obj[keys[i]], keys[i]);
    return obj;
  }
  function _map(arr, iter) {
    for (var res = [], i = 0, len = _length(arr); i < len; i++) res[i] = iter(arr[i], i);
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

  function _flat(new_arr, arr, noDeep, start){
    _each(arr, function(v) {
      if (!_is_arr_like(v) || (!Array.isArray(v) && !(!!(v && v.callee)))) return new_arr.push(v);
      noDeep ? _each(v, function(v) { new_arr.push(v); }) : _flat(new_arr, v, noDeep);
    }, start);
    return new_arr;
  }
  function _flatten(arr, noDeep, start) { return _flat([], arr, noDeep, start); }

  function _is_fn(o) { return typeof o == 'function'; }
  function _is_str(o) { return typeof o == 'string'; }

  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  function _is_arr_like(coll) {
    var length = _length(coll);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX && !_is_win(coll);
  }
  function _is_numeric(n) { return !isNaN(parseFloat(n)) && isFinite(n); }
  function _is_el(obj) { return !!(obj && obj.nodeType === 1) }

  function handle_class(method, className) {
    return function(el, i) {
      var val = _is_fn(className) ? className(i, el) : className;
      if (val) el.classList[method](val);
    }
  }
  $.add_class = $.addClass = function f(els, className) {
    if (arguments.length == 1) return _(f, _, els);
    var add_class = handle_class('add', className);
    _is_arr_like(els) ? _each(els, add_class) : add_class(els, 0);
    return els;
  };

  $.remove_class = $.removeClass = function f(els, className) {
    if (arguments.length == 1) return _(f, _, els);
    var remove_class = handle_class('remove', className);
    _is_arr_like(els) ? _each(els, remove_class) : remove_class(els, 0);
    return els;
  };

  $.has_class = $.hasClass = function f(els, className) {
    if (arguments.length == 1) return _(f, _, els);
    function some_class(el) { return el.classList.contains(className); }
    return _is_arr_like(els) ? (_find(els, some_class) !== undefined) : some_class(els);
  };

  $.toggle_class = $.toggleClass = function f(els, className) {
    if (arguments.length == 1) return _(f, _, els);
    var toggle_class = handle_class('toggle', className);
    _is_arr_like(els) ? _each(els, toggle_class) : toggle_class(els, 0);
    return els;
  };

  $.attr = function f(els, attrName, attrValue) {
    if (_is_str(els)) return arguments.length == 1 ? _(f, _, els) : _(f, _, els, attrName);
    if (_is_fn(attrValue)) {
      var exec_fn = function(el, i) { f(el, attrName, attrValue(i, el.getAttribute(attrName), el)) };
      return _is_arr_like(els) ? _each(els, exec_fn) : exec_fn(els), els;
    }

    if (arguments.length == 2) {
      var get_iter = function(el) {
        var value = el.getAttribute(attrName);
        if (_is_numeric(value)) return parseFloat(value);
        if (value == "true") return true;
        if (value == "false") return false;
        if (value == "null") return null;
        return value;
      };
      return _is_arr_like(els) ? _map(els, get_iter) : get_iter(els);
    }

    if (attrValue == undefined) return els;

    var set_iter = function(el) { el.setAttribute(attrName, attrValue); };
    return _is_arr_like(els) ? _each(els, set_iter) : set_iter(els), els;
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

  $.css = function f(els, propName, propValue) {
    var len = _length(arguments);
    if (els == undefined || els.length == 0) return [];
    if (!(_is_el(els) || _is_el(els[0]))) {
      if (len == 1) return _(f, _, els);
      return _(f, _, els, propName);
    }

    if (len == 2 && (_is_str(propName) || _is_arr_like(propName))) {
      var get_iter = _is_str(propName) ?
        function(el) { return el.ownerDocument.defaultView.getComputedStyle(el, null)[propName]; } :
        function(el) { return _map(propName, function(p) { return el.ownerDocument.defaultView.getComputedStyle(el, null)[p]; }) };
      return _is_arr_like(els) ? _map(els, get_iter) : get_iter(els);
    }

    var set_iter = len == 2 ?
      function(el) { _each2(propName, function(attr, name) { el.style[name] = _check_css_num(attr, name); }) } :
      function(el, i) {
        var val = _is_fn(propValue) ? propValue(i, el) : propValue;
        if (val) el.style[propName] = _check_css_num(val, propName);
      };
    _is_arr_like(els) ? _each(els, set_iter) : set_iter(els);
    return els;
  };

  $.remove = function f(els, selector) {
    if (_is_str(els)) return _(f, _, els);
    if (selector) {
      var match_sel = function(el) { return el.matches(selector) };
      if (_is_arr_like(els)) els = els.filter(match_sel);
      else if (!match_sel(els)) return els;
    }

    var remove_child = function(el) { el.parentNode.removeChild(el); };
    _is_arr_like(els) ? _each(els, remove_child) : remove_child(els, 0);
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
      return _is_arr_like(els) ? _map(els, function(el) { return el.textContent; }) : els.textContent;

    var iter = make_set_iter(text, 'textContent');
    _is_arr_like(els) ? _each(els, iter) : iter(els, 0);
    return els;
  };

  $.html = function f(els, html) {
    if (_is_str(els) || _is_fn(els)) return _(f, _, els);
    if (html == undefined)
      return _is_arr_like(els) ? els[0].innerHTML : els.innerHTML;

    var iter = make_set_iter(html, 'innerHTML');
    _is_arr_like(els) ? _each(els, iter) : iter(els, 0);
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
        return _is_arr_like(target) ? _each(target, exec_fn) : exec_fn(target, 0), els;
      }
      if (elem == undefined) return els;
      if (_is_str(elem)) {
        if (/^<.*>.*<\/.*>$/.test(elem)) {
          var insert_html = function(te) { te.insertAdjacentHTML(type, elem); };
          return _is_arr_like(target) ? _each(target, insert_html) : insert_html(target), target;
        }
        if (reverse) elem = document.querySelectorAll(elem);
        else {
          var insert_text = function(te) { te.innerText += elem; };
          return _is_arr_like(target) ? _each(target, insert_text) : insert_text(target), target;
        }
      }
      if (_is_arr_like(elem)) return _each(elem, function(el) { f(target, el) });

      var last = target.length-1 || 0,
        insert_elem = function(te, i) { te.insertAdjacentElement(type, last == i ? elem : elem.cloneNode(true)) };
      return _is_arr_like(target) ? _each(target, insert_elem) : insert_elem(target, 0), target;
    }
  }

  $.before = _insert('beforebegin');
  $.after = _insert('afterend');
  $.prepend = _insert('afterbegin');
  $.append = _insert('beforeend');

  $.insertBefore =  $.insert_before = _insert('beforebegin', true);
  $.insertAfter = $.insert_after = _insert('afterend', true);
  $.prependTo = $.prepend_to = _insert('afterbegin', true);
  $.appendTo = $.append_to =_insert('beforeend', true);

  function _is_win(obj) { return obj != null && obj == obj.window; }
  function _is_document(obj) { return obj != null && obj.nodeType == 9; }
  function _check_win(els) { return _is_win(els) || _is_win(els[0]) }
  function _check_doc(els) { return _is_document(els) || _is_document(els[0]) }
  function _check_el(els) { return _is_el(els) || _is_el(els[0]) }
  function _get_method_val(els, method) { return _is_arr_like(els) ? els.map(function(v){ return v[method] }) : els[method]; }
  function _get_doc_wid_hei(els, wid_hei) {
    var body = els.body || els[0].body;
    var html = els.documentElement || els[0].documentElement;
    return Math.max(
      body["offset" + wid_hei], body["scroll" + wid_hei],
      html["offset" + wid_hei], html["offset" + wid_hei], html["client" + wid_hei]
    );
  }

  function _check_boxSizing (el) {
    return $.css(el, "boxSizing") == "border-box"
  }

  function _px_to_num (value) {
    return _is_str(value) ? value.split("px")[0] : value
  }



  function width_iter (wid_hei_get, wid_hei_inner_outer, wid_hei, outer_margin_bool) {
    return function(el) {
      var left_top, right_bottom;
      if (wid_hei == "Width") {
        left_top = "Left"
        right_bottom = "Right"
      } else {
        left_top = "Top";
        right_bottom = "Bottom"
      }

      var styles = window.getComputedStyle(el);
      var width = el["offset" + wid_hei];
      function get_width_for_set(when_box_sizing) { return _check_boxSizing(el) ? ( when_box_sizing ) : (0) }

      if (wid_hei_inner_outer == 1) {
        // outer

        var marginLeft_Top = parseFloat(styles["margin" + left_top]);
        var marginRight_Bottom = parseFloat(styles["margin" + right_bottom]);
        return !wid_hei_get ? get_width_for_set( 0 ) : outer_margin_bool ? ( width + marginLeft_Top + marginRight_Bottom ) : ( width );
      }

      var borderLeft_Top = parseFloat(styles["border" + left_top + "Width"]);
      var borderRight_Bottom = parseFloat(styles["border" + right_bottom + "Width"]);

      if (wid_hei_inner_outer == 2) {

        // innerWidth
        return wid_hei_get ? ( width - borderLeft_Top - borderRight_Bottom)
          : get_width_for_set( borderLeft_Top + borderRight_Bottom );
      }

      var paddingLeft_Top = parseFloat(styles["padding" + left_top]);
      var paddingRight_Bottom = parseFloat(styles["padding" + right_bottom]);

      if (wid_hei_inner_outer == 3) {
        // width
        return wid_hei_get ? ( width - borderRight_Bottom - borderLeft_Top - paddingLeft_Top - paddingRight_Bottom )
          : get_width_for_set( paddingLeft_Top + paddingRight_Bottom + borderLeft_Top + borderRight_Bottom );
      }
      // el.clientWidth; + padding
      // el.getBoundingClientRect().width; +padding + border

    }
  };

  function _lower_case_first_letter (str) {
    return str.charAt(0).toLowerCase() + str.slice(1)
  }





  function all_width_fn(type_fn, els, value, width_type, wid_hei, window_width_type, args_len) {
    // width_type 1: outer, 2: innerWidth, 3: width

    if ( !(_check_el(els) || _check_win(els) || _check_doc(els)) ) {
      return _(type_fn, _, els);
    }

    var get_width = width_iter(true, width_type, wid_hei, value)


    if (args_len == 1 || value == true) {
      // console.log(get_width(els))
      if(_check_win(els)) return _get_method_val(els, window_width_type);
      if (_check_doc(els)) return _get_doc_wid_hei(els, wid_hei);
      return _is_arr_like(els) ? els.map(get_width) : get_width(els);
    }

    function cal_width (el, value) {

      el.style[_lower_case_first_letter(wid_hei)] = width_iter(false, width_type, wid_hei)(el) + _px_to_num(value) + "px" }

    var set_width = _is_fn(value) ?
      function(el,i) {
        var val = value(i, get_width(el), el);
        if (val) cal_width(el, val)
      } :
      function(el) { cal_width(el, value) };

    return _is_arr_like(els) ? els.forEach(set_width) : set_width(els), els;
  };






  $.width = function f(els, value) {
    return all_width_fn($.width, els, value, 3, "Width", "innerWidth",  arguments.length);
  };

  $.innerWidth = function f(els, value) {
    return all_width_fn($.innerWidth, els, value, 2, "Width", "innerWidth",  arguments.length);
  };

  $.outerWidth = function f(els, value) {
    return all_width_fn($.outerWidth, els, value, 1, "Width", "clientWidth",  arguments.length);
  };

  $.height = function f(els, value) {

    return all_width_fn($.height, els, value, 3, "Height", "innerHeight",  arguments.length);
  };
  $.innerHeight = function f(els, value) {

    return all_width_fn($.innerHeight, els, value, 2, "Height", "innerHeight",  arguments.length);
  };

  $.outerHeight = function f(els, value) {

    return all_width_fn($.outerHeight, els, value, 1, "Height", "clientHeight",  arguments.length);
  };




  $.position = function f(els) {

    function position_iter (el) {
      return { left: el.offsetLeft, top: el.offsetTop }
    }

    return _is_arr_like(els) ? _map(els, position_iter) : position_iter(els)
  };

  $.offset = function f(els) {

    function offset_iter (el) {
      var box = el.getBoundingClientRect();
      return {
        top: box.top + window.pageYOffset - document.documentElement.clientTop,
        left: box.left + window.pageXOffset - document.documentElement.clientLeft
      };
    }
    return _is_arr_like(els) ? _map(els, offset_iter) : offset_iter(els)

  };

  $.scrollTop = function f(win) {
    if(win !== window) return;
    return (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
  }

}(D);
