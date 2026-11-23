import { Location } from '@angular/common';
import { Component, DOCUMENT, ElementRef, inject } from '@angular/core';

/** The attribute that marks the heading while it has focus, so the styles of the nav draw its focus ring. */
const targetAttribute = 'data-dma-on-this-page-target';

/**
 * A link to a section of the page in On this page, drawn on the `<a>` it is placed on. Whoever places it adds the
 * `href` of the heading of the section, such as `#your-rights`. The nav sets `aria-current="location"` on the link of
 * the section in view.
 */
@Component({
    selector: 'a[dma-on-this-page-link]',
    templateUrl: './on-this-page-link.component.html',
    styleUrl: './on-this-page-link.component.scss',
    host: {
        '(click)': 'goToSection($event)',
    },
})
export class OnThisPageLinkComponent {
    private readonly document = inject(DOCUMENT);
    private readonly location = inject(Location);
    private readonly host = inject<ElementRef<HTMLAnchorElement>>(ElementRef);

    /**
     * Scrolls the heading that `href` names into view and moves focus to it, rather than following the link. The
     * `<base href="/">` of the app would resolve `#your-rights` against the root, which leaves the page. The address
     * becomes the path of the page with the hash, so the section stays linkable. When the heading can't take focus by
     * itself, it gets `tabindex="-1"` and the mark that draws its focus ring until it loses focus. A heading with a
     * `tabindex` of its own keeps its own focus style.
     */
    protected goToSection(event: MouseEvent): void {
        const href = this.host.nativeElement.getAttribute('href');

        if (!href?.startsWith('#')) {
            return;
        }
        const heading = this.document.getElementById(decodeURIComponent(href.slice(1)));

        if (!heading) {
            return;
        }
        event.preventDefault();

        heading.scrollIntoView();
        if (!heading.hasAttribute('tabindex')) {
            heading.setAttribute('tabindex', '-1');
            heading.setAttribute(targetAttribute, '');
            heading.addEventListener(
                'blur',
                () => {
                    heading.removeAttribute('tabindex');
                    heading.removeAttribute(targetAttribute);
                },
                { once: true },
            );
        }
        heading.focus({ preventScroll: true });

        const url = this.location.path() + href;

        if (this.location.path(true) !== url) {
            this.location.go(url);
        }
    }
}
