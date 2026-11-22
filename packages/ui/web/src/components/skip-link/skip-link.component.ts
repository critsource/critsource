import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, inject, ViewEncapsulation } from '@angular/core';

/** The attribute that marks the target while it has focus, so the styles of the skip link draw its focus ring. */
const targetAttribute = 'data-dma-skip-target';

/**
 * The first focusable item of a page, drawn on the `<a>` it is placed on. It stays hidden until it gets focus, then
 * pins to the top left of the viewport. Whoever places it sets `href` to the id of the main content, such as `#main`.
 *
 * The styles reach the target, which lies outside the component, so the component turns encapsulation off and scopes
 * every rule to a selector of its own instead.
 */
@Component({
    selector: 'a[dma-skip-link]',
    templateUrl: './skip-link.component.html',
    styleUrl: './skip-link.component.scss',
    encapsulation: ViewEncapsulation.None,
    host: {
        '(click)': 'skipToTarget($event)',
    },
})
export class SkipLinkComponent {
    private readonly document = inject(DOCUMENT);
    private readonly host = inject<ElementRef<HTMLAnchorElement>>(ElementRef);

    /**
     * Moves focus to the element that `href` names, rather than following the link. The `<base href="/">` of the app
     * would resolve `#main` against the root, which leaves any other page. When the target can't take focus by itself,
     * as `<main>` can't, it gets `tabindex="-1"` and the mark that draws its focus ring until it loses focus. A target
     * with a `tabindex` of its own keeps its own focus style.
     */
    protected skipToTarget(event: MouseEvent): void {
        const href = this.host.nativeElement.getAttribute('href');

        if (!href?.startsWith('#')) {
            return;
        }
        const target = this.document.getElementById(decodeURIComponent(href.slice(1)));

        if (!target) {
            return;
        }
        event.preventDefault();

        if (!target.hasAttribute('tabindex')) {
            target.setAttribute('tabindex', '-1');
            target.setAttribute(targetAttribute, '');
            target.addEventListener(
                'blur',
                () => {
                    target.removeAttribute('tabindex');
                    target.removeAttribute(targetAttribute);
                },
                { once: true },
            );
        }
        target.focus();
    }
}
