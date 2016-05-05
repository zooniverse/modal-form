Object.assign || (Object.assign = require('object-assign'));
var React = require('react');
var ReactDOM = require('react-dom');
var StickyModalForm = require('../sticky');
var assert = require('assert');
var sinon = require('sinon');
var simulant = require('simulant');

var ROOT_BOX_POSITION = {
  left: '100px',
  position: 'absolute',
  top: '100px'
};

var KNOWN_BOX_SIZE = {
  display: 'block',
  height: '100px',
  width: '100px'
};

describe('StickyModalForm', function() {
  it('exports', function() {
    assert.equal(typeof StickyModalForm, 'function');
  });

  describe('instance', function() {
    var root;

    beforeEach(function() {
      root = document.createElement('div');
      Object.assign(root.style, ROOT_BOX_POSITION, KNOWN_BOX_SIZE);
      document.body.appendChild(root);
    });

    describe('`side` prop', function() {
      var content;

      beforeEach(function() {
        scrollTo(0, 0);

        content = React.createElement('div', {
          style: KNOWN_BOX_SIZE
        });
      });

      it('can stick to the left', function() {
        var instance = ReactDOM.render(React.createElement(StickyModalForm, {
          side: 'left'
        }, content), root);
        var form = instance.refs.form;
        var formRect = form.getBoundingClientRect();
        assert.equal(formRect.left, 0);
        assert.equal(formRect.top, 100);
      });

      it('can stick to the right', function() {
        var instance = ReactDOM.render(React.createElement(StickyModalForm, {
          side: 'right'
        }, content), root);
        var form = instance.refs.form;
        var formRect = form.getBoundingClientRect();
        assert.equal(formRect.left, 200);
        assert.equal(formRect.top, 100);
      });

      it('can stick to the top', function() {
        var instance = ReactDOM.render(React.createElement(StickyModalForm, {
          side: 'top'
        }, content), root);
        var form = instance.refs.form;
        var formRect = form.getBoundingClientRect();
        assert.equal(formRect.left, 100);
        assert.equal(formRect.top, 0);
      });

      it('can stick to the bottom', function() {
        var instance = ReactDOM.render(React.createElement(StickyModalForm, {
          side: 'bottom'
        }, content), root);
        var form = instance.refs.form;
        var formRect = form.getBoundingClientRect();
        assert.equal(formRect.left, 100);
        assert.equal(formRect.top, 200);
      });

      it('can stick to the bottom of the visible portion of a clipped SVG element', function() {
        var crop = document.createElement('div');
        Object.assign(crop.style,  {
          height: '100px',
          overflow: 'hidden',
          position: 'relative',
          width: '100px'
        });

        var trigger = document.createElement('div');
        Object.assign(trigger.style, {
          bottom: '50px',
          left: '-50px',
          position: 'absolute',
          right: '50px',
          top: '40px'
        });

        crop.appendChild(trigger);
        root.appendChild(crop);

        var instance = ReactDOM.render(React.createElement(StickyModalForm, {
          side: 'bottom'
        }, content), trigger);
        var instanceNode = ReactDOM.findDOMNode(instance);

        simulant.fire(trigger, 'click');

        var formPointer = instance.refs.pointer;
        var formPointerRect = formPointer.getBoundingClientRect();

        assert.equal(formPointerRect.top, 150);
        assert.equal(formPointerRect.left, 125);

        ReactDOM.unmountComponentAtNode(trigger);
        crop.parentNode.removeChild(crop);
        crop = null;
        trigger = null;
      });

      afterEach(function() {
        content = null;
      });
    });

    afterEach(function() {
      ReactDOM.unmountComponentAtNode(root);
      root.parentNode.removeChild(root);
      root = null;
    });
  });
});
