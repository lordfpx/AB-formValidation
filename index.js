/*!
 * AB-formValidation
 */

/*
TODO:
- prevent form validation on server side error
*/

var AB                = require('another-brick');
var abFieldValidation = require('./AB-fieldValidation');

'use strict';

var defaults = {
    classValid:       'is-valid',
    classInvalid:     'isnt-valid',
    classBtnDisabled: 'is-disabled',

    typing: false,

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

    this._events();
  },

  _events: function() {
    var that = this;

    that.el.addEventListener('submit', that._onSubmit.bind(that));
  },

  _onSubmit: function(e) {
    this._update(e);

    var fields = this.el.querySelectorAll('[data-ab-field-validation]');
    for (var i = 0, len = fields.length; i < len; i++) {
      fields[i].abFieldValidation.checkValidity('submit');
    }

    this.checkValidation();

    // trigger event for submit for external usage
    var event = new CustomEvent('submit.ab-formvalidation', { detail: this });
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
    this.el.classList.remove(this.settings.classInvalid);
    this.el.classList.add(this.settings.classValid);
  },

  setInvalid: function() {
    this.submitBtn.classList.add(this.settings.classBtnDisabled);
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