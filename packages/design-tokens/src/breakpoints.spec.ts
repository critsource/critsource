import { buildBreakpoints } from './breakpoints.ts';

describe('buildBreakpoints', () => {
    it('holds the tablet breakpoint in em', () => {
        expect(buildBreakpoints()).toContain('\n$breakpoint-tablet: 37.5em;\n');
    });

    it('holds the desktop breakpoint in em', () => {
        expect(buildBreakpoints()).toContain('\n$breakpoint-desktop: 64em;\n');
    });
});
