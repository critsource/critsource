import { ComponentHarness, type ElementDimensions } from '@angular/cdk/testing';
import { ChipHarness, LinkHarness, SectionIntroHarness } from '@critsource/ui-web/testing';

/** An item of a feature group: its text, and where the item, its text, and its chip sit on the page, in pixels. */
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

    /**
     * Where the item, its text, and its chip sit, the chip `null` when the item has none. The item starts at its bullet,
     * so the space before the text holds the bullet and the gap after it.
     */
    public async getBoxes(): Promise<{
        item: ElementDimensions;
        text: ElementDimensions;
        chip: ElementDimensions | null;
    }> {
        const [item, text, chip] = await Promise.all([this.host(), this.textLocator(), this.chipElementLocator()]);
        const [itemBox, textBox, chipBox] = await Promise.all([
            item.getDimensions(),
            text.getDimensions(),
            chip?.getDimensions() ?? null,
        ]);

        return { item: itemBox, text: textBox, chip: chipBox };
    }
}

/** How a feature preview draws its box and its text. */
export interface FeaturePreviewLook {
    background: string;
    color: string;
}

/** The space inside a feature preview, and between its children, in pixels. */
export interface FeaturePreviewSpacing {
    paddingBlock: number;
    paddingInline: number;
    gap: number;
}

/** The concept preview of a feature group: its title, context, and Concept chip, then the stats it shows. */
export class FeaturePreviewHarness extends ComponentHarness {
    public static readonly hostSelector = '.preview';

    private readonly titleLocator = this.locatorFor('.title > :first-child');
    private readonly contextLocator = this.locatorFor('.title > :last-child');
    private readonly conceptLocator = this.locatorFor(ChipHarness);
    private readonly statsLocator = this.locatorForAll('.stats > div');
    private readonly termsLocator = this.locatorForAll('.stats > div > dt');
    private readonly valuesLocator = this.locatorForAll('.stats > div > dd');

    public async getTitle(): Promise<string> {
        return await (await this.titleLocator()).text();
    }

    public async getContext(): Promise<string> {
        return await (await this.contextLocator()).text();
    }

    /** The chip in the header, which marks the preview as a concept. */
    public async getConcept(): Promise<ChipHarness> {
        return await this.conceptLocator();
    }

    /** The label and value of each stat, in the order they draw; none when the preview shows no stats. */
    public async getStats(): Promise<{ term: string; value: string }[]> {
        const [terms, values] = await Promise.all([this.termsLocator(), this.valuesLocator()]);

        return await Promise.all(
            terms.map(async (term, index) => ({ term: await term.text(), value: (await values[index]?.text()) ?? '' })),
        );
    }

    /** Where each stat, a label above its value, sits on the page, in the order they draw. */
    public async getStatBoxes(): Promise<ElementDimensions[]> {
        const stats = await this.statsLocator();

        return await Promise.all(stats.map(async (stat) => await stat.getDimensions()));
    }

    /** How the preview draws. */
    public async getLook(): Promise<FeaturePreviewLook> {
        const element = await this.host();
        const [background, color] = await Promise.all([
            element.getCssValue('background-color'),
            element.getCssValue('color'),
        ]);

        return { background, color };
    }

    /** The padding of the preview, and the gap between its parts. */
    public async getSpacing(): Promise<FeaturePreviewSpacing> {
        const element = await this.host();
        const [paddingBlock, paddingInline, gap] = await Promise.all([
            element.getCssValue('padding-block-start'),
            element.getCssValue('padding-inline-start'),
            element.getCssValue('row-gap'),
        ]);

        return {
            paddingBlock: parseFloat(paddingBlock),
            paddingInline: parseFloat(paddingInline),
            gap: parseFloat(gap),
        };
    }

    /** Where the preview sits on the page. */
    public async getBox(): Promise<ElementDimensions> {
        return await (await this.host()).getDimensions();
    }
}

/** A group of the features section: its eyebrow, heading, items, and preview. */
export class FeatureGroupHarness extends ComponentHarness {
    public static readonly hostSelector = '.group';

    private readonly eyebrowLocator = this.locatorFor('hgroup > p');
    private readonly headingLocator = this.locatorFor('hgroup > :is(h1, h2, h3, h4, h5, h6)');
    private readonly itemsLocator = this.locatorForAll(FeatureItemHarness);
    private readonly listLocator = this.locatorFor(':scope > ul');
    private readonly previewLocator = this.locatorFor(FeaturePreviewHarness);

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

    /** Where the list of items sits on the page. */
    public async getListBox(): Promise<ElementDimensions> {
        return await (await this.listLocator()).getDimensions();
    }

    /** The concept preview under the items. */
    public async getPreview(): Promise<FeaturePreviewHarness> {
        return await this.previewLocator();
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
