import { Component } from '@angular/core';

/**
 * The accent glow behind a section of the landing page, as the hero and the closing call to action draw it. It fills
 * its container, which sets `position: relative` and `isolation: isolate`, and sits under the content of the container.
 * It is decorative, so it hides from assistive technology.
 *
 * The container sets where the glow is brightest with `--glow-center`, a position such as `85% 10%`, and how far it
 * reaches from there with `--glow-reach`, a share of the width and height such as `90%`, as the gradient handles of
 * Penpot do.
 */
@Component({
    selector: 'dma-glow',
    template: '',
    styleUrl: './glow.component.scss',
    host: {
        'aria-hidden': 'true',
    },
})
export class GlowComponent {}
