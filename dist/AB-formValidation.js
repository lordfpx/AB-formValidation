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

// throttle events with requestAnimationFrame
(function() {
  var throttle = function(type, name) {
    var running = false;
    var func = function() {
      if (running) return;

      running = true;
        window.requestAnimationFrame(function() {
          window.dispatchEvent(new CustomEvent(name));
          running = false;
      });
    };
    window.addEventListener(type, func);
  };

  /* init - you can init any event */
  throttle("resize", "ab-resize");
  throttle("scroll", "ab-scroll");
  throttle("mousemove", "ab-mousemove");
  throttle("touchmove", "ab-touchmove");
})();


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

  runUpdaters: function(plugin) {
    if (window.AB.options[plugin]) {
      window.AB.plugins[plugin](window.AB.options[plugin]);
    } else {
      for(var options in AB.options){
        if(window.AB.options.hasOwnProperty(options))
          window.AB.plugins[options](window.AB.options[options]);
      }
    }
  },

  plugins: {},
  options: {}
};

module.exports = window.AB;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * AB-formValidation
 */



window.AB = __webpack_require__(0);
var fieldValidation = __webpack_require__(2);

var pluginName = 'formValidation',
    attr       = 'data-ab-form-validation',
    defaultSettings = {
      classValid:       'is-valid',
      classInvalid:     'isnt-valid',
      classBtnDisabled: 'is-disabled',

      typing:         false,
      submitDisabled: false,

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

var _onSubmit = function(e) {
  this._update(e);

  var fields = this.el.querySelectorAll('[data-ab-field-validation]');
  for (var i = 0, len = fields.length; i < len; i++) {
    fields[i].fieldValidation.checkValidity('submit');
  }

  // trigger event for submit for external usage
  var event = new CustomEvent('submit.ab-formvalidation', {
    detail: {
      form: this.el,
      valid: this.isValid
    }
  });
  document.dispatchEvent(event);
};

var _init = function() {
  // prepare fields validation
  fieldValidation(this.settings);

  // prepare form
  this.el.setAttribute('novalidate', 'novalidate');

  if (this.settings.submitDisabled && !this.isValid) {
    this.submitBtn.classList.add(this.settings.classBtnDisabled);
    this.submitBtn.disabled = true;
  }

  this.el.addEventListener('submit', _onSubmit.bind(this));
};

var _update = function(e) {
  if (e && !this.isValid)
    e.preventDefault(); // prevent submitting

  this.isValid = this.el.checkValidity();

  if (this.isValid)
    this.setValid();
  else
    this.setInvalid();
};

var Plugin = function(el, options) {
  this.el = el;

  var dataOptions = window.AB.isJson(this.el.getAttribute(attr)) ? JSON.parse(this.el.getAttribute(attr)) : {};
  this.settings   = window.AB.extend(true, defaultSettings, options, dataOptions);

  this.submitBtn  = this.el.querySelector('[data-ab-form-validation-submit]');
  this.isValid    = this.el.checkValidity(); // form status

  if (!this.submitBtn) {
    console.warn('The submit button is missing');
    return;
  }

  _init.call(this);
};

Plugin.prototype = {
  // external usage to update form
  checkValidation: function() {
    _update.call(this);
  },

  setValid: function() {
    if (this.settings.submitDisabled) {
      this.submitBtn.classList.remove(this.settings.classBtnDisabled);
      this.submitBtn.disabled = false;
    }

    this.el.classList.remove(this.settings.classInvalid);
    this.el.classList.add(this.settings.classValid);
  },

  setInvalid: function() {
    if (this.settings.submitDisabled) {
      this.submitBtn.classList.add(this.settings.classBtnDisabled);
      this.submitBtn.disabled = true;
    }

    this.el.classList.add(this.settings.classInvalid);
    this.el.classList.remove(this.settings.classValid);
  }
};

var formValidation = function(options) {
  var elements = document.querySelectorAll('['+ attr +']');
  for (var i = 0, len = elements.length; i < len; i++) {
    if (elements[i][pluginName])
      continue;
    elements[i][pluginName] = new Plugin(elements[i], options);
  }

  // register plugin and options
  if (!window.AB.options[pluginName])
    window.AB.options[pluginName] = options;
};

window.AB.plugins.formValidation = formValidation;
module.exports = window.AB;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * AB-fieldValidation
 */



window.AB = __webpack_require__(0);

var pluginName = 'fieldValidation',
    attr       = 'data-ab-field-validation';

var _init = function() {
  _buildError.call(this);
  _events.call(this);
};

var _buildError = function() {
  if (!this.errorEl)
    return;

  var errorList = document.createElement('ul'),
      errorId   = 'AB-'+ Math.random().toString(36); // random ID

  this.errorEl  = this.errorEl.appendChild(errorList);

  // accessibility
  this.errorEl.setAttribute('role', 'alert');
  this.errorEl.id = errorId; // for aria-describedby

  for (var i = 0, len = this.inputEls.length; i < len; i++) {
    this.inputEls[i].setAttribute('aria-describedby', errorId);
  }
};

var _events = function() {
  // validation while typing
  if (this.settings.typing)
    this.inputEl.addEventListener('keyup', this.checkValidity.bind(this));

  for (var i = 0, len = this.inputEls.length; i < len; i++) {
    this.inputEls[i].addEventListener('change', this.checkValidity.bind(this));
  }
};

var _updateDom = function() {
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
};

var _setValid = function() {
  _updateDom.call(this);
};

var _setInvalid = function(mode) {
  var newList = ''; // error list

  // when submiting form we keep customError
  if (this.inputEl.validity.customError && mode === 'submit')
    return;

  this.inputEl.setCustomValidity('');

  // building error list based on HTML5 form API
  for (var prop in this.inputEl.validity) {
    if (!this.inputEl.validity.hasOwnProperty(prop))
      continue;

    // don't check those informations
    if (prop === 'valid' || prop === 'customError')
      continue;

    if (this.inputEl.validity[prop])
      newList += '<li>'+ this.settings.validations[prop] +'</li>';
  }

  if (this.errorEl) {
    this.errorEl.innerHTML = newList;
  }

  _updateDom.call(this);
};

var Plugin = function(el, options) {
  this.el = el;

  var dataOptions = window.AB.isJson(this.el.getAttribute(attr)) ? JSON.parse(this.el.getAttribute(attr)) : {};
  this.settings   = window.AB.extend(true, options, dataOptions);

  this.inputEls   = this.el.querySelectorAll('input, select, textarea');
  this.inputEl    = this.inputEls[0]; // no need to loop through inputs to get validity
  this.errorEl    = this.el.querySelector('[data-ab-field-validation-error]');
  this.formEl     = this.el.closest('[data-ab-form-validation]');
  this.isValid    = this.inputEl.validity.valid; // validity status

  _init.call(this);
};

Plugin.prototype = {
  checkValidity: function(mode) {
    this.isValid = this.inputEl.validity.valid;

    // no validate in those cases
    if (!this.inputEl.willValidate || this.el.closest('[disabled]'))
      return this;

    this.isValid ? _setValid.call(this) : _setInvalid.call(this, mode);

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
      this.formEl.formValidation.checkValidation();
  },

  // set custom error from outside (custom validation, ajax validation...)
  setCustomError: function(message) {
    this.inputEl.setCustomValidity(message);

    this.isValid = this.inputEl.validity.valid;
    _updateDom.call(this);

    if (this.errorEl) {
      this.errorEl.innerHTML = '<li>'+ message +'</li>';
    }
  }
};

var fieldValidation = function(options) {
  var elements = document.querySelectorAll('['+ attr +']');
  for (var i = 0, len = elements.length; i < len; i++) {
    if (elements[i][pluginName])
      continue;
    elements[i][pluginName] = new Plugin(elements[i], options);
  }
};

module.exports = fieldValidation;


/***/ })
/******/ ]);