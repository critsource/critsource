import { Component } from '@angular/core';
import { DisclosureComponent, SectionComponent, SectionIntroComponent } from '@critsource/ui-web';

/**
 * The FAQ section of the landing page: the questions visitors ask before the app launches, each a Disclosure that the
 * browser opens and closes. "Is it free?" and "When can I use it?" start open, as Penpot draws them. Its `id`, `faq`,
 * is the target of the FAQ link of the header.
 */
@Component({
    selector: 'dma-faq',
    templateUrl: './faq.component.html',
    styleUrl: './faq.component.scss',
    imports: [DisclosureComponent, SectionComponent, SectionIntroComponent],
})
export class FaqComponent {}
