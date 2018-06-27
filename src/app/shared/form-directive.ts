import {
    Directive,
    HostListener,
    Input
} from '@angular/core';

@Directive({
    selector: '[pmForm]'
})
export class FormDirective {

    @Input() action: string;
    @Input() category: string;
    @Input() label: string;

    isSubmitted = false;
    isDirty = false;
    isOnSaving = false;

    scrollToFirstInvalidInput(el, shouldAddFormOffsetTop = true) {

        const elements: HTMLCollection = el.nativeElement.getElementsByClassName('ng-invalid');
        if (!elements.length) {
            return;
        }

        const formElement = <HTMLElement>elements[0];
        const inputs = [].slice.call(elements, 1, elements.length);
        const firstInvalidInput = this.getFirstInvalidInput(inputs);

        // shouldAddFormOffsetTop ? form offsetTop + first element offsetTop - header height
        const offsetTop: number = shouldAddFormOffsetTop ?
            formElement.offsetTop + firstInvalidInput.offsetTop - 85 :
            firstInvalidInput.offsetTop - 85;

        window.scrollTo(0, offsetTop);
    }

    scrollToTop() {
        setTimeout(function () {
            window.scrollTo(0, 0);
        }, 100);
    }

    private getFirstInvalidInput(inputs: Array<HTMLElement>): HTMLElement {
        let inputWithMinTop = inputs[0];
        let minTop = inputWithMinTop.offsetTop;

        inputs.forEach(input => {
            if (input.offsetTop < minTop) {
                minTop = input.offsetTop;
                inputWithMinTop = input;
            }
        });

        return inputWithMinTop;
    }

    @HostListener('submit')
    private onSubmitted($event) {
        this.isSubmitted = true;
    }
}
