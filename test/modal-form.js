var test = require('tape');
var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var ModalForm = require('../index');
var simulant = require('simulant');

test('ModalForm', function(t) {
  t.test('is exported', function(t) {
    t.plan(1);
    t.equal(typeof ModalForm, 'function', 'Exported the constructor');
  });

  t.test('can be created', function(t) {
    var instance = React.createElement(ModalForm);
    t.plan(1);
    t.ok(instance, 'Instance created');
  });

  t.test('can get a bounding rectangle including margin', function(t) {
    var rectElement = document.createElement('div');
    rectElement.id = 'rect-element';
    rectElement.style.width = '10px';
    rectElement.style.height = '10px';
    rectElement.style.margin = '10px';
    document.body.appendChild(rectElement);

    var rect = ModalForm.prototype.getRect(rectElement);
    t.plan(2);
    t.equal(rect.width, 30, 'Correct rect width');
    t.equal(rect.height, 30, 'Correct rect height');

    rectElement.parentElement.removeChild(rectElement);
  });
});

test('An instance', function(t) {
  var container = document.createElement('div');
  container.id = 'modal-form-container';
  document.body.appendChild(container);

  var anchor = document.createElement('div');
  anchor.id = 'modal-form-anchor';
  anchor.style.width = '100px';
  anchor.style.height = '100px';
  anchor.style.position = 'absolute';
  anchor.style.left = '100px';
  anchor.style.top = '100px';
  document.body.appendChild(anchor);

  var submissions = 0;
  var cancellations = 0;

  var modal = React.render(React.createElement(ModalForm, {
    anchor: anchor,
    onSubmit: function() {
      submissions += 1;
    },
    onCancel: function() {
      cancellations += 1;
    }
  }, React.createElement('div', {
    style: {
      width: '50px',
      height: '50px'
    }
  })), container);

  t.test('is positioned under its anchor', function(t) {
    var form = React.findDOMNode(modal.refs.form);
    var formCenter = form.offsetLeft + (form.offsetWidth / 2);
    var formTop = form.offsetTop;
    var anchorCenter = anchor.offsetLeft + (anchor.offsetWidth / 2);
    var anchorBottom = anchor.offsetTop + anchor.offsetHeight;
    t.plan(2);
    t.equal(formCenter, anchorCenter, 'Lines up with its anchor horizontally');
    t.ok(formTop >= anchorBottom, 'Sits below its anchor');
  });

  t.test('calls its onSubmit prop on form submission', function(t) {
    var form = React.findDOMNode(modal.refs.form);
    TestUtils.Simulate.submit(form);
    t.plan(1);
    t.equal(submissions, 1, 'onSubmit called');
  });

  t.test('calls its onCancel prop on ESC', function(t) {
    simulant.fire(window, 'keydown', {
      which: modal.ESC_KEY
    });
    t.plan(1);
    t.equal(cancellations, 1, 'onCancel called');
  });

  t.test('calls its onCancel prop on clicking the underlay', function(t) {
    var underlay = React.findDOMNode(modal.refs.underlay);
    TestUtils.Simulate.click(underlay);
    t.plan(1);
    t.equal(cancellations, 2, 'onCancel called');
  });

  t.test('calls its onCancel prop when changing the hash', function(t) {
    simulant.fire(window, 'hashchange');
    t.plan(1);
    t.equal(cancellations, 3, 'onCancel called');
  });

  t.test('clean up', function() {
    React.unmountComponentAtNode(container);
    anchor.parentElement.removeChild(anchor);
    container.parentElement.removeChild(container);
    t.end();
  });
});
