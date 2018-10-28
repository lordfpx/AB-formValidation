/*!
 * AB-fieldValidation
 */

'use strict';

window.AB = require('another-brick');

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
