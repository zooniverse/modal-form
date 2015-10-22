;(function() {
  'use strict';

  var React;
  var ModalFormAnchor;
  if (typeof require !== 'undefined') {
    React = require('react');
    ModalFormAnchor = require('./anchor');
  } else if (typeof window !== 'undefined') {
    React = window.React;
    ModalFormAnchor = window.ZUIModalFormAnchor;
  }

  var ESC_KEY = 27;

  var UNDERLAY_STYLE = {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0
  };

  var FORM_STYLE = {
    position: 'absolute'
  };

  function ModalFormBase() {
    React.Component.apply(this, arguments);
    this.handleGlobalKeyDown = this.handleGlobalKeyDown.bind(this);
    this.handleGlobalNavigation = this.handleGlobalNavigation.bind(this);
    this.lastKnownLocation = location.href;
    this.state = {
      underlayScrollWidth: 0,
      underlayScrollHeight: 0
    };
  }

  ModalFormBase.locationChangeEvent = 'locationchange';

  ModalFormBase.propTypes = {
    required: React.PropTypes.bool,
    underlayStyle: React.PropTypes.object,
    persistAcrossLocations: React.PropTypes.bool,
    loose: React.PropTypes.bool,
    onSubmit: React.PropTypes.func,
    onCancel: React.PropTypes.func
  };

  ModalFormBase.defaultProps = {
    required: false,
    underlayStyle: {},
    persistAcrossLocations: false,
    loose: false,
    onSubmit: Function.prototype,
    onCancel: Function.prototype
  };

  ModalFormBase.prototype = Object.assign(Object.create(React.Component.prototype), {
    componentDidMount: function() {
      addEventListener('keydown', this.handleGlobalKeyDown);
      addEventListener('hashchange', this.handleGlobalNavigation);
      addEventListener(ModalFormBase.locationChangeEvent, this.handleGlobalNavigation);
      this.syncUnderlaySize();
    },

    componentWillUnmount: function() {
      removeEventListener('keydown', this.handleGlobalKeyDown);
      removeEventListener('hashchange', this.handleGlobalNavigation);
      removeEventListener(ModalFormBase.locationChangeEvent, this.handleGlobalNavigation);
    },

    handleGlobalKeyDown: function (event) {
      if (event.which === ESC_KEY && !this.props.required) {
        this.props.onCancel.apply(null, arguments);
      }
    },

    handleGlobalNavigation: function() {
      if (!this.props.required && !this.props.persistAcrossLocations) {
        this.props.onCancel.apply(null, arguments);
      }
    },

    getUnderlayChildren: function() {
      return React.createElement('form', {
        ref: 'form',
        className: ('modal-form ' + (this.props.className || '')).trim(),
        action: 'POST',
        style: Object.assign({}, FORM_STYLE, this.props.style),
        onSubmit: this.handleFormSubmit.bind(this)
      }, this.props.children);
    },

    render: function() {
      if (this.props.loose) {
        return this.renderLoose();
      } else {
        return this.renderWithAnchor();
      }
    },

    renderLoose: function() {
      var underlaySize = {
        width: Math.max(this.state.underlayScrollWidth, document.documentElement.offsetWidth, innerWidth) + 'px',
        height: Math.max(this.state.underlayScrollHeight, document.documentElement.offsetHeight, innerHeight) + 'px'
      };
      return React.createElement.apply(React, ['div', {
        ref: 'underlay',
        className: ('modal-form-underlay ' + (this.props.className || '')).trim(),
        style: Object.assign({}, UNDERLAY_STYLE, underlaySize, this.props.underlayStyle),
        onClick: this.handleUnderlayClick.bind(this)
      }].concat(this.getUnderlayChildren()));
    },

    renderWithAnchor: function() {
      var looseRenderResult = this.renderLoose.apply(this, arguments);
      return React.createElement(ModalFormAnchor, null, looseRenderResult);
    },

    componentDidUpdate: function() {
      this.syncUnderlaySize();
    },

    syncUnderlaySize: function() {
      var underlay = React.findDOMNode(this.refs.underlay);
      var widthChanged = underlay.scrollWidth !== this.state.underlayScrollWidth;
      var heightChanged = underlay.scrollHeight !== this.state.underlayScrollHeight;
      if (widthChanged || heightChanged) {
        this.setState({
          underlayScrollWidth: underlay.scrollWidth,
          underlayScrollHeight: underlay.scrollHeight
        });
      }
    },

    handleFormSubmit: function(event) {
      event.preventDefault();
      this.props.onSubmit.apply(null, arguments);
    },

    handleUnderlayClick: function(event) {
      if (!this.props.required && event.target === React.findDOMNode(this.refs.underlay)) {
        this.props.onCancel.apply(null, arguments);
      }
    }
  });

  if (typeof module !== 'undefined') {
    module.exports = ModalFormBase;
  } else if (typeof window !== 'undefined') {
    window.ZUIModalFormBase = ModalFormBase;
  }
}());
