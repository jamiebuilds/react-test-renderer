var assert = require('assert');
var React = require('react');
var jsdom = require('jsdom').jsdom;
var render = require('./');

global.window = jsdom(undefined, { url: 'about:blank' }).defaultView;
global.document = global.window.document;

var Button = React.createClass({
  render: function() {
    return React.createElement('button', {
      ref: 'button',
      className: 'btn btn-primary',
      onClick: this.props.onClick
    }, this.props.children);
  }
});

var Application = React.createClass({
  render: function() {
    return React.createElement('section', {
      ref: 'section'
    },
      React.createElement('h1', {
        ref: 'heading'
      }, 'Hello World'),
      React.createElement(Button, {
        ref: 'button',
        onClick: this.props.onClick
      }, 'Click Me!'),
      React.createElement(Button, {
        ref: 'button',
        onClick: this.props.onClick
      }, 'Click Me Too!')
    );
  }
});

function createStub() {
  return function stub() {
    stub.called = true;
  };
}

describe('render()', function() {
  it('should create a tree', function() {
    var tree = render(React.createElement(Application));

    assert.ok(tree.find);
    assert.ok(tree.findAll);
    assert.ok(tree.findComponent);
    assert.ok(tree.findAllComponent);
  });

  it('should find an element', function() {
    var stub = createStub();
    var tree = render(React.createElement(Application, {
      onClick: stub
    }));

    var heading = tree.find(function(element) {
      return element.type === 'h1';
    });

    assert.equal(heading.type, 'h1');
    assert.deepEqual(heading.props, {
      children: 'Hello World'
    });
  });

  it('should find a deep element', function() {
    var stub = createStub();
    var tree = render(React.createElement(Application, {
      onClick: stub
    }));

    var heading = tree.find(function(element) {
      return element.type === 'button';
    });

    assert.equal(heading.type, 'button');
    assert.deepEqual(heading.props, {
      onClick: stub,
      className: 'btn btn-primary',
      children: 'Click Me!'
    });
  });

  it('should find multiple elements', function() {
    var stub = createStub();
    var tree = render(React.createElement(Application, {
      onClick: stub
    }));

    var elements = tree.findAll(function(element) {
      return element.type === 'h1' || element.type === 'button';
    });

    assert.equal(elements[0].type, 'h1');
    assert.equal(elements[1].type, 'button');
    assert.equal(elements[2].type, 'button');
  });

  it('should be able to find a component', function() {
    var stub = createStub();
    var tree = render(React.createElement(Application, {
      onClick: stub
    }));

    var button = tree.findComponent(Button);

    assert.equal(button.root.type, 'button');
    assert.ok(button.refs.button);
  });

  it('should be able to find multiple components', function() {
    var stub = createStub();
    var tree = render(React.createElement(Application, {
      onClick: stub
    }));

    var buttons = tree.findAllComponent(Button);

    assert.equal(buttons[0].root.type, 'button');
    assert.equal(buttons[1].root.type, 'button');
  });

  it('should be able to find an element from a component', function() {
    var stub = createStub();
    var tree = render(React.createElement(Application, {
      onClick: stub
    }));

    var button = tree
      .findComponent(Button)
      .find(function(element) {
        return element.type === 'button';
      });

    assert.equal(button.type, 'button');
  });

  it('should be able to simulate an event on an element', function() {
    var stub = createStub();
    var tree = render(React.createElement(Application, {
      onClick: stub
    }));

    tree.find(function(element) {
      return element.type === 'button';
    }).simulate('click');

    assert.ok(stub.called);
  });
});
