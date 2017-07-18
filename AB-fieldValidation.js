var AB = require('another-brick');

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