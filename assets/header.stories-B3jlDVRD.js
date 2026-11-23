import{n as e,r as t}from"./rolldown-runtime-vtgMY1y5.js";import{a as n,t as r}from"./dist-DO7ij1q7.js";import{t as i}from"./button.component-CJmqp8kC.js";import{p as a}from"./icon-sun.component-WJWFox0D.js";import{t as o}from"./icon-DIl8ZgyI.js";import{t as s}from"./logo.component-D5z0YQqP.js";import{n as c}from"./theme-picker-DkJDy5AO.js";import{n as l,r as u,t as d}from"./header.component-0-xkb43G.js";import{t as f}from"./nav-link.component-Deun_a8t.js";import{t as p}from"./nav-link-Xbio1j0p.js";var m=t({Desktop:()=>g,Mobile:()=>_,MobileNarrow:()=>v,__namedExportsOrder:()=>y,default:()=>h}),h,g,_,v,y;function init_header_stories(){return(init_header_stories=e((()=>{r(),l(),u(),o(),c(),p(),h={title:`Regions/Header`,component:d,decorators:[n({imports:[s,f,i,a]})],render:()=>({template:`
            <header dma-header>
                <a href="#"><dma-logo size="small" /></a>
                <a dma-nav-link href="#" aria-current="page">Compendium</a>
                <a dma-nav-link href="#">Characters</a>
                <a dma-nav-link href="#">Campaigns</a>
                <a dma-button kind="quiet" href="#"><dma-icon-github />GitHub</a>
            </header>
        `})},g={},_={globals:{viewport:{value:`mobile1`,isRotated:!1}}},v={globals:{viewport:{value:`narrow`,isRotated:!1}},parameters:{viewport:{options:{narrow:{name:`280 px`,styles:{width:`280px`,height:`640px`},type:`mobile`}}}}},y=[`Desktop`,`Mobile`,`MobileNarrow`],g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{}`,...g.parameters?.docs?.source},description:{story:`The link home and the nav links at the start, and the GitHub button and the Theme picker at the end, from the
desktop breakpoint up.`,...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  globals: {
    viewport: {
      value: 'mobile1',
      isRotated: false
    }
  }
}`,..._.parameters?.docs?.source},description:{story:`The link home at the start and the Menu button at the end, below the desktop breakpoint. The docs page shows the
story in an iframe narrower than the breakpoint.`,..._.parameters?.docs?.description}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
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
}`,...v.parameters?.docs?.source},description:{story:`The header at 280 px, narrower than the label of the Menu button needs: the button shows its icon alone, so it stays
clear of the link home.`,...v.parameters?.docs?.description}}}})))()}export{init_header_stories as a,m as i,_ as n,v as r,g as t};