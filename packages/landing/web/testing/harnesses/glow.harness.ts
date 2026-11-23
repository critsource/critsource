import { ComponentHarness } from '@angular/cdk/testing';

/** How the glow draws: its opacity, and its place in the stacking order of its container. */
export interface GlowLook {
    opacity: string;
    zIndex: string;
}

export class GlowHarness extends ComponentHarness {
    public static readonly hostSelector = 'dma-glow';

    /** The `aria-hidden` attribute of the glow, which is `'true'` since the glow is decorative. */
    public async getAriaHidden(): Promise<string | null> {
        return await (await this.host()).getAttribute('aria-hidden');
    }

    public async getLook(): Promise<GlowLook> {
        const host = await this.host();
        const [opacity, zIndex] = await Promise.all([host.getCssValue('opacity'), host.getCssValue('z-index')]);

        return { opacity, zIndex };
    }

    /** The width and height of the glow in pixels. */
    public async getSize(): Promise<{ width: number; height: number }> {
        const { width, height } = await (await this.host()).getDimensions();

        return { width, height };
    }
}
