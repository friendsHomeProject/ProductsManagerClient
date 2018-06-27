import { InjectionToken } from '@angular/core';

import { ComponentBase } from './component.base';

export const COMPONENT_TOKEN = new InjectionToken<ComponentBase>('ComponentToken');
