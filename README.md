# AB-formValidation

AB-formValidation is a vanilla JavaScript that validate forms. Simply use HTML5 form API and AB-formValidation validate.

It's damn small: about **1800 bytes** (uglyfied and GZipped).

- [codepen](https://codepen.io/lordfpx/pen/RgdygX?editors=0010)
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

## LOADING

### Classic usage
Just load the script on your page, just before `</body>`.

**No need to load [another-brick](https://github.com/lordfpx/AB) since it's already included. You can use its features of course (read respective readme).**

### As a module
The best solution is to use browserify or Webpack and import 'abFormValidation'.

```
import abFormValidation from 'ab-formvalidation';
```

---

## SETUP FORM

### DOM
* `data-ab-form-validation` must be placed on yout `<form>`.

* `data-ab-form-validation-submit` must be present on the submit `<button>` or `<input>`.

Then set default settings in the `data-ab-form-validation` attribute placed on your `<form>`. It must be in a JSON format:

```
data-ab-form-validation='{
  "classValid":       "is-valid",
  "classInvalid":     "isnt-valid",
  "classBtnDisabled": "is-disabled",
  "typing": false,
  "validations": {
    "badInput":        "error: badInput",
    "patternMismatch": "error: patternMismatch",
    "rangeOverflow":   "error: rangeOverflow",
    "rangeUnderflow":  "error: rangeUnderflow",
    "stepMismatch":    "error: stepMismatch",
    "tooLong":         "error: tooLong",
    "tooShort":        "error: tooShort",
    "typeMismatch":    "error: typeMismatch",
    "valueMissing":    "error: valueMissing"
  }
}'
```

* Personnalize dynamic classes:
  ```
  "classValid":       "is-valid",
  "classInvalid":     "isnt-valid",
  "classBtnDisabled": "is-disabled",
  ```

* Choose realtime field validation or not:
  ```
  "typing": false,
  ```

* Personalize error messages
  ```
  "validations": {
    "badInput":        "error: badInput",
    "patternMismatch": "error: patternMismatch",
    "rangeOverflow":   "error: rangeOverflow",
    "rangeUnderflow":  "error: rangeUnderflow",
    "stepMismatch":    "error: stepMismatch",
    "tooLong":         "error: tooLong",
    "tooShort":        "error: tooShort",
    "typeMismatch":    "error: typeMismatch",
    "valueMissing":    "error: valueMissing"
  }
  ```

You can override those settings on specific fields.

### JavaScript
Initialize it from your script:

```
window.abFormValidation();
```

If your form is injected with a XMLHttpRequest, just run the same function again.

---
## SETUP FIELDS
Only fields with `data-ab-field-validation` will be evaluated. Set specific settings in that attribute if needed.

```
data-ab-field-validation='{
  "typing": false,
  "validations": {
    "badInput":        "error: badInput",
    "patternMismatch": "error: patternMismatch",
    "rangeOverflow":   "error: rangeOverflow",
    "rangeUnderflow":  "error: rangeUnderflow",
    "stepMismatch":    "error: stepMismatch",
    "tooLong":         "error: tooLong",
    "tooShort":        "error: tooShort",
    "typeMismatch":    "error: typeMismatch",
    "valueMissing":    "error: valueMissing"
  }
}'
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

* If you want to Check a specific field validity from your scripts
  ```
  // select the parent with the data-ab-field-validation attribute
  var myField = document.querySelector('...');

  myField.abFieldValidation.checkValidity();
  ```

* To set custom error status on a field (after an ajax validation for ex.)
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
