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
    left: 0,
    position: 'absolute',
    top: 0
  };

  var FORM_STYLE = {
    position: 'absolute'
  };

  function ModalFormBase() {
    React.Component.apply(this, arguments);
    this.reposition = this.reposition.bind(this);
    this.handleGlobalKeyDown = this.handleGlobalKeyDown.bind(this);
    this.handleGlobalNavigation = this.handleGlobalNavigation.bind(this);
    this.state = {
      underlayWidth: 0,
      underlayHeight: 0
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
      addEventListener('scroll', this.reposition);
      addEventListener('resize', this.reposition);
      addEventListener('keydown', this.handleGlobalKeyDown);
      addEventListener('hashchange', this.handleGlobalNavigation);
      addEventListener(ModalFormBase.locationChangeEvent, this.handleGlobalNavigation);
      this.reposition();
    },

    componentWillUnmount: function() {
      removeEventListener('scroll', this.reposition);
      removeEventListener('resize', this.reposition);
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
        width: this.state.underlayWidth + 'px',
        height: this.state.underlayHeight + 'px'
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
      this.reposition();
    },

    reposition: function() {
      var totalWidth = Math.max(document.documentElement.offsetWidth, innerWidth);
      var totalHeight = Math.max(document.documentElement.offsetHeight, innerHeight);
      var widthChanged = totalWidth !== this.state.underlayWidth;
      var heightChanged = totalHeight !== this.state.underlayHeight;
      if (widthChanged || heightChanged) {
        this.setState({
          underlayWidth: totalWidth,
          underlayHeight: totalHeight
        });
      }
    },

    handleFormSubmit: function(event) {
      event.preventDefault();
      this.props.onSubmit.apply(null, arguments);
    },

    handleUnderlayClick: function(event) {
      if (!this.props.required && event.target === this.refs.underlay) {
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
