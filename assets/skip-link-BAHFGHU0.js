import{n as e}from"./rolldown-runtime-vtgMY1y5.js";import{N as t,P as n,c as r,i,n as a,s as o,x as s}from"./blocks-BhFUhSw1.js";import{a as c,i as l,n as u,o as d,r as f,t as p}from"./skip-link.stories-DH87I0bU.js";function _createMdxContent(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,pre:`pre`,...n(),...e.components};return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(o,{of:d}),`
`,(0,m.jsx)(t.h1,{id:`skip-link`,children:`Skip link`}),`
`,(0,m.jsx)(t.p,{children:`A link past the header to the main content, for readers who use a keyboard. It is the Skip link component of the design system in Penpot, and every page starts with it.`}),`
`,(0,m.jsx)(a,{of:p}),`
`,(0,m.jsx)(i,{of:p}),`
`,(0,m.jsx)(t.h2,{id:`placing-a-skip-link`,children:`Placing a skip link`}),`
`,(0,m.jsxs)(t.p,{children:[`Skip link is an attribute on `,(0,m.jsx)(t.code,{children:`<a>`}),`. Place it as the first focusable item of the page, before the header, and set `,(0,m.jsx)(t.code,{children:`href`}),` to the id of the main content:`]}),`
`,(0,m.jsx)(t.pre,{children:(0,m.jsx)(t.code,{className:`language-html`,children:`<a dma-skip-link href="#main">Skip to main content</a>
<header>…</header>
<main id="main">…</main>
`})}),`
`,(0,m.jsxs)(t.p,{children:[`Activating the link moves focus to the element with that id, rather than following the link, since the `,(0,m.jsx)(t.code,{children:`<base href="/">`}),` of the app would resolve `,(0,m.jsx)(t.code,{children:`#main`}),` against the root page. An element that can't take focus by itself, such as `,(0,m.jsx)(t.code,{children:`<main>`}),`, gets `,(0,m.jsx)(t.code,{children:`tabindex="-1"`}),` until it loses focus again. When no element has the id, or `,(0,m.jsx)(t.code,{children:`href`}),` names another page, the link works as a native link.`]}),`
`,(0,m.jsx)(t.h2,{id:`focus`,children:`Focus`}),`
`,(0,m.jsx)(t.p,{children:`The skip link stays hidden until it gets focus. It hides from sight only, so it stays in the accessibility tree and in the tab order.`}),`
`,(0,m.jsx)(a,{of:u}),`
`,(0,m.jsx)(t.p,{children:`On focus, the skip link pins to the top left of the viewport, 16 px from both edges and above the header. It draws the colors of the primary Button and the focus ring, and hides again once it loses focus. Penpot draws the link in this state only, since the link shows only while it has focus; the story at the top of this page shows it.`}),`
`,(0,m.jsx)(t.p,{children:`Press Tab in the story below to show the skip link, then Enter to move focus to the main content:`}),`
`,(0,m.jsx)(a,{of:f}),`
`,(0,m.jsx)(t.h2,{id:`target`,children:`Target`}),`
`,(0,m.jsxs)(t.p,{children:[`A target that can't take focus by itself, such as `,(0,m.jsx)(t.code,{children:`<main>`}),`, draws the focus ring while the skip link has moved focus to it, as the Target board in Penpot shows. Without a ring, nothing would show where focus went.`]}),`
`,(0,m.jsx)(a,{of:l}),`
`,(0,m.jsxs)(t.p,{children:[`The ring has the color and width of the focus ring of the other components, but lies inside the edge of the target rather than outside it. A `,(0,m.jsx)(t.code,{children:`<main>`}),` as wide as the viewport would push an outer ring off-screen at the sides, and a parent with `,(0,m.jsx)(t.code,{children:`overflow: hidden`}),` would clip it.`]}),`
`,(0,m.jsxs)(t.p,{children:[`The skip link marks the target with `,(0,m.jsx)(t.code,{children:`data-dma-skip-target`}),` until the target loses focus, and ships the rule that draws the ring, so a page needs no style of its own. The rule matches `,(0,m.jsx)(t.code,{children:`:focus`}),` rather than `,(0,m.jsx)(t.code,{children:`:focus-visible`}),`, since browsers apply `,(0,m.jsx)(t.code,{children:`:focus-visible`}),` to programmatic focus by heuristics that differ between them. A target with a `,(0,m.jsx)(t.code,{children:`tabindex`}),` of its own stays unmarked and keeps its own focus style.`]}),`
`,(0,m.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,m.jsx)(t.p,{children:`The projected content names the skip link to assistive technology. Write a label that says where the link goes, such as "Skip to main content". On focus, the skip link is at least 44 px tall, the minimum target size.`}),`
`,(0,m.jsx)(t.h2,{id:`testing`,children:`Testing`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`SkipLinkHarness`}),` from `,(0,m.jsx)(t.code,{children:`@critsource/ui-web/testing`}),` reads a skip link in a test: its text, whether it shows, its colors and font weight, its place, height, padding, and corners, and the focus rings of the link and its target.`]})]})}function MDXContent(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,m.jsx)(t,{...e,children:(0,m.jsx)(_createMdxContent,{...e})}):_createMdxContent(e)}var m;function init_skip_link(){return(init_skip_link=e((()=>{m=s(),t(),r(),c()})))()}init_skip_link();export{MDXContent as default};