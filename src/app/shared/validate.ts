import {
  AbstractControl,
  AsyncValidatorFn,
  Validator,
  Validators,
  ValidatorFn,
} from '@angular/forms';

import { of as observableOf, Observable } from 'rxjs';

export interface ValidationResult { [validator: string]: string | boolean; }

export type AsyncValidatorArray = Array<Validator | AsyncValidatorFn>;

export type ValidatorArray = Array<Validator | ValidatorFn>;

const normalizeValidator =
  (validator: Validator | ValidatorFn): ValidatorFn | AsyncValidatorFn => {
    const func = (validator as Validator).validate.bind(validator);
    if (typeof func === 'function') {
      return (c: AbstractControl) => func(c);
    } else {
      return <ValidatorFn | AsyncValidatorFn>validator;
    }
  };

export const composeValidators =
  (validators: ValidatorArray): AsyncValidatorFn | ValidatorFn => {
    if (validators == null || validators.length === 0) {
      return null;
    }
    return Validators.compose(validators.map(normalizeValidator));
  };

export const validate =
  (validators: ValidatorArray, asyncValidators: AsyncValidatorArray) => {
    return (control: AbstractControl) => {
      const synchronousValid = () => composeValidators(validators)(control);

      if (asyncValidators) {
        const asyncValidator = composeValidators(asyncValidators);

        return asyncValidator(control).map(v => {
          const secondary = synchronousValid();
          if (secondary || v) { // compose async and sync validator results
            return Object.assign({}, secondary, v);
          }
        });
      }

      if (validators) {
        return observableOf(synchronousValid());
      }

      return observableOf(null);
    };
  };

export const message = (validator: ValidationResult, key: string, errorMessage: string): string => {

  if (key === 'required') {
    return 'VALIDATIONS.REQUIRED';
  }

  // Try set the error message from the validator.
  if (typeof validator[key] === 'string') {
    errorMessage = <string>validator[key];
  }

  // When the validator is not custom return the errorMessage from the element.
  return errorMessage;
};
