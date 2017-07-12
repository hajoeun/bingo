!function(window) {
  var classOnly = /^\.([\w\-]+)$/
    , idOnly = /^#([\w\-]+)$/
    , doc = window.document
    , html = doc.documentElement;
  var ___ = {};
  var slice = Array.prototype.slice;

  if (window.Element && !Element.prototype.closest) {
    Element.prototype.closest =
      function(s) {
        var matches = (this.document || this.ownerDocument).querySelectorAll(s),
          i,
          el = this;
        do {
          i = matches.length;
          while (--i >= 0 && matches.item(i) !== el) {};
        } while ((i < 0) && (el = el.parentElement));
        return el;
      };
  }

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

  function $find(root, selector) {
    var is_string = typeof selector == 'string';
    if (!selector || (is_string && !selector.trim())) return [];
    else if (typeof selector == 'object' && selector.nodeName) return [selector];
    else if (!is_string && likearr(selector)) return selector;
    if (!is_string) return [selector];
    try {
      var m;
      if (m = selector.match(classOnly))
        return slice.call(root.getElementsByClassName(m[1]));
      else if (m = selector.match(idOnly))
        return [root.getElementById(m[1])];
      else
        return slice.call(root.querySelectorAll(selector));
    } catch(e) {
      return [];
    }
  }

  function $(selector) {
    return $find(doc, selector);
  }

  $.find = function(parent_els, selector) {
    return [].concat(parent_els).reduce(function(mem, parent_el) {
      var _el_arr = $find(parent_el, selector);
      _el_arr.forEach(function(el) {
        if (mem.indexOf(el) == -1) {
          var ch = parent_el.children;
          for (var i=0, len=ch.length; i<len;i++)
            if (ch[i].contains(el)) return mem.push(el);
        }
        // if (mem.indexOf(el) == -1 && parent_el.compareDocumentPosition(el) == 20) mem.push(el);
      });
      return mem;
    }, []);
  };


  function $1(el) {
    var is_string = typeof el == 'string';
    if (!el || (is_string && !el.trim())) return null;
    else if ((typeof el == 'object' && el.nodeName)) return el;
    else if (!is_string && likearr(el)) return el[0] || null;
    try {
      return doc.querySelector(el);
    } catch(e) {
      return null;
    }
  }

  window.D = $;
  window.D1 = $1;


  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  function likearr(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  }

  function getLength(list) { return list == null ? void 0 : list.length; }
}(window);


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

  function _is_fn(o) { return typeof o == 'function'; }
  function _is_str(o) { return typeof o == 'string'; }

  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  function _is_arr_like(coll) {
    var length = _length(coll);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
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

    function some_class(el) {
      return el.classList.contains(className);
    }

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
      var get_iter = function(el, i) {
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

  $.css = function f(els, propName, propValue) {
    var len = _length(arguments);
    if (els == undefined) return [];
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
      function(el) { _each2(propName, function(attr, name) { el.style[name] = attr; }) } :
      function(el, i) {
        var val =  _is_fn(propValue) ? propValue(i, el) : propValue;
        if (val) el.style[propName] = val;
      };
    _is_arr_like(els) ? _each(els, set_iter) : set_iter(els);
    return els;
  };
}(D);


