import { Component } from '@angular/core';
import { ButtonComponent, LinkComponent, SectionComponent, SectionIntroComponent } from '@critsource/ui-web';

/**
 * The get-involved section of the landing page: three cards, one for each way to take part before the app launches.
 * Follow the project stars the repository, with the hint on how to watch its releases under the button. Share an idea
 * opens Discussions, and Help build it links to the contributing guide and the code of conduct. The section collects
 * no personal data: every way in leads to GitHub.
 */
@Component({
    selector: 'dma-get-involved',
    templateUrl: './get-involved.component.html',
    styleUrl: './get-involved.component.scss',
    imports: [ButtonComponent, LinkComponent, SectionComponent, SectionIntroComponent],
})
export class GetInvolvedComponent {
    protected readonly repositoryUrl = 'https://github.com/critsource/critsource';
    protected readonly discussionsUrl = 'https://github.com/critsource/critsource/discussions';
    protected readonly contributingUrl = 'https://github.com/critsource/critsource/blob/main/CONTRIBUTING.md';
    protected readonly codeOfConductUrl = 'https://github.com/critsource/critsource/blob/main/CODE_OF_CONDUCT.md';
}
