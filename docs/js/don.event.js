!function() {
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

  function _is_str(o) { return typeof o == 'string'; }

  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  function likearr(collection) {
    var length = _length(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  }
  function _length(list) { return list == null ? void 0 : list.length; }

  function _each(coll, iter) {
    for (var i = 0, len = _length(coll); i < len; i++) iter(coll[i], i);
    return coll;
  }
  function _keys(obj) { return _is_object(obj) ? Object.keys(obj) : []; }
  function _is_object(obj) { return typeof obj == 'object' && !!obj; }
  function _each2(obj, iter) {
    for (var i = 0, keys = _keys(obj), len = keys.length; i < len; i++) iter(obj[keys[i]], keys[i]);
    return obj;
  }
  function is_node(node, nt) {
    return node && typeof node == 'object' &&  (nt = node.nodeType) && (nt == 1 || nt == 9);
  }

  var $ = D;
  $.find = function(el, sel) {
    return el.querySelectorAll(sel);
  };
  $.contains = document.documentElement.contains ?
    function(parent, node) {
      return parent !== node && parent.contains(node);
    } :
    function(parent, node) {
      while (node && (node = node.parentNode)) if (node === parent) return true;
      return false
    };

  // IE10+ Support
  // inspired by https://github.com/oneuijs/oui-dom-events/blob/master/build/index.js

  var handlers = {};
  var specialEvents = {};
  specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents';

  var focusinSupported = 'onfocusin' in window,
    focus = { focus: 'focusin', blur: 'focusout' },
    hover = { mouseenter: 'mouseover', mouseleave: 'mouseout' };

  var _dtId = 1;
  function getDtId(obj) {
    return obj._dtId || (obj._dtId = _dtId++);
  }

  function parse(event) {
    var dotIndex = event.indexOf('.');
    if (dotIndex > 0) {
      return {
        e: event.substring(0, event.indexOf('.')),
        ns: event.substring(dotIndex + 1, event.length)
      };
    }
    return { e: event };
  }

  function realEvent(type) {
    return hover[type] || (focusinSupported && focus[type]) || type;
  }

  function findHandlers(el, selector, event, callback) {
    event = parse(event);
    return (handlers[getDtId(el)] || []).filter(function (handler) {
      return handler &&
        (!event.e || handler.e === event.e) &&
        (!event.ns || handler.ns === event.ns) &&
        (!callback || handler.callback === callback) &&
        (!selector || handler.selector === selector);
    });
  }

  function removeEvent(el, event, selector, callback) {
    if (likearr(el) && !is_node(el)) return _each(el, function(el) {
      removeEvent(el, event, selector, callback);
    });

    var eventName = parse(event).e;
    if (!el._dtId) return el;
    var elHandlers = handlers[getDtId(el)];
    var matchedHandlers = findHandlers(el, selector, event, callback);
    matchedHandlers.forEach(function (handler) {
      if (el.removeEventListener)
        el.removeEventListener(eventName, handler.delegator || handler.callback);

      elHandlers.splice(elHandlers.indexOf(handler), 1);
    });
    return el;
  }

  function makeProxy(el, callback) {
    return function(e) {
      e = compatible(e);
      e.$delegateTarget = e.$currentTarget = el;
      if (e.isImmediatePropagationStopped()) return;
      var result = callback.call(el, e);
      if (result === false) e.preventDefault(), e.stopPropagation();
      return result;
    }
  }

  function bindEvent(el, selector, event, callback, delegator, once) {
    if (!el) return el;

    if (likearr(el) && !is_node(el)) return _each(el, function(el) {
      bindEvent(el, selector, event, callback, delegator, once);
    });

    var id = getDtId(el);
    var handler = parse(event);
    var elHandlers = handlers[id] || (handlers[id] = []);
    handler.callback = callback;

    // emulate mouseenter, mouseleave
    if (!delegator && handler.e in hover) callback = function(e) {
      var related = e.relatedTarget;
      if (!related || (related !== el && !$.contains(el, related)))
        return handler.callback.apply(el, arguments);
    };

    var proxy = makeProxy(el, delegator || callback);
    handler.selector =  selector;
    handler.delegated = !!delegator;
    handler.delegator = once ? delegator ? function(e) {
      proxy(e);
      e.$delegate_called && D.off(el, event, selector, callback);
    } : function(e) {
      D.off(el, event, callback);
      proxy(e);
    } : proxy;

    elHandlers.push(handler);
    el.addEventListener(realEvent(handler.e), handler.delegator, false);
    return el;
  }

  var returnTrue = function() { return true },
    returnFalse = function() { return false },
    ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$|webkitMovement[XY]$)/,
    eventMethods = {
      preventDefault: 'isDefaultPrevented',
      stopImmediatePropagation: 'isImmediatePropagationStopped',
      stopPropagation: 'isPropagationStopped'
    };

  function compatible(event) {
    if (event.isDefaultPrevented) return event;

    _each2(eventMethods, function(predicate, name) {
      var eventMethod = event[name];
      event[name] = function() {
        this[predicate] = returnTrue;
        return eventMethod && eventMethod.apply(event, arguments);
      };
      event[predicate] = returnFalse;
    });

    event.timeStamp || (event.timeStamp = Date.now());

    if (event.defaultPrevented !== undefined ? event.defaultPrevented :
        'returnValue' in event ? event.returnValue === false :
          event.getPreventDefault && event.getPreventDefault()) {
      event.isDefaultPrevented = returnTrue;
    }
    return event;
  }

  function delegator(el, selector, callback, is_hover) {
    return function(e) {
      var els = $.find(el, selector);
      var matched;
      for (var i = 0, l = els.length; i < l; i++) {
        var child = els[i];
        if (child === e.target || child.contains(e.target)) {
          e.$currentTarget = matched = child;
          e.$delegateTarget = el;
          break;
        }
      }
      if (matched) {
        if (is_hover) {
          var related = e.relatedTarget;

          if (!related || (related !== matched && !$.contains(matched, related))) {
            e.$delegate_called = true;
            return callback.apply(matched, arguments);
          }
        } else {
          e.$delegate_called = true;
          return callback.apply(matched, arguments);
        }
      }
    }
  }

  D.on = function on(el, eventType, cb_or_sel, callback2) {
    if (arguments.length == 2) return _(on, _, el, eventType);
    if (arguments.length == 3) return _is_str(el) ?
      _(on, _, el, eventType, cb_or_sel) : bindEvent(el, null, eventType, cb_or_sel);

    return bindEvent(el, cb_or_sel, eventType, callback2, delegator(el, cb_or_sel, callback2, parse(eventType).e in hover));
  };

  D.off = function off(el, eventType, callback, callback2) {
    if (_is_str(el)) return arguments.length == 2 ? _(off, _, el, eventType) : _(off, _, el, eventType, callback);

    return _is_str(callback) ?
      removeEvent(el, eventType, callback, callback2) :
      removeEvent(el, eventType, null, callback);
  };

  D.one = D.once = function once(el, eventType, cb_or_sel, callback2) {
    if (arguments.length == 2) return _(once, _, el, eventType);
    if (arguments.length == 3) return _is_str(el) ?
      _(once, _, el, eventType, cb_or_sel) :
      bindEvent(el, null, eventType, cb_or_sel, false, true);

    return bindEvent(el, cb_or_sel, eventType, callback2, delegator(el, cb_or_sel, callback2, parse(eventType).e in hover), true);
  };

  D.trigger = function trigger(el, eventType, props) {
    if (likearr(el) && !is_node(el)) return _each(el, function(el) {
      D.triggerHandler(el, makeEvent(eventType, props));
    });
    D.triggerHandler(el, makeEvent(eventType, props));
  };

  D.triggerHandler = function(el, e) {
    el.dispatchEvent(e);
    if (!e.isDefaultPrevented() && e.type == 'submit') el.submit();
  };

  function makeEvent(eventType, props) {
    var event = document.createEvent(specialEvents[eventType] || 'Events');
    var bubbles = true;
    if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name]);
    event.initEvent(eventType, bubbles, true);
    return compatible(event);
  }

  D.submit = function(el) {
    D.triggerHandler(el, makeEvent('submit'));
  };

  function fetch_to_json(fetched) {
    return fetched.then(function(res) { return res.json() });
  }

  function ajax_method(method, url, data) {
    return fetch_to_json(fetch(url, {
      method: method,
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    }));
  }
  D.get = function(url, query_obj) {
    return fetch_to_json(fetch(append_query(url, D.param(query_obj))));
  };
  D.post = _(ajax_method, 'POST');
  D.put = _(ajax_method, 'PUT');
  D.del = _(ajax_method, 'DEL');

  function append_query(url, query) {
    return query == '' ? url : (url + '&' + query).replace(/[&?]{1,2}/, '?');
  }

  D.param = function(a) {
    var s = [], rbracket = /\[\]$/,
      isArray = function (obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
      }, add = function (k, v) {
        v = typeof v === 'function' ? v() : v === null ? '' : v === undefined ? '' : v;
        s[s.length] = encodeURIComponent(k) + '=' + encodeURIComponent(v);
      }, buildParams = function (prefix, obj) {
        var i, len, key;

        if (prefix) {
          if (isArray(obj)) {
            for (i = 0, len = obj.length; i < len; i++) {
              if (rbracket.test(prefix)) {
                add(prefix, obj[i]);
              } else {
                buildParams(prefix + '[' + (typeof obj[i] === 'object' ? i : '') + ']', obj[i]);
              }
            }
          } else if (obj && String(obj) === '[object Object]') {
            for (key in obj) {
              buildParams(prefix + '[' + key + ']', obj[key]);
            }
          } else {
            add(prefix, obj);
          }
        } else if (isArray(obj)) {
          for (i = 0, len = obj.length; i < len; i++) {
            add(obj[i].name, obj[i].value);
          }
        } else {
          for (key in obj) {
            buildParams(key, obj[key]);
          }
        }
        return s;
      };

    return buildParams('', a).join('&').replace(/%20/g, '+');
  };

}();
