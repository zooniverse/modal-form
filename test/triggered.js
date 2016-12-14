require('core-js/shim');

var React = require('react');
var ReactDOM = require('react-dom');
var TriggeredModalForm = require('../triggered');
var assert = require('assert');
var simulant = require('simulant');

describe('TriggeredModalForm', function() {
  it('exports', function() {
    assert.equal(typeof TriggeredModalForm, 'function');
  });

  describe('instance', function() {
    var root;
    var id;
    var instance;

    beforeEach(function() {
      root = document.createElement('div');
      document.body.appendChild(root);

      id = Math.random().toString().split('.')[1];
      var contentDiv = React.createElement('div', {
        id: id
      });
      instance = ReactDOM.render(React.createElement(TriggeredModalForm, null, contentDiv), root);
    });

    it('Mounts a button', function() {
      var instanceNode = ReactDOM.findDOMNode(instance);
      assert.equal(instanceNode.tagName, 'BUTTON');
    });

    it('does not mount its children', function() {
      assert.ok(!document.getElementById(id));
    });

    describe('after clicking the trigger', function() {
      beforeEach(function() {
        var instanceNode = ReactDOM.findDOMNode(instance);
        simulant.fire(instanceNode, 'click');
      });

      it('mounts its children after clicking the trigger', function() {
        assert.ok(document.getElementById(id));
      });

      it('unmounts its children on submit', function() {
        simulant.fire(instance.refs.modal.refs.form, 'submit');
        assert.ok(!document.getElementById(id));
      });

      it('unmounts its children on cancel', function() {
        simulant.fire(instance.refs.modal.refs.underlay, 'click');
        assert.ok(!document.getElementById(id));
      });
    });

    afterEach(function() {
      ReactDOM.unmountComponentAtNode(root);
      root.parentNode.removeChild(root);
      root = null;
      instance = null;
    });
  });
});
