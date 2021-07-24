const { getLoader, loaderByName } = require("@craco/craco");

// see: https://webpack.js.org/configuration/module/#condition
type Condition =
  | string
  | RegExp
  | Array<Condition>
  | ((arg: any) => boolean)
  | {
      test?: Condition;
      include?: Condition;
      exclude?: Condition;
      and?: Array<Condition>;
      or?: Array<Condition>;
      not?: Array<Condition>;
    };

type LoaderRule = {
  include?: Condition;
  exclude?: Condition;
};

const getArray = (source?: Condition): Array<Condition> => {
  if (!source) {
    return [];
  }

  return Array.isArray(source) ? source : [source];
};

const include = (babel_loader: LoaderRule, ...includes: Array<Condition>) => {
  const include_config = getArray(babel_loader.include);

  const _includes = includes.reduce((accumulator, include) => {
    if (Array.isArray(include)) {
      return (accumulator as Array<Condition>).concat(include);
    }

    (accumulator as Array<Condition>).push(include);
    return accumulator;
  }, include_config);

  babel_loader.include = _includes;
};

const exclude = (babel_loader: LoaderRule, ...excludes: Array<Condition>) => {
  const exclude_config = getArray(babel_loader.exclude);

  const _excludes = excludes.reduce((accumulator, exclude) => {
    if (Array.isArray(exclude)) {
      return (accumulator as Array<Condition>).concat(exclude);
    }

    (accumulator as Array<Condition>).push(exclude);
    return accumulator;
  }, exclude_config);

  babel_loader.exclude = _excludes;
};

export const overrideWebpackConfig = ({
  webpackConfig,
  pluginOptions: { includes = [], excludes = [] },
}) => {
  const { isFound, match } = getLoader(
    webpackConfig,
    loaderByName("babel-loader")
  );
  if (isFound) {
    includes.forEach((path) => include(match.loader, path));
    excludes.forEach((path) => exclude(match.loader, path));
  }
  return webpackConfig;
};
