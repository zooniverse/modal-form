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

  var TRIGGER_PROPS = []; // Known after the class is created.

  var TriggeredModalForm = React.createClass({
    displayName: 'TriggeredModalForm',

    propTypes: {
      triggerTag: React.PropTypes.string,
      trigger: React.PropTypes.oneOfType([
        React.PropTypes.element,
        React.PropTypes.string
      ]),
      triggerProps: React.PropTypes.object,
      onSubmit: React.PropTypes.func,
      onCancel: React.PropTypes.func
    },

    getDefaultProps: function() {
      return {
        triggerTag: 'button',
        trigger: '☰',
        triggerProps: {},
        defaultOpen: false,
        onSubmit: null,
        onCancel: null
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
      }, function() {
        this.getDOMNode().focus()
      });
    },

    render: function() {
      var modal = null;
      if (this.state.open) {
        var modalProps = {
          onSubmit: this.handleSubmit,
          onCancel: this.handleCancel
        };
        Object.keys(this.props).forEach(function(propName) {
          if (TRIGGER_PROPS.indexOf(propName) === -1) {
            modalProps[propName] = this.props[propName];
          }
        }, this);

        modal = React.createElement(AnchoredModalForm, modalProps, this.props.children);
      }

      var triggerProps = Object.assign({}, {
        type: this.props.triggerTag === 'button' ? 'button' : null,
        'aria-haspopup': true,
        'aria-expanded': this.state.open
      }, this.props.triggerProps, {
        className: [
          'modal-form-trigger',
          this.props.className || '',
          this.props.triggerProps && this.props.triggerProps.className || ''
        ].join(' ').trim(),
        onClick: this.handleClick
      });

      return React.createElement(this.props.triggerTag, triggerProps, this.props.trigger, modal);
    },

    handleClick: function() {
      this.open();
      if (this.props.triggerProps && this.props.triggerProps.onClick) {
        this.props.triggerProps.onClick.apply(null, arguments);
      }
    },

    handleSubmit: function() {
      this.close();
      if (this.props.onSubmit) {
        this.props.onSubmit.apply(null, arguments);
      }
    },

    handleCancel: function() {
      this.close();
      if (this.props.onCancel) {
        this.props.onCancel.apply(null, arguments);
      }
    },
  });

  if (typeof module !== 'undefined') {
    module.exports = TriggeredModalForm;
  } else if (typeof window !== 'undefined') {
    window.ZUITriggeredModalForm = TriggeredModalForm;
  }

  TRIGGER_PROPS.push.apply(TRIGGER_PROPS, Object.keys(TriggeredModalForm.propTypes));
}());
