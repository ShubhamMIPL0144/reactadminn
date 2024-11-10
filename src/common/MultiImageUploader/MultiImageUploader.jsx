import React, {  useRef } from "react";
import "./imageUploader.css";
import { toast } from "react-toastify";
import TicketServices from "../../services/ticket-services";

const MultiImageUploader = ({ imagesFile, setImagesFile, setNewImages, newImages }) => {
  const fileInputRef = useRef(null);
  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    for (let index = 0; index < files.length; index++) {
      const fileSizeInMB = files[index].size / 1024 / 1024; 
      if (!files[index].type.startsWith('image/')) {
        toast.warn("Please upload a valid image file");
        return;
      }
      
    if (fileSizeInMB > 2) {
      toast.warn("Image size must be less than or equal to 2MB.");
      return
    }
    }
    if (files.length > 5) {
      toast.warn("Select up to 5 images");
      return;
    }
    if (imagesFile.length >= 5) {
      toast.warn("Select up to 5 images");
      return;
    }

    setNewImages([...newImages, ...files]);
  };

  const removeImage = (index) => {
    const updatedImages = [...newImages];
    updatedImages.splice(index, 1);
    setNewImages(updatedImages);
  };

  const removeImageByUrl = async(imageId) => {

    try {
      let res = await TicketServices.deleteAppImages(imageId)
if(res.status){
  const removed = imagesFile.filter((img) => img.imageId !== imageId);
  setImagesFile(removed);
  toast.success("Image Deleted!")
}
    } catch (error) {
      return error
    }
    
   
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="justify-content-center d-flex row">
      <div className="image-container col-12 d-flex justify-content-center">
        {imagesFile.map((image, index) => (
          <div key={index} className="image-wrapper">
            <img src={image.url} alt={`preview-${index}`} className="image" />
            <button
              type="button"
              onClick={() => removeImageByUrl(image.imageId)}
              className="remove-button"
            >
              &times;
            </button>
          </div>
        ))}
        {newImages.map((image, index) => (
          <div key={index} className="image-wrapper">
            <img src={URL.createObjectURL(image)} alt={`preview-${index}`} className="image" />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="remove-button"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
      <div className="justify-content-center d-flex col-12">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }} // hide the default file input
          ref={fileInputRef}
        />
        <button
          type="button"
          className="crete-btn mt-1"
          onClick={handleClick}
        >
          Add/Update Icon Images
        </button>
      </div>
      
    </div>
  );
};

export default MultiImageUploader;
