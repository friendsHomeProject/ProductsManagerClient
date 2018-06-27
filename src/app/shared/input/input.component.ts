import {
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    Inject,
    Input,
    Optional,
    Output,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {
    NgModel,
    NG_VALIDATORS,
    NG_ASYNC_VALIDATORS,
    NG_VALUE_ACCESSOR
} from '@angular/forms';

import { ElementBase } from '../element.base';
import { COMPONENT_TOKEN } from '../component.token';
import { FormDirective } from '../form-directive';

@Component({
    selector: 'pm-input',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: InputComponent,
        multi: true,
    },
    {
        provide: COMPONENT_TOKEN,
        useExisting: forwardRef(() => InputComponent)
    }],
    encapsulation: ViewEncapsulation.None
})
export class InputComponent extends ElementBase<string> {

    @Input() displayPasswordStrength = false;
    @Input() inputType = 'text';
    @Input() direction = 'HTML.DIR';
    @Input() maxLength = 64;
    @Input() placeholder = '';
    @Input() popoverMessage: string;
    @Input() popoverType = 'info';
    @Input() defaultTitle = '';
    @Input() autoCompleteState: string;
    @Output() keyUp = new EventEmitter<any>();
    @ViewChild(NgModel) model: NgModel;

    constructor(el: ElementRef,
        @Optional() form: FormDirective,
        @Optional() @Inject(NG_VALIDATORS) validators: Array<any>,
        @Optional() @Inject(NG_ASYNC_VALIDATORS) asyncValidators: Array<any>
    ) {
        super(el, form, validators, asyncValidators);
    }

    onFocusIn($event?: any) {
        this.el.nativeElement.getElementsByClassName('form-control')[0].removeAttribute('readonly');
        $event.target.select();
        super.onFocusIn($event);
    }

    onFocusOut($event?: any) {

        if (this.value) {
            this.value = this.value.trim();
        }

        super.onFocusOut($event);
    }

    onKeyUp() {
        this.keyUp.emit(this);

    }

    setInputDirty(event) {
        // if (!(String.isNullOrWhitespace(event) && String.isNullOrWhitespace(this.value))) {

        //     super.setIsDirty(true);
        // }

        this.value = event;

    }

    displayTitle(element) {
        // return !String.isNullOrWhitespace(this.value) &&
        //     this.inputType !== 'password';
    }

}
