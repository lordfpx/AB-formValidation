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

/*!
 * AB-formValidation
 */

var AB                = __webpack_require__(0);
var abFieldValidation = __webpack_require__(2);

'use strict';

var defaults = {
    classValid:       'is-valid',
    classInvalid:     'isnt-valid',
    classBtnDisabled: 'is-disabled',

    typing:         false,
    submitDisabled: true,

    validations: {
      badInput:        'error: badInput',
      patternMismatch: 'error: patternMismatch',
      rangeOverflow:   'error: rangeOverflow',
      rangeUnderflow:  'error: rangeUnderflow',
      stepMismatch:    'error: stepMismatch',
      tooLong:         'error: tooLong',
      tooShort:        'error: tooShort',
      typeMismatch:    'error: typeMismatch',
      valueMissing:    'error: valueMissing'
    }
  };

function FormValidation(el, options) {
  this.el = el;

  var dataOptions = window.AB.isJson(this.el.getAttribute('data-ab-form-validation')) ? JSON.parse(this.el.getAttribute('data-ab-form-validation')) : {};
  this.settings   = window.AB.extend(true, defaults, options, dataOptions);

  this.submitBtn  = this.el.querySelector('[data-ab-form-validation-submit]');
  this.isValid    = this.el.checkValidity(); // form status

  if (!this.submitBtn) {
    console.warn('The submit button is missing');
    return;
  }

  this._init();
}

FormValidation.prototype = {
  _init: function() {
    // prepare fields validation
    window.abFieldValidation(this.el, this.settings);

    // prepare form
    this.el.setAttribute('novalidate', 'novalidate');
    this.submitBtn.classList.add(this.settings.classBtnDisabled);

    if (this.settings.submitDisabled)
      this.submitBtn.disabled = true;

    this._events();
  },

  _events: function() {
    this.el.addEventListener('submit', this._onSubmit.bind(this));
  },

  _onSubmit: function(e) {
    this._update(e);

    var fields = this.el.querySelectorAll('[data-ab-field-validation]');
    for (var i = 0, len = fields.length; i < len; i++) {
      fields[i].abFieldValidation.checkValidity('submit');
    }

    this.checkValidation();

    // trigger event for submit for external usage
    var event = new CustomEvent('submit.ab-formvalidation', {
      detail: {
        form: this.el,
        valid: this.isValid
      }
    });
    document.dispatchEvent(event);
  },

  // external usage to update form
  checkValidation: function() {
    this._update();
  },

  _update: function(e) {
    if (e) e.preventDefault(); // prevent submitting

    this.isValid = this.el.checkValidity();

    if (this.isValid)
      this.setValid();
    else
      this.setInvalid();
  },

  setValid: function() {
    this.submitBtn.classList.remove(this.settings.classBtnDisabled);
    if (this.settings.submitDisabled)
      this.submitBtn.disabled = false;

    this.el.classList.remove(this.settings.classInvalid);
    this.el.classList.add(this.settings.classValid);
  },

  setInvalid: function() {
    this.submitBtn.classList.add(this.settings.classBtnDisabled);
    if (this.settings.submitDisabled)
      this.submitBtn.disabled = true;

    this.el.classList.add(this.settings.classInvalid);
    this.el.classList.remove(this.settings.classValid);
  }
};

window.abFormValidation = function(options) {
  var elements = document.querySelectorAll('[data-ab-form-validation]');
  for (var i = 0, len = elements.length; i < len; i++) {
    if (elements[i].abFormValidation) continue;
    elements[i].abFormValidation = new FormValidation(elements[i], options);
  }
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/*!
 * AB-fieldValidation
 */

var AB = __webpack_require__(0);

'use strict';

function FieldValidation(el, options) {
  this.el = el;

  var dataOptions = window.AB.isJson(this.el.getAttribute('data-ab-field-validation')) ? JSON.parse(this.el.getAttribute('data-ab-field-validation')) : {};
  this.settings   = window.AB.extend(true, options, dataOptions);

  this.inputEls   = this.el.querySelectorAll('input, select, textarea');
  this.inputEl    = this.inputEls[0]; // no need to loop through inputs to get validity
  this.errorEl    = this.el.querySelector('[data-ab-field-validation-error]');
  this.formEl     = this.el.closest('[data-ab-form-validation]');
  this.isValid    = this.inputEl.validity.valid; // validity status

  this._init();
}

FieldValidation.prototype = {
  _init: function() {
    this._buildError()
        ._events();
  },

  _buildError: function() {
    if (!this.errorEl) {
      return this;
    }
    var errorList = document.createElement('ul'),
        errorId   = 'AB-'+ Math.random().toString(36); // random ID
    this.errorEl  = this.errorEl.appendChild(errorList);

    // accessibility
    this.errorEl.setAttribute('role', 'alert');
    this.errorEl.id = errorId; // for aria-describedby

    for (var i = 0, len = this.inputEls.length; i < len; i++) {
      this.inputEls[i].setAttribute('aria-describedby', errorId);
    }

    return this;
  },

  _events: function() {
    var that = this;

    // validation while typing
    if (this.settings.typing)
      this.inputEl.addEventListener('keyup', that.checkValidity.bind(that));

    for (var i = 0, len = this.inputEls.length; i < len; i++) {
      this.inputEls[i].addEventListener('change', that.checkValidity.bind(that));
    }
  },

  checkValidity: function(mode) {
    this.isValid = this.inputEl.validity.valid;

    // no validate in those cases
    if (!this.inputEl.willValidate || this.el.closest('[disabled]'))
      return this;

    this.isValid ?
      this._setValid() : this._setInvalid(mode);

    // trigger event for external usage
    var event = new CustomEvent('checked.ab-fieldvalidation', {
      detail: {
        field: this.el,
        valid: this.isValid
      }
    });
    document.dispatchEvent(event);

    // update form status (when submit, it's already done)
    if (mode !== 'submit')
      this.formEl.abFormValidation.checkValidation();
  },

  _setValid: function() {
    this._updateDom();
  },

  _setInvalid: function(mode) {
    var newList = ''; // error list

    // when submiting form we keep customError
    if (this.inputEl.validity.customError && mode === 'submit')
      return this;

    this.inputEl.setCustomValidity('');

    // building error list based on HTML5 form API
    for (var prop in this.inputEl.validity) {
      // don't check those informations
      if (prop === 'valid' || prop === 'customError')
        continue;

      if (this.inputEl.validity[prop])
        newList += '<li>'+ this.settings.validations[prop] +'</li>';
    }

    if (this.errorEl) {
      this.errorEl.innerHTML = newList;
    }

    this._updateDom();
  },

  // set custom error from outside (custom validation, ajax validation...)
  setCustomError: function(message) {
    this.inputEl.setCustomValidity(message);

    this.isValid = this.inputEl.validity.valid;
    this._updateDom();
    if (this.errorEl) {
      this.errorEl.innerHTML = '<li>'+ message +'</li>';
    }
  },

  _updateDom: function() {
    this.inputEl.setAttribute('aria-invalid', !this.isValid);

    if (this.isValid) {
      if (this.errorEl) {
        this.errorEl.innerHTML = '';
      }
      this.el.classList.add(this.settings.classValid);
      this.el.classList.remove(this.settings.classInvalid);
    } else {
      this.el.classList.add(this.settings.classInvalid);
      this.el.classList.remove(this.settings.classValid);
    }
  }
};

// prepare input inside that form
window.abFieldValidation = function(form, options) {
  var elements = form.querySelectorAll('[data-ab-field-validation]');
  for (var i = 0, len = elements.length; i < len; i++) {
    if (elements[i].abFieldValidation) continue;
    elements[i].abFieldValidation = new FieldValidation(elements[i], options);
  }
};


/***/ })
/******/ ]);