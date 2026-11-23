import { Component } from '@angular/core';
import { ChipComponent, SectionComponent } from '@critsource/ui-web';
import { CallsToActionComponent } from './calls-to-action.component';

/**
 * The landing page at `/`. Its hero says what Critsource is and that it is in early development, and offers the calls
 * to action. It follows the rules of ADR 0013 for a prerendered page.
 */
@Component({
    selector: 'dma-landing-page',
    templateUrl: './landing.page.html',
    styleUrl: './landing.page.scss',
    imports: [CallsToActionComponent, ChipComponent, SectionComponent],
})
export class LandingPage {}
