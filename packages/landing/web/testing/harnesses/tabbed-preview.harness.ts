import { ComponentHarness, type ElementDimensions } from '@angular/cdk/testing';
import { TabListHarness, TabPanelHarness } from '@critsource/ui-web/testing';

/** How a part of the tabbed preview draws its box and its text. */
export interface TabbedPreviewLook {
    background: string;
    borderColor: string;
    color: string;
}

/** A row of a preview panel: its name, the tag of the current row, and its number. */
export class TabbedPreviewRowHarness extends ComponentHarness {
    public static readonly hostSelector = 'li';

    private readonly nameLocator = this.locatorFor('.who > :first-child');
    private readonly tagLocator = this.locatorForOptional('.tag');
    private readonly valueLocator = this.locatorFor('.value');

    public async getName(): Promise<string> {
        return await (await this.nameLocator()).text();
    }

    /** The tag after the name, or `null` when the row has none. */
    public async getTag(): Promise<string | null> {
        return (await (await this.tagLocator())?.text()) ?? null;
    }

    public async getValue(): Promise<string> {
        return await (await this.valueLocator()).text();
    }

    /** Whether the row is the current one, which the panel draws with a border. */
    public async isCurrent(): Promise<boolean> {
        return await (await this.host()).hasClass('current');
    }

    /** How the row draws its box and its number. */
    public async getLook(): Promise<TabbedPreviewLook & { valueColor: string }> {
        const [host, value] = await Promise.all([this.host(), this.valueLocator()]);
        const [background, borderColor, color, valueColor] = await Promise.all([
            host.getCssValue('background-color'),
            host.getCssValue('border-top-color'),
            host.getCssValue('color'),
            value.getCssValue('color'),
        ]);

        return { background, borderColor, color, valueColor };
    }
}

/** A panel of the tabbed preview: its title, context, Concept chip, rows, chips, and inset. */
export class TabbedPreviewPanelHarness extends ComponentHarness {
    public static readonly hostSelector = 'dma-tab-panel';

    private readonly titleLocator = this.locatorFor('.title > :first-child');
    private readonly contextLocator = this.locatorFor('.title > :last-child');
    private readonly conceptLocator = this.locatorFor('.header > dma-chip');
    private readonly rowsLocator = this.locatorForAll(TabbedPreviewRowHarness);
    private readonly chipsLocator = this.locatorForAll('.chips > *');
    private readonly highlightLocator = this.locatorFor('.highlight');
    private readonly insetLocator = this.locatorFor('.inset');

    public async getTitle(): Promise<string> {
        return await (await this.titleLocator()).text();
    }

    public async getContext(): Promise<string> {
        return await (await this.contextLocator()).text();
    }

    /** The text of the chip in the header, which marks the panel as a concept. */
    public async getConcept(): Promise<string> {
        return await (await this.conceptLocator()).text();
    }

    /** The rows, in the order they draw. */
    public async getRows(): Promise<TabbedPreviewRowHarness[]> {
        return await this.rowsLocator();
    }

    /** The texts of the chip row: its caption, then each chip. */
    public async getChips(): Promise<string[]> {
        const parts = await this.chipsLocator();

        return await Promise.all(parts.map(async (part) => await part.text()));
    }

    /** The text of the inset: the roll box or the note. */
    public async getInset(): Promise<string> {
        return await (await this.insetLocator()).text();
    }

    /** How the panel, its highlighted chip, or its inset draws. */
    public async getLook(part: 'panel' | 'highlight' | 'inset' = 'panel'): Promise<TabbedPreviewLook> {
        const element =
            part === 'highlight'
                ? await this.highlightLocator()
                : part === 'inset'
                  ? await this.insetLocator()
                  : await this.host();
        const [background, borderColor, color] = await Promise.all([
            element.getCssValue('background-color'),
            element.getCssValue('border-top-color'),
            element.getCssValue('color'),
        ]);

        return { background, borderColor, color };
    }
}

/** Reads the tabbed preview in the hero of the landing page: its tab list, its panels, and its caption. */
export class TabbedPreviewHarness extends ComponentHarness {
    public static readonly hostSelector = 'dma-tabbed-preview';

    private readonly tabListLocator = this.locatorFor(TabListHarness);
    private readonly panelsLocator = this.locatorForAll(TabbedPreviewPanelHarness);
    private readonly tabPanelsLocator = this.locatorForAll(TabPanelHarness);
    private readonly captionLocator = this.locatorFor('.caption');

    public async getTabList(): Promise<TabListHarness> {
        return await this.tabListLocator();
    }

    /** The panels, in the order of the tabs. */
    public async getPanels(): Promise<TabbedPreviewPanelHarness[]> {
        return await this.panelsLocator();
    }

    /** Whether each panel shows, in the order of the tabs. */
    public async getShownPanels(): Promise<boolean[]> {
        const panels = await this.tabPanelsLocator();

        return await Promise.all(panels.map(async (panel) => await panel.isShown()));
    }

    /** The panel that shows. */
    public async getShownPanel(): Promise<TabbedPreviewPanelHarness> {
        const [panels, shown] = await Promise.all([this.panelsLocator(), this.getShownPanels()]);
        const panel = panels[shown.indexOf(true)];

        if (!panel) {
            throw new Error('The preview shows no panel.');
        }
        return panel;
    }

    public async getCaption(): Promise<string> {
        return await (await this.captionLocator()).text();
    }

    /** Where the preview sits on the page. */
    public async getBox(): Promise<ElementDimensions> {
        return await (await this.host()).getDimensions();
    }

    /** How the preview draws its box. */
    public async getLook(): Promise<{ background: string; boxShadow: string }> {
        const host = await this.host();
        const [background, boxShadow] = await Promise.all([
            host.getCssValue('background-color'),
            host.getCssValue('box-shadow'),
        ]);

        return { background, boxShadow };
    }
}
