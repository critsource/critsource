import { ComponentHarness, type ElementDimensions, HarnessPredicate } from '@angular/cdk/testing';
import { ChipHarness, SectionHarness, SectionIntroHarness } from '@critsource/ui-web/testing';

/** The arrow of the section that is on show: the one that fits the viewport. */
export type ProblemArrow = 'arrow-right' | 'arrow-down';

/** The space between the border of a tool and its text, in pixels: its padding and its border together. */
export interface ProblemToolSpacing {
    block: number;
    inline: number;
}

/** How the result aligns its text, as the CSS values of `justify-content` and `text-align`. */
export interface ProblemResultAlignment {
    justifyContent: string;
    textAlign: string;
}

/** Reads the problem section of the landing page: its section, its intro, its tools, its arrow, and its result. */
export class ProblemHarness extends ComponentHarness {
    public static readonly hostSelector = 'dma-problem';

    private readonly sectionLocator = this.locatorFor(SectionHarness);
    private readonly introLocator = this.locatorFor(SectionIntroHarness);
    private readonly toolsLocator = this.locatorForAll(new HarnessPredicate(ChipHarness, { selector: '.tool' }));
    private readonly resultLocator = this.locatorFor(new HarnessPredicate(ChipHarness, { selector: '.result' }));
    private readonly toolElementsLocator = this.locatorForAll('.tool');
    private readonly resultElementLocator = this.locatorFor('.result');
    private readonly arrowsLocator = this.locatorForAll('dma-icon-arrow-right, dma-icon-arrow-down');

    public async getSection(): Promise<SectionHarness> {
        return await this.sectionLocator();
    }

    public async getIntro(): Promise<SectionIntroHarness> {
        return await this.introLocator();
    }

    /** The chips that name the four tools, in the order they draw. */
    public async getTools(): Promise<ChipHarness[]> {
        return await this.toolsLocator();
    }

    /** The highlighted chip that says Critsource holds all four. */
    public async getResult(): Promise<ChipHarness> {
        return await this.resultLocator();
    }

    /** The glyph of the arrow on show, or `null` when none is. */
    public async getVisibleArrow(): Promise<ProblemArrow | null> {
        const arrows = await this.arrowsLocator();
        const shown = await Promise.all(
            arrows.map(async (arrow) => ({
                tagName: (await arrow.getProperty<string>('tagName')).toLowerCase(),
                display: await arrow.getCssValue('display'),
            })),
        );
        const visible = shown.filter(({ display }) => display !== 'none');

        if (visible.length > 1) {
            throw new Error('The section shows more than one arrow.');
        }
        return visible[0] ? (visible[0].tagName.replace('dma-icon-', '') as ProblemArrow) : null;
    }

    /** Where the arrow on show sits on the page. */
    public async getArrowBox(): Promise<ElementDimensions> {
        for (const arrow of await this.arrowsLocator()) {
            if ((await arrow.getCssValue('display')) !== 'none') {
                return await arrow.getDimensions();
            }
        }
        throw new Error('The section shows no arrow.');
    }

    /** Where each tool sits on the page, in the order they draw. */
    public async getToolBoxes(): Promise<ElementDimensions[]> {
        return await Promise.all((await this.toolElementsLocator()).map((tool) => tool.getDimensions()));
    }

    /** Where the result sits on the page. */
    public async getResultBox(): Promise<ElementDimensions> {
        return await (await this.resultElementLocator()).getDimensions();
    }

    /** The space around the text of the first tool, which every tool shares. */
    public async getToolSpacing(): Promise<ProblemToolSpacing> {
        const [tool] = await this.toolElementsLocator();

        if (!tool) {
            throw new Error('The section has no tools.');
        }
        const [paddingBlock, paddingInline, borderBlock, borderInline] = await Promise.all(
            ['padding-top', 'padding-left', 'border-top-width', 'border-left-width'].map(async (property) =>
                parseFloat(await tool.getCssValue(property)),
            ),
        );

        return { block: (paddingBlock ?? 0) + (borderBlock ?? 0), inline: (paddingInline ?? 0) + (borderInline ?? 0) };
    }

    /**
     * How the text of the result aligns in its box: `justifyContent` places a text on one line, and `textAlign` the lines of
     * a wrapped text.
     */
    public async getResultAlignment(): Promise<ProblemResultAlignment> {
        const result = await this.resultElementLocator();
        const [justifyContent, textAlign] = await Promise.all([
            result.getCssValue('justify-content'),
            result.getCssValue('text-align'),
        ]);

        return { justifyContent, textAlign };
    }
}
