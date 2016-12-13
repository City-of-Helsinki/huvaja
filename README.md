huvaja
======

[![Circle CI](https://circleci.com/gh/City-of-Helsinki/huvaja.svg?style=svg)](https://circleci.com/gh/City-of-Helsinki/huvaja)

Requirements
------------

- [node](http://nodejs.org/) `6.5.0`
- [npm](https://www.npmjs.com/) `3.10.3`

Architecture
------------

- [Redux](https://github.com/reactjs/redux) handles the state management of the app. For more info check their awesome [docs](http://redux.js.org/).
- [React](https://facebook.github.io/react/) handles the rendering of the 'views'.
- [react-redux](https://github.com/reactjs/react-redux) is used to connect the Redux Store to React components.
- [reselect](https://github.com/reactjs/reselect) is used for getting data from Redux Store and manipulating it to be better usable in React components.
- [webpack](https://webpack.github.io/) takes modules with dependencies and generates static assets representing those modules.
- [Babel](https://babeljs.io/) transforms JavaScript written in ES2015 and JSX syntax to regular JavaScript.

Usage
-----

### Starting development server

Follow the instructions below to set up the development environment.
By default the running app can be found at `localhost:3000`.

1. Install npm dependencies:

    ```
    $ npm install
    ```

2. Make sure you have the following env variables set in an .env file in the root of the project:

    ```
    CLIENT_ID
    CLIENT_SECRET
    SESSION_SECRET
    TARGET_APP
    ```

3. Start the development server:

    ```
    $ npm start
    ```

### Starting production server

Follow the instructions below to build and start production server.
By default the production app uses port `8080`.

1. Install npm dependencies:

    ```
    $ npm install
    ```

2. Build the production bundle:

    ```
    $ npm run build
    ```

3. Start the production server:

    ```
    $ npm run start:production
    ```

### Running code linter

- To check the code for linting errors:

    ```
    $ npm run lint
    ```

Code style and linting
----------------------

The code mostly follows the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript).
All JavaScript should be written in ES2015 syntax.
Code is automatically linted with [eslint](http://eslint.org/) when running unit tests or bundling the app with webpack.

Styles and Stylesheets
----------------------

[Less](http://lesscss.org/) CSS pre-processor is used to make writing styles nicer. [Autoprefixer](https://github.com/postcss/autoprefixer) handles CSS vendor prefixes.
[Bootstrap](http://getbootstrap.com/) is used as the CSS framework for the site and [City of Helsinki Bootstrap theme](http://terotic.github.io/bootstrap-hel-fi/) is used as the main theme.

Testing framework
-----------------

- [Karma](https://karma-runner.github.io) is used to run the tests. On local machines tests are run on [PhantomJS](http://phantomjs.org/) to make running tests in watch mode as smooth as possible. On CI the tests are run on Chrome.
- [Mocha](https://mochajs.org/) is used as the test framework.
- [Chai](http://chaijs.com/) is used for test assertions.
- [simple-mock](https://github.com/jupiter/simple-mock) is used for mocks and spies.
- [Enzyme](https://github.com/airbnb/enzyme) is used to make testing React Components easier.
