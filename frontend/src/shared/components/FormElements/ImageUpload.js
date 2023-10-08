import React, { useEffect, useRef, useState } from "react";
import "./ImageUpload.css";
import Button from "./Button";

const ImageUpload = (props) => {
  const filePickerRef = useRef();
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);
  const pickImageHandler = () => {
    filePickerRef.current.click();
  };
  const pickHandler = (e) => {
    console.log(e.target);
    let pickedFile;
    let fileIsValid = isValid; // because state dont update immedietly (setIsValid)
    if (e.target.files && e.target.files.length === 1) {
      pickedFile = e.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    props.onInput(props.id, pickedFile, fileIsValid);
  };

  useEffect(() => {
    if (!file) {
      return;
    }
    // browser API FileReader
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);
  return (
    <div className="form-control">
      <input
        id={props.id}
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.png,.jpeg"
        ref={filePickerRef}
        onChange={pickHandler}
      />
      <div class={`image-upload ${props.center && "center"}`}>
        <div class="image-upload__preview">
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" />
          ) : (
            <p>Please pick an image</p>
          )}
        </div>
        <Button type="button" onClick={pickImageHandler}>
          PICK IMAGE
        </Button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;
