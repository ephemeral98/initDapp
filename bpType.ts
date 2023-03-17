export {};
declare module 'vue' {
  interface ComponentCustomProperties {
    $p: (param: string) => string;
  }
}
