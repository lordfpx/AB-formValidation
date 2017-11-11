<h1 align="center">AB-formValidation</h1>

<p align="center">
AB-formValidation is a small, detpendency free, vanilla JavaScript component that validate fields and forms followinf the native HTML5 Form API. It's used (a customized version) on the French website of <a href="https://particuliers.engie.fr" target="_blank">ENGIE</a>.
</P>

<p align="center">
It's damn small: about <strong>1800 bytes</strong> (uglyfied and GZipped).
</p>

<p align="center">
Have a look at the <a href="https://codepen.io/lordfpx/pen/RgdygX?editors=0010" target="_blank">Codepen demonstration</a>.
</p>

<a href="https://codeclimate.com/github/lordfpx/AB-formValidation/maintainability"><img src="https://api.codeclimate.com/v1/badges/39290718f775d259c551/maintainability" /></a>


<h2 align="center">Install</h2>

Install with npm:
```
npm install --save ab-formvalidation
````

Install with yarn:
```
yarn add ab-formvalidation
```

You can then import it in your JS bundle (webpack, ES6, browserify...):
```js
import abFormValidation from 'ab-formvalidation';
```

Or loading the js right before `</body>` if you are not using a builder.



<h2 align="center">Setting up a Form</h2>

- `data-ab-form-validation` attribute must be placed on your `<form>` element.

- `data-ab-form-validation-submit` must be placed on the submit `<button type="submit">` or `<input type="submit">` element.

- run inside your JavaScript: `window.abFormValidation();`. If your form is injected with XMLHttpRequest, just run the same function again in the callback.



<h2 align="center">Defining default settings</h2>

Default settings for each fields can be defined in your HTML or in your Javascript, You can of course override those settings on each fields:

### HTML

```html
<form data-ab-form-validation='{
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
}'>
  ...
</form>
```

### JavaScript
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

### Options
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


<h2 align="center">Defining specific settings for a field</h2>

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


<h2 align="center">Events and public access</h2>

* FORM: an event is triggered on each form submit
  Real form submition (Ajax or not) is to be done on your side. To do so, listen to this specific event:

  ```js
  document.addEventListener('submit.ab-formvalidation', function(e) {
    // e.detail.form:  submited form
    // e.detail.valid: form validity (boolean)

    if (e.detail.valid) {
      e.detail.form.submit(); // or call your own Ajax function
    }
  });
  ```

* FIELD: check a specific field validity from your scripts
  ```js
  // select the parent with the data-ab-field-validation attribute
  var myField = document.querySelector('...');

  myField.abFieldValidation.checkValidity();
  // return true or false
  ```

* FIELD: set custom error status (after an Ajax validation for ex.)
  ```js
  // select the parent with the data-ab-field-validation attribute
  var myField = document.querySelector('...');

  myField.abFieldValidation.setCustomError('My custom error message');
  ```

* FIELD: an event is triggered on each field validation
  ```js
  document.addEventListener('checked.ab-fieldvalidation', function(e) {
    // e.detail.field: checked field
    // e.detail.valid: field validity (boolean)
  });
  ```
