# **AB-formValidation**

**AB-formValidation** is a small, dependency free and vanilla script to validate forms and each fields based on the native HTML5 Form API.

It's damn small: about **1800 bytes** (uglyfied and GZipped).

A customized version is used on French websites of [ENGIE](https://particuliers.engie.fr) and [Gaz tarif règlementé](https://gaz-tarif-reglemente.fr/).


Have a look at the [CodePen demonstration](https://codepen.io/lordfpx/pen/RgdygX?editors=0010).

[![Maintainability](https://codeclimate.com/github/lordfpx/AB-formValidation/maintainability)](https://api.codeclimate.com/v1/badges/39290718f775d259c551/maintainability)

---

## **Install**

```bash
npm install --save ab-formvalidation
````

---

## **Setup**

Import it in your JS bundle (webpack, ES6, browserify…):

```js
import abFormValidation from 'ab-formvalidation';
```

(If you are not building your assets, simply load the script `AB-formValidation.min.js` in the `dist` folder.)

---

## **Setting up a Form**

- `data-ab-form-validation` attribute must be placed on your `<form>` element.

- `data-ab-form-validation-submit` must be placed on the submit `<button type="submit">` or `<input type="submit">` element.

- run inside your JavaScript: `window.AB.plugins.formValidation(settings);`.


### HTML

```HTML
<form data-ab-form-validation>
  …

  <button type="submit" data-ab-form-validation-submit>Send</button>
</form>
```

### JavaScript

Default settings for all fields can be set when initializing the script:

```js
{
  classValid:        "is-valid",
  classInvalid:      "isnt-valid",
  classBtnDisabled:  "is-disabled",
  typing:            false,
  submitDisabled:    false,
  validations: {
    badInput:        "error: badInput",
    patternMismatch: "error: patternMismatch",
    rangeOverflow:   "error: rangeOverflow",
    rangeUnderflow:  "error: rangeUnderflow",
    stepMismatch:    "error: stepMismatch",
    tooLong:         "error: tooLong",
    tooShort:        "error: tooShort",
    typeMismatch:    "error: typeMismatch",
    valueMissing:    "error: valueMissing"
  }
}
```

They can be changed when initializing AB-formValidation:
```js
window.AB.plugins.formValidation({
  submitDisabled: true,
  validations: {
    valueMissing: "This field is required"
  }
});
```

Or on each form with `data-ab-form-validation` attribute:
```HTML
<form data-ab-form-validation='{
  "submitDisabled": true,
  "validations": {
    "valueMissing": "This field is required"
  }
}'>
  …
</form>
```

---

## **Options explained**
* Personnalize dynamic classes for your styling:
  ```js
  "classValid":       "is-valid",
  "classInvalid":     "isnt-valid",
  "classBtnDisabled": "is-disabled",
  ```

* Choose realtime field validation (while typing) or not (onChange):
  ```js
  "typing": false,
  ```

* You can disabled the submit button when the form is invalid by changing to `true`:
  ```js
  "submitDisabled": false,
  ```

* Personalize all error messages triggered by HTML5 Form API:
  ```js
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

---

## **More interesting: define settings on each field**

Only fields with `data-ab-field-validation` will be evaluated. Set specific settings in that attribute if needed.

```html
<xxx data-ab-field-validation='{
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
}'>
```

---

## **Events and public access**

* **FORM**: an event is triggered on each form submit.
  Real form submition (AJAX or not) is to be done on your side that way:

  ```js
  document.addEventListener('submit.ab-formvalidation', function(e) {
    // e.detail.form:  submited form
    // e.detail.valid: form validity (boolean)

    if (e.detail.valid) {
      e.detail.form.submit(); // or call your own AJAX function
    }
  });
  ```

* **FIELD**: check a specific field validity from your scripts
  ```js
  // select the parent with the data-ab-field-validation attribute
  var myFieldNode = document.querySelector('…');

  myFieldNode.fieldValidation.checkValidity();
  // return true or false
  ```

* **FIELD**: set custom error status (after an AJAX validation for ex.)
  ```js
  myFieldNode.fieldValidation.setCustomError('My custom error message'); // add custom error

  myFieldNode.fieldValidation.setCustomError('My custom error message'); // remove custom error
  ```

* **FIELD**: an event is triggered on each field validation
  ```js
  document.addEventListener('checked.ab-fieldvalidation', function(e) {
    // e.detail.field: checked field
    // e.detail.valid: field validity (boolean)
  });
  ```
