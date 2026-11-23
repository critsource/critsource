import{n as e,r as t}from"./rolldown-runtime-vtgMY1y5.js";import{F as n,J as r,N as i,T as a,W as o,gt as s,ht as c,l,rt as u}from"./angular-platform-D63w9Bs1.js";import{a as d,r as f,t as p}from"./dist-DO7ij1q7.js";import{t as m}from"./nav-link.component-Deun_a8t.js";import{t as h}from"./nav-link-Xbio1j0p.js";var g;function init_vite_plugin_angular_raw_L2hvbWUvcnVubmVyL3dvcmsvY3JpdHNvdXJjZS9jcml0c291cmNlL3BhY2thZ2VzL3VpL3dlYi9zcmMvY29tcG9uZW50cy9za2lwLWxpbmsvc2tpcC1saW5rLmNvbXBvbmVudC5odG1s(){return(init_vite_plugin_angular_raw_L2hvbWUvcnVubmVyL3dvcmsvY3JpdHNvdXJjZS9jcml0c291cmNlL3BhY2thZ2VzL3VpL3dlYi9zcmMvY29tcG9uZW50cy9za2lwLWxpbmsvc2tpcC1saW5rLmNvbXBvbmVudC5odG1s=e((()=>{g=`<ng-content />
`})))()}var _;function init_skip_link_component(){return(init_skip_link_component=e((()=>{_=`a[dma-skip-link]{top:var(--space-16);left:var(--space-16);clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:fixed;overflow:hidden}a[dma-skip-link]:focus{z-index:1000;width:auto;height:auto;min-height:var(--size-target-min);padding:0 var(--space-16);clip-path:none;border-radius:var(--radius-md);outline:var(--border-width-focus) solid var(--color-focus-ring);outline-offset:var(--focus-offset);background:var(--color-accent-default);color:var(--color-foreground-on-accent);font-family:var(--typography-button-font-family);font-size:var(--typography-button-font-size);font-weight:var(--typography-button-font-weight);letter-spacing:var(--typography-button-letter-spacing);line-height:var(--typography-button-line-height);-webkit-text-decoration:var(--typography-button-text-decoration);text-decoration:var(--typography-button-text-decoration);text-transform:var(--typography-button-text-case);align-items:center;display:inline-flex;overflow:visible}[data-dma-skip-target]:focus{outline:var(--border-width-focus) solid var(--color-focus-ring);outline-offset:calc(-1 * var(--border-width-focus))}`})))()}var v,y;function init_skip_link_component$1(){return(init_skip_link_component$1=e((()=>{s(),init_vite_plugin_angular_raw_L2hvbWUvcnVubmVyL3dvcmsvY3JpdHNvdXJjZS9jcml0c291cmNlL3BhY2thZ2VzL3VpL3dlYi9zcmMvY29tcG9uZW50cy9za2lwLWxpbmsvc2tpcC1saW5rLmNvbXBvbmVudC5odG1s(),init_skip_link_component(),l(),a(),v=`data-dma-skip-target`,y=class SkipLinkComponent{document=u(r);host=u(n);skipToTarget(e){let t=this.host.nativeElement.getAttribute(`href`);if(!t?.startsWith(`#`))return;let n=this.document.getElementById(decodeURIComponent(t.slice(1)));n&&(e.preventDefault(),n.hasAttribute(`tabindex`)||(n.setAttribute(`tabindex`,`-1`),n.setAttribute(v,``),n.addEventListener(`blur`,()=>{n.removeAttribute(`tabindex`),n.removeAttribute(v)},{once:!0})),n.focus())}},y=c([i({selector:`a[dma-skip-link]`,template:g,encapsulation:o.None,host:{"(click)":`skipToTarget($event)`},styles:[_]})],y)})))()}var b=t({Focus:()=>C,Hidden:()=>S,OnPage:()=>T,Target:()=>w,__namedExportsOrder:()=>E,default:()=>x}),x,S,C,w,T,E;function init_skip_link_stories(){return(init_skip_link_stories=e((()=>{p(),init_skip_link_component$1(),h(),x={title:`Elements/Skip link`,component:y,argTypes:{label:{description:`The content the skip link projects, which names it to assistive technology.`,control:`text`}},parameters:{controls:{exclude:[`skipToTarget`]}},decorators:[f(e=>`<div style="transform: translate(0); min-height: calc(var(--size-target-min) + 2 * var(--space-16))">${e}</div>`)],render:e=>({props:e,template:`<a dma-skip-link href="#main">{{ label }}</a>`})},S={args:{label:`Skip to main content`}},C={args:{label:`Skip to main content`},parameters:{pseudo:{focus:!0}}},w={args:{label:`Skip to main content`},parameters:{pseudo:{focus:[`main`]}},render:e=>({props:e,template:`
            <a dma-skip-link href="#story-target">{{ label }}</a>
            <main id="story-target" data-dma-skip-target tabindex="-1" style="padding: var(--space-24) var(--space-32)">
                Main content
            </main>
        `})},T={args:{label:`Skip to main content`},decorators:[d({imports:[m]})],render:e=>({props:e,template:`
            <a dma-skip-link href="#story-main">{{ label }}</a>
            <header style="display: flex; justify-content: flex-end; padding: var(--space-16)">
                <nav aria-label="Main" style="display: flex; gap: var(--space-4)">
                    <a dma-nav-link href="#">Compendium</a>
                    <a dma-nav-link href="#">Characters</a>
                    <a dma-nav-link href="#">Campaigns</a>
                </nav>
            </header>
            <main id="story-main" style="padding: var(--space-16)">Main content</main>
        `})},E=[`Hidden`,`Focus`,`Target`,`OnPage`],S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Skip to main content'
  }
}`,...S.parameters?.docs?.source},description:{story:`The skip link before it gets focus: hidden from sight, but still in the accessibility tree.`,...S.parameters?.docs?.description}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Skip to main content'
  },
  parameters: {
    pseudo: {
      focus: true
    }
  }
}`,...C.parameters?.docs?.source},description:{story:`The skip link with focus, the look Penpot draws.`,...C.parameters?.docs?.description}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Skip to main content'
  },
  parameters: {
    pseudo: {
      focus: ['main']
    }
  },
  render: args => ({
    props: args,
    template: \`
            <a dma-skip-link href="#story-target">{{ label }}</a>
            <main id="story-target" data-dma-skip-target tabindex="-1" style="padding: var(--space-24) var(--space-32)">
                Main content
            </main>
        \`
  })
}`,...w.parameters?.docs?.source},description:{story:`The target with focus once the skip link moved focus to it, the look of the Target board in Penpot.`,...w.parameters?.docs?.description}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Skip to main content'
  },
  decorators: [moduleMetadata({
    imports: [NavLinkComponent]
  })],
  render: args => ({
    props: args,
    template: \`
            <a dma-skip-link href="#story-main">{{ label }}</a>
            <header style="display: flex; justify-content: flex-end; padding: var(--space-16)">
                <nav aria-label="Main" style="display: flex; gap: var(--space-4)">
                    <a dma-nav-link href="#">Compendium</a>
                    <a dma-nav-link href="#">Characters</a>
                    <a dma-nav-link href="#">Campaigns</a>
                </nav>
            </header>
            <main id="story-main" style="padding: var(--space-16)">Main content</main>
        \`
  })
}`,...T.parameters?.docs?.source},description:{story:`The skip link as the first focusable item of a page. Press Tab in the story to show it, then Enter to skip.`,...T.parameters?.docs?.description}}}})))()}export{init_skip_link_stories as a,w as i,S as n,b as o,T as r,C as t};