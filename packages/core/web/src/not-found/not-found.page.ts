import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '@critsource/ui-web';

/**
 * The page for every path that no route matches. nginx serves its prerendered copy, `not-found/index.html`, with status
 * 404 for each unknown path under the base path, and the router renders the same component at `**` once the app boots,
 * so the page hydrates without a mismatch. It follows the rules of ADR 0013 for a prerendered page.
 */
@Component({
    selector: 'dma-not-found-page',
    templateUrl: './not-found.page.html',
    imports: [ButtonComponent, RouterLink],
})
export class NotFoundPage {}
