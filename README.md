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

It's used (customized version) on French website [ENGIE](https://particuliers.engie.fr/).

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

You can bypass these settings for specific fields.


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

## External access
That allows you to add custom field validation on your side or to set server side custom errors.

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

* field: an event is triggered on each field validation
  ```
  document.addEventListener('checked.ab-fieldvalidation', function(event) {
    console.log('event.detail');
    // return all informations on the checked field
  });
  ```

* form: an event is triggered on each form submit
  ```
  document.addEventListener('submit.ab-formvalidation', function(event) {
    console.log('event.detail');
    // return all informations on the submited form
  });
  ```


