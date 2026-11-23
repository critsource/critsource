import { Component } from '@angular/core';
import { ButtonComponent } from '@critsource/ui-web';

/**
 * The two calls to action of the landing page: star the repository on GitHub, as the primary button, and share an idea
 * in the Ideas category of Discussions, as the secondary one. The hero and the closing call to action both place it,
 * so their labels and links stay the same.
 */
@Component({
    selector: 'dma-calls-to-action',
    templateUrl: './calls-to-action.component.html',
    styleUrl: './calls-to-action.component.scss',
    imports: [ButtonComponent],
})
export class CallsToActionComponent {
    protected readonly repositoryUrl = 'https://github.com/critsource/critsource';
    protected readonly ideasUrl = 'https://github.com/critsource/critsource/discussions/categories/ideas';
}
