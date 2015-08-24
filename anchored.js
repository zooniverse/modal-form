;(function() {
  var React;
  var ModalForm;
  if (typeof require !== 'undefined') {
    React = require('react');
    ModalForm = require('./index');
  } else if (typeof window !== 'undefined') {
    React = window.React;
    ModalForm = ZUIModalForm;
  }

  var AnchoredModalForm = React.createClass({
    displayName: 'AnchoredModalForm',

    getInitialState: function() {
      return {
        root: null
      }
    },

    componentDidMount: function() {
      var root = document.createElement('div');
      root.classList.add('anchored-modal-form-root');
      document.body.appendChild(root);

      this.setState({
        root: root
      }, function() {
        this.renderModal();
      }.bind(this));
    },

    componentWillUnmount: function() {
      if (this.state.root !== null) {
        React.unmountComponentAtNode(this.state.root);
        this.state.root.parentElement.removeChild(this.state.root);
        this.setState({
          root: null
        });
      }
    },

    render: function() {
      return React.createElement('noscript', {
        className: 'modal-form-anchor'
      });
    },

    renderModal: function(shouldReposition) {
      var parent = this.getDOMNode().parentElement;
      var extendedProps = Object.assign({}, this.props, {
        anchor: parent
      });
      var form = React.render(React.createElement(ModalForm, extendedProps), this.state.root);
      if (shouldReposition) {
        form.reposition();
      }
    },

    componentDidUpdate: function() {
      this.renderModal(true);
    }
  });

  if (typeof module !== 'undefined') {
    module.exports = AnchoredModalForm;
  } else if (typeof window !== 'undefined') {
    window.ZUIAnchoredModalForm = AnchoredModalForm;
  }
}());
