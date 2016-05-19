var TestUtils = require('react-addons-test-utils');

var internalInstanceKey;
var INTERNAL_INSTANCE_KEY = /^__reactInternalInstance/;

function getInternalInstance(element) {
  if (element._reactInternalComponent) {
    return element._reactInternalComponent;
  }

  if (!internalInstanceKey) {
    internalInstanceKey = Object.keys(element).find(function(key) {
      return INTERNAL_INSTANCE_KEY.test(key);
    });
  }

  return element[internalInstanceKey];
}

function find(target, predicate) {
  return findAll(target, predicate)[0];
}

function findAll(target, predicate) {
  return TestUtils.findAllInRenderedTree(target, function(item) {
    if (TestUtils.isCompositeComponent(item)) {
      return false;
    }

    return predicate(createRenderedElement(item));
  }).map(createRenderedElement);
}

function findComponent(target, component) {
  return findAllComponent(target, component)[0];
}

function findAllComponent(target, component) {
  return TestUtils.findAllInRenderedTree(target, function(item) {
    return TestUtils.isCompositeComponentWithType(item, component);
  }).map(createRenderedComponent);
}

function createSearchMethods(target) {
  return {
    find: function(predicate) {
      return find(target, predicate);
    },
    findAll: function(predicate) {
      return findAll(target, predicate);
    },
    findComponent: function(component) {
      return findComponent(target, component);
    },
    findAllComponent: function(component) {
      return findAllComponent(target, component);
    }
  };
}

function createSimulateMethod(element) {
  return function simulate(eventName, eventOpts) {
    TestUtils.Simulate[eventName](element, eventOpts);
  };
}

function createRenderedElement(element) {
  var currentElement = getInternalInstance(element)._currentElement;

  return {
    type: currentElement.type,
    props: currentElement.props,
    simulate: createSimulateMethod(element)
  };
}

function createRenderedComponent(component) {
  var renderedComponent = component._reactInternalInstance._renderedComponent;
  var rootElement = renderedComponent._nativeNode || renderedComponent._nodeWithLegacyProperties;
  var root = createRenderedElement(rootElement);
  var refs = {};

  Object.keys(component.refs).forEach(function(ref) {
    refs[ref] = createRenderedElement(component.refs[ref]);
  });

  var methods = createSearchMethods(component);

  return Object.assign({
    root: root,
    refs: refs,
  }, createSearchMethods(component));
}

function createRenderedTree(tree) {
  return createSearchMethods(tree);
}

function render(element) {
  return createRenderedTree(TestUtils.renderIntoDocument(element));
}

module.exports = render;
