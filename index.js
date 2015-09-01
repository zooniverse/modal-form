;(function() {
  var React;
  if (typeof require !== 'undefined') {
    React = require('react');
  } else if (typeof window !== 'undefined') {
    React = window.React;
  }

  var ModalForm = React.createClass({
    displayName: 'ModalForm',

    ESC_KEY: 27,

    UNDERLAY_STYLE: {
      bottom: 0,
      left: 0,
      position: 'fixed',
      right: 0,
      top: 0
    },

    POINTER_STYLE: {
      position: 'absolute'
    },

    FORM_STYLE: {
      position: 'absolute'
    },

    propTypes: {
      anchor: React.PropTypes.instanceOf(Element),
      required: React.PropTypes.bool,
      side: React.PropTypes.oneOf([
        'bottom'
      ]), // TODO: Enable top, left, right, center.
      underlayStyle: React.PropTypes.object,
      pointerStyle: React.PropTypes.object,
      persistAcrossLocations: React.PropTypes.bool,
      onSubmit: React.PropTypes.func,
      onCancel: React.PropTypes.func
    },

    getDefaultProps: function() {
      return {
        anchor: null,
        required: false,
        side: 'bottom',
        underlayStyle: {},
        pointerStyle: {},
        persistAcrossLocations: false,
        onSubmit: Function.prototype,
        onCancel: Function.prototype
      };
    },

    componentDidMount: function() {
      this.reposition();
      addEventListener('scroll', this.reposition);
      addEventListener('resize', this.reposition);
      Array.prototype.forEach.call(this.getDOMNode().querySelectorAll('img'), function(img) {
        img.addEventListener('load', this.reposition);
      }, this);
      addEventListener('keydown', this.handleGlobalKeyDown);
      addEventListener('hashchange', this.handleNavigation);
    },

    componentWillUnmount: function() {
      removeEventListener('scroll', this.reposition);
      removeEventListener('resize', this.reposition);
      Array.prototype.forEach.call(this.getDOMNode().querySelectorAll('img'), function(img) {
        img.removeEventListener('load', this.reposition);
      }, this);
      removeEventListener('keydown', this.handleGlobalKeyDown);
      removeEventListener('hashchange', this.handleNavigation);
    },

    reposition: function() {
      var anchor = this.props.anchor || React.findDOMNode(this).parentElement;
      var anchorRect = this.getRect(anchor);

      var form = this.refs.form.getDOMNode();
      var formPosition = this.getPosition[this.props.side](this.getRect(form), anchorRect, innerWidth);
      form.style.left = formPosition.left + 'px';
      form.style.top = formPosition.top + 'px';

      var pointer = this.refs.pointer.getDOMNode();
      var pointerPosition = this.getPosition[this.props.side](this.getRect(pointer), anchorRect, innerWidth);
      pointer.style.left = pointerPosition.left + 'px';
      pointer.style.top = pointerPosition.top + 'px';
    },

    getRect: function(domNode) {
      var rect = domNode.getBoundingClientRect();
      var style = getComputedStyle(domNode);
      var result = {
        top: rect.top - (parseFloat(style.marginTop) || 0),
        right: rect.right + (parseFloat(style.marginRight) || 0),
        bottom: rect.bottom + (parseFloat(style.marginBottom) || 0),
        left: rect.left - (parseFloat(style.marginLeft) || 0),
        width: NaN,
        height: NaN
      };
      result.width = result.right - result.left,
      result.height = result.bottom - result.top
      return result;
    },

    getPosition: {
      bottom: function(movableRect, anchorRect, availableWidth) {
        var left = anchorRect.left - ((movableRect.width - anchorRect.width) / 2);
        left = Math.max(left, 0);
        left = Math.min(left, availableWidth - movableRect.width);

        var top = anchorRect.bottom;

        return {
          left: left,
          top: top,
        };
      }
    },

    handleGlobalKeyDown: function (event) {
      if (event.which === this.ESC_KEY && !this.props.required) {
        this.props.onCancel.apply(null, arguments);
      }
    },

    handleNavigation: function() {
      if (!this.props.required && !this.props.persistAcrossLocations) {
        this.props.onCancel.apply(null, arguments);
      }
    },

    render: function() {
      var pointer = React.createElement('div', {
        ref: 'pointer',
        className: ('modal-form-pointer ' + (this.props.className || '')).trim(),
        style: Object.assign({}, this.POINTER_STYLE, this.props.pointerStyle)
      });

      var form = React.createElement('form', {
        ref: 'form',
        className: ('modal-form ' + (this.props.className || '')).trim(),
        style: Object.assign({}, this.FORM_STYLE, this.props.style),
        action: 'POST',
        onSubmit: this.handleSubmit
      }, this.props.children);

      return React.createElement('div', {
        ref: 'underlay',
        className: ('modal-form-underlay ' + (this.props.className || '')).trim(),
        style: Object.assign({}, this.UNDERLAY_STYLE, this.props.underlayStyle),
        onClick: this.handleUnderlayClick
      }, pointer, form);
    },

    handleSubmit: function(event) {
      event.preventDefault();
      this.props.onSubmit.apply(null, arguments);
    },

    handleUnderlayClick: function(e) {
      if (!this.props.required && e.target === this.refs.underlay.getDOMNode()) {
        this.props.onCancel.apply(null, arguments);
      }
    }
  });

  if (typeof module !== 'undefined') {
    module.exports = ModalForm;
  } else if (typeof window !== 'undefined') {
    window.ZUIModalForm = ModalForm;
  }
}());
