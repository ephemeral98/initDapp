declare module '*.scss';
declare module 'animate.css';
declare module 'unplugin-auto-import';
declare module '*.scss?inline' {
  import { CSSResult } from 'lit';
  const styles: CSSResult;
  export default styles;
}
declare module '*.css?inline' {
  import { CSSResult } from 'lit';
  const styles: CSSResult;
  export default styles;
}

declare module '*.js?inline' {
  import { CSSResult } from 'lit';
  const styles: CSSResult;
  export default styles;
}

declare interface Window {
  ethereum;
  bpLoading;
  chainModalShow;
  bitkeep;
  require;
  $f;
}
