import{n as e}from"./rolldown-runtime-vtgMY1y5.js";import{N as t,P as n,c as r,i,n as a,s as o,x as s}from"./blocks-BhFUhSw1.js";import{a as c,c as l,d as u,f as d,h as f,i as p,l as m,m as h,n as g,o as _,p as v,r as y,s as b,t as x,u as S}from"./link.stories-DShJ4eTD.js";function _createMdxContent(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,p:`p`,pre:`pre`,...n(),...e.components};return(0,C.jsxs)(C.Fragment,{children:[(0,C.jsx)(o,{of:f}),`
`,(0,C.jsx)(t.h1,{id:`link`,children:`Link`}),`
`,(0,C.jsx)(t.p,{children:`A link to another page or site, inside text or on its own. It is the Link component of the design system in Penpot, and Card, Link group, Footer, and Text page hold it.`}),`
`,(0,C.jsx)(a,{of:g}),`
`,(0,C.jsx)(i,{of:g}),`
`,(0,C.jsx)(t.h2,{id:`placing-a-link`,children:`Placing a link`}),`
`,(0,C.jsxs)(t.p,{children:[`Link is an attribute on `,(0,C.jsx)(t.code,{children:`<a>`}),`, so the element keeps the semantics and keyboard behavior of a native link. Add `,(0,C.jsx)(t.code,{children:`routerLink`}),` for a page of the app, or `,(0,C.jsx)(t.code,{children:`href`}),` for another site; Link needs no router:`]}),`
`,(0,C.jsx)(t.pre,{children:(0,C.jsx)(t.code,{className:`language-html`,children:`<a dma-link routerLink="/rules">Rules</a>

<a dma-link kind="standalone" href="https://github.com/critsource/critsource">View on GitHub</a>
`})}),`
`,(0,C.jsx)(t.h2,{id:`kind`,children:`Kind`}),`
`,(0,C.jsxs)(t.p,{children:[(0,C.jsx)(t.code,{children:`kind`}),` picks how the link looks, and an unknown value draws the default. Each kind draws a default, a hover, and a focus state, and the quiet kind also draws a `,(0,C.jsx)(t.a,{href:`#current`,children:`current`}),` state.`]}),`
`,(0,C.jsx)(t.h3,{id:`inline`,children:`Inline`}),`
`,(0,C.jsxs)(t.p,{children:[(0,C.jsx)(t.code,{children:`LinkKind.Inline`}),`, the default, sits in a line of body text. It is underlined in every state, so color is not the only cue, and it turns to the default foreground color on hover.`]}),`
`,(0,C.jsx)(a,{of:x}),`
`,(0,C.jsx)(a,{of:p}),`
`,(0,C.jsx)(t.h3,{id:`standalone`,children:`Standalone`}),`
`,(0,C.jsxs)(t.p,{children:[(0,C.jsx)(t.code,{children:`LinkKind.Standalone`}),` sits on a line of its own, such as at the end of a card. It is bold, ends in an arrow, and gets its underline on hover.`]}),`
`,(0,C.jsx)(a,{of:u}),`
`,(0,C.jsx)(a,{of:v}),`
`,(0,C.jsx)(t.h3,{id:`quiet`,children:`Quiet`}),`
`,(0,C.jsxs)(t.p,{children:[(0,C.jsx)(t.code,{children:`LinkKind.Quiet`}),` sits in a list of links, such as Link group or Footer. It draws as muted body text, and reads as a link on hover.`]}),`
`,(0,C.jsx)(a,{of:l}),`
`,(0,C.jsx)(a,{of:S}),`
`,(0,C.jsx)(t.h2,{id:`current`,children:`Current`}),`
`,(0,C.jsx)(t.p,{children:`A quiet link to the current page, such as Privacy in the footer of the Privacy page, draws as bold body text in the default foreground color. It keeps that look on hover and on focus, so the reader can always tell which page they are on. The inline and standalone kinds draw no current state.`}),`
`,(0,C.jsxs)(t.p,{children:[`Link reads the current page from `,(0,C.jsx)(t.code,{children:`aria-current="page"`}),` on the link, which also tells assistive technology. With the router, `,(0,C.jsx)(t.code,{children:`routerLinkActive`}),` sets it on the link to the active route, so Link still needs no router:`]}),`
`,(0,C.jsx)(t.pre,{children:(0,C.jsx)(t.code,{className:`language-html`,children:`<a dma-link kind="quiet" routerLink="/privacy" routerLinkActive ariaCurrentWhenActive="page">Privacy</a>
`})}),`
`,(0,C.jsx)(a,{of:c}),`
`,(0,C.jsx)(a,{of:b}),`
`,(0,C.jsx)(a,{of:_}),`
`,(0,C.jsx)(t.h2,{id:`focus`,children:`Focus`}),`
`,(0,C.jsx)(t.p,{children:`Every kind draws the focus ring outside itself on keyboard focus, and keeps the colors of its default state.`}),`
`,(0,C.jsx)(a,{of:y}),`
`,(0,C.jsx)(a,{of:d}),`
`,(0,C.jsx)(a,{of:m}),`
`,(0,C.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,C.jsx)(t.p,{children:`The projected content names the link to assistive technology. The arrow of a standalone link hides itself, so screen readers announce the label alone. Write a label that says where the link goes, rather than "Read more", since a screen reader may list the links of a page out of context.`}),`
`,(0,C.jsx)(t.p,{children:`A link takes the height of its line of text, rather than the 44 px target size of Button, since it sits in a line of text or a list of links. Use Button for an action that needs the larger target.`}),`
`,(0,C.jsx)(t.h2,{id:`testing`,children:`Testing`}),`
`,(0,C.jsxs)(t.p,{children:[(0,C.jsx)(t.code,{children:`LinkHarness`}),` from `,(0,C.jsx)(t.code,{children:`@critsource/ui-web/testing`}),` reads a link in a test: its text, its color, its font weight, whether it is underlined, whether it marks the current page, its focus ring, and its arrow.`]})]})}function MDXContent(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,C.jsx)(t,{...e,children:(0,C.jsx)(_createMdxContent,{...e})}):_createMdxContent(e)}var C;function init_link(){return(init_link=e((()=>{C=s(),t(),r(),h()})))()}init_link();export{MDXContent as default};