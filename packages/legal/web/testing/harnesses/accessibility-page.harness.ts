import { ComponentHarness } from '@angular/cdk/testing';
import {
    ButtonHarness,
    FactsListHarness,
    OnThisPageHarness,
    SummaryHarness,
    TextPageHarness,
} from '@critsource/ui-web/testing';

/** Reads the Accessibility page: its Text page, with On this page, the Summary and its facts, and the report buttons. */
export class AccessibilityPageHarness extends ComponentHarness {
    public static readonly hostSelector = 'dma-accessibility-page';

    private readonly headingLocator = this.locatorFor('h1');
    private readonly textPageLocator = this.locatorFor(TextPageHarness);
    private readonly onThisPageLocator = this.locatorFor(OnThisPageHarness);
    private readonly summaryLocator = this.locatorFor(SummaryHarness);
    private readonly factsListLocator = this.locatorFor(FactsListHarness);
    private readonly buttonsLocator = this.locatorForAll(ButtonHarness);

    /** The text of the level 1 heading of the page. */
    public async headingContents(): Promise<string> {
        return await (await this.headingLocator()).text();
    }

    public async getTextPage(): Promise<TextPageHarness> {
        return await this.textPageLocator();
    }

    public async getOnThisPage(): Promise<OnThisPageHarness> {
        return await this.onThisPageLocator();
    }

    public async getSummary(): Promise<SummaryHarness> {
        return await this.summaryLocator();
    }

    public async getFactsList(): Promise<FactsListHarness> {
        return await this.factsListLocator();
    }

    /** The buttons under Report a barrier, in order. */
    public async getButtons(): Promise<ButtonHarness[]> {
        return await this.buttonsLocator();
    }
}
