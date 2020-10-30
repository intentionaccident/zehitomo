declare namespace StylesSassNamespace {
  export interface IStylesSass {
    activeImage: string;
    checkboxLabel: string;
    hoverImage: string;
    image: string;
    imageColumn: string;
    overlay: string;
  }
}

declare const StylesSassModule: StylesSassNamespace.IStylesSass & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesSassNamespace.IStylesSass;
};

export = StylesSassModule;
