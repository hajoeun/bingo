!function($) {
  // if (window.jQuery) window.jq = window.jQuery;
  var classOnly = /^\.([\w\-]+)$/
    , idOnly = /^#([\w\-]+)$/;
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
    if (arguments.length == 2) {
      var get_iter = function(el) {
        var value = el.getAttribute(attrName);
        if (_is_numeric(value)) return parseFloat(value);
        if (value == "true") return true;
        if (value == "false") return false;
        if (value == "null") return null;
        return value;
      };
      return _is_arr_like(els) ? _map(els, get_iter) : get_iter(els, 0);
    }

    var set_iter = function(el, i) {
      var value = attrValue;
      if (_is_fn(value)) value = value(i, el.getAttribute(attrName), el);
      if (value !== undefined) el.setAttribute(attrName, value);
    };
    _is_arr_like(els) ? _each(els, set_iter) : set_iter(els, 0);
    return els
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
      var byClass = selector.match(classOnly), byId = selector.match(idOnly);
      function sel_match(el) {
        if (byClass) return el.classList.contains(byClass[1]);
        if (byId) return el.id == byId[1];
        return el.nodeName == selector.toUpperCase();
      }
      if (_is_arr_like(els)) els = els.filter(sel_match);
      else if (!sel_match(els)) return els;
    }

    function remove(el) { el.parentNode.removeChild(el); }
    _is_arr_like(els) ? _each(els, remove) : remove(els, 0);
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

  $.append = function f(els, html) {
    if (arguments.length == 1) return _(f, _, els);
    if (_is_fn(html)) {
      var fn = html, set_html = function(el, i) { html = fn(i, el.innerHTML) };
      _is_arr_like(els) ? set_html(els[els.length-1], els.length-1) : set_html(els, 0);
    }

    if (_is_el(html))
      return (_is_arr_like(els) ? els[els.length-1] : els).appendChild(html), els;
    if (_is_el(html[0]))
      return _is_arr_like(els) ?
        _each(html, function(htm) { els[els.length-1].appendChild(htm); }) :
        _each(html, function(htm) { els.appendChild(htm); }), els;

    var insertHTML = function(el) {
      var insert = function(htm) { el.insertAdjacentHTML("beforeend", htm); };
      Array.isArray(html) ? _each(html, insert) : insert(html);
    };
    _is_arr_like(els) ? _each(els, insertHTML) : insertHTML(els);
    return els;
  };

  function _is_win(obj) { return obj != null && obj == obj.window; }
  function _is_document(obj) { return obj != null && obj.nodeType == 9; }
  function _check_win(els) { return _is_win(els) || _is_win(els[0]) }
  function _check_doc(els) { return _is_document(els) || _is_document(els[0]) }
  function _check_el(els) { return _is_el(els) || _is_el(els[0]) }
  function _get_method_val(els, method) { return _is_arr_like(els) ? _map(els, function(v){ return v[method] }) : els[method]; }
  function _get_doc_width(els) {
    var body = els.body || els[0].body;
    var html = els.documentElement || els[0].documentElement;
    var width = Math.max(
      body.offsetWidth, body.scrollWidth,
      html.offsetWidth, html.scrollWidth, html.clientWidth
    );
    return width;
  }

  $.width = function f(els, value) {
    if ( !(_check_el(els) || _check_win(els) || _check_doc(els)) ) {
      return _(f, _, els);
    }

    var width_iter = function(width_get) {
      return function(el) {
        var styles = window.getComputedStyle(el);
        var width = el.offsetWidth;
        var borderLeftWidth = parseFloat(styles.borderLeftWidth);
        var borderRightWidth = parseFloat(styles.borderRightWidth);
        var paddingLeft = parseFloat(styles.paddingLeft);
        var paddingRight = parseFloat(styles.paddingRight);
        // el.clientWidth; + padding
        // el.getBoundingClientRect().width; +padding + border
        return width_get ? ( width - borderRightWidth - borderLeftWidth - paddingLeft - paddingRight )
          : ( paddingLeft + paddingRight );
      }
    };


    if (arguments.length == 1) {

      if(_check_win(els)) {
        return _get_method_val(els, "innerWidth");
      }


      if (_check_doc(els)) {
        return _get_doc_width(els)
      }

      return _is_arr_like(els) ? _map(els, width_iter(true)) : width_iter(true)(els);

    }

    var width_set_iter = _is_fn(value) ?
      function(el,i) {
        var vall = value(i, width_iter(true)(el), el);
        if (vall) {
          var val = _is_str(vall) ? vall.split("px")[0] : vall;
          el.style.width = width_iter(false)(el) + val + "px"
        }
      } :
      function(el) {
        var val = _is_str(value) ? value.split("px")[0] : value;
        el.style.width = width_iter(false)(el) + val + "px"
      }
    return _is_arr_like(els) ? _each(els, width_set_iter) : width_set_iter(els), els;

  };


  $.height = function f(els) {

    if(els == window) {
      return window.innerHeight;
    }

    if (els == document) {
      var body = document.body;
      var html = document.documentElement;
      var height = Math.max(
        body.offsetHeight,
        body.scrollHeight,
        html.clientHeight,
        html.offsetHeight,
        html.scrollHeight
      );
      return height;
    }

    function height_iter (el) {
      var styles = window.getComputedStyle(el);
      var height = el.offsetHeight;
      var borderTopWidth = parseFloat(styles.borderTopWidth);
      var borderBottomWidth = parseFloat(styles.borderBottomWidth);
      var paddingTop = parseFloat(styles.paddingTop);
      var paddingBottom = parseFloat(styles.paddingBottom);

      // el.clientHeight; + padding
      // el.getBoundingClientRect().height; +padding + border

      return height - borderBottomWidth - borderTopWidth - paddingTop - paddingBottom;
    }

    return _is_arr_like(els) ? _map(els, height_iter) : height_iter(els);

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
