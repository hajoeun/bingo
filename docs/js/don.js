!function(window) {
  var classOnly = /^\.([\w\-]+)$/
    , idOnly = /^#([\w\-]+)$/
    , doc = window.document
    , html = doc.documentElement;
  var ___ = {};
  var slice = Array.prototype.slice;

  if (window.Element && !Element.prototype.closest) Element.prototype.closest = function(s) {
    var matches = (this.document || this.ownerDocument).querySelectorAll(s),
      i,
      el = this;
    do {
      i = getLength(matches);
      while (--i >= 0 && matches.item(i) !== el) {};
    } while ((i < 0) && (el = el.parentElement));
    return el;
  };

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

  function is_node(node, nt) {
    return node && typeof node == 'object' &&  (nt = node.nodeType) && (nt == 1 || nt == 9);
  }

  function define_root(root) {
    if (!root) return doc;
    var is_string = typeof root == 'string';
    if (!is_node(root) && !is_string && likearr(root)) return root[0];
    if (is_string) return $(root)[0];
    return root;
  }

  function is_descendant(element, container) {
    return (container.compareDocumentPosition(element) & 16) == 16;
  }

  function $(selector) {
    return _$(selector);
  }

  function _$(selector, _root) {
    /* eq나 first 등등 보류 */
    var selector_is_string = typeof selector == 'string'
      , root = define_root(_root);
    if (selector_is_string) {
      try {
        var m;
        if (root.getElementsByClassName && (m = selector.match(classOnly)))
          return slice.call(root.getElementsByClassName(m[1]));
        else if (root.getElementById && (m = selector.match(idOnly))){
          return [root.getElementById(m[1])];
        }
        else
          return slice.call(root.querySelectorAll(selector));
      } catch(e) {
        return [];
      }
    }
    else if (!selector || (selector_is_string && !selector.trim())) return []; // !root ||
    else if (selector === window || is_node(selector))
      return !_root || (selector !== window && is_node(root) && is_descendant(selector, root)) ? [selector] : [];
    else if (!selector_is_string && likearr(selector)) return selector; // flatten????할지말지 고민중
    // using duck typing for 'a' window or 'a' document (not 'the' window || document) ??
    // if (selector && (selector.document || (selector.nodeType && selector.nodeType == 9))) {
    //   return !_root ? [selector] : []
    // }
    else return [];
  }


  $.find = function(parent_els, selector) {
    var results = [];
    var p_els_len = getLength(parent_els);
    if (!likearr(parent_els) || p_els_len <= 1) {
      return $(selector, parent_els);
    } else {
      for(var i=0;i<p_els_len;i++) !function(_el_arr) {
        _el_arr.forEach(function(el) {
          if (results.indexOf(el) == -1) results.push(el);
        });
      }($(selector, parent_els[i]));
    }
    return results;


    function _finder(parent_el, selector) {
      var _el_arr = $(selector, parent_el);
      // if (typeof selector == 'string')
    }

    return [].concat(parent_els).reduce(function(mem, parent_el) {
      var _el_arr = $find(selector, parent_el);
      if (typeof selector == 'string') {

      } else {

      }
      var ch = parent_el.children, len = getLength(ch);
      _el_arr.forEach(function(el) {
        if (mem.indexOf(el) == -1) {
          return mem.push(el);
          for (var i=0;i<len;i++) if (ch[i].contains(el)) return mem.push(el);
        }
        // if (mem.indexOf(el) == -1 && (parent_el.compareDocumentPosition(el) & 16) == 16) mem.push(el);
      });
      return mem;
    }, memory);
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




