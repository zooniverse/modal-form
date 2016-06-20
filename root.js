;(function() {
  'use strict';

  var React;
  var ReactDOM;
  if (typeof require !== 'undefined') {
    React = require('react');
    ReactDOM = require('react-dom');
  } else if (typeof window !== 'undefined') {
    React = window.React;
    ReactDOM = window.ReactDOM;
  }

  var ROOT_STYLE = {};

  function ModalFormRoot() {
    React.Component.apply(this, arguments);
    this.state = {
      anchors: []
    };
  }

  ModalFormRoot.shape = React.PropTypes.shape({
    updating: React.PropTypes.bool,
    register: React.PropTypes.func,
    unregister: React.PropTypes.func,
    updateOnce: React.PropTypes.func
  });

  ModalFormRoot.childContextTypes = {
    modalFormRoot: ModalFormRoot.shape
  };

  ModalFormRoot.prototype = Object.assign(Object.create(React.Component.prototype), {
    updating: false,

    getChildContext: function() {
      return {
        modalFormRoot: this
      };
    },

    register: function(anchor) {
      this.state.anchors.push(anchor);
      this.forceUpdate();
    },

    unregister: function(anchor) {
      var index = this.state.anchors.indexOf(anchor);
      this.state.anchors.splice(index, 1);
      console.log('Removed from state');
      console.log('Forcing update');
      this.setState({
        anchors: this.state.anchors
      });
      console.log('Forced update');
    },

    updateOnce: function() {
      if (!this.updating) {
        this.updating = true;
        this.forceUpdate(function() {
          this.updating = false;
        }.bind(this));
      }
    },

    render: function() {
      React.Children.only(this.props.children);
      console.log(this.state.anchors);
      var modals = this.state.anchors.filter(function(anchor) {
        return !anchor.unmounting;
      }).map(function(anchor) {
        return anchor.props.children;
      });
      // TODO: Inject a modal root into the single child.
      return React.createElement('div', null, modals, this.props.children);
    }
  });

  if (typeof module !== 'undefined') {
    module.exports = ModalFormRoot;
  } else if (typeof window !== 'undefined') {
    window.ZUIModalFormRoot = ModalFormRoot;
  }
}());
