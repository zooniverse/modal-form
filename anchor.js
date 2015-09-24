;(function() {
  'use strict';

  var React;
  if (typeof require !== 'undefined') {
    React = require('react');
  } else if (typeof window !== 'undefined') {
    React = window.React;
  }

  function ModalFormAnchor() {
    React.Component.apply(this, arguments);
  }

  ModalFormAnchor.prototype = Object.assign(Object.create(React.Component.prototype), {
    componentDidMount: function() {
      this.root = document.createElement('div');
      this.root.classList.add('modal-form-anchor-root');
      document.body.appendChild(this.root);
      this.renderInstance()
    },

    componentWillUnmount: function() {
      React.unmountComponentAtNode(this.root);
      this.root.parentNode.removeChild(this.root);
      this.root = null;
      this.instance = null;
    },

    componentDidUpdate: function() {
      this.renderInstance();
    },

    renderInstance: function() {
      var children = this.props.children || React.createElement('noscript');
      this.instance = React.render(children, this.root);
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
