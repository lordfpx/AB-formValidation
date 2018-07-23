/*!
 * AB-fieldValidation
 */

var AB = require('another-brick');

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

    this.errorEl.innerHTML = newList;

    this._updateDom();
  },

  // set custom error from outside (custom validation, ajax validation...)
  setCustomError: function(message) {
    this.inputEl.setCustomValidity(message);

    this.isValid = this.inputEl.validity.valid;
    this._updateDom();
    this.errorEl.innerHTML = '<li>'+ message +'</li>';
  },

  _updateDom: function() {
    this.inputEl.setAttribute('aria-invalid', !this.isValid);

    if (this.isValid) {
      this.errorEl.innerHTML = '';
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
