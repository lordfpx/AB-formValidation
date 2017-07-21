# AB-formValidation

## formValidation
Set default settings in data-ab-form-validation
{
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
}


## fieldValidation
Set specific field settings in data-ab-form-validation.
{
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
}

$0.fieldValidation.checkValidity();
Check validation on current field

$0.fieldValidation.setCustomError('My custom error message');
Set the field invalid with your message

document.addEventListener('onFieldValidation', ...);
event triggered when a field is validated.
event.detail return the field instance of AB-fieldValidation with all informations


