var test = require('tape');
var React = require('react/addons');
var AnchoredModalForm = require('../anchored');

test('AnchoredModalForm', function(t) {
  t.test('is exported', function(t) {
    t.equal(typeof AnchoredModalForm, 'function', 'Exported the constructor');
    t.end();
  });

  t.test('can be created', function(t) {
    var instance = React.createElement(AnchoredModalForm);
    t.ok(instance, 'Instance created');
    t.end();
  });

  t.test('An instance', function(t) {
    var ANCHORED_CONTENT_ID = 'anchored-content';

    var root = document.createElement('div');
    root.id = 'anchored-root';
    document.body.appendChild(root);

    // Note, the anchored content is a <p>,
    // which cannot be the decendant of the container <p>.

    var content = React.createElement('p', {
      id: ANCHORED_CONTENT_ID
    });

    var formAnchor = React.createElement(AnchoredModalForm, null, content);

    var container = React.createElement('p', null, formAnchor);

    React.render(container, root);

    t.ok(document.querySelector('#' + ANCHORED_CONTENT_ID), 'Anchored content has been rendered');
    t.notOk(root.querySelector('#' + ANCHORED_CONTENT_ID), 'Anchored content is not in the original rendering root');
    t.end();

    t.test('clean up', function() {
      React.unmountComponentAtNode(root);
      root.parentElement.removeChild(root);
      t.end();
    });
  });

  t.end();
});
