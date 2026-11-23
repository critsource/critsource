import { ComponentHarness } from '@angular/cdk/testing';
import { DisclosureHarness, SectionHarness, SectionIntroHarness } from '@critsource/ui-web/testing';

/** Reads the FAQ section of the landing page: its section, its intro, and its questions. */
export class FaqHarness extends ComponentHarness {
    public static readonly hostSelector = 'dma-faq';

    private readonly sectionLocator = this.locatorFor(SectionHarness);
    private readonly sectionElementLocator = this.locatorFor(SectionHarness.hostSelector);
    private readonly introLocator = this.locatorFor(SectionIntroHarness);
    private readonly questionsLocator = this.locatorForAll(DisclosureHarness);

    /** The `id` of the section, which the FAQ link of the header targets. */
    public async getId(): Promise<string | null> {
        return await (await this.sectionElementLocator()).getAttribute('id');
    }

    public async getSection(): Promise<SectionHarness> {
        return await this.sectionLocator();
    }

    public async getIntro(): Promise<SectionIntroHarness> {
        return await this.introLocator();
    }

    /** The questions, in the order of the source. */
    public async getQuestions(): Promise<DisclosureHarness[]> {
        return await this.questionsLocator();
    }
}
