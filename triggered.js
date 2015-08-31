;(function() {
  var React;
  var ModalForm;
  var AnchoredModalForm;
  if (typeof require !== 'undefined') {
    React = require('react');
    ModalForm = require('./index');
    AnchoredModalForm = require('./anchored');
  } else if (typeof window !== 'undefined') {
    React = window.React;
    ModalForm = window.ZUIModalForm;
    AnchoredModalForm = window.ZUIAnchoredModalForm;
  }

  var MODAL_FORM_PROPS = Object.keys(ModalForm.defaultProps);

  var TriggeredModalForm = React.createClass({
    displayName: 'TriggeredModalForm',

    propTypes: {
      trigger: React.PropTypes.oneOfType([
        React.PropTypes.element,
        React.PropTypes.string
      ]),
      triggerClassName: React.PropTypes.string,
      onClick: React.PropTypes.func
    },

    getDefaultProps: function() {
      return {
        triggerClassName: null,
        trigger: '☰',
        onClick: Function.prototype,
        onSubmit: Function.prototype,
        onCancel: Function.prototype,
        // Probably never change these:
        tag: 'button',
        type: 'button',
        defaultOpen: false
      };
    },

    getInitialState: function() {
      return {
        open: this.props.defaultOpen
      };
    },

    open: function() {
      this.setState({
        open: true
      });
    },

    close: function() {
      this.setState({
        open: false
      });
    },

    render: function() {
      var modal = null;
      if (this.state.open) {
        var modalProps = {};
        Object.keys(this.props).forEach(function(propName) {
          if (MODAL_FORM_PROPS.indexOf(propName) !== -1) {
            modalProps[propName] = this.props[propName];
          }
        }, this);
        modalProps.className = this.props.className;
        modalProps.onSubmit = this.handleSubmit;
        modalProps.onCancel = this.handleCancel;

        modal = React.createElement(AnchoredModalForm, modalProps, this.props.children);
      }

      var triggerProps = {}
      Object.keys(this.props).forEach(function(propName) {
        if (MODAL_FORM_PROPS.indexOf(propName) === -1) {
          triggerProps[propName] = this.props[propName];
        }
      }, this);
      triggerProps.className = [
        'modal-form-trigger',
        this.props.triggerClassName,
        this.props.className
      ].join(' ').trim();
      triggerProps['data-active'] = this.state.open || null;
      triggerProps.onClick = this.handleClick;

      return React.createElement(this.props.tag, triggerProps, this.props.trigger, modal);
    },

    handleClick: function() {
      this.open();
      this.props.onClick();
    },

    handleSubmit: function() {
      this.close();
      this.props.onSubmit.apply(null, arguments);
    },

    handleCancel: function() {
      this.close();
      this.props.onCancel.apply(null, arguments);
    },
  });

  if (typeof module !== 'undefined') {
    module.exports = TriggeredModalForm;
  } else if (typeof window !== 'undefined') {
    window.ZUITriggeredModalForm = TriggeredModalForm;
  }
}());
