!function(window) {
  var rquick_expr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/
    , combinator_expr = /^\s*[>|+|~]\s*/
    , doc = window.document
    , slice = Array.prototype.slice
    , push = Array.prototype.push;
  var matches = Element.prototype.matches || Element.prototype.webkitMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector;
  var ___ = {};
  var don_uid = function (id) {
    return function() {
      return 'don_js_' + '_' + id++ + '_' + Date.now();
    };
  }(0);
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

  function is_descendant( a, b ) {
    var adown = a.nodeType === 9 ? a.documentElement : a,
      bup = b && b.parentNode;
    return a === bup || !!( bup && bup.nodeType === 1 && (
        adown.contains ?
          adown.contains( bup ) :
          a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
      ));
  }
  // function is_descendant(element, container) {
  //   return container.contains(element.parentNode) && (container.compareDocumentPosition(element) & 16) == 16;
  // }

  function $(selector) {
    // if (arguments.length <= 1)
    //   return _$(selector, null, selector_is_string, selector_is_string && lt.exec(selector));
    return _$(selector, doc);
  }

  function _$(selector, root, _selector_is_string) {
    /* eq나 first 등등 보류 */
    var selector_is_string = _selector_is_string || typeof selector == 'string';
    if (!root || !selector || (selector_is_string && !selector.trim())) return [];
    else if (selector_is_string){
      var m, result = [], match = rquick_expr.exec(selector), elem;
      if (match) {
        if (m=match[1]) {
          if (root.nodeType == 9) result[0] = root.getElementById(m);
          else if ((elem = doc.getElementById(m)) && is_descendant(root, elem)) result[0] = elem;
        }
        else if ((m=match[3]) && root.getElementsByClassName)
          push.apply(result, root.getElementsByClassName(m));
        else if ((m=match[2]) && root.getElementsByTagName)
          push.apply(result, root.getElementsByTagName(m));
      } else push.apply(result, root.querySelectorAll(selector));
      return result;
    }
    else if (selector === window || is_node(selector))
      return !root || (selector !== window && is_node(root) && is_descendant(root, selector)) ? [selector] : [];
    else if (!selector_is_string && likearr(selector)) return selector; // flatten????할지말지 고민중
    else return [];
    // using duck typing for 'a' window or 'a' document (not 'the' window || document) ??
    // if (selector && (selector.document || (selector.nodeType && selector.nodeType == 9))) {
    //   return !_root ? [selector] : []
    // }
  }

  $.find = function find_recursive(parent_els, selector) {
    var root, results = [], p_els_len = getLength(parent_els)
      , selector_is_string = typeof selector == 'string';

    if (typeof parent_els == 'string') results = selector_is_string ?
      _$(parent_els + ' ' + selector, doc, selector_is_string)
      : find_recursive(_$(parent_els, doc, selector_is_string), selector);

    /* parent == elem_obj || [elem_obj] */
    else if (selector_is_string && (!likearr(parent_els) || p_els_len <= 1)) {
      root = define_root(parent_els);
      results = make_string_selector(root, selector_is_string);
    }
    else {
      for(var i=0, els, els_len, selector2, results2;i<p_els_len;i++) {
        root = define_root(parent_els[i]),
          els = make_string_selector(root, selector_is_string), els_len = els.length;
        for(var j=0, el;j<els_len;j++) {
          el = els[j];
          if (results.indexOf(el) == -1 && is_descendant(root, el)) results.push(el);
        }
      }
    }
    return results;

    function make_string_selector(root, selector_is_string) {
      if (selector_is_string && root.nodeType && root.nodeType != 9) {
        var root_id = root.getAttribute('id'), is_root_id = !!root_id
          , _selector, _selector_arr=[], i=0, selector_arr = selector.split(','), selector_arr_len = selector_arr.length;
        if (!is_root_id) root.setAttribute('id', (root_id = don_uid()));
        for(;i<selector_arr_len;i++) {
          _selector = selector_arr[i];
          _selector_arr.push(!combinator_expr.exec(_selector) ? _selector : '#' + root_id + _selector)
        }
        selector2 = _selector_arr.join(',');
        results2 = _$(selector2, root.parentNode || doc, selector_is_string);
        if (!is_root_id) root.removeAttribute('id');
        return results2;
      }
      return _$(selector, root, selector_is_string);
    }
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




