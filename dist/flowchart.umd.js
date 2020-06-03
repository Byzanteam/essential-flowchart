(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("vue"));
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["flowchart"] = factory(require("vue"));
	else
		root["flowchart"] = factory(root["Vue"]);
})((typeof self !== 'undefined' ? self : this), function(__WEBPACK_EXTERNAL_MODULE__8bbf__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "fb15");
/******/ })
/************************************************************************/
/******/ ({

/***/ "00c7":
/***/ (function(module, exports) {

module.exports = function eventify(subject) {
  validateSubject(subject);

  var eventsStorage = createEventsStorage(subject);
  subject.on = eventsStorage.on;
  subject.off = eventsStorage.off;
  subject.fire = eventsStorage.fire;
  return subject;
};

function createEventsStorage(subject) {
  // Store all event listeners to this hash. Key is event name, value is array
  // of callback records.
  //
  // A callback record consists of callback function and its optional context:
  // { 'eventName' => [{callback: function, ctx: object}] }
  var registeredEvents = Object.create(null);

  return {
    on: function (eventName, callback, ctx) {
      if (typeof callback !== 'function') {
        throw new Error('callback is expected to be a function');
      }
      var handlers = registeredEvents[eventName];
      if (!handlers) {
        handlers = registeredEvents[eventName] = [];
      }
      handlers.push({callback: callback, ctx: ctx});

      return subject;
    },

    off: function (eventName, callback) {
      var wantToRemoveAll = (typeof eventName === 'undefined');
      if (wantToRemoveAll) {
        // Killing old events storage should be enough in this case:
        registeredEvents = Object.create(null);
        return subject;
      }

      if (registeredEvents[eventName]) {
        var deleteAllCallbacksForEvent = (typeof callback !== 'function');
        if (deleteAllCallbacksForEvent) {
          delete registeredEvents[eventName];
        } else {
          var callbacks = registeredEvents[eventName];
          for (var i = 0; i < callbacks.length; ++i) {
            if (callbacks[i].callback === callback) {
              callbacks.splice(i, 1);
            }
          }
        }
      }

      return subject;
    },

    fire: function (eventName) {
      var callbacks = registeredEvents[eventName];
      if (!callbacks) {
        return subject;
      }

      var fireArguments;
      if (arguments.length > 1) {
        fireArguments = Array.prototype.splice.call(arguments, 1);
      }
      for(var i = 0; i < callbacks.length; ++i) {
        var callbackInfo = callbacks[i];
        callbackInfo.callback.apply(callbackInfo.ctx, fireArguments);
      }

      return subject;
    }
  };
}

function validateSubject(subject) {
  if (!subject) {
    throw new Error('Eventify cannot use falsy object as events subject');
  }
  var reservedWords = ['on', 'fire', 'off'];
  for (var i = 0; i < reservedWords.length; ++i) {
    if (subject.hasOwnProperty(reservedWords[i])) {
      throw new Error("Subject cannot be eventified, since it already has property '" + reservedWords[i] + "'");
    }
  }
}


/***/ }),

/***/ "00ee":
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__("b622");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG] = 'z';

module.exports = String(test) === '[object z]';


/***/ }),

/***/ "015f":
/***/ (function(module, exports, __webpack_require__) {

var AStarFinder = __webpack_require__("0c09");

/**
 * Dijkstra path-finder.
 * @constructor
 * @extends AStarFinder
 * @param {Object} opt
 * @param {boolean} opt.allowDiagonal Whether diagonal movement is allowed.
 *     Deprecated, use diagonalMovement instead.
 * @param {boolean} opt.dontCrossCorners Disallow diagonal movement touching
 *     block corners. Deprecated, use diagonalMovement instead.
 * @param {DiagonalMovement} opt.diagonalMovement Allowed diagonal movement.
 */
function DijkstraFinder(opt) {
    AStarFinder.call(this, opt);
    this.heuristic = function(dx, dy) {
        return 0;
    };
}

DijkstraFinder.prototype = new AStarFinder();
DijkstraFinder.prototype.constructor = DijkstraFinder;

module.exports = DijkstraFinder;


/***/ }),

/***/ "0201":
/***/ (function(module, exports) {

/**
 * Disallows selecting text.
 */
module.exports = createTextSelectionInterceptor;

function createTextSelectionInterceptor(useFake) {
  if (useFake) {
    return {
      capture: noop,
      release: noop
    };
  }

  var dragObject;
  var prevSelectStart;
  var prevDragStart;
  var wasCaptured = false;

  return {
    capture: capture,
    release: release
  };

  function capture(domObject) {
    wasCaptured = true;
    prevSelectStart = window.document.onselectstart;
    prevDragStart = window.document.ondragstart;

    window.document.onselectstart = disabled;

    dragObject = domObject;
    dragObject.ondragstart = disabled;
  }

  function release() {
    if (!wasCaptured) return;
    
    wasCaptured = false;
    window.document.onselectstart = prevSelectStart;
    if (dragObject) dragObject.ondragstart = prevDragStart;
  }
}

function disabled(e) {
  e.stopPropagation();
  return false;
}

function noop() {}


/***/ }),

/***/ "0366":
/***/ (function(module, exports, __webpack_require__) {

var aFunction = __webpack_require__("1c0b");

// optional / simple context binding
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 0: return function () {
      return fn.call(that);
    };
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ "057f":
/***/ (function(module, exports, __webpack_require__) {

var toIndexedObject = __webpack_require__("fc6a");
var nativeGetOwnPropertyNames = __webpack_require__("241c").f;

var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return nativeGetOwnPropertyNames(it);
  } catch (error) {
    return windowNames.slice();
  }
};

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]'
    ? getWindowNames(it)
    : nativeGetOwnPropertyNames(toIndexedObject(it));
};


/***/ }),

/***/ "05a9":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Default_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("884b");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Default_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Default_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Default_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "06cf":
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__("83ab");
var propertyIsEnumerableModule = __webpack_require__("d1e7");
var createPropertyDescriptor = __webpack_require__("5c6c");
var toIndexedObject = __webpack_require__("fc6a");
var toPrimitive = __webpack_require__("c04e");
var has = __webpack_require__("5135");
var IE8_DOM_DEFINE = __webpack_require__("0cfb");

var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
exports.f = DESCRIPTORS ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return nativeGetOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (has(O, P)) return createPropertyDescriptor(!propertyIsEnumerableModule.f.call(O, P), O[P]);
};


/***/ }),

/***/ "07ac":
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__("23e7");
var $values = __webpack_require__("6f53").values;

// `Object.values` method
// https://tc39.github.io/ecma262/#sec-object.values
$({ target: 'Object', stat: true }, {
  values: function values(O) {
    return $values(O);
  }
});


/***/ }),

/***/ "0c09":
/***/ (function(module, exports, __webpack_require__) {

var Heap       = __webpack_require__("175a");
var Util       = __webpack_require__("22b1");
var Heuristic  = __webpack_require__("1196");
var DiagonalMovement = __webpack_require__("8b6a");

/**
 * A* path-finder. Based upon https://github.com/bgrins/javascript-astar
 * @constructor
 * @param {Object} opt
 * @param {boolean} opt.allowDiagonal Whether diagonal movement is allowed.
 *     Deprecated, use diagonalMovement instead.
 * @param {boolean} opt.dontCrossCorners Disallow diagonal movement touching 
 *     block corners. Deprecated, use diagonalMovement instead.
 * @param {DiagonalMovement} opt.diagonalMovement Allowed diagonal movement.
 * @param {function} opt.heuristic Heuristic function to estimate the distance
 *     (defaults to manhattan).
 * @param {number} opt.weight Weight to apply to the heuristic to allow for
 *     suboptimal paths, in order to speed up the search.
 */
function AStarFinder(opt) {
    opt = opt || {};
    this.allowDiagonal = opt.allowDiagonal;
    this.dontCrossCorners = opt.dontCrossCorners;
    this.heuristic = opt.heuristic || Heuristic.manhattan;
    this.weight = opt.weight || 1;
    this.diagonalMovement = opt.diagonalMovement;

    if (!this.diagonalMovement) {
        if (!this.allowDiagonal) {
            this.diagonalMovement = DiagonalMovement.Never;
        } else {
            if (this.dontCrossCorners) {
                this.diagonalMovement = DiagonalMovement.OnlyWhenNoObstacles;
            } else {
                this.diagonalMovement = DiagonalMovement.IfAtMostOneObstacle;
            }
        }
    }

    // When diagonal movement is allowed the manhattan heuristic is not
    //admissible. It should be octile instead
    if (this.diagonalMovement === DiagonalMovement.Never) {
        this.heuristic = opt.heuristic || Heuristic.manhattan;
    } else {
        this.heuristic = opt.heuristic || Heuristic.octile;
    }
}

/**
 * Find and return the the path.
 * @return {Array<Array<number>>} The path, including both start and
 *     end positions.
 */
AStarFinder.prototype.findPath = function(startX, startY, endX, endY, grid) {
    var openList = new Heap(function(nodeA, nodeB) {
            return nodeA.f - nodeB.f;
        }),
        startNode = grid.getNodeAt(startX, startY),
        endNode = grid.getNodeAt(endX, endY),
        heuristic = this.heuristic,
        diagonalMovement = this.diagonalMovement,
        weight = this.weight,
        abs = Math.abs, SQRT2 = Math.SQRT2,
        node, neighbors, neighbor, i, l, x, y, ng;

    // set the `g` and `f` value of the start node to be 0
    startNode.g = 0;
    startNode.f = 0;

    // push the start node into the open list
    openList.push(startNode);
    startNode.opened = true;

    // while the open list is not empty
    while (!openList.empty()) {
        // pop the position of node which has the minimum `f` value.
        node = openList.pop();
        node.closed = true;

        // if reached the end position, construct the path and return it
        if (node === endNode) {
            return Util.backtrace(endNode);
        }

        // get neigbours of the current node
        neighbors = grid.getNeighbors(node, diagonalMovement);
        for (i = 0, l = neighbors.length; i < l; ++i) {
            neighbor = neighbors[i];

            if (neighbor.closed) {
                continue;
            }

            x = neighbor.x;
            y = neighbor.y;

            // get the distance between current node and the neighbor
            // and calculate the next g score
            ng = node.g + ((x - node.x === 0 || y - node.y === 0) ? 1 : SQRT2);

            // check if the neighbor has not been inspected yet, or
            // can be reached with smaller cost from the current node
            if (!neighbor.opened || ng < neighbor.g) {
                neighbor.g = ng;
                neighbor.h = neighbor.h || weight * heuristic(abs(x - endX), abs(y - endY));
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.parent = node;

                if (!neighbor.opened) {
                    openList.push(neighbor);
                    neighbor.opened = true;
                } else {
                    // the neighbor can be reached with smaller cost.
                    // Since its f value has been updated, we have to
                    // update its position in the open list
                    openList.updateItem(neighbor);
                }
            }
        } // end for each neighbor
    } // end while not open list empty

    // fail to find the path
    return [];
};

module.exports = AStarFinder;


/***/ }),

/***/ "0cfb":
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__("83ab");
var fails = __webpack_require__("d039");
var createElement = __webpack_require__("cc12");

// Thank's IE8 for his funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});


/***/ }),

/***/ "1196":
/***/ (function(module, exports) {

/**
 * @namespace PF.Heuristic
 * @description A collection of heuristic functions.
 */
module.exports = {

  /**
   * Manhattan distance.
   * @param {number} dx - Difference in x.
   * @param {number} dy - Difference in y.
   * @return {number} dx + dy
   */
  manhattan: function(dx, dy) {
      return dx + dy;
  },

  /**
   * Euclidean distance.
   * @param {number} dx - Difference in x.
   * @param {number} dy - Difference in y.
   * @return {number} sqrt(dx * dx + dy * dy)
   */
  euclidean: function(dx, dy) {
      return Math.sqrt(dx * dx + dy * dy);
  },

  /**
   * Octile distance.
   * @param {number} dx - Difference in x.
   * @param {number} dy - Difference in y.
   * @return {number} sqrt(dx * dx + dy * dy) for grids
   */
  octile: function(dx, dy) {
      var F = Math.SQRT2 - 1;
      return (dx < dy) ? F * dx + dy : F * dy + dx;
  },

  /**
   * Chebyshev distance.
   * @param {number} dx - Difference in x.
   * @param {number} dy - Difference in y.
   * @return {number} max(dx, dy)
   */
  chebyshev: function(dx, dy) {
      return Math.max(dx, dy);
  }

};


/***/ }),

/***/ "1248":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {// Generated by CoffeeScript 1.8.0
(function() {
  var Heap, defaultCmp, floor, heapify, heappop, heappush, heappushpop, heapreplace, insort, min, nlargest, nsmallest, updateItem, _siftdown, _siftup;

  floor = Math.floor, min = Math.min;


  /*
  Default comparison function to be used
   */

  defaultCmp = function(x, y) {
    if (x < y) {
      return -1;
    }
    if (x > y) {
      return 1;
    }
    return 0;
  };


  /*
  Insert item x in list a, and keep it sorted assuming a is sorted.
  
  If x is already in a, insert it to the right of the rightmost x.
  
  Optional args lo (default 0) and hi (default a.length) bound the slice
  of a to be searched.
   */

  insort = function(a, x, lo, hi, cmp) {
    var mid;
    if (lo == null) {
      lo = 0;
    }
    if (cmp == null) {
      cmp = defaultCmp;
    }
    if (lo < 0) {
      throw new Error('lo must be non-negative');
    }
    if (hi == null) {
      hi = a.length;
    }
    while (lo < hi) {
      mid = floor((lo + hi) / 2);
      if (cmp(x, a[mid]) < 0) {
        hi = mid;
      } else {
        lo = mid + 1;
      }
    }
    return ([].splice.apply(a, [lo, lo - lo].concat(x)), x);
  };


  /*
  Push item onto heap, maintaining the heap invariant.
   */

  heappush = function(array, item, cmp) {
    if (cmp == null) {
      cmp = defaultCmp;
    }
    array.push(item);
    return _siftdown(array, 0, array.length - 1, cmp);
  };


  /*
  Pop the smallest item off the heap, maintaining the heap invariant.
   */

  heappop = function(array, cmp) {
    var lastelt, returnitem;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    lastelt = array.pop();
    if (array.length) {
      returnitem = array[0];
      array[0] = lastelt;
      _siftup(array, 0, cmp);
    } else {
      returnitem = lastelt;
    }
    return returnitem;
  };


  /*
  Pop and return the current smallest value, and add the new item.
  
  This is more efficient than heappop() followed by heappush(), and can be
  more appropriate when using a fixed size heap. Note that the value
  returned may be larger than item! That constrains reasonable use of
  this routine unless written as part of a conditional replacement:
      if item > array[0]
        item = heapreplace(array, item)
   */

  heapreplace = function(array, item, cmp) {
    var returnitem;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    returnitem = array[0];
    array[0] = item;
    _siftup(array, 0, cmp);
    return returnitem;
  };


  /*
  Fast version of a heappush followed by a heappop.
   */

  heappushpop = function(array, item, cmp) {
    var _ref;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    if (array.length && cmp(array[0], item) < 0) {
      _ref = [array[0], item], item = _ref[0], array[0] = _ref[1];
      _siftup(array, 0, cmp);
    }
    return item;
  };


  /*
  Transform list into a heap, in-place, in O(array.length) time.
   */

  heapify = function(array, cmp) {
    var i, _i, _j, _len, _ref, _ref1, _results, _results1;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    _ref1 = (function() {
      _results1 = [];
      for (var _j = 0, _ref = floor(array.length / 2); 0 <= _ref ? _j < _ref : _j > _ref; 0 <= _ref ? _j++ : _j--){ _results1.push(_j); }
      return _results1;
    }).apply(this).reverse();
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      i = _ref1[_i];
      _results.push(_siftup(array, i, cmp));
    }
    return _results;
  };


  /*
  Update the position of the given item in the heap.
  This function should be called every time the item is being modified.
   */

  updateItem = function(array, item, cmp) {
    var pos;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    pos = array.indexOf(item);
    if (pos === -1) {
      return;
    }
    _siftdown(array, 0, pos, cmp);
    return _siftup(array, pos, cmp);
  };


  /*
  Find the n largest elements in a dataset.
   */

  nlargest = function(array, n, cmp) {
    var elem, result, _i, _len, _ref;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    result = array.slice(0, n);
    if (!result.length) {
      return result;
    }
    heapify(result, cmp);
    _ref = array.slice(n);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      elem = _ref[_i];
      heappushpop(result, elem, cmp);
    }
    return result.sort(cmp).reverse();
  };


  /*
  Find the n smallest elements in a dataset.
   */

  nsmallest = function(array, n, cmp) {
    var elem, i, los, result, _i, _j, _len, _ref, _ref1, _results;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    if (n * 10 <= array.length) {
      result = array.slice(0, n).sort(cmp);
      if (!result.length) {
        return result;
      }
      los = result[result.length - 1];
      _ref = array.slice(n);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elem = _ref[_i];
        if (cmp(elem, los) < 0) {
          insort(result, elem, 0, null, cmp);
          result.pop();
          los = result[result.length - 1];
        }
      }
      return result;
    }
    heapify(array, cmp);
    _results = [];
    for (i = _j = 0, _ref1 = min(n, array.length); 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
      _results.push(heappop(array, cmp));
    }
    return _results;
  };

  _siftdown = function(array, startpos, pos, cmp) {
    var newitem, parent, parentpos;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    newitem = array[pos];
    while (pos > startpos) {
      parentpos = (pos - 1) >> 1;
      parent = array[parentpos];
      if (cmp(newitem, parent) < 0) {
        array[pos] = parent;
        pos = parentpos;
        continue;
      }
      break;
    }
    return array[pos] = newitem;
  };

  _siftup = function(array, pos, cmp) {
    var childpos, endpos, newitem, rightpos, startpos;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    endpos = array.length;
    startpos = pos;
    newitem = array[pos];
    childpos = 2 * pos + 1;
    while (childpos < endpos) {
      rightpos = childpos + 1;
      if (rightpos < endpos && !(cmp(array[childpos], array[rightpos]) < 0)) {
        childpos = rightpos;
      }
      array[pos] = array[childpos];
      pos = childpos;
      childpos = 2 * pos + 1;
    }
    array[pos] = newitem;
    return _siftdown(array, startpos, pos, cmp);
  };

  Heap = (function() {
    Heap.push = heappush;

    Heap.pop = heappop;

    Heap.replace = heapreplace;

    Heap.pushpop = heappushpop;

    Heap.heapify = heapify;

    Heap.updateItem = updateItem;

    Heap.nlargest = nlargest;

    Heap.nsmallest = nsmallest;

    function Heap(cmp) {
      this.cmp = cmp != null ? cmp : defaultCmp;
      this.nodes = [];
    }

    Heap.prototype.push = function(x) {
      return heappush(this.nodes, x, this.cmp);
    };

    Heap.prototype.pop = function() {
      return heappop(this.nodes, this.cmp);
    };

    Heap.prototype.peek = function() {
      return this.nodes[0];
    };

    Heap.prototype.contains = function(x) {
      return this.nodes.indexOf(x) !== -1;
    };

    Heap.prototype.replace = function(x) {
      return heapreplace(this.nodes, x, this.cmp);
    };

    Heap.prototype.pushpop = function(x) {
      return heappushpop(this.nodes, x, this.cmp);
    };

    Heap.prototype.heapify = function() {
      return heapify(this.nodes, this.cmp);
    };

    Heap.prototype.updateItem = function(x) {
      return updateItem(this.nodes, x, this.cmp);
    };

    Heap.prototype.clear = function() {
      return this.nodes = [];
    };

    Heap.prototype.empty = function() {
      return this.nodes.length === 0;
    };

    Heap.prototype.size = function() {
      return this.nodes.length;
    };

    Heap.prototype.clone = function() {
      var heap;
      heap = new Heap();
      heap.nodes = this.nodes.slice(0);
      return heap;
    };

    Heap.prototype.toArray = function() {
      return this.nodes.slice(0);
    };

    Heap.prototype.insert = Heap.prototype.push;

    Heap.prototype.top = Heap.prototype.peek;

    Heap.prototype.front = Heap.prototype.peek;

    Heap.prototype.has = Heap.prototype.contains;

    Heap.prototype.copy = Heap.prototype.clone;

    return Heap;

  })();

  if ( true && module !== null ? module.exports : void 0) {
    module.exports = Heap;
  } else {
    window.Heap = Heap;
  }

}).call(this);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("62e4")(module)))

/***/ }),

/***/ "13d5":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("23e7");
var $reduce = __webpack_require__("d58f").left;
var arrayMethodIsStrict = __webpack_require__("a640");
var arrayMethodUsesToLength = __webpack_require__("ae40");

var STRICT_METHOD = arrayMethodIsStrict('reduce');
var USES_TO_LENGTH = arrayMethodUsesToLength('reduce', { 1: 0 });

// `Array.prototype.reduce` method
// https://tc39.github.io/ecma262/#sec-array.prototype.reduce
$({ target: 'Array', proto: true, forced: !STRICT_METHOD || !USES_TO_LENGTH }, {
  reduce: function reduce(callbackfn /* , initialValue */) {
    return $reduce(this, callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),

/***/ "159b":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("da84");
var DOMIterables = __webpack_require__("fdbc");
var forEach = __webpack_require__("17c2");
var createNonEnumerableProperty = __webpack_require__("9112");

for (var COLLECTION_NAME in DOMIterables) {
  var Collection = global[COLLECTION_NAME];
  var CollectionPrototype = Collection && Collection.prototype;
  // some Chrome versions have non-configurable methods on DOMTokenList
  if (CollectionPrototype && CollectionPrototype.forEach !== forEach) try {
    createNonEnumerableProperty(CollectionPrototype, 'forEach', forEach);
  } catch (error) {
    CollectionPrototype.forEach = forEach;
  }
}


/***/ }),

/***/ "175a":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("1248");


/***/ }),

/***/ "17c2":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $forEach = __webpack_require__("b727").forEach;
var arrayMethodIsStrict = __webpack_require__("a640");
var arrayMethodUsesToLength = __webpack_require__("ae40");

var STRICT_METHOD = arrayMethodIsStrict('forEach');
var USES_TO_LENGTH = arrayMethodUsesToLength('forEach');

// `Array.prototype.forEach` method implementation
// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
module.exports = (!STRICT_METHOD || !USES_TO_LENGTH) ? function forEach(callbackfn /* , thisArg */) {
  return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
} : [].forEach;


/***/ }),

/***/ "1be4":
/***/ (function(module, exports, __webpack_require__) {

var getBuiltIn = __webpack_require__("d066");

module.exports = getBuiltIn('document', 'documentElement');


/***/ }),

/***/ "1c0b":
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') {
    throw TypeError(String(it) + ' is not a function');
  } return it;
};


/***/ }),

/***/ "1c7e":
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__("b622");

var ITERATOR = wellKnownSymbol('iterator');
var SAFE_CLOSING = false;

try {
  var called = 0;
  var iteratorWithReturn = {
    next: function () {
      return { done: !!called++ };
    },
    'return': function () {
      SAFE_CLOSING = true;
    }
  };
  iteratorWithReturn[ITERATOR] = function () {
    return this;
  };
  // eslint-disable-next-line no-throw-literal
  Array.from(iteratorWithReturn, function () { throw 2; });
} catch (error) { /* empty */ }

module.exports = function (exec, SKIP_CLOSING) {
  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
  var ITERATION_SUPPORT = false;
  try {
    var object = {};
    object[ITERATOR] = function () {
      return {
        next: function () {
          return { done: ITERATION_SUPPORT = true };
        }
      };
    };
    exec(object);
  } catch (error) { /* empty */ }
  return ITERATION_SUPPORT;
};


/***/ }),

/***/ "1d80":
/***/ (function(module, exports) {

// `RequireObjectCoercible` abstract operation
// https://tc39.github.io/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on " + it);
  return it;
};


/***/ }),

/***/ "1dde":
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__("d039");
var wellKnownSymbol = __webpack_require__("b622");
var V8_VERSION = __webpack_require__("2d00");

var SPECIES = wellKnownSymbol('species');

module.exports = function (METHOD_NAME) {
  // We can't use this feature detection in V8 since it causes
  // deoptimization and serious performance degradation
  // https://github.com/zloirock/core-js/issues/677
  return V8_VERSION >= 51 || !fails(function () {
    var array = [];
    var constructor = array.constructor = {};
    constructor[SPECIES] = function () {
      return { foo: 1 };
    };
    return array[METHOD_NAME](Boolean).foo !== 1;
  });
};


/***/ }),

/***/ "22b1":
/***/ (function(module, exports) {

/**
 * Backtrace according to the parent records and return the path.
 * (including both start and end nodes)
 * @param {Node} node End node
 * @return {Array<Array<number>>} the path
 */
function backtrace(node) {
    var path = [[node.x, node.y]];
    while (node.parent) {
        node = node.parent;
        path.push([node.x, node.y]);
    }
    return path.reverse();
}
exports.backtrace = backtrace;

/**
 * Backtrace from start and end node, and return the path.
 * (including both start and end nodes)
 * @param {Node}
 * @param {Node}
 */
function biBacktrace(nodeA, nodeB) {
    var pathA = backtrace(nodeA),
        pathB = backtrace(nodeB);
    return pathA.concat(pathB.reverse());
}
exports.biBacktrace = biBacktrace;

/**
 * Compute the length of the path.
 * @param {Array<Array<number>>} path The path
 * @return {number} The length of the path
 */
function pathLength(path) {
    var i, sum = 0, a, b, dx, dy;
    for (i = 1; i < path.length; ++i) {
        a = path[i - 1];
        b = path[i];
        dx = a[0] - b[0];
        dy = a[1] - b[1];
        sum += Math.sqrt(dx * dx + dy * dy);
    }
    return sum;
}
exports.pathLength = pathLength;


/**
 * Given the start and end coordinates, return all the coordinates lying
 * on the line formed by these coordinates, based on Bresenham's algorithm.
 * http://en.wikipedia.org/wiki/Bresenham's_line_algorithm#Simplification
 * @param {number} x0 Start x coordinate
 * @param {number} y0 Start y coordinate
 * @param {number} x1 End x coordinate
 * @param {number} y1 End y coordinate
 * @return {Array<Array<number>>} The coordinates on the line
 */
function interpolate(x0, y0, x1, y1) {
    var abs = Math.abs,
        line = [],
        sx, sy, dx, dy, err, e2;

    dx = abs(x1 - x0);
    dy = abs(y1 - y0);

    sx = (x0 < x1) ? 1 : -1;
    sy = (y0 < y1) ? 1 : -1;

    err = dx - dy;

    while (true) {
        line.push([x0, y0]);

        if (x0 === x1 && y0 === y1) {
            break;
        }
        
        e2 = 2 * err;
        if (e2 > -dy) {
            err = err - dy;
            x0 = x0 + sx;
        }
        if (e2 < dx) {
            err = err + dx;
            y0 = y0 + sy;
        }
    }

    return line;
}
exports.interpolate = interpolate;


/**
 * Given a compressed path, return a new path that has all the segments
 * in it interpolated.
 * @param {Array<Array<number>>} path The path
 * @return {Array<Array<number>>} expanded path
 */
function expandPath(path) {
    var expanded = [],
        len = path.length,
        coord0, coord1,
        interpolated,
        interpolatedLen,
        i, j;

    if (len < 2) {
        return expanded;
    }

    for (i = 0; i < len - 1; ++i) {
        coord0 = path[i];
        coord1 = path[i + 1];

        interpolated = interpolate(coord0[0], coord0[1], coord1[0], coord1[1]);
        interpolatedLen = interpolated.length;
        for (j = 0; j < interpolatedLen - 1; ++j) {
            expanded.push(interpolated[j]);
        }
    }
    expanded.push(path[len - 1]);

    return expanded;
}
exports.expandPath = expandPath;


/**
 * Smoothen the give path.
 * The original path will not be modified; a new path will be returned.
 * @param {PF.Grid} grid
 * @param {Array<Array<number>>} path The path
 */
function smoothenPath(grid, path) {
    var len = path.length,
        x0 = path[0][0],        // path start x
        y0 = path[0][1],        // path start y
        x1 = path[len - 1][0],  // path end x
        y1 = path[len - 1][1],  // path end y
        sx, sy,                 // current start coordinate
        ex, ey,                 // current end coordinate
        newPath,
        i, j, coord, line, testCoord, blocked;

    sx = x0;
    sy = y0;
    newPath = [[sx, sy]];

    for (i = 2; i < len; ++i) {
        coord = path[i];
        ex = coord[0];
        ey = coord[1];
        line = interpolate(sx, sy, ex, ey);

        blocked = false;
        for (j = 1; j < line.length; ++j) {
            testCoord = line[j];

            if (!grid.isWalkableAt(testCoord[0], testCoord[1])) {
                blocked = true;
                break;
            }
        }
        if (blocked) {
            lastValidCoord = path[i - 1];
            newPath.push(lastValidCoord);
            sx = lastValidCoord[0];
            sy = lastValidCoord[1];
        }
    }
    newPath.push([x1, y1]);

    return newPath;
}
exports.smoothenPath = smoothenPath;


/**
 * Compress a path, remove redundant nodes without altering the shape
 * The original path is not modified
 * @param {Array<Array<number>>} path The path
 * @return {Array<Array<number>>} The compressed path
 */
function compressPath(path) {

    // nothing to compress
    if(path.length < 3) {
        return path;
    }

    var compressed = [],
        sx = path[0][0], // start x
        sy = path[0][1], // start y
        px = path[1][0], // second point x
        py = path[1][1], // second point y
        dx = px - sx, // direction between the two points
        dy = py - sy, // direction between the two points
        lx, ly,
        ldx, ldy,
        sq, i;

    // normalize the direction
    sq = Math.sqrt(dx*dx + dy*dy);
    dx /= sq;
    dy /= sq;

    // start the new path
    compressed.push([sx,sy]);

    for(i = 2; i < path.length; i++) {

        // store the last point
        lx = px;
        ly = py;

        // store the last direction
        ldx = dx;
        ldy = dy;

        // next point
        px = path[i][0];
        py = path[i][1];

        // next direction
        dx = px - lx;
        dy = py - ly;

        // normalize
        sq = Math.sqrt(dx*dx + dy*dy);
        dx /= sq;
        dy /= sq;

        // if the direction has changed, store the point
        if ( dx !== ldx || dy !== ldy ) {
            compressed.push([lx,ly]);
        }
    }

    // store the last point
    compressed.push([px,py]);

    return compressed;
}
exports.compressPath = compressPath;


/***/ }),

/***/ "23cb":
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__("a691");

var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
module.exports = function (index, length) {
  var integer = toInteger(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};


/***/ }),

/***/ "23e7":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("da84");
var getOwnPropertyDescriptor = __webpack_require__("06cf").f;
var createNonEnumerableProperty = __webpack_require__("9112");
var redefine = __webpack_require__("6eeb");
var setGlobal = __webpack_require__("ce4e");
var copyConstructorProperties = __webpack_require__("e893");
var isForced = __webpack_require__("94ca");

/*
  options.target      - name of the target object
  options.global      - target is the global object
  options.stat        - export as static methods of target
  options.proto       - export as prototype methods of target
  options.real        - real prototype method for the `pure` version
  options.forced      - export even if the native feature is available
  options.bind        - bind methods to the target, required for the `pure` version
  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
  options.sham        - add a flag to not completely full polyfills
  options.enumerable  - export as enumerable property
  options.noTargetGet - prevent calling a getter on target
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global;
  } else if (STATIC) {
    target = global[TARGET] || setGlobal(TARGET, {});
  } else {
    target = (global[TARGET] || {}).prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.noTargetGet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty === typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    // extend global
    redefine(target, key, sourceProperty, options);
  }
};


/***/ }),

/***/ "241c":
/***/ (function(module, exports, __webpack_require__) {

var internalObjectKeys = __webpack_require__("ca84");
var enumBugKeys = __webpack_require__("7839");

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertynames
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};


/***/ }),

/***/ "24fb":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (useSourceMap) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item, useSourceMap);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join('');
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === 'string') {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, '']];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

function cssWithMappingToString(item, useSourceMap) {
  var content = item[1] || ''; // eslint-disable-next-line prefer-destructuring

  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (useSourceMap && typeof btoa === 'function') {
    var sourceMapping = toComment(cssMapping);
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || '').concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
  }

  return [content].join('\n');
} // Adapted from convert-source-map (MIT)


function toComment(sourceMap) {
  // eslint-disable-next-line no-undef
  var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
  var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
  return "/*# ".concat(data, " */");
}

/***/ }),

/***/ "25ee":
/***/ (function(module, exports, __webpack_require__) {

var BiAStarFinder = __webpack_require__("3f6a");

/**
 * Bi-direcitional Best-First-Search path-finder.
 * @constructor
 * @extends BiAStarFinder
 * @param {Object} opt
 * @param {boolean} opt.allowDiagonal Whether diagonal movement is allowed.
 *     Deprecated, use diagonalMovement instead.
 * @param {boolean} opt.dontCrossCorners Disallow diagonal movement touching
 *     block corners. Deprecated, use diagonalMovement instead.
 * @param {DiagonalMovement} opt.diagonalMovement Allowed diagonal movement.
 * @param {function} opt.heuristic Heuristic function to estimate the distance
 *     (defaults to manhattan).
 */
function BiBestFirstFinder(opt) {
    BiAStarFinder.call(this, opt);

    var orig = this.heuristic;
    this.heuristic = function(dx, dy) {
        return orig(dx, dy) * 1000000;
    };
}

BiBestFirstFinder.prototype = new BiAStarFinder();
BiBestFirstFinder.prototype.constructor = BiBestFirstFinder;

module.exports = BiBestFirstFinder;


/***/ }),

/***/ "25f0":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var redefine = __webpack_require__("6eeb");
var anObject = __webpack_require__("825a");
var fails = __webpack_require__("d039");
var flags = __webpack_require__("ad6d");

var TO_STRING = 'toString';
var RegExpPrototype = RegExp.prototype;
var nativeToString = RegExpPrototype[TO_STRING];

var NOT_GENERIC = fails(function () { return nativeToString.call({ source: 'a', flags: 'b' }) != '/a/b'; });
// FF44- RegExp#toString has a wrong name
var INCORRECT_NAME = nativeToString.name != TO_STRING;

// `RegExp.prototype.toString` method
// https://tc39.github.io/ecma262/#sec-regexp.prototype.tostring
if (NOT_GENERIC || INCORRECT_NAME) {
  redefine(RegExp.prototype, TO_STRING, function toString() {
    var R = anObject(this);
    var p = String(R.source);
    var rf = R.flags;
    var f = String(rf === undefined && R instanceof RegExp && !('flags' in RegExpPrototype) ? flags.call(R) : rf);
    return '/' + p + '/' + f;
  }, { unsafe: true });
}


/***/ }),

/***/ "28e0":
/***/ (function(module, exports) {

/**
 * A node in grid. 
 * This class holds some basic information about a node and custom 
 * attributes may be added, depending on the algorithms' needs.
 * @constructor
 * @param {number} x - The x coordinate of the node on the grid.
 * @param {number} y - The y coordinate of the node on the grid.
 * @param {boolean} [walkable] - Whether this node is walkable.
 */
function Node(x, y, walkable) {
    /**
     * The x coordinate of the node on the grid.
     * @type number
     */
    this.x = x;
    /**
     * The y coordinate of the node on the grid.
     * @type number
     */
    this.y = y;
    /**
     * Whether this node can be walked through.
     * @type boolean
     */
    this.walkable = (walkable === undefined ? true : walkable);
}

module.exports = Node;


/***/ }),

/***/ "2b2a":
/***/ (function(module, exports, __webpack_require__) {

var Util       = __webpack_require__("22b1");
var Heuristic  = __webpack_require__("1196");
var Node       = __webpack_require__("28e0");
var DiagonalMovement = __webpack_require__("8b6a");

/**
 * Iterative Deeping A Star (IDA*) path-finder.
 *
 * Recursion based on:
 *   http://www.apl.jhu.edu/~hall/AI-Programming/IDA-Star.html
 *
 * Path retracing based on:
 *  V. Nageshwara Rao, Vipin Kumar and K. Ramesh
 *  "A Parallel Implementation of Iterative-Deeping-A*", January 1987.
 *  ftp://ftp.cs.utexas.edu/.snapshot/hourly.1/pub/AI-Lab/tech-reports/UT-AI-TR-87-46.pdf
 *
 * @author Gerard Meier (www.gerardmeier.com)
 *
 * @constructor
 * @param {Object} opt
 * @param {boolean} opt.allowDiagonal Whether diagonal movement is allowed.
 *     Deprecated, use diagonalMovement instead.
 * @param {boolean} opt.dontCrossCorners Disallow diagonal movement touching
 *     block corners. Deprecated, use diagonalMovement instead.
 * @param {DiagonalMovement} opt.diagonalMovement Allowed diagonal movement.
 * @param {function} opt.heuristic Heuristic function to estimate the distance
 *     (defaults to manhattan).
 * @param {number} opt.weight Weight to apply to the heuristic to allow for
 *     suboptimal paths, in order to speed up the search.
 * @param {boolean} opt.trackRecursion Whether to track recursion for
 *     statistical purposes.
 * @param {number} opt.timeLimit Maximum execution time. Use <= 0 for infinite.
 */
function IDAStarFinder(opt) {
    opt = opt || {};
    this.allowDiagonal = opt.allowDiagonal;
    this.dontCrossCorners = opt.dontCrossCorners;
    this.diagonalMovement = opt.diagonalMovement;
    this.heuristic = opt.heuristic || Heuristic.manhattan;
    this.weight = opt.weight || 1;
    this.trackRecursion = opt.trackRecursion || false;
    this.timeLimit = opt.timeLimit || Infinity; // Default: no time limit.

    if (!this.diagonalMovement) {
        if (!this.allowDiagonal) {
            this.diagonalMovement = DiagonalMovement.Never;
        } else {
            if (this.dontCrossCorners) {
                this.diagonalMovement = DiagonalMovement.OnlyWhenNoObstacles;
            } else {
                this.diagonalMovement = DiagonalMovement.IfAtMostOneObstacle;
            }
        }
    }

    // When diagonal movement is allowed the manhattan heuristic is not
    // admissible, it should be octile instead
    if (this.diagonalMovement === DiagonalMovement.Never) {
        this.heuristic = opt.heuristic || Heuristic.manhattan;
    } else {
        this.heuristic = opt.heuristic || Heuristic.octile;
    }
}

/**
 * Find and return the the path. When an empty array is returned, either
 * no path is possible, or the maximum execution time is reached.
 *
 * @return {Array<Array<number>>} The path, including both start and
 *     end positions.
 */
IDAStarFinder.prototype.findPath = function(startX, startY, endX, endY, grid) {
    // Used for statistics:
    var nodesVisited = 0;

    // Execution time limitation:
    var startTime = new Date().getTime();

    // Heuristic helper:
    var h = function(a, b) {
        return this.heuristic(Math.abs(b.x - a.x), Math.abs(b.y - a.y));
    }.bind(this);

    // Step cost from a to b:
    var cost = function(a, b) {
        return (a.x === b.x || a.y === b.y) ? 1 : Math.SQRT2;
    };

    /**
     * IDA* search implementation.
     *
     * @param {Node} The node currently expanding from.
     * @param {number} Cost to reach the given node.
     * @param {number} Maximum search depth (cut-off value).
     * @param {Array<Array<number>>} The found route.
     * @param {number} Recursion depth.
     *
     * @return {Object} either a number with the new optimal cut-off depth,
     * or a valid node instance, in which case a path was found.
     */
    var search = function(node, g, cutoff, route, depth) {
        nodesVisited++;

        // Enforce timelimit:
        if (this.timeLimit > 0 &&
            new Date().getTime() - startTime > this.timeLimit * 1000) {
            // Enforced as "path-not-found".
            return Infinity;
        }

        var f = g + h(node, end) * this.weight;

        // We've searched too deep for this iteration.
        if (f > cutoff) {
            return f;
        }

        if (node == end) {
            route[depth] = [node.x, node.y];
            return node;
        }

        var min, t, k, neighbour;

        var neighbours = grid.getNeighbors(node, this.diagonalMovement);

        // Sort the neighbours, gives nicer paths. But, this deviates
        // from the original algorithm - so I left it out.
        //neighbours.sort(function(a, b){
        //    return h(a, end) - h(b, end);
        //});

        
        /*jshint -W084 *///Disable warning: Expected a conditional expression and instead saw an assignment
        for (k = 0, min = Infinity; neighbour = neighbours[k]; ++k) {
        /*jshint +W084 *///Enable warning: Expected a conditional expression and instead saw an assignment
            if (this.trackRecursion) {
                // Retain a copy for visualisation. Due to recursion, this
                // node may be part of other paths too.
                neighbour.retainCount = neighbour.retainCount + 1 || 1;

                if(neighbour.tested !== true) {
                    neighbour.tested = true;
                }
            }

            t = search(neighbour, g + cost(node, neighbour), cutoff, route, depth + 1);

            if (t instanceof Node) {
                route[depth] = [node.x, node.y];

                // For a typical A* linked list, this would work:
                // neighbour.parent = node;
                return t;
            }

            // Decrement count, then determine whether it's actually closed.
            if (this.trackRecursion && (--neighbour.retainCount) === 0) {
                neighbour.tested = false;
            }

            if (t < min) {
                min = t;
            }
        }

        return min;

    }.bind(this);

    // Node instance lookups:
    var start = grid.getNodeAt(startX, startY);
    var end   = grid.getNodeAt(endX, endY);

    // Initial search depth, given the typical heuristic contraints,
    // there should be no cheaper route possible.
    var cutOff = h(start, end);

    var j, route, t;

    // With an overflow protection.
    for (j = 0; true; ++j) {

        route = [];

        // Search till cut-off depth:
        t = search(start, 0, cutOff, route, 0);

        // Route not possible, or not found in time limit.
        if (t === Infinity) {
            return [];
        }

        // If t is a node, it's also the end node. Route is now
        // populated with a valid path to the end node.
        if (t instanceof Node) {
            return route;
        }

        // Try again, this time with a deeper cut-off. The t score
        // is the closest we got to the end node.
        cutOff = t;
    }

    // This _should_ never to be reached.
    return [];
};

module.exports = IDAStarFinder;


/***/ }),

/***/ "2ced":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PortDirection; });
var PortDirection;

(function (PortDirection) {
  PortDirection["TOP"] = "top";
  PortDirection["RIGHT"] = "right";
  PortDirection["BOTTOM"] = "bottom";
  PortDirection["LEFT"] = "left";
})(PortDirection || (PortDirection = {}));

/***/ }),

/***/ "2d00":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("da84");
var userAgent = __webpack_require__("342f");

var process = global.process;
var versions = process && process.versions;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  version = match[0] + match[1];
} else if (userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = match[1];
  }
}

module.exports = version && +version;


/***/ }),

/***/ "2d23":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Wrapper_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ba4c");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Wrapper_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Wrapper_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Wrapper_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "2f62":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/* unused harmony export Store */
/* unused harmony export install */
/* unused harmony export mapState */
/* unused harmony export mapMutations */
/* unused harmony export mapGetters */
/* unused harmony export mapActions */
/* unused harmony export createNamespacedHelpers */
/**
 * vuex v3.3.0
 * (c) 2020 Evan You
 * @license MIT
 */
function applyMixin (Vue) {
  var version = Number(Vue.version.split('.')[0]);

  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit });
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    var _init = Vue.prototype._init;
    Vue.prototype._init = function (options) {
      if ( options === void 0 ) options = {};

      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit;
      _init.call(this, options);
    };
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit () {
    var options = this.$options;
    // store injection
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store;
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store;
    }
  }
}

var target = typeof window !== 'undefined'
  ? window
  : typeof global !== 'undefined'
    ? global
    : {};
var devtoolHook = target.__VUE_DEVTOOLS_GLOBAL_HOOK__;

function devtoolPlugin (store) {
  if (!devtoolHook) { return }

  store._devtoolHook = devtoolHook;

  devtoolHook.emit('vuex:init', store);

  devtoolHook.on('vuex:travel-to-state', function (targetState) {
    store.replaceState(targetState);
  });

  store.subscribe(function (mutation, state) {
    devtoolHook.emit('vuex:mutation', mutation, state);
  }, { prepend: true });

  store.subscribeAction(function (action, state) {
    devtoolHook.emit('vuex:action', action, state);
  }, { prepend: true });
}

/**
 * Get the first item that pass the test
 * by second argument function
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */

/**
 * forEach for object
 */
function forEachValue (obj, fn) {
  Object.keys(obj).forEach(function (key) { return fn(obj[key], key); });
}

function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

function isPromise (val) {
  return val && typeof val.then === 'function'
}

function assert (condition, msg) {
  if (!condition) { throw new Error(("[vuex] " + msg)) }
}

function partial (fn, arg) {
  return function () {
    return fn(arg)
  }
}

// Base data struct for store's module, package with some attribute and method
var Module = function Module (rawModule, runtime) {
  this.runtime = runtime;
  // Store some children item
  this._children = Object.create(null);
  // Store the origin module object which passed by programmer
  this._rawModule = rawModule;
  var rawState = rawModule.state;

  // Store the origin module's state
  this.state = (typeof rawState === 'function' ? rawState() : rawState) || {};
};

var prototypeAccessors = { namespaced: { configurable: true } };

prototypeAccessors.namespaced.get = function () {
  return !!this._rawModule.namespaced
};

Module.prototype.addChild = function addChild (key, module) {
  this._children[key] = module;
};

Module.prototype.removeChild = function removeChild (key) {
  delete this._children[key];
};

Module.prototype.getChild = function getChild (key) {
  return this._children[key]
};

Module.prototype.hasChild = function hasChild (key) {
  return key in this._children
};

Module.prototype.update = function update (rawModule) {
  this._rawModule.namespaced = rawModule.namespaced;
  if (rawModule.actions) {
    this._rawModule.actions = rawModule.actions;
  }
  if (rawModule.mutations) {
    this._rawModule.mutations = rawModule.mutations;
  }
  if (rawModule.getters) {
    this._rawModule.getters = rawModule.getters;
  }
};

Module.prototype.forEachChild = function forEachChild (fn) {
  forEachValue(this._children, fn);
};

Module.prototype.forEachGetter = function forEachGetter (fn) {
  if (this._rawModule.getters) {
    forEachValue(this._rawModule.getters, fn);
  }
};

Module.prototype.forEachAction = function forEachAction (fn) {
  if (this._rawModule.actions) {
    forEachValue(this._rawModule.actions, fn);
  }
};

Module.prototype.forEachMutation = function forEachMutation (fn) {
  if (this._rawModule.mutations) {
    forEachValue(this._rawModule.mutations, fn);
  }
};

Object.defineProperties( Module.prototype, prototypeAccessors );

var ModuleCollection = function ModuleCollection (rawRootModule) {
  // register root module (Vuex.Store options)
  this.register([], rawRootModule, false);
};

ModuleCollection.prototype.get = function get (path) {
  return path.reduce(function (module, key) {
    return module.getChild(key)
  }, this.root)
};

ModuleCollection.prototype.getNamespace = function getNamespace (path) {
  var module = this.root;
  return path.reduce(function (namespace, key) {
    module = module.getChild(key);
    return namespace + (module.namespaced ? key + '/' : '')
  }, '')
};

ModuleCollection.prototype.update = function update$1 (rawRootModule) {
  update([], this.root, rawRootModule);
};

ModuleCollection.prototype.register = function register (path, rawModule, runtime) {
    var this$1 = this;
    if ( runtime === void 0 ) runtime = true;

  if (false) {}

  var newModule = new Module(rawModule, runtime);
  if (path.length === 0) {
    this.root = newModule;
  } else {
    var parent = this.get(path.slice(0, -1));
    parent.addChild(path[path.length - 1], newModule);
  }

  // register nested modules
  if (rawModule.modules) {
    forEachValue(rawModule.modules, function (rawChildModule, key) {
      this$1.register(path.concat(key), rawChildModule, runtime);
    });
  }
};

ModuleCollection.prototype.unregister = function unregister (path) {
  var parent = this.get(path.slice(0, -1));
  var key = path[path.length - 1];
  if (!parent.getChild(key).runtime) { return }

  parent.removeChild(key);
};

ModuleCollection.prototype.isRegistered = function isRegistered (path) {
  var parent = this.get(path.slice(0, -1));
  var key = path[path.length - 1];

  return parent.hasChild(key)
};

function update (path, targetModule, newModule) {
  if (false) {}

  // update target module
  targetModule.update(newModule);

  // update nested modules
  if (newModule.modules) {
    for (var key in newModule.modules) {
      if (!targetModule.getChild(key)) {
        if (false) {}
        return
      }
      update(
        path.concat(key),
        targetModule.getChild(key),
        newModule.modules[key]
      );
    }
  }
}

var functionAssert = {
  assert: function (value) { return typeof value === 'function'; },
  expected: 'function'
};

var objectAssert = {
  assert: function (value) { return typeof value === 'function' ||
    (typeof value === 'object' && typeof value.handler === 'function'); },
  expected: 'function or object with "handler" function'
};

var assertTypes = {
  getters: functionAssert,
  mutations: functionAssert,
  actions: objectAssert
};

function assertRawModule (path, rawModule) {
  Object.keys(assertTypes).forEach(function (key) {
    if (!rawModule[key]) { return }

    var assertOptions = assertTypes[key];

    forEachValue(rawModule[key], function (value, type) {
      assert(
        assertOptions.assert(value),
        makeAssertionMessage(path, key, type, value, assertOptions.expected)
      );
    });
  });
}

function makeAssertionMessage (path, key, type, value, expected) {
  var buf = key + " should be " + expected + " but \"" + key + "." + type + "\"";
  if (path.length > 0) {
    buf += " in module \"" + (path.join('.')) + "\"";
  }
  buf += " is " + (JSON.stringify(value)) + ".";
  return buf
}

var Vue; // bind on install

var Store = function Store (options) {
  var this$1 = this;
  if ( options === void 0 ) options = {};

  // Auto install if it is not done yet and `window` has `Vue`.
  // To allow users to avoid auto-installation in some cases,
  // this code should be placed here. See #731
  if (!Vue && typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
  }

  if (false) {}

  var plugins = options.plugins; if ( plugins === void 0 ) plugins = [];
  var strict = options.strict; if ( strict === void 0 ) strict = false;

  // store internal state
  this._committing = false;
  this._actions = Object.create(null);
  this._actionSubscribers = [];
  this._mutations = Object.create(null);
  this._wrappedGetters = Object.create(null);
  this._modules = new ModuleCollection(options);
  this._modulesNamespaceMap = Object.create(null);
  this._subscribers = [];
  this._watcherVM = new Vue();
  this._makeLocalGettersCache = Object.create(null);

  // bind commit and dispatch to self
  var store = this;
  var ref = this;
  var dispatch = ref.dispatch;
  var commit = ref.commit;
  this.dispatch = function boundDispatch (type, payload) {
    return dispatch.call(store, type, payload)
  };
  this.commit = function boundCommit (type, payload, options) {
    return commit.call(store, type, payload, options)
  };

  // strict mode
  this.strict = strict;

  var state = this._modules.root.state;

  // init root module.
  // this also recursively registers all sub-modules
  // and collects all module getters inside this._wrappedGetters
  installModule(this, state, [], this._modules.root);

  // initialize the store vm, which is responsible for the reactivity
  // (also registers _wrappedGetters as computed properties)
  resetStoreVM(this, state);

  // apply plugins
  plugins.forEach(function (plugin) { return plugin(this$1); });

  var useDevtools = options.devtools !== undefined ? options.devtools : Vue.config.devtools;
  if (useDevtools) {
    devtoolPlugin(this);
  }
};

var prototypeAccessors$1 = { state: { configurable: true } };

prototypeAccessors$1.state.get = function () {
  return this._vm._data.$$state
};

prototypeAccessors$1.state.set = function (v) {
  if (false) {}
};

Store.prototype.commit = function commit (_type, _payload, _options) {
    var this$1 = this;

  // check object-style commit
  var ref = unifyObjectStyle(_type, _payload, _options);
    var type = ref.type;
    var payload = ref.payload;
    var options = ref.options;

  var mutation = { type: type, payload: payload };
  var entry = this._mutations[type];
  if (!entry) {
    if (false) {}
    return
  }
  this._withCommit(function () {
    entry.forEach(function commitIterator (handler) {
      handler(payload);
    });
  });

  this._subscribers
    .slice() // shallow copy to prevent iterator invalidation if subscriber synchronously calls unsubscribe
    .forEach(function (sub) { return sub(mutation, this$1.state); });

  if (
    false
  ) {}
};

Store.prototype.dispatch = function dispatch (_type, _payload) {
    var this$1 = this;

  // check object-style dispatch
  var ref = unifyObjectStyle(_type, _payload);
    var type = ref.type;
    var payload = ref.payload;

  var action = { type: type, payload: payload };
  var entry = this._actions[type];
  if (!entry) {
    if (false) {}
    return
  }

  try {
    this._actionSubscribers
      .slice() // shallow copy to prevent iterator invalidation if subscriber synchronously calls unsubscribe
      .filter(function (sub) { return sub.before; })
      .forEach(function (sub) { return sub.before(action, this$1.state); });
  } catch (e) {
    if (false) {}
  }

  var result = entry.length > 1
    ? Promise.all(entry.map(function (handler) { return handler(payload); }))
    : entry[0](payload);

  return result.then(function (res) {
    try {
      this$1._actionSubscribers
        .filter(function (sub) { return sub.after; })
        .forEach(function (sub) { return sub.after(action, this$1.state); });
    } catch (e) {
      if (false) {}
    }
    return res
  })
};

Store.prototype.subscribe = function subscribe (fn, options) {
  return genericSubscribe(fn, this._subscribers, options)
};

Store.prototype.subscribeAction = function subscribeAction (fn, options) {
  var subs = typeof fn === 'function' ? { before: fn } : fn;
  return genericSubscribe(subs, this._actionSubscribers, options)
};

Store.prototype.watch = function watch (getter, cb, options) {
    var this$1 = this;

  if (false) {}
  return this._watcherVM.$watch(function () { return getter(this$1.state, this$1.getters); }, cb, options)
};

Store.prototype.replaceState = function replaceState (state) {
    var this$1 = this;

  this._withCommit(function () {
    this$1._vm._data.$$state = state;
  });
};

Store.prototype.registerModule = function registerModule (path, rawModule, options) {
    if ( options === void 0 ) options = {};

  if (typeof path === 'string') { path = [path]; }

  if (false) {}

  this._modules.register(path, rawModule);
  installModule(this, this.state, path, this._modules.get(path), options.preserveState);
  // reset store to update getters...
  resetStoreVM(this, this.state);
};

Store.prototype.unregisterModule = function unregisterModule (path) {
    var this$1 = this;

  if (typeof path === 'string') { path = [path]; }

  if (false) {}

  this._modules.unregister(path);
  this._withCommit(function () {
    var parentState = getNestedState(this$1.state, path.slice(0, -1));
    Vue.delete(parentState, path[path.length - 1]);
  });
  resetStore(this);
};

Store.prototype.hasModule = function hasModule (path) {
  if (typeof path === 'string') { path = [path]; }

  if (false) {}

  return this._modules.isRegistered(path)
};

Store.prototype.hotUpdate = function hotUpdate (newOptions) {
  this._modules.update(newOptions);
  resetStore(this, true);
};

Store.prototype._withCommit = function _withCommit (fn) {
  var committing = this._committing;
  this._committing = true;
  fn();
  this._committing = committing;
};

Object.defineProperties( Store.prototype, prototypeAccessors$1 );

function genericSubscribe (fn, subs, options) {
  if (subs.indexOf(fn) < 0) {
    options && options.prepend
      ? subs.unshift(fn)
      : subs.push(fn);
  }
  return function () {
    var i = subs.indexOf(fn);
    if (i > -1) {
      subs.splice(i, 1);
    }
  }
}

function resetStore (store, hot) {
  store._actions = Object.create(null);
  store._mutations = Object.create(null);
  store._wrappedGetters = Object.create(null);
  store._modulesNamespaceMap = Object.create(null);
  var state = store.state;
  // init all modules
  installModule(store, state, [], store._modules.root, true);
  // reset vm
  resetStoreVM(store, state, hot);
}

function resetStoreVM (store, state, hot) {
  var oldVm = store._vm;

  // bind store public getters
  store.getters = {};
  // reset local getters cache
  store._makeLocalGettersCache = Object.create(null);
  var wrappedGetters = store._wrappedGetters;
  var computed = {};
  forEachValue(wrappedGetters, function (fn, key) {
    // use computed to leverage its lazy-caching mechanism
    // direct inline function use will lead to closure preserving oldVm.
    // using partial to return function with only arguments preserved in closure environment.
    computed[key] = partial(fn, store);
    Object.defineProperty(store.getters, key, {
      get: function () { return store._vm[key]; },
      enumerable: true // for local getters
    });
  });

  // use a Vue instance to store the state tree
  // suppress warnings just in case the user has added
  // some funky global mixins
  var silent = Vue.config.silent;
  Vue.config.silent = true;
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed: computed
  });
  Vue.config.silent = silent;

  // enable strict mode for new vm
  if (store.strict) {
    enableStrictMode(store);
  }

  if (oldVm) {
    if (hot) {
      // dispatch changes in all subscribed watchers
      // to force getter re-evaluation for hot reloading.
      store._withCommit(function () {
        oldVm._data.$$state = null;
      });
    }
    Vue.nextTick(function () { return oldVm.$destroy(); });
  }
}

function installModule (store, rootState, path, module, hot) {
  var isRoot = !path.length;
  var namespace = store._modules.getNamespace(path);

  // register in namespace map
  if (module.namespaced) {
    if (store._modulesNamespaceMap[namespace] && "production" !== 'production') {
      console.error(("[vuex] duplicate namespace " + namespace + " for the namespaced module " + (path.join('/'))));
    }
    store._modulesNamespaceMap[namespace] = module;
  }

  // set state
  if (!isRoot && !hot) {
    var parentState = getNestedState(rootState, path.slice(0, -1));
    var moduleName = path[path.length - 1];
    store._withCommit(function () {
      if (false) {}
      Vue.set(parentState, moduleName, module.state);
    });
  }

  var local = module.context = makeLocalContext(store, namespace, path);

  module.forEachMutation(function (mutation, key) {
    var namespacedType = namespace + key;
    registerMutation(store, namespacedType, mutation, local);
  });

  module.forEachAction(function (action, key) {
    var type = action.root ? key : namespace + key;
    var handler = action.handler || action;
    registerAction(store, type, handler, local);
  });

  module.forEachGetter(function (getter, key) {
    var namespacedType = namespace + key;
    registerGetter(store, namespacedType, getter, local);
  });

  module.forEachChild(function (child, key) {
    installModule(store, rootState, path.concat(key), child, hot);
  });
}

/**
 * make localized dispatch, commit, getters and state
 * if there is no namespace, just use root ones
 */
function makeLocalContext (store, namespace, path) {
  var noNamespace = namespace === '';

  var local = {
    dispatch: noNamespace ? store.dispatch : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if (false) {}
      }

      return store.dispatch(type, payload)
    },

    commit: noNamespace ? store.commit : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if (false) {}
      }

      store.commit(type, payload, options);
    }
  };

  // getters and state object must be gotten lazily
  // because they will be changed by vm update
  Object.defineProperties(local, {
    getters: {
      get: noNamespace
        ? function () { return store.getters; }
        : function () { return makeLocalGetters(store, namespace); }
    },
    state: {
      get: function () { return getNestedState(store.state, path); }
    }
  });

  return local
}

function makeLocalGetters (store, namespace) {
  if (!store._makeLocalGettersCache[namespace]) {
    var gettersProxy = {};
    var splitPos = namespace.length;
    Object.keys(store.getters).forEach(function (type) {
      // skip if the target getter is not match this namespace
      if (type.slice(0, splitPos) !== namespace) { return }

      // extract local getter type
      var localType = type.slice(splitPos);

      // Add a port to the getters proxy.
      // Define as getter property because
      // we do not want to evaluate the getters in this time.
      Object.defineProperty(gettersProxy, localType, {
        get: function () { return store.getters[type]; },
        enumerable: true
      });
    });
    store._makeLocalGettersCache[namespace] = gettersProxy;
  }

  return store._makeLocalGettersCache[namespace]
}

function registerMutation (store, type, handler, local) {
  var entry = store._mutations[type] || (store._mutations[type] = []);
  entry.push(function wrappedMutationHandler (payload) {
    handler.call(store, local.state, payload);
  });
}

function registerAction (store, type, handler, local) {
  var entry = store._actions[type] || (store._actions[type] = []);
  entry.push(function wrappedActionHandler (payload) {
    var res = handler.call(store, {
      dispatch: local.dispatch,
      commit: local.commit,
      getters: local.getters,
      state: local.state,
      rootGetters: store.getters,
      rootState: store.state
    }, payload);
    if (!isPromise(res)) {
      res = Promise.resolve(res);
    }
    if (store._devtoolHook) {
      return res.catch(function (err) {
        store._devtoolHook.emit('vuex:error', err);
        throw err
      })
    } else {
      return res
    }
  });
}

function registerGetter (store, type, rawGetter, local) {
  if (store._wrappedGetters[type]) {
    if (false) {}
    return
  }
  store._wrappedGetters[type] = function wrappedGetter (store) {
    return rawGetter(
      local.state, // local state
      local.getters, // local getters
      store.state, // root state
      store.getters // root getters
    )
  };
}

function enableStrictMode (store) {
  store._vm.$watch(function () { return this._data.$$state }, function () {
    if (false) {}
  }, { deep: true, sync: true });
}

function getNestedState (state, path) {
  return path.reduce(function (state, key) { return state[key]; }, state)
}

function unifyObjectStyle (type, payload, options) {
  if (isObject(type) && type.type) {
    options = payload;
    payload = type;
    type = type.type;
  }

  if (false) {}

  return { type: type, payload: payload, options: options }
}

function install (_Vue) {
  if (Vue && _Vue === Vue) {
    if (false) {}
    return
  }
  Vue = _Vue;
  applyMixin(Vue);
}

/**
 * Reduce the code which written in Vue.js for getting the state.
 * @param {String} [namespace] - Module's namespace
 * @param {Object|Array} states # Object's item can be a function which accept state and getters for param, you can do something for state and getters in it.
 * @param {Object}
 */
var mapState = normalizeNamespace(function (namespace, states) {
  var res = {};
  if (false) {}
  normalizeMap(states).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedState () {
      var state = this.$store.state;
      var getters = this.$store.getters;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapState', namespace);
        if (!module) {
          return
        }
        state = module.context.state;
        getters = module.context.getters;
      }
      return typeof val === 'function'
        ? val.call(this, state, getters)
        : state[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

/**
 * Reduce the code which written in Vue.js for committing the mutation
 * @param {String} [namespace] - Module's namespace
 * @param {Object|Array} mutations # Object's item can be a function which accept `commit` function as the first param, it can accept anthor params. You can commit mutation and do any other things in this function. specially, You need to pass anthor params from the mapped function.
 * @return {Object}
 */
var mapMutations = normalizeNamespace(function (namespace, mutations) {
  var res = {};
  if (false) {}
  normalizeMap(mutations).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedMutation () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      // Get the commit method from store
      var commit = this.$store.commit;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapMutations', namespace);
        if (!module) {
          return
        }
        commit = module.context.commit;
      }
      return typeof val === 'function'
        ? val.apply(this, [commit].concat(args))
        : commit.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

/**
 * Reduce the code which written in Vue.js for getting the getters
 * @param {String} [namespace] - Module's namespace
 * @param {Object|Array} getters
 * @return {Object}
 */
var mapGetters = normalizeNamespace(function (namespace, getters) {
  var res = {};
  if (false) {}
  normalizeMap(getters).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    // The namespace has been mutated by normalizeNamespace
    val = namespace + val;
    res[key] = function mappedGetter () {
      if (namespace && !getModuleByNamespace(this.$store, 'mapGetters', namespace)) {
        return
      }
      if (false) {}
      return this.$store.getters[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

/**
 * Reduce the code which written in Vue.js for dispatch the action
 * @param {String} [namespace] - Module's namespace
 * @param {Object|Array} actions # Object's item can be a function which accept `dispatch` function as the first param, it can accept anthor params. You can dispatch action and do any other things in this function. specially, You need to pass anthor params from the mapped function.
 * @return {Object}
 */
var mapActions = normalizeNamespace(function (namespace, actions) {
  var res = {};
  if (false) {}
  normalizeMap(actions).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedAction () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      // get dispatch function from store
      var dispatch = this.$store.dispatch;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapActions', namespace);
        if (!module) {
          return
        }
        dispatch = module.context.dispatch;
      }
      return typeof val === 'function'
        ? val.apply(this, [dispatch].concat(args))
        : dispatch.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

/**
 * Rebinding namespace param for mapXXX function in special scoped, and return them by simple object
 * @param {String} namespace
 * @return {Object}
 */
var createNamespacedHelpers = function (namespace) { return ({
  mapState: mapState.bind(null, namespace),
  mapGetters: mapGetters.bind(null, namespace),
  mapMutations: mapMutations.bind(null, namespace),
  mapActions: mapActions.bind(null, namespace)
}); };

/**
 * Normalize the map
 * normalizeMap([1, 2, 3]) => [ { key: 1, val: 1 }, { key: 2, val: 2 }, { key: 3, val: 3 } ]
 * normalizeMap({a: 1, b: 2, c: 3}) => [ { key: 'a', val: 1 }, { key: 'b', val: 2 }, { key: 'c', val: 3 } ]
 * @param {Array|Object} map
 * @return {Object}
 */
function normalizeMap (map) {
  if (!isValidMap(map)) {
    return []
  }
  return Array.isArray(map)
    ? map.map(function (key) { return ({ key: key, val: key }); })
    : Object.keys(map).map(function (key) { return ({ key: key, val: map[key] }); })
}

/**
 * Validate whether given map is valid or not
 * @param {*} map
 * @return {Boolean}
 */
function isValidMap (map) {
  return Array.isArray(map) || isObject(map)
}

/**
 * Return a function expect two param contains namespace and map. it will normalize the namespace and then the param's function will handle the new namespace and the map.
 * @param {Function} fn
 * @return {Function}
 */
function normalizeNamespace (fn) {
  return function (namespace, map) {
    if (typeof namespace !== 'string') {
      map = namespace;
      namespace = '';
    } else if (namespace.charAt(namespace.length - 1) !== '/') {
      namespace += '/';
    }
    return fn(namespace, map)
  }
}

/**
 * Search a special module from store by namespace. if module not exist, print error message.
 * @param {Object} store
 * @param {String} helper
 * @param {String} namespace
 * @return {Object}
 */
function getModuleByNamespace (store, helper, namespace) {
  var module = store._modulesNamespaceMap[namespace];
  if (false) {}
  return module
}

var index_esm = {
  Store: Store,
  install: install,
  version: '3.3.0',
  mapState: mapState,
  mapMutations: mapMutations,
  mapGetters: mapGetters,
  mapActions: mapActions,
  createNamespacedHelpers: createNamespacedHelpers
};

/* harmony default export */ __webpack_exports__["a"] = (index_esm);


/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("c8ba")))

/***/ }),

/***/ "30ea":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Canvas_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("346a");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Canvas_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Canvas_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Canvas_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "313c":
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author imor / https://github.com/imor
 */
var Heap       = __webpack_require__("175a");
var Util       = __webpack_require__("22b1");
var Heuristic  = __webpack_require__("1196");
var DiagonalMovement = __webpack_require__("8b6a");

/**
 * Base class for the Jump Point Search algorithm
 * @param {object} opt
 * @param {function} opt.heuristic Heuristic function to estimate the distance
 *     (defaults to manhattan).
 */
function JumpPointFinderBase(opt) {
    opt = opt || {};
    this.heuristic = opt.heuristic || Heuristic.manhattan;
    this.trackJumpRecursion = opt.trackJumpRecursion || false;
}

/**
 * Find and return the path.
 * @return {Array<Array<number>>} The path, including both start and
 *     end positions.
 */
JumpPointFinderBase.prototype.findPath = function(startX, startY, endX, endY, grid) {
    var openList = this.openList = new Heap(function(nodeA, nodeB) {
            return nodeA.f - nodeB.f;
        }),
        startNode = this.startNode = grid.getNodeAt(startX, startY),
        endNode = this.endNode = grid.getNodeAt(endX, endY), node;

    this.grid = grid;


    // set the `g` and `f` value of the start node to be 0
    startNode.g = 0;
    startNode.f = 0;

    // push the start node into the open list
    openList.push(startNode);
    startNode.opened = true;

    // while the open list is not empty
    while (!openList.empty()) {
        // pop the position of node which has the minimum `f` value.
        node = openList.pop();
        node.closed = true;

        if (node === endNode) {
            return Util.expandPath(Util.backtrace(endNode));
        }

        this._identifySuccessors(node);
    }

    // fail to find the path
    return [];
};

/**
 * Identify successors for the given node. Runs a jump point search in the
 * direction of each available neighbor, adding any points found to the open
 * list.
 * @protected
 */
JumpPointFinderBase.prototype._identifySuccessors = function(node) {
    var grid = this.grid,
        heuristic = this.heuristic,
        openList = this.openList,
        endX = this.endNode.x,
        endY = this.endNode.y,
        neighbors, neighbor,
        jumpPoint, i, l,
        x = node.x, y = node.y,
        jx, jy, dx, dy, d, ng, jumpNode,
        abs = Math.abs, max = Math.max;

    neighbors = this._findNeighbors(node);
    for(i = 0, l = neighbors.length; i < l; ++i) {
        neighbor = neighbors[i];
        jumpPoint = this._jump(neighbor[0], neighbor[1], x, y);
        if (jumpPoint) {

            jx = jumpPoint[0];
            jy = jumpPoint[1];
            jumpNode = grid.getNodeAt(jx, jy);

            if (jumpNode.closed) {
                continue;
            }

            // include distance, as parent may not be immediately adjacent:
            d = Heuristic.octile(abs(jx - x), abs(jy - y));
            ng = node.g + d; // next `g` value

            if (!jumpNode.opened || ng < jumpNode.g) {
                jumpNode.g = ng;
                jumpNode.h = jumpNode.h || heuristic(abs(jx - endX), abs(jy - endY));
                jumpNode.f = jumpNode.g + jumpNode.h;
                jumpNode.parent = node;

                if (!jumpNode.opened) {
                    openList.push(jumpNode);
                    jumpNode.opened = true;
                } else {
                    openList.updateItem(jumpNode);
                }
            }
        }
    }
};

module.exports = JumpPointFinderBase;


/***/ }),

/***/ "342f":
/***/ (function(module, exports, __webpack_require__) {

var getBuiltIn = __webpack_require__("d066");

module.exports = getBuiltIn('navigator', 'userAgent') || '';


/***/ }),

/***/ "346a":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("4364");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__("499e").default
var update = add("4f622108", content, true, {"sourceMap":false,"shadowMode":false});

/***/ }),

/***/ "34a3":
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author imor / https://github.com/imor
 */
var JumpPointFinderBase = __webpack_require__("313c");
var DiagonalMovement = __webpack_require__("8b6a");

/**
 * Path finder using the Jump Point Search algorithm allowing only horizontal
 * or vertical movements.
 */
function JPFNeverMoveDiagonally(opt) {
    JumpPointFinderBase.call(this, opt);
}

JPFNeverMoveDiagonally.prototype = new JumpPointFinderBase();
JPFNeverMoveDiagonally.prototype.constructor = JPFNeverMoveDiagonally;

/**
 * Search recursively in the direction (parent -> child), stopping only when a
 * jump point is found.
 * @protected
 * @return {Array<Array<number>>} The x, y coordinate of the jump point
 *     found, or null if not found
 */
JPFNeverMoveDiagonally.prototype._jump = function(x, y, px, py) {
    var grid = this.grid,
        dx = x - px, dy = y - py;

    if (!grid.isWalkableAt(x, y)) {
        return null;
    }

    if(this.trackJumpRecursion === true) {
        grid.getNodeAt(x, y).tested = true;
    }

    if (grid.getNodeAt(x, y) === this.endNode) {
        return [x, y];
    }

    if (dx !== 0) {
        if ((grid.isWalkableAt(x, y - 1) && !grid.isWalkableAt(x - dx, y - 1)) ||
            (grid.isWalkableAt(x, y + 1) && !grid.isWalkableAt(x - dx, y + 1))) {
            return [x, y];
        }
    }
    else if (dy !== 0) {
        if ((grid.isWalkableAt(x - 1, y) && !grid.isWalkableAt(x - 1, y - dy)) ||
            (grid.isWalkableAt(x + 1, y) && !grid.isWalkableAt(x + 1, y - dy))) {
            return [x, y];
        }
        //When moving vertically, must check for horizontal jump points
        if (this._jump(x + 1, y, x, y) || this._jump(x - 1, y, x, y)) {
            return [x, y];
        }
    }
    else {
        throw new Error("Only horizontal and vertical movements are allowed");
    }

    return this._jump(x + dx, y + dy, x, y);
};

/**
 * Find the neighbors for the given node. If the node has a parent,
 * prune the neighbors based on the jump point search algorithm, otherwise
 * return all available neighbors.
 * @return {Array<Array<number>>} The neighbors found.
 */
JPFNeverMoveDiagonally.prototype._findNeighbors = function(node) {
    var parent = node.parent,
        x = node.x, y = node.y,
        grid = this.grid,
        px, py, nx, ny, dx, dy,
        neighbors = [], neighborNodes, neighborNode, i, l;

    // directed pruning: can ignore most neighbors, unless forced.
    if (parent) {
        px = parent.x;
        py = parent.y;
        // get the normalized direction of travel
        dx = (x - px) / Math.max(Math.abs(x - px), 1);
        dy = (y - py) / Math.max(Math.abs(y - py), 1);

        if (dx !== 0) {
            if (grid.isWalkableAt(x, y - 1)) {
                neighbors.push([x, y - 1]);
            }
            if (grid.isWalkableAt(x, y + 1)) {
                neighbors.push([x, y + 1]);
            }
            if (grid.isWalkableAt(x + dx, y)) {
                neighbors.push([x + dx, y]);
            }
        }
        else if (dy !== 0) {
            if (grid.isWalkableAt(x - 1, y)) {
                neighbors.push([x - 1, y]);
            }
            if (grid.isWalkableAt(x + 1, y)) {
                neighbors.push([x + 1, y]);
            }
            if (grid.isWalkableAt(x, y + dy)) {
                neighbors.push([x, y + dy]);
            }
        }
    }
    // return all neighbors
    else {
        neighborNodes = grid.getNeighbors(node, DiagonalMovement.Never);
        for (i = 0, l = neighborNodes.length; i < l; ++i) {
            neighborNode = neighborNodes[i];
            neighbors.push([neighborNode.x, neighborNode.y]);
        }
    }

    return neighbors;
};

module.exports = JPFNeverMoveDiagonally;


/***/ }),

/***/ "35a1":
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__("f5df");
var Iterators = __webpack_require__("3f8c");
var wellKnownSymbol = __webpack_require__("b622");

var ITERATOR = wellKnownSymbol('iterator');

module.exports = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),

/***/ "37e8":
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__("83ab");
var definePropertyModule = __webpack_require__("9bf2");
var anObject = __webpack_require__("825a");
var objectKeys = __webpack_require__("df75");

// `Object.defineProperties` method
// https://tc39.github.io/ecma262/#sec-object.defineproperties
module.exports = DESCRIPTORS ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) definePropertyModule.f(O, key = keys[index++], Properties[key]);
  return O;
};


/***/ }),

/***/ "38b7":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("e2aa");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__("499e").default
var update = add("4b55c83c", content, true, {"sourceMap":false,"shadowMode":false});

/***/ }),

/***/ "3bbe":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("861d");

module.exports = function (it) {
  if (!isObject(it) && it !== null) {
    throw TypeError("Can't set " + String(it) + ' as a prototype');
  } return it;
};


/***/ }),

/***/ "3ca3":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var charAt = __webpack_require__("6547").charAt;
var InternalStateModule = __webpack_require__("69f3");
var defineIterator = __webpack_require__("7dd0");

var STRING_ITERATOR = 'String Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(STRING_ITERATOR);

// `String.prototype[@@iterator]` method
// https://tc39.github.io/ecma262/#sec-string.prototype-@@iterator
defineIterator(String, 'String', function (iterated) {
  setInternalState(this, {
    type: STRING_ITERATOR,
    string: String(iterated),
    index: 0
  });
// `%StringIteratorPrototype%.next` method
// https://tc39.github.io/ecma262/#sec-%stringiteratorprototype%.next
}, function next() {
  var state = getInternalState(this);
  var string = state.string;
  var index = state.index;
  var point;
  if (index >= string.length) return { value: undefined, done: true };
  point = charAt(string, index);
  state.index += point.length;
  return { value: point, done: false };
});


/***/ }),

/***/ "3f6a":
/***/ (function(module, exports, __webpack_require__) {

var Heap       = __webpack_require__("175a");
var Util       = __webpack_require__("22b1");
var Heuristic  = __webpack_require__("1196");
var DiagonalMovement = __webpack_require__("8b6a");

/**
 * A* path-finder.
 * based upon https://github.com/bgrins/javascript-astar
 * @constructor
 * @param {Object} opt
 * @param {boolean} opt.allowDiagonal Whether diagonal movement is allowed.
 *     Deprecated, use diagonalMovement instead.
 * @param {boolean} opt.dontCrossCorners Disallow diagonal movement touching
 *     block corners. Deprecated, use diagonalMovement instead.
 * @param {DiagonalMovement} opt.diagonalMovement Allowed diagonal movement.
 * @param {function} opt.heuristic Heuristic function to estimate the distance
 *     (defaults to manhattan).
 * @param {number} opt.weight Weight to apply to the heuristic to allow for
 *     suboptimal paths, in order to speed up the search.
 */
function BiAStarFinder(opt) {
    opt = opt || {};
    this.allowDiagonal = opt.allowDiagonal;
    this.dontCrossCorners = opt.dontCrossCorners;
    this.diagonalMovement = opt.diagonalMovement;
    this.heuristic = opt.heuristic || Heuristic.manhattan;
    this.weight = opt.weight || 1;

    if (!this.diagonalMovement) {
        if (!this.allowDiagonal) {
            this.diagonalMovement = DiagonalMovement.Never;
        } else {
            if (this.dontCrossCorners) {
                this.diagonalMovement = DiagonalMovement.OnlyWhenNoObstacles;
            } else {
                this.diagonalMovement = DiagonalMovement.IfAtMostOneObstacle;
            }
        }
    }

    //When diagonal movement is allowed the manhattan heuristic is not admissible
    //It should be octile instead
    if (this.diagonalMovement === DiagonalMovement.Never) {
        this.heuristic = opt.heuristic || Heuristic.manhattan;
    } else {
        this.heuristic = opt.heuristic || Heuristic.octile;
    }
}

/**
 * Find and return the the path.
 * @return {Array<Array<number>>} The path, including both start and
 *     end positions.
 */
BiAStarFinder.prototype.findPath = function(startX, startY, endX, endY, grid) {
    var cmp = function(nodeA, nodeB) {
            return nodeA.f - nodeB.f;
        },
        startOpenList = new Heap(cmp),
        endOpenList = new Heap(cmp),
        startNode = grid.getNodeAt(startX, startY),
        endNode = grid.getNodeAt(endX, endY),
        heuristic = this.heuristic,
        diagonalMovement = this.diagonalMovement,
        weight = this.weight,
        abs = Math.abs, SQRT2 = Math.SQRT2,
        node, neighbors, neighbor, i, l, x, y, ng,
        BY_START = 1, BY_END = 2;

    // set the `g` and `f` value of the start node to be 0
    // and push it into the start open list
    startNode.g = 0;
    startNode.f = 0;
    startOpenList.push(startNode);
    startNode.opened = BY_START;

    // set the `g` and `f` value of the end node to be 0
    // and push it into the open open list
    endNode.g = 0;
    endNode.f = 0;
    endOpenList.push(endNode);
    endNode.opened = BY_END;

    // while both the open lists are not empty
    while (!startOpenList.empty() && !endOpenList.empty()) {

        // pop the position of start node which has the minimum `f` value.
        node = startOpenList.pop();
        node.closed = true;

        // get neigbours of the current node
        neighbors = grid.getNeighbors(node, diagonalMovement);
        for (i = 0, l = neighbors.length; i < l; ++i) {
            neighbor = neighbors[i];

            if (neighbor.closed) {
                continue;
            }
            if (neighbor.opened === BY_END) {
                return Util.biBacktrace(node, neighbor);
            }

            x = neighbor.x;
            y = neighbor.y;

            // get the distance between current node and the neighbor
            // and calculate the next g score
            ng = node.g + ((x - node.x === 0 || y - node.y === 0) ? 1 : SQRT2);

            // check if the neighbor has not been inspected yet, or
            // can be reached with smaller cost from the current node
            if (!neighbor.opened || ng < neighbor.g) {
                neighbor.g = ng;
                neighbor.h = neighbor.h ||
                    weight * heuristic(abs(x - endX), abs(y - endY));
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.parent = node;

                if (!neighbor.opened) {
                    startOpenList.push(neighbor);
                    neighbor.opened = BY_START;
                } else {
                    // the neighbor can be reached with smaller cost.
                    // Since its f value has been updated, we have to
                    // update its position in the open list
                    startOpenList.updateItem(neighbor);
                }
            }
        } // end for each neighbor


        // pop the position of end node which has the minimum `f` value.
        node = endOpenList.pop();
        node.closed = true;

        // get neigbours of the current node
        neighbors = grid.getNeighbors(node, diagonalMovement);
        for (i = 0, l = neighbors.length; i < l; ++i) {
            neighbor = neighbors[i];

            if (neighbor.closed) {
                continue;
            }
            if (neighbor.opened === BY_START) {
                return Util.biBacktrace(neighbor, node);
            }

            x = neighbor.x;
            y = neighbor.y;

            // get the distance between current node and the neighbor
            // and calculate the next g score
            ng = node.g + ((x - node.x === 0 || y - node.y === 0) ? 1 : SQRT2);

            // check if the neighbor has not been inspected yet, or
            // can be reached with smaller cost from the current node
            if (!neighbor.opened || ng < neighbor.g) {
                neighbor.g = ng;
                neighbor.h = neighbor.h ||
                    weight * heuristic(abs(x - startX), abs(y - startY));
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.parent = node;

                if (!neighbor.opened) {
                    endOpenList.push(neighbor);
                    neighbor.opened = BY_END;
                } else {
                    // the neighbor can be reached with smaller cost.
                    // Since its f value has been updated, we have to
                    // update its position in the open list
                    endOpenList.updateItem(neighbor);
                }
            }
        } // end for each neighbor
    } // end while not open list empty

    // fail to find the path
    return [];
};

module.exports = BiAStarFinder;


/***/ }),

/***/ "3f8c":
/***/ (function(module, exports) {

module.exports = {};


/***/ }),

/***/ "408b":
/***/ (function(module, exports) {

module.exports = Transform;

function Transform() {
  this.x = 0;
  this.y = 0;
  this.scale = 1;
}


/***/ }),

/***/ "4160":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("23e7");
var forEach = __webpack_require__("17c2");

// `Array.prototype.forEach` method
// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
$({ target: 'Array', proto: true, forced: [].forEach != forEach }, {
  forEach: forEach
});


/***/ }),

/***/ "428f":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("da84");

module.exports = global;


/***/ }),

/***/ "434c":
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__("24fb");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".node-wrapper{display:inline-block;position:absolute}", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "4364":
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__("24fb");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".canvas{overflow:hidden;width:100%}.canvas__inner{cursor:move;position:relative}", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "44ad":
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__("d039");
var classof = __webpack_require__("c6b6");

var split = ''.split;

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins
  return !Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) == 'String' ? split.call(it, '') : Object(it);
} : Object;


/***/ }),

/***/ "44d2":
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__("b622");
var create = __webpack_require__("7c73");
var definePropertyModule = __webpack_require__("9bf2");

var UNSCOPABLES = wellKnownSymbol('unscopables');
var ArrayPrototype = Array.prototype;

// Array.prototype[@@unscopables]
// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
if (ArrayPrototype[UNSCOPABLES] == undefined) {
  definePropertyModule.f(ArrayPrototype, UNSCOPABLES, {
    configurable: true,
    value: create(null)
  });
}

// add a key to Array.prototype[@@unscopables]
module.exports = function (key) {
  ArrayPrototype[UNSCOPABLES][key] = true;
};


/***/ }),

/***/ "4930":
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__("d039");

module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  // Chrome 38 Symbol has incorrect toString conversion
  // eslint-disable-next-line no-undef
  return !String(Symbol());
});


/***/ }),

/***/ "499e":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "default", function() { return /* binding */ addStylesClient; });

// CONCATENATED MODULE: ./node_modules/vue-style-loader/lib/listToStyles.js
/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}

// CONCATENATED MODULE: ./node_modules/vue-style-loader/lib/addStylesClient.js
/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/



var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}
var options = null
var ssrIdKey = 'data-vue-ssr-id'

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

function addStylesClient (parentId, list, _isProduction, _options) {
  isProduction = _isProduction

  options = _options || {}

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[' + ssrIdKey + '~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }
  if (options.ssrId) {
    styleElement.setAttribute(ssrIdKey, obj.id)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),

/***/ "4d64":
/***/ (function(module, exports, __webpack_require__) {

var toIndexedObject = __webpack_require__("fc6a");
var toLength = __webpack_require__("50c4");
var toAbsoluteIndex = __webpack_require__("23cb");

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

module.exports = {
  // `Array.prototype.includes` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};


/***/ }),

/***/ "4de4":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("23e7");
var $filter = __webpack_require__("b727").filter;
var arrayMethodHasSpeciesSupport = __webpack_require__("1dde");
var arrayMethodUsesToLength = __webpack_require__("ae40");

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('filter');
// Edge 14- issue
var USES_TO_LENGTH = arrayMethodUsesToLength('filter');

// `Array.prototype.filter` method
// https://tc39.github.io/ecma262/#sec-array.prototype.filter
// with adding support of @@species
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH }, {
  filter: function filter(callbackfn /* , thisArg */) {
    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),

/***/ "4df4":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var bind = __webpack_require__("0366");
var toObject = __webpack_require__("7b0b");
var callWithSafeIterationClosing = __webpack_require__("9bdd");
var isArrayIteratorMethod = __webpack_require__("e95a");
var toLength = __webpack_require__("50c4");
var createProperty = __webpack_require__("8418");
var getIteratorMethod = __webpack_require__("35a1");

// `Array.from` method implementation
// https://tc39.github.io/ecma262/#sec-array.from
module.exports = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
  var O = toObject(arrayLike);
  var C = typeof this == 'function' ? this : Array;
  var argumentsLength = arguments.length;
  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
  var mapping = mapfn !== undefined;
  var iteratorMethod = getIteratorMethod(O);
  var index = 0;
  var length, result, step, iterator, next, value;
  if (mapping) mapfn = bind(mapfn, argumentsLength > 2 ? arguments[2] : undefined, 2);
  // if the target is not iterable or it's an array with the default iterator - use a simple case
  if (iteratorMethod != undefined && !(C == Array && isArrayIteratorMethod(iteratorMethod))) {
    iterator = iteratorMethod.call(O);
    next = iterator.next;
    result = new C();
    for (;!(step = next.call(iterator)).done; index++) {
      value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
      createProperty(result, index, value);
    }
  } else {
    length = toLength(O.length);
    result = new C(length);
    for (;length > index; index++) {
      value = mapping ? mapfn(O[index], index) : O[index];
      createProperty(result, index, value);
    }
  }
  result.length = index;
  return result;
};


/***/ }),

/***/ "4fad":
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__("23e7");
var $entries = __webpack_require__("6f53").entries;

// `Object.entries` method
// https://tc39.github.io/ecma262/#sec-object.entries
$({ target: 'Object', stat: true }, {
  entries: function entries(O) {
    return $entries(O);
  }
});


/***/ }),

/***/ "50c4":
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__("a691");

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.github.io/ecma262/#sec-tolength
module.exports = function (argument) {
  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};


/***/ }),

/***/ "5135":
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;

module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),

/***/ "5647":
/***/ (function(module, exports) {

module.exports = makeDomController

module.exports.canAttach = isDomElement;

function makeDomController(domElement, options) {
  var elementValid = isDomElement(domElement); 
  if (!elementValid) {
    throw new Error('panzoom requires DOM element to be attached to the DOM tree')
  }

  var owner = domElement.parentElement;
  domElement.scrollTop = 0;
  
  if (!options.disableKeyboardInteraction) {
    owner.setAttribute('tabindex', 0);
  }

  var api = {
    getBBox: getBBox,
    getOwner: getOwner,
    applyTransform: applyTransform,
  }
  
  return api

  function getOwner() {
    return owner
  }

  function getBBox() {
    // TODO: We should probably cache this?
    return  {
      left: 0,
      top: 0,
      width: domElement.clientWidth,
      height: domElement.clientHeight
    }
  }

  function applyTransform(transform) {
    // TODO: Should we cache this?
    domElement.style.transformOrigin = '0 0 0';
    domElement.style.transform = 'matrix(' +
      transform.scale + ', 0, 0, ' +
      transform.scale + ', ' +
      transform.x + ', ' + transform.y + ')'
  }
}

function isDomElement(element) {
  return element && element.parentElement && element.style;
}


/***/ }),

/***/ "5692":
/***/ (function(module, exports, __webpack_require__) {

var IS_PURE = __webpack_require__("c430");
var store = __webpack_require__("c6cd");

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.6.5',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
});


/***/ }),

/***/ "56ef":
/***/ (function(module, exports, __webpack_require__) {

var getBuiltIn = __webpack_require__("d066");
var getOwnPropertyNamesModule = __webpack_require__("241c");
var getOwnPropertySymbolsModule = __webpack_require__("7418");
var anObject = __webpack_require__("825a");

// all object keys, includes non-enumerable and symbols
module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
};


/***/ }),

/***/ "5899":
/***/ (function(module, exports) {

// a string of all valid unicode whitespaces
// eslint-disable-next-line max-len
module.exports = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';


/***/ }),

/***/ "58a8":
/***/ (function(module, exports, __webpack_require__) {

var requireObjectCoercible = __webpack_require__("1d80");
var whitespaces = __webpack_require__("5899");

var whitespace = '[' + whitespaces + ']';
var ltrim = RegExp('^' + whitespace + whitespace + '*');
var rtrim = RegExp(whitespace + whitespace + '*$');

// `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
var createMethod = function (TYPE) {
  return function ($this) {
    var string = String(requireObjectCoercible($this));
    if (TYPE & 1) string = string.replace(ltrim, '');
    if (TYPE & 2) string = string.replace(rtrim, '');
    return string;
  };
};

module.exports = {
  // `String.prototype.{ trimLeft, trimStart }` methods
  // https://tc39.github.io/ecma262/#sec-string.prototype.trimstart
  start: createMethod(1),
  // `String.prototype.{ trimRight, trimEnd }` methods
  // https://tc39.github.io/ecma262/#sec-string.prototype.trimend
  end: createMethod(2),
  // `String.prototype.trim` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.trim
  trim: createMethod(3)
};


/***/ }),

/***/ "5c6c":
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ "5e89":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("861d");

var floor = Math.floor;

// `Number.isInteger` method implementation
// https://tc39.github.io/ecma262/#sec-number.isinteger
module.exports = function isInteger(it) {
  return !isObject(it) && isFinite(it) && floor(it) === it;
};


/***/ }),

/***/ "62e4":
/***/ (function(module, exports) {

module.exports = function(module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),

/***/ "6547":
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__("a691");
var requireObjectCoercible = __webpack_require__("1d80");

// `String.prototype.{ codePointAt, at }` methods implementation
var createMethod = function (CONVERT_TO_STRING) {
  return function ($this, pos) {
    var S = String(requireObjectCoercible($this));
    var position = toInteger(pos);
    var size = S.length;
    var first, second;
    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
    first = S.charCodeAt(position);
    return first < 0xD800 || first > 0xDBFF || position + 1 === size
      || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
        ? CONVERT_TO_STRING ? S.charAt(position) : first
        : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
  };
};

module.exports = {
  // `String.prototype.codePointAt` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
  codeAt: createMethod(false),
  // `String.prototype.at` method
  // https://github.com/mathiasbynens/String.prototype.at
  charAt: createMethod(true)
};


/***/ }),

/***/ "65f0":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("861d");
var isArray = __webpack_require__("e8b5");
var wellKnownSymbol = __webpack_require__("b622");

var SPECIES = wellKnownSymbol('species');

// `ArraySpeciesCreate` abstract operation
// https://tc39.github.io/ecma262/#sec-arrayspeciescreate
module.exports = function (originalArray, length) {
  var C;
  if (isArray(originalArray)) {
    C = originalArray.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    else if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
};


/***/ }),

/***/ "698f":
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__("24fb");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".node__default{background-color:#fff}", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "69f3":
/***/ (function(module, exports, __webpack_require__) {

var NATIVE_WEAK_MAP = __webpack_require__("7f9a");
var global = __webpack_require__("da84");
var isObject = __webpack_require__("861d");
var createNonEnumerableProperty = __webpack_require__("9112");
var objectHas = __webpack_require__("5135");
var sharedKey = __webpack_require__("f772");
var hiddenKeys = __webpack_require__("d012");

var WeakMap = global.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP) {
  var store = new WeakMap();
  var wmget = store.get;
  var wmhas = store.has;
  var wmset = store.set;
  set = function (it, metadata) {
    wmset.call(store, it, metadata);
    return metadata;
  };
  get = function (it) {
    return wmget.call(store, it) || {};
  };
  has = function (it) {
    return wmhas.call(store, it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return objectHas(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return objectHas(it, STATE);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};


/***/ }),

/***/ "6bb2":
/***/ (function(module, exports) {



/***/ }),

/***/ "6eeb":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("da84");
var createNonEnumerableProperty = __webpack_require__("9112");
var has = __webpack_require__("5135");
var setGlobal = __webpack_require__("ce4e");
var inspectSource = __webpack_require__("8925");
var InternalStateModule = __webpack_require__("69f3");

var getInternalState = InternalStateModule.get;
var enforceInternalState = InternalStateModule.enforce;
var TEMPLATE = String(String).split('String');

(module.exports = function (O, key, value, options) {
  var unsafe = options ? !!options.unsafe : false;
  var simple = options ? !!options.enumerable : false;
  var noTargetGet = options ? !!options.noTargetGet : false;
  if (typeof value == 'function') {
    if (typeof key == 'string' && !has(value, 'name')) createNonEnumerableProperty(value, 'name', key);
    enforceInternalState(value).source = TEMPLATE.join(typeof key == 'string' ? key : '');
  }
  if (O === global) {
    if (simple) O[key] = value;
    else setGlobal(key, value);
    return;
  } else if (!unsafe) {
    delete O[key];
  } else if (!noTargetGet && O[key]) {
    simple = true;
  }
  if (simple) O[key] = value;
  else createNonEnumerableProperty(O, key, value);
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, 'toString', function toString() {
  return typeof this == 'function' && getInternalState(this).source || inspectSource(this);
});


/***/ }),

/***/ "6f53":
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__("83ab");
var objectKeys = __webpack_require__("df75");
var toIndexedObject = __webpack_require__("fc6a");
var propertyIsEnumerable = __webpack_require__("d1e7").f;

// `Object.{ entries, values }` methods implementation
var createMethod = function (TO_ENTRIES) {
  return function (it) {
    var O = toIndexedObject(it);
    var keys = objectKeys(O);
    var length = keys.length;
    var i = 0;
    var result = [];
    var key;
    while (length > i) {
      key = keys[i++];
      if (!DESCRIPTORS || propertyIsEnumerable.call(O, key)) {
        result.push(TO_ENTRIES ? [key, O[key]] : O[key]);
      }
    }
    return result;
  };
};

module.exports = {
  // `Object.entries` method
  // https://tc39.github.io/ecma262/#sec-object.entries
  entries: createMethod(true),
  // `Object.values` method
  // https://tc39.github.io/ecma262/#sec-object.values
  values: createMethod(false)
};


/***/ }),

/***/ "7079":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("698f");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__("499e").default
var update = add("803c0b78", content, true, {"sourceMap":false,"shadowMode":false});

/***/ }),

/***/ "7156":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("861d");
var setPrototypeOf = __webpack_require__("d2bb");

// makes subclassing work correct for wrapped built-ins
module.exports = function ($this, dummy, Wrapper) {
  var NewTarget, NewTargetPrototype;
  if (
    // it can work only with native `setPrototypeOf`
    setPrototypeOf &&
    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
    typeof (NewTarget = dummy.constructor) == 'function' &&
    NewTarget !== Wrapper &&
    isObject(NewTargetPrototype = NewTarget.prototype) &&
    NewTargetPrototype !== Wrapper.prototype
  ) setPrototypeOf($this, NewTargetPrototype);
  return $this;
};


/***/ }),

/***/ "719c":
/***/ (function(module, exports, __webpack_require__) {

var Util = __webpack_require__("22b1");
var DiagonalMovement = __webpack_require__("8b6a");

/**
 * Breadth-First-Search path finder.
 * @constructor
 * @param {Object} opt
 * @param {boolean} opt.allowDiagonal Whether diagonal movement is allowed.
 *     Deprecated, use diagonalMovement instead.
 * @param {boolean} opt.dontCrossCorners Disallow diagonal movement touching
 *     block corners. Deprecated, use diagonalMovement instead.
 * @param {DiagonalMovement} opt.diagonalMovement Allowed diagonal movement.
 */
function BreadthFirstFinder(opt) {
    opt = opt || {};
    this.allowDiagonal = opt.allowDiagonal;
    this.dontCrossCorners = opt.dontCrossCorners;
    this.diagonalMovement = opt.diagonalMovement;

    if (!this.diagonalMovement) {
        if (!this.allowDiagonal) {
            this.diagonalMovement = DiagonalMovement.Never;
        } else {
            if (this.dontCrossCorners) {
                this.diagonalMovement = DiagonalMovement.OnlyWhenNoObstacles;
            } else {
                this.diagonalMovement = DiagonalMovement.IfAtMostOneObstacle;
            }
        }
    }
}

/**
 * Find and return the the path.
 * @return {Array<Array<number>>} The path, including both start and
 *     end positions.
 */
BreadthFirstFinder.prototype.findPath = function(startX, startY, endX, endY, grid) {
    var openList = [],
        diagonalMovement = this.diagonalMovement,
        startNode = grid.getNodeAt(startX, startY),
        endNode = grid.getNodeAt(endX, endY),
        neighbors, neighbor, node, i, l;

    // push the start pos into the queue
    openList.push(startNode);
    startNode.opened = true;

    // while the queue is not empty
    while (openList.length) {
        // take the front node from the queue
        node = openList.shift();
        node.closed = true;

        // reached the end position
        if (node === endNode) {
            return Util.backtrace(endNode);
        }

        neighbors = grid.getNeighbors(node, diagonalMovement);
        for (i = 0, l = neighbors.length; i < l; ++i) {
            neighbor = neighbors[i];

            // skip this neighbor if it has been inspected before
            if (neighbor.closed || neighbor.opened) {
                continue;
            }

            openList.push(neighbor);
            neighbor.opened = true;
            neighbor.parent = node;
        }
    }
    
    // fail to find the path
    return [];
};

module.exports = BreadthFirstFinder;


/***/ }),

/***/ "7418":
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ "746f":
/***/ (function(module, exports, __webpack_require__) {

var path = __webpack_require__("428f");
var has = __webpack_require__("5135");
var wrappedWellKnownSymbolModule = __webpack_require__("e538");
var defineProperty = __webpack_require__("9bf2").f;

module.exports = function (NAME) {
  var Symbol = path.Symbol || (path.Symbol = {});
  if (!has(Symbol, NAME)) defineProperty(Symbol, NAME, {
    value: wrappedWellKnownSymbolModule.f(NAME)
  });
};


/***/ }),

/***/ "7708":
/***/ (function(module, exports, __webpack_require__) {

var BezierEasing = __webpack_require__("d138")

// Predefined set of animations. Similar to CSS easing functions
var animations = {
  ease:  BezierEasing(0.25, 0.1, 0.25, 1),
  easeIn: BezierEasing(0.42, 0, 1, 1),
  easeOut: BezierEasing(0, 0, 0.58, 1),
  easeInOut: BezierEasing(0.42, 0, 0.58, 1),
  linear: BezierEasing(0, 0, 1, 1)
}


module.exports = animate;
module.exports.makeAggregateRaf = makeAggregateRaf;
module.exports.sharedScheduler = makeAggregateRaf();


function animate(source, target, options) {
  var start = Object.create(null)
  var diff = Object.create(null)
  options = options || {}
  // We let clients specify their own easing function
  var easing = (typeof options.easing === 'function') ? options.easing : animations[options.easing]

  // if nothing is specified, default to ease (similar to CSS animations)
  if (!easing) {
    if (options.easing) {
      console.warn('Unknown easing function in amator: ' + options.easing);
    }
    easing = animations.ease
  }

  var step = typeof options.step === 'function' ? options.step : noop
  var done = typeof options.done === 'function' ? options.done : noop

  var scheduler = getScheduler(options.scheduler)

  var keys = Object.keys(target)
  keys.forEach(function(key) {
    start[key] = source[key]
    diff[key] = target[key] - source[key]
  })

  var durationInMs = typeof options.duration === 'number' ? options.duration : 400
  var durationInFrames = Math.max(1, durationInMs * 0.06) // 0.06 because 60 frames pers 1,000 ms
  var previousAnimationId
  var frame = 0

  previousAnimationId = scheduler.next(loop)

  return {
    cancel: cancel
  }

  function cancel() {
    scheduler.cancel(previousAnimationId)
    previousAnimationId = 0
  }

  function loop() {
    var t = easing(frame/durationInFrames)
    frame += 1
    setValues(t)
    if (frame <= durationInFrames) {
      previousAnimationId = scheduler.next(loop)
      step(source)
    } else {
      previousAnimationId = 0
      setTimeout(function() { done(source) }, 0)
    }
  }

  function setValues(t) {
    keys.forEach(function(key) {
      source[key] = diff[key] * t + start[key]
    })
  }
}

function noop() { }

function getScheduler(scheduler) {
  if (!scheduler) {
    var canRaf = typeof window !== 'undefined' && window.requestAnimationFrame
    return canRaf ? rafScheduler() : timeoutScheduler()
  }
  if (typeof scheduler.next !== 'function') throw new Error('Scheduler is supposed to have next(cb) function')
  if (typeof scheduler.cancel !== 'function') throw new Error('Scheduler is supposed to have cancel(handle) function')

  return scheduler
}

function rafScheduler() {
  return {
    next: window.requestAnimationFrame.bind(window),
    cancel: window.cancelAnimationFrame.bind(window)
  }
}

function timeoutScheduler() {
  return {
    next: function(cb) {
      return setTimeout(cb, 1000/60)
    },
    cancel: function (id) {
      return clearTimeout(id)
    }
  }
}

function makeAggregateRaf() {
  var frontBuffer = new Set();
  var backBuffer = new Set();
  var frameToken = 0;

  return {
    next: next,
    cancel: next,
    clearAll: clearAll
  }

  function clearAll() {
    frontBuffer.clear();
    backBuffer.clear();
    cancelAnimationFrame(frameToken);
    frameToken = 0;
  }

  function next(callback) {
    backBuffer.add(callback);
    renderNextFrame();
  }

  function renderNextFrame() {
    if (!frameToken) frameToken = requestAnimationFrame(renderFrame);
  }

  function renderFrame() {
    frameToken = 0;

    var t = backBuffer;
    backBuffer = frontBuffer;
    frontBuffer = t;

    frontBuffer.forEach(function(callback) {
      callback();
    });
    frontBuffer.clear();
  }

  function cancel(callback) {
    backBuffer.delete(callback);
  }
}


/***/ }),

/***/ "7839":
/***/ (function(module, exports) {

// IE8- don't enum bug keys
module.exports = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];


/***/ }),

/***/ "7a96":
/***/ (function(module, exports, __webpack_require__) {

var BiAStarFinder = __webpack_require__("3f6a");

/**
 * Bi-directional Dijkstra path-finder.
 * @constructor
 * @extends BiAStarFinder
 * @param {Object} opt
 * @param {boolean} opt.allowDiagonal Whether diagonal movement is allowed.
 *     Deprecated, use diagonalMovement instead.
 * @param {boolean} opt.dontCrossCorners Disallow diagonal movement touching
 *     block corners. Deprecated, use diagonalMovement instead.
 * @param {DiagonalMovement} opt.diagonalMovement Allowed diagonal movement.
 */
function BiDijkstraFinder(opt) {
    BiAStarFinder.call(this, opt);
    this.heuristic = function(dx, dy) {
        return 0;
    };
}

BiDijkstraFinder.prototype = new BiAStarFinder();
BiDijkstraFinder.prototype.constructor = BiDijkstraFinder;

module.exports = BiDijkstraFinder;


/***/ }),

/***/ "7b0b":
/***/ (function(module, exports, __webpack_require__) {

var requireObjectCoercible = __webpack_require__("1d80");

// `ToObject` abstract operation
// https://tc39.github.io/ecma262/#sec-toobject
module.exports = function (argument) {
  return Object(requireObjectCoercible(argument));
};


/***/ }),

/***/ "7c73":
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__("825a");
var defineProperties = __webpack_require__("37e8");
var enumBugKeys = __webpack_require__("7839");
var hiddenKeys = __webpack_require__("d012");
var html = __webpack_require__("1be4");
var documentCreateElement = __webpack_require__("cc12");
var sharedKey = __webpack_require__("f772");

var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO = sharedKey('IE_PROTO');

var EmptyConstructor = function () { /* empty */ };

var scriptTag = function (content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX = function (activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  activeXDocument = null; // avoid memory leak
  return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  // https://github.com/zloirock/core-js/issues/475
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
var activeXDocument;
var NullProtoObject = function () {
  try {
    /* global ActiveXObject */
    activeXDocument = document.domain && new ActiveXObject('htmlfile');
  } catch (error) { /* ignore */ }
  NullProtoObject = activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame();
  var length = enumBugKeys.length;
  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  return NullProtoObject();
};

hiddenKeys[IE_PROTO] = true;

// `Object.create` method
// https://tc39.github.io/ecma262/#sec-object.create
module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : defineProperties(result, Properties);
};


/***/ }),

/***/ "7d05":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Allows to drag and zoom svg elements
 */
var wheel = __webpack_require__("7d67");
var animate = __webpack_require__("7708");
var eventify = __webpack_require__("00c7");
var kinetic = __webpack_require__("e9ff");
var createTextSelectionInterceptor = __webpack_require__("0201");
var domTextSelectionInterceptor = createTextSelectionInterceptor();
var fakeTextSelectorInterceptor = createTextSelectionInterceptor(true);
var Transform = __webpack_require__("408b");
var makeSvgController = __webpack_require__("c327");
var makeDomController = __webpack_require__("5647");

var defaultZoomSpeed = 1;
var defaultDoubleTapZoomSpeed = 1.75;
var doubleTapSpeedInMS = 300;

module.exports = createPanZoom;

/**
 * Creates a new instance of panzoom, so that an object can be panned and zoomed
 *
 * @param {DOMElement} domElement where panzoom should be attached.
 * @param {Object} options that configure behavior.
 */
function createPanZoom(domElement, options) {
  options = options || {};

  var panController = options.controller;

  if (!panController) {
    if (makeSvgController.canAttach(domElement)) {
      panController = makeSvgController(domElement, options);
    } else if (makeDomController.canAttach(domElement)) {
      panController = makeDomController(domElement, options);
    }
  }

  if (!panController) {
    throw new Error(
      'Cannot create panzoom for the current type of dom element'
    );
  }
  var owner = panController.getOwner();
  // just to avoid GC pressure, every time we do intermediate transform
  // we return this object. For internal use only. Never give it back to the consumer of this library
  var storedCTMResult = { x: 0, y: 0 };

  var isDirty = false;
  var transform = new Transform();

  if (panController.initTransform) {
    panController.initTransform(transform);
  }

  var filterKey = typeof options.filterKey === 'function' ? options.filterKey : noop;
  // TODO: likely need to unite pinchSpeed with zoomSpeed
  var pinchSpeed = typeof options.pinchSpeed === 'number' ? options.pinchSpeed : 1;
  var bounds = options.bounds;
  var maxZoom = typeof options.maxZoom === 'number' ? options.maxZoom : Number.POSITIVE_INFINITY;
  var minZoom = typeof options.minZoom === 'number' ? options.minZoom : 0;

  var boundsPadding = typeof options.boundsPadding === 'number' ? options.boundsPadding : 0.05;
  var zoomDoubleClickSpeed = typeof options.zoomDoubleClickSpeed === 'number' ? options.zoomDoubleClickSpeed : defaultDoubleTapZoomSpeed;
  var beforeWheel = options.beforeWheel || noop;
  var beforeMouseDown = options.beforeMouseDown || noop;
  var speed = typeof options.zoomSpeed === 'number' ? options.zoomSpeed : defaultZoomSpeed;
  var transformOrigin = parseTransformOrigin(options.transformOrigin);
  var textSelection = options.enableTextSelection ? fakeTextSelectorInterceptor : domTextSelectionInterceptor;

  validateBounds(bounds);

  if (options.autocenter) {
    autocenter();
  }

  var frameAnimation;
  var lastTouchEndTime = 0;
  var lastSingleFingerOffset;
  var touchInProgress = false;

  // We only need to fire panstart when actual move happens
  var panstartFired = false;

  // cache mouse coordinates here
  var mouseX;
  var mouseY;

  var pinchZoomLength;

  var smoothScroll;
  if ('smoothScroll' in options && !options.smoothScroll) {
    // If user explicitly asked us not to use smooth scrolling, we obey
    smoothScroll = rigidScroll();
  } else {
    // otherwise we use forward smoothScroll settings to kinetic API
    // which makes scroll smoothing.
    smoothScroll = kinetic(getPoint, scroll, options.smoothScroll);
  }

  var moveByAnimation;
  var zoomToAnimation;

  var multiTouch;
  var paused = false;

  listenForEvents();

  var api = {
    dispose: dispose,
    moveBy: internalMoveBy,
    moveTo: moveTo,
    centerOn: centerOn,
    zoomTo: publicZoomTo,
    zoomAbs: zoomAbs,
    smoothZoom: smoothZoom,
    smoothZoomAbs: smoothZoomAbs,
    showRectangle: showRectangle,

    pause: pause,
    resume: resume,
    isPaused: isPaused,

    getTransform: getTransformModel,

    getMinZoom: getMinZoom,
    setMinZoom: setMinZoom,

    getMaxZoom: getMaxZoom,
    setMaxZoom: setMaxZoom,

    getTransformOrigin: getTransformOrigin,
    setTransformOrigin: setTransformOrigin,

    getZoomSpeed: getZoomSpeed,
    setZoomSpeed: setZoomSpeed
  };

  eventify(api);

  return api;

  function pause() {
    releaseEvents();
    paused = true;
  }

  function resume() {
    if (paused) {
      listenForEvents();
      paused = false;
    }
  }

  function isPaused() {
    return paused;
  }

  function showRectangle(rect) {
    // TODO: this duplicates autocenter. I think autocenter should go.
    var clientRect = owner.getBoundingClientRect();
    var size = transformToScreen(clientRect.width, clientRect.height);

    var rectWidth = rect.right - rect.left;
    var rectHeight = rect.bottom - rect.top;
    if (!Number.isFinite(rectWidth) || !Number.isFinite(rectHeight)) {
      throw new Error('Invalid rectangle');
    }

    var dw = size.x / rectWidth;
    var dh = size.y / rectHeight;
    var scale = Math.min(dw, dh);
    transform.x = -(rect.left + rectWidth / 2) * scale + size.x / 2;
    transform.y = -(rect.top + rectHeight / 2) * scale + size.y / 2;
    transform.scale = scale;
  }

  function transformToScreen(x, y) {
    if (panController.getScreenCTM) {
      var parentCTM = panController.getScreenCTM();
      var parentScaleX = parentCTM.a;
      var parentScaleY = parentCTM.d;
      var parentOffsetX = parentCTM.e;
      var parentOffsetY = parentCTM.f;
      storedCTMResult.x = x * parentScaleX - parentOffsetX;
      storedCTMResult.y = y * parentScaleY - parentOffsetY;
    } else {
      storedCTMResult.x = x;
      storedCTMResult.y = y;
    }

    return storedCTMResult;
  }

  function autocenter() {
    var w; // width of the parent
    var h; // height of the parent
    var left = 0;
    var top = 0;
    var sceneBoundingBox = getBoundingBox();
    if (sceneBoundingBox) {
      // If we have bounding box - use it.
      left = sceneBoundingBox.left;
      top = sceneBoundingBox.top;
      w = sceneBoundingBox.right - sceneBoundingBox.left;
      h = sceneBoundingBox.bottom - sceneBoundingBox.top;
    } else {
      // otherwise just use whatever space we have
      var ownerRect = owner.getBoundingClientRect();
      w = ownerRect.width;
      h = ownerRect.height;
    }
    var bbox = panController.getBBox();
    if (bbox.width === 0 || bbox.height === 0) {
      // we probably do not have any elements in the SVG
      // just bail out;
      return;
    }
    var dh = h / bbox.height;
    var dw = w / bbox.width;
    var scale = Math.min(dw, dh);
    transform.x = -(bbox.left + bbox.width / 2) * scale + w / 2 + left;
    transform.y = -(bbox.top + bbox.height / 2) * scale + h / 2 + top;
    transform.scale = scale;
  }

  function getTransformModel() {
    // TODO: should this be read only?
    return transform;
  }

  function getMinZoom() {
    return minZoom;
  }

  function setMinZoom(newMinZoom) {
    minZoom = newMinZoom;
  }

  function getMaxZoom() {
    return maxZoom;
  }

  function setMaxZoom(newMaxZoom) {
    maxZoom = newMaxZoom;
  }

  function getTransformOrigin() {
    return transformOrigin;
  }

  function setTransformOrigin(newTransformOrigin) {
    transformOrigin = parseTransformOrigin(newTransformOrigin);
  }

  function getZoomSpeed() {
    return speed;
  }

  function setZoomSpeed(newSpeed) {
    if (!Number.isFinite(newSpeed)) {
      throw new Error('Zoom speed should be a number');
    }
    speed = newSpeed;
  }

  function getPoint() {
    return {
      x: transform.x,
      y: transform.y
    };
  }

  function moveTo(x, y) {
    transform.x = x;
    transform.y = y;

    keepTransformInsideBounds();

    triggerEvent('pan');
    makeDirty();
  }

  function moveBy(dx, dy) {
    moveTo(transform.x + dx, transform.y + dy);
  }

  function keepTransformInsideBounds() {
    var boundingBox = getBoundingBox();
    if (!boundingBox) return;

    var adjusted = false;
    var clientRect = getClientRect();

    var diff = boundingBox.left - clientRect.right;
    if (diff > 0) {
      transform.x += diff;
      adjusted = true;
    }
    // check the other side:
    diff = boundingBox.right - clientRect.left;
    if (diff < 0) {
      transform.x += diff;
      adjusted = true;
    }

    // y axis:
    diff = boundingBox.top - clientRect.bottom;
    if (diff > 0) {
      // we adjust transform, so that it matches exactly our bounding box:
      // transform.y = boundingBox.top - (boundingBox.height + boundingBox.y) * transform.scale =>
      // transform.y = boundingBox.top - (clientRect.bottom - transform.y) =>
      // transform.y = diff + transform.y =>
      transform.y += diff;
      adjusted = true;
    }

    diff = boundingBox.bottom - clientRect.top;
    if (diff < 0) {
      transform.y += diff;
      adjusted = true;
    }
    return adjusted;
  }

  /**
   * Returns bounding box that should be used to restrict scene movement.
   */
  function getBoundingBox() {
    if (!bounds) return; // client does not want to restrict movement

    if (typeof bounds === 'boolean') {
      // for boolean type we use parent container bounds
      var ownerRect = owner.getBoundingClientRect();
      var sceneWidth = ownerRect.width;
      var sceneHeight = ownerRect.height;

      return {
        left: sceneWidth * boundsPadding,
        top: sceneHeight * boundsPadding,
        right: sceneWidth * (1 - boundsPadding),
        bottom: sceneHeight * (1 - boundsPadding)
      };
    }

    return bounds;
  }

  function getClientRect() {
    var bbox = panController.getBBox();
    var leftTop = client(bbox.left, bbox.top);

    return {
      left: leftTop.x,
      top: leftTop.y,
      right: bbox.width * transform.scale + leftTop.x,
      bottom: bbox.height * transform.scale + leftTop.y
    };
  }

  function client(x, y) {
    return {
      x: x * transform.scale + transform.x,
      y: y * transform.scale + transform.y
    };
  }

  function makeDirty() {
    isDirty = true;
    frameAnimation = window.requestAnimationFrame(frame);
  }

  function zoomByRatio(clientX, clientY, ratio) {
    if (isNaN(clientX) || isNaN(clientY) || isNaN(ratio)) {
      throw new Error('zoom requires valid numbers');
    }

    var newScale = transform.scale * ratio;

    if (newScale < minZoom) {
      if (transform.scale === minZoom) return;

      ratio = minZoom / transform.scale;
    }
    if (newScale > maxZoom) {
      if (transform.scale === maxZoom) return;

      ratio = maxZoom / transform.scale;
    }

    var size = transformToScreen(clientX, clientY);

    transform.x = size.x - ratio * (size.x - transform.x);
    transform.y = size.y - ratio * (size.y - transform.y);

    // TODO: https://github.com/anvaka/panzoom/issues/112
    if (bounds && boundsPadding === 1 && minZoom === 1) {
      transform.scale *= ratio;
      keepTransformInsideBounds();
    } else {
      var transformAdjusted = keepTransformInsideBounds();
      if (!transformAdjusted) transform.scale *= ratio;
    }

    triggerEvent('zoom');

    makeDirty();
  }

  function zoomAbs(clientX, clientY, zoomLevel) {
    var ratio = zoomLevel / transform.scale;
    zoomByRatio(clientX, clientY, ratio);
  }

  function centerOn(ui) {
    var parent = ui.ownerSVGElement;
    if (!parent)
      throw new Error('ui element is required to be within the scene');

    // TODO: should i use controller's screen CTM?
    var clientRect = ui.getBoundingClientRect();
    var cx = clientRect.left + clientRect.width / 2;
    var cy = clientRect.top + clientRect.height / 2;

    var container = parent.getBoundingClientRect();
    var dx = container.width / 2 - cx;
    var dy = container.height / 2 - cy;

    internalMoveBy(dx, dy, true);
  }

  function internalMoveBy(dx, dy, smooth) {
    if (!smooth) {
      return moveBy(dx, dy);
    }

    if (moveByAnimation) moveByAnimation.cancel();

    var from = { x: 0, y: 0 };
    var to = { x: dx, y: dy };
    var lastX = 0;
    var lastY = 0;

    moveByAnimation = animate(from, to, {
      step: function (v) {
        moveBy(v.x - lastX, v.y - lastY);

        lastX = v.x;
        lastY = v.y;
      }
    });
  }

  function scroll(x, y) {
    cancelZoomAnimation();
    moveTo(x, y);
  }

  function dispose() {
    releaseEvents();
  }

  function listenForEvents() {
    owner.addEventListener('mousedown', onMouseDown, { passive: false });
    owner.addEventListener('dblclick', onDoubleClick, { passive: false });
    owner.addEventListener('touchstart', onTouch, { passive: false });
    owner.addEventListener('keydown', onKeyDown, { passive: false });

    // Need to listen on the owner container, so that we are not limited
    // by the size of the scrollable domElement
    wheel.addWheelListener(owner, onMouseWheel, { passive: false });

    makeDirty();
  }

  function releaseEvents() {
    wheel.removeWheelListener(owner, onMouseWheel);
    owner.removeEventListener('mousedown', onMouseDown);
    owner.removeEventListener('keydown', onKeyDown);
    owner.removeEventListener('dblclick', onDoubleClick);
    owner.removeEventListener('touchstart', onTouch);

    if (frameAnimation) {
      window.cancelAnimationFrame(frameAnimation);
      frameAnimation = 0;
    }

    smoothScroll.cancel();

    releaseDocumentMouse();
    releaseTouches();
    textSelection.release();

    triggerPanEnd();
  }

  function frame() {
    if (isDirty) applyTransform();
  }

  function applyTransform() {
    isDirty = false;

    // TODO: Should I allow to cancel this?
    panController.applyTransform(transform);

    triggerEvent('transform');
    frameAnimation = 0;
  }

  function onKeyDown(e) {
    var x = 0,
      y = 0,
      z = 0;
    if (e.keyCode === 38) {
      y = 1; // up
    } else if (e.keyCode === 40) {
      y = -1; // down
    } else if (e.keyCode === 37) {
      x = 1; // left
    } else if (e.keyCode === 39) {
      x = -1; // right
    } else if (e.keyCode === 189 || e.keyCode === 109) {
      // DASH or SUBTRACT
      z = 1; // `-` -  zoom out
    } else if (e.keyCode === 187 || e.keyCode === 107) {
      // EQUAL SIGN or ADD
      z = -1; // `=` - zoom in (equal sign on US layout is under `+`)
    }

    if (filterKey(e, x, y, z)) {
      // They don't want us to handle the key: https://github.com/anvaka/panzoom/issues/45
      return;
    }

    if (x || y) {
      e.preventDefault();
      e.stopPropagation();

      var clientRect = owner.getBoundingClientRect();
      // movement speed should be the same in both X and Y direction:
      var offset = Math.min(clientRect.width, clientRect.height);
      var moveSpeedRatio = 0.05;
      var dx = offset * moveSpeedRatio * x;
      var dy = offset * moveSpeedRatio * y;

      // TODO: currently we do not animate this. It could be better to have animation
      internalMoveBy(dx, dy);
    }

    if (z) {
      var scaleMultiplier = getScaleMultiplier(z * 100);
      var offset = transformOrigin ? getTransformOriginOffset() : midPoint();
      publicZoomTo(offset.x, offset.y, scaleMultiplier);
    }
  }

  function midPoint() {
    var ownerRect = owner.getBoundingClientRect();
    return {
      x: ownerRect.width / 2,
      y: ownerRect.height / 2
    };
  }

  function onTouch(e) {
    // let the override the touch behavior
    beforeTouch(e);

    if (e.touches.length === 1) {
      return handleSingleFingerTouch(e, e.touches[0]);
    } else if (e.touches.length === 2) {
      // handleTouchMove() will care about pinch zoom.
      pinchZoomLength = getPinchZoomLength(e.touches[0], e.touches[1]);
      multiTouch = true;
      startTouchListenerIfNeeded();
    }
  }

  function beforeTouch(e) {
    // TODO: Need to unify this filtering names. E.g. use `beforeTouch`
    if (options.onTouch && !options.onTouch(e)) {
      // if they return `false` from onTouch, we don't want to stop
      // events propagation. Fixes https://github.com/anvaka/panzoom/issues/12
      return;
    }

    e.stopPropagation();
    e.preventDefault();
  }

  function beforeDoubleClick(e) {
    // TODO: Need to unify this filtering names. E.g. use `beforeDoubleClick``
    if (options.onDoubleClick && !options.onDoubleClick(e)) {
      // if they return `false` from onTouch, we don't want to stop
      // events propagation. Fixes https://github.com/anvaka/panzoom/issues/46
      return;
    }

    e.preventDefault();
    e.stopPropagation();
  }

  function handleSingleFingerTouch(e) {
    var touch = e.touches[0];
    var offset = getOffsetXY(touch);
    lastSingleFingerOffset = offset;
    var point = transformToScreen(offset.x, offset.y);
    mouseX = point.x;
    mouseY = point.y;

    smoothScroll.cancel();
    startTouchListenerIfNeeded();
  }

  function startTouchListenerIfNeeded() {
    if (touchInProgress) {
      // no need to do anything, as we already listen to events;
      return;
    }

    touchInProgress = true;
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('touchcancel', handleTouchEnd);
  }

  function handleTouchMove(e) {
    if (e.touches.length === 1) {
      e.stopPropagation();
      var touch = e.touches[0];

      var offset = getOffsetXY(touch);
      var point = transformToScreen(offset.x, offset.y);

      var dx = point.x - mouseX;
      var dy = point.y - mouseY;

      if (dx !== 0 && dy !== 0) {
        triggerPanStart();
      }
      mouseX = point.x;
      mouseY = point.y;
      internalMoveBy(dx, dy);
    } else if (e.touches.length === 2) {
      // it's a zoom, let's find direction
      multiTouch = true;
      var t1 = e.touches[0];
      var t2 = e.touches[1];
      var currentPinchLength = getPinchZoomLength(t1, t2);

      // since the zoom speed is always based on distance from 1, we need to apply
      // pinch speed only on that distance from 1:
      var scaleMultiplier =
        1 + (currentPinchLength / pinchZoomLength - 1) * pinchSpeed;

      var firstTouchPoint = getOffsetXY(t1);
      var secondTouchPoint = getOffsetXY(t2);
      mouseX = (firstTouchPoint.x + secondTouchPoint.x) / 2;
      mouseY = (firstTouchPoint.y + secondTouchPoint.y) / 2;
      if (transformOrigin) {
        var offset = getTransformOriginOffset();
        mouseX = offset.x;
        mouseY = offset.y;
      }

      publicZoomTo(mouseX, mouseY, scaleMultiplier);

      pinchZoomLength = currentPinchLength;
      e.stopPropagation();
      e.preventDefault();
    }
  }

  function handleTouchEnd(e) {
    if (e.touches.length > 0) {
      var offset = getOffsetXY(e.touches[0]);
      var point = transformToScreen(offset.x, offset.y);
      mouseX = point.x;
      mouseY = point.y;
    } else {
      var now = new Date();
      if (now - lastTouchEndTime < doubleTapSpeedInMS) {
        if (transformOrigin) {
          var offset = getTransformOriginOffset();
          smoothZoom(offset.x, offset.y, zoomDoubleClickSpeed);
        } else {
          // We want untransformed x/y here.
          smoothZoom(lastSingleFingerOffset.x, lastSingleFingerOffset.y, zoomDoubleClickSpeed);
        }
      }

      lastTouchEndTime = now;

      triggerPanEnd();
      releaseTouches();
    }
  }

  function getPinchZoomLength(finger1, finger2) {
    var dx = finger1.clientX - finger2.clientX;
    var dy = finger1.clientY - finger2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function onDoubleClick(e) {
    beforeDoubleClick(e);
    var offset = getOffsetXY(e);
    if (transformOrigin) {
      // TODO: looks like this is duplicated in the file.
      // Need to refactor
      offset = getTransformOriginOffset();
    }
    smoothZoom(offset.x, offset.y, zoomDoubleClickSpeed);
  }

  function onMouseDown(e) {
    // if client does not want to handle this event - just ignore the call
    if (beforeMouseDown(e)) return;

    if (touchInProgress) {
      // modern browsers will fire mousedown for touch events too
      // we do not want this: touch is handled separately.
      e.stopPropagation();
      return false;
    }
    // for IE, left click == 1
    // for Firefox, left click == 0
    var isLeftButton =
      (e.button === 1 && window.event !== null) || e.button === 0;
    if (!isLeftButton) return;

    smoothScroll.cancel();

    var offset = getOffsetXY(e);
    var point = transformToScreen(offset.x, offset.y);
    mouseX = point.x;
    mouseY = point.y;

    // We need to listen on document itself, since mouse can go outside of the
    // window, and we will loose it
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    textSelection.capture(e.target || e.srcElement);

    return false;
  }

  function onMouseMove(e) {
    // no need to worry about mouse events when touch is happening
    if (touchInProgress) return;

    triggerPanStart();

    var offset = getOffsetXY(e);
    var point = transformToScreen(offset.x, offset.y);
    var dx = point.x - mouseX;
    var dy = point.y - mouseY;

    mouseX = point.x;
    mouseY = point.y;

    internalMoveBy(dx, dy);
  }

  function onMouseUp() {
    textSelection.release();
    triggerPanEnd();
    releaseDocumentMouse();
  }

  function releaseDocumentMouse() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    panstartFired = false;
  }

  function releaseTouches() {
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
    document.removeEventListener('touchcancel', handleTouchEnd);
    panstartFired = false;
    multiTouch = false;
    touchInProgress = false;
  }

  function onMouseWheel(e) {
    // if client does not want to handle this event - just ignore the call
    if (beforeWheel(e)) return;

    smoothScroll.cancel();

    var delta = e.deltaY;
    if (e.deltaMode > 0) delta *= 100;

    var scaleMultiplier = getScaleMultiplier(delta);

    if (scaleMultiplier !== 1) {
      var offset = transformOrigin
        ? getTransformOriginOffset()
        : getOffsetXY(e);
      publicZoomTo(offset.x, offset.y, scaleMultiplier);
      e.preventDefault();
    }
  }

  function getOffsetXY(e) {
    var offsetX, offsetY;
    // I tried using e.offsetX, but that gives wrong results for svg, when user clicks on a path.
    var ownerRect = owner.getBoundingClientRect();
    offsetX = e.clientX - ownerRect.left;
    offsetY = e.clientY - ownerRect.top;

    return { x: offsetX, y: offsetY };
  }

  function smoothZoom(clientX, clientY, scaleMultiplier) {
    var fromValue = transform.scale;
    var from = { scale: fromValue };
    var to = { scale: scaleMultiplier * fromValue };

    smoothScroll.cancel();
    cancelZoomAnimation();

    zoomToAnimation = animate(from, to, {
      step: function (v) {
        zoomAbs(clientX, clientY, v.scale);
      },
      done: triggerZoomEnd
    });
  }

  function smoothZoomAbs(clientX, clientY, toScaleValue) {
    var fromValue = transform.scale;
    var from = { scale: fromValue };
    var to = { scale: toScaleValue };

    smoothScroll.cancel();
    cancelZoomAnimation();

    zoomToAnimation = animate(from, to, {
      step: function (v) {
        zoomAbs(clientX, clientY, v.scale);
      }
    });
  }

  function getTransformOriginOffset() {
    var ownerRect = owner.getBoundingClientRect();
    return {
      x: ownerRect.width * transformOrigin.x,
      y: ownerRect.height * transformOrigin.y
    };
  }

  function publicZoomTo(clientX, clientY, scaleMultiplier) {
    smoothScroll.cancel();
    cancelZoomAnimation();
    return zoomByRatio(clientX, clientY, scaleMultiplier);
  }

  function cancelZoomAnimation() {
    if (zoomToAnimation) {
      zoomToAnimation.cancel();
      zoomToAnimation = null;
    }
  }

  function getScaleMultiplier(delta) {
    var sign = Math.sign(delta);
    var deltaAdjustedSpeed = Math.min(0.25, Math.abs(speed * delta / 128));
    return 1 - sign * deltaAdjustedSpeed;
  }

  function triggerPanStart() {
    if (!panstartFired) {
      triggerEvent('panstart');
      panstartFired = true;
      smoothScroll.start();
    }
  }

  function triggerPanEnd() {
    if (panstartFired) {
      // we should never run smooth scrolling if it was multiTouch (pinch zoom animation):
      if (!multiTouch) smoothScroll.stop();
      triggerEvent('panend');
    }
  }

  function triggerZoomEnd() {
    triggerEvent('zoomend');
  }

  function triggerEvent(name) {
    api.fire(name, api);
  }
}

function parseTransformOrigin(options) {
  if (!options) return;
  if (typeof options === 'object') {
    if (!isNumber(options.x) || !isNumber(options.y))
      failTransformOrigin(options);
    return options;
  }

  failTransformOrigin();
}

function failTransformOrigin(options) {
  console.error(options);
  throw new Error(
    [
      'Cannot parse transform origin.',
      'Some good examples:',
      '  "center center" can be achieved with {x: 0.5, y: 0.5}',
      '  "top center" can be achieved with {x: 0.5, y: 0}',
      '  "bottom right" can be achieved with {x: 1, y: 1}'
    ].join('\n')
  );
}

function noop() { }

function validateBounds(bounds) {
  var boundsType = typeof bounds;
  if (boundsType === 'undefined' || boundsType === 'boolean') return; // this is okay
  // otherwise need to be more thorough:
  var validBounds =
    isNumber(bounds.left) &&
    isNumber(bounds.top) &&
    isNumber(bounds.bottom) &&
    isNumber(bounds.right);

  if (!validBounds)
    throw new Error(
      'Bounds object is not valid. It can be: ' +
      'undefined, boolean (true|false) or an object {left, top, right, bottom}'
    );
}

function isNumber(x) {
  return Number.isFinite(x);
}

// IE 11 does not support isNaN:
function isNaN(value) {
  if (Number.isNaN) {
    return Number.isNaN(value);
  }

  return value !== value;
}

function rigidScroll() {
  return {
    start: noop,
    stop: noop,
    cancel: noop
  };
}

function autoRun() {
  if (typeof document === 'undefined') return;

  var scripts = document.getElementsByTagName('script');
  if (!scripts) return;
  var panzoomScript;

  for (var i = 0; i < scripts.length; ++i) {
    var x = scripts[i];
    if (x.src && x.src.match(/\bpanzoom(\.min)?\.js/)) {
      panzoomScript = x;
      break;
    }
  }

  if (!panzoomScript) return;

  var query = panzoomScript.getAttribute('query');
  if (!query) return;

  var globalName = panzoomScript.getAttribute('name') || 'pz';
  var started = Date.now();

  tryAttach();

  function tryAttach() {
    var el = document.querySelector(query);
    if (!el) {
      var now = Date.now();
      var elapsed = now - started;
      if (elapsed < 2000) {
        // Let's wait a bit
        setTimeout(tryAttach, 100);
        return;
      }
      // If we don't attach within 2 seconds to the target element, consider it a failure
      console.error('Cannot find the panzoom element', globalName);
      return;
    }
    var options = collectOptions(panzoomScript);
    console.log(options);
    window[globalName] = createPanZoom(el, options);
  }

  function collectOptions(script) {
    var attrs = script.attributes;
    var options = {};
    for (var i = 0; i < attrs.length; ++i) {
      var attr = attrs[i];
      var nameValue = getPanzoomAttributeNameValue(attr);
      if (nameValue) {
        options[nameValue.name] = nameValue.value;
      }
    }

    return options;
  }

  function getPanzoomAttributeNameValue(attr) {
    if (!attr.name) return;
    var isPanZoomAttribute =
      attr.name[0] === 'p' && attr.name[1] === 'z' && attr.name[2] === '-';

    if (!isPanZoomAttribute) return;

    var name = attr.name.substr(3);
    var value = JSON.parse(attr.value);
    return { name: name, value: value };
  }
}

autoRun();


/***/ }),

/***/ "7d67":
/***/ (function(module, exports) {

/**
 * This module used to unify mouse wheel behavior between different browsers in 2014
 * Now it's just a wrapper around addEventListener('wheel');
 *
 * Usage:
 *  var addWheelListener = require('wheel').addWheelListener;
 *  var removeWheelListener = require('wheel').removeWheelListener;
 *  addWheelListener(domElement, function (e) {
 *    // mouse wheel event
 *  });
 *  removeWheelListener(domElement, function);
 */

module.exports = addWheelListener;

// But also expose "advanced" api with unsubscribe:
module.exports.addWheelListener = addWheelListener;
module.exports.removeWheelListener = removeWheelListener;


function addWheelListener(element, listener, useCapture) {
  element.addEventListener('wheel', listener, useCapture);
}

function removeWheelListener( element, listener, useCapture ) {
  element.removeEventListener('wheel', listener, useCapture);
}

/***/ }),

/***/ "7dd0":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("23e7");
var createIteratorConstructor = __webpack_require__("9ed3");
var getPrototypeOf = __webpack_require__("e163");
var setPrototypeOf = __webpack_require__("d2bb");
var setToStringTag = __webpack_require__("d44e");
var createNonEnumerableProperty = __webpack_require__("9112");
var redefine = __webpack_require__("6eeb");
var wellKnownSymbol = __webpack_require__("b622");
var IS_PURE = __webpack_require__("c430");
var Iterators = __webpack_require__("3f8c");
var IteratorsCore = __webpack_require__("ae93");

var IteratorPrototype = IteratorsCore.IteratorPrototype;
var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
var ITERATOR = wellKnownSymbol('iterator');
var KEYS = 'keys';
var VALUES = 'values';
var ENTRIES = 'entries';

var returnThis = function () { return this; };

module.exports = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
  createIteratorConstructor(IteratorConstructor, NAME, next);

  var getIterationMethod = function (KIND) {
    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
    if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];
    switch (KIND) {
      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
    } return function () { return new IteratorConstructor(this); };
  };

  var TO_STRING_TAG = NAME + ' Iterator';
  var INCORRECT_VALUES_NAME = false;
  var IterablePrototype = Iterable.prototype;
  var nativeIterator = IterablePrototype[ITERATOR]
    || IterablePrototype['@@iterator']
    || DEFAULT && IterablePrototype[DEFAULT];
  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
  var CurrentIteratorPrototype, methods, KEY;

  // fix native
  if (anyNativeIterator) {
    CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));
    if (IteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
      if (!IS_PURE && getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
        if (setPrototypeOf) {
          setPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
        } else if (typeof CurrentIteratorPrototype[ITERATOR] != 'function') {
          createNonEnumerableProperty(CurrentIteratorPrototype, ITERATOR, returnThis);
        }
      }
      // Set @@toStringTag to native iterators
      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
      if (IS_PURE) Iterators[TO_STRING_TAG] = returnThis;
    }
  }

  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
    INCORRECT_VALUES_NAME = true;
    defaultIterator = function values() { return nativeIterator.call(this); };
  }

  // define iterator
  if ((!IS_PURE || FORCED) && IterablePrototype[ITERATOR] !== defaultIterator) {
    createNonEnumerableProperty(IterablePrototype, ITERATOR, defaultIterator);
  }
  Iterators[NAME] = defaultIterator;

  // export additional methods
  if (DEFAULT) {
    methods = {
      values: getIterationMethod(VALUES),
      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
      entries: getIterationMethod(ENTRIES)
    };
    if (FORCED) for (KEY in methods) {
      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
        redefine(IterablePrototype, KEY, methods[KEY]);
      }
    } else $({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
  }

  return methods;
};


/***/ }),

/***/ "7f9a":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("da84");
var inspectSource = __webpack_require__("8925");

var WeakMap = global.WeakMap;

module.exports = typeof WeakMap === 'function' && /native code/.test(inspectSource(WeakMap));


/***/ }),

/***/ "825a":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("861d");

module.exports = function (it) {
  if (!isObject(it)) {
    throw TypeError(String(it) + ' is not an object');
  } return it;
};


/***/ }),

/***/ "83ab":
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__("d039");

// Thank's IE8 for his funny defineProperty
module.exports = !fails(function () {
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
});


/***/ }),

/***/ "8418":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var toPrimitive = __webpack_require__("c04e");
var definePropertyModule = __webpack_require__("9bf2");
var createPropertyDescriptor = __webpack_require__("5c6c");

module.exports = function (object, key, value) {
  var propertyKey = toPrimitive(key);
  if (propertyKey in object) definePropertyModule.f(object, propertyKey, createPropertyDescriptor(0, value));
  else object[propertyKey] = value;
};


/***/ }),

/***/ "857a":
/***/ (function(module, exports, __webpack_require__) {

var requireObjectCoercible = __webpack_require__("1d80");

var quot = /"/g;

// B.2.3.2.1 CreateHTML(string, tag, attribute, value)
// https://tc39.github.io/ecma262/#sec-createhtml
module.exports = function (string, tag, attribute, value) {
  var S = String(requireObjectCoercible(string));
  var p1 = '<' + tag;
  if (attribute !== '') p1 += ' ' + attribute + '="' + String(value).replace(quot, '&quot;') + '"';
  return p1 + '>' + S + '</' + tag + '>';
};


/***/ }),

/***/ "861d":
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),

/***/ "87b3":
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__("24fb");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".port{display:flex;justify-content:center;position:absolute}.port__inner{border-radius:50%;width:12px;height:12px;border:1px solid purple}", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "884b":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("87b3");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__("499e").default
var update = add("5257c37a", content, true, {"sourceMap":false,"shadowMode":false});

/***/ }),

/***/ "8875":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// addapted from the document.currentScript polyfill by Adam Miller
// MIT license
// source: https://github.com/amiller-gh/currentScript-polyfill

// added support for Firefox https://bugzilla.mozilla.org/show_bug.cgi?id=1620505

(function (root, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
}(typeof self !== 'undefined' ? self : this, function () {
  function getCurrentScript () {
    if (document.currentScript) {
      return document.currentScript
    }
  
    // IE 8-10 support script readyState
    // IE 11+ & Firefox support stack trace
    try {
      throw new Error();
    }
    catch (err) {
      // Find the second match for the "at" string to get file src url from stack.
      var ieStackRegExp = /.*at [^(]*\((.*):(.+):(.+)\)$/ig,
        ffStackRegExp = /@([^@]*):(\d+):(\d+)\s*$/ig,
        stackDetails = ieStackRegExp.exec(err.stack) || ffStackRegExp.exec(err.stack),
        scriptLocation = (stackDetails && stackDetails[1]) || false,
        line = (stackDetails && stackDetails[2]) || false,
        currentLocation = document.location.href.replace(document.location.hash, ''),
        pageSource,
        inlineScriptSourceRegExp,
        inlineScriptSource,
        scripts = document.getElementsByTagName('script'); // Live NodeList collection
  
      if (scriptLocation === currentLocation) {
        pageSource = document.documentElement.outerHTML;
        inlineScriptSourceRegExp = new RegExp('(?:[^\\n]+?\\n){0,' + (line - 2) + '}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*', 'i');
        inlineScriptSource = pageSource.replace(inlineScriptSourceRegExp, '$1').trim();
      }
  
      for (var i = 0; i < scripts.length; i++) {
        // If ready state is interactive, return the script tag
        if (scripts[i].readyState === 'interactive') {
          return scripts[i];
        }
  
        // If src matches, return the script tag
        if (scripts[i].src === scriptLocation) {
          return scripts[i];
        }
  
        // If inline source matches, return the script tag
        if (
          scriptLocation === currentLocation &&
          scripts[i].innerHTML &&
          scripts[i].innerHTML.trim() === inlineScriptSource
        ) {
          return scripts[i];
        }
      }
  
      // If no match, return null
      return null;
    }
  };

  return getCurrentScript
}));


/***/ }),

/***/ "8925":
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__("c6cd");

var functionToString = Function.toString;

// this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper
if (typeof store.inspectSource != 'function') {
  store.inspectSource = function (it) {
    return functionToString.call(it);
  };
}

module.exports = store.inspectSource;


/***/ }),

/***/ "8b6a":
/***/ (function(module, exports) {

var DiagonalMovement = {
    Always: 1,
    Never: 2,
    IfAtMostOneObstacle: 3,
    OnlyWhenNoObstacles: 4
};

module.exports = DiagonalMovement;

/***/ }),

/***/ "8ba4":
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__("23e7");
var isInteger = __webpack_require__("5e89");

// `Number.isInteger` method
// https://tc39.github.io/ecma262/#sec-number.isinteger
$({ target: 'Number', stat: true }, {
  isInteger: isInteger
});


/***/ }),

/***/ "8bbf":
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__8bbf__;

/***/ }),

/***/ "90e3":
/***/ (function(module, exports) {

var id = 0;
var postfix = Math.random();

module.exports = function (key) {
  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
};


/***/ }),

/***/ "9112":
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__("83ab");
var definePropertyModule = __webpack_require__("9bf2");
var createPropertyDescriptor = __webpack_require__("5c6c");

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ "9129":
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__("23e7");

// `Number.isNaN` method
// https://tc39.github.io/ecma262/#sec-number.isnan
$({ target: 'Number', stat: true }, {
  isNaN: function isNaN(number) {
    // eslint-disable-next-line no-self-compare
    return number != number;
  }
});


/***/ }),

/***/ "91ae":
/***/ (function(module, exports) {



/***/ }),

/***/ "94ca":
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__("d039");

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true
    : value == NATIVE ? false
    : typeof detection == 'function' ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

module.exports = isForced;


/***/ }),

/***/ "9911":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("23e7");
var createHTML = __webpack_require__("857a");
var forcedStringHTMLMethod = __webpack_require__("af03");

// `String.prototype.link` method
// https://tc39.github.io/ecma262/#sec-string.prototype.link
$({ target: 'String', proto: true, forced: forcedStringHTMLMethod('link') }, {
  link: function link(url) {
    return createHTML(this, 'a', 'href', url);
  }
});


/***/ }),

/***/ "99af":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("23e7");
var fails = __webpack_require__("d039");
var isArray = __webpack_require__("e8b5");
var isObject = __webpack_require__("861d");
var toObject = __webpack_require__("7b0b");
var toLength = __webpack_require__("50c4");
var createProperty = __webpack_require__("8418");
var arraySpeciesCreate = __webpack_require__("65f0");
var arrayMethodHasSpeciesSupport = __webpack_require__("1dde");
var wellKnownSymbol = __webpack_require__("b622");
var V8_VERSION = __webpack_require__("2d00");

var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';

// We can't use this feature detection in V8 since it causes
// deoptimization and serious performance degradation
// https://github.com/zloirock/core-js/issues/679
var IS_CONCAT_SPREADABLE_SUPPORT = V8_VERSION >= 51 || !fails(function () {
  var array = [];
  array[IS_CONCAT_SPREADABLE] = false;
  return array.concat()[0] !== array;
});

var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

var isConcatSpreadable = function (O) {
  if (!isObject(O)) return false;
  var spreadable = O[IS_CONCAT_SPREADABLE];
  return spreadable !== undefined ? !!spreadable : isArray(O);
};

var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

// `Array.prototype.concat` method
// https://tc39.github.io/ecma262/#sec-array.prototype.concat
// with adding support of @@isConcatSpreadable and @@species
$({ target: 'Array', proto: true, forced: FORCED }, {
  concat: function concat(arg) { // eslint-disable-line no-unused-vars
    var O = toObject(this);
    var A = arraySpeciesCreate(O, 0);
    var n = 0;
    var i, k, length, len, E;
    for (i = -1, length = arguments.length; i < length; i++) {
      E = i === -1 ? O : arguments[i];
      if (isConcatSpreadable(E)) {
        len = toLength(E.length);
        if (n + len > MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
      } else {
        if (n >= MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
        createProperty(A, n++, E);
      }
    }
    A.length = n;
    return A;
  }
});


/***/ }),

/***/ "9bdd":
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__("825a");

// call something on iterator step with safe closing on error
module.exports = function (iterator, fn, value, ENTRIES) {
  try {
    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (error) {
    var returnMethod = iterator['return'];
    if (returnMethod !== undefined) anObject(returnMethod.call(iterator));
    throw error;
  }
};


/***/ }),

/***/ "9bf2":
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__("83ab");
var IE8_DOM_DEFINE = __webpack_require__("0cfb");
var anObject = __webpack_require__("825a");
var toPrimitive = __webpack_require__("c04e");

var nativeDefineProperty = Object.defineProperty;

// `Object.defineProperty` method
// https://tc39.github.io/ecma262/#sec-object.defineproperty
exports.f = DESCRIPTORS ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return nativeDefineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ "9ed3":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var IteratorPrototype = __webpack_require__("ae93").IteratorPrototype;
var create = __webpack_require__("7c73");
var createPropertyDescriptor = __webpack_require__("5c6c");
var setToStringTag = __webpack_require__("d44e");
var Iterators = __webpack_require__("3f8c");

var returnThis = function () { return this; };

module.exports = function (IteratorConstructor, NAME, next) {
  var TO_STRING_TAG = NAME + ' Iterator';
  IteratorConstructor.prototype = create(IteratorPrototype, { next: createPropertyDescriptor(1, next) });
  setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
  Iterators[TO_STRING_TAG] = returnThis;
  return IteratorConstructor;
};


/***/ }),

/***/ "a434":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("23e7");
var toAbsoluteIndex = __webpack_require__("23cb");
var toInteger = __webpack_require__("a691");
var toLength = __webpack_require__("50c4");
var toObject = __webpack_require__("7b0b");
var arraySpeciesCreate = __webpack_require__("65f0");
var createProperty = __webpack_require__("8418");
var arrayMethodHasSpeciesSupport = __webpack_require__("1dde");
var arrayMethodUsesToLength = __webpack_require__("ae40");

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('splice');
var USES_TO_LENGTH = arrayMethodUsesToLength('splice', { ACCESSORS: true, 0: 0, 1: 2 });

var max = Math.max;
var min = Math.min;
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded';

// `Array.prototype.splice` method
// https://tc39.github.io/ecma262/#sec-array.prototype.splice
// with adding support of @@species
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH }, {
  splice: function splice(start, deleteCount /* , ...items */) {
    var O = toObject(this);
    var len = toLength(O.length);
    var actualStart = toAbsoluteIndex(start, len);
    var argumentsLength = arguments.length;
    var insertCount, actualDeleteCount, A, k, from, to;
    if (argumentsLength === 0) {
      insertCount = actualDeleteCount = 0;
    } else if (argumentsLength === 1) {
      insertCount = 0;
      actualDeleteCount = len - actualStart;
    } else {
      insertCount = argumentsLength - 2;
      actualDeleteCount = min(max(toInteger(deleteCount), 0), len - actualStart);
    }
    if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER) {
      throw TypeError(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
    }
    A = arraySpeciesCreate(O, actualDeleteCount);
    for (k = 0; k < actualDeleteCount; k++) {
      from = actualStart + k;
      if (from in O) createProperty(A, k, O[from]);
    }
    A.length = actualDeleteCount;
    if (insertCount < actualDeleteCount) {
      for (k = actualStart; k < len - actualDeleteCount; k++) {
        from = k + actualDeleteCount;
        to = k + insertCount;
        if (from in O) O[to] = O[from];
        else delete O[to];
      }
      for (k = len; k > len - actualDeleteCount + insertCount; k--) delete O[k - 1];
    } else if (insertCount > actualDeleteCount) {
      for (k = len - actualDeleteCount; k > actualStart; k--) {
        from = k + actualDeleteCount - 1;
        to = k + insertCount - 1;
        if (from in O) O[to] = O[from];
        else delete O[to];
      }
    }
    for (k = 0; k < insertCount; k++) {
      O[k + actualStart] = arguments[k + 2];
    }
    O.length = len - actualDeleteCount + insertCount;
    return A;
  }
});


/***/ }),

/***/ "a4d3":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("23e7");
var global = __webpack_require__("da84");
var getBuiltIn = __webpack_require__("d066");
var IS_PURE = __webpack_require__("c430");
var DESCRIPTORS = __webpack_require__("83ab");
var NATIVE_SYMBOL = __webpack_require__("4930");
var USE_SYMBOL_AS_UID = __webpack_require__("fdbf");
var fails = __webpack_require__("d039");
var has = __webpack_require__("5135");
var isArray = __webpack_require__("e8b5");
var isObject = __webpack_require__("861d");
var anObject = __webpack_require__("825a");
var toObject = __webpack_require__("7b0b");
var toIndexedObject = __webpack_require__("fc6a");
var toPrimitive = __webpack_require__("c04e");
var createPropertyDescriptor = __webpack_require__("5c6c");
var nativeObjectCreate = __webpack_require__("7c73");
var objectKeys = __webpack_require__("df75");
var getOwnPropertyNamesModule = __webpack_require__("241c");
var getOwnPropertyNamesExternal = __webpack_require__("057f");
var getOwnPropertySymbolsModule = __webpack_require__("7418");
var getOwnPropertyDescriptorModule = __webpack_require__("06cf");
var definePropertyModule = __webpack_require__("9bf2");
var propertyIsEnumerableModule = __webpack_require__("d1e7");
var createNonEnumerableProperty = __webpack_require__("9112");
var redefine = __webpack_require__("6eeb");
var shared = __webpack_require__("5692");
var sharedKey = __webpack_require__("f772");
var hiddenKeys = __webpack_require__("d012");
var uid = __webpack_require__("90e3");
var wellKnownSymbol = __webpack_require__("b622");
var wrappedWellKnownSymbolModule = __webpack_require__("e538");
var defineWellKnownSymbol = __webpack_require__("746f");
var setToStringTag = __webpack_require__("d44e");
var InternalStateModule = __webpack_require__("69f3");
var $forEach = __webpack_require__("b727").forEach;

var HIDDEN = sharedKey('hidden');
var SYMBOL = 'Symbol';
var PROTOTYPE = 'prototype';
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(SYMBOL);
var ObjectPrototype = Object[PROTOTYPE];
var $Symbol = global.Symbol;
var $stringify = getBuiltIn('JSON', 'stringify');
var nativeGetOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
var nativeDefineProperty = definePropertyModule.f;
var nativeGetOwnPropertyNames = getOwnPropertyNamesExternal.f;
var nativePropertyIsEnumerable = propertyIsEnumerableModule.f;
var AllSymbols = shared('symbols');
var ObjectPrototypeSymbols = shared('op-symbols');
var StringToSymbolRegistry = shared('string-to-symbol-registry');
var SymbolToStringRegistry = shared('symbol-to-string-registry');
var WellKnownSymbolsStore = shared('wks');
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var USE_SETTER = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDescriptor = DESCRIPTORS && fails(function () {
  return nativeObjectCreate(nativeDefineProperty({}, 'a', {
    get: function () { return nativeDefineProperty(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (O, P, Attributes) {
  var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor(ObjectPrototype, P);
  if (ObjectPrototypeDescriptor) delete ObjectPrototype[P];
  nativeDefineProperty(O, P, Attributes);
  if (ObjectPrototypeDescriptor && O !== ObjectPrototype) {
    nativeDefineProperty(ObjectPrototype, P, ObjectPrototypeDescriptor);
  }
} : nativeDefineProperty;

var wrap = function (tag, description) {
  var symbol = AllSymbols[tag] = nativeObjectCreate($Symbol[PROTOTYPE]);
  setInternalState(symbol, {
    type: SYMBOL,
    tag: tag,
    description: description
  });
  if (!DESCRIPTORS) symbol.description = description;
  return symbol;
};

var isSymbol = USE_SYMBOL_AS_UID ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return Object(it) instanceof $Symbol;
};

var $defineProperty = function defineProperty(O, P, Attributes) {
  if (O === ObjectPrototype) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
  anObject(O);
  var key = toPrimitive(P, true);
  anObject(Attributes);
  if (has(AllSymbols, key)) {
    if (!Attributes.enumerable) {
      if (!has(O, HIDDEN)) nativeDefineProperty(O, HIDDEN, createPropertyDescriptor(1, {}));
      O[HIDDEN][key] = true;
    } else {
      if (has(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
      Attributes = nativeObjectCreate(Attributes, { enumerable: createPropertyDescriptor(0, false) });
    } return setSymbolDescriptor(O, key, Attributes);
  } return nativeDefineProperty(O, key, Attributes);
};

var $defineProperties = function defineProperties(O, Properties) {
  anObject(O);
  var properties = toIndexedObject(Properties);
  var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties));
  $forEach(keys, function (key) {
    if (!DESCRIPTORS || $propertyIsEnumerable.call(properties, key)) $defineProperty(O, key, properties[key]);
  });
  return O;
};

var $create = function create(O, Properties) {
  return Properties === undefined ? nativeObjectCreate(O) : $defineProperties(nativeObjectCreate(O), Properties);
};

var $propertyIsEnumerable = function propertyIsEnumerable(V) {
  var P = toPrimitive(V, true);
  var enumerable = nativePropertyIsEnumerable.call(this, P);
  if (this === ObjectPrototype && has(AllSymbols, P) && !has(ObjectPrototypeSymbols, P)) return false;
  return enumerable || !has(this, P) || !has(AllSymbols, P) || has(this, HIDDEN) && this[HIDDEN][P] ? enumerable : true;
};

var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
  var it = toIndexedObject(O);
  var key = toPrimitive(P, true);
  if (it === ObjectPrototype && has(AllSymbols, key) && !has(ObjectPrototypeSymbols, key)) return;
  var descriptor = nativeGetOwnPropertyDescriptor(it, key);
  if (descriptor && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) {
    descriptor.enumerable = true;
  }
  return descriptor;
};

var $getOwnPropertyNames = function getOwnPropertyNames(O) {
  var names = nativeGetOwnPropertyNames(toIndexedObject(O));
  var result = [];
  $forEach(names, function (key) {
    if (!has(AllSymbols, key) && !has(hiddenKeys, key)) result.push(key);
  });
  return result;
};

var $getOwnPropertySymbols = function getOwnPropertySymbols(O) {
  var IS_OBJECT_PROTOTYPE = O === ObjectPrototype;
  var names = nativeGetOwnPropertyNames(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
  var result = [];
  $forEach(names, function (key) {
    if (has(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || has(ObjectPrototype, key))) {
      result.push(AllSymbols[key]);
    }
  });
  return result;
};

// `Symbol` constructor
// https://tc39.github.io/ecma262/#sec-symbol-constructor
if (!NATIVE_SYMBOL) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor');
    var description = !arguments.length || arguments[0] === undefined ? undefined : String(arguments[0]);
    var tag = uid(description);
    var setter = function (value) {
      if (this === ObjectPrototype) setter.call(ObjectPrototypeSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
    };
    if (DESCRIPTORS && USE_SETTER) setSymbolDescriptor(ObjectPrototype, tag, { configurable: true, set: setter });
    return wrap(tag, description);
  };

  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return getInternalState(this).tag;
  });

  redefine($Symbol, 'withoutSetter', function (description) {
    return wrap(uid(description), description);
  });

  propertyIsEnumerableModule.f = $propertyIsEnumerable;
  definePropertyModule.f = $defineProperty;
  getOwnPropertyDescriptorModule.f = $getOwnPropertyDescriptor;
  getOwnPropertyNamesModule.f = getOwnPropertyNamesExternal.f = $getOwnPropertyNames;
  getOwnPropertySymbolsModule.f = $getOwnPropertySymbols;

  wrappedWellKnownSymbolModule.f = function (name) {
    return wrap(wellKnownSymbol(name), name);
  };

  if (DESCRIPTORS) {
    // https://github.com/tc39/proposal-Symbol-description
    nativeDefineProperty($Symbol[PROTOTYPE], 'description', {
      configurable: true,
      get: function description() {
        return getInternalState(this).description;
      }
    });
    if (!IS_PURE) {
      redefine(ObjectPrototype, 'propertyIsEnumerable', $propertyIsEnumerable, { unsafe: true });
    }
  }
}

$({ global: true, wrap: true, forced: !NATIVE_SYMBOL, sham: !NATIVE_SYMBOL }, {
  Symbol: $Symbol
});

$forEach(objectKeys(WellKnownSymbolsStore), function (name) {
  defineWellKnownSymbol(name);
});

$({ target: SYMBOL, stat: true, forced: !NATIVE_SYMBOL }, {
  // `Symbol.for` method
  // https://tc39.github.io/ecma262/#sec-symbol.for
  'for': function (key) {
    var string = String(key);
    if (has(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
    var symbol = $Symbol(string);
    StringToSymbolRegistry[string] = symbol;
    SymbolToStringRegistry[symbol] = string;
    return symbol;
  },
  // `Symbol.keyFor` method
  // https://tc39.github.io/ecma262/#sec-symbol.keyfor
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol');
    if (has(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
  },
  useSetter: function () { USE_SETTER = true; },
  useSimple: function () { USE_SETTER = false; }
});

$({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL, sham: !DESCRIPTORS }, {
  // `Object.create` method
  // https://tc39.github.io/ecma262/#sec-object.create
  create: $create,
  // `Object.defineProperty` method
  // https://tc39.github.io/ecma262/#sec-object.defineproperty
  defineProperty: $defineProperty,
  // `Object.defineProperties` method
  // https://tc39.github.io/ecma262/#sec-object.defineproperties
  defineProperties: $defineProperties,
  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptors
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor
});

$({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL }, {
  // `Object.getOwnPropertyNames` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertynames
  getOwnPropertyNames: $getOwnPropertyNames,
  // `Object.getOwnPropertySymbols` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertysymbols
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
// https://bugs.chromium.org/p/v8/issues/detail?id=3443
$({ target: 'Object', stat: true, forced: fails(function () { getOwnPropertySymbolsModule.f(1); }) }, {
  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
    return getOwnPropertySymbolsModule.f(toObject(it));
  }
});

// `JSON.stringify` method behavior with symbols
// https://tc39.github.io/ecma262/#sec-json.stringify
if ($stringify) {
  var FORCED_JSON_STRINGIFY = !NATIVE_SYMBOL || fails(function () {
    var symbol = $Symbol();
    // MS Edge converts symbol values to JSON as {}
    return $stringify([symbol]) != '[null]'
      // WebKit converts symbol values to JSON as null
      || $stringify({ a: symbol }) != '{}'
      // V8 throws on boxed symbols
      || $stringify(Object(symbol)) != '{}';
  });

  $({ target: 'JSON', stat: true, forced: FORCED_JSON_STRINGIFY }, {
    // eslint-disable-next-line no-unused-vars
    stringify: function stringify(it, replacer, space) {
      var args = [it];
      var index = 1;
      var $replacer;
      while (arguments.length > index) args.push(arguments[index++]);
      $replacer = replacer;
      if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
      if (!isArray(replacer)) replacer = function (key, value) {
        if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
        if (!isSymbol(value)) return value;
      };
      args[1] = replacer;
      return $stringify.apply(null, args);
    }
  });
}

// `Symbol.prototype[@@toPrimitive]` method
// https://tc39.github.io/ecma262/#sec-symbol.prototype-@@toprimitive
if (!$Symbol[PROTOTYPE][TO_PRIMITIVE]) {
  createNonEnumerableProperty($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
}
// `Symbol.prototype[@@toStringTag]` property
// https://tc39.github.io/ecma262/#sec-symbol.prototype-@@tostringtag
setToStringTag($Symbol, SYMBOL);

hiddenKeys[HIDDEN] = true;


/***/ }),

/***/ "a630":
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__("23e7");
var from = __webpack_require__("4df4");
var checkCorrectnessOfIteration = __webpack_require__("1c7e");

var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
  Array.from(iterable);
});

// `Array.from` method
// https://tc39.github.io/ecma262/#sec-array.from
$({ target: 'Array', stat: true, forced: INCORRECT_ITERATION }, {
  from: from
});


/***/ }),

/***/ "a640":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__("d039");

module.exports = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call,no-throw-literal
    method.call(null, argument || function () { throw 1; }, 1);
  });
};


/***/ }),

/***/ "a691":
/***/ (function(module, exports) {

var ceil = Math.ceil;
var floor = Math.floor;

// `ToInteger` abstract operation
// https://tc39.github.io/ecma262/#sec-tointeger
module.exports = function (argument) {
  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
};


/***/ }),

/***/ "a8a6":
/***/ (function(module, exports, __webpack_require__) {

var Node = __webpack_require__("28e0");
var DiagonalMovement = __webpack_require__("8b6a");

/**
 * The Grid class, which serves as the encapsulation of the layout of the nodes.
 * @constructor
 * @param {number|Array<Array<(number|boolean)>>} width_or_matrix Number of columns of the grid, or matrix
 * @param {number} height Number of rows of the grid.
 * @param {Array<Array<(number|boolean)>>} [matrix] - A 0-1 matrix
 *     representing the walkable status of the nodes(0 or false for walkable).
 *     If the matrix is not supplied, all the nodes will be walkable.  */
function Grid(width_or_matrix, height, matrix) {
    var width;

    if (typeof width_or_matrix !== 'object') {
        width = width_or_matrix;
    } else {
        height = width_or_matrix.length;
        width = width_or_matrix[0].length;
        matrix = width_or_matrix;
    }

    /**
     * The number of columns of the grid.
     * @type number
     */
    this.width = width;
    /**
     * The number of rows of the grid.
     * @type number
     */
    this.height = height;

    /**
     * A 2D array of nodes.
     */
    this.nodes = this._buildNodes(width, height, matrix);
}

/**
 * Build and return the nodes.
 * @private
 * @param {number} width
 * @param {number} height
 * @param {Array<Array<number|boolean>>} [matrix] - A 0-1 matrix representing
 *     the walkable status of the nodes.
 * @see Grid
 */
Grid.prototype._buildNodes = function(width, height, matrix) {
    var i, j,
        nodes = new Array(height);

    for (i = 0; i < height; ++i) {
        nodes[i] = new Array(width);
        for (j = 0; j < width; ++j) {
            nodes[i][j] = new Node(j, i);
        }
    }


    if (matrix === undefined) {
        return nodes;
    }

    if (matrix.length !== height || matrix[0].length !== width) {
        throw new Error('Matrix size does not fit');
    }

    for (i = 0; i < height; ++i) {
        for (j = 0; j < width; ++j) {
            if (matrix[i][j]) {
                // 0, false, null will be walkable
                // while others will be un-walkable
                nodes[i][j].walkable = false;
            }
        }
    }

    return nodes;
};


Grid.prototype.getNodeAt = function(x, y) {
    return this.nodes[y][x];
};


/**
 * Determine whether the node at the given position is walkable.
 * (Also returns false if the position is outside the grid.)
 * @param {number} x - The x coordinate of the node.
 * @param {number} y - The y coordinate of the node.
 * @return {boolean} - The walkability of the node.
 */
Grid.prototype.isWalkableAt = function(x, y) {
    return this.isInside(x, y) && this.nodes[y][x].walkable;
};


/**
 * Determine whether the position is inside the grid.
 * XXX: `grid.isInside(x, y)` is wierd to read.
 * It should be `(x, y) is inside grid`, but I failed to find a better
 * name for this method.
 * @param {number} x
 * @param {number} y
 * @return {boolean}
 */
Grid.prototype.isInside = function(x, y) {
    return (x >= 0 && x < this.width) && (y >= 0 && y < this.height);
};


/**
 * Set whether the node on the given position is walkable.
 * NOTE: throws exception if the coordinate is not inside the grid.
 * @param {number} x - The x coordinate of the node.
 * @param {number} y - The y coordinate of the node.
 * @param {boolean} walkable - Whether the position is walkable.
 */
Grid.prototype.setWalkableAt = function(x, y, walkable) {
    this.nodes[y][x].walkable = walkable;
};


/**
 * Get the neighbors of the given node.
 *
 *     offsets      diagonalOffsets:
 *  +---+---+---+    +---+---+---+
 *  |   | 0 |   |    | 0 |   | 1 |
 *  +---+---+---+    +---+---+---+
 *  | 3 |   | 1 |    |   |   |   |
 *  +---+---+---+    +---+---+---+
 *  |   | 2 |   |    | 3 |   | 2 |
 *  +---+---+---+    +---+---+---+
 *
 *  When allowDiagonal is true, if offsets[i] is valid, then
 *  diagonalOffsets[i] and
 *  diagonalOffsets[(i + 1) % 4] is valid.
 * @param {Node} node
 * @param {DiagonalMovement} diagonalMovement
 */
Grid.prototype.getNeighbors = function(node, diagonalMovement) {
    var x = node.x,
        y = node.y,
        neighbors = [],
        s0 = false, d0 = false,
        s1 = false, d1 = false,
        s2 = false, d2 = false,
        s3 = false, d3 = false,
        nodes = this.nodes;

    // ↑
    if (this.isWalkableAt(x, y - 1)) {
        neighbors.push(nodes[y - 1][x]);
        s0 = true;
    }
    // →
    if (this.isWalkableAt(x + 1, y)) {
        neighbors.push(nodes[y][x + 1]);
        s1 = true;
    }
    // ↓
    if (this.isWalkableAt(x, y + 1)) {
        neighbors.push(nodes[y + 1][x]);
        s2 = true;
    }
    // ←
    if (this.isWalkableAt(x - 1, y)) {
        neighbors.push(nodes[y][x - 1]);
        s3 = true;
    }

    if (diagonalMovement === DiagonalMovement.Never) {
        return neighbors;
    }

    if (diagonalMovement === DiagonalMovement.OnlyWhenNoObstacles) {
        d0 = s3 && s0;
        d1 = s0 && s1;
        d2 = s1 && s2;
        d3 = s2 && s3;
    } else if (diagonalMovement === DiagonalMovement.IfAtMostOneObstacle) {
        d0 = s3 || s0;
        d1 = s0 || s1;
        d2 = s1 || s2;
        d3 = s2 || s3;
    } else if (diagonalMovement === DiagonalMovement.Always) {
        d0 = true;
        d1 = true;
        d2 = true;
        d3 = true;
    } else {
        throw new Error('Incorrect value of diagonalMovement');
    }

    // ↖
    if (d0 && this.isWalkableAt(x - 1, y - 1)) {
        neighbors.push(nodes[y - 1][x - 1]);
    }
    // ↗
    if (d1 && this.isWalkableAt(x + 1, y - 1)) {
        neighbors.push(nodes[y - 1][x + 1]);
    }
    // ↘
    if (d2 && this.isWalkableAt(x + 1, y + 1)) {
        neighbors.push(nodes[y + 1][x + 1]);
    }
    // ↙
    if (d3 && this.isWalkableAt(x - 1, y + 1)) {
        neighbors.push(nodes[y + 1][x - 1]);
    }

    return neighbors;
};


/**
 * Get a clone of this grid.
 * @return {Grid} Cloned grid.
 */
Grid.prototype.clone = function() {
    var i, j,

        width = this.width,
        height = this.height,
        thisNodes = this.nodes,

        newGrid = new Grid(width, height),
        newNodes = new Array(height);

    for (i = 0; i < height; ++i) {
        newNodes[i] = new Array(width);
        for (j = 0; j < width; ++j) {
            newNodes[i][j] = new Node(j, i, thisNodes[i][j].walkable);
        }
    }

    newGrid.nodes = newNodes;

    return newGrid;
};

module.exports = Grid;


/***/ }),

/***/ "a9e3":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__("83ab");
var global = __webpack_require__("da84");
var isForced = __webpack_require__("94ca");
var redefine = __webpack_require__("6eeb");
var has = __webpack_require__("5135");
var classof = __webpack_require__("c6b6");
var inheritIfRequired = __webpack_require__("7156");
var toPrimitive = __webpack_require__("c04e");
var fails = __webpack_require__("d039");
var create = __webpack_require__("7c73");
var getOwnPropertyNames = __webpack_require__("241c").f;
var getOwnPropertyDescriptor = __webpack_require__("06cf").f;
var defineProperty = __webpack_require__("9bf2").f;
var trim = __webpack_require__("58a8").trim;

var NUMBER = 'Number';
var NativeNumber = global[NUMBER];
var NumberPrototype = NativeNumber.prototype;

// Opera ~12 has broken Object#toString
var BROKEN_CLASSOF = classof(create(NumberPrototype)) == NUMBER;

// `ToNumber` abstract operation
// https://tc39.github.io/ecma262/#sec-tonumber
var toNumber = function (argument) {
  var it = toPrimitive(argument, false);
  var first, third, radix, maxCode, digits, length, index, code;
  if (typeof it == 'string' && it.length > 2) {
    it = trim(it);
    first = it.charCodeAt(0);
    if (first === 43 || first === 45) {
      third = it.charCodeAt(2);
      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if (first === 48) {
      switch (it.charCodeAt(1)) {
        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal of /^0b[01]+$/i
        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal of /^0o[0-7]+$/i
        default: return +it;
      }
      digits = it.slice(2);
      length = digits.length;
      for (index = 0; index < length; index++) {
        code = digits.charCodeAt(index);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if (code < 48 || code > maxCode) return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

// `Number` constructor
// https://tc39.github.io/ecma262/#sec-number-constructor
if (isForced(NUMBER, !NativeNumber(' 0o1') || !NativeNumber('0b1') || NativeNumber('+0x1'))) {
  var NumberWrapper = function Number(value) {
    var it = arguments.length < 1 ? 0 : value;
    var dummy = this;
    return dummy instanceof NumberWrapper
      // check on 1..constructor(foo) case
      && (BROKEN_CLASSOF ? fails(function () { NumberPrototype.valueOf.call(dummy); }) : classof(dummy) != NUMBER)
        ? inheritIfRequired(new NativeNumber(toNumber(it)), dummy, NumberWrapper) : toNumber(it);
  };
  for (var keys = DESCRIPTORS ? getOwnPropertyNames(NativeNumber) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES2015 (in case, if modules with ES2015 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
  ).split(','), j = 0, key; keys.length > j; j++) {
    if (has(NativeNumber, key = keys[j]) && !has(NumberWrapper, key)) {
      defineProperty(NumberWrapper, key, getOwnPropertyDescriptor(NativeNumber, key));
    }
  }
  NumberWrapper.prototype = NumberPrototype;
  NumberPrototype.constructor = NumberWrapper;
  redefine(global, NUMBER, NumberWrapper);
}


/***/ }),

/***/ "ad6d":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var anObject = __webpack_require__("825a");

// `RegExp.prototype.flags` getter implementation
// https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.dotAll) result += 's';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};


/***/ }),

/***/ "ae40":
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__("83ab");
var fails = __webpack_require__("d039");
var has = __webpack_require__("5135");

var defineProperty = Object.defineProperty;
var cache = {};

var thrower = function (it) { throw it; };

module.exports = function (METHOD_NAME, options) {
  if (has(cache, METHOD_NAME)) return cache[METHOD_NAME];
  if (!options) options = {};
  var method = [][METHOD_NAME];
  var ACCESSORS = has(options, 'ACCESSORS') ? options.ACCESSORS : false;
  var argument0 = has(options, 0) ? options[0] : thrower;
  var argument1 = has(options, 1) ? options[1] : undefined;

  return cache[METHOD_NAME] = !!method && !fails(function () {
    if (ACCESSORS && !DESCRIPTORS) return true;
    var O = { length: -1 };

    if (ACCESSORS) defineProperty(O, 1, { enumerable: true, get: thrower });
    else O[1] = 1;

    method.call(O, argument0, argument1);
  });
};


/***/ }),

/***/ "ae6c":
/***/ (function(module, exports, __webpack_require__) {

var Util = __webpack_require__("22b1");
var DiagonalMovement = __webpack_require__("8b6a");

/**
 * Bi-directional Breadth-First-Search path finder.
 * @constructor
 * @param {object} opt
 * @param {boolean} opt.allowDiagonal Whether diagonal movement is allowed.
 *     Deprecated, use diagonalMovement instead.
 * @param {boolean} opt.dontCrossCorners Disallow diagonal movement touching
 *     block corners. Deprecated, use diagonalMovement instead.
 * @param {DiagonalMovement} opt.diagonalMovement Allowed diagonal movement.
 */
function BiBreadthFirstFinder(opt) {
    opt = opt || {};
    this.allowDiagonal = opt.allowDiagonal;
    this.dontCrossCorners = opt.dontCrossCorners;
    this.diagonalMovement = opt.diagonalMovement;

    if (!this.diagonalMovement) {
        if (!this.allowDiagonal) {
            this.diagonalMovement = DiagonalMovement.Never;
        } else {
            if (this.dontCrossCorners) {
                this.diagonalMovement = DiagonalMovement.OnlyWhenNoObstacles;
            } else {
                this.diagonalMovement = DiagonalMovement.IfAtMostOneObstacle;
            }
        }
    }
}


/**
 * Find and return the the path.
 * @return {Array<Array<number>>} The path, including both start and
 *     end positions.
 */
BiBreadthFirstFinder.prototype.findPath = function(startX, startY, endX, endY, grid) {
    var startNode = grid.getNodeAt(startX, startY),
        endNode = grid.getNodeAt(endX, endY),
        startOpenList = [], endOpenList = [],
        neighbors, neighbor, node,
        diagonalMovement = this.diagonalMovement,
        BY_START = 0, BY_END = 1,
        i, l;

    // push the start and end nodes into the queues
    startOpenList.push(startNode);
    startNode.opened = true;
    startNode.by = BY_START;

    endOpenList.push(endNode);
    endNode.opened = true;
    endNode.by = BY_END;

    // while both the queues are not empty
    while (startOpenList.length && endOpenList.length) {

        // expand start open list

        node = startOpenList.shift();
        node.closed = true;

        neighbors = grid.getNeighbors(node, diagonalMovement);
        for (i = 0, l = neighbors.length; i < l; ++i) {
            neighbor = neighbors[i];

            if (neighbor.closed) {
                continue;
            }
            if (neighbor.opened) {
                // if this node has been inspected by the reversed search,
                // then a path is found.
                if (neighbor.by === BY_END) {
                    return Util.biBacktrace(node, neighbor);
                }
                continue;
            }
            startOpenList.push(neighbor);
            neighbor.parent = node;
            neighbor.opened = true;
            neighbor.by = BY_START;
        }

        // expand end open list

        node = endOpenList.shift();
        node.closed = true;

        neighbors = grid.getNeighbors(node, diagonalMovement);
        for (i = 0, l = neighbors.length; i < l; ++i) {
            neighbor = neighbors[i];

            if (neighbor.closed) {
                continue;
            }
            if (neighbor.opened) {
                if (neighbor.by === BY_START) {
                    return Util.biBacktrace(neighbor, node);
                }
                continue;
            }
            endOpenList.push(neighbor);
            neighbor.parent = node;
            neighbor.opened = true;
            neighbor.by = BY_END;
        }
    }

    // fail to find the path
    return [];
};

module.exports = BiBreadthFirstFinder;


/***/ }),

/***/ "ae93":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var getPrototypeOf = __webpack_require__("e163");
var createNonEnumerableProperty = __webpack_require__("9112");
var has = __webpack_require__("5135");
var wellKnownSymbol = __webpack_require__("b622");
var IS_PURE = __webpack_require__("c430");

var ITERATOR = wellKnownSymbol('iterator');
var BUGGY_SAFARI_ITERATORS = false;

var returnThis = function () { return this; };

// `%IteratorPrototype%` object
// https://tc39.github.io/ecma262/#sec-%iteratorprototype%-object
var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

if ([].keys) {
  arrayIterator = [].keys();
  // Safari 8 has buggy iterators w/o `next`
  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
  else {
    PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
  }
}

if (IteratorPrototype == undefined) IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
if (!IS_PURE && !has(IteratorPrototype, ITERATOR)) {
  createNonEnumerableProperty(IteratorPrototype, ITERATOR, returnThis);
}

module.exports = {
  IteratorPrototype: IteratorPrototype,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
};


/***/ }),

/***/ "af03":
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__("d039");

// check the existence of a method, lowercase
// of a tag and escaping quotes in arguments
module.exports = function (METHOD_NAME) {
  return fails(function () {
    var test = ''[METHOD_NAME]('"');
    return test !== test.toLowerCase() || test.split('"').length > 3;
  });
};


/***/ }),

/***/ "b041":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var TO_STRING_TAG_SUPPORT = __webpack_require__("00ee");
var classof = __webpack_require__("f5df");

// `Object.prototype.toString` method implementation
// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
module.exports = TO_STRING_TAG_SUPPORT ? {}.toString : function toString() {
  return '[object ' + classof(this) + ']';
};


/***/ }),

/***/ "b0c0":
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__("83ab");
var defineProperty = __webpack_require__("9bf2").f;

var FunctionPrototype = Function.prototype;
var FunctionPrototypeToString = FunctionPrototype.toString;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// Function instances `.name` property
// https://tc39.github.io/ecma262/#sec-function-instances-name
if (DESCRIPTORS && !(NAME in FunctionPrototype)) {
  defineProperty(FunctionPrototype, NAME, {
    configurable: true,
    get: function () {
      try {
        return FunctionPrototypeToString.call(this).match(nameRE)[1];
      } catch (error) {
        return '';
      }
    }
  });
}


/***/ }),

/***/ "b622":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("da84");
var shared = __webpack_require__("5692");
var has = __webpack_require__("5135");
var uid = __webpack_require__("90e3");
var NATIVE_SYMBOL = __webpack_require__("4930");
var USE_SYMBOL_AS_UID = __webpack_require__("fdbf");

var WellKnownSymbolsStore = shared('wks');
var Symbol = global.Symbol;
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol : Symbol && Symbol.withoutSetter || uid;

module.exports = function (name) {
  if (!has(WellKnownSymbolsStore, name)) {
    if (NATIVE_SYMBOL && has(Symbol, name)) WellKnownSymbolsStore[name] = Symbol[name];
    else WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
  } return WellKnownSymbolsStore[name];
};


/***/ }),

/***/ "b64b":
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__("23e7");
var toObject = __webpack_require__("7b0b");
var nativeKeys = __webpack_require__("df75");
var fails = __webpack_require__("d039");

var FAILS_ON_PRIMITIVES = fails(function () { nativeKeys(1); });

// `Object.keys` method
// https://tc39.github.io/ecma262/#sec-object.keys
$({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
  keys: function keys(it) {
    return nativeKeys(toObject(it));
  }
});


/***/ }),

/***/ "b727":
/***/ (function(module, exports, __webpack_require__) {

var bind = __webpack_require__("0366");
var IndexedObject = __webpack_require__("44ad");
var toObject = __webpack_require__("7b0b");
var toLength = __webpack_require__("50c4");
var arraySpeciesCreate = __webpack_require__("65f0");

var push = [].push;

// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex }` methods implementation
var createMethod = function (TYPE) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  return function ($this, callbackfn, that, specificCreate) {
    var O = toObject($this);
    var self = IndexedObject(O);
    var boundFunction = bind(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var create = specificCreate || arraySpeciesCreate;
    var target = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var value, result;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (TYPE) {
        if (IS_MAP) target[index] = result; // map
        else if (result) switch (TYPE) {
          case 3: return true;              // some
          case 5: return value;             // find
          case 6: return index;             // findIndex
          case 2: push.call(target, value); // filter
        } else if (IS_EVERY) return false;  // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
  };
};

module.exports = {
  // `Array.prototype.forEach` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
  forEach: createMethod(0),
  // `Array.prototype.map` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.map
  map: createMethod(1),
  // `Array.prototype.filter` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.filter
  filter: createMethod(2),
  // `Array.prototype.some` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.some
  some: createMethod(3),
  // `Array.prototype.every` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.every
  every: createMethod(4),
  // `Array.prototype.find` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.find
  find: createMethod(5),
  // `Array.prototype.findIndex` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
  findIndex: createMethod(6)
};


/***/ }),

/***/ "ba4c":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("434c");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__("499e").default
var update = add("2eed3a30", content, true, {"sourceMap":false,"shadowMode":false});

/***/ }),

/***/ "bb2f":
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__("d039");

module.exports = !fails(function () {
  return Object.isExtensible(Object.preventExtensions({}));
});


/***/ }),

/***/ "bd5f":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("f680");


/***/ }),

/***/ "c04e":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("861d");

// `ToPrimitive` abstract operation
// https://tc39.github.io/ecma262/#sec-toprimitive
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (input, PREFERRED_STRING) {
  if (!isObject(input)) return input;
  var fn, val;
  if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
  if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ "c327":
/***/ (function(module, exports) {

module.exports = makeSvgController
module.exports.canAttach = isSVGElement;

function makeSvgController(svgElement, options) {
  if (!isSVGElement(svgElement)) {
    throw new Error('svg element is required for svg.panzoom to work')
  }

  var owner = svgElement.ownerSVGElement
  if (!owner) {
    throw new Error(
      'Do not apply panzoom to the root <svg> element. ' +
      'Use its child instead (e.g. <g></g>). ' +
      'As of March 2016 only FireFox supported transform on the root element')
  }

  if (!options.disableKeyboardInteraction) {
    owner.setAttribute('tabindex', 0);
  }

  var api = {
    getBBox: getBBox,
    getScreenCTM: getScreenCTM,
    getOwner: getOwner,
    applyTransform: applyTransform,
    initTransform: initTransform
  }
  
  return api

  function getOwner() {
    return owner
  }

  function getBBox() {
    var bbox =  svgElement.getBBox()
    return {
      left: bbox.x,
      top: bbox.y,
      width: bbox.width,
      height: bbox.height,
    }
  }

  function getScreenCTM() {
    var ctm = owner.getCTM();
    if (!ctm) {
      // This is likely firefox: https://bugzilla.mozilla.org/show_bug.cgi?id=873106
      // The code below is not entirely correct, but still better than nothing
      return owner.getScreenCTM();
    }
    return ctm;
  }

  function initTransform(transform) {
    var screenCTM = svgElement.getCTM()
    transform.x = screenCTM.e;
    transform.y = screenCTM.f;
    transform.scale = screenCTM.a;
    owner.removeAttributeNS(null, 'viewBox');
  }

  function applyTransform(transform) {
    svgElement.setAttribute('transform', 'matrix(' +
      transform.scale + ' 0 0 ' +
      transform.scale + ' ' +
      transform.x + ' ' + transform.y + ')')
  }
}

function isSVGElement(element) {
  return element && element.ownerSVGElement && element.getCTM;
}

/***/ }),

/***/ "c430":
/***/ (function(module, exports) {

module.exports = false;


/***/ }),

/***/ "c6b6":
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),

/***/ "c6cd":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("da84");
var setGlobal = __webpack_require__("ce4e");

var SHARED = '__core-js_shared__';
var store = global[SHARED] || setGlobal(SHARED, {});

module.exports = store;


/***/ }),

/***/ "c8ba":
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "ca84":
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__("5135");
var toIndexedObject = __webpack_require__("fc6a");
var indexOf = __webpack_require__("4d64").indexOf;
var hiddenKeys = __webpack_require__("d012");

module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~indexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),

/***/ "cc12":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("da84");
var isObject = __webpack_require__("861d");

var document = global.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};


/***/ }),

/***/ "cc7a":
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author aniero / https://github.com/aniero
 */
var DiagonalMovement = __webpack_require__("8b6a");
var JPFNeverMoveDiagonally = __webpack_require__("34a3");
var JPFAlwaysMoveDiagonally = __webpack_require__("e010");
var JPFMoveDiagonallyIfNoObstacles = __webpack_require__("ed06");
var JPFMoveDiagonallyIfAtMostOneObstacle = __webpack_require__("d6cb");

/**
 * Path finder using the Jump Point Search algorithm
 * @param {Object} opt
 * @param {function} opt.heuristic Heuristic function to estimate the distance
 *     (defaults to manhattan).
 * @param {DiagonalMovement} opt.diagonalMovement Condition under which diagonal
 *      movement will be allowed.
 */
function JumpPointFinder(opt) {
    opt = opt || {};
    if (opt.diagonalMovement === DiagonalMovement.Never) {
        return new JPFNeverMoveDiagonally(opt);
    } else if (opt.diagonalMovement === DiagonalMovement.Always) {
        return new JPFAlwaysMoveDiagonally(opt);
    } else if (opt.diagonalMovement === DiagonalMovement.OnlyWhenNoObstacles) {
        return new JPFMoveDiagonallyIfNoObstacles(opt);
    } else {
        return new JPFMoveDiagonallyIfAtMostOneObstacle(opt);
    }
}

module.exports = JumpPointFinder;


/***/ }),

/***/ "ce4e":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("da84");
var createNonEnumerableProperty = __webpack_require__("9112");

module.exports = function (key, value) {
  try {
    createNonEnumerableProperty(global, key, value);
  } catch (error) {
    global[key] = value;
  } return value;
};


/***/ }),

/***/ "d012":
/***/ (function(module, exports) {

module.exports = {};


/***/ }),

/***/ "d039":
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};


/***/ }),

/***/ "d066":
/***/ (function(module, exports, __webpack_require__) {

var path = __webpack_require__("428f");
var global = __webpack_require__("da84");

var aFunction = function (variable) {
  return typeof variable == 'function' ? variable : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global[namespace])
    : path[namespace] && path[namespace][method] || global[namespace] && global[namespace][method];
};


/***/ }),

/***/ "d138":
/***/ (function(module, exports) {

/**
 * https://github.com/gre/bezier-easing
 * BezierEasing - use bezier curve for transition easing function
 * by Gaëtan Renaudeau 2014 - 2015 – MIT License
 */

// These values are established by empiricism with tests (tradeoff: performance VS precision)
var NEWTON_ITERATIONS = 4;
var NEWTON_MIN_SLOPE = 0.001;
var SUBDIVISION_PRECISION = 0.0000001;
var SUBDIVISION_MAX_ITERATIONS = 10;

var kSplineTableSize = 11;
var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

var float32ArraySupported = typeof Float32Array === 'function';

function A (aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
function B (aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
function C (aA1)      { return 3.0 * aA1; }

// Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
function calcBezier (aT, aA1, aA2) { return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT; }

// Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
function getSlope (aT, aA1, aA2) { return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1); }

function binarySubdivide (aX, aA, aB, mX1, mX2) {
  var currentX, currentT, i = 0;
  do {
    currentT = aA + (aB - aA) / 2.0;
    currentX = calcBezier(currentT, mX1, mX2) - aX;
    if (currentX > 0.0) {
      aB = currentT;
    } else {
      aA = currentT;
    }
  } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
  return currentT;
}

function newtonRaphsonIterate (aX, aGuessT, mX1, mX2) {
 for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
   var currentSlope = getSlope(aGuessT, mX1, mX2);
   if (currentSlope === 0.0) {
     return aGuessT;
   }
   var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
   aGuessT -= currentX / currentSlope;
 }
 return aGuessT;
}

function LinearEasing (x) {
  return x;
}

module.exports = function bezier (mX1, mY1, mX2, mY2) {
  if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
    throw new Error('bezier x values must be in [0, 1] range');
  }

  if (mX1 === mY1 && mX2 === mY2) {
    return LinearEasing;
  }

  // Precompute samples table
  var sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
  for (var i = 0; i < kSplineTableSize; ++i) {
    sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
  }

  function getTForX (aX) {
    var intervalStart = 0.0;
    var currentSample = 1;
    var lastSample = kSplineTableSize - 1;

    for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
      intervalStart += kSampleStepSize;
    }
    --currentSample;

    // Interpolate to provide an initial guess for t
    var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
    var guessForT = intervalStart + dist * kSampleStepSize;

    var initialSlope = getSlope(guessForT, mX1, mX2);
    if (initialSlope >= NEWTON_MIN_SLOPE) {
      return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
    } else if (initialSlope === 0.0) {
      return guessForT;
    } else {
      return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
    }
  }

  return function BezierEasing (x) {
    // Because JavaScript number are imprecise, we should guarantee the extremes are right.
    if (x === 0) {
      return 0;
    }
    if (x === 1) {
      return 1;
    }
    return calcBezier(getTForX(x), mY1, mY2);
  };
};


/***/ }),

/***/ "d1e7":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable
exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : nativePropertyIsEnumerable;


/***/ }),

/***/ "d28b":
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__("746f");

// `Symbol.iterator` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.iterator
defineWellKnownSymbol('iterator');


/***/ }),

/***/ "d2bb":
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__("825a");
var aPossiblePrototype = __webpack_require__("3bbe");

// `Object.setPrototypeOf` method
// https://tc39.github.io/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
module.exports = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
    setter.call(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    anObject(O);
    aPossiblePrototype(proto);
    if (CORRECT_SETTER) setter.call(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);


/***/ }),

/***/ "d3b7":
/***/ (function(module, exports, __webpack_require__) {

var TO_STRING_TAG_SUPPORT = __webpack_require__("00ee");
var redefine = __webpack_require__("6eeb");
var toString = __webpack_require__("b041");

// `Object.prototype.toString` method
// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
if (!TO_STRING_TAG_SUPPORT) {
  redefine(Object.prototype, 'toString', toString, { unsafe: true });
}


/***/ }),

/***/ "d44e":
/***/ (function(module, exports, __webpack_require__) {

var defineProperty = __webpack_require__("9bf2").f;
var has = __webpack_require__("5135");
var wellKnownSymbol = __webpack_require__("b622");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');

module.exports = function (it, TAG, STATIC) {
  if (it && !has(it = STATIC ? it : it.prototype, TO_STRING_TAG)) {
    defineProperty(it, TO_STRING_TAG, { configurable: true, value: TAG });
  }
};


/***/ }),

/***/ "d58f":
/***/ (function(module, exports, __webpack_require__) {

var aFunction = __webpack_require__("1c0b");
var toObject = __webpack_require__("7b0b");
var IndexedObject = __webpack_require__("44ad");
var toLength = __webpack_require__("50c4");

// `Array.prototype.{ reduce, reduceRight }` methods implementation
var createMethod = function (IS_RIGHT) {
  return function (that, callbackfn, argumentsLength, memo) {
    aFunction(callbackfn);
    var O = toObject(that);
    var self = IndexedObject(O);
    var length = toLength(O.length);
    var index = IS_RIGHT ? length - 1 : 0;
    var i = IS_RIGHT ? -1 : 1;
    if (argumentsLength < 2) while (true) {
      if (index in self) {
        memo = self[index];
        index += i;
        break;
      }
      index += i;
      if (IS_RIGHT ? index < 0 : length <= index) {
        throw TypeError('Reduce of empty array with no initial value');
      }
    }
    for (;IS_RIGHT ? index >= 0 : length > index; index += i) if (index in self) {
      memo = callbackfn(memo, self[index], index, O);
    }
    return memo;
  };
};

module.exports = {
  // `Array.prototype.reduce` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.reduce
  left: createMethod(false),
  // `Array.prototype.reduceRight` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.reduceright
  right: createMethod(true)
};


/***/ }),

/***/ "d6cb":
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author imor / https://github.com/imor
 */
var JumpPointFinderBase = __webpack_require__("313c");
var DiagonalMovement = __webpack_require__("8b6a");

/**
 * Path finder using the Jump Point Search algorithm which moves
 * diagonally only when there is at most one obstacle.
 */
function JPFMoveDiagonallyIfAtMostOneObstacle(opt) {
    JumpPointFinderBase.call(this, opt);
}

JPFMoveDiagonallyIfAtMostOneObstacle.prototype = new JumpPointFinderBase();
JPFMoveDiagonallyIfAtMostOneObstacle.prototype.constructor = JPFMoveDiagonallyIfAtMostOneObstacle;

/**
 * Search recursively in the direction (parent -> child), stopping only when a
 * jump point is found.
 * @protected
 * @return {Array<Array<number>>} The x, y coordinate of the jump point
 *     found, or null if not found
 */
JPFMoveDiagonallyIfAtMostOneObstacle.prototype._jump = function(x, y, px, py) {
    var grid = this.grid,
        dx = x - px, dy = y - py;

    if (!grid.isWalkableAt(x, y)) {
        return null;
    }

    if(this.trackJumpRecursion === true) {
        grid.getNodeAt(x, y).tested = true;
    }

    if (grid.getNodeAt(x, y) === this.endNode) {
        return [x, y];
    }

    // check for forced neighbors
    // along the diagonal
    if (dx !== 0 && dy !== 0) {
        if ((grid.isWalkableAt(x - dx, y + dy) && !grid.isWalkableAt(x - dx, y)) ||
            (grid.isWalkableAt(x + dx, y - dy) && !grid.isWalkableAt(x, y - dy))) {
            return [x, y];
        }
        // when moving diagonally, must check for vertical/horizontal jump points
        if (this._jump(x + dx, y, x, y) || this._jump(x, y + dy, x, y)) {
            return [x, y];
        }
    }
    // horizontally/vertically
    else {
        if( dx !== 0 ) { // moving along x
            if((grid.isWalkableAt(x + dx, y + 1) && !grid.isWalkableAt(x, y + 1)) ||
               (grid.isWalkableAt(x + dx, y - 1) && !grid.isWalkableAt(x, y - 1))) {
                return [x, y];
            }
        }
        else {
            if((grid.isWalkableAt(x + 1, y + dy) && !grid.isWalkableAt(x + 1, y)) ||
               (grid.isWalkableAt(x - 1, y + dy) && !grid.isWalkableAt(x - 1, y))) {
                return [x, y];
            }
        }
    }

    // moving diagonally, must make sure one of the vertical/horizontal
    // neighbors is open to allow the path
    if (grid.isWalkableAt(x + dx, y) || grid.isWalkableAt(x, y + dy)) {
        return this._jump(x + dx, y + dy, x, y);
    } else {
        return null;
    }
};

/**
 * Find the neighbors for the given node. If the node has a parent,
 * prune the neighbors based on the jump point search algorithm, otherwise
 * return all available neighbors.
 * @return {Array<Array<number>>} The neighbors found.
 */
JPFMoveDiagonallyIfAtMostOneObstacle.prototype._findNeighbors = function(node) {
    var parent = node.parent,
        x = node.x, y = node.y,
        grid = this.grid,
        px, py, nx, ny, dx, dy,
        neighbors = [], neighborNodes, neighborNode, i, l;

    // directed pruning: can ignore most neighbors, unless forced.
    if (parent) {
        px = parent.x;
        py = parent.y;
        // get the normalized direction of travel
        dx = (x - px) / Math.max(Math.abs(x - px), 1);
        dy = (y - py) / Math.max(Math.abs(y - py), 1);

        // search diagonally
        if (dx !== 0 && dy !== 0) {
            if (grid.isWalkableAt(x, y + dy)) {
                neighbors.push([x, y + dy]);
            }
            if (grid.isWalkableAt(x + dx, y)) {
                neighbors.push([x + dx, y]);
            }
            if (grid.isWalkableAt(x, y + dy) || grid.isWalkableAt(x + dx, y)) {
                neighbors.push([x + dx, y + dy]);
            }
            if (!grid.isWalkableAt(x - dx, y) && grid.isWalkableAt(x, y + dy)) {
                neighbors.push([x - dx, y + dy]);
            }
            if (!grid.isWalkableAt(x, y - dy) && grid.isWalkableAt(x + dx, y)) {
                neighbors.push([x + dx, y - dy]);
            }
        }
        // search horizontally/vertically
        else {
            if(dx === 0) {
                if (grid.isWalkableAt(x, y + dy)) {
                    neighbors.push([x, y + dy]);
                    if (!grid.isWalkableAt(x + 1, y)) {
                        neighbors.push([x + 1, y + dy]);
                    }
                    if (!grid.isWalkableAt(x - 1, y)) {
                        neighbors.push([x - 1, y + dy]);
                    }
                }
            }
            else {
                if (grid.isWalkableAt(x + dx, y)) {
                    neighbors.push([x + dx, y]);
                    if (!grid.isWalkableAt(x, y + 1)) {
                        neighbors.push([x + dx, y + 1]);
                    }
                    if (!grid.isWalkableAt(x, y - 1)) {
                        neighbors.push([x + dx, y - 1]);
                    }
                }
            }
        }
    }
    // return all neighbors
    else {
        neighborNodes = grid.getNeighbors(node, DiagonalMovement.IfAtMostOneObstacle);
        for (i = 0, l = neighborNodes.length; i < l; ++i) {
            neighborNode = neighborNodes[i];
            neighbors.push([neighborNode.x, neighborNode.y]);
        }
    }

    return neighbors;
};

module.exports = JPFMoveDiagonallyIfAtMostOneObstacle;


/***/ }),

/***/ "d81d":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("23e7");
var $map = __webpack_require__("b727").map;
var arrayMethodHasSpeciesSupport = __webpack_require__("1dde");
var arrayMethodUsesToLength = __webpack_require__("ae40");

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('map');
// FF49- issue
var USES_TO_LENGTH = arrayMethodUsesToLength('map');

// `Array.prototype.map` method
// https://tc39.github.io/ecma262/#sec-array.prototype.map
// with adding support of @@species
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH }, {
  map: function map(callbackfn /* , thisArg */) {
    return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),

/***/ "da84":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var check = function (it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
  // eslint-disable-next-line no-undef
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  check(typeof self == 'object' && self) ||
  check(typeof global == 'object' && global) ||
  // eslint-disable-next-line no-new-func
  Function('return this')();

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("c8ba")))

/***/ }),

/***/ "dbb4":
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__("23e7");
var DESCRIPTORS = __webpack_require__("83ab");
var ownKeys = __webpack_require__("56ef");
var toIndexedObject = __webpack_require__("fc6a");
var getOwnPropertyDescriptorModule = __webpack_require__("06cf");
var createProperty = __webpack_require__("8418");

// `Object.getOwnPropertyDescriptors` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptors
$({ target: 'Object', stat: true, sham: !DESCRIPTORS }, {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
    var O = toIndexedObject(object);
    var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
    var keys = ownKeys(O);
    var result = {};
    var index = 0;
    var key, descriptor;
    while (keys.length > index) {
      descriptor = getOwnPropertyDescriptor(O, key = keys[index++]);
      if (descriptor !== undefined) createProperty(result, key, descriptor);
    }
    return result;
  }
});


/***/ }),

/***/ "dca8":
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__("23e7");
var FREEZING = __webpack_require__("bb2f");
var fails = __webpack_require__("d039");
var isObject = __webpack_require__("861d");
var onFreeze = __webpack_require__("f183").onFreeze;

var nativeFreeze = Object.freeze;
var FAILS_ON_PRIMITIVES = fails(function () { nativeFreeze(1); });

// `Object.freeze` method
// https://tc39.github.io/ecma262/#sec-object.freeze
$({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES, sham: !FREEZING }, {
  freeze: function freeze(it) {
    return nativeFreeze && isObject(it) ? nativeFreeze(onFreeze(it)) : it;
  }
});


/***/ }),

/***/ "ddb0":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("da84");
var DOMIterables = __webpack_require__("fdbc");
var ArrayIteratorMethods = __webpack_require__("e260");
var createNonEnumerableProperty = __webpack_require__("9112");
var wellKnownSymbol = __webpack_require__("b622");

var ITERATOR = wellKnownSymbol('iterator');
var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var ArrayValues = ArrayIteratorMethods.values;

for (var COLLECTION_NAME in DOMIterables) {
  var Collection = global[COLLECTION_NAME];
  var CollectionPrototype = Collection && Collection.prototype;
  if (CollectionPrototype) {
    // some Chrome versions have non-configurable methods on DOMTokenList
    if (CollectionPrototype[ITERATOR] !== ArrayValues) try {
      createNonEnumerableProperty(CollectionPrototype, ITERATOR, ArrayValues);
    } catch (error) {
      CollectionPrototype[ITERATOR] = ArrayValues;
    }
    if (!CollectionPrototype[TO_STRING_TAG]) {
      createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG, COLLECTION_NAME);
    }
    if (DOMIterables[COLLECTION_NAME]) for (var METHOD_NAME in ArrayIteratorMethods) {
      // some Chrome versions have non-configurable methods on DOMTokenList
      if (CollectionPrototype[METHOD_NAME] !== ArrayIteratorMethods[METHOD_NAME]) try {
        createNonEnumerableProperty(CollectionPrototype, METHOD_NAME, ArrayIteratorMethods[METHOD_NAME]);
      } catch (error) {
        CollectionPrototype[METHOD_NAME] = ArrayIteratorMethods[METHOD_NAME];
      }
    }
  }
}


/***/ }),

/***/ "deec":
/***/ (function(module, exports, __webpack_require__) {

var AStarFinder = __webpack_require__("0c09");

/**
 * Best-First-Search path-finder.
 * @constructor
 * @extends AStarFinder
 * @param {Object} opt
 * @param {boolean} opt.allowDiagonal Whether diagonal movement is allowed.
 *     Deprecated, use diagonalMovement instead.
 * @param {boolean} opt.dontCrossCorners Disallow diagonal movement touching
 *     block corners. Deprecated, use diagonalMovement instead.
 * @param {DiagonalMovement} opt.diagonalMovement Allowed diagonal movement.
 * @param {function} opt.heuristic Heuristic function to estimate the distance
 *     (defaults to manhattan).
 */
function BestFirstFinder(opt) {
    AStarFinder.call(this, opt);

    var orig = this.heuristic;
    this.heuristic = function(dx, dy) {
        return orig(dx, dy) * 1000000;
    };
}

BestFirstFinder.prototype = new AStarFinder();
BestFirstFinder.prototype.constructor = BestFirstFinder;

module.exports = BestFirstFinder;


/***/ }),

/***/ "df75":
/***/ (function(module, exports, __webpack_require__) {

var internalObjectKeys = __webpack_require__("ca84");
var enumBugKeys = __webpack_require__("7839");

// `Object.keys` method
// https://tc39.github.io/ecma262/#sec-object.keys
module.exports = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys);
};


/***/ }),

/***/ "e010":
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author imor / https://github.com/imor
 */
var JumpPointFinderBase = __webpack_require__("313c");
var DiagonalMovement = __webpack_require__("8b6a");

/**
 * Path finder using the Jump Point Search algorithm which always moves
 * diagonally irrespective of the number of obstacles.
 */
function JPFAlwaysMoveDiagonally(opt) {
    JumpPointFinderBase.call(this, opt);
}

JPFAlwaysMoveDiagonally.prototype = new JumpPointFinderBase();
JPFAlwaysMoveDiagonally.prototype.constructor = JPFAlwaysMoveDiagonally;

/**
 * Search recursively in the direction (parent -> child), stopping only when a
 * jump point is found.
 * @protected
 * @return {Array<Array<number>>} The x, y coordinate of the jump point
 *     found, or null if not found
 */
JPFAlwaysMoveDiagonally.prototype._jump = function(x, y, px, py) {
    var grid = this.grid,
        dx = x - px, dy = y - py;

    if (!grid.isWalkableAt(x, y)) {
        return null;
    }

    if(this.trackJumpRecursion === true) {
        grid.getNodeAt(x, y).tested = true;
    }

    if (grid.getNodeAt(x, y) === this.endNode) {
        return [x, y];
    }

    // check for forced neighbors
    // along the diagonal
    if (dx !== 0 && dy !== 0) {
        if ((grid.isWalkableAt(x - dx, y + dy) && !grid.isWalkableAt(x - dx, y)) ||
            (grid.isWalkableAt(x + dx, y - dy) && !grid.isWalkableAt(x, y - dy))) {
            return [x, y];
        }
        // when moving diagonally, must check for vertical/horizontal jump points
        if (this._jump(x + dx, y, x, y) || this._jump(x, y + dy, x, y)) {
            return [x, y];
        }
    }
    // horizontally/vertically
    else {
        if( dx !== 0 ) { // moving along x
            if((grid.isWalkableAt(x + dx, y + 1) && !grid.isWalkableAt(x, y + 1)) ||
               (grid.isWalkableAt(x + dx, y - 1) && !grid.isWalkableAt(x, y - 1))) {
                return [x, y];
            }
        }
        else {
            if((grid.isWalkableAt(x + 1, y + dy) && !grid.isWalkableAt(x + 1, y)) ||
               (grid.isWalkableAt(x - 1, y + dy) && !grid.isWalkableAt(x - 1, y))) {
                return [x, y];
            }
        }
    }

    return this._jump(x + dx, y + dy, x, y);
};

/**
 * Find the neighbors for the given node. If the node has a parent,
 * prune the neighbors based on the jump point search algorithm, otherwise
 * return all available neighbors.
 * @return {Array<Array<number>>} The neighbors found.
 */
JPFAlwaysMoveDiagonally.prototype._findNeighbors = function(node) {
    var parent = node.parent,
        x = node.x, y = node.y,
        grid = this.grid,
        px, py, nx, ny, dx, dy,
        neighbors = [], neighborNodes, neighborNode, i, l;

    // directed pruning: can ignore most neighbors, unless forced.
    if (parent) {
        px = parent.x;
        py = parent.y;
        // get the normalized direction of travel
        dx = (x - px) / Math.max(Math.abs(x - px), 1);
        dy = (y - py) / Math.max(Math.abs(y - py), 1);

        // search diagonally
        if (dx !== 0 && dy !== 0) {
            if (grid.isWalkableAt(x, y + dy)) {
                neighbors.push([x, y + dy]);
            }
            if (grid.isWalkableAt(x + dx, y)) {
                neighbors.push([x + dx, y]);
            }
            if (grid.isWalkableAt(x + dx, y + dy)) {
                neighbors.push([x + dx, y + dy]);
            }
            if (!grid.isWalkableAt(x - dx, y)) {
                neighbors.push([x - dx, y + dy]);
            }
            if (!grid.isWalkableAt(x, y - dy)) {
                neighbors.push([x + dx, y - dy]);
            }
        }
        // search horizontally/vertically
        else {
            if(dx === 0) {
                if (grid.isWalkableAt(x, y + dy)) {
                    neighbors.push([x, y + dy]);
                }
                if (!grid.isWalkableAt(x + 1, y)) {
                    neighbors.push([x + 1, y + dy]);
                }
                if (!grid.isWalkableAt(x - 1, y)) {
                    neighbors.push([x - 1, y + dy]);
                }
            }
            else {
                if (grid.isWalkableAt(x + dx, y)) {
                    neighbors.push([x + dx, y]);
                }
                if (!grid.isWalkableAt(x, y + 1)) {
                    neighbors.push([x + dx, y + 1]);
                }
                if (!grid.isWalkableAt(x, y - 1)) {
                    neighbors.push([x + dx, y - 1]);
                }
            }
        }
    }
    // return all neighbors
    else {
        neighborNodes = grid.getNeighbors(node, DiagonalMovement.Always);
        for (i = 0, l = neighborNodes.length; i < l; ++i) {
            neighborNode = neighborNodes[i];
            neighbors.push([neighborNode.x, neighborNode.y]);
        }
    }

    return neighbors;
};

module.exports = JPFAlwaysMoveDiagonally;


/***/ }),

/***/ "e01a":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// `Symbol.prototype.description` getter
// https://tc39.github.io/ecma262/#sec-symbol.prototype.description

var $ = __webpack_require__("23e7");
var DESCRIPTORS = __webpack_require__("83ab");
var global = __webpack_require__("da84");
var has = __webpack_require__("5135");
var isObject = __webpack_require__("861d");
var defineProperty = __webpack_require__("9bf2").f;
var copyConstructorProperties = __webpack_require__("e893");

var NativeSymbol = global.Symbol;

if (DESCRIPTORS && typeof NativeSymbol == 'function' && (!('description' in NativeSymbol.prototype) ||
  // Safari 12 bug
  NativeSymbol().description !== undefined
)) {
  var EmptyStringDescriptionStore = {};
  // wrap Symbol constructor for correct work with undefined description
  var SymbolWrapper = function Symbol() {
    var description = arguments.length < 1 || arguments[0] === undefined ? undefined : String(arguments[0]);
    var result = this instanceof SymbolWrapper
      ? new NativeSymbol(description)
      // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
      : description === undefined ? NativeSymbol() : NativeSymbol(description);
    if (description === '') EmptyStringDescriptionStore[result] = true;
    return result;
  };
  copyConstructorProperties(SymbolWrapper, NativeSymbol);
  var symbolPrototype = SymbolWrapper.prototype = NativeSymbol.prototype;
  symbolPrototype.constructor = SymbolWrapper;

  var symbolToString = symbolPrototype.toString;
  var native = String(NativeSymbol('test')) == 'Symbol(test)';
  var regexp = /^Symbol\((.*)\)[^)]+$/;
  defineProperty(symbolPrototype, 'description', {
    configurable: true,
    get: function description() {
      var symbol = isObject(this) ? this.valueOf() : this;
      var string = symbolToString.call(symbol);
      if (has(EmptyStringDescriptionStore, symbol)) return '';
      var desc = native ? string.slice(7, -1) : string.replace(regexp, '$1');
      return desc === '' ? undefined : desc;
    }
  });

  $({ global: true, forced: true }, {
    Symbol: SymbolWrapper
  });
}


/***/ }),

/***/ "e01a1":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Default_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("7079");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Default_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Default_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Default_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "e021":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Default_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("38b7");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Default_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Default_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Default_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "e163":
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__("5135");
var toObject = __webpack_require__("7b0b");
var sharedKey = __webpack_require__("f772");
var CORRECT_PROTOTYPE_GETTER = __webpack_require__("e177");

var IE_PROTO = sharedKey('IE_PROTO');
var ObjectPrototype = Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.github.io/ecma262/#sec-object.getprototypeof
module.exports = CORRECT_PROTOTYPE_GETTER ? Object.getPrototypeOf : function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectPrototype : null;
};


/***/ }),

/***/ "e177":
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__("d039");

module.exports = !fails(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  return Object.getPrototypeOf(new F()) !== F.prototype;
});


/***/ }),

/***/ "e260":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var toIndexedObject = __webpack_require__("fc6a");
var addToUnscopables = __webpack_require__("44d2");
var Iterators = __webpack_require__("3f8c");
var InternalStateModule = __webpack_require__("69f3");
var defineIterator = __webpack_require__("7dd0");

var ARRAY_ITERATOR = 'Array Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(ARRAY_ITERATOR);

// `Array.prototype.entries` method
// https://tc39.github.io/ecma262/#sec-array.prototype.entries
// `Array.prototype.keys` method
// https://tc39.github.io/ecma262/#sec-array.prototype.keys
// `Array.prototype.values` method
// https://tc39.github.io/ecma262/#sec-array.prototype.values
// `Array.prototype[@@iterator]` method
// https://tc39.github.io/ecma262/#sec-array.prototype-@@iterator
// `CreateArrayIterator` internal method
// https://tc39.github.io/ecma262/#sec-createarrayiterator
module.exports = defineIterator(Array, 'Array', function (iterated, kind) {
  setInternalState(this, {
    type: ARRAY_ITERATOR,
    target: toIndexedObject(iterated), // target
    index: 0,                          // next index
    kind: kind                         // kind
  });
// `%ArrayIteratorPrototype%.next` method
// https://tc39.github.io/ecma262/#sec-%arrayiteratorprototype%.next
}, function () {
  var state = getInternalState(this);
  var target = state.target;
  var kind = state.kind;
  var index = state.index++;
  if (!target || index >= target.length) {
    state.target = undefined;
    return { value: undefined, done: true };
  }
  if (kind == 'keys') return { value: index, done: false };
  if (kind == 'values') return { value: target[index], done: false };
  return { value: [index, target[index]], done: false };
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values%
// https://tc39.github.io/ecma262/#sec-createunmappedargumentsobject
// https://tc39.github.io/ecma262/#sec-createmappedargumentsobject
Iterators.Arguments = Iterators.Array;

// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),

/***/ "e2aa":
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__("24fb");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".link{cursor:pointer;left:0;overflow:visible;position:absolute;right:0}", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "e439":
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__("23e7");
var fails = __webpack_require__("d039");
var toIndexedObject = __webpack_require__("fc6a");
var nativeGetOwnPropertyDescriptor = __webpack_require__("06cf").f;
var DESCRIPTORS = __webpack_require__("83ab");

var FAILS_ON_PRIMITIVES = fails(function () { nativeGetOwnPropertyDescriptor(1); });
var FORCED = !DESCRIPTORS || FAILS_ON_PRIMITIVES;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
$({ target: 'Object', stat: true, forced: FORCED, sham: !DESCRIPTORS }, {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(it, key) {
    return nativeGetOwnPropertyDescriptor(toIndexedObject(it), key);
  }
});


/***/ }),

/***/ "e538":
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__("b622");

exports.f = wellKnownSymbol;


/***/ }),

/***/ "e893":
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__("5135");
var ownKeys = __webpack_require__("56ef");
var getOwnPropertyDescriptorModule = __webpack_require__("06cf");
var definePropertyModule = __webpack_require__("9bf2");

module.exports = function (target, source) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
  }
};


/***/ }),

/***/ "e8b5":
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__("c6b6");

// `IsArray` abstract operation
// https://tc39.github.io/ecma262/#sec-isarray
module.exports = Array.isArray || function isArray(arg) {
  return classof(arg) == 'Array';
};


/***/ }),

/***/ "e95a":
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__("b622");
var Iterators = __webpack_require__("3f8c");

var ITERATOR = wellKnownSymbol('iterator');
var ArrayPrototype = Array.prototype;

// check on default Array iterator
module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it);
};


/***/ }),

/***/ "e9ff":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * Allows smooth kinetic scrolling of the surface
 */
module.exports = kinetic;

function kinetic(getPoint, scroll, settings) {
  if (typeof settings !== 'object') {
    // setting could come as boolean, we should ignore it, and use an object.
    settings = {};
  }

  var minVelocity = typeof settings.minVelocity === 'number' ? settings.minVelocity : 5;
  var amplitude = typeof settings.amplitude === 'number' ? settings.amplitude : 0.25;
  var cancelAnimationFrame = typeof settings.cancelAnimationFrame === 'function' ? settings.cancelAnimationFrame : getCancelAnimationFrame();
  var requestAnimationFrame = typeof settings.requestAnimationFrame === 'function' ? settings.requestAnimationFrame : getRequestAnimationFrame();

  var lastPoint;
  var timestamp;
  var timeConstant = 342;

  var ticker;
  var vx, targetX, ax;
  var vy, targetY, ay;

  var raf;

  return {
    start: start,
    stop: stop,
    cancel: dispose
  };

  function dispose() {
    cancelAnimationFrame(ticker);
    cancelAnimationFrame(raf);
  }

  function start() {
    lastPoint = getPoint();

    ax = ay = vx = vy = 0;
    timestamp = new Date();

    cancelAnimationFrame(ticker);
    cancelAnimationFrame(raf);

    // we start polling the point position to accumulate velocity
    // Once we stop(), we will use accumulated velocity to keep scrolling
    // an object.
    ticker = requestAnimationFrame(track);
  }

  function track() {
    var now = Date.now();
    var elapsed = now - timestamp;
    timestamp = now;

    var currentPoint = getPoint();

    var dx = currentPoint.x - lastPoint.x;
    var dy = currentPoint.y - lastPoint.y;

    lastPoint = currentPoint;

    var dt = 1000 / (1 + elapsed);

    // moving average
    vx = 0.8 * dx * dt + 0.2 * vx;
    vy = 0.8 * dy * dt + 0.2 * vy;

    ticker = requestAnimationFrame(track);
  }

  function stop() {
    cancelAnimationFrame(ticker);
    cancelAnimationFrame(raf);

    var currentPoint = getPoint();

    targetX = currentPoint.x;
    targetY = currentPoint.y;
    timestamp = Date.now();

    if (vx < -minVelocity || vx > minVelocity) {
      ax = amplitude * vx;
      targetX += ax;
    }

    if (vy < -minVelocity || vy > minVelocity) {
      ay = amplitude * vy;
      targetY += ay;
    }

    raf = requestAnimationFrame(autoScroll);
  }

  function autoScroll() {
    var elapsed = Date.now() - timestamp;

    var moving = false;
    var dx = 0;
    var dy = 0;

    if (ax) {
      dx = -ax * Math.exp(-elapsed / timeConstant);

      if (dx > 0.5 || dx < -0.5) moving = true;
      else dx = ax = 0;
    }

    if (ay) {
      dy = -ay * Math.exp(-elapsed / timeConstant);

      if (dy > 0.5 || dy < -0.5) moving = true;
      else dy = ay = 0;
    }

    if (moving) {
      scroll(targetX + dx, targetY + dy);
      raf = requestAnimationFrame(autoScroll);
    }
  }
}

function getCancelAnimationFrame() {
  if (typeof global.cancelAnimationFrame === 'function') return global.cancelAnimationFrame;

  return clearTimeout;
}

function getRequestAnimationFrame() {
  if (typeof global.requestAnimationFrame === 'function') return global.requestAnimationFrame;

  return function (handler) {
    return setTimeout(handler, 16);
  }
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("c8ba")))

/***/ }),

/***/ "ebe2":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _generics__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("6bb2");
/* harmony import */ var _generics__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_generics__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (checked) */ if(__webpack_require__.o(_generics__WEBPACK_IMPORTED_MODULE_0__, "PortDirection")) __webpack_require__.d(__webpack_exports__, "PortDirection", function() { return _generics__WEBPACK_IMPORTED_MODULE_0__["PortDirection"]; });

/* harmony import */ var _graph__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("2ced");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "PortDirection", function() { return _graph__WEBPACK_IMPORTED_MODULE_1__["a"]; });

/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("91ae");
/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_store__WEBPACK_IMPORTED_MODULE_2__);




/***/ }),

/***/ "ed06":
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author imor / https://github.com/imor
 */
var JumpPointFinderBase = __webpack_require__("313c");
var DiagonalMovement = __webpack_require__("8b6a");

/**
 * Path finder using the Jump Point Search algorithm which moves
 * diagonally only when there are no obstacles.
 */
function JPFMoveDiagonallyIfNoObstacles(opt) {
    JumpPointFinderBase.call(this, opt);
}

JPFMoveDiagonallyIfNoObstacles.prototype = new JumpPointFinderBase();
JPFMoveDiagonallyIfNoObstacles.prototype.constructor = JPFMoveDiagonallyIfNoObstacles;

/**
 * Search recursively in the direction (parent -> child), stopping only when a
 * jump point is found.
 * @protected
 * @return {Array<Array<number>>} The x, y coordinate of the jump point
 *     found, or null if not found
 */
JPFMoveDiagonallyIfNoObstacles.prototype._jump = function(x, y, px, py) {
    var grid = this.grid,
        dx = x - px, dy = y - py;

    if (!grid.isWalkableAt(x, y)) {
        return null;
    }

    if(this.trackJumpRecursion === true) {
        grid.getNodeAt(x, y).tested = true;
    }

    if (grid.getNodeAt(x, y) === this.endNode) {
        return [x, y];
    }

    // check for forced neighbors
    // along the diagonal
    if (dx !== 0 && dy !== 0) {
        // if ((grid.isWalkableAt(x - dx, y + dy) && !grid.isWalkableAt(x - dx, y)) ||
            // (grid.isWalkableAt(x + dx, y - dy) && !grid.isWalkableAt(x, y - dy))) {
            // return [x, y];
        // }
        // when moving diagonally, must check for vertical/horizontal jump points
        if (this._jump(x + dx, y, x, y) || this._jump(x, y + dy, x, y)) {
            return [x, y];
        }
    }
    // horizontally/vertically
    else {
        if (dx !== 0) {
            if ((grid.isWalkableAt(x, y - 1) && !grid.isWalkableAt(x - dx, y - 1)) ||
                (grid.isWalkableAt(x, y + 1) && !grid.isWalkableAt(x - dx, y + 1))) {
                return [x, y];
            }
        }
        else if (dy !== 0) {
            if ((grid.isWalkableAt(x - 1, y) && !grid.isWalkableAt(x - 1, y - dy)) ||
                (grid.isWalkableAt(x + 1, y) && !grid.isWalkableAt(x + 1, y - dy))) {
                return [x, y];
            }
            // When moving vertically, must check for horizontal jump points
            // if (this._jump(x + 1, y, x, y) || this._jump(x - 1, y, x, y)) {
                // return [x, y];
            // }
        }
    }

    // moving diagonally, must make sure one of the vertical/horizontal
    // neighbors is open to allow the path
    if (grid.isWalkableAt(x + dx, y) && grid.isWalkableAt(x, y + dy)) {
        return this._jump(x + dx, y + dy, x, y);
    } else {
        return null;
    }
};

/**
 * Find the neighbors for the given node. If the node has a parent,
 * prune the neighbors based on the jump point search algorithm, otherwise
 * return all available neighbors.
 * @return {Array<Array<number>>} The neighbors found.
 */
JPFMoveDiagonallyIfNoObstacles.prototype._findNeighbors = function(node) {
    var parent = node.parent,
        x = node.x, y = node.y,
        grid = this.grid,
        px, py, nx, ny, dx, dy,
        neighbors = [], neighborNodes, neighborNode, i, l;

    // directed pruning: can ignore most neighbors, unless forced.
    if (parent) {
        px = parent.x;
        py = parent.y;
        // get the normalized direction of travel
        dx = (x - px) / Math.max(Math.abs(x - px), 1);
        dy = (y - py) / Math.max(Math.abs(y - py), 1);

        // search diagonally
        if (dx !== 0 && dy !== 0) {
            if (grid.isWalkableAt(x, y + dy)) {
                neighbors.push([x, y + dy]);
            }
            if (grid.isWalkableAt(x + dx, y)) {
                neighbors.push([x + dx, y]);
            }
            if (grid.isWalkableAt(x, y + dy) && grid.isWalkableAt(x + dx, y)) {
                neighbors.push([x + dx, y + dy]);
            }
        }
        // search horizontally/vertically
        else {
            var isNextWalkable;
            if (dx !== 0) {
                isNextWalkable = grid.isWalkableAt(x + dx, y);
                var isTopWalkable = grid.isWalkableAt(x, y + 1);
                var isBottomWalkable = grid.isWalkableAt(x, y - 1);

                if (isNextWalkable) {
                    neighbors.push([x + dx, y]);
                    if (isTopWalkable) {
                        neighbors.push([x + dx, y + 1]);
                    }
                    if (isBottomWalkable) {
                        neighbors.push([x + dx, y - 1]);
                    }
                }
                if (isTopWalkable) {
                    neighbors.push([x, y + 1]);
                }
                if (isBottomWalkable) {
                    neighbors.push([x, y - 1]);
                }
            }
            else if (dy !== 0) {
                isNextWalkable = grid.isWalkableAt(x, y + dy);
                var isRightWalkable = grid.isWalkableAt(x + 1, y);
                var isLeftWalkable = grid.isWalkableAt(x - 1, y);

                if (isNextWalkable) {
                    neighbors.push([x, y + dy]);
                    if (isRightWalkable) {
                        neighbors.push([x + 1, y + dy]);
                    }
                    if (isLeftWalkable) {
                        neighbors.push([x - 1, y + dy]);
                    }
                }
                if (isRightWalkable) {
                    neighbors.push([x + 1, y]);
                }
                if (isLeftWalkable) {
                    neighbors.push([x - 1, y]);
                }
            }
        }
    }
    // return all neighbors
    else {
        neighborNodes = grid.getNeighbors(node, DiagonalMovement.OnlyWhenNoObstacles);
        for (i = 0, l = neighborNodes.length; i < l; ++i) {
            neighborNode = neighborNodes[i];
            neighbors.push([neighborNode.x, neighborNode.y]);
        }
    }

    return neighbors;
};

module.exports = JPFMoveDiagonallyIfNoObstacles;


/***/ }),

/***/ "f183":
/***/ (function(module, exports, __webpack_require__) {

var hiddenKeys = __webpack_require__("d012");
var isObject = __webpack_require__("861d");
var has = __webpack_require__("5135");
var defineProperty = __webpack_require__("9bf2").f;
var uid = __webpack_require__("90e3");
var FREEZING = __webpack_require__("bb2f");

var METADATA = uid('meta');
var id = 0;

var isExtensible = Object.isExtensible || function () {
  return true;
};

var setMetadata = function (it) {
  defineProperty(it, METADATA, { value: {
    objectID: 'O' + ++id, // object ID
    weakData: {}          // weak collections IDs
  } });
};

var fastKey = function (it, create) {
  // return a primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, METADATA)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMetadata(it);
  // return object ID
  } return it[METADATA].objectID;
};

var getWeakData = function (it, create) {
  if (!has(it, METADATA)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMetadata(it);
  // return the store of weak collections IDs
  } return it[METADATA].weakData;
};

// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZING && meta.REQUIRED && isExtensible(it) && !has(it, METADATA)) setMetadata(it);
  return it;
};

var meta = module.exports = {
  REQUIRED: false,
  fastKey: fastKey,
  getWeakData: getWeakData,
  onFreeze: onFreeze
};

hiddenKeys[METADATA] = true;


/***/ }),

/***/ "f5df":
/***/ (function(module, exports, __webpack_require__) {

var TO_STRING_TAG_SUPPORT = __webpack_require__("00ee");
var classofRaw = __webpack_require__("c6b6");
var wellKnownSymbol = __webpack_require__("b622");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
};


/***/ }),

/***/ "f680":
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
    'Heap'                      : __webpack_require__("175a"),
    'Node'                      : __webpack_require__("28e0"),
    'Grid'                      : __webpack_require__("a8a6"),
    'Util'                      : __webpack_require__("22b1"),
    'DiagonalMovement'          : __webpack_require__("8b6a"),
    'Heuristic'                 : __webpack_require__("1196"),
    'AStarFinder'               : __webpack_require__("0c09"),
    'BestFirstFinder'           : __webpack_require__("deec"),
    'BreadthFirstFinder'        : __webpack_require__("719c"),
    'DijkstraFinder'            : __webpack_require__("015f"),
    'BiAStarFinder'             : __webpack_require__("3f6a"),
    'BiBestFirstFinder'         : __webpack_require__("25ee"),
    'BiBreadthFirstFinder'      : __webpack_require__("ae6c"),
    'BiDijkstraFinder'          : __webpack_require__("7a96"),
    'IDAStarFinder'             : __webpack_require__("2b2a"),
    'JumpPointFinder'           : __webpack_require__("cc7a"),
};


/***/ }),

/***/ "f772":
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__("5692");
var uid = __webpack_require__("90e3");

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};


/***/ }),

/***/ "fb15":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "Flowchart", function() { return /* reexport */ Flowchart; });

// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  var currentScript = window.document.currentScript
  if (true) {
    var getCurrentScript = __webpack_require__("8875")
    currentScript = getCurrentScript()

    // for backward compatibility, because previously we directly included the polyfill
    if (!('currentScript' in document)) {
      Object.defineProperty(document, 'currentScript', { get: getCurrentScript })
    }
  }

  var src = currentScript && currentScript.src.match(/(.+\/)[^/]+\.js(\?.*)?$/)
  if (src) {
    __webpack_require__.p = src[1] // eslint-disable-line
  }
}

// Indicate to webpack that this file can be concatenated
/* harmony default export */ var setPublicPath = (null);

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"73b8e84c-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Flowchart/Flowchart.vue?vue&type=template&id=80236986&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('CanvasComponent',[_vm._l((_vm.nodes),function(node){return _c('NodeWrapperComponent',{key:node.id,attrs:{"node":node,"is-selected":_vm.isNodeSelected(node.id),"node-component":_vm.nodeComponent,"port-component":_vm.portComponent}})}),_vm._l((_vm.links),function(link){return _c('LinkWrapperComponent',{key:link.id,attrs:{"link":link,"is-selected":_vm.isLinkSelected(link.id),"link-component":_vm.linkComponent}})})],2)}
var staticRenderFns = []


// CONCATENATED MODULE: ./src/components/Flowchart/Flowchart.vue?vue&type=template&id=80236986&

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.string.link.js
var es_string_link = __webpack_require__("9911");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.symbol.js
var es_symbol = __webpack_require__("a4d3");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.filter.js
var es_array_filter = __webpack_require__("4de4");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.for-each.js
var es_array_for_each = __webpack_require__("4160");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.object.get-own-property-descriptor.js
var es_object_get_own_property_descriptor = __webpack_require__("e439");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.object.get-own-property-descriptors.js
var es_object_get_own_property_descriptors = __webpack_require__("dbb4");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.object.keys.js
var es_object_keys = __webpack_require__("b64b");

// EXTERNAL MODULE: ./node_modules/core-js/modules/web.dom-collections.for-each.js
var web_dom_collections_for_each = __webpack_require__("159b");

// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/defineProperty.js
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/objectSpread2.js









function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}
// EXTERNAL MODULE: external {"commonjs":"vue","commonjs2":"vue","root":"Vue"}
var external_commonjs_vue_commonjs2_vue_root_Vue_ = __webpack_require__("8bbf");
var external_commonjs_vue_commonjs2_vue_root_Vue_default = /*#__PURE__*/__webpack_require__.n(external_commonjs_vue_commonjs2_vue_root_Vue_);

// CONCATENATED MODULE: ./node_modules/@vue/composition-api/dist/vue-composition-api.module.js


var vue_composition_api_module_toString = function (x) { return Object.prototype.toString.call(x); };
function isNative(Ctor) {
    return typeof Ctor === 'function' && /native code/.test(Ctor.toString());
}
var hasSymbol = typeof Symbol !== 'undefined' && isNative(Symbol) &&
    typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);
var noopFn = function (_) { return _; };
var sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: noopFn,
    set: noopFn,
};
function proxy(target, key, _a) {
    var get = _a.get, set = _a.set;
    sharedPropertyDefinition.get = get || noopFn;
    sharedPropertyDefinition.set = set || noopFn;
    Object.defineProperty(target, key, sharedPropertyDefinition);
}
function def(obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true,
    });
}
var vue_composition_api_module_hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn(obj, key) {
    return vue_composition_api_module_hasOwnProperty.call(obj, key);
}
function assert(condition, msg) {
    if (!condition)
        throw new Error("[vue-composition-api] " + msg);
}
function isArray(x) {
    return Array.isArray(x);
}
function isPlainObject(x) {
    return vue_composition_api_module_toString(x) === '[object Object]';
}
function isFunction(x) {
    return typeof x === 'function';
}
function warn(msg, vm) {
    external_commonjs_vue_commonjs2_vue_root_Vue_default.a.util.warn(msg, vm);
}
function logError(err, vm, info) {
    {
        warn("Error in " + info + ": \"" + err.toString() + "\"", vm);
    }
    if (typeof window !== 'undefined' && typeof console !== 'undefined') {
        console.error(err);
    }
    else {
        throw err;
    }
}

var currentVue = null;
var currentVM = null;
function getCurrentVue() {
    {
        assert(currentVue, "must call Vue.use(plugin) before using any function.");
    }
    return currentVue;
}
function setCurrentVue(vue) {
    currentVue = vue;
}
function getCurrentVM() {
    return currentVM;
}
function setCurrentVM(vm) {
    currentVM = vm;
}

function ensureCurrentVMInFn(hook) {
    var vm = getCurrentVM();
    {
        assert(vm, "\"" + hook + "\" get called outside of \"setup()\"");
    }
    return vm;
}
function defineComponentInstance(Ctor, options) {
    if (options === void 0) { options = {}; }
    var silent = Ctor.config.silent;
    Ctor.config.silent = true;
    var vm = new Ctor(options);
    Ctor.config.silent = silent;
    return vm;
}
function isComponentInstance(obj) {
    return currentVue && obj instanceof currentVue;
}
function createSlotProxy(vm, slotName) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!vm.$scopedSlots[slotName]) {
            return warn("slots." + slotName + "() got called outside of the \"render()\" scope", vm);
        }
        return vm.$scopedSlots[slotName].apply(vm, args);
    };
}
function resolveSlots(slots, normalSlots) {
    var res;
    if (!slots) {
        res = {};
    }
    else if (slots._normalized) {
        // fast path 1: child component re-render only, parent did not change
        return slots._normalized;
    }
    else {
        res = {};
        for (var key in slots) {
            if (slots[key] && key[0] !== '$') {
                res[key] = true;
            }
        }
    }
    // expose normal slots on scopedSlots
    for (var key in normalSlots) {
        if (!(key in res)) {
            res[key] = true;
        }
    }
    return res;
}

function createSymbol(name) {
    return hasSymbol ? Symbol.for(name) : name;
}
var WatcherPreFlushQueueKey = createSymbol('vfa.key.preFlushQueue');
var WatcherPostFlushQueueKey = createSymbol('vfa.key.postFlushQueue');
var AccessControlIdentifierKey = createSymbol('vfa.key.accessControlIdentifier');
var ReactiveIdentifierKey = createSymbol('vfa.key.reactiveIdentifier');
var NonReactiveIdentifierKey = createSymbol('vfa.key.nonReactiveIdentifier');
// must be a string, symbol key is ignored in reactive
var RefKey = 'vfa.key.refKey';

var RefImpl = /** @class */ (function () {
    function RefImpl(_a) {
        var get = _a.get, set = _a.set;
        proxy(this, 'value', {
            get: get,
            set: set,
        });
    }
    return RefImpl;
}());
function createRef(options) {
    // seal the ref, this could prevent ref from being observed
    // It's safe to seal the ref, since we really shoulnd't extend it.
    // related issues: #79
    return Object.seal(new RefImpl(options));
}
// implementation
function ref(raw) {
    // if (isRef(raw)) {
    //   return {} as any;
    // }
    var _a;
    var value = reactive((_a = {}, _a[RefKey] = raw, _a));
    return createRef({
        get: function () { return value[RefKey]; },
        set: function (v) { return (value[RefKey] = v); },
    });
}
function isRef(value) {
    return value instanceof RefImpl;
}
function toRefs(obj) {
    if (!isPlainObject(obj))
        return obj;
    var res = {};
    Object.keys(obj).forEach(function (key) {
        var val = obj[key];
        // use ref to proxy the property
        if (!isRef(val)) {
            val = createRef({
                get: function () { return obj[key]; },
                set: function (v) { return (obj[key] = v); },
            });
        }
        // todo
        res[key] = val;
    });
    return res;
}

var AccessControlIdentifier = {};
var ReactiveIdentifier = {};
var NonReactiveIdentifier = {};
function isNonReactive(obj) {
    return (hasOwn(obj, NonReactiveIdentifierKey) && obj[NonReactiveIdentifierKey] === NonReactiveIdentifier);
}
function isReactive(obj) {
    return hasOwn(obj, ReactiveIdentifierKey) && obj[ReactiveIdentifierKey] === ReactiveIdentifier;
}
/**
 * Proxing property access of target.
 * We can do unwrapping and other things here.
 */
function setupAccessControl(target) {
    if (!isPlainObject(target) ||
        isNonReactive(target) ||
        Array.isArray(target) ||
        isRef(target) ||
        isComponentInstance(target)) {
        return;
    }
    if (hasOwn(target, AccessControlIdentifierKey) &&
        target[AccessControlIdentifierKey] === AccessControlIdentifier) {
        return;
    }
    if (Object.isExtensible(target)) {
        def(target, AccessControlIdentifierKey, AccessControlIdentifier);
    }
    var keys = Object.keys(target);
    for (var i = 0; i < keys.length; i++) {
        defineAccessControl(target, keys[i]);
    }
}
/**
 * Auto unwrapping when access property
 */
function defineAccessControl(target, key, val) {
    if (key === '__ob__')
        return;
    var getter;
    var setter;
    var property = Object.getOwnPropertyDescriptor(target, key);
    if (property) {
        if (property.configurable === false) {
            return;
        }
        getter = property.get;
        setter = property.set;
        if ((!getter || setter) /* not only have getter */ && arguments.length === 2) {
            val = target[key];
        }
    }
    setupAccessControl(val);
    Object.defineProperty(target, key, {
        enumerable: true,
        configurable: true,
        get: function getterHandler() {
            var value = getter ? getter.call(target) : val;
            // if the key is equal to RefKey, skip the unwrap logic
            if (key !== RefKey && isRef(value)) {
                return value.value;
            }
            else {
                return value;
            }
        },
        set: function setterHandler(newVal) {
            if (getter && !setter)
                return;
            var value = getter ? getter.call(target) : val;
            // If the key is equal to RefKey, skip the unwrap logic
            // If and only if "value" is ref and "newVal" is not a ref,
            // the assignment should be proxied to "value" ref.
            if (key !== RefKey && isRef(value) && !isRef(newVal)) {
                value.value = newVal;
            }
            else if (setter) {
                setter.call(target, newVal);
            }
            else {
                val = newVal;
            }
            setupAccessControl(newVal);
        },
    });
}
function observe(obj) {
    var Vue = getCurrentVue();
    var observed;
    if (Vue.observable) {
        observed = Vue.observable(obj);
    }
    else {
        var vm = defineComponentInstance(Vue, {
            data: {
                $$state: obj,
            },
        });
        observed = vm._data.$$state;
    }
    return observed;
}
/**
 * Make obj reactivity
 */
function reactive(obj) {
    if (!obj) {
        warn('"reactive()" is called without provide an "object".');
        // @ts-ignore
        return;
    }
    if (!isPlainObject(obj) || isReactive(obj) || isNonReactive(obj) || !Object.isExtensible(obj)) {
        return obj;
    }
    var observed = observe(obj);
    def(observed, ReactiveIdentifierKey, ReactiveIdentifier);
    setupAccessControl(observed);
    return observed;
}
/**
 * Make sure obj can't be a reactive
 */
function nonReactive(obj) {
    if (!isPlainObject(obj)) {
        return obj;
    }
    // set the vue observable flag at obj
    def(obj, '__ob__', observe({}).__ob__);
    // mark as nonReactive
    def(obj, NonReactiveIdentifierKey, NonReactiveIdentifier);
    return obj;
}

function isUndef(v) {
    return v === undefined || v === null;
}
function isPrimitive(value) {
    return (typeof value === 'string' ||
        typeof value === 'number' ||
        // $flow-disable-line
        typeof value === 'symbol' ||
        typeof value === 'boolean');
}
function isValidArrayIndex(val) {
    var n = parseFloat(String(val));
    return n >= 0 && Math.floor(n) === n && isFinite(val);
}
/**
 * Set a property on an object. Adds the new property, triggers change
 * notification and intercept it's subsequent access if the property doesn't
 * already exist.
 */
function set(target, key, val) {
    var Vue = getCurrentVue();
    var _a = Vue.util, warn = _a.warn, defineReactive = _a.defineReactive;
    if (isUndef(target) || isPrimitive(target)) {
        warn("Cannot set reactive property on undefined, null, or primitive value: " + target);
    }
    if (isArray(target) && isValidArrayIndex(key)) {
        target.length = Math.max(target.length, key);
        target.splice(key, 1, val);
        return val;
    }
    if (key in target && !(key in Object.prototype)) {
        target[key] = val;
        return val;
    }
    var ob = target.__ob__;
    if (target._isVue || (ob && ob.vmCount)) {
        warn('Avoid adding reactive properties to a Vue instance or its root $data ' +
                'at runtime - declare it upfront in the data option.');
        return val;
    }
    if (!ob) {
        target[key] = val;
        return val;
    }
    defineReactive(ob.value, key, val);
    // IMPORTANT: define access control before trigger watcher
    defineAccessControl(target, key, val);
    ob.dep.notify();
    return val;
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData(from, to) {
    if (!from)
        return to;
    var key;
    var toVal;
    var fromVal;
    var keys = hasSymbol ? Reflect.ownKeys(from) : Object.keys(from);
    for (var i = 0; i < keys.length; i++) {
        key = keys[i];
        // in case the object is already observed...
        if (key === '__ob__')
            continue;
        toVal = to[key];
        fromVal = from[key];
        if (!hasOwn(to, key)) {
            to[key] = fromVal;
        }
        else if (toVal !== fromVal &&
            (isPlainObject(toVal) && !isRef(toVal)) &&
            (isPlainObject(fromVal) && !isRef(fromVal))) {
            mergeData(fromVal, toVal);
        }
    }
    return to;
}
function install(Vue, _install) {
    if (currentVue && currentVue === Vue) {
        {
            assert(false, 'already installed. Vue.use(plugin) should be called only once');
        }
        return;
    }
    Vue.config.optionMergeStrategies.setup = function (parent, child) {
        return function mergedSetupFn(props, context) {
            return mergeData(typeof parent === 'function' ? parent(props, context) || {} : {}, typeof child === 'function' ? child(props, context) || {} : {});
        };
    };
    setCurrentVue(Vue);
    _install(Vue);
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function set$1(vm, key, value) {
    var state = (vm.__secret_vfa_state__ = vm.__secret_vfa_state__ || {});
    state[key] = value;
}
function get(vm, key) {
    return (vm.__secret_vfa_state__ || {})[key];
}
var vmStateManager = {
    set: set$1,
    get: get,
};

function asVmProperty(vm, propName, propValue) {
    var props = vm.$options.props;
    if (!(propName in vm) && !(props && hasOwn(props, propName))) {
        proxy(vm, propName, {
            get: function () { return propValue.value; },
            set: function (val) {
                propValue.value = val;
            },
        });
        {
            // expose binding to Vue Devtool as a data property
            // delay this until state has been resolved to prevent repeated works
            vm.$nextTick(function () {
                proxy(vm._data, propName, {
                    get: function () { return propValue.value; },
                    set: function (val) {
                        propValue.value = val;
                    },
                });
            });
        }
    }
    else {
        if (props && hasOwn(props, propName)) {
            warn("The setup binding property \"" + propName + "\" is already declared as a prop.", vm);
        }
        else {
            warn("The setup binding property \"" + propName + "\" is already declared.", vm);
        }
    }
}
function updateTemplateRef(vm) {
    var rawBindings = vmStateManager.get(vm, 'rawBindings') || {};
    if (!rawBindings || !Object.keys(rawBindings).length)
        return;
    var refs = vm.$refs;
    var oldRefKeys = vmStateManager.get(vm, 'refs') || [];
    for (var index = 0; index < oldRefKeys.length; index++) {
        var key = oldRefKeys[index];
        var setupValue = rawBindings[key];
        if (!refs[key] && setupValue && isRef(setupValue)) {
            setupValue.value = null;
        }
    }
    var newKeys = Object.keys(refs);
    var validNewKeys = [];
    for (var index = 0; index < newKeys.length; index++) {
        var key = newKeys[index];
        var setupValue = rawBindings[key];
        if (refs[key] && setupValue && isRef(setupValue)) {
            setupValue.value = refs[key];
            validNewKeys.push(key);
        }
    }
    vmStateManager.set(vm, 'refs', validNewKeys);
}
function resolveScopedSlots(vm, slotsProxy) {
    var parentVode = vm.$options._parentVnode;
    if (!parentVode)
        return;
    var prevSlots = vmStateManager.get(vm, 'slots') || [];
    var curSlots = resolveSlots(parentVode.data.scopedSlots, vm.$slots);
    // remove staled slots
    for (var index = 0; index < prevSlots.length; index++) {
        var key = prevSlots[index];
        if (!curSlots[key]) {
            delete slotsProxy[key];
        }
    }
    // proxy fresh slots
    var slotNames = Object.keys(curSlots);
    for (var index = 0; index < slotNames.length; index++) {
        var key = slotNames[index];
        if (!slotsProxy[key]) {
            slotsProxy[key] = createSlotProxy(vm, key);
        }
    }
    vmStateManager.set(vm, 'slots', slotNames);
}
function activateCurrentInstance(vm, fn, onError) {
    var preVm = getCurrentVM();
    setCurrentVM(vm);
    try {
        return fn(vm);
    }
    catch (err) {
        if (onError) {
            onError(err);
        }
        else {
            throw err;
        }
    }
    finally {
        setCurrentVM(preVm);
    }
}
function mixin(Vue) {
    Vue.mixin({
        beforeCreate: functionApiInit,
        mounted: function () {
            updateTemplateRef(this);
        },
        updated: function () {
            updateTemplateRef(this);
        },
    });
    /**
     * Vuex init hook, injected into each instances init hooks list.
     */
    function functionApiInit() {
        var vm = this;
        var $options = vm.$options;
        var setup = $options.setup, render = $options.render;
        if (render) {
            // keep currentInstance accessible for createElement
            $options.render = function () {
                var _this = this;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return activateCurrentInstance(vm, function () { return render.apply(_this, args); });
            };
        }
        if (!setup) {
            return;
        }
        if (typeof setup !== 'function') {
            {
                warn('The "setup" option should be a function that returns a object in component definitions.', vm);
            }
            return;
        }
        var data = $options.data;
        // wrapper the data option, so we can invoke setup before data get resolved
        $options.data = function wrappedData() {
            initSetup(vm, vm.$props);
            return typeof data === 'function'
                ? data.call(vm, vm)
                : data || {};
        };
    }
    function initSetup(vm, props) {
        if (props === void 0) { props = {}; }
        var setup = vm.$options.setup;
        var ctx = createSetupContext(vm);
        // resolve scopedSlots and slots to functions
        resolveScopedSlots(vm, ctx.slots);
        var binding;
        activateCurrentInstance(vm, function () {
            binding = setup(props, ctx);
        });
        if (!binding)
            return;
        if (isFunction(binding)) {
            // keep typescript happy with the binding type.
            var bindingFunc_1 = binding;
            // keep currentInstance accessible for createElement
            vm.$options.render = function () {
                resolveScopedSlots(vm, ctx.slots);
                return activateCurrentInstance(vm, function () { return bindingFunc_1(); });
            };
            return;
        }
        if (isPlainObject(binding)) {
            var bindingObj_1 = binding;
            vmStateManager.set(vm, 'rawBindings', binding);
            Object.keys(binding).forEach(function (name) {
                var bindingValue = bindingObj_1[name];
                // only make primitive value reactive
                if (!isRef(bindingValue)) {
                    if (isReactive(bindingValue)) {
                        bindingValue = ref(bindingValue);
                    }
                    else {
                        // a non-reactive should not don't get reactivity
                        bindingValue = ref(nonReactive(bindingValue));
                    }
                }
                asVmProperty(vm, name, bindingValue);
            });
            return;
        }
        {
            assert(false, "\"setup\" must return a \"Object\" or a \"Function\", got \"" + Object.prototype.toString
                .call(binding)
                .slice(8, -1) + "\"");
        }
    }
    function createSetupContext(vm) {
        var ctx = {
            slots: {},
        };
        var props = [
            'root',
            'parent',
            'refs',
            'attrs',
            'listeners',
            'isServer',
            'ssrContext',
        ];
        var methodReturnVoid = ['emit'];
        props.forEach(function (key) {
            var _a;
            var targetKey;
            var srcKey;
            if (Array.isArray(key)) {
                _a = __read(key, 2), targetKey = _a[0], srcKey = _a[1];
            }
            else {
                targetKey = srcKey = key;
            }
            srcKey = "$" + srcKey;
            proxy(ctx, targetKey, {
                get: function () { return vm[srcKey]; },
                set: function () {
                    warn("Cannot assign to '" + targetKey + "' because it is a read-only property", vm);
                },
            });
        });
        methodReturnVoid.forEach(function (key) {
            var srcKey = "$" + key;
            proxy(ctx, key, {
                get: function () {
                    return function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        var fn = vm[srcKey];
                        fn.apply(vm, args);
                    };
                },
            });
        });
        return ctx;
    }
}

var fallbackCreateElement;
var createElement = function createElement() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (!currentVM) {
        warn('`createElement()` has been called outside of render function.');
        if (!fallbackCreateElement) {
            fallbackCreateElement = defineComponentInstance(getCurrentVue()).$createElement;
        }
        return fallbackCreateElement.apply(fallbackCreateElement, args);
    }
    return currentVM.$createElement.apply(currentVM, args);
};

// implementation, close to no-op
function defineComponent(options) {
    return options;
}
// implementation, deferring to defineComponent, but logging a warning in dev mode
function createComponent(options) {
    {
        external_commonjs_vue_commonjs2_vue_root_Vue_default.a.util.warn('`createComponent` has been renamed to `defineComponent`.');
    }
    return defineComponent(options);
}

var genName = function (name) { return "on" + (name[0].toUpperCase() + name.slice(1)); };
function createLifeCycle(lifeCyclehook) {
    return function (callback) {
        var vm = ensureCurrentVMInFn(genName(lifeCyclehook));
        injectHookOption(getCurrentVue(), vm, lifeCyclehook, callback);
    };
}
function injectHookOption(Vue, vm, hook, val) {
    var options = vm.$options;
    var mergeFn = Vue.config.optionMergeStrategies[hook];
    options[hook] = mergeFn(options[hook], val);
}
// export const onCreated = createLifeCycle('created');
var onBeforeMount = createLifeCycle('beforeMount');
var onMounted = createLifeCycle('mounted');
var onBeforeUpdate = createLifeCycle('beforeUpdate');
var onUpdated = createLifeCycle('updated');
var onBeforeUnmount = createLifeCycle('beforeDestroy');
var onUnmounted = createLifeCycle('destroyed');
var onErrorCaptured = createLifeCycle('errorCaptured');
var onActivated = createLifeCycle('activated');
var onDeactivated = createLifeCycle('deactivated');
var onServerPrefetch = createLifeCycle('serverPrefetch');

var fallbackVM;
function flushPreQueue() {
    flushQueue(this, WatcherPreFlushQueueKey);
}
function flushPostQueue() {
    flushQueue(this, WatcherPostFlushQueueKey);
}
function hasWatchEnv(vm) {
    return vm[WatcherPreFlushQueueKey] !== undefined;
}
function installWatchEnv(vm) {
    vm[WatcherPreFlushQueueKey] = [];
    vm[WatcherPostFlushQueueKey] = [];
    vm.$on('hook:beforeUpdate', flushPreQueue);
    vm.$on('hook:updated', flushPostQueue);
}
function getWatcherOption(options) {
    return __assign({
        lazy: false,
        deep: false,
        flush: 'post',
    }, options);
}
function getWatcherVM() {
    var vm = getCurrentVM();
    if (!vm) {
        if (!fallbackVM) {
            fallbackVM = defineComponentInstance(getCurrentVue());
        }
        vm = fallbackVM;
    }
    else if (!hasWatchEnv(vm)) {
        installWatchEnv(vm);
    }
    return vm;
}
function flushQueue(vm, key) {
    var queue = vm[key];
    for (var index = 0; index < queue.length; index++) {
        queue[index]();
    }
    queue.length = 0;
}
function queueFlushJob(vm, fn, mode) {
    // flush all when beforeUpdate and updated are not fired
    var fallbackFlush = function () {
        vm.$nextTick(function () {
            if (vm[WatcherPreFlushQueueKey].length) {
                flushQueue(vm, WatcherPreFlushQueueKey);
            }
            if (vm[WatcherPostFlushQueueKey].length) {
                flushQueue(vm, WatcherPostFlushQueueKey);
            }
        });
    };
    switch (mode) {
        case 'pre':
            fallbackFlush();
            vm[WatcherPreFlushQueueKey].push(fn);
            break;
        case 'post':
            fallbackFlush();
            vm[WatcherPostFlushQueueKey].push(fn);
            break;
        default:
            assert(false, "flush must be one of [\"post\", \"pre\", \"sync\"], but got " + mode);
            break;
    }
}
function createVueWatcher(vm, getter, callback, options) {
    var index = vm._watchers.length;
    // @ts-ignore: use undocumented options
    vm.$watch(getter, callback, {
        immediate: options.immediateInvokeCallback,
        deep: options.deep,
        lazy: options.noRun,
        sync: options.sync,
        before: options.before,
    });
    return vm._watchers[index];
}
function createWatcher(vm, source, cb, options) {
    var flushMode = options.flush;
    var isSync = flushMode === 'sync';
    var cleanup;
    var registerCleanup = function (fn) {
        cleanup = function () {
            try {
                fn();
            }
            catch (error) {
                logError(error, vm, 'onCleanup()');
            }
        };
    };
    // cleanup before running getter again
    var runCleanup = function () {
        if (cleanup) {
            cleanup();
            cleanup = null;
        }
    };
    var createScheduler = function (fn) {
        if (isSync || /* without a current active instance, ignore pre|post mode */ vm === fallbackVM) {
            return fn;
        }
        return (function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return queueFlushJob(vm, function () {
                fn.apply(void 0, __spread(args));
            }, flushMode);
        });
    };
    // effect watch
    if (cb === null) {
        var getter_1 = function () { return source(registerCleanup); };
        var watcher_1 = createVueWatcher(vm, getter_1, noopFn, {
            noRun: true,
            deep: options.deep,
            sync: isSync,
            before: runCleanup,
        });
        // enable the watcher update
        watcher_1.lazy = false;
        var originGet = watcher_1.get.bind(watcher_1);
        if (isSync) {
            watcher_1.get();
        }
        else {
            vm.$nextTick(originGet);
        }
        watcher_1.get = createScheduler(originGet);
        return function () {
            watcher_1.teardown();
            runCleanup();
        };
    }
    var getter;
    if (Array.isArray(source)) {
        getter = function () { return source.map(function (s) { return (isRef(s) ? s.value : s()); }); };
    }
    else if (isRef(source)) {
        getter = function () { return source.value; };
    }
    else {
        getter = source;
    }
    var applyCb = function (n, o) {
        // cleanup before running cb again
        runCleanup();
        cb(n, o, registerCleanup);
    };
    var callback = createScheduler(applyCb);
    if (!options.lazy) {
        var originalCallbck_1 = callback;
        // `shiftCallback` is used to handle the first sync effect run.
        // The subsequent callbacks will redirect to `callback`.
        var shiftCallback_1 = function (n, o) {
            shiftCallback_1 = originalCallbck_1;
            applyCb(n, o);
        };
        callback = function (n, o) {
            shiftCallback_1(n, o);
        };
    }
    // @ts-ignore: use undocumented option "sync"
    var stop = vm.$watch(getter, callback, {
        immediate: !options.lazy,
        deep: options.deep,
        sync: isSync,
    });
    return function () {
        stop();
        runCleanup();
    };
}
function watchEffect(effect, options) {
    var opts = getWatcherOption(options);
    var vm = getWatcherVM();
    return createWatcher(vm, effect, null, opts);
}
function watch(source, cb, options) {
    var callback = null;
    if (typeof cb === 'function') {
        // source watch
        callback = cb;
    }
    else {
        // effect watch
        {
            warn("`watch(fn, options?)` signature has been moved to a separate API. " +
                "Use `watchEffect(fn, options?)` instead. `watch` now only " +
                "supports `watch(source, cb, options?) signature.");
        }
        options = cb;
        callback = null;
    }
    var opts = getWatcherOption(options);
    var vm = getWatcherVM();
    return createWatcher(vm, source, callback, opts);
}

// implement
function computed(options) {
    var vm = getCurrentVM();
    var get, set;
    if (typeof options === 'function') {
        get = options;
    }
    else {
        get = options.get;
        set = options.set;
    }
    var computedHost = defineComponentInstance(getCurrentVue(), {
        computed: {
            $$state: {
                get: get,
                set: set,
            },
        },
    });
    return createRef({
        get: function () { return computedHost.$$state; },
        set: function (v) {
            if (!set) {
                warn('Computed property was assigned to but it has no setter.', vm);
                return;
            }
            computedHost.$$state = v;
        },
    });
}

var NOT_FOUND = {};
function resolveInject(provideKey, vm) {
    var source = vm;
    while (source) {
        // @ts-ignore
        if (source._provided && hasOwn(source._provided, provideKey)) {
            //@ts-ignore
            return source._provided[provideKey];
        }
        source = source.$parent;
    }
    return NOT_FOUND;
}
function provide(key, value) {
    var vm = ensureCurrentVMInFn('provide');
    if (!vm._provided) {
        var provideCache_1 = {};
        Object.defineProperty(vm, '_provided', {
            get: function () { return provideCache_1; },
            set: function (v) { return Object.assign(provideCache_1, v); },
        });
    }
    vm._provided[key] = value;
}
function inject(key, defaultValue) {
    if (!key) {
        return defaultValue;
    }
    var vm = ensureCurrentVMInFn('inject');
    var val = resolveInject(key, vm);
    if (val !== NOT_FOUND) {
        return val;
    }
    else if (defaultValue !== undefined) {
        return defaultValue;
    }
    else {
        warn("Injection \"" + String(key) + "\" not found", vm);
    }
}

var _install = function (Vue) { return install(Vue, mixin); };
var vue_composition_api_module_plugin = {
    install: _install,
};
// Auto install if it is not done yet and `window` has `Vue`.
// To allow users to avoid auto-installation in some cases,
if (currentVue && typeof window !== 'undefined' && window.Vue) {
    _install(window.Vue);
}

/* harmony default export */ var vue_composition_api_module = (vue_composition_api_module_plugin);


// EXTERNAL MODULE: ./node_modules/vuex/dist/vuex.esm.js
var vuex_esm = __webpack_require__("2f62");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.reduce.js
var es_array_reduce = __webpack_require__("13d5");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.object.entries.js
var es_object_entries = __webpack_require__("4fad");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.object.freeze.js
var es_object_freeze = __webpack_require__("dca8");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.object.values.js
var es_object_values = __webpack_require__("07ac");

// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.symbol.description.js
var es_symbol_description = __webpack_require__("e01a");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.symbol.iterator.js
var es_symbol_iterator = __webpack_require__("d28b");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.iterator.js
var es_array_iterator = __webpack_require__("e260");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.object.to-string.js
var es_object_to_string = __webpack_require__("d3b7");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.string.iterator.js
var es_string_iterator = __webpack_require__("3ca3");

// EXTERNAL MODULE: ./node_modules/core-js/modules/web.dom-collections.iterator.js
var web_dom_collections_iterator = __webpack_require__("ddb0");

// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js







function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.from.js
var es_array_from = __webpack_require__("a630");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.slice.js
var es_array_slice = __webpack_require__("fb6a");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.function.name.js
var es_function_name = __webpack_require__("b0c0");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.regexp.to-string.js
var es_regexp_to_string = __webpack_require__("25f0");

// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js







function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/slicedToArray.js




function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
// EXTERNAL MODULE: ./node_modules/pathfinding/index.js
var pathfinding = __webpack_require__("bd5f");
var pathfinding_default = /*#__PURE__*/__webpack_require__.n(pathfinding);

// EXTERNAL MODULE: ./src/types/index.ts
var types = __webpack_require__("ebe2");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.number.constructor.js
var es_number_constructor = __webpack_require__("a9e3");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.number.is-integer.js
var es_number_is_integer = __webpack_require__("8ba4");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.number.is-nan.js
var es_number_is_nan = __webpack_require__("9129");

// CONCATENATED MODULE: ./src/pipelines/generateLinkId.ts



// https://gist.github.com/6174/6062387
function generateUuid() {
  return Math.random().toString(36).substring(2, 15);
}

function generateLinkId(link) {
  var id = link.id;
  if (!id) link.id = generateUuid();
  return link;
}
// CONCATENATED MODULE: ./src/pipelines/distinctFromNodeAndToNode.ts
function distinctFromNodeAndToNode(link) {
  var from = link.from,
      to = link.to;
  if (from.nodeId === to.nodeId) return null;
  return link;
}
// CONCATENATED MODULE: ./src/utils/config.ts





var SCALE_FACTOR = 5;
var DEFAULT_NODE_PADDING = SCALE_FACTOR * 2;
var DEFAULT_PORT_GAP = SCALE_FACTOR * 2;
var DEFAULT_MIN_ZOOM = 0.5;
var DEFAULT_MAX_ZOOM = 1.5;

function isNonNegativeInteger(input) {
  return Number.isInteger(input) && input > 0;
}

function validateNodePadding(nodePadding) {
  if (!isNonNegativeInteger(nodePadding)) {
    throw new Error("nodePadding must be a positive integer, but got ".concat(JSON.stringify(nodePadding), "."));
  }
}

function validatePortGap(portGap) {
  if (!isNonNegativeInteger(portGap)) {
    throw new Error("portGap must be a positive integer, but got ".concat(JSON.stringify(portGap), "."));
  }
}

function validateZoom(zoom) {
  if (typeof zoom !== 'number' || Number.isNaN(zoom) || zoom < 0) {
    throw new Error("zoom must be a positive number, but got ".concat(JSON.stringify(zoom), "."));
  }
}

function validateLinkPipeline(linkPipeline) {
  if (!Array.isArray(linkPipeline)) throw new Error('');
}

function buildConfig(_ref) {
  var _ref$nodePadding = _ref.nodePadding,
      nodePadding = _ref$nodePadding === void 0 ? DEFAULT_NODE_PADDING : _ref$nodePadding,
      _ref$portGap = _ref.portGap,
      portGap = _ref$portGap === void 0 ? DEFAULT_PORT_GAP : _ref$portGap,
      _ref$minZoom = _ref.minZoom,
      minZoom = _ref$minZoom === void 0 ? DEFAULT_MIN_ZOOM : _ref$minZoom,
      _ref$maxZoom = _ref.maxZoom,
      maxZoom = _ref$maxZoom === void 0 ? DEFAULT_MAX_ZOOM : _ref$maxZoom,
      _ref$linkPipeline = _ref.linkPipeline,
      linkPipeline = _ref$linkPipeline === void 0 ? [generateLinkId, distinctFromNodeAndToNode] : _ref$linkPipeline;
  // OPTIMIZE: skip validate default value
  validateNodePadding(nodePadding);
  validatePortGap(portGap);
  validateZoom(minZoom);
  validateZoom(maxZoom);
  validateLinkPipeline(linkPipeline);
  return {
    nodePadding: nodePadding,
    portGap: portGap,
    minZoom: minZoom,
    maxZoom: maxZoom,
    linkPipeline: linkPipeline
  };
}
// CONCATENATED MODULE: ./src/utils/grid.ts












function buildEmptyGrid(width, height) {
  // prevent vuex to observing pfGrid
  var pfGrid = Object.freeze(new pathfinding["Grid"](width / SCALE_FACTOR, height / SCALE_FACTOR));
  return {
    width: width,
    height: height,
    offset: {
      x: 0,
      y: 0
    },
    pfGrid: pfGrid
  };
}

function markLine(grid, _ref, walkable) {
  var _ref2 = _slicedToArray(_ref, 2),
      _ref2$ = _slicedToArray(_ref2[0], 2),
      startX = _ref2$[0],
      startY = _ref2$[1],
      _ref2$2 = _slicedToArray(_ref2[1], 2),
      endX = _ref2$2[0],
      endY = _ref2$2[1];

  // @ts-ignore
  var points = pathfinding["Util"].interpolate(startX, startY, endX, endY);
  points.forEach(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        x = _ref4[0],
        y = _ref4[1];

    grid.setWalkableAt(x, y, walkable);
  });
}

function markPort(grid, port, walkable, _ref5) {
  var nodePadding = _ref5.nodePadding;
  var direction = port.direction,
      position = port.position; // eslint-disable-next-line @typescript-eslint/no-non-null-assertion

  var x = position.x,
      y = position.y;
  x = Math.ceil(x / SCALE_FACTOR);
  y = Math.ceil(y / SCALE_FACTOR);
  var scaledNodePadding = nodePadding / SCALE_FACTOR; // eslint-disable-next-line default-case

  switch (direction) {
    case types["PortDirection"].TOP:
      grid.setWalkableAt(x, y + 1, walkable);
      grid.setWalkableAt(x, y - scaledNodePadding, !walkable);
      markLine(grid, [[x - 1, y], [x - 1, y - scaledNodePadding + 1]], walkable);
      markLine(grid, [[x + 1, y], [x + 1, y - scaledNodePadding + 1]], walkable);
      break;

    case types["PortDirection"].RIGHT:
      grid.setWalkableAt(x - 1, y, walkable);
      grid.setWalkableAt(x + scaledNodePadding, y, !walkable);
      markLine(grid, [[x, y - 1], [x + scaledNodePadding - 1, y - 1]], walkable);
      markLine(grid, [[x, y + 1], [x + scaledNodePadding - 1, y + 1]], walkable);
      break;

    case types["PortDirection"].BOTTOM:
      grid.setWalkableAt(x, y - 1, walkable);
      grid.setWalkableAt(x, y + scaledNodePadding, !walkable);
      markLine(grid, [[x + 1, y], [x + 1, y + scaledNodePadding - 1]], walkable);
      markLine(grid, [[x - 1, y], [x - 1, y + scaledNodePadding - 1]], walkable);
      break;

    case types["PortDirection"].LEFT:
      grid.setWalkableAt(x + 1, y, walkable);
      grid.setWalkableAt(x - scaledNodePadding, y, !walkable);
      markLine(grid, [[x, y + 1], [x - scaledNodePadding + 1, y + 1]], walkable);
      markLine(grid, [[x, y - 1], [x - scaledNodePadding + 1, y - 1]], walkable);
      break;
  }
}

function groupBy(collection, criteria) {
  return collection.reduce(function (obj, item) {
    var key = criteria(item);

    if (!Object.prototype.hasOwnProperty.call(obj, key)) {
      obj[key] = [item];
    } else {
      obj[key].push(item);
    }

    return obj;
  }, {});
}

function nextDots(start, length, portGap) {
  var current = Math.ceil(start);
  var dots = [];

  for (var i = 0; i < length; i += 1) {
    dots.push(current + 1);
    current += 2 + portGap;
  }

  return dots;
}

function updatePorts(node, gridOffset, _ref6) {
  var portGap = _ref6.portGap;
  var offsetX = gridOffset.x,
      offsetY = gridOffset.y;
  var x = node.x,
      y = node.y;
  x += offsetX;
  y += offsetY;
  var width = node.width,
      height = node.height;
  var groupedPorts = groupBy(Object.values(node.ports), function (port) {
    return port.direction;
  });
  var updatedPorts = Object.entries(groupedPorts).reduce(function (acc, _ref7) {
    var _ref8 = _slicedToArray(_ref7, 2),
        direction = _ref8[0],
        ports = _ref8[1];

    var length = ports.length;
    var portsLength = 3 * length + portGap * (length - 1);
    var dots; // eslint-disable-next-line default-case

    switch (direction) {
      case types["PortDirection"].TOP:
        dots = nextDots(x + (width - portsLength) / 2, length, portGap);
        ports.forEach(function (port, index) {
          acc[port.id] = _objectSpread2({}, port, {
            position: {
              x: dots[index],
              y: y
            }
          });
        });
        break;

      case types["PortDirection"].RIGHT:
        dots = nextDots(y + (height - portsLength) / 2, length, portGap);
        ports.forEach(function (port, index) {
          acc[port.id] = _objectSpread2({}, port, {
            position: {
              x: x + width,
              y: dots[index]
            }
          });
        });
        break;

      case types["PortDirection"].BOTTOM:
        dots = nextDots(x + (width - portsLength) / 2, length, portGap);
        ports.forEach(function (port, index) {
          acc[port.id] = _objectSpread2({}, port, {
            position: {
              x: dots[index],
              y: y + height
            }
          });
        });
        break;

      case types["PortDirection"].LEFT:
        dots = nextDots(y + (height - portsLength) / 2, length, portGap);
        ports.forEach(function (port, index) {
          acc[port.id] = _objectSpread2({}, port, {
            position: {
              x: x,
              y: dots[index]
            }
          });
        });
        break;
    }

    return acc;
  }, {});
  return _objectSpread2({}, node, {
    ports: updatedPorts
  });
} //
// +-------------------------------+ +---+ +-------------------------------+
// |                               ^ ^   ^ ^                               |
// |                               | |   | |                               |
// |         (x, y)                | |   | |                               |
// |         ·                     | |   | |                     ·         |
// |                                +     +                                |
// |                                                                       |
// |                                                                       |
// |                                                                       |
// |                                                                       |
// |                                                                       |
// |<---------                                                   --------->+
//            +                                                 +
// |<---------                                                   --------->+
// |                                                                       |
// |                                                                       |
// |                                                                       |
// |                                                                       |
// |                                                                       |
// |                                                                       |
// |                                   +                                   |
// |         ·                        | |                        ·         |
// |                                  | |                                  |
// |                                  | |                                  |
// |                                  v v                                  |
// +----------------------------------+ +----------------------------------+
//


function markNodeWalkable(grid, gridOffset, node, walkable, _ref9) {
  var _lines;

  var nodePadding = _ref9.nodePadding,
      portGap = _ref9.portGap;
  var updatedNode = updatePorts(node, gridOffset, {
    portGap: portGap
  });
  var offsetX = gridOffset.x,
      offsetY = gridOffset.y;
  var x = node.x,
      y = node.y,
      width = node.width,
      height = node.height;
  x = Math.ceil((x + offsetX - nodePadding) / SCALE_FACTOR);
  y = Math.ceil((y + offsetY - nodePadding) / SCALE_FACTOR);
  width = Math.ceil((width + nodePadding * 2) / SCALE_FACTOR);
  height = Math.ceil((height + nodePadding * 2) / SCALE_FACTOR);
  var topLeft = [x, y];
  var topRight = [x + width, y];
  var bottomRight = [x + width, y + height];
  var bottomLeft = [x, y + height];
  var lines = (_lines = {}, _defineProperty(_lines, types["PortDirection"].TOP, [topLeft, topRight]), _defineProperty(_lines, types["PortDirection"].RIGHT, [topRight, bottomRight]), _defineProperty(_lines, types["PortDirection"].BOTTOM, [bottomRight, bottomLeft]), _defineProperty(_lines, types["PortDirection"].LEFT, [bottomLeft, topLeft]), _lines);
  var steps = [function () {
    // mark rectangle
    Object.values(lines).forEach(function (line) {
      return markLine(grid, line, walkable);
    });
  }, function () {
    // mark ports
    Object.values(updatedNode.ports).forEach(function (port) {
      return markPort(grid, port, walkable, {
        nodePadding: nodePadding
      });
    });
  }];
  if (walkable) steps.reverse();
  steps.forEach(function (step) {
    return step();
  });
  return updatedNode;
}
var pathFinder = pathfinding["JumpPointFinder"]({
  heuristic: pathfinding["Heuristic"].manhattan,
  diagonalMovement: pathfinding["DiagonalMovement"].Never
});
var GRID_PADDING = 100;
function autoGridExpansions(grid, node) {
  var gridOffset = grid.offset,
      width = grid.width,
      height = grid.height;
  var negativeX = node.x < gridOffset.x + GRID_PADDING;
  var negativeY = node.y < gridOffset.y + GRID_PADDING;
  var positiveX = width + gridOffset.x - GRID_PADDING < node.x;
  var positiveY = height + gridOffset.y - GRID_PADDING < node.y;
  return [{
    x: negativeX ? -500 : 0,
    y: negativeY ? -500 : 0
  }, {
    x: positiveX ? 500 : 0,
    y: positiveY ? 500 : 0
  }];
}
// CONCATENATED MODULE: ./src/utils/history.ts


var reverses = {};
function registerRevertFunc(type, revertFunc) {
  reverses[type] = revertFunc;
}

function revert(mutation) {
  var revertFunc = reverses[mutation.type];
  if (!revertFunc) throw new Error("".concat(mutation.type, " is an irreversible mutation"));
  return revertFunc(mutation);
}

function revertMutation(mutation) {
  return revert(mutation);
}
function getEntry(_ref, delta) {
  var history = _ref.history;
  var nextVersion = history.currentVersion + delta; // the state is newest

  if (nextVersion > history.entries.length) return null; // the state is oldest

  if (nextVersion < 0) return null;
  return history.entries[nextVersion];
}
// CONCATENATED MODULE: ./src/store/mutations/addNode.ts




function addNode(state, _ref) {
  var node = _ref.node;
  var pfGrid = state.graph.grid.pfGrid;
  var updatedNode = markNodeWalkable(pfGrid, state.graph.grid.offset, node, false, state.config);
  external_commonjs_vue_commonjs2_vue_root_Vue_default.a.set(state.graph.nodes, node.id, updatedNode);
}
registerRevertFunc('addNode', function (mutation) {
  return _objectSpread2({}, mutation, {
    type: 'removeNode'
  });
});
// CONCATENATED MODULE: ./src/store/mutations/removeNode.ts




function removeNode(state, _ref) {
  var node = _ref.node;
  var _state$graph$grid = state.graph.grid,
      pfGrid = _state$graph$grid.pfGrid,
      offset = _state$graph$grid.offset;
  markNodeWalkable(pfGrid, offset, node, true, state.config);
  external_commonjs_vue_commonjs2_vue_root_Vue_default.a.delete(state.graph.nodes, node.id);
}
registerRevertFunc('removeNode', function (mutation) {
  return _objectSpread2({}, mutation, {
    type: 'addNode'
  });
});
// CONCATENATED MODULE: ./src/store/mutations/updateNodePosition.ts




function updateNodePosition(state, _ref) {
  var node = _ref.node,
      position = _ref.position,
      prevPosition = _ref.prevPosition;
  var _state$graph = state.graph,
      nodes = _state$graph.nodes,
      pfGrid = _state$graph.grid.pfGrid; // skip when dragNodeStop

  if (position.x === node.x && position.y === node.y) {
    external_commonjs_vue_commonjs2_vue_root_Vue_default.a.set(nodes, node.id, node);
  } else {
    var updatedNode = markNodeWalkable(state.graph.grid.pfGrid, state.graph.grid.offset, _objectSpread2({}, node, {}, prevPosition), true, state.config);
    updatedNode = markNodeWalkable(pfGrid, state.graph.grid.offset, _objectSpread2({}, updatedNode, {}, position), false, state.config);
    external_commonjs_vue_commonjs2_vue_root_Vue_default.a.set(nodes, updatedNode.id, updatedNode);
  }
}
registerRevertFunc('updateNodePosition', function (mutation) {
  var prevPosition = mutation.prevPosition,
      position = mutation.position;
  return _objectSpread2({}, mutation, {
    prevPosition: _objectSpread2({}, position),
    position: _objectSpread2({}, prevPosition)
  });
});
// CONCATENATED MODULE: ./src/store/mutations/addLink.ts




function addLink(state, _ref) {
  var link = _ref.link;
  external_commonjs_vue_commonjs2_vue_root_Vue_default.a.set(state.graph.links, link.id, link);
}
registerRevertFunc('addLink', function (mutation) {
  return _objectSpread2({}, mutation, {
    type: 'removeLink'
  });
});
// CONCATENATED MODULE: ./src/store/mutations/removeLink.ts




/* harmony default export */ var removeLink = (function (state, _ref) {
  var link = _ref.link;
  external_commonjs_vue_commonjs2_vue_root_Vue_default.a.delete(state.graph.links, link.id);
});
registerRevertFunc('removeLink', function (mutation) {
  return _objectSpread2({}, mutation, {
    type: 'addLink'
  });
});
// CONCATENATED MODULE: ./src/store/mutations/touchLink.ts

function touchLink(state, _ref) {
  var linkId = _ref.linkId;
  external_commonjs_vue_commonjs2_vue_root_Vue_default.a.set(state.linkVersions, linkId, Date.now());
}
// CONCATENATED MODULE: ./src/store/mutations/updateLinkPath.ts

function updateLinkPath(state, _ref) {
  var linkId = _ref.linkId,
      path = _ref.path;
  external_commonjs_vue_commonjs2_vue_root_Vue_default.a.set(state.linkPath, linkId, path);
}
// CONCATENATED MODULE: ./src/store/mutations/deleteLinkPath.ts

function deleteLinkPath(state, _ref) {
  var linkId = _ref.linkId;
  external_commonjs_vue_commonjs2_vue_root_Vue_default.a.delete(state.linkPath, linkId);
}
// CONCATENATED MODULE: ./src/store/mutations/updateSelected.ts

function updateSelected(state, _ref) {
  var selected = _ref.selected;
  external_commonjs_vue_commonjs2_vue_root_Vue_default.a.set(state, 'selected', selected);
}
// CONCATENATED MODULE: ./src/store/mutations/expandGird.ts




function expandGrid(state, expansion) {
  if (expansion.x === 0 && expansion.y === 0) return;
  var prevOffset = state.graph.grid.offset;
  var _state$graph$grid = state.graph.grid,
      width = _state$graph$grid.width,
      height = _state$graph$grid.height;
  var negativeX = expansion.x < 0;
  var negativeY = expansion.y < 0;
  width += Math.abs(expansion.x);
  height += Math.abs(expansion.y);

  var _buildEmptyGrid = buildEmptyGrid(width, height),
      pfGrid = _buildEmptyGrid.pfGrid;

  var offset = {
    x: negativeX ? prevOffset.x + Math.abs(expansion.x) : prevOffset.x,
    y: negativeY ? prevOffset.y + Math.abs(expansion.y) : prevOffset.y
  };
  state.graph.grid = {
    width: width,
    height: height,
    pfGrid: pfGrid,
    offset: offset
  };
  Object.values(state.graph.nodes).forEach(function (node) {
    markNodeWalkable(pfGrid, offset, node, false, state.config);
  });
}
// CONCATENATED MODULE: ./src/store/mutations/updateMousePosition.ts
function updateMousePosition(state, position) {
  // TODO: expand grid
  state.mousePosition = position;
}
// CONCATENATED MODULE: ./src/store/mutations/updateScale.ts
function updateScale(state, _ref) {
  var scale = _ref.scale;
  state.graph.scale = scale;
}
// CONCATENATED MODULE: ./src/store/mutations/updateOffset.ts
function updateOffset(state, _ref) {
  var offset = _ref.offset;
  state.graph.offset = offset;
}
// CONCATENATED MODULE: ./src/store/mutations/updateConfig.ts


function updateConfig(state, config) {
  external_commonjs_vue_commonjs2_vue_root_Vue_default.a.set(state, 'config', buildConfig(config));
}
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.splice.js
var es_array_splice = __webpack_require__("a434");

// CONCATENATED MODULE: ./src/store/mutations/history/pushEntry.ts



/* harmony default export */ var pushEntry = (function (state, _ref) {
  var entry = _ref.entry;
  var deleteCount = state.history.entries.length - state.history.currentVersion; // fork at currentVersion

  if (deleteCount !== 0) {
    state.history.entries.splice(state.history.currentVersion, deleteCount);
  }

  state.history.currentVersion += 1;
  state.history.entries.push(entry);
});
// CONCATENATED MODULE: ./src/store/mutations/history/alterVersion.ts
/* harmony default export */ var alterVersion = (function (state, _ref) {
  var delta = _ref.delta;
  state.history.currentVersion += delta;
});
// CONCATENATED MODULE: ./src/store/mutations/history/index.ts


/* harmony default export */ var mutations_history = ({
  historyPushEntry: pushEntry,
  historyAlterVersion: alterVersion
});
// CONCATENATED MODULE: ./src/store/mutations/index.ts
















/* harmony default export */ var store_mutations = (_objectSpread2({
  addNode: addNode,
  removeNode: removeNode,
  updateNodePosition: updateNodePosition,
  addLink: addLink,
  removeLink: removeLink,
  touchLink: touchLink,
  updateLinkPath: updateLinkPath,
  deleteLinkPath: deleteLinkPath,
  updateSelected: updateSelected,
  expandGrid: expandGrid,
  updateMousePosition: updateMousePosition,
  updateScale: updateScale,
  updateOffset: updateOffset,
  updateConfig: updateConfig
}, mutations_history));
// CONCATENATED MODULE: ./src/store/actions/addNode.ts




function addNode_addNode(_ref, node) {
  var state = _ref.state,
      commit = _ref.commit,
      dispatch = _ref.dispatch;
  autoGridExpansions(state.graph.grid, node).forEach(function (expansion) {
    commit('expandGrid', expansion);
  });
  var mutations = [{
    type: 'addNode',
    node: _objectSpread2({}, node)
  }];
  dispatch('historyPushEntry', mutations);
}
// CONCATENATED MODULE: ./src/store/actions/removeNode.ts




function removeNode_removeNode(context, nodeId) {
  var _context$state$graph = context.state.graph,
      nodes = _context$state$graph.nodes,
      links = _context$state$graph.links;
  var node = nodes[nodeId];
  if (!node) return;
  var mutations = []; // remove link

  Object.values(links).forEach(function (link) {
    if (link.from.nodeId === nodeId || link.to.nodeId === nodeId) {
      mutations.push({
        type: 'removeLink',
        link: _objectSpread2({}, link)
      });
    }
  });
  mutations.push({
    type: 'removeNode',
    node: _objectSpread2({}, node)
  });
  context.dispatch('historyPushEntry', mutations);
}
// CONCATENATED MODULE: ./src/store/actions/dragNode.ts



function dragNode(_ref, _ref2) {
  var state = _ref.state,
      commit = _ref.commit;
  var id = _ref2.id,
      position = _ref2.position,
      prevPosition = _ref2.prevPosition;
  var node = state.graph.nodes[id];
  if (!node) return;
  autoGridExpansions(state.graph.grid, node).forEach(function (expansion) {
    commit('expandGrid', expansion);
  });
  commit('updateNodePosition', {
    node: node,
    position: position,
    prevPosition: prevPosition
  });
}
// CONCATENATED MODULE: ./src/store/actions/dragNodeStop.ts
function dragNodeStop(_ref, _ref2) {
  var dispatch = _ref.dispatch,
      state = _ref.state;
  var id = _ref2.id,
      position = _ref2.position,
      prevPosition = _ref2.prevPosition;
  var node = state.graph.nodes[id];
  if (!node) return;
  var mutations = [{
    type: 'updateNodePosition',
    node: node,
    position: position,
    prevPosition: prevPosition
  }];
  dispatch('historyPushEntry', mutations);
}
// CONCATENATED MODULE: ./src/store/actions/deleteSelected.ts
function deleteSelected(_ref) {
  var dispatch = _ref.dispatch,
      commit = _ref.commit,
      state = _ref.state;
  var selected = state.selected;

  if (selected) {
    var updateSelectedFunc = function updateSelectedFunc() {
      return commit('updateSelected', {
        selected: null
      });
    }; // eslint-disable-next-line default-case


    switch (selected.type) {
      case 'link':
        dispatch('removeLink', {
          linkId: selected.id
        }).then(updateSelectedFunc);
        break;

      case 'node':
        dispatch('removeNode', selected.id).then(updateSelectedFunc);
        break;
    }
  }
}
// CONCATENATED MODULE: ./src/store/actions/selectNode.ts
function selectNode(_ref, nodeId) {
  var state = _ref.state,
      commit = _ref.commit;
  if (state.selected && state.selected.id === nodeId) return;
  commit('updateSelected', {
    selected: {
      type: 'node',
      id: nodeId
    }
  });
}
// CONCATENATED MODULE: ./src/store/actions/addLink.ts


function addLink_addLink(_ref, _ref2) {
  var commit = _ref.commit,
      dispatch = _ref.dispatch;
  var link = _ref2.link,
      _ref2$history = _ref2.history,
      history = _ref2$history === void 0 ? true : _ref2$history;
  var mutation = {
    type: 'addLink',
    link: _objectSpread2({}, link)
  };

  if (history) {
    dispatch('historyPushEntry', mutation);
  } else {
    commit(mutation);
  }
}
// CONCATENATED MODULE: ./src/store/actions/removeLink.ts

function removeLink_removeLink(_ref, _ref2) {
  var state = _ref.state,
      dispatch = _ref.dispatch,
      commit = _ref.commit;
  var linkId = _ref2.linkId,
      _ref2$history = _ref2.history,
      history = _ref2$history === void 0 ? true : _ref2$history;
  var link = state.graph.links[linkId];
  if (!link) return;
  var mutation = {
    type: 'removeLink',
    link: _objectSpread2({}, link)
  };

  if (history) {
    dispatch('historyPushEntry', mutation);
  } else {
    commit(mutation);
  }

  commit('deleteLinkPath', {
    linkId: linkId
  });
}
// CONCATENATED MODULE: ./src/store/actions/selectLink.ts
function selectLink_selectNode(_ref, linkId) {
  var state = _ref.state,
      commit = _ref.commit;
  if (state.selected && state.selected.id === linkId) return;
  commit('updateSelected', {
    selected: {
      type: 'link',
      id: linkId
    }
  });
}
// CONCATENATED MODULE: ./src/utils/shared.ts
// eslint-disable-next-line import/prefer-default-export
function clamp(val, min, max) {
  if (val < min) {
    return min;
  }

  if (val > max) {
    return max;
  }

  return val;
}
// CONCATENATED MODULE: ./src/store/actions/updateScale.ts

function updateScale_updateScale(_ref, scale) {
  var state = _ref.state,
      commit = _ref.commit;
  var _state$config = state.config,
      minZoom = _state$config.minZoom,
      maxZoom = _state$config.maxZoom;
  commit({
    type: 'updateScale',
    scale: clamp(scale, minZoom, maxZoom)
  });
}
// CONCATENATED MODULE: ./src/store/actions/history/pushEntry.ts


/* harmony default export */ var history_pushEntry = (function (_ref, mutations) {
  var commit = _ref.commit;

  if (!Array.isArray(mutations)) {
    // eslint-disable-next-line no-param-reassign
    mutations = [mutations];
  }

  mutations.forEach(function (mutation) {
    commit(mutation);
  });
  commit({
    type: 'historyPushEntry',
    entry: {
      mutations: mutations
    }
  });
});
// CONCATENATED MODULE: ./src/store/actions/history/redo.ts



/* harmony default export */ var redo = (function (_ref) {
  var state = _ref.state,
      commit = _ref.commit;
  var entry = getEntry(state, 1);
  if (!entry) return;
  entry.mutations.forEach(function (mutation) {
    return commit(mutation);
  });
  commit('historyAlterVersion', {
    delta: 1
  });
});
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/iterableToArray.js








function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js




function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
// CONCATENATED MODULE: ./src/store/actions/history/undo.ts




/* harmony default export */ var undo = (function (_ref) {
  var state = _ref.state,
      commit = _ref.commit;
  var entry = getEntry(state, -1);
  if (!entry) return;

  _toConsumableArray(entry.mutations).reverse().forEach(function (mutation) {
    return commit(revertMutation(mutation));
  });

  commit('historyAlterVersion', {
    delta: -1
  });
});
// CONCATENATED MODULE: ./src/store/actions/history/index.ts



/* harmony default export */ var actions_history = ({
  historyPushEntry: history_pushEntry,
  historyRedo: redo,
  historyUndo: undo
});
// CONCATENATED MODULE: ./src/store/actions/index.ts












/* harmony default export */ var actions = (_objectSpread2({}, actions_history, {
  addNode: addNode_addNode,
  removeNode: removeNode_removeNode,
  dragNode: dragNode,
  dragNodeStop: dragNodeStop,
  selectNode: selectNode,
  deleteSelected: deleteSelected,
  addLink: addLink_addLink,
  removeLink: removeLink_removeLink,
  selectLink: selectLink_selectNode,
  updateScale: updateScale_updateScale
}));
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/toArray.js




function _toArray(arr) {
  return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest();
}
// CONCATENATED MODULE: ./src/store/plugins/reactiveLinks.ts








function getBoundingRect(position, prevPosition, _ref) {
  var width = _ref.width,
      height = _ref.height;
  return [Math.min(position.x, prevPosition.x), Math.min(position.y, prevPosition.y), width + Math.abs(position.x - prevPosition.x), height + Math.abs(position.y - prevPosition.y)];
}

function getMovingBoundingRect(_ref2) {
  var position = _ref2.position,
      prevPosition = _ref2.prevPosition,
      node = _ref2.node;
  return getBoundingRect(position, prevPosition, node);
} // detect whether the line is intersectant with the node


function isIntersectant(_ref3, _ref4) {
  var _ref5 = _slicedToArray(_ref3, 4),
      x1 = _ref5[0],
      y1 = _ref5[1],
      width1 = _ref5[2],
      height1 = _ref5[3];

  var _ref6 = _slicedToArray(_ref4, 2),
      _ref6$ = _slicedToArray(_ref6[0], 2),
      x3 = _ref6$[0],
      y3 = _ref6$[1],
      _ref6$2 = _slicedToArray(_ref6[1], 2),
      x4 = _ref6$2[0],
      y4 = _ref6$2[1];

  var x2 = Math.min(x3, x4);
  var y2 = Math.min(y3, y4);
  var width2 = Math.abs(x3 - x4);
  var height2 = Math.abs(y3 - y4);
  return x1 < x2 + width2 && x1 + width1 > x2 && y1 < y2 + height2 && height1 + y1 > y2;
}

function reactiveLinks(store) {
  store.subscribe(function (mutation, state) {
    if (mutation.type === 'updateNodePosition') {
      var movingBoundingRect = getMovingBoundingRect(mutation.payload);
      var nodeId = mutation.payload.node.id;
      Object.values(state.graph.links).forEach(function (link) {
        if (link.from.nodeId === nodeId) return;
        if (link.to.nodeId === nodeId) return;
        var linkPath = state.linkPath[link.id];
        if (!linkPath) return; // skip blank path

        if (linkPath.length <= 1) return;
        var intersectant = false;

        var _linkPath = _toArray(linkPath),
            first = _linkPath[0],
            rest = _linkPath.slice(1); // check each segment of the line


        rest.reduce(function (prevPoint, point) {
          if (intersectant) return point;
          if (!isIntersectant(movingBoundingRect, [prevPoint, point])) return point;
          intersectant = true;
          store.commit('touchLink', {
            linkId: link.id
          });
          return point;
        }, first);
      });
    }
  });
}
// CONCATENATED MODULE: ./src/store/index.ts








var defaultWidth = 1440,
    defaultHeight = 900;
external_commonjs_vue_commonjs2_vue_root_Vue_default.a.use(vuex_esm["a" /* default */]);
var store_state = {
  history: {
    currentVersion: 0,
    entries: []
  },
  graph: {
    scale: 1,
    offset: {
      x: 0,
      y: 0
    },
    nodes: {},
    links: {},
    grid: _objectSpread2({
      offset: {
        x: 0,
        y: 0
      }
    }, buildEmptyGrid(defaultWidth, defaultHeight))
  },
  linkVersions: {},
  linkPath: {},
  selected: null,
  mousePosition: null,
  config: buildConfig({})
};
var store_store = new vuex_esm["a" /* default */].Store({
  state: store_state,
  mutations: store_mutations,
  actions: actions,
  plugins: [reactiveLinks]
});
/* harmony default export */ var src_store = (store_store);
// CONCATENATED MODULE: ./src/hooks/useStore.ts

function useStore() {
  return src_store;
}
// CONCATENATED MODULE: ./src/utils/graph.ts



// eslint-disable-next-line import/prefer-default-export
function buildState(rawState, store) {
  var nodes = rawState.nodes,
      links = rawState.links,
      _rawState$scale = rawState.scale,
      scale = _rawState$scale === void 0 ? 1 : _rawState$scale;
  store.commit({
    type: 'updateScale',
    scale: scale
  }); // TODO: expand grid

  nodes.forEach(function (node) {
    store.commit('addNode', {
      node: _objectSpread2({}, node)
    });
  });
  links.forEach(function (link) {
    store.commit('addLink', {
      link: _objectSpread2({}, link)
    });
  });
}
// CONCATENATED MODULE: ./src/components/Flowchart/hooks/useState.ts


function useState(rawState, store) {
  buildState(rawState, store);
  var nodes = computed(function () {
    return store.state.graph.nodes;
  });
  var links = computed(function () {
    return store.state.graph.links;
  });
  return {
    nodes: nodes,
    links: links
  };
}
// CONCATENATED MODULE: ./src/components/Flowchart/hooks/useSelected.ts

function useSelected(store) {
  var selected = computed(function () {
    return store.state.selected;
  });

  function isNodeSelected(nodeId) {
    return !!(selected.value && selected.value.type === 'node' && selected.value.id === nodeId);
  }

  function isLinkSelected(linkId) {
    return !!(selected.value && selected.value.type === 'link' && selected.value.id === linkId);
  }

  return {
    isNodeSelected: isNodeSelected,
    isLinkSelected: isLinkSelected
  };
}
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"73b8e84c-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Canvas/Canvas.vue?vue&type=template&id=5ab2cce9&
var Canvasvue_type_template_id_5ab2cce9_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"canvas"},[_c('PanZoom',{attrs:{"x":_vm.gridOffset.x,"y":_vm.gridOffset.y,"zoom":_vm.scale,"min-zoom":_vm.minZoom,"max-zoom":_vm.maxZoom},on:{"panend":_vm.onCanvasPanEnd,"zoom":_vm.onCanvasZoom}},[_c('div',{staticClass:"canvas__inner",style:(_vm.canvasStyleObj)},[_vm._t("default")],2)])],1)}
var Canvasvue_type_template_id_5ab2cce9_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/Canvas/Canvas.vue?vue&type=template&id=5ab2cce9&

// CONCATENATED MODULE: ./src/components/Canvas/hooks/useSize.ts

function useSize() {
  var canvasRef = ref(null);
  var size = reactive({
    width: 0,
    height: 0,
    offsetX: 0,
    offsetY: 0
  });
  return {
    canvasRef: canvasRef,
    size: size
  };
}
// CONCATENATED MODULE: ./src/components/Canvas/hooks/usePanZoomCanvas.ts

function usePanZoomCanvas(store) {
  var minZoom = computed(function () {
    return store.state.config.minZoom;
  });
  var maxZoom = computed(function () {
    return store.state.config.maxZoom;
  });

  function onCanvasZoom(panZoom) {
    var transform = panZoom.getTransform(); // num.toFixed(2) ?

    store.commit({
      type: 'updateScale',
      scale: transform.scale
    }); // for zoom, convert x and y to integer

    store.commit({
      type: 'updateOffset',
      offset: {
        x: Math.ceil(transform.x),
        y: Math.ceil(transform.y)
      }
    });
  }

  function onCanvasPanEnd(panZoom) {
    var transform = panZoom.getTransform(); // for pan, x and y are already integer

    store.commit({
      type: 'updateOffset',
      offset: {
        x: transform.x,
        y: transform.y
      }
    });
  }

  return {
    minZoom: minZoom,
    maxZoom: maxZoom,
    onCanvasZoom: onCanvasZoom,
    onCanvasPanEnd: onCanvasPanEnd
  };
}
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"73b8e84c-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Canvas/PanZoom.vue?vue&type=template&id=8377002c&
var PanZoomvue_type_template_id_8377002c_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"pan-zoom"},[_c('div',{ref:"sceneRef",staticClass:"pan-zoom__scene"},[_vm._t("default")],2)])}
var PanZoomvue_type_template_id_8377002c_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/Canvas/PanZoom.vue?vue&type=template&id=8377002c&

// EXTERNAL MODULE: ./node_modules/panzoom/index.js
var panzoom = __webpack_require__("7d05");
var panzoom_default = /*#__PURE__*/__webpack_require__.n(panzoom);

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/ts-loader??ref--13-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Canvas/PanZoom.vue?vue&type=script&lang=ts&



/* harmony default export */ var PanZoomvue_type_script_lang_ts_ = (defineComponent({
  name: 'PanZoom',
  props: {
    x: {
      type: Number,
      default: 0
    },
    y: {
      type: Number,
      default: 0
    },
    zoom: {
      type: Number,
      default: 1
    },
    minZoom: {
      type: Number,
      default: undefined
    },
    maxZoom: {
      type: Number,
      default: undefined
    }
  },
  setup: function setup(props, _ref) {
    var emit = _ref.emit;
    var sceneRef = ref(null);

    var bindEvents = function bindEvents(instance) {
      instance.on('panstart', function (ins) {
        emit('panstart', ins);
      });
      instance.on('pan', function (ins) {
        emit('pan', ins);
      });
      instance.on('panend', function (ins) {
        emit('panend', ins);
      });
      instance.on('zoom', function (ins) {
        emit('zoom', ins);
      }); // https://github.com/anvaka/panzoom/issues/177

      instance.on('zoomend', function (ins) {
        emit('zoomend', ins);
      });
      instance.on('transform', function (ins) {
        emit('transform', ins);
      });
    };

    onMounted(function () {
      if (sceneRef.value) {
        // https://github.com/anvaka/panzoom
        var panZoomInstance = panzoom_default()(sceneRef.value, {
          bounds: true,
          minZoom: props.minZoom,
          maxZoom: props.maxZoom
        });
        panZoomInstance.zoomAbs(props.x, props.y, props.zoom);
        bindEvents(panZoomInstance);
        watch(function () {
          return props.zoom;
        }, function (zoom) {
          panZoomInstance.zoomAbs(props.x, props.y, zoom);
        }, {
          lazy: true
        });
      }
    });
    return {
      sceneRef: sceneRef
    };
  }
}));
// CONCATENATED MODULE: ./src/components/Canvas/PanZoom.vue?vue&type=script&lang=ts&
 /* harmony default export */ var Canvas_PanZoomvue_type_script_lang_ts_ = (PanZoomvue_type_script_lang_ts_); 
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functional component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}

// CONCATENATED MODULE: ./src/components/Canvas/PanZoom.vue





/* normalize component */

var component = normalizeComponent(
  Canvas_PanZoomvue_type_script_lang_ts_,
  PanZoomvue_type_template_id_8377002c_render,
  PanZoomvue_type_template_id_8377002c_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var PanZoom = (component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/ts-loader??ref--13-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Canvas/Canvas.vue?vue&type=script&lang=ts&






/* harmony default export */ var Canvasvue_type_script_lang_ts_ = (defineComponent({
  name: 'Canvas',
  components: {
    PanZoom: PanZoom
  },
  setup: function setup() {
    var _useSize = useSize(),
        size = _useSize.size;

    var store = useStore();
    var canvasStyleObj = computed(function () {
      return {
        width: "".concat(store.state.graph.grid.width, "px"),
        height: "".concat(store.state.graph.grid.height, "px")
      };
    });
    var scale = computed(function () {
      return store.state.graph.scale;
    });
    var gridOffset = store.state.graph.grid.offset;
    return _objectSpread2({
      size: size,
      canvasStyleObj: canvasStyleObj,
      scale: scale,
      gridOffset: gridOffset
    }, usePanZoomCanvas(store));
  }
}));
// CONCATENATED MODULE: ./src/components/Canvas/Canvas.vue?vue&type=script&lang=ts&
 /* harmony default export */ var Canvas_Canvasvue_type_script_lang_ts_ = (Canvasvue_type_script_lang_ts_); 
// EXTERNAL MODULE: ./src/components/Canvas/Canvas.vue?vue&type=style&index=0&lang=scss&
var Canvasvue_type_style_index_0_lang_scss_ = __webpack_require__("30ea");

// CONCATENATED MODULE: ./src/components/Canvas/Canvas.vue






/* normalize component */

var Canvas_component = normalizeComponent(
  Canvas_Canvasvue_type_script_lang_ts_,
  Canvasvue_type_template_id_5ab2cce9_render,
  Canvasvue_type_template_id_5ab2cce9_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var Canvas = (Canvas_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"73b8e84c-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Node/Wrapper.vue?vue&type=template&id=10360a84&
var Wrappervue_type_template_id_10360a84_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('vue-draggable-resizable',{staticClass:"node-wrapper",attrs:{"onDragStart":_vm.onDragStart,"x":_vm.node.x,"y":_vm.node.y,"z":50,"resizable":false,"grid":[1, 1],"scale":_vm.scale,"axis":"both","w":"auto","h":"auto"},on:{"dragging":_vm.onNodeDragging,"dragstop":_vm.onNodeDragStop,"activated":_vm.onNodeClick}},[_c(_vm.nodeComponent,{tag:"component",attrs:{"node":_vm.node,"is-selected":_vm.isSelected}}),_vm._l((_vm.node.ports),function(port,id){return _c('PortWrapperComponent',{key:id,attrs:{"node":_vm.node,"port":port,"port-component":_vm.portComponent}})})],2)}
var Wrappervue_type_template_id_10360a84_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/Node/Wrapper.vue?vue&type=template&id=10360a84&

// EXTERNAL MODULE: ./node_modules/vue-draggable-resizable/dist/VueDraggableResizable.umd.min.js
var VueDraggableResizable_umd_min = __webpack_require__("fb19");
var VueDraggableResizable_umd_min_default = /*#__PURE__*/__webpack_require__.n(VueDraggableResizable_umd_min);

// CONCATENATED MODULE: ./src/components/Node/hooks/useDragNode.ts

function useDragNode(store, node) {
  var draggingNodePosition = null;

  function onDragStart(e) {
    e.stopPropagation(); // prevent canvas move

    draggingNodePosition = {
      x: node.value.x,
      y: node.value.y
    };
  }

  function onNodeDragging(left, top) {
    store.dispatch('dragNode', {
      id: node.value.id,
      position: {
        x: left,
        y: top
      },
      prevPosition: {
        x: node.value.x,
        y: node.value.y
      }
    });
  }

  function onNodeDragStop(left, top) {
    store.dispatch('dragNodeStop', {
      id: node.value.id,
      position: {
        x: left,
        y: top
      },
      prevPosition: _objectSpread2({}, draggingNodePosition)
    });
    draggingNodePosition = null;
  }

  return {
    onDragStart: onDragStart,
    onNodeDragging: onNodeDragging,
    onNodeDragStop: onNodeDragStop
  };
}
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"73b8e84c-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Port/Wrapper.vue?vue&type=template&id=6acf101d&
var Wrappervue_type_template_id_6acf101d_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"data-port-id":_vm.port.id,"data-node-id":_vm.node.id},on:{"mousedown":_vm.onMouseDown}},[_c(_vm.portComponent,{tag:"component",attrs:{"node":_vm.node,"port":_vm.port}})],1)}
var Wrappervue_type_template_id_6acf101d_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/Port/Wrapper.vue?vue&type=template&id=6acf101d&

// CONCATENATED MODULE: ./src/pipelines/runPipeline.ts
function runPipeline(link, state) {
  var linkPipeline = state.config.linkPipeline;
  var result = link;
  var index = 0;

  while (result && index < linkPipeline.length) {
    var phase = linkPipeline[index];
    result = phase(link, state.graph);
    index += 1;
  }

  return result;
}
// CONCATENATED MODULE: ./src/components/Port/hooks/useMouseDownOnPort.ts



function findTarget(el) {
  var curr = el;
  var target = null;

  while (!target && curr) {
    var nodeId = curr.getAttribute && curr.getAttribute('data-node-id');
    var portId = curr.getAttribute && curr.getAttribute('data-port-id');

    if (portId && nodeId) {
      target = {
        portId: portId,
        nodeId: nodeId
      };
    } else {
      curr = curr.parentElement;
    }
  }

  return target;
}

function useMouseDownOnPort(store, node, port) {
  var onMouseDown = function onMouseDown(evt) {
    var fromNodeId = node.id;
    var fromPortId = port.id; // the id isnt set right now, it should be set in pipelines.

    var newLink = runPipeline({
      from: {
        nodeId: fromNodeId,
        portId: fromPortId
      },
      to: {}
    }, store.state);

    function mouseMoveHandler(e) {
      var toPosition = {
        x: e.x,
        y: e.y
      };
      store.commit('updateMousePosition', toPosition);
    }

    function mouseUpHandler(e) {
      store.commit('updateMousePosition', null); // remove listeners

      window.removeEventListener('mouseup', mouseUpHandler, false);
      window.removeEventListener('mousemove', mouseMoveHandler, false); // mouseUpHandler added to mouseup event listeners unless a newLink.
      // if (!newLink) return;

      var target = findTarget(e.target);

      if (target) {
        // complete link
        var toNodeId = target.nodeId,
            toPortId = target.portId;
        var link = runPipeline(_objectSpread2({}, newLink, {
          to: {
            nodeId: toNodeId,
            portId: toPortId
          }
        }), store.state);

        if (link) {
          store.dispatch('addLink', {
            link: link
          });
        } else {
          store.dispatch('removeLink', {
            linkId: newLink.id
          });
        }
      } else {
        // delete link
        store.dispatch('removeLink', {
          linkId: newLink.id
        });
      }
    }

    if (newLink) {
      // new link when start
      store.dispatch('addLink', {
        link: newLink
      }); // add listeners

      window.addEventListener('mousemove', mouseMoveHandler, false);
      window.addEventListener('mouseup', mouseUpHandler, false);
    } // prevent text selection


    evt.preventDefault(); // prevent node move

    evt.stopPropagation();
  };

  return {
    onMouseDown: onMouseDown
  };
}
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/ts-loader??ref--13-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Port/Wrapper.vue?vue&type=script&lang=ts&



/* harmony default export */ var Wrappervue_type_script_lang_ts_ = (defineComponent({
  name: 'PortWrapper',
  props: {
    portComponent: {
      type: Object,
      required: true
    },
    port: {
      type: Object,
      required: true
    },
    node: {
      type: Object,
      required: true
    }
  },
  setup: function setup(props) {
    var store = useStore();

    var _useMouseDownOnPort = useMouseDownOnPort(store, props.node, props.port),
        onMouseDown = _useMouseDownOnPort.onMouseDown;

    return {
      onMouseDown: onMouseDown
    };
  }
}));
// CONCATENATED MODULE: ./src/components/Port/Wrapper.vue?vue&type=script&lang=ts&
 /* harmony default export */ var Port_Wrappervue_type_script_lang_ts_ = (Wrappervue_type_script_lang_ts_); 
// CONCATENATED MODULE: ./src/components/Port/Wrapper.vue





/* normalize component */

var Wrapper_component = normalizeComponent(
  Port_Wrappervue_type_script_lang_ts_,
  Wrappervue_type_template_id_6acf101d_render,
  Wrappervue_type_template_id_6acf101d_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var Wrapper = (Wrapper_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/ts-loader??ref--13-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Node/Wrapper.vue?vue&type=script&lang=ts&

// @ts-ignore





/* harmony default export */ var Node_Wrappervue_type_script_lang_ts_ = (defineComponent({
  name: 'NodeWrapper',
  components: {
    VueDraggableResizable: VueDraggableResizable_umd_min_default.a,
    PortWrapperComponent: Wrapper
  },
  props: {
    node: {
      type: Object,
      required: true
    },
    isSelected: {
      type: Boolean,
      default: false
    },
    nodeComponent: {
      type: Object,
      required: true
    },
    portComponent: {
      type: Object,
      required: true
    }
  },
  setup: function setup(props) {
    var store = useStore();
    var node = computed(function () {
      return props.node;
    });
    var scale = computed(function () {
      return store.state.graph.scale;
    });

    var onNodeClick = function onNodeClick() {
      store.dispatch('selectNode', props.node.id);
    };

    return _objectSpread2({
      onNodeClick: onNodeClick,
      scale: scale
    }, useDragNode(store, node));
  }
}));
// CONCATENATED MODULE: ./src/components/Node/Wrapper.vue?vue&type=script&lang=ts&
 /* harmony default export */ var components_Node_Wrappervue_type_script_lang_ts_ = (Node_Wrappervue_type_script_lang_ts_); 
// EXTERNAL MODULE: ./src/components/Node/Wrapper.vue?vue&type=style&index=0&lang=scss&
var Wrappervue_type_style_index_0_lang_scss_ = __webpack_require__("2d23");

// CONCATENATED MODULE: ./src/components/Node/Wrapper.vue






/* normalize component */

var Node_Wrapper_component = normalizeComponent(
  components_Node_Wrappervue_type_script_lang_ts_,
  Wrappervue_type_template_id_10360a84_render,
  Wrappervue_type_template_id_10360a84_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var Node_Wrapper = (Node_Wrapper_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"73b8e84c-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Node/Default.vue?vue&type=template&id=5978a3f6&
var Defaultvue_type_template_id_5978a3f6_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"node__default",style:({ width: _vm.node.width + 'px', height: _vm.node.height + 'px'})},[_vm._v(" "+_vm._s(_vm.node.id)+" ")])}
var Defaultvue_type_template_id_5978a3f6_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/Node/Default.vue?vue&type=template&id=5978a3f6&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/ts-loader??ref--13-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Node/Default.vue?vue&type=script&lang=ts&

/* harmony default export */ var Defaultvue_type_script_lang_ts_ = (defineComponent({
  name: 'NodeDefault',
  props: {
    node: {
      type: Object,
      required: true
    }
  }
}));
// CONCATENATED MODULE: ./src/components/Node/Default.vue?vue&type=script&lang=ts&
 /* harmony default export */ var Node_Defaultvue_type_script_lang_ts_ = (Defaultvue_type_script_lang_ts_); 
// EXTERNAL MODULE: ./src/components/Node/Default.vue?vue&type=style&index=0&lang=scss&
var Defaultvue_type_style_index_0_lang_scss_ = __webpack_require__("e01a1");

// CONCATENATED MODULE: ./src/components/Node/Default.vue






/* normalize component */

var Default_component = normalizeComponent(
  Node_Defaultvue_type_script_lang_ts_,
  Defaultvue_type_template_id_5978a3f6_render,
  Defaultvue_type_template_id_5978a3f6_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var Default = (Default_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"73b8e84c-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Port/Default.vue?vue&type=template&id=23a5be42&
var Defaultvue_type_template_id_23a5be42_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"port",style:(_vm.portStyleObj)},[_c('div',{ref:"inner",staticClass:"port__inner"})])}
var Defaultvue_type_template_id_23a5be42_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/Port/Default.vue?vue&type=template&id=23a5be42&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/ts-loader??ref--13-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Port/Default.vue?vue&type=script&lang=ts&

/* harmony default export */ var Port_Defaultvue_type_script_lang_ts_ = (defineComponent({
  name: 'Port',
  props: {
    port: {
      type: Object,
      required: true
    },
    node: {
      type: Object,
      required: true
    }
  },
  setup: function setup(props) {
    var portStyleObj = computed(function () {
      return {
        left: "".concat(props.port.position.x - props.node.x - 6, "px"),
        top: "".concat(props.port.position.y - props.node.y - 6, "px")
      };
    });
    return {
      portStyleObj: portStyleObj
    };
  }
}));
// CONCATENATED MODULE: ./src/components/Port/Default.vue?vue&type=script&lang=ts&
 /* harmony default export */ var components_Port_Defaultvue_type_script_lang_ts_ = (Port_Defaultvue_type_script_lang_ts_); 
// EXTERNAL MODULE: ./src/components/Port/Default.vue?vue&type=style&index=0&lang=scss&
var Port_Defaultvue_type_style_index_0_lang_scss_ = __webpack_require__("05a9");

// CONCATENATED MODULE: ./src/components/Port/Default.vue






/* normalize component */

var Port_Default_component = normalizeComponent(
  components_Port_Defaultvue_type_script_lang_ts_,
  Defaultvue_type_template_id_23a5be42_render,
  Defaultvue_type_template_id_23a5be42_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var Port_Default = (Port_Default_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"73b8e84c-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Link/Wrapper.vue?vue&type=template&id=2f7e3acc&
var Wrappervue_type_template_id_2f7e3acc_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.endPort)?_c('span',{on:{"click":_vm.onLinkClick}},[_c(_vm.linkComponent,{tag:"component",attrs:{"link":_vm.link,"start-pos":_vm.startPort.position,"end-pos":_vm.endPort.position,"path":_vm.path,"is-selected":_vm.isSelected}})],1):_vm._e()}
var Wrappervue_type_template_id_2f7e3acc_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/Link/Wrapper.vue?vue&type=template&id=2f7e3acc&

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.concat.js
var es_array_concat = __webpack_require__("99af");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.map.js
var es_array_map = __webpack_require__("d81d");

// CONCATENATED MODULE: ./src/components/Link/utils/generateRightAnglePath.ts
function generateRightAnglePath(startPos, endPos) {
  var width = Math.abs(startPos.x - endPos.x);
  var height = Math.abs(startPos.y - endPos.y);
  var isHorizontal = width > height;
  var vertex = isHorizontal ? [endPos.x, startPos.y] : [startPos.x, endPos.y];
  return [[startPos.x, startPos.y], vertex, [endPos.x, endPos.y]];
}
// CONCATENATED MODULE: ./src/components/Link/utils/generatePath.ts











function scalePath(path) {
  return path.map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        x = _ref2[0],
        y = _ref2[1];

    return [x * SCALE_FACTOR, y * SCALE_FACTOR];
  });
}

function scalePosition(position) {
  return {
    x: Math.ceil(position.x / SCALE_FACTOR),
    y: Math.ceil(position.y / SCALE_FACTOR)
  };
}

function getPaddingPoint(_ref3, config) {
  var position = _ref3.position,
      direction = _ref3.direction;

  switch (direction) {
    case types["PortDirection"].TOP:
      return _objectSpread2({}, position, {
        y: position.y - config.nodePadding
      });
      break;

    case types["PortDirection"].RIGHT:
      return _objectSpread2({}, position, {
        x: position.x + config.nodePadding
      });
      break;

    case types["PortDirection"].BOTTOM:
      return _objectSpread2({}, position, {
        y: position.y + config.nodePadding
      });
      break;

    case types["PortDirection"].LEFT:
      return _objectSpread2({}, position, {
        x: position.x - config.nodePadding
      });
      break;

    default:
      return _objectSpread2({}, position);
  }
}

function fallbackPath(startPort, endPort, config) {
  var scaledStartPos = scalePosition(getPaddingPoint(startPort, config));
  var scaledEndPos = scalePosition(getPaddingPoint(endPort, config));
  var originalStartPos = scalePosition(startPort.position);
  var originalEndPos = scalePosition(endPort.position);
  return scalePath([[originalStartPos.x, originalStartPos.y]].concat(_toConsumableArray(generateRightAnglePath(scaledStartPos, scaledEndPos)), [[originalEndPos.x, originalEndPos.y]]));
}

function generatePath(grid, startPort, endPort, config, _version) {
  var gridOffset = grid.offset;
  var startPos = startPort.position;
  var endPos = endPort.position;
  var scaledStartPos = scalePosition({
    x: startPos.x + gridOffset.x,
    y: startPos.y + gridOffset.y
  });
  var scaledEndPos = scalePosition({
    x: endPos.x + gridOffset.x,
    y: endPos.y + gridOffset.y
  });

  try {
    var path = pathfinding_default.a.Util.compressPath(pathFinder.findPath(scaledStartPos.x, scaledStartPos.y, scaledEndPos.x, scaledEndPos.y, grid.pfGrid.clone()));
    if (!path.length) return fallbackPath(startPort, endPort, config);
    return scalePath(path);
  } catch (e) {
    return fallbackPath(startPort, endPort, config);
  }
}
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/ts-loader??ref--13-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Link/Wrapper.vue?vue&type=script&lang=ts&





/* harmony default export */ var Link_Wrappervue_type_script_lang_ts_ = (defineComponent({
  name: 'LinkWrapper',
  props: {
    link: {
      type: Object,
      required: true
    },
    isSelected: {
      type: Boolean,
      default: false
    },
    linkComponent: {
      type: Object,
      required: true
    }
  },
  setup: function setup(props) {
    var store = useStore();
    var graph = computed(function () {
      return store.state.graph;
    });
    var fromNode = computed(function () {
      return graph.value.nodes[props.link.from.nodeId];
    });
    var startPort = computed(function () {
      return fromNode.value.ports[props.link.from.portId];
    });
    var endPort = computed(function () {
      var link = props.link; // the link can be draft

      if (link.to && link.to.nodeId && link.to.portId) {
        var toNode = graph.value.nodes[link.to.nodeId];
        return toNode.ports[link.to.portId];
      }

      if (store.state.mousePosition) {
        var _store$state$graph = store.state.graph,
            scale = _store$state$graph.scale,
            offset = _store$state$graph.offset;
        return {
          position: {
            x: (store.state.mousePosition.x - offset.x) / scale,
            y: (store.state.mousePosition.y - offset.y) / scale
          }
        };
      }

      return null;
    });
    var path = computed(function () {
      if (endPort.value) {
        return generatePath(graph.value.grid, startPort.value, endPort.value, store.state.config, // track change
        store.state.linkVersions[props.link.id]);
      }

      return [];
    });
    watch(path, function (newPath) {
      return store.commit('updateLinkPath', {
        linkId: props.link.id,
        path: _toConsumableArray(newPath)
      });
    });

    var onLinkClick = function onLinkClick() {
      store.dispatch('selectLink', props.link.id);
    };

    return {
      startPort: startPort,
      endPort: endPort,
      path: path,
      onLinkClick: onLinkClick
    };
  }
}));
// CONCATENATED MODULE: ./src/components/Link/Wrapper.vue?vue&type=script&lang=ts&
 /* harmony default export */ var components_Link_Wrappervue_type_script_lang_ts_ = (Link_Wrappervue_type_script_lang_ts_); 
// CONCATENATED MODULE: ./src/components/Link/Wrapper.vue





/* normalize component */

var Link_Wrapper_component = normalizeComponent(
  components_Link_Wrappervue_type_script_lang_ts_,
  Wrappervue_type_template_id_2f7e3acc_render,
  Wrappervue_type_template_id_2f7e3acc_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var Link_Wrapper = (Link_Wrapper_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"73b8e84c-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Link/Default.vue?vue&type=template&id=4fb5c594&
var Defaultvue_type_template_id_4fb5c594_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"link"},[_c('circle',{attrs:{"cx":_vm.startPos.x,"cy":_vm.startPos.y,"r":"4"}}),_c('path',{attrs:{"d":_vm.pathCommands,"stroke":"blue","strokeWidth":"3","fill":"none"}}),_c('circle',{attrs:{"cx":_vm.endPos.x,"cy":_vm.endPos.y,"r":"4"}})])}
var Defaultvue_type_template_id_4fb5c594_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/Link/Default.vue?vue&type=template&id=4fb5c594&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/ts-loader??ref--13-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Link/Default.vue?vue&type=script&lang=ts&








function generatePathCommands(path, grid) {
  if (!path.length) return '';
  var _grid$offset = grid.offset,
      gridOffsetX = _grid$offset.x,
      gridOffsetY = _grid$offset.y;

  var _path = _toArray(path),
      first = _path[0],
      rest = _path.slice(1);

  return rest.reduce(function (acc, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        x = _ref2[0],
        y = _ref2[1];

    return "".concat(acc, " L").concat(x - gridOffsetX, " ").concat(y - gridOffsetY);
  }, "M".concat(first[0] - gridOffsetX, " ").concat(first[1] - gridOffsetY));
}

/* harmony default export */ var Link_Defaultvue_type_script_lang_ts_ = (defineComponent({
  name: 'LinkDefault',
  props: {
    link: {
      type: Object,
      required: true
    },
    startPos: {
      type: Object,
      required: true
    },
    endPos: {
      type: Object,
      required: true
    },
    path: {
      type: Array,
      required: true
    }
  },
  setup: function setup(props) {
    var store = useStore();
    var pathCommands = computed(function () {
      return generatePathCommands(props.path, store.state.graph.grid);
    });
    return {
      pathCommands: pathCommands
    };
  }
}));
// CONCATENATED MODULE: ./src/components/Link/Default.vue?vue&type=script&lang=ts&
 /* harmony default export */ var components_Link_Defaultvue_type_script_lang_ts_ = (Link_Defaultvue_type_script_lang_ts_); 
// EXTERNAL MODULE: ./src/components/Link/Default.vue?vue&type=style&index=0&lang=scss&
var Link_Defaultvue_type_style_index_0_lang_scss_ = __webpack_require__("e021");

// CONCATENATED MODULE: ./src/components/Link/Default.vue






/* normalize component */

var Link_Default_component = normalizeComponent(
  components_Link_Defaultvue_type_script_lang_ts_,
  Defaultvue_type_template_id_4fb5c594_render,
  Defaultvue_type_template_id_4fb5c594_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var Link_Default = (Link_Default_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/ts-loader??ref--13-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Flowchart/Flowchart.vue?vue&type=script&lang=ts&












/* harmony default export */ var Flowchartvue_type_script_lang_ts_ = (defineComponent({
  name: 'Flowchart',
  components: {
    CanvasComponent: Canvas,
    NodeWrapperComponent: Node_Wrapper,
    LinkWrapperComponent: Link_Wrapper
  },
  props: {
    rawState: {
      type: Object,
      required: true
    },
    components: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    config: {
      type: Object,
      default: function _default() {
        return {};
      }
    }
  },
  setup: function setup(props) {
    var store = useStore();

    var _useState = useState(props.rawState, store),
        nodes = _useState.nodes,
        links = _useState.links;

    store.commit('updateConfig', props.config);
    var _props$components = props.components;
    _props$components = _props$components === void 0 ? {} : _props$components;
    var _props$components$nod = _props$components.node,
        nodeComponent = _props$components$nod === void 0 ? Default : _props$components$nod,
        _props$components$por = _props$components.port,
        portComponent = _props$components$por === void 0 ? Port_Default : _props$components$por,
        _props$components$lin = _props$components.link,
        linkComponent = _props$components$lin === void 0 ? Link_Default : _props$components$lin;

    function zoom(delta) {
      store.dispatch('updateScale', store.state.graph.scale + delta);
    }

    return _objectSpread2({
      nodeComponent: nodeComponent,
      portComponent: portComponent,
      linkComponent: linkComponent,
      nodes: nodes,
      links: links
    }, useSelected(store), {
      zoom: zoom
    });
  }
}));
// CONCATENATED MODULE: ./src/components/Flowchart/Flowchart.vue?vue&type=script&lang=ts&
 /* harmony default export */ var Flowchart_Flowchartvue_type_script_lang_ts_ = (Flowchartvue_type_script_lang_ts_); 
// CONCATENATED MODULE: ./src/components/Flowchart/Flowchart.vue





/* normalize component */

var Flowchart_component = normalizeComponent(
  Flowchart_Flowchartvue_type_script_lang_ts_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var Flowchart = (Flowchart_component.exports);
// CONCATENATED MODULE: ./src/index.ts

/* harmony default export */ var src_0 = (Flowchart);

// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/entry-lib.js


/* harmony default export */ var entry_lib = __webpack_exports__["default"] = (src_0);



/***/ }),

/***/ "fb19":
/***/ (function(module, exports, __webpack_require__) {

(function(t,e){ true?module.exports=e():undefined})("undefined"!==typeof self?self:this,(function(){return function(t){var e={};function n(i){if(e[i])return e[i].exports;var r=e[i]={i:i,l:!1,exports:{}};return t[i].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=t,n.c=e,n.d=function(t,e,i){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},n.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)n.d(i,r,function(e){return t[e]}.bind(null,r));return i},n.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s="fb15")}({"0029":function(t,e){t.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},"0185":function(t,e,n){var i=n("e5fa");t.exports=function(t){return Object(i(t))}},"01f9":function(t,e,n){"use strict";var i=n("2d00"),r=n("5ca1"),o=n("2aba"),a=n("32e9"),c=n("84f2"),u=n("41a0"),s=n("7f20"),f=n("38fd"),h=n("2b4c")("iterator"),l=!([].keys&&"next"in[].keys()),d="@@iterator",p="keys",m="values",g=function(){return this};t.exports=function(t,e,n,v,b,y,x){u(n,e,v);var w,S,_,O=function(t){if(!l&&t in L)return L[t];switch(t){case p:return function(){return new n(this,t)};case m:return function(){return new n(this,t)}}return function(){return new n(this,t)}},E=e+" Iterator",T=b==m,P=!1,L=t.prototype,M=L[h]||L[d]||b&&L[b],R=M||O(b),j=b?T?O("entries"):R:void 0,k="Array"==e&&L.entries||M;if(k&&(_=f(k.call(new t)),_!==Object.prototype&&_.next&&(s(_,E,!0),i||"function"==typeof _[h]||a(_,h,g))),T&&M&&M.name!==m&&(P=!0,R=function(){return M.call(this)}),i&&!x||!l&&!P&&L[h]||a(L,h,R),c[e]=R,c[E]=g,b)if(w={values:T?R:O(m),keys:y?R:O(p),entries:j},x)for(S in w)S in L||o(L,S,w[S]);else r(r.P+r.F*(l||P),e,w);return w}},"02f4":function(t,e,n){var i=n("4588"),r=n("be13");t.exports=function(t){return function(e,n){var o,a,c=String(r(e)),u=i(n),s=c.length;return u<0||u>=s?t?"":void 0:(o=c.charCodeAt(u),o<55296||o>56319||u+1===s||(a=c.charCodeAt(u+1))<56320||a>57343?t?c.charAt(u):o:t?c.slice(u,u+2):a-56320+(o-55296<<10)+65536)}}},"0a49":function(t,e,n){var i=n("9b43"),r=n("626a"),o=n("4bf8"),a=n("9def"),c=n("cd1c");t.exports=function(t,e){var n=1==t,u=2==t,s=3==t,f=4==t,h=6==t,l=5==t||h,d=e||c;return function(e,c,p){for(var m,g,v=o(e),b=r(v),y=i(c,p,3),x=a(b.length),w=0,S=n?d(e,x):u?d(e,0):void 0;x>w;w++)if((l||w in b)&&(m=b[w],g=y(m,w,v),t))if(n)S[w]=g;else if(g)switch(t){case 3:return!0;case 5:return m;case 6:return w;case 2:S.push(m)}else if(f)return!1;return h?-1:s||f?f:S}}},"0a91":function(t,e,n){n("b42c"),n("93c4"),t.exports=n("b77f")},"0bfb":function(t,e,n){"use strict";var i=n("cb7c");t.exports=function(){var t=i(this),e="";return t.global&&(e+="g"),t.ignoreCase&&(e+="i"),t.multiline&&(e+="m"),t.unicode&&(e+="u"),t.sticky&&(e+="y"),e}},"0d58":function(t,e,n){var i=n("ce10"),r=n("e11e");t.exports=Object.keys||function(t){return i(t,r)}},"0f89":function(t,e,n){var i=n("6f8a");t.exports=function(t){if(!i(t))throw TypeError(t+" is not an object!");return t}},"103a":function(t,e,n){var i=n("da3c").document;t.exports=i&&i.documentElement},1169:function(t,e,n){var i=n("2d95");t.exports=Array.isArray||function(t){return"Array"==i(t)}},"11e9":function(t,e,n){var i=n("52a7"),r=n("4630"),o=n("6821"),a=n("6a99"),c=n("69a8"),u=n("c69a"),s=Object.getOwnPropertyDescriptor;e.f=n("9e1e")?s:function(t,e){if(t=o(t),e=a(e,!0),u)try{return s(t,e)}catch(n){}if(c(t,e))return r(!i.f.call(t,e),t[e])}},"12fd":function(t,e,n){var i=n("6f8a"),r=n("da3c").document,o=i(r)&&i(r.createElement);t.exports=function(t){return o?r.createElement(t):{}}},1495:function(t,e,n){var i=n("86cc"),r=n("cb7c"),o=n("0d58");t.exports=n("9e1e")?Object.defineProperties:function(t,e){r(t);var n,a=o(e),c=a.length,u=0;while(c>u)i.f(t,n=a[u++],e[n]);return t}},1938:function(t,e,n){var i=n("d13f");i(i.S,"Array",{isArray:n("b5aa")})},"1b55":function(t,e,n){var i=n("7772")("wks"),r=n("7b00"),o=n("da3c").Symbol,a="function"==typeof o,c=t.exports=function(t){return i[t]||(i[t]=a&&o[t]||(a?o:r)("Symbol."+t))};c.store=i},"1b8f":function(t,e,n){var i=n("a812"),r=Math.max,o=Math.min;t.exports=function(t,e){return t=i(t),t<0?r(t+e,0):o(t,e)}},"1c01":function(t,e,n){var i=n("5ca1");i(i.S+i.F*!n("9e1e"),"Object",{defineProperty:n("86cc").f})},"1fa8":function(t,e,n){var i=n("cb7c");t.exports=function(t,e,n,r){try{return r?e(i(n)[0],n[1]):e(n)}catch(a){var o=t["return"];throw void 0!==o&&i(o.call(t)),a}}},"230e":function(t,e,n){var i=n("d3f4"),r=n("7726").document,o=i(r)&&i(r.createElement);t.exports=function(t){return o?r.createElement(t):{}}},2312:function(t,e,n){t.exports=n("8ce0")},"23c6":function(t,e,n){var i=n("2d95"),r=n("2b4c")("toStringTag"),o="Arguments"==i(function(){return arguments}()),a=function(t,e){try{return t[e]}catch(n){}};t.exports=function(t){var e,n,c;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(n=a(e=Object(t),r))?n:o?i(e):"Object"==(c=i(e))&&"function"==typeof e.callee?"Arguments":c}},2418:function(t,e,n){var i=n("6a9b"),r=n("a5ab"),o=n("1b8f");t.exports=function(t){return function(e,n,a){var c,u=i(e),s=r(u.length),f=o(a,s);if(t&&n!=n){while(s>f)if(c=u[f++],c!=c)return!0}else for(;s>f;f++)if((t||f in u)&&u[f]===n)return t||f||0;return!t&&-1}}},"245b":function(t,e){t.exports=function(t,e){return{value:e,done:!!t}}},2621:function(t,e){e.f=Object.getOwnPropertySymbols},2695:function(t,e,n){var i=n("43c8"),r=n("6a9b"),o=n("2418")(!1),a=n("5d8f")("IE_PROTO");t.exports=function(t,e){var n,c=r(t),u=0,s=[];for(n in c)n!=a&&i(c,n)&&s.push(n);while(e.length>u)i(c,n=e[u++])&&(~o(s,n)||s.push(n));return s}},"27ee":function(t,e,n){var i=n("23c6"),r=n("2b4c")("iterator"),o=n("84f2");t.exports=n("8378").getIteratorMethod=function(t){if(void 0!=t)return t[r]||t["@@iterator"]||o[i(t)]}},"2a4e":function(t,e,n){var i=n("a812"),r=n("e5fa");t.exports=function(t){return function(e,n){var o,a,c=String(r(e)),u=i(n),s=c.length;return u<0||u>=s?t?"":void 0:(o=c.charCodeAt(u),o<55296||o>56319||u+1===s||(a=c.charCodeAt(u+1))<56320||a>57343?t?c.charAt(u):o:t?c.slice(u,u+2):a-56320+(o-55296<<10)+65536)}}},"2aba":function(t,e,n){var i=n("7726"),r=n("32e9"),o=n("69a8"),a=n("ca5a")("src"),c="toString",u=Function[c],s=(""+u).split(c);n("8378").inspectSource=function(t){return u.call(t)},(t.exports=function(t,e,n,c){var u="function"==typeof n;u&&(o(n,"name")||r(n,"name",e)),t[e]!==n&&(u&&(o(n,a)||r(n,a,t[e]?""+t[e]:s.join(String(e)))),t===i?t[e]=n:c?t[e]?t[e]=n:r(t,e,n):(delete t[e],r(t,e,n)))})(Function.prototype,c,(function(){return"function"==typeof this&&this[a]||u.call(this)}))},"2aeb":function(t,e,n){var i=n("cb7c"),r=n("1495"),o=n("e11e"),a=n("613b")("IE_PROTO"),c=function(){},u="prototype",s=function(){var t,e=n("230e")("iframe"),i=o.length,r="<",a=">";e.style.display="none",n("fab2").appendChild(e),e.src="javascript:",t=e.contentWindow.document,t.open(),t.write(r+"script"+a+"document.F=Object"+r+"/script"+a),t.close(),s=t.F;while(i--)delete s[u][o[i]];return s()};t.exports=Object.create||function(t,e){var n;return null!==t?(c[u]=i(t),n=new c,c[u]=null,n[a]=t):n=s(),void 0===e?n:r(n,e)}},"2b4c":function(t,e,n){var i=n("5537")("wks"),r=n("ca5a"),o=n("7726").Symbol,a="function"==typeof o,c=t.exports=function(t){return i[t]||(i[t]=a&&o[t]||(a?o:r)("Symbol."+t))};c.store=i},"2d00":function(t,e){t.exports=!1},"2d95":function(t,e){var n={}.toString;t.exports=function(t){return n.call(t).slice(8,-1)}},"2ea1":function(t,e,n){var i=n("6f8a");t.exports=function(t,e){if(!i(t))return t;var n,r;if(e&&"function"==typeof(n=t.toString)&&!i(r=n.call(t)))return r;if("function"==typeof(n=t.valueOf)&&!i(r=n.call(t)))return r;if(!e&&"function"==typeof(n=t.toString)&&!i(r=n.call(t)))return r;throw TypeError("Can't convert object to primitive value")}},"2f21":function(t,e,n){"use strict";var i=n("79e5");t.exports=function(t,e){return!!t&&i((function(){e?t.call(null,(function(){}),1):t.call(null)}))}},"2fdb":function(t,e,n){"use strict";var i=n("5ca1"),r=n("d2c8"),o="includes";i(i.P+i.F*n("5147")(o),"String",{includes:function(t){return!!~r(this,t,o).indexOf(t,arguments.length>1?arguments[1]:void 0)}})},"32e9":function(t,e,n){var i=n("86cc"),r=n("4630");t.exports=n("9e1e")?function(t,e,n){return i.f(t,e,r(1,n))}:function(t,e,n){return t[e]=n,t}},"33a4":function(t,e,n){var i=n("84f2"),r=n("2b4c")("iterator"),o=Array.prototype;t.exports=function(t){return void 0!==t&&(i.Array===t||o[r]===t)}},3425:function(t,e,n){"use strict";var i=function(){var t,e=this,n=e.$createElement,i=e._self._c||n;return i("div",{class:[(t={},t[e.classNameActive]=e.enabled,t[e.classNameDragging]=e.dragging,t[e.classNameResizing]=e.resizing,t[e.classNameDraggable]=e.draggable,t[e.classNameResizable]=e.resizable,t),e.className],style:e.style,on:{mousedown:e.elementMouseDown,touchstart:e.elementTouchDown}},[e._l(e.actualHandles,(function(t){return i("div",{key:t,class:[e.classNameHandle,e.classNameHandle+"-"+t],style:{display:e.enabled?"block":"none"},on:{mousedown:function(n){n.stopPropagation(),n.preventDefault(),e.handleDown(t,n)},touchstart:function(n){n.stopPropagation(),n.preventDefault(),e.handleTouchDown(t,n)}}},[e._t(t)],2)})),e._v(" "),e._t("default")],2)},r=[],o=(n("1c01"),n("58b2"),n("8e6e"),n("f3e2"),n("456d"),n("85f2")),a=n.n(o);function c(t,e,n){return e in t?a()(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}n("3b2b");var u=n("a745"),s=n.n(u);function f(t){if(s()(t))return t}var h=n("5d73"),l=n.n(h),d=n("c8bb"),p=n.n(d);function m(t,e){if(p()(Object(t))||"[object Arguments]"===Object.prototype.toString.call(t)){var n=[],i=!0,r=!1,o=void 0;try{for(var a,c=l()(t);!(i=(a=c.next()).done);i=!0)if(n.push(a.value),e&&n.length===e)break}catch(u){r=!0,o=u}finally{try{i||null==c["return"]||c["return"]()}finally{if(r)throw o}}return n}}function g(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}function v(t,e){return f(t)||m(t,e)||g()}n("6762"),n("2fdb"),n("d25f"),n("ac6a"),n("cadf"),n("5df3"),n("4f7f"),n("c5f6"),n("7514"),n("6b54"),n("87b3");function b(t){return"function"===typeof t||"[object Function]"===Object.prototype.toString.call(t)}function y(t,e,n){var i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:1,r=Math.round(e/i/t[0])*t[0],o=Math.round(n/i/t[1])*t[1];return[r,o]}function x(t,e,n){return t-e-n}function w(t,e,n){return t-e-n}function S(t,e,n){return null!==e&&t<e?e:null!==n&&n<t?n:t}function _(t,e,n){var i=t,r=["matches","webkitMatchesSelector","mozMatchesSelector","msMatchesSelector","oMatchesSelector"].find((function(t){return b(i[t])}));if(!b(i[r]))return!1;do{if(i[r](e))return!0;if(i===n)return!1;i=i.parentNode}while(i);return!1}function O(t){var e=window.getComputedStyle(t);return[parseFloat(e.getPropertyValue("width"),10),parseFloat(e.getPropertyValue("height"),10)]}function E(t,e,n){t&&(t.attachEvent?t.attachEvent("on"+e,n):t.addEventListener?t.addEventListener(e,n,!0):t["on"+e]=n)}function T(t,e,n){t&&(t.detachEvent?t.detachEvent("on"+e,n):t.removeEventListener?t.removeEventListener(e,n,!0):t["on"+e]=null)}function P(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);e&&(i=i.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,i)}return n}function L(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?P(n,!0).forEach((function(e){c(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):P(n).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}var M={mouse:{start:"mousedown",move:"mousemove",stop:"mouseup"},touch:{start:"touchstart",move:"touchmove",stop:"touchend"}},R={userSelect:"none",MozUserSelect:"none",WebkitUserSelect:"none",MsUserSelect:"none"},j={userSelect:"auto",MozUserSelect:"auto",WebkitUserSelect:"auto",MsUserSelect:"auto"},k=M.mouse,A={replace:!0,name:"vue-draggable-resizable",props:{className:{type:String,default:"vdr"},classNameDraggable:{type:String,default:"draggable"},classNameResizable:{type:String,default:"resizable"},classNameDragging:{type:String,default:"dragging"},classNameResizing:{type:String,default:"resizing"},classNameActive:{type:String,default:"active"},classNameHandle:{type:String,default:"handle"},disableUserSelect:{type:Boolean,default:!0},enableNativeDrag:{type:Boolean,default:!1},preventDeactivation:{type:Boolean,default:!1},active:{type:Boolean,default:!1},draggable:{type:Boolean,default:!0},resizable:{type:Boolean,default:!0},lockAspectRatio:{type:Boolean,default:!1},w:{type:[Number,String],default:200,validator:function(t){return"number"===typeof t?t>0:"auto"===t}},h:{type:[Number,String],default:200,validator:function(t){return"number"===typeof t?t>0:"auto"===t}},minWidth:{type:Number,default:0,validator:function(t){return t>=0}},minHeight:{type:Number,default:0,validator:function(t){return t>=0}},maxWidth:{type:Number,default:null,validator:function(t){return t>=0}},maxHeight:{type:Number,default:null,validator:function(t){return t>=0}},x:{type:Number,default:0},y:{type:Number,default:0},z:{type:[String,Number],default:"auto",validator:function(t){return"string"===typeof t?"auto"===t:t>=0}},handles:{type:Array,default:function(){return["tl","tm","tr","mr","br","bm","bl","ml"]},validator:function(t){var e=new Set(["tl","tm","tr","mr","br","bm","bl","ml"]);return new Set(t.filter((function(t){return e.has(t)}))).size===t.length}},dragHandle:{type:String,default:null},dragCancel:{type:String,default:null},axis:{type:String,default:"both",validator:function(t){return["x","y","both"].includes(t)}},grid:{type:Array,default:function(){return[1,1]}},parent:{type:Boolean,default:!1},scale:{type:Number,default:1,validator:function(t){return t>0}},onDragStart:{type:Function,default:function(){return!0}},onDrag:{type:Function,default:function(){return!0}},onResizeStart:{type:Function,default:function(){return!0}},onResize:{type:Function,default:function(){return!0}}},data:function(){return{left:this.x,top:this.y,right:null,bottom:null,width:null,height:null,widthTouched:!1,heightTouched:!1,aspectFactor:null,parentWidth:null,parentHeight:null,minW:this.minWidth,minH:this.minHeight,maxW:this.maxWidth,maxH:this.maxHeight,handle:null,enabled:this.active,resizing:!1,dragging:!1,zIndex:this.z}},created:function(){this.maxWidth&&this.minWidth>this.maxWidth&&console.warn("[Vdr warn]: Invalid prop: minWidth cannot be greater than maxWidth"),this.maxWidth&&this.minHeight>this.maxHeight&&console.warn("[Vdr warn]: Invalid prop: minHeight cannot be greater than maxHeight"),this.resetBoundsAndMouseState()},mounted:function(){this.enableNativeDrag||(this.$el.ondragstart=function(){return!1});var t=this.getParentSize(),e=v(t,2),n=e[0],i=e[1];this.parentWidth=n,this.parentHeight=i;var r=O(this.$el),o=v(r,2),a=o[0],c=o[1];this.aspectFactor=("auto"!==this.w?this.w:a)/("auto"!==this.h?this.h:c),this.width="auto"!==this.w?this.w:a,this.height="auto"!==this.h?this.h:c,this.right=this.parentWidth-this.width-this.left,this.bottom=this.parentHeight-this.height-this.top,E(document.documentElement,"mousedown",this.deselect),E(document.documentElement,"touchend touchcancel",this.deselect),E(window,"resize",this.checkParentSize)},beforeDestroy:function(){T(document.documentElement,"mousedown",this.deselect),T(document.documentElement,"touchstart",this.handleUp),T(document.documentElement,"mousemove",this.move),T(document.documentElement,"touchmove",this.move),T(document.documentElement,"mouseup",this.handleUp),T(document.documentElement,"touchend touchcancel",this.deselect),T(window,"resize",this.checkParentSize)},methods:{resetBoundsAndMouseState:function(){this.mouseClickPosition={mouseX:0,mouseY:0,x:0,y:0,w:0,h:0},this.bounds={minLeft:null,maxLeft:null,minRight:null,maxRight:null,minTop:null,maxTop:null,minBottom:null,maxBottom:null}},checkParentSize:function(){if(this.parent){var t=this.getParentSize(),e=v(t,2),n=e[0],i=e[1];this.parentWidth=n,this.parentHeight=i}},getParentSize:function(){if(this.parent){var t=window.getComputedStyle(this.$el.parentNode,null);return[parseInt(t.getPropertyValue("width"),10),parseInt(t.getPropertyValue("height"),10)]}return[null,null]},elementTouchDown:function(t){k=M.touch,this.elementDown(t)},elementMouseDown:function(t){k=M.mouse,this.elementDown(t)},elementDown:function(t){if(!(t instanceof MouseEvent&&1!==t.which)){var e=t.target||t.srcElement;if(this.$el.contains(e)){if(!1===this.onDragStart(t))return;if(this.dragHandle&&!_(e,this.dragHandle,this.$el)||this.dragCancel&&_(e,this.dragCancel,this.$el))return void(this.dragging=!1);this.enabled||(this.enabled=!0,this.$emit("activated"),this.$emit("update:active",!0)),this.draggable&&(this.dragging=!0),this.mouseClickPosition.mouseX=t.touches?t.touches[0].pageX:t.pageX,this.mouseClickPosition.mouseY=t.touches?t.touches[0].pageY:t.pageY,this.mouseClickPosition.left=this.left,this.mouseClickPosition.right=this.right,this.mouseClickPosition.top=this.top,this.mouseClickPosition.bottom=this.bottom,this.parent&&(this.bounds=this.calcDragLimits()),E(document.documentElement,k.move,this.move),E(document.documentElement,k.stop,this.handleUp)}}},calcDragLimits:function(){return{minLeft:this.left%this.grid[0],maxLeft:Math.floor((this.parentWidth-this.width-this.left)/this.grid[0])*this.grid[0]+this.left,minRight:this.right%this.grid[0],maxRight:Math.floor((this.parentWidth-this.width-this.right)/this.grid[0])*this.grid[0]+this.right,minTop:this.top%this.grid[1],maxTop:Math.floor((this.parentHeight-this.height-this.top)/this.grid[1])*this.grid[1]+this.top,minBottom:this.bottom%this.grid[1],maxBottom:Math.floor((this.parentHeight-this.height-this.bottom)/this.grid[1])*this.grid[1]+this.bottom}},deselect:function(t){var e=t.target||t.srcElement,n=new RegExp(this.className+"-([trmbl]{2})","");this.$el.contains(e)||n.test(e.className)||(this.enabled&&!this.preventDeactivation&&(this.enabled=!1,this.$emit("deactivated"),this.$emit("update:active",!1)),T(document.documentElement,k.move,this.handleResize)),this.resetBoundsAndMouseState()},handleTouchDown:function(t,e){k=M.touch,this.handleDown(t,e)},handleDown:function(t,e){e instanceof MouseEvent&&1!==e.which||!1!==this.onResizeStart(t,e)&&(e.stopPropagation&&e.stopPropagation(),this.lockAspectRatio&&!t.includes("m")?this.handle="m"+t.substring(1):this.handle=t,this.resizing=!0,this.mouseClickPosition.mouseX=e.touches?e.touches[0].pageX:e.pageX,this.mouseClickPosition.mouseY=e.touches?e.touches[0].pageY:e.pageY,this.mouseClickPosition.left=this.left,this.mouseClickPosition.right=this.right,this.mouseClickPosition.top=this.top,this.mouseClickPosition.bottom=this.bottom,this.bounds=this.calcResizeLimits(),E(document.documentElement,k.move,this.handleResize),E(document.documentElement,k.stop,this.handleUp))},calcResizeLimits:function(){var t=this.minW,e=this.minH,n=this.maxW,i=this.maxH,r=this.aspectFactor,o=v(this.grid,2),a=o[0],c=o[1],u=this.width,s=this.height,f=this.left,h=this.top,l=this.right,d=this.bottom;this.lockAspectRatio&&(t/e>r?e=t/r:t=r*e,n&&i?(n=Math.min(n,r*i),i=Math.min(i,n/r)):n?i=n/r:i&&(n=r*i)),n-=n%a,i-=i%c;var p={minLeft:null,maxLeft:null,minTop:null,maxTop:null,minRight:null,maxRight:null,minBottom:null,maxBottom:null};return this.parent?(p.minLeft=f%a,p.maxLeft=f+Math.floor((u-t)/a)*a,p.minTop=h%c,p.maxTop=h+Math.floor((s-e)/c)*c,p.minRight=l%a,p.maxRight=l+Math.floor((u-t)/a)*a,p.minBottom=d%c,p.maxBottom=d+Math.floor((s-e)/c)*c,n&&(p.minLeft=Math.max(p.minLeft,this.parentWidth-l-n),p.minRight=Math.max(p.minRight,this.parentWidth-f-n)),i&&(p.minTop=Math.max(p.minTop,this.parentHeight-d-i),p.minBottom=Math.max(p.minBottom,this.parentHeight-h-i)),this.lockAspectRatio&&(p.minLeft=Math.max(p.minLeft,f-h*r),p.minTop=Math.max(p.minTop,h-f/r),p.minRight=Math.max(p.minRight,l-d*r),p.minBottom=Math.max(p.minBottom,d-l/r))):(p.minLeft=null,p.maxLeft=f+Math.floor((u-t)/a)*a,p.minTop=null,p.maxTop=h+Math.floor((s-e)/c)*c,p.minRight=null,p.maxRight=l+Math.floor((u-t)/a)*a,p.minBottom=null,p.maxBottom=d+Math.floor((s-e)/c)*c,n&&(p.minLeft=-(l+n),p.minRight=-(f+n)),i&&(p.minTop=-(d+i),p.minBottom=-(h+i)),this.lockAspectRatio&&n&&i&&(p.minLeft=Math.min(p.minLeft,-(l+n)),p.minTop=Math.min(p.minTop,-(i+d)),p.minRight=Math.min(p.minRight,-f-n),p.minBottom=Math.min(p.minBottom,-h-i))),p},move:function(t){this.resizing?this.handleResize(t):this.dragging&&this.handleDrag(t)},handleDrag:function(t){var e=this.axis,n=this.grid,i=this.bounds,r=this.mouseClickPosition,o=e&&"y"!==e?r.mouseX-(t.touches?t.touches[0].pageX:t.pageX):0,a=e&&"x"!==e?r.mouseY-(t.touches?t.touches[0].pageY:t.pageY):0,c=y(n,o,a,this.scale),u=v(c,2),s=u[0],f=u[1],h=S(r.left-s,i.minLeft,i.maxLeft),l=S(r.top-f,i.minTop,i.maxTop);if(!1!==this.onDrag(h,l)){var d=S(r.right+s,i.minRight,i.maxRight),p=S(r.bottom+f,i.minBottom,i.maxBottom);this.left=h,this.top=l,this.right=d,this.bottom=p,this.$emit("dragging",this.left,this.top)}},moveHorizontally:function(t){var e=y(this.grid,t,this.top,this.scale),n=v(e,2),i=n[0],r=(n[1],S(i,this.bounds.minLeft,this.bounds.maxLeft));this.left=r,this.right=this.parentWidth-this.width-r},moveVertically:function(t){var e=y(this.grid,this.left,t,this.scale),n=v(e,2),i=(n[0],n[1]),r=S(i,this.bounds.minTop,this.bounds.maxTop);this.top=r,this.bottom=this.parentHeight-this.height-r},handleResize:function(t){var e=this.left,n=this.top,i=this.right,r=this.bottom,o=this.mouseClickPosition,a=(this.lockAspectRatio,this.aspectFactor),c=o.mouseX-(t.touches?t.touches[0].pageX:t.pageX),u=o.mouseY-(t.touches?t.touches[0].pageY:t.pageY);!this.widthTouched&&c&&(this.widthTouched=!0),!this.heightTouched&&u&&(this.heightTouched=!0);var s=y(this.grid,c,u,this.scale),f=v(s,2),h=f[0],l=f[1];this.handle.includes("b")?(r=S(o.bottom+l,this.bounds.minBottom,this.bounds.maxBottom),this.lockAspectRatio&&this.resizingOnY&&(i=this.right-(this.bottom-r)*a)):this.handle.includes("t")&&(n=S(o.top-l,this.bounds.minTop,this.bounds.maxTop),this.lockAspectRatio&&this.resizingOnY&&(e=this.left-(this.top-n)*a)),this.handle.includes("r")?(i=S(o.right+h,this.bounds.minRight,this.bounds.maxRight),this.lockAspectRatio&&this.resizingOnX&&(r=this.bottom-(this.right-i)/a)):this.handle.includes("l")&&(e=S(o.left-h,this.bounds.minLeft,this.bounds.maxLeft),this.lockAspectRatio&&this.resizingOnX&&(n=this.top-(this.left-e)/a));var d=x(this.parentWidth,e,i),p=w(this.parentHeight,n,r);!1!==this.onResize(this.handle,e,n,d,p)&&(this.left=e,this.top=n,this.right=i,this.bottom=r,this.width=d,this.height=p,this.$emit("resizing",this.left,this.top,this.width,this.height))},changeWidth:function(t){var e=y(this.grid,t,0,this.scale),n=v(e,2),i=n[0],r=(n[1],S(this.parentWidth-i-this.left,this.bounds.minRight,this.bounds.maxRight)),o=this.bottom;this.lockAspectRatio&&(o=this.bottom-(this.right-r)/this.aspectFactor);var a=x(this.parentWidth,this.left,r),c=w(this.parentHeight,this.top,o);this.right=r,this.bottom=o,this.width=a,this.height=c},changeHeight:function(t){var e=y(this.grid,0,t,this.scale),n=v(e,2),i=(n[0],n[1]),r=S(this.parentHeight-i-this.top,this.bounds.minBottom,this.bounds.maxBottom),o=this.right;this.lockAspectRatio&&(o=this.right-(this.bottom-r)*this.aspectFactor);var a=x(this.parentWidth,this.left,o),c=w(this.parentHeight,this.top,r);this.right=o,this.bottom=r,this.width=a,this.height=c},handleUp:function(t){this.handle=null,this.resetBoundsAndMouseState(),this.resizing&&(this.resizing=!1,this.$emit("resizestop",this.left,this.top,this.width,this.height)),this.dragging&&(this.dragging=!1,this.$emit("dragstop",this.left,this.top)),T(document.documentElement,k.move,this.handleResize)}},computed:{style:function(){return L({transform:"translate(".concat(this.left,"px, ").concat(this.top,"px)"),width:this.computedWidth,height:this.computedHeight,zIndex:this.zIndex},this.dragging&&this.disableUserSelect?R:j)},actualHandles:function(){return this.resizable?this.handles:[]},computedWidth:function(){return"auto"!==this.w||this.widthTouched?this.width+"px":"auto"},computedHeight:function(){return"auto"!==this.h||this.heightTouched?this.height+"px":"auto"},resizingOnX:function(){return Boolean(this.handle)&&(this.handle.includes("l")||this.handle.includes("r"))},resizingOnY:function(){return Boolean(this.handle)&&(this.handle.includes("t")||this.handle.includes("b"))},isCornerHandle:function(){return Boolean(this.handle)&&["tl","tr","br","bl"].includes(this.handle)}},watch:{active:function(t){this.enabled=t,t?this.$emit("activated"):this.$emit("deactivated")},z:function(t){(t>=0||"auto"===t)&&(this.zIndex=t)},x:function(t){this.resizing||this.dragging||(this.parent&&(this.bounds=this.calcDragLimits()),this.moveHorizontally(t))},y:function(t){this.resizing||this.dragging||(this.parent&&(this.bounds=this.calcDragLimits()),this.moveVertically(t))},lockAspectRatio:function(t){this.aspectFactor=t?this.width/this.height:void 0},minWidth:function(t){t>0&&t<=this.width&&(this.minW=t)},minHeight:function(t){t>0&&t<=this.height&&(this.minH=t)},maxWidth:function(t){this.maxW=t},maxHeight:function(t){this.maxH=t},w:function(t){this.resizing||this.dragging||(this.parent&&(this.bounds=this.calcResizeLimits()),this.changeWidth(t))},h:function(t){this.resizing||this.dragging||(this.parent&&(this.bounds=this.calcResizeLimits()),this.changeHeight(t))}}},N=A;function z(t,e,n,i,r,o,a,c){var u,s="function"===typeof t?t.options:t;if(e&&(s.render=e,s.staticRenderFns=n,s._compiled=!0),i&&(s.functional=!0),o&&(s._scopeId="data-v-"+o),a?(u=function(t){t=t||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext,t||"undefined"===typeof __VUE_SSR_CONTEXT__||(t=__VUE_SSR_CONTEXT__),r&&r.call(this,t),t&&t._registeredComponents&&t._registeredComponents.add(a)},s._ssrRegister=u):r&&(u=c?function(){r.call(this,this.$root.$options.shadowRoot)}:r),u)if(s.functional){s._injectStyles=u;var f=s.render;s.render=function(t,e){return u.call(e),f(t,e)}}else{var h=s.beforeCreate;s.beforeCreate=h?[].concat(h,u):[u]}return{exports:t,options:s}}var D=z(N,i,r,!1,null,null,null);e["a"]=D.exports},3846:function(t,e,n){n("9e1e")&&"g"!=/./g.flags&&n("86cc").f(RegExp.prototype,"flags",{configurable:!0,get:n("0bfb")})},"38fd":function(t,e,n){var i=n("69a8"),r=n("4bf8"),o=n("613b")("IE_PROTO"),a=Object.prototype;t.exports=Object.getPrototypeOf||function(t){return t=r(t),i(t,o)?t[o]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?a:null}},"3adc":function(t,e,n){var i=n("0f89"),r=n("a47f"),o=n("2ea1"),a=Object.defineProperty;e.f=n("7d95")?Object.defineProperty:function(t,e,n){if(i(t),e=o(e,!0),i(n),r)try{return a(t,e,n)}catch(c){}if("get"in n||"set"in n)throw TypeError("Accessors not supported!");return"value"in n&&(t[e]=n.value),t}},"3b2b":function(t,e,n){var i=n("7726"),r=n("5dbc"),o=n("86cc").f,a=n("9093").f,c=n("aae3"),u=n("0bfb"),s=i.RegExp,f=s,h=s.prototype,l=/a/g,d=/a/g,p=new s(l)!==l;if(n("9e1e")&&(!p||n("79e5")((function(){return d[n("2b4c")("match")]=!1,s(l)!=l||s(d)==d||"/a/i"!=s(l,"i")})))){s=function(t,e){var n=this instanceof s,i=c(t),o=void 0===e;return!n&&i&&t.constructor===s&&o?t:r(p?new f(i&&!o?t.source:t,e):f((i=t instanceof s)?t.source:t,i&&o?u.call(t):e),n?this:h,s)};for(var m=function(t){t in s||o(s,t,{configurable:!0,get:function(){return f[t]},set:function(e){f[t]=e}})},g=a(f),v=0;g.length>v;)m(g[v++]);h.constructor=s,s.prototype=h,n("2aba")(i,"RegExp",s)}n("7a56")("RegExp")},"41a0":function(t,e,n){"use strict";var i=n("2aeb"),r=n("4630"),o=n("7f20"),a={};n("32e9")(a,n("2b4c")("iterator"),(function(){return this})),t.exports=function(t,e,n){t.prototype=i(a,{next:r(1,n)}),o(t,e+" Iterator")}},"43c8":function(t,e){var n={}.hasOwnProperty;t.exports=function(t,e){return n.call(t,e)}},"456d":function(t,e,n){var i=n("4bf8"),r=n("0d58");n("5eda")("keys",(function(){return function(t){return r(i(t))}}))},4588:function(t,e){var n=Math.ceil,i=Math.floor;t.exports=function(t){return isNaN(t=+t)?0:(t>0?i:n)(t)}},4630:function(t,e){t.exports=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}}},"4a59":function(t,e,n){var i=n("9b43"),r=n("1fa8"),o=n("33a4"),a=n("cb7c"),c=n("9def"),u=n("27ee"),s={},f={};e=t.exports=function(t,e,n,h,l){var d,p,m,g,v=l?function(){return t}:u(t),b=i(n,h,e?2:1),y=0;if("function"!=typeof v)throw TypeError(t+" is not iterable!");if(o(v)){for(d=c(t.length);d>y;y++)if(g=e?b(a(p=t[y])[0],p[1]):b(t[y]),g===s||g===f)return g}else for(m=v.call(t);!(p=m.next()).done;)if(g=r(m,b,p.value,e),g===s||g===f)return g};e.BREAK=s,e.RETURN=f},"4bf8":function(t,e,n){var i=n("be13");t.exports=function(t){return Object(i(t))}},"4f7f":function(t,e,n){"use strict";var i=n("c26b"),r=n("b39a"),o="Set";t.exports=n("e0b8")(o,(function(t){return function(){return t(this,arguments.length>0?arguments[0]:void 0)}}),{add:function(t){return i.def(r(this,o),t=0===t?0:t,t)}},i)},5147:function(t,e,n){var i=n("2b4c")("match");t.exports=function(t){var e=/./;try{"/./"[t](e)}catch(n){try{return e[i]=!1,!"/./"[t](e)}catch(r){}}return!0}},"52a7":function(t,e){e.f={}.propertyIsEnumerable},5537:function(t,e,n){var i=n("8378"),r=n("7726"),o="__core-js_shared__",a=r[o]||(r[o]={});(t.exports=function(t,e){return a[t]||(a[t]=void 0!==e?e:{})})("versions",[]).push({version:i.version,mode:n("2d00")?"pure":"global",copyright:"© 2018 Denis Pushkarev (zloirock.ru)"})},"58b2":function(t,e,n){var i=n("5ca1");i(i.S+i.F*!n("9e1e"),"Object",{defineProperties:n("1495")})},"5ca1":function(t,e,n){var i=n("7726"),r=n("8378"),o=n("32e9"),a=n("2aba"),c=n("9b43"),u="prototype",s=function(t,e,n){var f,h,l,d,p=t&s.F,m=t&s.G,g=t&s.S,v=t&s.P,b=t&s.B,y=m?i:g?i[e]||(i[e]={}):(i[e]||{})[u],x=m?r:r[e]||(r[e]={}),w=x[u]||(x[u]={});for(f in m&&(n=e),n)h=!p&&y&&void 0!==y[f],l=(h?y:n)[f],d=b&&h?c(l,i):v&&"function"==typeof l?c(Function.call,l):l,y&&a(y,f,l,t&s.U),x[f]!=l&&o(x,f,d),v&&w[f]!=l&&(w[f]=l)};i.core=r,s.F=1,s.G=2,s.S=4,s.P=8,s.B=16,s.W=32,s.U=64,s.R=128,t.exports=s},"5cc5":function(t,e,n){var i=n("2b4c")("iterator"),r=!1;try{var o=[7][i]();o["return"]=function(){r=!0},Array.from(o,(function(){throw 2}))}catch(a){}t.exports=function(t,e){if(!e&&!r)return!1;var n=!1;try{var o=[7],c=o[i]();c.next=function(){return{done:n=!0}},o[i]=function(){return c},t(o)}catch(a){}return n}},"5ce7":function(t,e,n){"use strict";var i=n("7108"),r=n("f845"),o=n("c0d8"),a={};n("8ce0")(a,n("1b55")("iterator"),(function(){return this})),t.exports=function(t,e,n){t.prototype=i(a,{next:r(1,n)}),o(t,e+" Iterator")}},"5d73":function(t,e,n){t.exports=n("0a91")},"5d8f":function(t,e,n){var i=n("7772")("keys"),r=n("7b00");t.exports=function(t){return i[t]||(i[t]=r(t))}},"5dbc":function(t,e,n){var i=n("d3f4"),r=n("8b97").set;t.exports=function(t,e,n){var o,a=e.constructor;return a!==n&&"function"==typeof a&&(o=a.prototype)!==n.prototype&&i(o)&&r&&r(t,o),t}},"5df3":function(t,e,n){"use strict";var i=n("02f4")(!0);n("01f9")(String,"String",(function(t){this._t=String(t),this._i=0}),(function(){var t,e=this._t,n=this._i;return n>=e.length?{value:void 0,done:!0}:(t=i(e,n),this._i+=t.length,{value:t,done:!1})}))},"5eda":function(t,e,n){var i=n("5ca1"),r=n("8378"),o=n("79e5");t.exports=function(t,e){var n=(r.Object||{})[t]||Object[t],a={};a[t]=e(n),i(i.S+i.F*o((function(){n(1)})),"Object",a)}},"613b":function(t,e,n){var i=n("5537")("keys"),r=n("ca5a");t.exports=function(t){return i[t]||(i[t]=r(t))}},"626a":function(t,e,n){var i=n("2d95");t.exports=Object("z").propertyIsEnumerable(0)?Object:function(t){return"String"==i(t)?t.split(""):Object(t)}},6762:function(t,e,n){"use strict";var i=n("5ca1"),r=n("c366")(!0);i(i.P,"Array",{includes:function(t){return r(this,t,arguments.length>1?arguments[1]:void 0)}}),n("9c6c")("includes")},"67ab":function(t,e,n){var i=n("ca5a")("meta"),r=n("d3f4"),o=n("69a8"),a=n("86cc").f,c=0,u=Object.isExtensible||function(){return!0},s=!n("79e5")((function(){return u(Object.preventExtensions({}))})),f=function(t){a(t,i,{value:{i:"O"+ ++c,w:{}}})},h=function(t,e){if(!r(t))return"symbol"==typeof t?t:("string"==typeof t?"S":"P")+t;if(!o(t,i)){if(!u(t))return"F";if(!e)return"E";f(t)}return t[i].i},l=function(t,e){if(!o(t,i)){if(!u(t))return!0;if(!e)return!1;f(t)}return t[i].w},d=function(t){return s&&p.NEED&&u(t)&&!o(t,i)&&f(t),t},p=t.exports={KEY:i,NEED:!1,fastKey:h,getWeak:l,onFreeze:d}},6821:function(t,e,n){var i=n("626a"),r=n("be13");t.exports=function(t){return i(r(t))}},"69a8":function(t,e){var n={}.hasOwnProperty;t.exports=function(t,e){return n.call(t,e)}},"6a99":function(t,e,n){var i=n("d3f4");t.exports=function(t,e){if(!i(t))return t;var n,r;if(e&&"function"==typeof(n=t.toString)&&!i(r=n.call(t)))return r;if("function"==typeof(n=t.valueOf)&&!i(r=n.call(t)))return r;if(!e&&"function"==typeof(n=t.toString)&&!i(r=n.call(t)))return r;throw TypeError("Can't convert object to primitive value")}},"6a9b":function(t,e,n){var i=n("8bab"),r=n("e5fa");t.exports=function(t){return i(r(t))}},"6b54":function(t,e,n){"use strict";n("3846");var i=n("cb7c"),r=n("0bfb"),o=n("9e1e"),a="toString",c=/./[a],u=function(t){n("2aba")(RegExp.prototype,a,t,!0)};n("79e5")((function(){return"/a/b"!=c.call({source:"a",flags:"b"})}))?u((function(){var t=i(this);return"/".concat(t.source,"/","flags"in t?t.flags:!o&&t instanceof RegExp?r.call(t):void 0)})):c.name!=a&&u((function(){return c.call(this)}))},"6e1f":function(t,e){var n={}.toString;t.exports=function(t){return n.call(t).slice(8,-1)}},"6f42":function(t,e,n){},"6f8a":function(t,e){t.exports=function(t){return"object"===typeof t?null!==t:"function"===typeof t}},7108:function(t,e,n){var i=n("0f89"),r=n("f568"),o=n("0029"),a=n("5d8f")("IE_PROTO"),c=function(){},u="prototype",s=function(){var t,e=n("12fd")("iframe"),i=o.length,r="<",a=">";e.style.display="none",n("103a").appendChild(e),e.src="javascript:",t=e.contentWindow.document,t.open(),t.write(r+"script"+a+"document.F=Object"+r+"/script"+a),t.close(),s=t.F;while(i--)delete s[u][o[i]];return s()};t.exports=Object.create||function(t,e){var n;return null!==t?(c[u]=i(t),n=new c,c[u]=null,n[a]=t):n=s(),void 0===e?n:r(n,e)}},7514:function(t,e,n){"use strict";var i=n("5ca1"),r=n("0a49")(5),o="find",a=!0;o in[]&&Array(1)[o]((function(){a=!1})),i(i.P+i.F*a,"Array",{find:function(t){return r(this,t,arguments.length>1?arguments[1]:void 0)}}),n("9c6c")(o)},7633:function(t,e,n){var i=n("2695"),r=n("0029");t.exports=Object.keys||function(t){return i(t,r)}},7726:function(t,e){var n=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=n)},7772:function(t,e,n){var i=n("a7d3"),r=n("da3c"),o="__core-js_shared__",a=r[o]||(r[o]={});(t.exports=function(t,e){return a[t]||(a[t]=void 0!==e?e:{})})("versions",[]).push({version:i.version,mode:n("b457")?"pure":"global",copyright:"© 2019 Denis Pushkarev (zloirock.ru)"})},"77f1":function(t,e,n){var i=n("4588"),r=Math.max,o=Math.min;t.exports=function(t,e){return t=i(t),t<0?r(t+e,0):o(t,e)}},"79e5":function(t,e){t.exports=function(t){try{return!!t()}catch(e){return!0}}},"7a56":function(t,e,n){"use strict";var i=n("7726"),r=n("86cc"),o=n("9e1e"),a=n("2b4c")("species");t.exports=function(t){var e=i[t];o&&e&&!e[a]&&r.f(e,a,{configurable:!0,get:function(){return this}})}},"7b00":function(t,e){var n=0,i=Math.random();t.exports=function(t){return"Symbol(".concat(void 0===t?"":t,")_",(++n+i).toString(36))}},"7d8a":function(t,e,n){var i=n("6e1f"),r=n("1b55")("toStringTag"),o="Arguments"==i(function(){return arguments}()),a=function(t,e){try{return t[e]}catch(n){}};t.exports=function(t){var e,n,c;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(n=a(e=Object(t),r))?n:o?i(e):"Object"==(c=i(e))&&"function"==typeof e.callee?"Arguments":c}},"7d95":function(t,e,n){t.exports=!n("d782")((function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a}))},"7f20":function(t,e,n){var i=n("86cc").f,r=n("69a8"),o=n("2b4c")("toStringTag");t.exports=function(t,e,n){t&&!r(t=n?t:t.prototype,o)&&i(t,o,{configurable:!0,value:e})}},8378:function(t,e){var n=t.exports={version:"2.6.1"};"number"==typeof __e&&(__e=n)},"84f2":function(t,e){t.exports={}},"85f2":function(t,e,n){t.exports=n("ec5b")},"86cc":function(t,e,n){var i=n("cb7c"),r=n("c69a"),o=n("6a99"),a=Object.defineProperty;e.f=n("9e1e")?Object.defineProperty:function(t,e,n){if(i(t),e=o(e,!0),i(n),r)try{return a(t,e,n)}catch(c){}if("get"in n||"set"in n)throw TypeError("Accessors not supported!");return"value"in n&&(t[e]=n.value),t}},"87b3":function(t,e,n){var i=Date.prototype,r="Invalid Date",o="toString",a=i[o],c=i.getTime;new Date(NaN)+""!=r&&n("2aba")(i,o,(function(){var t=c.call(this);return t===t?a.call(this):r}))},8875:function(t,e,n){var i,r,o;(function(n,a){r=[],i=a,o="function"===typeof i?i.apply(e,r):i,void 0===o||(t.exports=o)})("undefined"!==typeof self&&self,(function(){function t(){if(document.currentScript)return document.currentScript;try{throw new Error}catch(h){var t,e,n,i=/.*at [^(]*\((.*):(.+):(.+)\)$/gi,r=/@([^@]*):(\d+):(\d+)\s*$/gi,o=i.exec(h.stack)||r.exec(h.stack),a=o&&o[1]||!1,c=o&&o[2]||!1,u=document.location.href.replace(document.location.hash,""),s=document.getElementsByTagName("script");a===u&&(t=document.documentElement.outerHTML,e=new RegExp("(?:[^\\n]+?\\n){0,"+(c-2)+"}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*","i"),n=t.replace(e,"$1").trim());for(var f=0;f<s.length;f++){if("interactive"===s[f].readyState)return s[f];if(s[f].src===a)return s[f];if(a===u&&s[f].innerHTML&&s[f].innerHTML.trim()===n)return s[f]}return null}}return t}))},"89ca":function(t,e,n){n("b42c"),n("93c4"),t.exports=n("d38f")},"8b97":function(t,e,n){var i=n("d3f4"),r=n("cb7c"),o=function(t,e){if(r(t),!i(e)&&null!==e)throw TypeError(e+": can't set as prototype!")};t.exports={set:Object.setPrototypeOf||("__proto__"in{}?function(t,e,i){try{i=n("9b43")(Function.call,n("11e9").f(Object.prototype,"__proto__").set,2),i(t,[]),e=!(t instanceof Array)}catch(r){e=!0}return function(t,n){return o(t,n),e?t.__proto__=n:i(t,n),t}}({},!1):void 0),check:o}},"8bab":function(t,e,n){var i=n("6e1f");t.exports=Object("z").propertyIsEnumerable(0)?Object:function(t){return"String"==i(t)?t.split(""):Object(t)}},"8ce0":function(t,e,n){var i=n("3adc"),r=n("f845");t.exports=n("7d95")?function(t,e,n){return i.f(t,e,r(1,n))}:function(t,e,n){return t[e]=n,t}},"8e6e":function(t,e,n){var i=n("5ca1"),r=n("990b"),o=n("6821"),a=n("11e9"),c=n("f1ae");i(i.S,"Object",{getOwnPropertyDescriptors:function(t){var e,n,i=o(t),u=a.f,s=r(i),f={},h=0;while(s.length>h)n=u(i,e=s[h++]),void 0!==n&&c(f,e,n);return f}})},9093:function(t,e,n){var i=n("ce10"),r=n("e11e").concat("length","prototype");e.f=Object.getOwnPropertyNames||function(t){return i(t,r)}},"93c4":function(t,e,n){"use strict";var i=n("2a4e")(!0);n("e4a9")(String,"String",(function(t){this._t=String(t),this._i=0}),(function(){var t,e=this._t,n=this._i;return n>=e.length?{value:void 0,done:!0}:(t=i(e,n),this._i+=t.length,{value:t,done:!1})}))},"990b":function(t,e,n){var i=n("9093"),r=n("2621"),o=n("cb7c"),a=n("7726").Reflect;t.exports=a&&a.ownKeys||function(t){var e=i.f(o(t)),n=r.f;return n?e.concat(n(t)):e}},"9b43":function(t,e,n){var i=n("d8e8");t.exports=function(t,e,n){if(i(t),void 0===e)return t;switch(n){case 1:return function(n){return t.call(e,n)};case 2:return function(n,i){return t.call(e,n,i)};case 3:return function(n,i,r){return t.call(e,n,i,r)}}return function(){return t.apply(e,arguments)}}},"9c6c":function(t,e,n){var i=n("2b4c")("unscopables"),r=Array.prototype;void 0==r[i]&&n("32e9")(r,i,{}),t.exports=function(t){r[i][t]=!0}},"9def":function(t,e,n){var i=n("4588"),r=Math.min;t.exports=function(t){return t>0?r(i(t),9007199254740991):0}},"9e1e":function(t,e,n){t.exports=!n("79e5")((function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a}))},a47f:function(t,e,n){t.exports=!n("7d95")&&!n("d782")((function(){return 7!=Object.defineProperty(n("12fd")("div"),"a",{get:function(){return 7}}).a}))},a5ab:function(t,e,n){var i=n("a812"),r=Math.min;t.exports=function(t){return t>0?r(i(t),9007199254740991):0}},a745:function(t,e,n){t.exports=n("d604")},a7d3:function(t,e){var n=t.exports={version:"2.6.9"};"number"==typeof __e&&(__e=n)},a812:function(t,e){var n=Math.ceil,i=Math.floor;t.exports=function(t){return isNaN(t=+t)?0:(t>0?i:n)(t)}},aa77:function(t,e,n){var i=n("5ca1"),r=n("be13"),o=n("79e5"),a=n("fdef"),c="["+a+"]",u="​",s=RegExp("^"+c+c+"*"),f=RegExp(c+c+"*$"),h=function(t,e,n){var r={},c=o((function(){return!!a[t]()||u[t]()!=u})),s=r[t]=c?e(l):a[t];n&&(r[n]=s),i(i.P+i.F*c,"String",r)},l=h.trim=function(t,e){return t=String(r(t)),1&e&&(t=t.replace(s,"")),2&e&&(t=t.replace(f,"")),t};t.exports=h},aae3:function(t,e,n){var i=n("d3f4"),r=n("2d95"),o=n("2b4c")("match");t.exports=function(t){var e;return i(t)&&(void 0!==(e=t[o])?!!e:"RegExp"==r(t))}},ac6a:function(t,e,n){for(var i=n("cadf"),r=n("0d58"),o=n("2aba"),a=n("7726"),c=n("32e9"),u=n("84f2"),s=n("2b4c"),f=s("iterator"),h=s("toStringTag"),l=u.Array,d={CSSRuleList:!0,CSSStyleDeclaration:!1,CSSValueList:!1,ClientRectList:!1,DOMRectList:!1,DOMStringList:!1,DOMTokenList:!0,DataTransferItemList:!1,FileList:!1,HTMLAllCollection:!1,HTMLCollection:!1,HTMLFormElement:!1,HTMLSelectElement:!1,MediaList:!0,MimeTypeArray:!1,NamedNodeMap:!1,NodeList:!0,PaintRequestList:!1,Plugin:!1,PluginArray:!1,SVGLengthList:!1,SVGNumberList:!1,SVGPathSegList:!1,SVGPointList:!1,SVGStringList:!1,SVGTransformList:!1,SourceBufferList:!1,StyleSheetList:!0,TextTrackCueList:!1,TextTrackList:!1,TouchList:!1},p=r(d),m=0;m<p.length;m++){var g,v=p[m],b=d[v],y=a[v],x=y&&y.prototype;if(x&&(x[f]||c(x,f,l),x[h]||c(x,h,v),u[v]=l,b))for(g in i)x[g]||o(x,g,i[g],!0)}},b22a:function(t,e){t.exports={}},b39a:function(t,e,n){var i=n("d3f4");t.exports=function(t,e){if(!i(t)||t._t!==e)throw TypeError("Incompatible receiver, "+e+" required!");return t}},b3e7:function(t,e){t.exports=function(){}},b42c:function(t,e,n){n("fa54");for(var i=n("da3c"),r=n("8ce0"),o=n("b22a"),a=n("1b55")("toStringTag"),c="CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,TextTrackList,TouchList".split(","),u=0;u<c.length;u++){var s=c[u],f=i[s],h=f&&f.prototype;h&&!h[a]&&r(h,a,s),o[s]=o.Array}},b457:function(t,e){t.exports=!0},b5aa:function(t,e,n){var i=n("6e1f");t.exports=Array.isArray||function(t){return"Array"==i(t)}},b635:function(t,e,n){"use strict";(function(t){n.d(e,"b",(function(){return r}));n("6f42");var i=n("3425");function r(t){r.installed||(r.installed=!0,t.component("VueDraggableResizable",i["a"]))}var o={install:r},a=null;"undefined"!==typeof window?a=window.Vue:"undefined"!==typeof t&&(a=t.Vue),a&&a.use(o),e["a"]=i["a"]}).call(this,n("c8ba"))},b77f:function(t,e,n){var i=n("0f89"),r=n("f159");t.exports=n("a7d3").getIterator=function(t){var e=r(t);if("function"!=typeof e)throw TypeError(t+" is not iterable!");return i(e.call(t))}},bc25:function(t,e,n){var i=n("f2fe");t.exports=function(t,e,n){if(i(t),void 0===e)return t;switch(n){case 1:return function(n){return t.call(e,n)};case 2:return function(n,i){return t.call(e,n,i)};case 3:return function(n,i,r){return t.call(e,n,i,r)}}return function(){return t.apply(e,arguments)}}},be13:function(t,e){t.exports=function(t){if(void 0==t)throw TypeError("Can't call method on  "+t);return t}},c0d8:function(t,e,n){var i=n("3adc").f,r=n("43c8"),o=n("1b55")("toStringTag");t.exports=function(t,e,n){t&&!r(t=n?t:t.prototype,o)&&i(t,o,{configurable:!0,value:e})}},c26b:function(t,e,n){"use strict";var i=n("86cc").f,r=n("2aeb"),o=n("dcbc"),a=n("9b43"),c=n("f605"),u=n("4a59"),s=n("01f9"),f=n("d53b"),h=n("7a56"),l=n("9e1e"),d=n("67ab").fastKey,p=n("b39a"),m=l?"_s":"size",g=function(t,e){var n,i=d(e);if("F"!==i)return t._i[i];for(n=t._f;n;n=n.n)if(n.k==e)return n};t.exports={getConstructor:function(t,e,n,s){var f=t((function(t,i){c(t,f,e,"_i"),t._t=e,t._i=r(null),t._f=void 0,t._l=void 0,t[m]=0,void 0!=i&&u(i,n,t[s],t)}));return o(f.prototype,{clear:function(){for(var t=p(this,e),n=t._i,i=t._f;i;i=i.n)i.r=!0,i.p&&(i.p=i.p.n=void 0),delete n[i.i];t._f=t._l=void 0,t[m]=0},delete:function(t){var n=p(this,e),i=g(n,t);if(i){var r=i.n,o=i.p;delete n._i[i.i],i.r=!0,o&&(o.n=r),r&&(r.p=o),n._f==i&&(n._f=r),n._l==i&&(n._l=o),n[m]--}return!!i},forEach:function(t){p(this,e);var n,i=a(t,arguments.length>1?arguments[1]:void 0,3);while(n=n?n.n:this._f){i(n.v,n.k,this);while(n&&n.r)n=n.p}},has:function(t){return!!g(p(this,e),t)}}),l&&i(f.prototype,"size",{get:function(){return p(this,e)[m]}}),f},def:function(t,e,n){var i,r,o=g(t,e);return o?o.v=n:(t._l=o={i:r=d(e,!0),k:e,v:n,p:i=t._l,n:void 0,r:!1},t._f||(t._f=o),i&&(i.n=o),t[m]++,"F"!==r&&(t._i[r]=o)),t},getEntry:g,setStrong:function(t,e,n){s(t,e,(function(t,n){this._t=p(t,e),this._k=n,this._l=void 0}),(function(){var t=this,e=t._k,n=t._l;while(n&&n.r)n=n.p;return t._t&&(t._l=n=n?n.n:t._t._f)?f(0,"keys"==e?n.k:"values"==e?n.v:[n.k,n.v]):(t._t=void 0,f(1))}),n?"entries":"values",!n,!0),h(e)}}},c366:function(t,e,n){var i=n("6821"),r=n("9def"),o=n("77f1");t.exports=function(t){return function(e,n,a){var c,u=i(e),s=r(u.length),f=o(a,s);if(t&&n!=n){while(s>f)if(c=u[f++],c!=c)return!0}else for(;s>f;f++)if((t||f in u)&&u[f]===n)return t||f||0;return!t&&-1}}},c5f6:function(t,e,n){"use strict";var i=n("7726"),r=n("69a8"),o=n("2d95"),a=n("5dbc"),c=n("6a99"),u=n("79e5"),s=n("9093").f,f=n("11e9").f,h=n("86cc").f,l=n("aa77").trim,d="Number",p=i[d],m=p,g=p.prototype,v=o(n("2aeb")(g))==d,b="trim"in String.prototype,y=function(t){var e=c(t,!1);if("string"==typeof e&&e.length>2){e=b?e.trim():l(e,3);var n,i,r,o=e.charCodeAt(0);if(43===o||45===o){if(n=e.charCodeAt(2),88===n||120===n)return NaN}else if(48===o){switch(e.charCodeAt(1)){case 66:case 98:i=2,r=49;break;case 79:case 111:i=8,r=55;break;default:return+e}for(var a,u=e.slice(2),s=0,f=u.length;s<f;s++)if(a=u.charCodeAt(s),a<48||a>r)return NaN;return parseInt(u,i)}}return+e};if(!p(" 0o1")||!p("0b1")||p("+0x1")){p=function(t){var e=arguments.length<1?0:t,n=this;return n instanceof p&&(v?u((function(){g.valueOf.call(n)})):o(n)!=d)?a(new m(y(e)),n,p):y(e)};for(var x,w=n("9e1e")?s(m):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(","),S=0;w.length>S;S++)r(m,x=w[S])&&!r(p,x)&&h(p,x,f(m,x));p.prototype=g,g.constructor=p,n("2aba")(i,d,p)}},c69a:function(t,e,n){t.exports=!n("9e1e")&&!n("79e5")((function(){return 7!=Object.defineProperty(n("230e")("div"),"a",{get:function(){return 7}}).a}))},c8ba:function(t,e){var n;n=function(){return this}();try{n=n||new Function("return this")()}catch(i){"object"===typeof window&&(n=window)}t.exports=n},c8bb:function(t,e,n){t.exports=n("89ca")},ca5a:function(t,e){var n=0,i=Math.random();t.exports=function(t){return"Symbol(".concat(void 0===t?"":t,")_",(++n+i).toString(36))}},cadf:function(t,e,n){"use strict";var i=n("9c6c"),r=n("d53b"),o=n("84f2"),a=n("6821");t.exports=n("01f9")(Array,"Array",(function(t,e){this._t=a(t),this._i=0,this._k=e}),(function(){var t=this._t,e=this._k,n=this._i++;return!t||n>=t.length?(this._t=void 0,r(1)):r(0,"keys"==e?n:"values"==e?t[n]:[n,t[n]])}),"values"),o.Arguments=o.Array,i("keys"),i("values"),i("entries")},cb7c:function(t,e,n){var i=n("d3f4");t.exports=function(t){if(!i(t))throw TypeError(t+" is not an object!");return t}},cd1c:function(t,e,n){var i=n("e853");t.exports=function(t,e){return new(i(t))(e)}},ce10:function(t,e,n){var i=n("69a8"),r=n("6821"),o=n("c366")(!1),a=n("613b")("IE_PROTO");t.exports=function(t,e){var n,c=r(t),u=0,s=[];for(n in c)n!=a&&i(c,n)&&s.push(n);while(e.length>u)i(c,n=e[u++])&&(~o(s,n)||s.push(n));return s}},d13f:function(t,e,n){var i=n("da3c"),r=n("a7d3"),o=n("bc25"),a=n("8ce0"),c=n("43c8"),u="prototype",s=function(t,e,n){var f,h,l,d=t&s.F,p=t&s.G,m=t&s.S,g=t&s.P,v=t&s.B,b=t&s.W,y=p?r:r[e]||(r[e]={}),x=y[u],w=p?i:m?i[e]:(i[e]||{})[u];for(f in p&&(n=e),n)h=!d&&w&&void 0!==w[f],h&&c(y,f)||(l=h?w[f]:n[f],y[f]=p&&"function"!=typeof w[f]?n[f]:v&&h?o(l,i):b&&w[f]==l?function(t){var e=function(e,n,i){if(this instanceof t){switch(arguments.length){case 0:return new t;case 1:return new t(e);case 2:return new t(e,n)}return new t(e,n,i)}return t.apply(this,arguments)};return e[u]=t[u],e}(l):g&&"function"==typeof l?o(Function.call,l):l,g&&((y.virtual||(y.virtual={}))[f]=l,t&s.R&&x&&!x[f]&&a(x,f,l)))};s.F=1,s.G=2,s.S=4,s.P=8,s.B=16,s.W=32,s.U=64,s.R=128,t.exports=s},d25f:function(t,e,n){"use strict";var i=n("5ca1"),r=n("0a49")(2);i(i.P+i.F*!n("2f21")([].filter,!0),"Array",{filter:function(t){return r(this,t,arguments[1])}})},d2c8:function(t,e,n){var i=n("aae3"),r=n("be13");t.exports=function(t,e,n){if(i(e))throw TypeError("String#"+n+" doesn't accept regex!");return String(r(t))}},d38f:function(t,e,n){var i=n("7d8a"),r=n("1b55")("iterator"),o=n("b22a");t.exports=n("a7d3").isIterable=function(t){var e=Object(t);return void 0!==e[r]||"@@iterator"in e||o.hasOwnProperty(i(e))}},d3f4:function(t,e){t.exports=function(t){return"object"===typeof t?null!==t:"function"===typeof t}},d53b:function(t,e){t.exports=function(t,e){return{value:e,done:!!t}}},d604:function(t,e,n){n("1938"),t.exports=n("a7d3").Array.isArray},d782:function(t,e){t.exports=function(t){try{return!!t()}catch(e){return!0}}},d8e8:function(t,e){t.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t}},da3c:function(t,e){var n=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=n)},dcbc:function(t,e,n){var i=n("2aba");t.exports=function(t,e,n){for(var r in e)i(t,r,e[r],n);return t}},e0b8:function(t,e,n){"use strict";var i=n("7726"),r=n("5ca1"),o=n("2aba"),a=n("dcbc"),c=n("67ab"),u=n("4a59"),s=n("f605"),f=n("d3f4"),h=n("79e5"),l=n("5cc5"),d=n("7f20"),p=n("5dbc");t.exports=function(t,e,n,m,g,v){var b=i[t],y=b,x=g?"set":"add",w=y&&y.prototype,S={},_=function(t){var e=w[t];o(w,t,"delete"==t||"has"==t?function(t){return!(v&&!f(t))&&e.call(this,0===t?0:t)}:"get"==t?function(t){return v&&!f(t)?void 0:e.call(this,0===t?0:t)}:"add"==t?function(t){return e.call(this,0===t?0:t),this}:function(t,n){return e.call(this,0===t?0:t,n),this})};if("function"==typeof y&&(v||w.forEach&&!h((function(){(new y).entries().next()})))){var O=new y,E=O[x](v?{}:-0,1)!=O,T=h((function(){O.has(1)})),P=l((function(t){new y(t)})),L=!v&&h((function(){var t=new y,e=5;while(e--)t[x](e,e);return!t.has(-0)}));P||(y=e((function(e,n){s(e,y,t);var i=p(new b,e,y);return void 0!=n&&u(n,g,i[x],i),i})),y.prototype=w,w.constructor=y),(T||L)&&(_("delete"),_("has"),g&&_("get")),(L||E)&&_(x),v&&w.clear&&delete w.clear}else y=m.getConstructor(e,t,g,x),a(y.prototype,n),c.NEED=!0;return d(y,t),S[t]=y,r(r.G+r.W+r.F*(y!=b),S),v||m.setStrong(y,t,g),y}},e11e:function(t,e){t.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},e341:function(t,e,n){var i=n("d13f");i(i.S+i.F*!n("7d95"),"Object",{defineProperty:n("3adc").f})},e4a9:function(t,e,n){"use strict";var i=n("b457"),r=n("d13f"),o=n("2312"),a=n("8ce0"),c=n("b22a"),u=n("5ce7"),s=n("c0d8"),f=n("ff0c"),h=n("1b55")("iterator"),l=!([].keys&&"next"in[].keys()),d="@@iterator",p="keys",m="values",g=function(){return this};t.exports=function(t,e,n,v,b,y,x){u(n,e,v);var w,S,_,O=function(t){if(!l&&t in L)return L[t];switch(t){case p:return function(){return new n(this,t)};case m:return function(){return new n(this,t)}}return function(){return new n(this,t)}},E=e+" Iterator",T=b==m,P=!1,L=t.prototype,M=L[h]||L[d]||b&&L[b],R=M||O(b),j=b?T?O("entries"):R:void 0,k="Array"==e&&L.entries||M;if(k&&(_=f(k.call(new t)),_!==Object.prototype&&_.next&&(s(_,E,!0),i||"function"==typeof _[h]||a(_,h,g))),T&&M&&M.name!==m&&(P=!0,R=function(){return M.call(this)}),i&&!x||!l&&!P&&L[h]||a(L,h,R),c[e]=R,c[E]=g,b)if(w={values:T?R:O(m),keys:y?R:O(p),entries:j},x)for(S in w)S in L||o(L,S,w[S]);else r(r.P+r.F*(l||P),e,w);return w}},e5fa:function(t,e){t.exports=function(t){if(void 0==t)throw TypeError("Can't call method on  "+t);return t}},e853:function(t,e,n){var i=n("d3f4"),r=n("1169"),o=n("2b4c")("species");t.exports=function(t){var e;return r(t)&&(e=t.constructor,"function"!=typeof e||e!==Array&&!r(e.prototype)||(e=void 0),i(e)&&(e=e[o],null===e&&(e=void 0))),void 0===e?Array:e}},ec5b:function(t,e,n){n("e341");var i=n("a7d3").Object;t.exports=function(t,e,n){return i.defineProperty(t,e,n)}},f159:function(t,e,n){var i=n("7d8a"),r=n("1b55")("iterator"),o=n("b22a");t.exports=n("a7d3").getIteratorMethod=function(t){if(void 0!=t)return t[r]||t["@@iterator"]||o[i(t)]}},f1ae:function(t,e,n){"use strict";var i=n("86cc"),r=n("4630");t.exports=function(t,e,n){e in t?i.f(t,e,r(0,n)):t[e]=n}},f2fe:function(t,e){t.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t}},f3e2:function(t,e,n){"use strict";var i=n("5ca1"),r=n("0a49")(0),o=n("2f21")([].forEach,!0);i(i.P+i.F*!o,"Array",{forEach:function(t){return r(this,t,arguments[1])}})},f568:function(t,e,n){var i=n("3adc"),r=n("0f89"),o=n("7633");t.exports=n("7d95")?Object.defineProperties:function(t,e){r(t);var n,a=o(e),c=a.length,u=0;while(c>u)i.f(t,n=a[u++],e[n]);return t}},f605:function(t,e){t.exports=function(t,e,n,i){if(!(t instanceof e)||void 0!==i&&i in t)throw TypeError(n+": incorrect invocation!");return t}},f845:function(t,e){t.exports=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}}},fa54:function(t,e,n){"use strict";var i=n("b3e7"),r=n("245b"),o=n("b22a"),a=n("6a9b");t.exports=n("e4a9")(Array,"Array",(function(t,e){this._t=a(t),this._i=0,this._k=e}),(function(){var t=this._t,e=this._k,n=this._i++;return!t||n>=t.length?(this._t=void 0,r(1)):r(0,"keys"==e?n:"values"==e?t[n]:[n,t[n]])}),"values"),o.Arguments=o.Array,i("keys"),i("values"),i("entries")},fab2:function(t,e,n){var i=n("7726").document;t.exports=i&&i.documentElement},fb15:function(t,e,n){"use strict";if(n.r(e),n.d(e,"install",(function(){return a["b"]})),"undefined"!==typeof window){var i=window.document.currentScript,r=n("8875");i=r(),"currentScript"in document||Object.defineProperty(document,"currentScript",{get:r});var o=i&&i.src.match(/(.+\/)[^/]+\.js(\?.*)?$/);o&&(n.p=o[1])}var a=n("b635");e["default"]=a["a"]},fdef:function(t,e){t.exports="\t\n\v\f\r   ᠎             　\u2028\u2029\ufeff"},ff0c:function(t,e,n){var i=n("43c8"),r=n("0185"),o=n("5d8f")("IE_PROTO"),a=Object.prototype;t.exports=Object.getPrototypeOf||function(t){return t=r(t),i(t,o)?t[o]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?a:null}}})["default"]}));
//# sourceMappingURL=VueDraggableResizable.umd.min.js.map

/***/ }),

/***/ "fb6a":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("23e7");
var isObject = __webpack_require__("861d");
var isArray = __webpack_require__("e8b5");
var toAbsoluteIndex = __webpack_require__("23cb");
var toLength = __webpack_require__("50c4");
var toIndexedObject = __webpack_require__("fc6a");
var createProperty = __webpack_require__("8418");
var wellKnownSymbol = __webpack_require__("b622");
var arrayMethodHasSpeciesSupport = __webpack_require__("1dde");
var arrayMethodUsesToLength = __webpack_require__("ae40");

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('slice');
var USES_TO_LENGTH = arrayMethodUsesToLength('slice', { ACCESSORS: true, 0: 0, 1: 2 });

var SPECIES = wellKnownSymbol('species');
var nativeSlice = [].slice;
var max = Math.max;

// `Array.prototype.slice` method
// https://tc39.github.io/ecma262/#sec-array.prototype.slice
// fallback for not array-like ES3 strings and DOM objects
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH }, {
  slice: function slice(start, end) {
    var O = toIndexedObject(this);
    var length = toLength(O.length);
    var k = toAbsoluteIndex(start, length);
    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
    // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
    var Constructor, result, n;
    if (isArray(O)) {
      Constructor = O.constructor;
      // cross-realm fallback
      if (typeof Constructor == 'function' && (Constructor === Array || isArray(Constructor.prototype))) {
        Constructor = undefined;
      } else if (isObject(Constructor)) {
        Constructor = Constructor[SPECIES];
        if (Constructor === null) Constructor = undefined;
      }
      if (Constructor === Array || Constructor === undefined) {
        return nativeSlice.call(O, k, fin);
      }
    }
    result = new (Constructor === undefined ? Array : Constructor)(max(fin - k, 0));
    for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
    result.length = n;
    return result;
  }
});


/***/ }),

/***/ "fc6a":
/***/ (function(module, exports, __webpack_require__) {

// toObject with fallback for non-array-like ES3 strings
var IndexedObject = __webpack_require__("44ad");
var requireObjectCoercible = __webpack_require__("1d80");

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};


/***/ }),

/***/ "fdbc":
/***/ (function(module, exports) {

// iterable DOM collections
// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
module.exports = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  MimeTypeArray: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0
};


/***/ }),

/***/ "fdbf":
/***/ (function(module, exports, __webpack_require__) {

var NATIVE_SYMBOL = __webpack_require__("4930");

module.exports = NATIVE_SYMBOL
  // eslint-disable-next-line no-undef
  && !Symbol.sham
  // eslint-disable-next-line no-undef
  && typeof Symbol.iterator == 'symbol';


/***/ })

/******/ });
});
//# sourceMappingURL=flowchart.umd.js.map