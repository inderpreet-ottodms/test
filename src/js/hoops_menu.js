"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["hoops_menu"],{

/***/ "./resources/js/hoops/features/Menu.js":
/*!*********************************************!*\
  !*** ./resources/js/hoops/features/Menu.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Menu)
/* harmony export */ });
/* harmony import */ var _SelectOperator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SelectOperator.js */ "./resources/js/hoops/features/SelectOperator.js");
/* harmony import */ var _measure_MeasureOperator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./measure/MeasureOperator */ "./resources/js/hoops/features/measure/MeasureOperator.js");
/* harmony import */ var _ModelTree__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ModelTree */ "./resources/js/hoops/features/ModelTree.js");
/* harmony import */ var _cutting_CuttingSection__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./cutting/CuttingSection */ "./resources/js/hoops/features/cutting/CuttingSection.js");
/* harmony import */ var _annotation_AnnotationOperator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./annotation/AnnotationOperator */ "./resources/js/hoops/features/annotation/AnnotationOperator.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }





var Menu = /*#__PURE__*/function () {
  function Menu(hwv) {
    _classCallCheck(this, Menu);
    this._hwv = hwv;
    this._initEvents();
  }
  _createClass(Menu, [{
    key: "_initEvents",
    value: function _initEvents() {
      this.selectOperator = new _SelectOperator_js__WEBPACK_IMPORTED_MODULE_0__["default"](this._hwv);
      this.selectOperatorId = this._hwv.registerCustomOperator(this.selectOperator);
      this.measureOperator = new _measure_MeasureOperator__WEBPACK_IMPORTED_MODULE_1__["default"](this._hwv);
      this.measureOperatorId = this._hwv.registerCustomOperator(this.measureOperator);
      this.cuttingOperator = new _cutting_CuttingSection__WEBPACK_IMPORTED_MODULE_3__["default"](this._hwv);
      this.cuttingOperatorId = this._hwv.registerCustomOperator(this.cuttingOperator);
      this.annotationOperator = new _annotation_AnnotationOperator__WEBPACK_IMPORTED_MODULE_4__["default"](this._hwv);
      this.annotateOperatorId = this._hwv.registerCustomOperator(this.annotationOperator);
    }
  }, {
    key: "selectModel",
    value: function selectModel(name) {
      var model = this._hwv.model;
      model.clear().then(function () {
        var rootNode = model.getAbsoluteRootNode();
        var modelName = name;
        // Commented this out. We can use it later when/if we want to add a model tree.
        // We can load the model tree by calling 'modelTree.generate()' in a then block of:
        // let modelTree = new ModelTree(this._hwv, "modeltree");
        model.loadSubtreeFromScsFile(rootNode, modelName);
      });
    }
  }, {
    key: "changeOperator",
    value: function changeOperator(operator) {
      switch (operator.operator) {
        case 'Orbit':
          // This replaces the current operator from the operator stack (gets it through peek() with the wanted operator ID)
          this._hwv.operatorManager.replaceOperator(this._hwv.operatorManager.peek(), Communicator.OperatorId.Orbit);
          break;
        case 'Area Select':
          this._hwv.operatorManager.replaceOperator(this._hwv.operatorManager.peek(), Communicator.OperatorId.AreaSelect);
          break;
        case 'Select':
          this._hwv.operatorManager.replaceOperator(this._hwv.operatorManager.peek(), this.selectOperatorId);
          break;
        case 'Measure':
          this._hwv.operatorManager.replaceOperator(this._hwv.operatorManager.peek(), Communicator.OperatorId.MeasurePointPointDistance);
          break;
        case 'Cutting':
          this._hwv.operatorManager.replaceOperator(this._hwv.operatorManager.peek(), this.cuttingOperatorId);
          break;
        case 'Markup':
          if (operator.type === 'RectangleMarkup') {
            this._hwv.operatorManager.replaceOperator(this._hwv.operatorManager.peek(), Communicator.OperatorId.RedlineRectangle);
          } else if (operator.type === 'CircleMarkup') {
            this._hwv.operatorManager.replaceOperator(this._hwv.operatorManager.peek(), Communicator.OperatorId.RedlineCircle);
          } else if (operator.type === 'TextMarkup') {
            this._hwv.operatorManager.replaceOperator(this._hwv.operatorManager.peek(), Communicator.OperatorId.RedlineText);
          } else {
            this._hwv.operatorManager.replaceOperator(this._hwv.operatorManager.peek(), Communicator.OperatorId.RedlinePolyline);
          }

          // this._hwv.operatorManager.replaceOperator(this._hwv.operatorManager.peek(), Communicator.OperatorId.RedlineText)
          break;
        default:
          break;
      }
    }
  }, {
    key: "selectDrawingMode",
    value: function selectDrawingMode(mode) {
      switch (mode) {
        case 'Solid With Edges':
          this._hwv.view.setDrawMode(Communicator.DrawMode.WireframeOnShaded);
          break;
        case 'Wireframe':
          this._hwv.view.setDrawMode(Communicator.DrawMode.Wireframe);
          break;
        case 'Hidden Line':
          this._hwv.view.setDrawMode(Communicator.DrawMode.HiddenLine);
          break;
        case 'X-Ray':
          this._hwv.view.setDrawMode(Communicator.DrawMode.XRay);
          break;
      }
    }
  }]);
  return Menu;
}();


/***/ }),

/***/ "./resources/js/hoops/features/ModelTree.js":
/*!**************************************************!*\
  !*** ./resources/js/hoops/features/ModelTree.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ModelTree)
/* harmony export */ });
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var ModelTree = /*#__PURE__*/function () {
  function ModelTree(hwv, startdiv) {
    _classCallCheck(this, ModelTree);
    this._hwv = hwv;
    this._startelement = document.getElementById(startdiv);
    this._content = '';
    this._lastid = '';
  }
  _createClass(ModelTree, [{
    key: "generate",
    value: function generate() {
      this._content = '';
      var rootid = this._hwv.model.getAbsoluteRootNode();
      this.generateRecursive(rootid, 0);
      this._startelement.innerHTML = this._content;
    }
  }, {
    key: "generateRecursive",
    value: function generateRecursive(nodeId, level) {
      var type = this._hwv.model.getNodeType(nodeId);
      var offs = this._hwv.model.getNodeIdOffset(nodeId);
      var realNodeId = nodeId - offs;
      if (type === Communicator.NodeType.Part || type === Communicator.NodeType.PartInstance || type === Communicator.NodeType.AssemblyNode || type === Communicator.NodeType.BodyInstance) {
        this._content += "<p id=\"".concat(nodeId, "\" onclick=\"ModelTree.clicked(").concat(nodeId, ")\" style=\"margin-left: ").concat(level * 10, "px; cursor: pointer;\">").concat(this._hwv.model.getNodeName(nodeId), " NodeId: ").concat(realNodeId, "</p>");
        var children = this._hwv.model.getNodeChildren(nodeId);
        for (var i = 0; i < children.length; i++) {
          this.generateRecursive(children[i], level + 1);
        }
      }
    }
  }, {
    key: "clicked",
    value: function clicked(nodeid) {
      if (this._lastid !== '') {
        document.getElementById(this._lastid).style.color = 'black';
      }
      document.getElementById(nodeid).style.color = 'red';
      this._hwv.selectedPart(parseInt(nodeid));
      this._lastid = nodeid;
    }
  }]);
  return ModelTree;
}();


/***/ }),

/***/ "./resources/js/hoops/features/SelectOperator.js":
/*!*******************************************************!*\
  !*** ./resources/js/hoops/features/SelectOperator.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SelectOperator)
/* harmony export */ });
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _get() { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get.bind(); } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return _get.apply(this, arguments); }
function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
var SelectOperator = /*#__PURE__*/function (_Communicator$Operato) {
  _inherits(SelectOperator, _Communicator$Operato);
  var _super = _createSuper(SelectOperator);
  function SelectOperator(hwv) {
    var _this;
    _classCallCheck(this, SelectOperator);
    _this = _super.call(this);
    _this._hwv = hwv;
    return _this;
  }
  _createClass(SelectOperator, [{
    key: "onMouseDown",
    value: function onMouseDown(event) {
      var _this2 = this;
      var config = new Communicator.PickConfig(Communicator.SelectionMask.Face | Communicator.SelectionMask.Line);
      this._hwv.selectionManager.clear();
      this._hwv.view.pickFromPoint(event.getPosition(), config).then(function (selection) {
        if (selection.getNodeId() != null) {
          _this2._hwv.selectionManager.set(selection);
        }
      });
      _get(_getPrototypeOf(SelectOperator.prototype), "onMouseDown", this).call(this, event);
    }
  }]);
  return SelectOperator;
}(Communicator.Operator.Operator);


/***/ }),

/***/ "./resources/js/hoops/features/annotation/AnnotationOperator.js":
/*!**********************************************************************!*\
  !*** ./resources/js/hoops/features/annotation/AnnotationOperator.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AnnotationOperator)
/* harmony export */ });
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
var AnnotationOperator = /*#__PURE__*/function (_Communicator$Operato) {
  _inherits(AnnotationOperator, _Communicator$Operato);
  var _super = _createSuper(AnnotationOperator);
  function AnnotationOperator(viewer) {
    var _this;
    _classCallCheck(this, AnnotationOperator);
    _this = _super.call(this);
    _this.viewer = viewer;
    _this.isAnnotating = false;
    _this.markup = Communicator.Markup;
    return _this;
  }
  _createClass(AnnotationOperator, [{
    key: "onMouseDown",
    value: function onMouseDown() {
      if (!this.isAnnotating) {
        this.viewer.markupManager.activateMarkupViewWithPromise('test');
        this.isAnnotating = true;
        return;
      }
      var el = document.createElement('textarea');
      this.viewer.markupManager.addMarkupElement(el);
    }
  }]);
  return AnnotationOperator;
}(Communicator.Operator.Operator);


/***/ }),

/***/ "./resources/js/hoops/features/cutting/CuttingSection.js":
/*!***************************************************************!*\
  !*** ./resources/js/hoops/features/cutting/CuttingSection.js ***!
  \***************************************************************/
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
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
var CuttingOperator = /*#__PURE__*/function (_Communicator$Operato) {
  _inherits(CuttingOperator, _Communicator$Operato);
  var _super = _createSuper(CuttingOperator);
  function CuttingOperator(viewer) {
    var _this;
    _classCallCheck(this, CuttingOperator);
    _this = _super.call(this);
    _this.viewer = viewer;
    _this.handleOperator = _this.viewer.operatorManager.getOperator(Communicator.OperatorId.Handle);
    _this.pickConfig = new Communicator.PickConfig(Communicator.SelectionMask.Face);
    _this.handleSelected = false;
    _this.dragging = false;
    _this.dragCount = 0;
    _this.handleEventPromise = Promise.resolve();
    _this.activeCuttingPlane = null;
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
    _this.viewer.setCallbacks({
      handleEventStart: handleEventStartFunction,
      handleEvent: handleEventFunction,
      handleEventEnd: handleEventEndFunction,
      cuttingPlaneDrag: cuttingEvent,
      cuttingPlaneDragEnd: cuttingEventEnd
    });
    return _this;
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
              if (!(this.activeCuttingPlane !== null)) {
                _context4.next = 2;
                break;
              }
              return _context4.abrupt("return");
            case 2:
              _context4.next = 4;
              return this.viewer.view.pickFromPoint(event.getPosition(), this.pickConfig);
            case 4:
              selectionItem = _context4.sent;
              position = selectionItem.getPosition();
              faceEntity = selectionItem.getFaceEntity();
              if (!(position !== null && faceEntity !== null)) {
                _context4.next = 21;
                break;
              }
              normal = faceEntity.getNormal();
              _context4.next = 11;
              return this.viewer.model.getModelBounding(true, false);
            case 11:
              box = _context4.sent;
              plane = Communicator.Plane.createFromPointAndNormal(position, normal);
              this.activeCuttingPlane = plane.copy();
              cuttingManager = this.viewer.cuttingManager;
              cuttingSection = cuttingManager.getCuttingSection(0);
              referenceGeometry = cuttingManager.createReferenceGeometryFromFaceNormal(normal.copy(), position.copy(), box.copy());
              _context4.next = 19;
              return Promise.all([cuttingSection.addPlane(plane, referenceGeometry), cuttingSection.activate()]);
            case 19:
              nodeId = cuttingSection.getNodeId(0);
              if (nodeId !== null) {
                this.addHandles(position, normal, nodeId);
              }
            case 21:
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
}(Communicator.Operator.Operator);


/***/ }),

/***/ "./resources/js/hoops/features/measure/MeasureOperator.js":
/*!****************************************************************!*\
  !*** ./resources/js/hoops/features/measure/MeasureOperator.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MeasureBetweenPointsOperator)
/* harmony export */ });
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
var MeasureBetweenPointsOperator = /*#__PURE__*/function (_Communicator$Operato) {
  _inherits(MeasureBetweenPointsOperator, _Communicator$Operato);
  var _super = _createSuper(MeasureBetweenPointsOperator);
  function MeasureBetweenPointsOperator(hwv) {
    var _this;
    _classCallCheck(this, MeasureBetweenPointsOperator);
    _this = _super.call(this);
    _this._hwv = hwv;
    return _this;
  }
  _createClass(MeasureBetweenPointsOperator, [{
    key: "onMouseDown",
    value: function onMouseDown(event) {
      var config = new Communicator.PickConfig(Communicator.SelectionMask.Face | Communicator.SelectionMask.Line);
      this._hwv.selectionManager.clear();
      this._hwv.view.pickFromPoint(event.getPosition(), config).then(function (selectionItem) {
        if (selectionItem.getNodeId() !== null) {
          var position = selectionItem.getPosition();
        }
      });
    }
  }]);
  return MeasureBetweenPointsOperator;
}(Communicator.Operator.Operator);


/***/ }),

/***/ "./resources/js/hoops/features/texture/AddTexture.js":
/*!***********************************************************!*\
  !*** ./resources/js/hoops/features/texture/AddTexture.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AddTexture)
/* harmony export */ });
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var AddTexture = /*#__PURE__*/function () {
  function AddTexture(viewer) {
    _classCallCheck(this, AddTexture);
    this.viewer = viewer;
  }
  _createClass(AddTexture, [{
    key: "loadImage",
    value: function loadImage(filename) {
      var _this = this;
      var p = new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest();
        request.open('GET', filename, true);
        request.responseType = 'arraybuffer';
        request.onload = function () {
          if (request.readyState === 4) {
            if (request.status === 200) {
              resolve(request);
            }
          }
        };
        request.onerror = function (event) {
          reject(event);
        };
        request.send();
      });
      return p.then(function (request) {
        var imageOptions = {
          format: Communicator.ImageFormat.Png,
          data: new Uint8Array(request.response)
        };
        return _this.viewer.model.createImage(imageOptions);
      });
    }
  }]);
  return AddTexture;
}();


/***/ }),

/***/ "./resources/js/hoops/main.js":
/*!************************************!*\
  !*** ./resources/js/hoops/main.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AddTexture": () => (/* reexport safe */ _features_texture_AddTexture__WEBPACK_IMPORTED_MODULE_5__["default"]),
/* harmony export */   "CuttingOperator": () => (/* reexport safe */ _features_cutting_CuttingSection__WEBPACK_IMPORTED_MODULE_4__["default"]),
/* harmony export */   "MeasureOperator": () => (/* reexport safe */ _features_measure_MeasureOperator__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   "Menu": () => (/* reexport safe */ _features_Menu__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   "ModelTree": () => (/* reexport safe */ _features_ModelTree__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   "SelectOperator": () => (/* reexport safe */ _features_SelectOperator__WEBPACK_IMPORTED_MODULE_3__["default"])
/* harmony export */ });
/* harmony import */ var _features_measure_MeasureOperator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./features/measure/MeasureOperator */ "./resources/js/hoops/features/measure/MeasureOperator.js");
/* harmony import */ var _features_ModelTree__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./features/ModelTree */ "./resources/js/hoops/features/ModelTree.js");
/* harmony import */ var _features_Menu__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./features/Menu */ "./resources/js/hoops/features/Menu.js");
/* harmony import */ var _features_SelectOperator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./features/SelectOperator */ "./resources/js/hoops/features/SelectOperator.js");
/* harmony import */ var _features_cutting_CuttingSection__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./features/cutting/CuttingSection */ "./resources/js/hoops/features/cutting/CuttingSection.js");
/* harmony import */ var _features_texture_AddTexture__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./features/texture/AddTexture */ "./resources/js/hoops/features/texture/AddTexture.js");






console.log('impoorted', _features_texture_AddTexture__WEBPACK_IMPORTED_MODULE_5__["default"]);


/***/ })

}]);