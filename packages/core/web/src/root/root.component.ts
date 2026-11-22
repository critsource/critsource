import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import {
    ButtonComponent,
    FooterComponent,
    HeaderComponent,
    IconGithubComponent,
    LinkComponent,
    LinkGroupComponent,
    LogoComponent,
    MobileMenuComponent,
    SkipLinkComponent,
} from '@critsource/ui-web';

/**
 * The shell of the web client: the Skip link, the Header with its Mobile menu, the `<main>` that holds the router
 * outlet, and the Footer. Every route renders inside `<main>`, so each page adds its own link to the nav of the header
 * and to the groups of the footer once its page exists.
 *
 * The shell prerenders with each public route, so it follows the rules of ADR 0013: it reads no browser API while it
 * renders, and the layout switches by viewport in CSS only.
 */
@Component({
    selector: 'dma-root',
    templateUrl: './root.component.html',
    styleUrl: './root.component.scss',
    imports: [
        ButtonComponent,
        FooterComponent,
        HeaderComponent,
        IconGithubComponent,
        LinkComponent,
        LinkGroupComponent,
        LogoComponent,
        MobileMenuComponent,
        RouterLink,
        RouterOutlet,
        SkipLinkComponent,
    ],
})
export class RootComponent {
    protected readonly githubUrl = 'https://github.com/critsource/critsource';
}
