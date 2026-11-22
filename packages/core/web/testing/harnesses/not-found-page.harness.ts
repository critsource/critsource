import { ComponentHarness } from '@angular/cdk/testing';
import { ButtonHarness } from '@critsource/ui-web/testing';

export class NotFoundPageHarness extends ComponentHarness {
    public static readonly hostSelector = 'dma-not-found-page';

    private readonly headingLocator = this.locatorFor('h1');
    private readonly homeButtonLocator = this.locatorFor(ButtonHarness);

    /** The text of the level 1 heading of the page. */
    public async headingContents(): Promise<string> {
        return await (await this.headingLocator()).text();
    }

    /** The button that leads back to the home page. */
    public async getHomeButton(): Promise<ButtonHarness> {
        return await this.homeButtonLocator();
    }
}
