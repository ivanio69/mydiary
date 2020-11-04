import React from "react";
import "./styles/Button.css";
class Button extends React.Component {
  render() {
    return (
      <>
        <button onClick={this.props.onClick} style={this.props.style}>
          {this.props.children}
        </button>
      </>
    );
  }
}

export default Button;
