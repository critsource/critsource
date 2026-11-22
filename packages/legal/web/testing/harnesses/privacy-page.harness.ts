import { ComponentHarness } from '@angular/cdk/testing';

export class PrivacyPageHarness extends ComponentHarness {
    public static readonly hostSelector = 'dma-privacy-page';

    private readonly headingLocator = this.locatorFor('h1');

    /** The text of the level 1 heading of the page. */
    public async headingContents(): Promise<string> {
        return await (await this.headingLocator()).text();
    }
}
