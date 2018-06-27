import { Input, OnChanges, SimpleChanges } from '@angular/core';

export abstract class ComponentBase implements OnChanges {

    @Input() disabled = false;
    @Input() id = '';

    ngOnChanges(changes: SimpleChanges) {

    }

}

