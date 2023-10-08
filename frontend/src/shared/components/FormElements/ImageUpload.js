import React, { useRef } from "react";
import "./ImageUpload.css";
import Button from "./Button";

const ImageUpload = (props) => {
  const filePickerRef = useRef();
  const pickImageHandler = () => {
    filePickerRef.current.click();
  };
  const pickHandlerFunction = (e) => {
    console.log(e.target);
  };
  return (
    <div className="form-control">
      <input
        id={props.id}
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.png,.jpeg"
        ref={filePickerRef}
        onChange={pickHandlerFunction}
      />
      <div class={`image-upload ${props.center && "center"}`}>
        <div class="image-upload__preview">
          <img src="" alt="Preview" />
        </div>
        <Button type="button" onClick={pickImageHandler}>
          PICK IMAGE
        </Button>
      </div>
    </div>
  );
};

export default ImageUpload;
