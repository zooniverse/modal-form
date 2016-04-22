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

        var instance = ReactDOM.render(
          React.createElement( 'svg', { width:"100", height:"100", viewBox:"0 0 100 100", verticalAlign: "middle"},
            React.createElement(StickyModalForm, { side: 'bottom'},
              React.createElement('line', { x1:"-50", y1:"50", x2:"50", y2:"50", strokeWidth:"10"})
            )
          )
        , root);

        // is this the best way to access the node? can't pick up form refs...
        var renderedSVGNode = ReactDOM.findDOMNode(instance);
        var clickableGroupTag = renderedSVGNode.querySelector(".modal-form-trigger");

        var svgRect = renderedSVGNode.getBoundingClientRect();


        assert.equal(Math.round(svgRect.top), 100); 
        assert.equal(Math.round(svgRect.left), 100);
        
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
