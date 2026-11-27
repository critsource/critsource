import { ComponentHarness, type ElementDimensions } from '@angular/cdk/testing';
import { ChipHarness } from '@critsource/ui-web/testing';
import { CallsToActionHarness } from './calls-to-action.harness';
import { ClosingCallToActionHarness } from './closing-call-to-action.harness';
import { FaqHarness } from './faq.harness';
import { FeaturesHarness } from './features.harness';
import { GetInvolvedHarness } from './get-involved.harness';
import { GlowHarness } from './glow.harness';
import { ProblemHarness } from './problem.harness';
import { TabbedPreviewHarness } from './tabbed-preview.harness';

/** A text of the hero, which the harness reads by its role. */
export type LandingPageText = 'heading' | 'lede' | 'hint';

/** How a text of the hero draws. */
export interface LandingPageTextLook {
    color: string;
    fontSize: string;
}

/**
 * Reads the landing page: the chip, texts, calls to action, glow, and preview of its hero, its problem section, its
 * features section, its get-involved section, its FAQ, and its closing call to action.
 */
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
    private readonly previewLocator = this.locatorFor(TabbedPreviewHarness);
    private readonly textBoxLocator = this.locatorFor('.text');
    private readonly problemLocator = this.locatorFor(ProblemHarness);
    private readonly featuresLocator = this.locatorFor(FeaturesHarness);
    private readonly getInvolvedLocator = this.locatorFor(GetInvolvedHarness);
    private readonly faqLocator = this.locatorFor(FaqHarness);
    private readonly closingCallToActionLocator = this.locatorFor(ClosingCallToActionHarness);

    /** The number of level 1 headings, which a page has one of. */
    public async countHeadings(): Promise<number> {
        return (await this.headingsLocator()).length;
    }

    public async getChip(): Promise<ChipHarness> {
        return await this.chipLocator();
    }

    /** The calls to action of the hero, which come before those of the closing call to action. */
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

    /** The glow of the hero, which comes before that of the closing call to action. */
    public async getGlow(): Promise<GlowHarness> {
        return await this.glowLocator();
    }

    public async getPreview(): Promise<TabbedPreviewHarness> {
        return await this.previewLocator();
    }

    /** Where the text of the hero sits on the page. */
    public async getTextBox(): Promise<ElementDimensions> {
        return await (await this.textBoxLocator()).getDimensions();
    }

    public async getProblem(): Promise<ProblemHarness> {
        return await this.problemLocator();
    }

    public async getFeatures(): Promise<FeaturesHarness> {
        return await this.featuresLocator();
    }

    public async getGetInvolved(): Promise<GetInvolvedHarness> {
        return await this.getInvolvedLocator();
    }

    public async getFaq(): Promise<FaqHarness> {
        return await this.faqLocator();
    }

    public async getClosingCallToAction(): Promise<ClosingCallToActionHarness> {
        return await this.closingCallToActionLocator();
    }
}
