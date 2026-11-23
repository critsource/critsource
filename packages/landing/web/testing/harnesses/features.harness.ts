import { ComponentHarness } from '@angular/cdk/testing';
import { LinkHarness, SectionIntroHarness } from '@critsource/ui-web/testing';

/** Reads the features section of the landing page: its intro, and the link to the README. */
export class FeaturesHarness extends ComponentHarness {
    public static readonly hostSelector = 'dma-features';

    private readonly sectionLocator = this.locatorFor('section');
    private readonly introLocator = this.locatorFor(SectionIntroHarness);
    private readonly linkLocator = this.locatorFor(LinkHarness);
    private readonly linkElementLocator = this.locatorFor(LinkHarness.hostSelector);

    /** The `id` of the section, which the Features link of the header targets. */
    public async getId(): Promise<string | null> {
        return await (await this.sectionLocator()).getAttribute('id');
    }

    public async getIntro(): Promise<SectionIntroHarness> {
        return await this.introLocator();
    }

    public async getLink(): Promise<LinkHarness> {
        return await this.linkLocator();
    }

    /** The `href` of the link to the README. */
    public async getLinkHref(): Promise<string | null> {
        return await (await this.linkElementLocator()).getAttribute('href');
    }
}
