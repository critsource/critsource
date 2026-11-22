import { ComponentHarness } from '@angular/cdk/testing';

export class LandingPageHarness extends ComponentHarness {
    public static readonly hostSelector = 'dma-landing-page';

    private readonly paragraphLocator = this.locatorFor('p');

    /** The text of the placeholder paragraph, which the sections of the page replace. */
    public async paragraphContents(): Promise<string> {
        return await (await this.paragraphLocator()).text();
    }
}
