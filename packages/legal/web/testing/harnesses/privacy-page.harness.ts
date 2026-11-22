import { ComponentHarness } from '@angular/cdk/testing';
import { DataTableHarness, OnThisPageHarness, SummaryHarness, TextPageHarness } from '@critsource/ui-web/testing';

/** Reads the Privacy page: its Text page, with On this page, the Summary, and the table of the data it processes. */
export class PrivacyPageHarness extends ComponentHarness {
    public static readonly hostSelector = 'dma-privacy-page';

    private readonly headingLocator = this.locatorFor('h1');
    private readonly textPageLocator = this.locatorFor(TextPageHarness);
    private readonly onThisPageLocator = this.locatorFor(OnThisPageHarness);
    private readonly summaryLocator = this.locatorFor(SummaryHarness);
    private readonly dataTableLocator = this.locatorFor(DataTableHarness);

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

    public async getDataTable(): Promise<DataTableHarness> {
        return await this.dataTableLocator();
    }
}
