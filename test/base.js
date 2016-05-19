require('core-js/shim');

var React = require('react');
var ReactDOM = require('react-dom');
var ModalFormBase = require('../base');
var assert = require('assert');
var sinon = require('sinon');
var simulant = require('simulant');
var CustomEvent = require('custom-event');

describe('ModalFormBase', function() {
  it('exports', function() {
    assert.equal(typeof ModalFormBase, 'function');
  });

  describe('instance', function() {
    var root;
    var instance;
    var submitHandler;
    var cancelHandler;

    beforeEach(function() {
      root = document.createElement('div');
      document.body.appendChild(root);

      submitHandler = sinon.spy();
      cancelHandler = sinon.spy();

      var contentDiv = React.createElement('div');
      instance = ReactDOM.render(React.createElement(ModalFormBase, {
        onSubmit: submitHandler,
        onCancel: cancelHandler
      }), root);
    });

    it('calls onSubmit on submit', function() {
      var form = instance.refs.form;
      simulant.fire(form, 'submit');
      assert(submitHandler.calledOnce);
      submitHandler.reset();
    });

    it('calls onCancel after hitting escape', function() {
      simulant.fire(window, 'keydown', {
        which: 27
      });
      assert(cancelHandler.calledOnce);
      cancelHandler.reset();
    });

    it('calls onCancel after clicking the underlay', function() {
      var underlay = instance.refs.underlay;
      simulant.fire(underlay, 'click');
      assert(cancelHandler.calledOnce);
      cancelHandler.reset();
    });

    it('calls onCancel when the hash changes', function() {
      dispatchEvent(new CustomEvent('hashchange'));
      assert(cancelHandler.calledOnce);
      cancelHandler.reset();
    });

    it('calls onCancel when the history state changes', function() {
      dispatchEvent(new CustomEvent('locationchange'));
      assert(cancelHandler.calledOnce);
      cancelHandler.reset();
    });

    afterEach(function() {
      ReactDOM.unmountComponentAtNode(root);
      root.parentNode.removeChild(root);
      root = null;
      instance = null;
      submitHandler = null;
      cancelHandler = null;
    });
  });
});
