import { ComponentHarness } from '@angular/cdk/testing';
import { ButtonHarness } from '@critsource/ui-web/testing';

/** Where a button of the calls to action sits, in pixels from the top left corner of the calls to action. */
export interface CallsToActionButtonBox {
    top: number;
    left: number;
    width: number;
    height: number;
}

export class CallsToActionHarness extends ComponentHarness {
    public static readonly hostSelector = 'dma-calls-to-action';

    private readonly buttonsLocator = this.locatorForAll(ButtonHarness);
    private readonly buttonElementsLocator = this.locatorForAll(ButtonHarness.hostSelector);

    /** The buttons, in the order they draw. */
    public async getButtons(): Promise<ButtonHarness[]> {
        return await this.buttonsLocator();
    }

    /** Where each button sits, in the order they draw. */
    public async getButtonBoxes(): Promise<CallsToActionButtonBox[]> {
        const [host, buttons] = await Promise.all([(await this.host()).getDimensions(), this.buttonElementsLocator()]);

        return await Promise.all(
            buttons.map(async (button) => {
                const { top, left, width, height } = await button.getDimensions();

                return { top: top - host.top, left: left - host.left, width, height };
            }),
        );
    }

    /** The width of the calls to action in pixels. */
    public async getWidth(): Promise<number> {
        return (await (await this.host()).getDimensions()).width;
    }
}
