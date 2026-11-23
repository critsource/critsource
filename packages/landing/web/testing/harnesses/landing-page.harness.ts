import { ComponentHarness } from '@angular/cdk/testing';
import { ChipHarness } from '@critsource/ui-web/testing';
import { CallsToActionHarness } from './calls-to-action.harness';
import { GlowHarness } from './glow.harness';

/** A text of the hero, which the harness reads by its role. */
export type LandingPageText = 'heading' | 'lede' | 'hint';

/** How a text of the hero draws. */
export interface LandingPageTextLook {
    color: string;
    fontSize: string;
}

/** Reads the landing page: the chip, texts, calls to action, and glow of its hero. */
export class LandingPageHarness extends ComponentHarness {
    public static readonly hostSelector = 'dma-landing-page';

    private readonly textSelectors: Record<LandingPageText, string> = {
        heading: 'h1',
        lede: '.lede',
        hint: '.hint',
    };

    private readonly headingsLocator = this.locatorForAll('h1');
    private readonly chipLocator = this.locatorFor(ChipHarness);
    private readonly callsToActionLocator = this.locatorFor(CallsToActionHarness);
    private readonly glowLocator = this.locatorFor(GlowHarness);

    /** The number of level 1 headings, which a page has one of. */
    public async countHeadings(): Promise<number> {
        return (await this.headingsLocator()).length;
    }

    public async getChip(): Promise<ChipHarness> {
        return await this.chipLocator();
    }

    public async getCallsToAction(): Promise<CallsToActionHarness> {
        return await this.callsToActionLocator();
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

    /** The distance in pixels from the bottom of the calls to action to the top of the hint under them. */
    public async getHintOffset(): Promise<number> {
        const [callsToAction, hint] = await Promise.all([
            this.locatorFor(CallsToActionHarness.hostSelector)(),
            this.locatorFor(this.textSelectors.hint)(),
        ]);
        const [buttons, note] = await Promise.all([callsToAction.getDimensions(), hint.getDimensions()]);

        return note.top - (buttons.top + buttons.height);
    }

    public async getGlow(): Promise<GlowHarness> {
        return await this.glowLocator();
    }
}
