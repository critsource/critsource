import { ComponentHarness, type ElementDimensions } from '@angular/cdk/testing';
import { ChipHarness, LinkHarness, SectionIntroHarness } from '@critsource/ui-web/testing';

/** An item of a feature group: its text, and where its text and chip sit on the page, in pixels. */
export class FeatureItemHarness extends ComponentHarness {
    public static readonly hostSelector = 'li';

    private readonly textLocator = this.locatorFor(':scope > span');
    private readonly chipLocator = this.locatorForOptional(ChipHarness);
    private readonly chipElementLocator = this.locatorForOptional(ChipHarness.hostSelector);

    public async getText(): Promise<string> {
        return await (await this.textLocator()).text();
    }

    /** The chip of the item, or `null` when the item has none. */
    public async getChip(): Promise<ChipHarness | null> {
        return await this.chipLocator();
    }

    /** Where the text and the chip of the item sit, the chip `null` when the item has none. */
    public async getBoxes(): Promise<{ text: ElementDimensions; chip: ElementDimensions | null }> {
        const [text, chip] = await Promise.all([this.textLocator(), this.chipElementLocator()]);
        const [textBox, chipBox] = await Promise.all([text.getDimensions(), chip?.getDimensions() ?? null]);

        return { text: textBox, chip: chipBox };
    }
}

/** A group of the features section: its eyebrow, heading, and items. */
export class FeatureGroupHarness extends ComponentHarness {
    public static readonly hostSelector = '.group';

    private readonly eyebrowLocator = this.locatorFor('hgroup > p');
    private readonly headingLocator = this.locatorFor('hgroup > :is(h1, h2, h3, h4, h5, h6)');
    private readonly itemsLocator = this.locatorForAll(FeatureItemHarness);

    public async getEyebrow(): Promise<string> {
        return await (await this.eyebrowLocator()).text();
    }

    /** The text and level of the heading, such as 3 for an `h3`. */
    public async getHeading(): Promise<{ text: string; level: number }> {
        const heading = await this.headingLocator();
        const [text, tagName] = await Promise.all([heading.text(), heading.getProperty<string>('tagName')]);

        return { text, level: Number(tagName.slice(1)) };
    }

    /** The items, in the order they draw. */
    public async getItems(): Promise<FeatureItemHarness[]> {
        return await this.itemsLocator();
    }

    /** Where the group sits on the page. */
    public async getBox(): Promise<ElementDimensions> {
        return await (await this.host()).getDimensions();
    }
}

/** Reads the features section of the landing page: its intro, groups, and the link to the README. */
export class FeaturesHarness extends ComponentHarness {
    public static readonly hostSelector = 'dma-features';

    private readonly sectionLocator = this.locatorFor('section');
    private readonly introLocator = this.locatorFor(SectionIntroHarness);
    private readonly groupsLocator = this.locatorForAll(FeatureGroupHarness);
    private readonly linkLocator = this.locatorFor(LinkHarness);
    private readonly linkElementLocator = this.locatorFor(LinkHarness.hostSelector);

    /** The `id` of the section, which the Features link of the header targets. */
    public async getId(): Promise<string | null> {
        return await (await this.sectionLocator()).getAttribute('id');
    }

    public async getIntro(): Promise<SectionIntroHarness> {
        return await this.introLocator();
    }

    /** The groups, in the order of the source. */
    public async getGroups(): Promise<FeatureGroupHarness[]> {
        return await this.groupsLocator();
    }

    public async getLink(): Promise<LinkHarness> {
        return await this.linkLocator();
    }

    /** The `href` of the link to the README. */
    public async getLinkHref(): Promise<string | null> {
        return await (await this.linkElementLocator()).getAttribute('href');
    }
}
