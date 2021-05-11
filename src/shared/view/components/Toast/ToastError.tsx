import React from "react";
import { Toast } from "notification-toast";
import { ErrorCircle } from "@styled-icons/boxicons-regular/ErrorCircle";
import "./style.styl";

interface IProps {
  status: boolean;
  title: string | JSX.Element;
  text: string | JSX.Element;
}

class ToastError extends React.PureComponent<IProps, {}> {
  public render() {
    const { status, title, text } = this.props;
    return (
      <Toast
        status={status}
        width="360px"
        height="65px"
        backgroundColor="#f3eeee"
        shadow={false}
        position="top-right"
        progressColorBar=""
        colorClose="#4c4c4c"
        autoClose={false}
        timeClose={30}
      >
        <div className="toast-box">
          <div className="toast-icon error">
            <ErrorCircle size={35} color="white"/>
          </div>
          <div className="toast-content">
            <p>{text}</p>
          </div>
        </div>
      </Toast>
    );
  }
}
export default ToastError;