import { Component } from '@angular/core';
import { ChipComponent, LinkComponent, SectionComponent, SectionIntroComponent } from '@critsource/ui-web';

/**
 * The features section of the landing page: what the app will cover, in three groups by when in a game you use each
 * tool, before the session, at the table, and after it. A DM chip marks the tools for dungeon masters. Each group ends
 * with a static preview of what the app will show for it, marked Concept, since nothing it shows is built yet. The
 * section ends with a link to every planned feature in the README. Its `id` is the target of the Features link of the
 * header.
 */
@Component({
    selector: 'dma-features',
    templateUrl: './features.component.html',
    styleUrl: './features.component.scss',
    imports: [ChipComponent, LinkComponent, SectionComponent, SectionIntroComponent],
})
export class FeaturesComponent {
    protected readonly plannedFeaturesUrl = 'https://github.com/critsource/critsource#features';
}
