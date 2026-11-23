import{n as e,r as t}from"./rolldown-runtime-vtgMY1y5.js";import{F as n,G as r,N as i,T as a,W as o,Y as s,gt as c,ht as l,rt as u}from"./angular-platform-D63w9Bs1.js";import{a as d,t as f}from"./dist-DO7ij1q7.js";import{t as p}from"./button.component-CJmqp8kC.js";import{_ as m,p as h}from"./icon-sun.component-WJWFox0D.js";import{t as g}from"./icon-DIl8ZgyI.js";import{t as _}from"./logo.component-D5z0YQqP.js";import{n as v,t as y}from"./theme-picker-DkJDy5AO.js";import{o as b,r as x,t as S}from"./theme-picker.component-DABLGkn8.js";import{n as C,t as w}from"./theme-Bo_xnndN.js";import{n as T,r as E,t as D}from"./header.component-0-xkb43G.js";import{t as O}from"./nav-link.component-Deun_a8t.js";import{t as k}from"./nav-link-Xbio1j0p.js";var A;function init_vite_plugin_angular_raw_L2hvbWUvcnVubmVyL3dvcmsvY3JpdHNvdXJjZS9jcml0c291cmNlL3BhY2thZ2VzL3VpL3dlYi9zcmMvY29tcG9uZW50cy9tb2JpbGUtbWVudS9tb2JpbGUtbWVudS5jb21wb25lbnQuaHRtbA(){return(init_vite_plugin_angular_raw_L2hvbWUvcnVubmVyL3dvcmsvY3JpdHNvdXJjZS9jcml0c291cmNlL3BhY2thZ2VzL3VpL3dlYi9zcmMvY29tcG9uZW50cy9tb2JpbGUtbWVudS9tb2JpbGUtbWVudS5jb21wb25lbnQuaHRtbA=e((()=>{A=`<div class="bar">
    <ng-content />
    <!-- The browser focuses Close when the menu opens, as Penpot asks, rather than the link home before it. The rule
         guards against autofocus on page load, while the HTML spec picks the focus of an opening dialog this way. -->
    <!-- eslint-disable-next-line @angular-eslint/template/no-autofocus -- A dialog picks its focus by autofocus. -->
    <button dma-button type="button" kind="quiet" class="close" autofocus (click)="close()">
        <dma-icon-close />
        <span class="label">Close</span>
    </button>
</div>
<div class="body">
    <nav aria-label="Main">
        <ng-content select="a[dma-nav-link]" />
    </nav>
    <ng-content select="a[dma-button]" />
    <div class="theme">
        <!-- The legend of the picker names the group for assistive technology, so the title isn't read twice. -->
        <p class="title" aria-hidden="true">Theme</p>
        <fieldset dma-theme-picker></fieldset>
    </div>
</div>
`})))()}var j;function init_mobile_menu_component(){return(init_mobile_menu_component=e((()=>{j=`dialog[dma-mobile-menu]{box-sizing:border-box;background:var(--color-background-page);block-size:100%;max-block-size:none;inline-size:100%;max-inline-size:none;color:var(--color-foreground-default);overscroll-behavior:contain;border:0;margin:0;padding:0;inset:0;overflow-y:auto}dialog[dma-mobile-menu][open]{flex-direction:column;display:flex}:root:has(dialog[dma-mobile-menu]:modal){overflow:hidden}dialog[dma-mobile-menu]>.bar{box-sizing:border-box;justify-content:space-between;align-items:center;column-gap:var(--space-16);padding:var(--space-12) var(--space-page-inline) calc(var(--space-12) - var(--border-width-default));border-block-end:var(--border-width-default) solid var(--color-border-divider);flex:none;display:flex;container:dma-mobile-menu-bar/inline-size}@container dma-mobile-menu-bar (inline-size<16.5rem){dialog[dma-mobile-menu]>.bar>.close{flex-basis:var(--size-target-min);inline-size:var(--size-target-min);padding-inline:0}dialog[dma-mobile-menu]>.bar>.close>.label{clip-path:inset(50%);white-space:nowrap;block-size:1px;inline-size:1px;position:absolute;overflow:hidden}}dialog[dma-mobile-menu]>.bar>a{border-radius:var(--radius-xs);text-decoration:none;display:flex}dialog[dma-mobile-menu]>.bar>a:focus-visible{outline:var(--border-width-focus) solid var(--color-focus-ring);outline-offset:var(--focus-offset)}dialog[dma-mobile-menu]>.body{gap:var(--space-24);padding:var(--space-16) var(--space-page-inline) var(--space-24);flex-direction:column;display:flex}dialog[dma-mobile-menu]>.body>nav{gap:var(--space-4);border-block-end:var(--border-width-default) solid var(--color-border-divider);flex-direction:column;padding-block-end:var(--space-24);display:flex}dialog[dma-mobile-menu]>.body>.theme{gap:var(--space-12);flex-direction:column;display:flex}dialog[dma-mobile-menu]>.body>.theme>.title{color:var(--color-foreground-default);font-family:var(--typography-caps-font-family);font-size:var(--typography-caps-font-size);font-weight:var(--typography-caps-font-weight);letter-spacing:var(--typography-caps-letter-spacing);line-height:var(--typography-caps-line-height);-webkit-text-decoration:var(--typography-caps-text-decoration);text-decoration:var(--typography-caps-text-decoration);text-transform:var(--typography-caps-text-case);margin:0}dialog[dma-mobile-menu]>.body>.theme>[dma-theme-picker]{display:flex;container-type:inline-size}dialog[dma-mobile-menu]>.body>.theme>[dma-theme-picker]>dma-theme-option{flex:1 1 0}`})))()}var M;function init_breakpoints(){return(init_breakpoints=e((()=>{M=`64em`})))()}var N;function init_mobile_menu_component$1(){return(init_mobile_menu_component$1=e((()=>{c(),init_vite_plugin_angular_raw_L2hvbWUvcnVubmVyL3dvcmsvY3JpdHNvdXJjZS9jcml0c291cmNlL3BhY2thZ2VzL3VpL3dlYi9zcmMvY29tcG9uZW50cy9tb2JpbGUtbWVudS9tb2JpbGUtbWVudS5jb21wb25lbnQuaHRtbA(),init_mobile_menu_component(),a(),init_breakpoints(),E(),g(),y(),N=class MobileMenuComponent{dialog=u(n).nativeElement;constructor(){let e=u(s);r(()=>{let t=matchMedia(`(min-width: ${M})`),onChange=({matches:e})=>{e&&this.dialog.close()};t.addEventListener(`change`,onChange),e.onDestroy(()=>{t.removeEventListener(`change`,onChange)})})}showModal(){this.dialog.showModal()}close(){this.dialog.close()}static ctorParameters=()=>[]},N=l([i({selector:`dialog[dma-mobile-menu]`,template:A,encapsulation:o.None,imports:[p,m,S],host:{"aria-label":`Menu`},styles:[j]})],N)})))()}function init_header(){return(init_header=e((()=>{T()})))()}var P=t({Open:()=>L,OpenNarrow:()=>R,WithHeader:()=>z,__namedExportsOrder:()=>B,default:()=>I}),F,I,L,R,z,B;function init_mobile_menu_stories(){return(init_mobile_menu_stories=e((()=>{f(),init_mobile_menu_component$1(),w(),x(),E(),init_header(),g(),v(),k(),F=`
    <a href="#"><dma-logo size="small" /></a>
    <a dma-nav-link kind="row" href="#" aria-current="page">Compendium</a>
    <a dma-nav-link kind="row" href="#">Characters</a>
    <a dma-nav-link kind="row" href="#">Campaigns</a>
    <a dma-button kind="quiet" href="#"><dma-icon-github />GitHub</a>
`,I={title:`Regions/Mobile menu`,component:N,decorators:[d({imports:[D,_,O,p,h]}),C(b.System)],parameters:{layout:`fullscreen`},globals:{viewport:{value:`mobile1`,isRotated:!1}}},L={render:()=>({template:`<dialog dma-mobile-menu>${F}</dialog>`}),play:({canvasElement:e})=>{e.querySelector(`dialog[dma-mobile-menu]`)?.showModal()}},R={...L,globals:{viewport:{value:`narrow`,isRotated:!1}},parameters:{viewport:{options:{narrow:{name:`280 px`,styles:{width:`280px`,height:`640px`},type:`mobile`}}}}},z={render:()=>({template:`
            <header dma-header (menuPressed)="mobileMenu.showModal()">
                <a href="#"><dma-logo size="small" /></a>
            </header>
            <dialog dma-mobile-menu #mobileMenu>${F}</dialog>
        `})},B=[`Open`,`OpenNarrow`,`WithHeader`],L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  render: () => ({
    template: \`<dialog dma-mobile-menu>\${content}</dialog>\`
  }),
  play: ({
    canvasElement
  }) => {
    canvasElement.querySelector<HTMLDialogElement>('dialog[dma-mobile-menu]')?.showModal();
  }
}`,...L.parameters?.docs?.source},description:{story:`The menu open over the page, as the Menu button of Header leaves it. The docs page shows the story in an iframe, so
the modal covers the story rather than the docs page.`,...L.parameters?.docs?.description}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  ...Open,
  globals: {
    viewport: {
      value: 'narrow',
      isRotated: false
    }
  },
  parameters: {
    viewport: {
      options: {
        narrow: {
          name: '280 px',
          styles: {
            width: '280px',
            height: '640px'
          },
          type: 'mobile'
        }
      }
    }
  }
}`,...R.parameters?.docs?.source},description:{story:`The menu open at 280 px, narrower than the labels of Close and the Theme picker need: Close shows its icon alone, so it
stays clear of the link home, and the options of the picker show theirs, so they stay inside its border.`,...R.parameters?.docs?.description}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  render: () => ({
    template: \`
            <header dma-header (menuPressed)="mobileMenu.showModal()">
                <a href="#"><dma-logo size="small" /></a>
            </header>
            <dialog dma-mobile-menu #mobileMenu>\${content}</dialog>
        \`
  })
}`,...z.parameters?.docs?.source},description:{story:`The closed menu below Header. Press Menu to open it, and Close or Escape to close it again. Below 304 px, Menu and
Close both show their icons alone, so the bar keeps its look when the menu opens.`,...z.parameters?.docs?.description}}}})))()}export{P as a,init_mobile_menu_stories as i,R as n,z as r,L as t};