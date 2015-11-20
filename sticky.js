;(function() {
  'use strict';

  var React;
  var ReactDOM;
  var ModalFormBase;
  if (typeof require !== 'undefined') {
    React = require('react');
    ReactDOM = require('react-dom');
    ModalFormBase = require('./base');
  } else if (typeof window !== 'undefined') {
    React = window.React;
    ReactDOM = window.ReactDOM;
    ModalFormBase = window.ZUIModalFormBase;
  }

  var MEDIA_SELECTOR = 'img, video';

  var POINTER_STYLE = {
    position: 'absolute'
  };

  function StickyModalForm() {
    ModalFormBase.apply(this, arguments);
    this.reposition = this.reposition.bind(this);
  }

  StickyModalForm.propTypes = Object.assign({}, ModalFormBase.propTypes, {
    side: React.PropTypes.oneOf([
      'left',
      'right',
      'top',
      'bottom'
    ]),
    pointerStyle: React.PropTypes.object
  });

  StickyModalForm.defaultProps = Object.assign({}, ModalFormBase.defaultProps, {
    side: 'bottom',
    pointerStyle: {}
  });

  StickyModalForm.prototype = Object.assign(Object.create(ModalFormBase.prototype), {
    componentDidMount: function() {
      ModalFormBase.prototype.componentDidMount.apply(this, arguments);
      this.reposition();
      addEventListener('scroll', this.reposition);
      addEventListener('resize', this.reposition);
      // TODO: Figure out a way to add a global load event listener.
      Array.prototype.forEach.call(document.querySelectorAll(MEDIA_SELECTOR), function(media) {
        media.addEventListener('load', this.reposition)
      }, this);
    },

    componentWillUnmount: function() {
      ModalFormBase.prototype.componentWillUnmount.apply(this, arguments);
      removeEventListener('scroll', this.reposition);
      removeEventListener('resize', this.reposition);
      Array.prototype.forEach.call(document.querySelectorAll(MEDIA_SELECTOR), function(media) {
        media.removeEventListener('load', this.reposition)
      }, this);
    },

    reposition: function(props) {
      if (props === undefined || props instanceof Event) {
        props = this.props;
      }

      var viewport = {
        width: innerWidth,
        height: innerHeight
      };

      var anchor = ReactDOM.findDOMNode(this).parentNode;
      var anchorRect = this.getRectWithMargin(anchor);

      var form = this.refs.form;
      form.style.left = '';
      form.style.top = '';
      var formRect = this.getRectWithMargin(form);
      var formPosition = this.getPosition[props.side].call(this, formRect, anchorRect, viewport);
      form.style.left = pageXOffset + formPosition.left + 'px';
      form.style.top = pageYOffset + formPosition.top + 'px';

      var pointer = this.refs.pointer;
      pointer.style.left = '';
      pointer.style.top = '';
      var pointerRect = this.getRectWithMargin(pointer);
      var pointerPosition = this.getPosition[props.side].call(this, pointerRect, anchorRect, viewport);
      pointer.style.left = pageXOffset + pointerPosition.left + 'px';
      pointer.style.top = pageYOffset + pointerPosition.top + 'px';

      this.syncUnderlaySize();
    },

    getRectWithMargin: function(domNode) {
      var rect = domNode.getBoundingClientRect();
      var style = getComputedStyle(domNode);
      var result = {
        top: rect.top - (parseFloat(style.marginTop) || 0),
        right: rect.right + (parseFloat(style.marginRight) || 0),
        bottom: rect.bottom + (parseFloat(style.marginBottom) || 0),
        left: rect.left - (parseFloat(style.marginLeft) || 0)
      };
      result.width = result.right - result.left,
      result.height = result.bottom - result.top
      return result;
    },

    getHorizontallyCenteredLeft: function(movableRect, anchorRect, viewport) {
      var left = anchorRect.left - ((movableRect.width - anchorRect.width) / 2);
      left = Math.max(left, -1 * pageXOffset);
      return left;
    },

    getVerticalCenteredTop: function(movableRect, anchorRect, viewport) {
      var top = anchorRect.top - ((movableRect.height - anchorRect.height) / 2);
      top = Math.max(top, -1 * pageYOffset);
      return top;
    },

    getPosition: {
      left: function(movableRect, anchorRect, viewport) {
        return {
          left: anchorRect.left - movableRect.width,
          top: this.getVerticalCenteredTop.apply(this, arguments)
        }
      },

      right: function(movableRect, anchorRect, viewport) {
        return {
          left: anchorRect.right,
          top: this.getVerticalCenteredTop.apply(this, arguments)
        }
      },

      top: function(movableRect, anchorRect, viewport) {
        return {
          left: this.getHorizontallyCenteredLeft.apply(this, arguments),
          top: anchorRect.top - movableRect.height,
        };
      },

      bottom: function(movableRect, anchorRect, viewport) {
        return {
          left: this.getHorizontallyCenteredLeft.apply(this, arguments),
          top: anchorRect.bottom,
        };
      }
    },

    getUnderlayChildren: function() {
      var pointer = React.createElement('div', {
        ref: 'pointer',
        className: ('modal-form-pointer ' + (this.props.className || '')).trim(),
        style: Object.assign({}, POINTER_STYLE, this.props.pointerStyle)
      });
      var originalChildren = ModalFormBase.prototype.getUnderlayChildren.apply(this, arguments);
      return [].concat(originalChildren, pointer);
    }
  });

  if (typeof module !== 'undefined') {
    module.exports = StickyModalForm;
  } else if (typeof window !== 'undefined') {
    window.ZUIStickyModalForm = StickyModalForm;
  }
}());
