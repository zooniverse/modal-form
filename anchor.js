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

  function ModalFormAnchor() {
    React.Component.apply(this, arguments);
  }

  ModalFormAnchor.prototype = Object.assign(Object.create(React.Component.prototype), {
    componentWillMount: function() {
      this.root = document.createElement('div');
      this.root.classList.add('modal-form-anchor-root');
      document.body.appendChild(this.root);
    },

    componentWillUnmount: function() {
      this.root.parentNode.removeChild(this.root);
      this.root = null;
      this.instance = null;
    },

    render: function() {
      this.instance = ReactDOM.createPortal(this.props.children, this.root);
      return React.createElement('noscript', {
        className: 'modal-form-anchor'
      }, this.instance);
    }
  });

  if (typeof module !== 'undefined') {
    module.exports = ModalFormAnchor;
  } else if (typeof window !== 'undefined') {
    window.ZUIModalFormAnchor = ModalFormAnchor;
  }
}());
