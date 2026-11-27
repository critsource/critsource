import { Component } from '@angular/core';
import { ChipComponent, SectionComponent } from '@critsource/ui-web';
import { CallsToActionComponent } from './calls-to-action.component';
import { ClosingCallToActionComponent } from './closing-call-to-action.component';
import { FaqComponent } from './faq.component';
import { FeaturesComponent } from './features.component';
import { GetInvolvedComponent } from './get-involved.component';
import { GlowComponent } from './glow.component';
import { ProblemComponent } from './problem.component';
import { TabbedPreviewComponent } from './tabbed-preview.component';

/**
 * The landing page at `/`. Its hero says what Critsource is and that it is in early development, offers the calls to
 * action, and previews the app, on the glow. The problem section, the features section, the get-involved section, the
 * FAQ, and the closing call to action follow it. It follows the rules of ADR 0013 for a prerendered page.
 */
@Component({
    selector: 'dma-landing-page',
    templateUrl: './landing.page.html',
    styleUrl: './landing.page.scss',
    imports: [
        CallsToActionComponent,
        ChipComponent,
        ClosingCallToActionComponent,
        FaqComponent,
        FeaturesComponent,
        GetInvolvedComponent,
        GlowComponent,
        ProblemComponent,
        SectionComponent,
        TabbedPreviewComponent,
    ],
})
export class LandingPage {}
