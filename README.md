# AB-formValidation

AB-formValidation is a vanilla JavaScript that validate forms. Simply use HTML5 form API and AB-formValidation validate.

It's damn small: about **1800 bytes** (uglyfied and GZipped).

- [codepen](hhttps://codepen.io/lordfpx/pen/RgdygX?editors=0010)
- [NPM](https://www.npmjs.com/package/ab-formvalidation)

```
> npm install ab-formvalidation
```
or
```
> yarn add ab-formvalidation
```

It's used (a customized version) on French website [ENGIE](https://particuliers.engie.fr/).

---

## setup
Set default settings in data-ab-form-validation attribute

```
{
  // You can use your own classes
  classValid:       'is-valid',
  classInvalid:     'isnt-valid',
  classBtnDisabled: 'is-disabled',

  // default realtime validation
  typing: false,

  // default validation messages
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
}
```

You can override those settings on specific fields.

---
## setup specific field validation
Set specific field settings in data-ab-field-validation attribute.

```
{
  // realtime validation
  typing: false,

  // validation messages
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
}
```

---
## External access

* FORM: an event is triggered on each form submit
  Real form submition (ajax or not) is to be done on your side. To do so, listen to this specific event:

  ```
  document.addEventListener('submit.ab-formvalidation', function(event) {
    // event.detail.form: submited form
    // event.detail.valid: form validity (boolean)
  });
  ```

  example:
  ```
  document.addEventListener('submit.ab-formvalidation', function(event) {
    if (event.detail.valid) {
      event.detail.form.submit();

      // or call your own function for ajax
    }
  });
  ```

* Check field validity from your scripts
  ```
  // select the parent with the data-ab-field-validation attribute
  var myField = document.querySelector('...');

  myField.abFieldValidation.checkValidity();
  ```

* Set custom error status on a field
  ```
  // select the parent with the data-ab-field-validation attribute
  var myField = document.querySelector('...');

  myField.abFieldValidation.setCustomError('My custom error message');
  ```

* FIELD: an event is triggered on each field validation
  ```
  document.addEventListener('checked.ab-fieldvalidation', function(event) {
    // event.detail.field: checked field
    // event.detail.valid: field validity (boolean)
  });
  ```
