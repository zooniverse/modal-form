require('core-js/shim');

var React = require('react');
var ReactDOM = require('react-dom');
var ModalFormAnchor = require('../anchor');
var assert = require('assert');
var sinon = require('sinon');

describe('ModalFormAnchor', function() {
  it('exports', function() {
    assert.equal(typeof ModalFormAnchor, 'function');
  });

  function runInstanceTests(ancestorTags) {
    return describe('instance with ancestry ' + ancestorTags.join('/'), function() {
      var id;
      var ancestors;
      var instance;

      beforeEach(function() {
        id = Math.random().toString().split('.')[1];

        ancestors = ancestorTags.map(function(ancestorTag) {
          return document.createElement(ancestorTag);
        });
        ancestors.reduce(function(parent, element) {
          parent.appendChild(element);
          return element;
        }, document.body);

        var contentDiv = React.createElement('div', {
          id: id
        });
        instance = ReactDOM.render(React.createElement(ModalFormAnchor, null, contentDiv), ancestors[ancestors.length - 1]);
      });

      it('is instantiated', function() {
        assert.ok(instance);
      });

      it('drops an anchor', function() {
        assert.equal(ReactDOM.findDOMNode(instance).tagName, 'SPAN');
      });

      it('renders its root in the body', function() {
        assert.equal(instance.root.parentNode, document.body);
      });

      describe('content', function() {
        it('renders into the document', function() {
          assert.ok(document.getElementById(id));
        });

        it('renders outside of itself', function() {
          var descendants = Array.prototype.slice.call(ReactDOM.findDOMNode(instance).querySelectorAll('*'));
          var contentDiv = document.getElementById(id);
          assert.equal(descendants.indexOf(contentDiv), -1);
        });
      });

      afterEach(function() {
        ReactDOM.unmountComponentAtNode(ancestors[ancestors.length - 1]);
        ancestors.forEach(function(element) {
          element.parentNode.removeChild(element);
        });
        id = null;
        ancestors = null;
        instance = null;
      });
    });
  }

  [
    ['div'],
    ['svg', 'rect']
  ].map(runInstanceTests);
});
