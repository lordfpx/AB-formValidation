/*!
 * AB-formValidation
 */

'use strict';

window.AB = require('another-brick');
var fieldValidation = require('./AB-fieldValidation');

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
