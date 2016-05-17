# react-test-renderer

> A lightweight solution to testing fully-rendered React Components

## Installation

```sh
$ npm install react-test-renderer
```

## Usage

```js
const render = require('react-test-renderer');

const stub = createStub();

render(<MyComponent onClick={stub}/>)
  .find(element => element.type === 'button')
  .simulate('click');

assert.ok(stub.called);
```

## API

```js
interface Searchable {
  find(predicate: (element: RenderedElement) => boolean): RenderedElement;
  findAll(predicate: (element: RenderedElement) => boolean): Array<RenderedElement>;
  findComponent(component: ReactComponent): RenderedComponent;
  findAllComponent(component: ReactComponent): RenderedComponent;
}

interface RenderedElement mixins Searchable {
  type: string;
  props: Object;
  simulate(eventName: string, eventOpts?: Object): void;
}

interface RenderedComponent mixins Searchable {
  root: RenderedElement;
  refs: { [name: string]: RenderedElement };
}

interface RenderedTree mixins Searchable {}

function render(ReactElement): RenderedTree
```


## Examples

Find an element:

```js
var tree = render(
  <section>
    <h1>Hello World</h1>
    <p>...</p>
  </section>
);

var heading = tree.find(element => element.type === 'h1');

assert.equal(heading.type, 'h1');
assert.deepEqual(heading.props, {
  children: 'Hello World'
});
```

Simulate an event on a component:

```js
var stub = createStub();
var tree = render(
  <section>
    <button onClick={stub}>Click Me!</button>
  </section>
);

tree.find(element => element.type === 'button')
  .simulate('click');

assert.ok(stub.called);
```

## Usage with jsdom

Using [jsdom](https://github.com/tmpvar/jsdom) you can run this test renderer
entirely in Node. Just set this up before you run your tests:

```sh
$ npm install --save-dev jsdom
```

```js
var jsdom = require('jsdom').jsdom;

global.window = jsdom(undefined, { url: 'about:blank' }).defaultView;
global.document = global.window.document;
```

> Note: This was tested using jsdom@9
