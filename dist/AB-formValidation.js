/******/ (function(modules) { // webpackBootstrap
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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

// polyfill customEvent pour IE
;(function() {
  if ( typeof window.CustomEvent === "function" ) return false;
  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }
  CustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent;
})();

// main public AB object
window.AB = {
  // deep extend function
  extend: function() {
    var extended = {},
        deep     = false,
        i        = 0,
        length   = arguments.length;

    if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]'){
      deep = arguments[0];
      i++;
    }

    var merge = function(obj) {
      for (var prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
          if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
            extended[prop] = window.AB.extend(true, extended[prop], obj[prop]);
          } else {
            extended[prop] = obj[prop];
          }
        }
      }
    };

    for (; i < length; i++) {
      merge(arguments[i]);
    }

    return extended;
  },

  // test if a string is a JSON
  isJson: function(str) {
    try {
      JSON.parse(str);
    } catch(e) {
      return false;
    }
    return true;
  },

  plugins: {}
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var AB = __webpack_require__(0);
var abFieldValidation = __webpack_require__(2);

'use strict';

var defaults = {
    classFormValid: 'is-valid-form',
    classFormInvalid: 'is-invalid-form',
    classInputValid: 'is-valid',
    classInputInvalid: 'is-invalid',
    classBtnDisabled: 'is-disabled',

    typing: false,

    validations: {
      badInput: 'error: badInput',
      patternMismatch: 'error: patternMismatch',
      rangeOverflow: 'error: rangeOverflow',
      rangeUnderflow: 'error: rangeUnderflow',
      stepMismatch: 'error: stepMismatch',
      tooLong: 'error: tooLong',
      tooShort: 'error: tooShort',
      typeMismatch: 'error: typeMismatch',
      valueMissing: 'error: valueMissing'
    }
  };

function FormValidation(el, options) {
  this.el = el;

  var dataOptions = window.AB.isJson(this.el.getAttribute('data-form-validation')) ? JSON.parse(this.el.getAttribute('data-form-validation')) : {};
  this.settings   = window.AB.extend(true, defaults, options, dataOptions);

  this.submitBtn  = this.el.querySelector('[data-form-validation-submit]');
  this.isValid    = this.el.checkValidity(); // form status

  this._init();
}

FormValidation.prototype = {
  _init: function() {
    // prepare fields
    window.abFieldValidation(this.el, this.settings);

    // prepare form
    this.el.setAttribute('novalidate', 'novalidate');
    this.submitBtn.classList.add(this.settings.classBtnDisabled);

    this._events();
  },

  _events: function() {
    var that = this;

    that.el.addEventListener('submit', that.onSubmit.bind(that));
  },

  onSubmit: function(e) {
    this._update(e);

    var fields = this.el.querySelectorAll('[data-field-validation]');
    for (var i = 0, len = fields.length; i < len; i++) {
      fields[i].fieldValidation.checkValidity('submit');
    }

    var event = new CustomEvent('onFormValidationSubmit', { detail: this });
    document.dispatchEvent(event);
  },

  // external usage to update form
  checkValidation: function() {
    this._update();
  },

  _update: function(e) {
    this.isValid = this.el.checkValidity();

    if (this.isValid) {
      this.setValid();
    } else {
      if (e) e.preventDefault(); // prevent submitting
      this.setInvalid();
    }
  },

  setValid: function() {
    this.submitBtn.classList.remove(this.settings.classBtnDisabled);
    this.el.classList.remove(this.settings.classFormInvalid);
    this.el.classList.add(this.settings.classFormValid);
  },

  setInvalid: function() {
    this.submitBtn.classList.add(this.settings.classBtnDisabled);
    this.el.classList.add(this.settings.classFormInvalid);
    this.el.classList.remove(this.settings.classFormValid);
  }
};

window.abFormValidation = function(options) {
  var elements = document.querySelectorAll('[data-form-validation]');
  for (var i = 0, len = elements.length; i < len; i++) {
    if (elements[i].formValidation) continue;
    elements[i].formValidation = new FormValidation(elements[i], options);
  }
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var AB = __webpack_require__(0);

'use strict';

function FieldValidation(el, options) {
  this.el = el;

  var dataOptions = window.AB.isJson(this.el.getAttribute('data-field-validation')) ? JSON.parse(this.el.getAttribute('data-field-validation')) : {};
  this.settings   = window.AB.extend(true, options, dataOptions);

  this.inputEls   = this.el.querySelectorAll('input, select, textarea');
  this.inputEl    = this.inputEls[0]; // no need to loop through inputs to get validity
  this.errorEl    = this.el.querySelector('[data-field-validation-error]');
  this.formEl     = this.el.closest('[data-form-validation]');
  this.isValid    = this.inputEl.validity.valid; // validity status

  this._init();
}

FieldValidation.prototype = {
  _init: function() {
    this._buildError()
        ._events();
  },

  _buildError: function() {
    var errorList = document.createElement('ul'),
        errorId   = 'AB-'+ Math.random().toString(36); // random ID
    this.errorEl  = this.errorEl.appendChild(errorList);

    this.errorEl.setAttribute('role', 'alert');
    this.errorEl.id = errorId; // for aria-describedby

    for (var i = 0, len = this.inputEls.length; i < len; i++) {
      this.inputEls[i].setAttribute('aria-describedby', errorId);
    }

    return this;
  },

  _events: function() {
    var that = this;

    if (this.settings.typing)
      this.inputEl.addEventListener('keyup', that.checkValidity.bind(that));

    for (var i = 0, len = this.inputEls.length; i < len; i++) {
      this.inputEls[i].addEventListener('change', that.checkValidity.bind(that));
    }
  },

  checkValidity: function(mode) {
    var keyupOnEmptyField = (mode.type && mode.type === 'keyup' && !this.inputEl.value);
    this.isValid = this.inputEl.validity.valid;

    // no need to check when...
    if (keyupOnEmptyField)
      return this;

    this.isValid ?
      this._setValid() : this._setInvalid(mode);

    // trigger event for external usage
    var event = new CustomEvent('onFieldValidation', { detail: this });
    document.dispatchEvent(event);

    // update form status
    this.formEl.formValidation.checkValidation();
  },

  _setValid: function() {
    this._updateDom();
  },

  _setInvalid: function(mode) {
    var newList = '';

    if (this.inputEl.validity.customError && mode === 'submit')
      newList = this.errorEl.innerHTML;
    else
      this.inputEl.setCustomValidity('');

    // building error list
    for (var prop in this.inputEl.validity) {
      if (prop === 'valid' || prop === 'customError')
        continue;

      if (this.inputEl.validity[prop])
        newList += '<li>'+ this.settings.validations[prop] +'</li>';
    }

    this.errorEl.innerHTML = newList;

    this._updateDom();
  },

  // set custom error from outside (custom validation, ajax validation...)
  setCustomError: function(message) {
    this.inputEl.setCustomValidity(message);

    this.isValid = this.inputEl.validity.valid;
    this.updateDom();
    this.errorEl.innerHTML = '<li>'+ message +'</li>';
  },

  _updateDom: function() {
    this.inputEl.setAttribute('aria-invalid', !this.isValid);

    if (this.isValid) {
      this.errorEl.innerHTML = '';
      this.el.classList.add(this.settings.classInputValid);
      this.el.classList.remove(this.settings.classInputInvalid);
    } else {
      this.el.classList.add(this.settings.classInputInvalid);
      this.el.classList.remove(this.settings.classInputValid);
    }
  }
};

// prepare input inside that form
window.abFieldValidation = function(form, options) {
  var elements = form.querySelectorAll('[data-field-validation]');
  for (var i = 0, len = elements.length; i < len; i++) {
    if (elements[i].fieldValidation) continue;
    elements[i].fieldValidation = new FieldValidation(elements[i], options);
  }
};

/***/ })
/******/ ]);