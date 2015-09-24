;(function() {
  'use strict';

  var React;
  var ModalFormBase;
  if (typeof require !== 'undefined') {
    React = require('react');
    ModalFormBase = require('./base');
  } else if (typeof window !== 'undefined') {
    React = window.React;
    ModalFormBase = window.ZUIModalFormBase;
  }

  function mustBePercentString(props, propName, componentName) {
    if (!/\d%/.test(props[propName])) {
      return new Error('Must be a percent as a string, e.g. "50%".');
    }
  }

  var ModalDialog = React.createClass({
    statics: {
      alert: function(message, props) {
        var container = document.createElement('div');
        document.body.appendChild(container);

        var promise = new Promise(function(resolve, reject) {
          function handleSubmit() {
            resolve.apply(null, arguments);
            if (props && props.onSubmit !== undefined) {
              props.onSubmit.apply(null, arguments);
            }
          }

          function handleCancel() {
            reject.apply(null, arguments);
            if (props && props.onCancel !== undefined) {
              props.onCancel.apply(null, arguments);
            }
          }

          React.render(React.createElement(ModalDialog, Object.assign({}, props, {
            onSubmit: handleSubmit,
            onCancel: handleCancel
          }), message), container);
        });

        promise.catch(Function.prototype).then(function() {
          React.unmountComponentAtNode(container);
          container.parentNode.removeChild(container);
        });

        return promise;
      }
    },

    propTypes: Object.assign({}, ModalFormBase.propTypes, {
      left: mustBePercentString,
      top: mustBePercentString
    }),

    getDefaultProps: function() {
      return Object.assign({}, ModalFormBase.defaultProps, {
        left: '50%',
        top: '40%'
      });
    },

    render: function() {
      var positionStyle = {
        left: this.props.left,
        top: this.props.top,
        transform: 'translate(' + [
          -1 * parseFloat(this.props.left) + '%',
          -1 * parseFloat(this.props.top) + '%'
        ].join(',') + ')'
      };

      var modalProps = Object.assign({
        'role': 'dialog'
      }, this.props, {
        className: ('modal-dialog ' + (this.props.className || '')).trim(),
        style: Object.assign(positionStyle, this.props.style)
      });

      return React.createElement(ModalFormBase, modalProps, this.props.children);
    }
  });

  if (typeof module !== 'undefined') {
    module.exports = ModalDialog;
  } else if (typeof window !== 'undefined') {
    window.ZUIModalDialog = ModalDialog;
  }
}());
