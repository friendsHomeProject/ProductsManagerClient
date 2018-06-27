import {
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Optional,
    Output
} from '@angular/core';
import { NgModel } from '@angular/forms';
import { of as observableOf, Observable, Subscription } from 'rxjs';

import { ValueAccessorBase } from './value-accessor.base';
import {
    AsyncValidatorArray,
    ValidatorArray,
    ValidationResult,
    message,
    validate,
} from './validators/validate';
import { FormDirective } from './form-directive';
import { map } from 'rxjs/operators';

export abstract class ElementBase<T> extends ValueAccessorBase<T> implements OnInit, OnDestroy {

    @Input() autofocus = false;
    @Input() displayTooltipOnLabel = true;
    @Input() displayTooltipWhenOver = false;
    @Input() errorMessage: string;
    @Input() label = '';
    @Input() isAffectingDirty = true;
    @Input() tooltipPlacement = 'right';
    @Input() readonly = false;

    @Output() focusChanged = new EventEmitter();

    isInFocus: boolean;
    isOver: boolean;

    get hasError(): boolean {
        return (this.form && this.form.isSubmitted && this.isInFocus !== true) ||
            this.isInFocus === false;
    }

    get displayError(): boolean {

        if (this.displayTooltipWhenOver) {

            return this.hasError && this.isOver;
        }

        return this.hasError;
    }

    get tabIndex(): number {
        return this.disabled || this.readonly ? -1 : 0;
    }

    protected abstract model: NgModel;
    private eventSubscription: Subscription;

    constructor(protected el: ElementRef,
        @Optional() protected form: FormDirective,
        protected validators: ValidatorArray,
        protected asyncValidators: AsyncValidatorArray) {

        super();

    }

    ngOnInit() {
        if (!this.label || this.tooltipPlacement !== 'left') {
            this.displayTooltipOnLabel = false;
        }
    }

    ngOnDestroy() {
        if (this.form) {
            this.form.isSubmitted = false;
        }

        if (this.eventSubscription) {
            this.eventSubscription.unsubscribe();
        }
    }

    onFocusIn($event?: any) {
        this.isInFocus = true;
        this.focusChanged.emit(true);
    }

    onFocusOut($event?: any) {
        this.isInFocus = false;
        this.focusChanged.emit(false);
    }

    onMouseEnter($event?: any) {
        this.isOver = true;
    }

    onMouseLeave($event?: any) {
        this.isOver = false;
    }

    setIsDirty(isDirty) {
        if (!this.form || !this.isAffectingDirty) {
            return;
        }

        this.form.isDirty = isDirty;
    }

    protected onUnSubmitEventOccur() {
        this.isInFocus = undefined;
    }

    protected validate(): Observable<ValidationResult> {

        if (this.shouldNotCheckValidation()) {
            return observableOf(null);
        }

        return validate
            (this.validators, this.asyncValidators)
            (this.model.control);
    }

    get invalid(): Observable<boolean> {
        return this.validate().pipe(map(v => Object.keys(v || {}).length > 0));
    }

    get failures(): Observable<Array<string>> {
        return this.validate().pipe(map(v => Object.keys(v || {}).map(k => message(v, k, this.errorMessage))));
    }

    private shouldNotCheckValidation(): boolean {
        return this.model.control.disabled && !this.readonly;
    }

}
