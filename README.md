# AB-formValidation

AB-formValidation is a small, detpendency free, vanilla JavaScript component that validate fields and forms following the native HTML5 Form API. It's used (a customized version) on the French website of [ENGIE](https://particuliers.engie.fr).

It's damn small: about **1800 bytes** (uglyfied and GZipped).

Have a look at the [CodePen demonstration](https://codepen.io/lordfpx/pen/RgdygX?editors=0010).

[![Maintainability](https://codeclimate.com/github/lordfpx/AB-formValidation/maintainability)](https://api.codeclimate.com/v1/badges/39290718f775d259c551/maintainability)



## Install

Install with npm:
```bash
npm install --save ab-formvalidation
````

Install with yarn:
```bash
yarn add ab-formvalidation
```

You can then import it in your JS bundle (webpack, ES6, browserify…):
```js
import abFormValidation from 'ab-formvalidation';
```

Or loading the .js file right before `</body>` if you are not using a builder.



## Setting up a Form

- `data-ab-form-validation` attribute must be placed on your `<form>` element.

- `data-ab-form-validation-submit` must be placed on the submit `<button type="submit">` or `<input type="submit">` element.

- run inside your JavaScript: `window.abFormValidation();`. If your form is injected with XMLHttpRequest, you can run the same function again in the callback.


### HTML

```HTML
<form data-ab-form-validation>
  …

  <button type="submit" data-ab-form-validation-submit>Send</button>
</form>
```

### JavaScript

Default settings for checked fields can be set when initializing the script:

```js
window.abFormValidation({
  "classValid":        "is-valid",
  "classInvalid":      "isnt-valid",
  "classBtnDisabled":  "is-disabled",
  "typing":            false,
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
});
```

### Options explained
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

* Personalize error messages triggered by HTML5 Form API:
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


## More interesting: define settings for a field

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


## Events and public access

* FORM: an event is triggered on each form submit
  Real form submition (AJAX or not) is to be done on your side. To do so, listen to this specific event:

  ```js
  document.addEventListener('submit.ab-formvalidation', function(e) {
    // e.detail.form:  submited form
    // e.detail.valid: form validity (boolean)

    if (e.detail.valid) {
      e.detail.form.submit(); // or call your own AJAX function
    }
  });
  ```

* FIELD: check a specific field validity from your scripts
  ```js
  // select the parent with the data-ab-field-validation attribute
  var myField = document.querySelector('…');

  myField.abFieldValidation.checkValidity();
  // return true or false
  ```

* FIELD: set custom error status (after an AJAX validation for ex.)
  ```js
  // select the parent with the data-ab-field-validation attribute
  var myField = document.querySelector('…');

  myField.abFieldValidation.setCustomError('My custom error message');
  ```

* FIELD: an event is triggered on each field validation
  ```js
  document.addEventListener('checked.ab-fieldvalidation', function(e) {
    // e.detail.field: checked field
    // e.detail.valid: field validity (boolean)
  });
  ```
