# ModalForm

This renders a pop-up form with a underlay preventing interaction with the page. Currently used as the dropdown part of a dropdown button (coming soon).

## Usage

```jsx
import React from 'react';
import ModalForm from 'modal-form';

class Parent extends React.Component {
  render() {
    return <span>
      <button onClick={this.showPopup}>···</button>
      {this.state.showingPopup
        ? <ModalForm onSubmit={this.handleFormSubmit} onCancel={this.hidePopup}>
            <p>Hello there.</p>
            <p><label><input type="checkbox" autoFocus /> Cool?</label></p>
            <p><button type="submit">Done</button></p>
          </ModalForm>
        : null}
    </span>;
  }
}
```

An **AnchoredModalForm** (`import ModalForm from 'modal-form/anchored'`) can be attached where a normal form isn't allowed, for example within SVG elements or other forms. The form itself will be rendered in a new `React.render()` context.

### Props

| Prop | Type | Description |
|------|------|-------------|
| **anchor** | DOM node | The modal will stick to the the bottom of this element. Defaults to the modal's parent element.
| **required** | Boolean | If true, the modal cannot be dismissed with the escape key or by clicking somewhere else. Defaults to `false`.
| **onSubmit** | Function | Call this when the form is submitted.
| **onCancel** | Function | Call this when the user hits escape or clicks away (if the modal isn't _required_)

## To-do

- Allow anchoring to the window, so the modal is positioned relative to the viewport (like a regular dialog).

- Allow setting the **side** prop, so the modal can be attached to side other than the bottom.
