This is an updated fork of [`craco-babel-loader`](https://github.com/rjerue/craco-babel-loader) that works with the latest versions of [`@craco/craco`](https://github.com/gsoft-inc/craco) and [`create-react-app 4`](https://github.com/facebook/create-react-app#readme).
___

> Rewire [`babel-loader`](https://github.com/babel/babel-loader) configuration in your [`create-react-app`](https://github.com/facebookincubator/create-react-app) project using [`@craco/craco`](https://github.com/sharegate/craco).

Let's presume there is an awesome library you found on npm that you want to use within your **un-ejected**  [`create-react-app`](https://github.com/facebookincubator/create-react-app) project, but unfortunately, it's published in ES6+ or Typescript. Since `node_modules` doesn't go through `babel-loader`, you cannot *really* use it.

Another common usecase is the one where the `React` app is part of a __monorepo__ project where multiple sibling packages reside.

```
/packages
  |
  --/react-app
  |
  --/shared
  |
  --/server
```

Let's suppose inside `/shared` directory there is some __Typescript__ code that both `/react-app` and `/server` import. The `/shared` directory will be treated as a dependency for `/react-app` and `/server`, and according to the monorepo setup, `/shared` will most likely be placed inside the `node_modules` directory of the other 2 packages.

Running `/server` with `ts-node` for example will successfully allow the Typescript code from `/shared` to be used at runtime. This is not the case with `/react-app`.

In order to obtain the same outcome in a [`create-react-app`](https://github.com/facebookincubator/create-react-app) project that runs with `react-scripts` (check package.json -> scripts), we need to override the [`create-react-app`](https://github.com/facebookincubator/create-react-app) __babel__ configuration. For that we can use [`@craco/craco`](https://github.com/gsoft-inc/craco) and this [`craco-babel-loader-plugin`](https://github.com/AlexandruCalinica/-craco-babel-loader/) plugin.   

See below for usage.

## Install


```sh
$ yarn add craco-babel-loader-plugin
# npm v5+
$ npm install craco-babel-loader-plugin
# before npm v5
$ npm install --save craco-babel-loader-plugin
```

## Usage

```js
// craco.config.js

const path = require("path");
const fs = require("fs");

const rewireBabelLoader = require("craco-babel-loader-plugin");

// helpers

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
  plugins: [
        //This is a craco plugin: https://github.com/sharegate/craco/blob/master/packages/craco/README.md#configuration-overview
        { plugin: rewireBabelLoader, 
          options: { 
            includes: [resolveApp("node_modules/isemail")], //put things you want to include in array here
            excludes: [/(node_modules|bower_components)/] //things you want to exclude here
            //you can omit include or exclude if you only want to use one option
          }
        }
    ]
}

```


Development
===========

- `node.js` and `npm`. See: https://github.com/creationix/nvm#installation
- `npm` dependencies. Run: `yarn install`

## Chores

- Prettier: `npm run pretty`
- Build: `npm run build`

License
=======

MIT.
