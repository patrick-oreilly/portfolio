import { THEME_COLORS, THEME_STORAGE_KEY } from "./theme";

declare global {
  interface Window {
    /** Set by Reveal on mount; proves React arrived before the boot timeout lapses. */
    __revealReady?: boolean;
  }
}

/**
 * The first thing in <body>, so it runs before any page content is parsed. Two
 * pre-paint jobs:
 *
 *  - restore a stored colour theme and keep the browser chrome in step
 *  - mark <html> as scriptable, which is what switches on the reveal animations.
 *    The mark is withdrawn if React never arrives, so a bundle that fails to load
 *    degrades to plain visible content instead of a blank page below the hero.
 */
export const bootScript = `(function(){try{
var R=document.documentElement,K=${JSON.stringify(THEME_STORAGE_KEY)},C=${JSON.stringify(THEME_COLORS)};
var s=null;try{s=localStorage.getItem(K);}catch(e){}
if(s==="light"||s==="dark")R.dataset.theme=s;
var t=R.dataset.theme||(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");
var e=document.querySelector('meta[name="theme-color"]');if(e)e.setAttribute("content",C[t]);
R.classList.add("js");
setTimeout(function(){if(!window.__revealReady)R.classList.remove("js");},3000);
}catch(e){}})();`;
