import { Component } from '@angular/core';
import { LinkComponent, SectionComponent, SectionIntroComponent } from '@critsource/ui-web';

/**
 * The features section of the landing page: what the app will cover, and a link to every planned feature in the
 * README. Its `id` is the target of the Features link of the header.
 */
@Component({
    selector: 'dma-features',
    templateUrl: './features.component.html',
    styleUrl: './features.component.scss',
    imports: [LinkComponent, SectionComponent, SectionIntroComponent],
})
export class FeaturesComponent {
    protected readonly plannedFeaturesUrl = 'https://github.com/critsource/critsource#features';
}
