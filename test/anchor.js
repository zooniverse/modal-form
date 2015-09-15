Object.assign || (Object.assign = require('object-assign'));
var React = require('react');
var ModalFormAnchor = require('../anchor');
var assert = require('assert');
var sinon = require('sinon');

describe('ModalFormAnchor', function() {
  it('exports', function() {
    assert.equal(typeof ModalFormAnchor, 'function');
  });

  describe('instance', function() {
    var id;
    var root;
    var instance;

    beforeEach(function() {
      id = Math.random().toString().split('.')[1];

      root = document.createElement('div');
      document.body.appendChild(root);

      var contentDiv = React.createElement('div', {
        id: id
      });
      instance = React.render(React.createElement(ModalFormAnchor, null, contentDiv), root);
    });

    it('is instantiated', function() {
      assert.ok(instance);
    });

    it('drops an anchor', function() {
      assert.equal(React.findDOMNode(instance).tagName, 'NOSCRIPT');
    });

    it('is renders its root in the body', function() {
      assert.equal(instance.root.parentElement, document.body);
    });

    describe('content', function() {
      it('renders into the document', function() {
        assert.ok(document.getElementById(id));
      });

      it('renders outside of itself', function() {
        var descendants = Array.prototype.slice.call(React.findDOMNode(instance).querySelectorAll('*'));
        var contentDiv = document.getElementById(id);
        assert.equal(descendants.indexOf(contentDiv), -1);
      });

      it('updates in response to change', function() {
        var renderInstance = sinon.spy(instance, 'renderInstance');
        instance.forceUpdate();
        assert(renderInstance.calledOnce);
      });
    });

    afterEach(function() {
      React.unmountComponentAtNode(root);
      root.parentElement.removeChild(root);
      root = null;
      instance = null;
    });
  })
});
