# 0014. A Tablet theme widens the page margin from 37.5em

- **Status:** Accepted
- **Date:** 2026-11-23
- **Built in:** [#547](https://github.com/critsource/critsource/issues/547)
- **Supersedes:** Part of [0008](0008-theme-mapping.md)

## Context

[ADR 0008](0008-theme-mapping.md) gives the Viewport group two themes: Mobile on `:root`, and Desktop from `64em`. Penpot draws only a Mobile board at 390 px and a Desktop board at 1440 px, so nothing defines the layout in between. From about 600 px up to the desktop breakpoint, the header, every Section, and the footer keep the 20 px Mobile margin. At tablet widths that leaves short columns, such as the hero text, against the left edge with the rest of the row empty, as the review of [#544](https://github.com/critsource/critsource/issues/544) found.

The header, every Section, and the footer take their inline padding from one token, `space.page-inline`, so they line up at every width once that token is set.

## Decision

- **A Tablet theme joins the Viewport group**, from `37.5em` (600 px at the default font size) up to the desktop breakpoint. Its set, `viewport/tablet`, sets `space.page-inline` to `space.48` and nothing else. The other Viewport tokens, such as the section padding and the type sizes, keep their Mobile values, and the header keeps its Mobile layout below `64em`.
- **The theme enables `viewport/mobile` and `viewport/tablet` together** in Penpot, with `viewport/tablet` later in the set order, so a tablet board resolves every Viewport token and Tablet overrides only the margin.
- **`tokens.css` writes the set in `@media (min-width: 37.5em)`**, after the rules on `:root` and before the Desktop rule, so Desktop wins from `64em` up. The build resolves the references of a set over the default sets token by token, so a set that overrides part of `viewport/mobile` resolves against the rest of it.
- **One constant sets the breakpoint**, as for Desktop. `src/breakpoints.ts` holds `tabletBreakpoint`, and the build writes it to the media query and to `$breakpoint-tablet` in `breakpoints.scss`. It is in `em` for the reason ADR 0008 gives.

The rest of ADR 0008 stands: Mobile comes first on `:root`, Desktop applies from `64em`, and the color scheme switches as it records.

## Alternatives

- **Keeping two themes.** It needs no change, but leaves tablet widths with the margin of a phone.
- **A centered content column**, narrower than `--size-content-max`. It would keep the content off the edges at any width, but the header, Section, and footer would each need a centering rule of their own and a new width token.
- **A Tablet set with every Viewport token.** Penpot could then enable the set alone, but it would copy the Mobile values, which would then need changing in two places.

## Consequences

- A tablet board in Penpot needs both sets enabled, which the Tablet theme does; `viewport/tablet` alone leaves the type sizes unresolved.
- A component that needs another layout at tablet widths imports `$breakpoint-tablet`, or `tabletBreakpoint` in a script.
- The Mobile menu takes the Tablet margin too, since it reads the same token.

## Revisit when

- Penpot designs tablet values for the section padding, the section gap, or the type sizes, so `viewport/tablet` grows toward a full set.
- The layout above 1440 px gets a rule of its own, which may bring the centered column back.
- `@custom-media` ships in the browsers the app supports, as ADR 0008 notes for the desktop breakpoint.
