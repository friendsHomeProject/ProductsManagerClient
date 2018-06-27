import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ConfirmModule, ConfirmOptions, Position} from './../../confirm';
import { TranslateModule, TranslateService, TranslateLoader } from '@ngx-translate/core';

import { InputComponent } from './input.component';
import { LiteSharedModule } from './../../../lite-shared.module';

describe('Component: InputComponent', () => {

    beforeEach(() => {

        TestBed.configureTestingModule({
            imports: [LiteSharedModule.forRoot()]
        });
    });

    it('ngOnInit set inputType property text when is undefined', () => {

        let fixture = TestBed.createComponent(InputComponent);

        fixture.detectChanges();

        let component = fixture.debugElement.componentInstance;

        expect(component.input.nativeElement.type).toEqual('text');
    });

    it('ngOnInit not change inputType property when is defined', () => {

        let inputType = 'number';
        let fixture = TestBed.createComponent(InputComponent);

        fixture.detectChanges();

        let component = fixture.debugElement.componentInstance;

        component.inputType = inputType;
        fixture.detectChanges();

        expect(component.input.nativeElement.type).toEqual(inputType);
    });

    it('ngOnInit set required false when is undefined', () => {

        let fixture = TestBed.createComponent(InputComponent);

        fixture.detectChanges();

        let component = fixture.debugElement.componentInstance;

        expect(component.required).toBe(false);
    });

    it('binding with inputType and input.type work', () => {

        let inputType = 'number';
        let fixture = TestBed.createComponent(InputComponent);
        let component = fixture.debugElement.componentInstance;

        component.inputType = inputType;

        fixture.detectChanges();

        expect(component.input.nativeElement.type).toEqual(component.inputType);
    });

    it('validateInput when value is valid set hesError false', () => {

        let fixture = TestBed.createComponent(InputComponent);

        fixture.detectChanges();

        let component = fixture.debugElement.componentInstance;

        component.inputType = 'number';
        component.input.nativeElement.value = 111;
        fixture.detectChanges();

        component.validateInput();

        expect(component.hasError).toBe(false);
    });

    it('validateInput when value missing but not required set hesError false', () => {

        let fixture = TestBed.createComponent(InputComponent);

        fixture.detectChanges();

        let component = fixture.debugElement.componentInstance;

        component.inputType = 'number';
        component.input.nativeElement.value = '';
        fixture.detectChanges();

        component.validateInput();

        expect(component.hasError).toBe(false);
    });

    it('validateInput when value missing and required set hesError true', () => {

        let fixture = TestBed.createComponent(InputComponent);

        fixture.detectChanges();

        let component = fixture.debugElement.componentInstance;

        component.inputType = 'number';
        component.required = true;
        fixture.detectChanges();

        component.validateInput();

        expect(component.hasError).toBe(true);
    });

    it('validateInput when value missing and required set errorMessage required key', () => {

        let fixture = TestBed.createComponent(InputComponent);

        fixture.detectChanges();

        let component = fixture.debugElement.componentInstance;

        component.inputType = 'number';
        component.required = true;
        fixture.detectChanges();

        component.validateInput();

        expect(component.errorMessage).toBe('VALIDATIONS.REQUIRED');
    });

    it('validateInput when value incorrect set hasError true', () => {

        let fixture = TestBed.createComponent(InputComponent);

        fixture.detectChanges();

        let component = fixture.debugElement.componentInstance;

        component.inputType = 'number';
        component.required = true;
        fixture.detectChanges();

        component.validateInput();

        expect(component.hasError).toBe(true);
    });

    it('validateInput when value incorrect not override errorMessage', () => {

        let expectedErrorMessage = 'INVALID_PASSWORD';
        let fixture = TestBed.createComponent(InputComponent);

        fixture.detectChanges();

        let component = fixture.debugElement.componentInstance;

        component.errorMessage = expectedErrorMessage;
        component.inputType = 'number';
        component.input.nativeElement.value = 'aaa';
        fixture.detectChanges();

        component.validateInput();

        expect(component.errorMessage).toBe(expectedErrorMessage);
    });
});
