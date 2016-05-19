require('core-js/shim');

var React = require('react');
var ModalFormDialog = require('../dialog');
var assert = require('assert');
var simulant = require('simulant');

describe('ModalFormDialog', function() {
  it('exports', function() {
    assert.equal(typeof ModalFormDialog, 'function');
  });

  describe('.alert', function() {
    var id;
    before(function() {
      id = Math.random().toString(36).split('.')[1];

      ModalFormDialog.alert(React.createElement('button', {
        id: id,
        type: 'submit'
      }));
    });

    it('mounts a dialog', function() {
      assert.ok(document.getElementById(id));
    });

    it('closes on submit', function(done) {
      var submitButton = document.getElementById(id);
      simulant.fire(submitButton, 'click');
      setTimeout(function() {
        assert.equal(document.getElementById(id), null);
        done();
      }, 50);
    });

    it('closes on cancel', function(done) {
      simulant.fire(window, 'keydown', {
        which: 27
      });
      setTimeout(function() {
        assert.equal(document.getElementById(id), null);
        done();
      }, 50);
    });
  });
});
