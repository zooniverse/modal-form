Object.assign || (Object.assign = require('object-assign'));
var React = require('react');
var ModalFormBase = require('../base');
var assert = require('assert');
var sinon = require('sinon');
var simulant = require('simulant');

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
      instance = React.render(React.createElement(ModalFormBase, {
        onSubmit: submitHandler,
        onCancel: cancelHandler
      }), root);
    });

    it('calls onSubmit on submit', function() {
      var form = React.findDOMNode(instance.refs.form);
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
      var underlay = React.findDOMNode(instance.refs.underlay);
      simulant.fire(underlay, 'click');
      assert(cancelHandler.calledOnce);
      cancelHandler.reset();
    });

    it('calls onCancel when the hash changes', function(done) {
      location.hash = Math.random().toString(36).split('.')[1];
      setTimeout(function() {
        try {
          assert(cancelHandler.calledOnce);
          cancelHandler.reset();
          done();
        } catch (error) {
          done(error);
        }
      });
    });

    afterEach(function() {
      React.unmountComponentAtNode(root);
      root.parentElement.removeChild(root);
      root = null;
      instance = null;
      submitHandler = null;
      cancelHandler = null;
    });
  });
});
