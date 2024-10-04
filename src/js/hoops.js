"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["hoops"],{

/***/ "./resources/js/3d-viewer/Viewer.js":
/*!******************************************!*\
  !*** ./resources/js/3d-viewer/Viewer.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_OperatorsManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/OperatorsManager */ "./resources/js/3d-viewer/utils/OperatorsManager.js");
/* harmony import */ var _utils_ViewManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/ViewManager */ "./resources/js/3d-viewer/utils/ViewManager.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }


var Viewer = /*#__PURE__*/function () {
  function Viewer(_ref) {
    var containerId = _ref.containerId,
      model = _ref.model,
      navigation = _ref.navigation;
    _classCallCheck(this, Viewer);
    this.containerId = containerId;
    this.model = model;
    this.navigation = navigation;
    this.viewer_instance = null;
    this.operatorManager = null;
    this.viewManager = null;
    this._initializeHoopsViewer();
  }
  _createClass(Viewer, [{
    key: "_initializeHoopsViewer",
    value: function _initializeHoopsViewer() {
      var _this = this;
      this.viewer_instance = new Communicator.WebViewer({
        containerId: this.containerId,
        endpointUri: this.model,
        calculateDefaultViewAxes: true
      });
      this.viewer_instance.start();
      this.viewer_instance.setCallbacks({
        sceneReady: function sceneReady() {
          _this.viewer_instance.view.setBackgroundColor(new Communicator.Color(0, 0, 0));
        },
        modelStructureReady: function modelStructureReady() {
          _this._initializeViewerOperators();
          _this._initializeViewManager();
          _this._initializeNavigationSettings();
        }
      });
      window.addEventListener('resize', function () {
        _this.viewer_instance.resizeCanvas();
      });
    }
  }, {
    key: "_initializeNavigationSettings",
    value: function _initializeNavigationSettings() {
      if ('triad' in this.navigation) {
        if (this.navigation.triad) {
          this.viewer_instance.view.getAxisTriad().enable();
        }
      }
      if ('cube' in this.navigation) {
        if (this.navigation.cube) {
          this.viewer_instance.view.getNavCube().enable();
        }
      }
    }
  }, {
    key: "_initializeViewerOperators",
    value: function _initializeViewerOperators() {
      this.operatorManager = new _utils_OperatorsManager__WEBPACK_IMPORTED_MODULE_0__["default"](this.viewer_instance);
    }
  }, {
    key: "_initializeViewManager",
    value: function _initializeViewManager() {
      this.viewManager = new _utils_ViewManager__WEBPACK_IMPORTED_MODULE_1__["default"](this.viewer_instance, this.containerId);
    }
  }]);
  return Viewer;
}();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Viewer);

/***/ }),

/***/ "./resources/js/3d-viewer/operators/CuttingOperator.js":
/*!*************************************************************!*\
  !*** ./resources/js/3d-viewer/operators/CuttingOperator.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CuttingOperator)
/* harmony export */ });
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var CuttingOperator = /*#__PURE__*/function () {
  function CuttingOperator(viewer) {
    var _this = this;
    _classCallCheck(this, CuttingOperator);
    this.viewer = viewer;
    this.handleOperator = this.viewer.operatorManager.getOperator(Communicator.OperatorId.Handle);
    this.pickConfig = new Communicator.PickConfig(Communicator.SelectionMask.Face);
    this.handleSelected = false;
    this.dragging = false;
    this.dragCount = 0;
    this.handleEventPromise = Promise.resolve();
    this.activeCuttingPlane = null;
    var handleEventStartFunction = function handleEventStartFunction() {
      _this.handleSelected = true;
    };
    var handleEventFunction = function handleEventFunction(eventType, nodeIds, initialMatrices, newMatrices) {
      _this.viewer.cuttingManager.delayCapping();
      _this.handleEventPromise = _this.handleEventPromise.then(function () {
        return _this.onHandleEvent(eventType, nodeIds, initialMatrices, newMatrices, false);
      });
    };
    var handleEventEndFunction = function handleEventEndFunction(eventType, nodeIds, initialMatrices, newMatrices) {
      _this.handleEventPromise = _this.handleEventPromise.then(function () {
        return _this.onHandleEvent(eventType, nodeIds, initialMatrices, newMatrices, true).then(function () {
          var newPlane = _this.getActivePlane();
          if (newPlane !== null) {
            _this.activeCuttingPlane = newPlane.copy();
          } else {
            _this.activeCuttingPlane = null;
          }
          _this.handleSelected = false;
        });
      });
    };
    var updateHandlePosition = function updateHandlePosition(cuttingSection, cuttingEventEnd) {
      if (cuttingSection !== _this.viewer.cuttingManager.getCuttingSection(0) || _this.activeCuttingPlane === null) {
        return;
      }
      var newPlane = cuttingSection.getPlane(0);
      if (newPlane === null) {
        return;
      }
      _this._updateHandlePosition(_this.activeCuttingPlane.copy(), newPlane.copy(), cuttingEventEnd);
      if (cuttingEventEnd) {
        _this.activeCuttingPlane = newPlane.copy();
      }
    };
    var cuttingEvent = function cuttingEvent(cuttingSection) {
      updateHandlePosition(cuttingSection, false);
    };
    var cuttingEventEnd = function cuttingEventEnd(cuttingSection) {
      updateHandlePosition(cuttingSection, true);
    };
    this.viewer.setCallbacks({
      handleEventStart: handleEventStartFunction,
      handleEvent: handleEventFunction,
      handleEventEnd: handleEventEndFunction,
      cuttingPlaneDrag: cuttingEvent,
      cuttingPlaneDragEnd: cuttingEventEnd
    });
  }
  _createClass(CuttingOperator, [{
    key: "onMouseDown",
    value: function onMouseDown() {
      this.dragging = true;
      this.dragCount = 0;
    }
  }, {
    key: "onMouseMove",
    value: function onMouseMove() {
      if (this.dragging) {
        ++this.dragCount;
      }
    }
  }, {
    key: "onMouseUp",
    value: function () {
      var _onMouseUp = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(event) {
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              this.dragging = false;
              if (!(this.dragCount > 5)) {
                _context.next = 3;
                break;
              }
              return _context.abrupt("return");
            case 3:
              if (event.getButton() === Communicator.Button.Right) {
                this.removeCuttingPlane();
              } else if (event.getButton() === Communicator.Button.Left) {
                this.addCuttingPlane(event);
              }
            case 4:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function onMouseUp(_x) {
        return _onMouseUp.apply(this, arguments);
      }
      return onMouseUp;
    }()
  }, {
    key: "getActivePlane",
    value: function getActivePlane() {
      var cuttingManager = this.viewer.cuttingManager;
      var cuttingSection = cuttingManager.getCuttingSection(0);
      return cuttingSection.getPlane(0);
    }
  }, {
    key: "_updateHandlePosition",
    value: function () {
      var _updateHandlePosition2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(previousPlane, newPlane, resetInitialPosition) {
        var newDistance, c, newTranslation;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              if (!this.handleSelected) {
                _context2.next = 2;
                break;
              }
              return _context2.abrupt("return");
            case 2:
              newDistance = previousPlane.d - newPlane.d;
              c = newPlane.getCoefficients();
              newTranslation = new Communicator.Point3(c[0], c[1], c[2]).scale(newDistance);
              this.handleOperator.updatePosition(newTranslation, new Communicator.Matrix(), resetInitialPosition);
            case 6:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function _updateHandlePosition(_x2, _x3, _x4) {
        return _updateHandlePosition2.apply(this, arguments);
      }
      return _updateHandlePosition;
    }()
  }, {
    key: "removeCuttingPlane",
    value: function () {
      var _removeCuttingPlane = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              this.activeCuttingPlane = null;
              _context3.next = 3;
              return Promise.all([this.viewer.cuttingManager.deactivateCuttingSections(true), this.handleOperator.removeHandles()]);
            case 3:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function removeCuttingPlane() {
        return _removeCuttingPlane.apply(this, arguments);
      }
      return removeCuttingPlane;
    }()
  }, {
    key: "addCuttingPlane",
    value: function () {
      var _addCuttingPlane = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(event) {
        var selectionItem, position, faceEntity, normal, box, plane, cuttingManager, cuttingSection, referenceGeometry, nodeId;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              if (!this.viewer.cuttingManager.hasActiveCuttingSection()) {
                _context4.next = 2;
                break;
              }
              return _context4.abrupt("return");
            case 2:
              // Needs to finalize measurements before adding a cutting plane.
              this.viewer.measureManager.finalizeMeasurement();
              _context4.next = 5;
              return this.viewer.view.pickFromPoint(event.getPosition(), this.pickConfig);
            case 5:
              selectionItem = _context4.sent;
              position = selectionItem.getPosition();
              faceEntity = selectionItem.getFaceEntity();
              if (!(position !== null && faceEntity !== null)) {
                _context4.next = 22;
                break;
              }
              normal = faceEntity.getNormal();
              _context4.next = 12;
              return this.viewer.model.getModelBounding(true, false);
            case 12:
              box = _context4.sent;
              plane = Communicator.Plane.createFromPointAndNormal(position, normal);
              this.activeCuttingPlane = plane.copy();
              cuttingManager = this.viewer.cuttingManager;
              cuttingSection = cuttingManager.getCuttingSection(0);
              referenceGeometry = cuttingManager.createReferenceGeometryFromFaceNormal(normal.copy(), position.copy(), box.copy());
              _context4.next = 20;
              return Promise.all([cuttingSection.addPlane(plane, referenceGeometry), cuttingSection.activate()]);
            case 20:
              nodeId = cuttingSection.getNodeId(0);
              if (nodeId !== null) {
                this.addHandles(position, normal, nodeId);
              }
            case 22:
            case "end":
              return _context4.stop();
          }
        }, _callee4, this);
      }));
      function addCuttingPlane(_x5) {
        return _addCuttingPlane.apply(this, arguments);
      }
      return addCuttingPlane;
    }()
  }, {
    key: "addHandles",
    value: function addHandles(position, normal, nodeId) {
      var axis1 = Communicator.Point3.cross(normal, new Communicator.Point3(1, 0, 0));
      if (axis1.squaredLength() < 0.001) {
        axis1 = Communicator.Point3.cross(normal, new Communicator.Point3(0, 1, 0));
      }
      var axis2 = Communicator.Point3.cross(normal, axis1);
      this.handleOperator.addAxisRotationHandle(position, axis1, Communicator.Color.red());
      this.handleOperator.addAxisRotationHandle(position, axis2, Communicator.Color.blue());
      this.handleOperator.setNodeIds([nodeId]);
      this.handleOperator.showHandles();
    }
  }, {
    key: "onHandleEvent",
    value: function () {
      var _onHandleEvent = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(eventType, nodeIds, initialMatrices, newMatrices, handleEventEnd) {
        var handlePosition;
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              handlePosition = this.handleOperator.getPosition();
              if (!(this.activeCuttingPlane === null || handlePosition === null)) {
                _context5.next = 3;
                break;
              }
              return _context5.abrupt("return", Promise.resolve());
            case 3:
              if (eventType === Communicator.HandleEventType.Rotate && newMatrices.length > 0) {
                this.onHandleRotate(this.activeCuttingPlane.copy(), handlePosition.copy(), initialMatrices[0].copy(), newMatrices[0].copy(), handleEventEnd);
              }
            case 4:
            case "end":
              return _context5.stop();
          }
        }, _callee5, this);
      }));
      function onHandleEvent(_x6, _x7, _x8, _x9, _x10) {
        return _onHandleEvent.apply(this, arguments);
      }
      return onHandleEvent;
    }()
  }, {
    key: "onHandleRotate",
    value: function () {
      var _onHandleRotate = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(plane, handlePosition, initialMatrix, newMatrix, handleEventEnd) {
        var newPlaneMatrix, axisNormal, rotationMatrix, newNormal, newPlane, cuttingSection;
        return _regeneratorRuntime().wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              newPlaneMatrix = newMatrix.copy();
              axisNormal = plane.normal.copy();
              initialMatrix.setTranslationComponent(0, 0, 0);
              initialMatrix = initialMatrix.inverseAndDeterminant()[0];
              newMatrix.setTranslationComponent(0, 0, 0);
              rotationMatrix = Communicator.Matrix.multiply(initialMatrix, newMatrix);
              newNormal = rotationMatrix.transform(axisNormal);
              newPlane = new Communicator.Plane().setFromPointAndNormal(handlePosition, newNormal);
              cuttingSection = this.viewer.cuttingManager.getCuttingSection(0);
              if (!(cuttingSection === null)) {
                _context6.next = 11;
                break;
              }
              return _context6.abrupt("return");
            case 11:
              _context6.next = 13;
              return cuttingSection.updatePlane(0, newPlane, newPlaneMatrix, handleEventEnd, true);
            case 13:
            case "end":
              return _context6.stop();
          }
        }, _callee6, this);
      }));
      function onHandleRotate(_x11, _x12, _x13, _x14, _x15) {
        return _onHandleRotate.apply(this, arguments);
      }
      return onHandleRotate;
    }()
  }]);
  return CuttingOperator;
}();


/***/ }),

/***/ "./resources/js/3d-viewer/operators/SelectOperator.js":
/*!************************************************************!*\
  !*** ./resources/js/3d-viewer/operators/SelectOperator.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var SelectOperator = /*#__PURE__*/function () {
  function SelectOperator(viewer_instance) {
    _classCallCheck(this, SelectOperator);
    this.viewer_instance = viewer_instance;
  }
  _createClass(SelectOperator, [{
    key: "onMouseDown",
    value: function onMouseDown(event) {
      var _this = this;
      var config = new Communicator.PickConfig(Communicator.SelectionMask.Line);
      this.viewer_instance.selectionManager.clear();
      this.viewer_instance.view.pickFromPoint(event.getPosition(), config).then(function (selection) {
        if (selection.getNodeId() != null) {
          _this.viewer_instance.selectionManager.set(selection);
        }
      });
    }
  }]);
  return SelectOperator;
}();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SelectOperator);

/***/ }),

/***/ "./resources/js/3d-viewer/utils/OperatorsManager.js":
/*!**********************************************************!*\
  !*** ./resources/js/3d-viewer/utils/OperatorsManager.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _operators_SelectOperator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../operators/SelectOperator */ "./resources/js/3d-viewer/operators/SelectOperator.js");
/* harmony import */ var _operators_CuttingOperator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../operators/CuttingOperator */ "./resources/js/3d-viewer/operators/CuttingOperator.js");
/* harmony import */ var _utils_ValidationError__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/ValidationError */ "./resources/js/3d-viewer/utils/ValidationError.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }



var OperatorsIndex = /*#__PURE__*/function () {
  function OperatorsIndex(viewer_instance) {
    _classCallCheck(this, OperatorsIndex);
    this.viewer_instance = viewer_instance;
    this.customOperators = {};
    this._initializeCustomOperators();
  }

  /**
     * Initializes custom operators. All custom operators must be added
     * to this function.
     * @returns {void}
     */
  _createClass(OperatorsIndex, [{
    key: "_initializeCustomOperators",
    value: function _initializeCustomOperators() {
      this._registerCustomOperator('cutting_operator', _operators_CuttingOperator__WEBPACK_IMPORTED_MODULE_1__["default"]);
      this._registerCustomOperator('select_operator', _operators_SelectOperator__WEBPACK_IMPORTED_MODULE_0__["default"]);
    }

    /**
       * Registers given custom operator and adds them to the custom operator
       * hash table.
       * @param {string} operator_name operator name and key to be used in hash table
       * @param {Class} Operator Must receive Operator class.
       * @throws {ValidationError}
       * @returns {void}
       *
       */
  }, {
    key: "_registerCustomOperator",
    value: function _registerCustomOperator(operator_name, Operator) {
      (0,_utils_ValidationError__WEBPACK_IMPORTED_MODULE_2__.validateInput)(operator_name, 'string');
      (0,_utils_ValidationError__WEBPACK_IMPORTED_MODULE_2__.validateInput)(Operator, 'function');
      var customOperator = new Operator(this.viewer_instance);
      this.customOperators[operator_name] = this.viewer_instance.registerCustomOperator(customOperator);
    }

    /**
       * Use this function to select (and use) a registered custom operator OR built-in
       * Hoops operators found in Communicator.OperatorId
       * @param {string} operator_name operator name given when registering the operator
       * @returns {void}
       */
  }, {
    key: "changeOperator",
    value: function changeOperator(operator_name) {
      (0,_utils_ValidationError__WEBPACK_IMPORTED_MODULE_2__.validateInput)(operator_name, 'string');
      if (!(operator_name in this.customOperators) && !(operator_name in Communicator.OperatorId)) {
        throw new Error("".concat(operator_name, " is not a registered operator."));
      }
      this.viewer_instance.operatorManager.replaceOperator(this.viewer_instance.operatorManager.peek(), operator_name in this.customOperators ? this.customOperators[operator_name] : Communicator.OperatorId[operator_name]);
    }
  }]);
  return OperatorsIndex;
}();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (OperatorsIndex);

/***/ }),

/***/ "./resources/js/3d-viewer/utils/ValidationError.js":
/*!*********************************************************!*\
  !*** ./resources/js/3d-viewer/utils/ValidationError.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "validateInput": () => (/* binding */ validateInput)
/* harmony export */ });
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }
function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct.bind(); } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
var ValidationError = /*#__PURE__*/function (_Error) {
  _inherits(ValidationError, _Error);
  var _super = _createSuper(ValidationError);
  function ValidationError(message) {
    var _this;
    _classCallCheck(this, ValidationError);
    _this = _super.call(this, message);
    _this.name = 'ValidationError';
    _this.message = message;
    return _this;
  }
  return _createClass(ValidationError);
}( /*#__PURE__*/_wrapNativeSuper(Error));
function validateInput(field, type) {
  if (_typeof(field) !== type) {
    throw new ValidationError("".concat(field, " type must be a ").concat(type));
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ValidationError);

/***/ }),

/***/ "./resources/js/3d-viewer/utils/ViewManager.js":
/*!*****************************************************!*\
  !*** ./resources/js/3d-viewer/utils/ViewManager.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_color_converter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/color-converter */ "./resources/js/utils/color-converter.js");
/* harmony import */ var _utils_ValidationError__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/ValidationError */ "./resources/js/3d-viewer/utils/ValidationError.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }


var ViewManager = /*#__PURE__*/function () {
  function ViewManager(viewer_instance, containerId) {
    _classCallCheck(this, ViewManager);
    this.viewer_instance = viewer_instance;
    this.containerId = containerId;
    this.view_scroll_coord = null;
    this._initializeViewUtils();
  }

  /**
     * Changes viewer drawing mode
     * @returns {void}
     */
  _createClass(ViewManager, [{
    key: "selectDrawingMode",
    value: function selectDrawingMode(drawing_mode) {
      (0,_utils_ValidationError__WEBPACK_IMPORTED_MODULE_1__.validateInput)('drawing_mode', 'string');
      if (!(drawing_mode in Communicator.DrawMode)) {
        throw new Error("".concat(drawing_mode, " is not a valid Drawing mode"));
      }
      this.viewer_instance.view.setDrawMode(Communicator.DrawMode[drawing_mode]);
    }

    /**
       * Changes current model being viewed.
       * to this function.
       * @returns {void}
       */
  }, {
    key: "selectModel",
    value: function selectModel(name) {
      (0,_utils_ValidationError__WEBPACK_IMPORTED_MODULE_1__.validateInput)('name', 'string');
      var model = this.viewer_instance.model;
      model.clear().then(function () {
        var rootNode = model.getAbsoluteRootNode();
        var modelName = name;
        model.loadSubtreeFromScsFile(rootNode, modelName);
      });
    }

    /**
       * Resets to default view (This will remove any active markup view)
       * @returns {void}
       */
  }, {
    key: "handleGoHome",
    value: function handleGoHome() {
      this.viewer_instance.reset();
    }

    /**
       * This function creates a link element and stores a base64 image object.
       * The image object will then be automatically downloaded.
       * @returns {void}
       */
  }, {
    key: "takeScreenshot",
    value: function () {
      var _takeScreenshot = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var image_object, tmp_link_element;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return this.viewer_instance.takeSnapshot();
            case 2:
              image_object = _context.sent;
              tmp_link_element = document.createElement('a');
              tmp_link_element.href = image_object.src;
              tmp_link_element.download = "screenshot_".concat(new Date()).replace(/\s+/g, '_');
              document.body.appendChild(tmp_link_element);
              tmp_link_element.click();
              document.body.removeChild(tmp_link_element);
            case 9:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function takeScreenshot() {
        return _takeScreenshot.apply(this, arguments);
      }
      return takeScreenshot;
    }()
    /**
       * Changes color of a selected node face. Needs to be used after
       * the node face has been selected.
       * @param {String} hex a hexadecimal color. (#fc8f34)
       * @returns {void}
       */
  }, {
    key: "changeColor",
    value: function changeColor(hex) {
      var _ColorConverter$hexTo = _utils_color_converter__WEBPACK_IMPORTED_MODULE_0__["default"].hexToRGB(hex),
        r = _ColorConverter$hexTo.r,
        g = _ColorConverter$hexTo.g,
        b = _ColorConverter$hexTo.b;
      var parts_ids = [];
      this.viewer_instance.selectionManaget.each(function (item) {
        parts_ids.push(selectionItem.getNodeId());
      });
      this.viewer_instance.model.setNodesFaceColor(parts_ids, new Communicator.Color(r, g, b));
    }

    /**
       * Calls hoops setMagnitude built-in module
       * @param {Number} range range of explosion.
       * @returns {void}
       */
  }, {
    key: "handleModelExplode",
    value: function handleModelExplode(range) {
      this.viewer_instance.explodeManager.setMagnitude(range);
    }

    /**
       * Handles switching to fullscreen
       * @returns {void}
       */
  }, {
    key: "handleFullScreen",
    value: function handleFullScreen() {
      var viewer_container = document.getElementById('viewer-container');
      if (document.fullscreenElement) {
        document.exitFullscreen();
        return;
      }
      viewer_container.requestFullscreen();
    }

    /**
       * Stores current window scroll position when switching to fullscreen
       * and restores position when switching off. This was designed to be
       * used with an event listener. See _initializeViewUtils()
       * @returns {void}
       */
  }, {
    key: "_handleMouseOffset",
    value: function _handleMouseOffset() {
      if (this.view_scroll_coord) {
        window.scrollTo(this.view_scroll_coord);
        this.view_scroll_coord = null;
        return;
      }
      this.view_scroll_coord = {
        top: window.scrollY,
        left: window.scrollX
      };
      window.scrollTo({
        top: 0,
        left: 0
      });
    }

    /**
       * Initialize events and utilities used in the view manager.
       * @returns {void}
       */
  }, {
    key: "_initializeViewUtils",
    value: function _initializeViewUtils() {
      // Adds event click handler to prevent click offset issues :)
      document.addEventListener('fullscreenchange', this._handleMouseOffset);
    }

    /**
       * Removes all actuve measurement.
       * @returns {void}
       */
  }, {
    key: "removeMeasurements",
    value: function removeMeasurements() {
      this.viewer_instance.measureManager.removeAllMeasurements();
    }

    /**
       * Deletes all markup on screen :)
       * @returns {void}
       */
  }, {
    key: "removeMarkups",
    value: function removeMarkups() {
      var current_markup_view = this.viewer_instance.markupManager.getActiveMarkupView();
      if (current_markup_view) {
        this.viewer_instance.markupManager.deleteMarkupView(current_markup_view._uniqueId);
        this.viewer_instance.markupManager.refreshMarkup();
      }
    }

    /**
       * Removes active cutting sections.
       * @returns {void}
       */
  }, {
    key: "removeCuttingSections",
    value: function removeCuttingSections() {
      var cuttingManager = this.viewer_instance.cuttingManager;
      if (cuttingManager.hasActiveCuttingSection()) {
        cuttingManager.deactivateCuttingSections(true);
        this.viewer_instance.operatorManager.getOperator(Communicator.OperatorId.Handle).removeHandles();
      }
    }
  }]);
  return ViewManager;
}();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ViewManager);

/***/ }),

/***/ "./resources/js/utils/color-converter.js":
/*!***********************************************!*\
  !*** ./resources/js/utils/color-converter.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var ColorConverter = /*#__PURE__*/function () {
  function ColorConverter() {
    _classCallCheck(this, ColorConverter);
  }
  _createClass(ColorConverter, [{
    key: "lighten",
    value:
    /**
       * Lightens given color value by given percentage.
       * @param {string} hex Hex color e.g: #fc8f34
       * @param {number} percent percentage to lighten
       *
       */

    function lighten(hex, percent) {
      try {
        if (!hex) {
          throw new Error('A hexadecimal color value is required');
        }
        if (!percent) {
          throw new error('Percent value is required');
        }
        // Converts Hex (#fc8f34) color to RGB (rgb(255, 255, 255))
        var rgb = this.hexToRGB(hex);
        var r = rgb.r,
          g = rgb.g,
          b = rgb.b;
        // Converts RGB to HSL (Hue, Saturation, Light)
        var hsl = this.rgbToHsl(r, g, b);

        // Adds the percentage to the light value
        var new_light_value = hsl.l + hsl.l * percent / 10;

        // Converts HSL to RGB and then to Hex.
        // If Light value is over 100%, it returns 100%
        var new_hex = this.RGBtoHex(this.HSLtoRGB(hsl.h, hsl.s, new_light_value > 1 ? 1 : new_light_value));

        // Returns new hex code
        return new_hex;
      } catch (error) {
        this._handleError(error);
      }
    }

    /**
       * Darkens given color value by given percentage.
       * @param {string} hex Hex color e.g: #fc8f34
       * @param {number} percent percentage to darken
       *
       */
  }, {
    key: "darken",
    value: function darken(hex, percent) {
      try {
        if (!hex) {
          throw new Error('A hexadecimal color value is required');
        }
        if (!percent) {
          throw new error('Percent value is required');
        }

        // Converts Hex (#fc8f34) color to RGB (rgb(255, 255, 255))
        var rgb = this.hexToRGB(hex);
        var r = rgb.r,
          g = rgb.g,
          b = rgb.b;
        // Converts RGB to HSL (Hue, Saturation, Light)
        var hsl = this.rgbToHsl(r, g, b);

        // Adds the percentage to the light value
        var new_light_value = hsl.l - hsl.l * percent / 10;

        // Converts HSL to RGB and then to Hex.
        // If Light value is over 100%, it returns 100%
        var new_hex = this.RGBtoHex(this.HSLtoRGB(hsl.h, hsl.s, new_light_value > 1 ? 1 : new_light_value));

        // Returns new hex code
        return new_hex;
      } catch (error) {
        this._handleError(error);
      }
    }

    /**
       * Converts HSL color format to RGB
       * https://www.niwa.nu/2013/05/math-behind-colorspace-conversions-rgb-hsl/
       * @param {number} hue Hue color value
       * @param {number} sat Saturation color value
       * @param {number} light light color value
       * @returns {Object}
       *
       */
  }, {
    key: "HSLtoRGB",
    value: function HSLtoRGB(hue, sat, light) {
      try {
        // Check for missing parameters
        if (!hue) throw new Error('hue is a required parameter');
        if (!sat) throw new Error('sat is a required parameter');
        if (!light) throw new Error('light is a required parameter');

        // Defines variable chain
        var t1, t2, r, g, b;
        hue = hue / 60;
        if (light <= 0.5) {
          t2 = light * (sat + 1);
        } else {
          t2 = light + sat - light * sat;
        }
        t1 = light * 2 - t2;
        r = this.hueToRgb(t1, t2, hue + 2) * 255;
        g = this.hueToRgb(t1, t2, hue) * 255;
        b = this.hueToRgb(t1, t2, hue - 2) * 255;
        // RGB values can't be floats.
        return {
          r: Math.round(r),
          g: Math.round(g),
          b: Math.round(b)
        };
      } catch (error) {
        this._handleError(error);
      }
    }

    /**
       * Converts RGB color format to HSL
       * https://en.wikipedia.org/wiki/HSL_and_HSV
       * @param {number} r red color value
       * @param {number} g green color value
       * @param {number} b blue color value
       * @returns {Object}
       *
       */
  }, {
    key: "rgbToHsl",
    value: function rgbToHsl(r, g, b) {
      if (!r) throw new Error('r is a required parameter');
      if (!g) throw new Error('g is a required parameter');
      if (!b) throw new Error('b is a required parameter');
      var l, s, h;
      var rgb = [];
      rgb[0] = r / 255;
      rgb[1] = g / 255;
      rgb[2] = b / 255;
      var min = rgb[0];
      var max = rgb[0];
      var maxcolor = 0;
      for (var i = 0; i < rgb.length - 1; i++) {
        if (rgb[i + 1] <= min) {
          min = rgb[i + 1];
        }
        if (rgb[i + 1] >= max) {
          max = rgb[i + 1];
          maxcolor = i + 1;
        }
      }
      if (maxcolor == 0) {
        h = (rgb[1] - rgb[2]) / (max - min);
      }
      if (maxcolor == 1) {
        h = 2 + (rgb[2] - rgb[0]) / (max - min);
      }
      if (maxcolor == 2) {
        h = 4 + (rgb[0] - rgb[1]) / (max - min);
      }
      if (isNaN(h)) {
        h = 0;
      }
      h = h * 60;
      if (h < 0) {
        h = h + 360;
      }
      l = (min + max) / 2;
      if (min == max) {
        s = 0;
      } else {
        if (l < 0.5) {
          s = (max - min) / (max + min);
        } else {
          s = (max - min) / (2 - max - min);
        }
      }
      s = s;
      return {
        h: h,
        s: s,
        l: l
      };
    }

    /**
       * Calculates RGB value based on hue (See HSL to RGB)
       * https://en.wikipedia.org/wiki/Hue
       * @param {number} t1 This value can be obtain through: light * 2 - t2
       * @param {number} t2 This value can be obtained through: light * (sat + 1)
       * @param {number} hue blue color value
       * @returns {number}
       *
       */
  }, {
    key: "hueToRgb",
    value: function hueToRgb(t1, t2, hue) {
      if (!t1) throw new Error('t1 is a required parameter');
      if (!t2) throw new Error('t2 is a required parameter');
      if (!hue) throw new Error('hue is a required parameter');
      if (hue < 0) hue += 6;
      if (hue >= 6) hue -= 6;
      if (hue < 1) return (t2 - t1) * hue + t1;else if (hue < 3) return t2;else if (hue < 4) return (t2 - t1) * (4 - hue) + t1;else return t1;
    }

    /**
       * converts individual numbers to hexadecimal string values
       * @param {number} n Number to convert
       * @returns {string} hexcode value e.g: 56 => '38'
       *
       */
  }, {
    key: "decimalToHex",
    value: function decimalToHex(n) {
      if (!n) throw new Error('n is a required parameter');
      var hex = n.toString(16);
      while (hex.length < 2) {
        // If the hex value only has 1 character, adds "0" to it
        // Generally, valid hex codes must have 3 or 6 charcters
        // with the exception of HEXA codes (which include transparency.)
        hex = '0' + hex;
      }
      return hex;
    }

    /**
       * Converts RGB values to Hex code.
       * @param {Object} rgb Takes object with r, g, b values. e.g: {r: 255, g: 255, b: 255}
       * @returns {string} Hexadecimal color value e.g: #36f784
       *
       */
  }, {
    key: "RGBtoHex",
    value: function RGBtoHex(_ref) {
      var r = _ref.r,
        g = _ref.g,
        b = _ref.b;
      // Converts each value to HEX
      var red = this.decimalToHex(r);
      var green = this.decimalToHex(g);
      var blue = this.decimalToHex(b);
      // Adds all values with # in front
      return '#' + red + green + blue;
    }

    /**
       * Converts hexadecimal color values to RGB object.
       * @param {string} color Hexadecimal color value. e.g: '#cdcdcd'
       * @returns {Object} Returns object with R, G, B values
       *
       */
  }, {
    key: "hexToRGB",
    value: function hexToRGB(color) {
      if (!color) throw new Error('color is a required parameter');

      // Converts Hex colors into RGB
      var hex = color;
      if (hex[0] == '#') {
        // Drops the # from the beginning if it's there.
        hex = hex.substring(1);
      }

      // Parses hex values into RGB intergers
      var RGBHex = hex.toString().match(/.{1,2}/g);

      // Creates {r, g, b} object
      var rgb = {
        r: parseInt(RGBHex[0], 16),
        g: parseInt(RGBHex[1], 16),
        b: parseInt(RGBHex[2], 16)
      };
      return rgb;
    }

    /**
       * Calculates color contrast and returns 'black' or 'white' If value is not provided, it returns #f1f1f1.
       * @param {string} color Hexadecimal color value. e.g: '#cdcdcd'
       * @returns {String} Returns 'black', 'white' or '#f1f1f1'
       *
       */
  }, {
    key: "getColorContrast",
    value: function getColorContrast(color) {
      // This method calculates using the YIQ color space
      // Read more here: https://en.wikipedia.org/wiki/YIQ

      // If color is not defined, return gray?
      if (!color) return '#f1f1f1';

      // Convert hex color to RGB
      var rgb = this.hexToRGB(color);
      var r = rgb.r,
        g = rgb.g,
        b = rgb.b;
      // Get YIQ color value to determine the contrast
      // https://www.mat.univie.ac.at/~kriegl/Skripten/CG/node14.html
      var contrast = (r * 299 + g * 587 + b * 114) / 1000;
      // Return "white" if it's a light color, "black" if it's a dark color
      return contrast >= 128 ? 'black' : 'white';
    }
  }, {
    key: "_handleError",
    value: function _handleError(err) {
      console.error(err.message);
    }
  }]);
  return ColorConverter;
}();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new ColorConverter());

/***/ })

}]);