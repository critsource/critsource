import { Component } from '@angular/core';
import { ChipComponent, SectionComponent } from '@critsource/ui-web';

/**
 * The landing page at `/`. Its hero says what Critsource is and that it is in early development. It follows the rules
 * of ADR 0013 for a prerendered page.
 */
@Component({
    selector: 'dma-landing-page',
    templateUrl: './landing.page.html',
    styleUrl: './landing.page.scss',
    imports: [ChipComponent, SectionComponent],
})
export class LandingPage {}
