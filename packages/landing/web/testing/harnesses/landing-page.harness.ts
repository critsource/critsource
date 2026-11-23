import { ComponentHarness } from '@angular/cdk/testing';
import { ChipHarness } from '@critsource/ui-web/testing';

/** A text of the hero, which the harness reads by its role. */
export type LandingPageText = 'heading' | 'lede';

/** How a text of the hero draws. */
export interface LandingPageTextLook {
    color: string;
    fontSize: string;
}

/** Reads the landing page: the chip and texts of its hero. */
export class LandingPageHarness extends ComponentHarness {
    public static readonly hostSelector = 'dma-landing-page';

    private readonly textSelectors: Record<LandingPageText, string> = {
        heading: 'h1',
        lede: '.lede',
    };

    private readonly headingsLocator = this.locatorForAll('h1');
    private readonly chipLocator = this.locatorFor(ChipHarness);

    /** The number of level 1 headings, which a page has one of. */
    public async countHeadings(): Promise<number> {
        return (await this.headingsLocator()).length;
    }

    public async getChip(): Promise<ChipHarness> {
        return await this.chipLocator();
    }

    /** The text of a text of the hero. */
    public async getText(text: LandingPageText): Promise<string> {
        return await (await this.locatorFor(this.textSelectors[text])()).text();
    }

    /** How a text of the hero draws. */
    public async getTextLook(text: LandingPageText): Promise<LandingPageTextLook> {
        const element = await this.locatorFor(this.textSelectors[text])();
        const [color, fontSize] = await Promise.all([element.getCssValue('color'), element.getCssValue('font-size')]);

        return { color, fontSize };
    }
}
