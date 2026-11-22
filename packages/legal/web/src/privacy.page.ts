import { Component } from '@angular/core';
import {
    DataTableComponent,
    LinkComponent,
    OnThisPageComponent,
    OnThisPageLinkComponent,
    SectionComponent,
    SummaryComponent,
    SummaryTitleComponent,
    TextPageComponent,
} from '@critsource/ui-web';

/**
 * The privacy statement of the site, as a Text page in a Section: what personal data the site processes, who else sees
 * it, and the rights of the reader. `docs/privacy.md` lists where each promise is enforced, so a change to what the
 * site processes updates the text, that guide, and the Last updated date together.
 */
@Component({
    selector: 'dma-privacy-page',
    templateUrl: './privacy.page.html',
    imports: [
        DataTableComponent,
        LinkComponent,
        OnThisPageComponent,
        OnThisPageLinkComponent,
        SectionComponent,
        SummaryComponent,
        SummaryTitleComponent,
        TextPageComponent,
    ],
})
export class PrivacyPage {
    protected readonly supportEmail = 'support@critsource.com';
    protected readonly supportMailto = `mailto:${this.supportEmail}`;
    protected readonly githubPrivacyUrl =
        'https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement';
    protected readonly authorityUrl = 'https://www.autoriteitpersoonsgegevens.nl/en';
    protected readonly historyUrl =
        'https://github.com/critsource/critsource/commits/main/packages/legal/web/src/privacy.page.html';
}
