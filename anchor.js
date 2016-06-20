;(function() {
  'use strict';

  var React;
  var ReactDOM;
  var ModalFormRoot;
  if (typeof require !== 'undefined') {
    React = require('react');
    ReactDOM = require('react-dom');
    ModalFormRoot = require('./root');
  } else if (typeof window !== 'undefined') {
    React = window.React;
    ReactDOM = window.ReactDOM;
    ModalFormRoot = window.ZUIModalFormRoot;
  }

  function ModalFormAnchor() {
    React.Component.apply(this, arguments);
    this.state = {
      key: Math.random().toString(36).split('.')[1]
    };
  }

  ModalFormAnchor.contextTypes = {
    modalFormRoot: ModalFormRoot.shape
  };

  ModalFormAnchor.defaultProps = {
    onMount: Function.prototype
  };

  ModalFormAnchor.prototype = Object.assign(Object.create(React.Component.prototype), {
    unmounting: false,

    componentWillMount: function() {
      this.context.modalFormRoot.register(this);
    },

    componentDidMount() {
      setTimeout(this.props.onMount);
    },

    componentWillUnmount: function() {
      this.unmounting = true;
      this.context.modalFormRoot.updateOnce();
      this.context.modalFormRoot.unregister(this);
    },

    componentDidUpdate: function() {
      this.context.modalFormRoot.updateOnce();
    },

    render: function() {
      return React.createElement('noscript', {
        className: 'modal-form-anchor'
      });
    }
  });

  if (typeof module !== 'undefined') {
    module.exports = ModalFormAnchor;
  } else if (typeof window !== 'undefined') {
    window.ZUIModalFormAnchor = ModalFormAnchor;
  }
}());
