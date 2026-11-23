import { ComponentHarness, type ElementDimensions } from '@angular/cdk/testing';
import { ButtonHarness, LinkHarness, SectionIntroHarness } from '@critsource/ui-web/testing';

/** How a text of a get-involved card draws. */
export interface GetInvolvedTextLook {
    color: string;
    fontSize: string;
}

/** A card of the get-involved section: its heading, text, hint, buttons, and links. */
export class GetInvolvedCardHarness extends ComponentHarness {
    public static readonly hostSelector = '.card';

    private readonly headingLocator = this.locatorFor(':scope > :is(h1, h2, h3, h4, h5, h6)');
    private readonly textLocator = this.locatorFor(':scope > p:not(.hint)');
    private readonly hintLocator = this.locatorForOptional(':scope > .hint');
    private readonly buttonsLocator = this.locatorForAll(ButtonHarness);
    private readonly buttonElementLocator = this.locatorForOptional(ButtonHarness.hostSelector);
    private readonly linksLocator = this.locatorForAll(LinkHarness);
    private readonly linkElementsLocator = this.locatorForAll(LinkHarness.hostSelector);

    /** The text and level of the heading, such as 3 for an `h3`. */
    public async getHeading(): Promise<{ text: string; level: number }> {
        const heading = await this.headingLocator();
        const [text, tagName] = await Promise.all([heading.text(), heading.getProperty<string>('tagName')]);

        return { text, level: Number(tagName.slice(1)) };
    }

    public async getText(): Promise<string> {
        return await (await this.textLocator()).text();
    }

    /** The text of the hint, or `null` when the card has none. */
    public async getHint(): Promise<string | null> {
        return (await (await this.hintLocator())?.text()) ?? null;
    }

    /** How the text draws, or the hint when asked for it. */
    public async getTextLook(text: 'text' | 'hint' = 'text'): Promise<GetInvolvedTextLook> {
        const element = text === 'hint' ? await this.hintLocator() : await this.textLocator();

        if (!element) {
            throw new Error('The card has no hint.');
        }
        const [color, fontSize] = await Promise.all([element.getCssValue('color'), element.getCssValue('font-size')]);

        return { color, fontSize };
    }

    /** The buttons, in the order they draw. */
    public async getButtons(): Promise<ButtonHarness[]> {
        return await this.buttonsLocator();
    }

    /** The links that are not buttons, in the order they draw. */
    public async getLinks(): Promise<LinkHarness[]> {
        return await this.linksLocator();
    }

    /** The `href` of each button, then of each link, in the order they draw. */
    public async getHrefs(): Promise<(string | null)[]> {
        const [button, links] = await Promise.all([this.buttonElementLocator(), this.linkElementsLocator()]);

        return await Promise.all(
            [button, ...links].filter((element) => element !== null).map((element) => element.getAttribute('href')),
        );
    }

    /**
     * Where the card and its parts sit on the page: the button and hint `null` when the card has none, and the links
     * empty when it has none.
     */
    public async getBoxes(): Promise<{
        card: ElementDimensions;
        button: ElementDimensions | null;
        hint: ElementDimensions | null;
        links: ElementDimensions[];
    }> {
        const [card, button, hint, links] = await Promise.all([
            this.host(),
            this.buttonElementLocator(),
            this.hintLocator(),
            this.linkElementsLocator(),
        ]);

        const [cardBox, buttonBox, hintBox, linkBoxes] = await Promise.all([
            card.getDimensions(),
            button?.getDimensions() ?? null,
            hint?.getDimensions() ?? null,
            Promise.all(links.map((link) => link.getDimensions())),
        ]);

        return { card: cardBox, button: buttonBox, hint: hintBox, links: linkBoxes };
    }
}

/** Reads the get-involved section of the landing page: its intro and its cards. */
export class GetInvolvedHarness extends ComponentHarness {
    public static readonly hostSelector = 'dma-get-involved';

    private readonly introLocator = this.locatorFor(SectionIntroHarness);
    private readonly cardsLocator = this.locatorForAll(GetInvolvedCardHarness);
    private readonly formsLocator = this.locatorForAll('form, input, textarea');

    public async getIntro(): Promise<SectionIntroHarness> {
        return await this.introLocator();
    }

    /** The cards, in the order of the source. */
    public async getCards(): Promise<GetInvolvedCardHarness[]> {
        return await this.cardsLocator();
    }

    /** The number of forms and fields, which the section has none of, since it collects no personal data. */
    public async countFormControls(): Promise<number> {
        return (await this.formsLocator()).length;
    }
}
