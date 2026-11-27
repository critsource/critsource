import { ComponentHarness, type ElementDimensions } from '@angular/cdk/testing';
import { CallsToActionHarness } from './calls-to-action.harness';
import { GlowHarness } from './glow.harness';

/** A text of the closing call to action: its heading, or the line under it. */
export type ClosingCallToActionText = 'heading' | 'line';

/** How a text of the closing call to action draws. */
export interface ClosingCallToActionTextLook {
    color: string;
    fontSize: string;
    textAlign: string;
}

/** Reads the closing call to action of the landing page: its heading, line, calls to action, and glow. */
export class ClosingCallToActionHarness extends ComponentHarness {
    public static readonly hostSelector = 'dma-closing-call-to-action';

    private readonly textSelectors: Record<ClosingCallToActionText, string> = {
        heading: '.text > :is(h1, h2, h3, h4, h5, h6)',
        line: '.text > p',
    };

    private readonly sectionLocator = this.locatorFor('section');
    private readonly callsToActionLocator = this.locatorFor(CallsToActionHarness);
    private readonly callsToActionElementLocator = this.locatorFor(CallsToActionHarness.hostSelector);
    private readonly glowLocator = this.locatorFor(GlowHarness);

    /** The text and level of the heading, such as 2 for an `h2`. */
    public async getHeading(): Promise<{ text: string; level: number }> {
        const heading = await this.locatorFor(this.textSelectors.heading)();
        const [text, tagName] = await Promise.all([heading.text(), heading.getProperty<string>('tagName')]);

        return { text, level: Number(tagName.slice(1)) };
    }

    public async getLine(): Promise<string> {
        return await (await this.locatorFor(this.textSelectors.line)()).text();
    }

    public async getTextLook(text: ClosingCallToActionText): Promise<ClosingCallToActionTextLook> {
        const element = await this.locatorFor(this.textSelectors[text])();
        const [color, fontSize, textAlign] = await Promise.all([
            element.getCssValue('color'),
            element.getCssValue('font-size'),
            element.getCssValue('text-align'),
        ]);

        return { color, fontSize, textAlign };
    }

    public async getCallsToAction(): Promise<CallsToActionHarness> {
        return await this.callsToActionLocator();
    }

    public async getGlow(): Promise<GlowHarness> {
        return await this.glowLocator();
    }

    /** Where the band, its heading, its line, and its calls to action sit on the page. */
    public async getBoxes(): Promise<{
        band: ElementDimensions;
        heading: ElementDimensions;
        line: ElementDimensions;
        callsToAction: ElementDimensions;
    }> {
        const [band, heading, line, callsToAction] = await Promise.all([
            this.sectionLocator(),
            this.locatorFor(this.textSelectors.heading)(),
            this.locatorFor(this.textSelectors.line)(),
            this.callsToActionElementLocator(),
        ]);

        const [bandBox, headingBox, lineBox, callsToActionBox] = await Promise.all([
            band.getDimensions(),
            heading.getDimensions(),
            line.getDimensions(),
            callsToAction.getDimensions(),
        ]);

        return { band: bandBox, heading: headingBox, line: lineBox, callsToAction: callsToActionBox };
    }
}
