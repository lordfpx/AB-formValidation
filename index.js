var AB = require('another-brick');
var abFieldValidation = require('./AB-fieldValidation');

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