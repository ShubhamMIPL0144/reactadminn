import { useRef, useState } from "react";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
// import linkImg from "../../assets/images/link.pang";
import galImg from "../../assets/images/gall.png";
import calender from "../../assets/images/calendar.png"
import phoneImage from "../../assets/images/phone.png";
import "react-datepicker/dist/react-datepicker.css";

const AdForm = ({ dispatch, state, adData, setAdData }) => {
  const { isLinkClicked, videoUrl } = state;
  const videoRef = useRef(null);

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const handleImageClick = () => {
    imageInputRef.current.click();
  };
  const handleVideoClick = () => {
    videoInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const imageFile = event.target.files[0];

    if (imageFile) {
      const img = new Image();
      img.src = URL.createObjectURL(imageFile);

      img.onload = () => {
        // if (img.width === 512 && img.height === 512) {
        setAdData({
          ...adData,
          photoToUpload: imageFile,
          videoToUpload: null,
        });
        dispatch({ type: "setVideoUrl", payload: null });
        // } else {
        //   toast.warn("Select image with a resolution of 512X512 pixels");
        // }

        URL.revokeObjectURL(img.src); // Free up memory
      };
    }
  };

  const handleVideoChange = (event) => {
    const videoFile = event.target.files[0];
    // if (videoFile.size <= 2 * 1024 * 1024) {
    setAdData({ ...adData, videoToUpload: videoFile, photoToUpload: null });
    const videoObjectUrl = URL.createObjectURL(videoFile);
    dispatch({ type: "setVideoUrl", payload: videoObjectUrl });
    // } else {
    //   toast.warn("Choose video less than 2MB!");
    // }
  };

  const handleLoadedMetadata = () => {
    const duration = videoRef.current.duration;
    // setVideoDuration(duration);
    validateVideoDuration(duration);
  };

  const validateVideoDuration = (duration) => {
    const maxDuration = 15; // Maximum duration in seconds
    if (duration > maxDuration) {
      alert(`Video duration should be ${maxDuration} sec or less.`);
      dispatch({ type: "setVideoUrl", payload: null });
    }
  };

  return (
    <>
      <div className="data-policy">
        <form>
          <div className="row">
            <div className="col-md-5">
              <div
                className="form-group  block-word1"
                // onClick={() =>
                //   dispatch({ type: "setIsLinkClicked", payload: true })
                // }
              >
                <label>Link </label>
                {/* <div className="ad-img ">
                  <input type="file" id="real-file2" hidden="hidden" />
                  <img
                    alt="link"
                    src={linkImg}
                    id="custom-button2"
                    style={{ width: "30px", cursor: "pointer" }}
                  />
                  <br />
                  <span id="custom-text2"></span>
                </div> */}
              </div>
              {/* {isLinkClicked && ( */}
              <input
                type="text"
                className="form form-control"
                name="link"
                onChange={(e) =>
                  setAdData({ ...adData, adLink: e.target.value })
                }
                value={adData.adLink}
              />
              {/* )} */}
            </div>
            <div className="col-md-5">
              <div className="mb-3 block-word1">
                <label htmlFor="example-textarea" className="form-label">
                  Selected Current Date
                </label>
                <div className="img-calender">
                  {/* <img
                    alt="Caalender"
                    src={calender}
                    id="custom-button2"
                    style={{ width: "30px", cursor: "pointer" }}
                  /> */}
                  <DatePicker
                    format="dd-MM-yyyy"
                    selectsRange={true}
                    startDate={new Date()}
                    endDate={new Date()}
                    disabled
                    wrapperClassName="form-control"
                    className="form-control"
                  />
                </div>
                  
              </div>
            </div>

            <div className="col-md-3 text-center">
              <div className="form-group  block-word1 mt-2">
                {/* <label> Image </label> */}
                <div className="ad-img ">
                  <input
                    id="uploadedImage"
                    type="file"
                    hidden="hidden"
                    ref={imageInputRef}
                    style={{ display: "none" }}
                    name="uploadImage"
                    onChange={(e) => handleFileChange(e)}
                    accept="image/*"
                  />
                  {/* <img
                    alt="select"
                    src={galImg}
                    id="custom-button"
                    style={{ width: "30px", cursor: "pointer" }}
                    onClick={handleImageClick}
                  /> */}
                  <button
                    type="button"
                    className="btn btn-primary text-center"
                    onClick={handleImageClick}
                  >
                    Upload Ad Image
                  </button>
                  {/* <br /> */}
                  {/* {adData.photoToUpload ? null : (
                    <span id="custom-text" className="text-danger fs-6">
                      Select image with a resolution of 512X512 pixels
                    </span>
                  )} */}
                </div>
                {adData.photoToUpload && (
                  <div className="image-overlay-container">
                    <div className="image-frame-photo">
                      <img
                        src={phoneImage}
                        alt="Mobile Frame"
                        className="frame"
                      />
                      <img
                        className="overlay"
                        alt="upload"
                        src={URL.createObjectURL(adData.photoToUpload)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="col-md-3 text-center">
              <div className="form-group block-word1 mt-2">
                {/* <label> Video </label> */}
                <div className="ad-img">
                  <input
                    type="file"
                    id="real-file"
                    hidden="hidden"
                    ref={videoInputRef}
                    style={{ display: "none" }}
                    onChange={(e) => handleVideoChange(e)}
                    accept="video/*"
                  />
                  {/* <img
                    alt="select"
                    src={galImg}
                    id="custom-button"
                    style={{ width: "30px", cursor: "pointer" }}
                    onClick={handleVideoClick}
                  /> */}
                  <button
                    type="button"
                    className="btn btn-primary text-center"
                    onClick={handleVideoClick}
                  >
                    Upload Ad Video
                  </button>
                  <br />
                  {videoUrl ? null : (
                    <span id="custom-text" className="text-danger fs-6">
                      Video duration should be 15 sec or less.
                    </span>
                  )}
                </div>
                {videoUrl && (
                  <div className="image-overlay-container">
                    <div className="image-frame-photo">
                      <img
                        src={phoneImage}
                        alt="Mobile Frame"
                        className="frame"
                      />
                      <video
                        controls
                        ref={videoRef}
                        onLoadedMetadata={handleLoadedMetadata}
                        width="100%"
                        className="overlay"
                      >
                        <source src={videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AdForm;
