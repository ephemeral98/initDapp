export {};
declare module 'vue' {
  interface ComponentCustomProperties {
    $tv: (param: string) => string;
  }
}
