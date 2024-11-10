import { useRef} from "react";
import Modal from "react-bootstrap/Modal";
import { Cropper } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import { Button } from "react-bootstrap";

const ImageCropper = ({
  show,
  handleClose,
  selectedImage,
  setImageToUpload,
}) => {
  const cropperRef = useRef(null);

  const onCrop = () => {
    const cropper = cropperRef.current;
    if (cropper) {
      const canvas = cropper.getCanvas();
      fetch(canvas.toDataURL())
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "image", { type: "image/*" });
          // setImage(file);
          setImageToUpload(file);
        });
    //   setTimeout(() => {
        // isSubmit && formik.submitForm();
        handleClose();
    //   }, 2000);
    }
  };

  return (
    <Modal show={show} centered>
      <Modal.Body>
        <div className="example__cropper-wrapper">
          <Cropper
            ref={cropperRef}
            cropResult={{
              type: "canvas",
              size: { width: 200, height: 200 },
            }}
            src={selectedImage}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
          <Button
             variant="secondary"
            onClick={handleClose}
          >
            Stänga
          </Button>
          <Button
               variant="primary"
            onClick={onCrop}
          >
            Beskära
          </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ImageCropper;
