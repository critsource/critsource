import { Component } from '@angular/core';
import { SectionComponent } from '@critsource/ui-web';
import { CallsToActionComponent } from './calls-to-action.component';
import { GlowComponent } from './glow.component';

/**
 * The closing call to action of the landing page, on the glow: a centered heading and line that give a visitor who
 * reaches the end of the page a next step, and the calls to action of the hero, with the same labels and links.
 */
@Component({
    selector: 'dma-closing-call-to-action',
    templateUrl: './closing-call-to-action.component.html',
    styleUrl: './closing-call-to-action.component.scss',
    imports: [CallsToActionComponent, GlowComponent, SectionComponent],
})
export class ClosingCallToActionComponent {}
