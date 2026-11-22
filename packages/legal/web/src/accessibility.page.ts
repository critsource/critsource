import { Component } from '@angular/core';
import {
    ButtonComponent,
    FactsListComponent,
    IconExternalComponent,
    LinkComponent,
    OnThisPageComponent,
    OnThisPageLinkComponent,
    SectionComponent,
    SummaryComponent,
    SummaryTitleComponent,
    TextPageComponent,
} from '@critsource/ui-web';

/**
 * The accessibility statement of the site, as a Text page in a Section: the standard it aims for, what it does to meet
 * it, the barriers it knows of, and how to report one. The status, the date of the last check, and the known issues
 * hold sample values until the WCAG check (#303) sets them.
 */
@Component({
    selector: 'dma-accessibility-page',
    templateUrl: './accessibility.page.html',
    styleUrl: './accessibility.page.scss',
    imports: [
        ButtonComponent,
        FactsListComponent,
        IconExternalComponent,
        LinkComponent,
        OnThisPageComponent,
        OnThisPageLinkComponent,
        SectionComponent,
        SummaryComponent,
        SummaryTitleComponent,
        TextPageComponent,
    ],
})
export class AccessibilityPage {
    protected readonly supportMailto = 'mailto:support@critsource.com';
    protected readonly newIssueUrl = 'https://github.com/critsource/critsource/issues/new?template=6-accessibility.yml';
    protected readonly labelUrl = 'https://github.com/critsource/critsource/labels/accessibility';
    protected readonly historyUrl =
        'https://github.com/critsource/critsource/commits/main/packages/legal/web/src/accessibility.page.html';
}
