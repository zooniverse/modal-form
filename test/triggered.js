var test = require('tape');
var React = require('react/addons');
var TriggeredModalForm = require('../triggered');
var TestUtils = React.addons.TestUtils;
var simulant = window.simulant = require('simulant');

test('TriggeredModalForm', function(t) {
  t.test('is exported', function(t) {
    t.equal(typeof TriggeredModalForm, 'function', 'Exported the constructor');
    t.end();
  });

  t.test('can be created', function(t) {
    var instance = React.createElement(TriggeredModalForm);
    t.ok(instance, 'Instance created');
    t.end();
  });

  t.test('An instance', function(t) {
    var TRIGGER_ID = 'modal-trigger'
    var CONTENT_ID = 'triggered-content';

    var root = document.createElement('div');
    root.id = 'triggered-root';
    document.body.appendChild(root);

    var trigger = React.createElement('span', {
      id: TRIGGER_ID
    }, 'Trigger');

    var content = React.createElement('p', {
      id: CONTENT_ID
    });

    var formTrigger = React.createElement(TriggeredModalForm, {
      trigger: trigger
    }, content);

    var renderedTrigger = React.render(formTrigger, root);

    t.ok(document.querySelector('#' + TRIGGER_ID), 'Trigger has been rendered');
    t.notOk(document.querySelector('#' + CONTENT_ID), 'Triggered content is not rendered by default');

    TestUtils.Simulate.click(React.findDOMNode(renderedTrigger));
    t.ok(document.querySelector('#' + CONTENT_ID), 'Triggered content is rendered after click');
    t.end();

    t.test('clean up', function() {
      React.unmountComponentAtNode(root);
      root.parentElement.removeChild(root);
      t.end();
    });
  });
  t.end();
});
