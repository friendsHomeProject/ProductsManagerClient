import {
    Directive,
    Input
} from '@angular/core';

import {
    AbstractControl,
    NG_VALIDATORS,
    Validator
} from '@angular/forms';

@Directive({
    selector: '[rc-string-required][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: RequiredValidatorDirective, multi: true }
    ]
})
export class RequiredValidatorDirective implements Validator {

    @Input() errorMessage = 'VALIDATIONS.REQUIRED';

    validate(control: AbstractControl): { [validator: string]: string } {

        // if (String.isNullOrWhitespace(control.value)) {
        //     return { stringRequired: this.errorMessage };
        // }

        return null;
    }
}
