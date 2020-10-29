declare namespace StylesSassNamespace {
  export interface IStylesSass {
    image: string;
    overlay: string;
  }
}

declare const StylesSassModule: StylesSassNamespace.IStylesSass & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesSassNamespace.IStylesSass;
};

export = StylesSassModule;
