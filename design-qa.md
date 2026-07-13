# Design QA

- Source visual truth: `/var/folders/_r/4zrbq4p1395_rfmxln59nwn80000gn/T/codex-clipboard-797bd361-451b-4167-ae21-31e2e73a22d4.png`
- Implementation: `http://localhost:3000/app/profile` and `http://localhost:3000/app/dashboard`
- Implementation screenshot: unavailable; the in-app browser timed out on three screenshot capture attempts.
- Viewports checked: 1280 × 720 desktop and 390 × 844 mobile.
- State: authenticated local user, empty activity history.

## Full-view comparison evidence

Blocked. The reference image was opened and inspected, and the implementation rendered successfully in the in-app browser, but the browser could not produce a screenshot for the required combined visual comparison.

## Focused region evidence

Blocked for the same screenshot-capture issue. Programmatic layout checks found:

- Desktop yearly calendar: 1000 × 270 px card, 739 × 95 px heatmap, no document overflow.
- Desktop weekly card: 557 × 197 px with exactly seven square cells, no document overflow.
- Mobile yearly calendar: 358 px card with an intentional 316 px horizontal scroller for the 739 px heatmap; no page-level overflow.
- Mobile weekly activity: seven 35 px squares; no page-level overflow.
- Browser console: no errors or warnings after successful page loads.

## Findings

- [P2] Required visual fidelity comparison is unavailable.
  - Location: yearly activity card and weekly activity card.
  - Evidence: browser screenshot capture timed out, so typography, spacing, colors, and copy could not be judged side by side with the supplied target.
  - Impact: functional and responsive behavior is verified, but pixel-level visual fidelity is not.
  - Fix: capture both rendered cards when browser screenshot support is available and compare them with the supplied reference.

## Required fidelity surfaces

- Fonts and typography: blocked on screenshot comparison.
- Spacing and layout rhythm: dimensions and overflow verified programmatically; visual comparison blocked.
- Colors and visual tokens: implementation uses the existing Arvexo palette; visual comparison blocked.
- Image quality and asset fidelity: no raster assets are required for these data visualizations.
- Copy and content: verified in the DOM; visual comparison blocked.

## Comparison history

- Initial pass: implementation loaded successfully, but screenshot capture timed out three times at default and explicit desktop viewports.
- Responsive follow-up: desktop and mobile dimensions, overflow, cell counts, and browser console were checked programmatically; no layout overflow or runtime errors were found.

## Implementation checklist

- [x] Real 365-day activity API.
- [x] Profile heatmap with month labels, intensity levels, totals, tooltips, legend, and horizontal mobile scrolling.
- [x] Dashboard reduced to seven uniform weekly squares.
- [x] Desktop and mobile overflow checks.
- [ ] Side-by-side screenshot comparison when capture becomes available.

## Follow-up polish

- Revisit cell size and month-label optical alignment after a screenshot-based comparison.

final result: blocked
