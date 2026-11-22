import { Component, input } from '@angular/core';
import { DEFAULT_LOGO_KIND, DEFAULT_LOGO_SIZE, logoKindAttr, logoSizeAttr } from './logo.types';

/**
 * The Critsource logo. It names itself "Critsource" to assistive technology in every variant, so a link around it takes
 * that name. The link home stays with whoever places the logo.
 */
@Component({
    selector: 'dma-logo',
    templateUrl: './logo.component.html',
    styleUrl: './logo.component.scss',
    host: {
        'role': 'img',
        'aria-label': 'Critsource',
        '[class.small]': "size() === 'small'",
    },
})
export class LogoComponent {
    public readonly kind = input(DEFAULT_LOGO_KIND, { transform: logoKindAttr });
    public readonly size = input(DEFAULT_LOGO_SIZE, { transform: logoSizeAttr });
}
