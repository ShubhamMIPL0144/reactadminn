import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import clsx from "clsx";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import user from "../../assets/images/users/2.jpg";
import { useSelector } from "react-redux";
import TicketServices from "../../services/ticket-services";
import Loader from "../../common/Loader";

import Select from "react-select";
import AdServices from "../../services/ad-services";
import MultiImageUploader from "../../common/MultiImageUploader/MultiImageUploader";
import { handleImageResize } from "../../helper/resizeIcon";

const appRegisterSchema = Yup.object().shape({
  applicationName: Yup.string()
    .required("Name is required")
    .max(100, "Maximum 100 characters are allowed.")
    .min(3, "Minimum 3 characters are allowed.")
    .max(100, "Maximum 100 characters are allowed.")
    .min(3, "Minimum 3 characters are allowed."),
  email: Yup.string()
    .email("Invalid email")
    .required("Email is required")
    .max(100, "Maximum 100 characters are allowed.")
    .min(3, "Minimum 3 characters are allowed."),

  companyName: Yup.string()
    .required("Company name is required")
    .max(100, "Maximum 100 characters are allowed.")
    .min(3, "Minimum 3 characters are allowed."),
  description: Yup.string()
    .required("Description is required")
    .max(4000, "Maximum 4000 characters are allowed.")
    .min(3, "Minimum 3 characters are allowed."),
  policy: Yup.string(),
  members: Yup.string().required("Number of members are required"),
  phone: Yup.string().required("Phone is required"),
  youtubeLink: Yup.string(),
  country: Yup.string(),
  city: Yup.string(),
  state: Yup.string(),
  postal: Yup.string(),

  address: Yup.string()
    .max(150, "Maximum 100 characters are allowed.")
    .min(3, "Minimum 3 characters are allowed."),
});

const UpdateAppRequestForm = () => {
  const [iconToUpload, setIconToUpload] = useState(null);
  const [backToUpload, setBackToUpload] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [imagesFile, setImagesFile] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [apiLoader, setApiLoader] = useState(false);
  const [data, setData] = useState({});
  const { auth } = useSelector((state) => state.auth);
  const { id: userId } = auth.data;
  const { id: appId } = useParams();
  const [states, setStates] = useState([]);

  const navigate = useNavigate();

  const stateOptions = states.map((state) => ({
    value: state.stateId,
    label: state.stateName,
  }));

  const formik = useFormik({
    initialValues: {
      applicationName: data.fullName || "",
      email: data.email || "",
      description: data.desc || "",
      policy: data.datapolicy || "",
      members: data.noOfMembers || "",
      companyName: data.organisation || "",
      phone: data.phone || "",
      country: data.country || "",
      youtubeLink: data.youtubeLink || "",
      city: data.city || "",
      state: data.state || "",
      postal: data.postalCode || "",
      address: data.address || "",
      ModifiedBy: userId,
      allowAds: data.isAllowedforAd || false,
      selectedStates: null,
    },
    validationSchema: appRegisterSchema,
    enableReinitialize: true,

    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      if (data.iconImage.length === 0 || data.backgroundImg.length === 0) {
        if (iconToUpload === null || backToUpload === null) {
          toast.warn("Icon and background image are required!");
          return;
        }
      }
      let formattedValues;

      if (values.selectedStates) {
        formattedValues = [
          {
            StateId: values.selectedStates.value,
            CityId: [],
          },
        ];
      } else {
        formattedValues = [
          {
            StateId: data?._CityStateDetails[0]?.stateid,
            CityId: [],
          },
        ];
      }

      const {
        applicationName: FullName,
        companyName: Organisation,
        description: Desc,
        policy: Datapolicy,
        members: NoOfMembers,
        phone: Phone,
        email: Email,
        youtubeLink: YouTubeLink,
        country: Country,
        address: Address,
        city: City,
        state: State,
        postal: Postal,
        allowAds,
      } = values;

      const formData = new FormData();
      if (iconToUpload) {
        formData.append("IconImage", iconToUpload);
      }
      if (backToUpload) {
        formData.append("BackgroundImg", backToUpload);
      }
      formData.append("Id", appId);
      formData.append("FullName", FullName);
      formData.append("Organisation", Organisation);
      formData.append("Desc", Desc);
      formData.append("Datapolicy", Datapolicy);
      formData.append("NoOfMembers", NoOfMembers);
      formData.append("Phone", Phone);
      formData.append("Email", Email);
      formData.append("YouTubeLink", YouTubeLink);
      formData.append("Country", Country);
      formData.append("Address", Address);
      formData.append("City", City);
      formData.append("State", State);
      formData.append("PostalCode", Postal);
      formData.append("ModifiedBy", userId);
      formData.append("IsAllowedforAd", allowAds);
      if (formattedValues) {
        formData.append("States", JSON.stringify(formattedValues));
      } else {
        formData.append("States", JSON.stringify([]));
      }
      const mergedArray = [...newImages];
      for (let index = 0; index < mergedArray.length; index++) {
        formData.append("Post_images", mergedArray[index]);
      }

      try {
        let res = await TicketServices.updateApp(formData);
        if (res.data.status) {
          // resetForm();
          toast.success(res.data.message);
          navigate(-1);
        } else {
          toast.success(res.data.message);
        }
      } catch (error) {
        return error;
      } finally {
        setLoading(false);
      }
    },
  });

  const getStatesHandler = async () => {
    try {
      let res = await AdServices.getStatesAndCities();
      if (res.data.status) {
        let data = res.data.data;
        setStates(data);
      }
    } catch (error) {
      return error;
    }
  };

  const handleFileChange = async (event, type) => {
    const imageFile = event.target.files[0];
    if (!imageFile) return;
    const fileSizeInMB = imageFile.size / 1024 / 1024;

    if (fileSizeInMB > 2) {
      toast.warn("Image size must be less than or equal to 2MB.");
      return;
    }

    if (!imageFile.type.startsWith("image/")) {
      toast.warn("Select image only.");
      return;
    }

    if (type === "icon") {
      try {
        const resizedIcon = await handleImageResize(imageFile);
        setIconToUpload(resizedIcon);
      } catch (error) {
        toast.warn("Error in resizing Icon!");
      }
    } else {
      setBackToUpload(imageFile);
    }
    // setIconType(type);
    // setSelectedImage(URL.createObjectURL(imageFile));

    // openImageModal();
  };

  const getAppDetails = async () => {
    setApiLoader(true);
    try {
      let res = await TicketServices.getAppDetails(appId);
      if (res.data.status) {
        const resData = res.data.data;
        let customerId = resData.userId;
        setData(resData);
        // const screenShots = resData.appImagesNew
        setImagesFile(resData.appImagesNew);

        let customerResponse = await TicketServices.getCustomerDetails(
          customerId
        );
        if (customerResponse.data.status) {
          setCustomerData(customerResponse.data.data);
        }
      }
    } catch (error) {
      return error;
    } finally {
      setApiLoader(false);
    }
  };

  useEffect(() => {
    getAppDetails();
    getStatesHandler();
    //eslint-disable-next-line
  }, []);

  const downloadImageHandler = async (imageType) => {
    const getFileExtension = (fileType) => {
      switch (fileType) {
        case "image/jpeg":
          return ".jpg";
        case "image/png":
          return ".png";
        case "image/gif":
          return ".gif";
        default:
          return "";
      }
    };

    try {
      const response = await TicketServices.downloadImage(appId, imageType);
      if (response.status) {
        const byteCharacters = atob(response.data.base64Image);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {
          type: response.data.contentType,
        });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = imageType + getFileExtension(response.data.contentType);

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error downloading the image", error);
    }
  };

  return (
    <>
      {apiLoader ? (
        <Loader />
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <div className="row mb-2">
            <div className="col-md-2 text-center ps-0">
              <label htmlFor="iconImage">
                <img
                  src={
                    iconToUpload
                      ? URL.createObjectURL(iconToUpload)
                      : data.iconImage || user
                  }
                  alt="icon"
                  style={{
                    width: "116px",
                    height: "100px",
                    borderRadius: "9px",
                    border: "1px solid gray",
                    // objectFit: "contain",
                  }}
                />
              </label>
              <input
                type="file"
                id="iconImage"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "icon")}
                style={{ display: "none" }}
              />
              <h4 className="text-center mb-0">
                App Icon{" "}
                {data.iconImage && (
                  <i
                    className="fa fa-download fs-5 text-primary"
                    style={{ cursor: "pointer" }}
                    onClick={() => downloadImageHandler("IconImage")}
                  ></i>
                )}
              </h4>
            </div>
            <div className="circle-image-selector col-md-2 text-center">
              <label htmlFor="backImage">
                <img
                  src={
                    backToUpload
                      ? URL.createObjectURL(backToUpload)
                      : data?.backgroundImg || user
                  }
                  alt="background"
                  style={{
                    width: "116px",
                    height: "100px",
                    borderRadius: "9px",
                    border: "1px solid gray",
                    objectFit: "contain",
                  }}
                />
              </label>
              <input
                type="file"
                id="backImage"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "back")}
                style={{ display: "none" }}
              />
              <h4 className="text-center ps-0">
                App Background{" "}
                {data.backgroundImg && (
                  <i
                    className="fa fa-download fs-5 text-primary"
                    style={{ cursor: "pointer" }}
                    onClick={() => downloadImageHandler("BackgroundImg")}
                  ></i>
                )}
              </h4>
            </div>

            <div className="col-md-5 d-flex align-items-end">
              <MultiImageUploader
                setImagesFile={setImagesFile}
                imagesFile={imagesFile}
                setNewImages={setNewImages}
                newImages={newImages}
              />
            </div>

            <div className="col-md-3 d-flex justify-content-end">
            

                  <h5 className="text-end my-0">Customer Profile:{" "}  
                     <Link to={`/customer-profile/${customerData?.id}`} className=" text-primary">
                  {/* <img
                    src={customerData?.imagePath||user}
                    alt="icon"
                    style={{
                      width:"2rem",height:"2rem",borderRadius: "50px"
                    }}
                  /> */}
                  {" "}
                  {customerData?.name}
              </Link>
                  </h5>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4">
              <div className="form-group mb-2">
                <label>Application Name </label>
                <input
                  type="text"
                  autoComplete="off"
                  {...formik.getFieldProps("applicationName")}
                  className={clsx(
                    "form-control form-control-solid",
                    {
                      "is-invalid":
                        formik.touched.applicationName &&
                        formik.errors.applicationName,
                    },
                    {
                      "is-valid":
                        formik.touched.applicationName &&
                        !formik.errors.applicationName,
                    }
                  )}
                />
                {formik.touched.applicationName &&
                  formik.errors.applicationName && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        <span role="alert" className="text-danger">
                          {formik.errors.applicationName}
                        </span>
                      </div>
                    </div>
                  )}
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-group mb-2">
                <label> Email</label>
                <input
                  type="email"
                  autoComplete="off"
                  {...formik.getFieldProps("email")}
                  className={clsx(
                    "form-control form-control-solid",
                    {
                      "is-invalid": formik.touched.email && formik.errors.email,
                    },
                    {
                      "is-valid": formik.touched.email && !formik.errors.email,
                    }
                  )}
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      <span role="alert" className="text-danger">
                        {formik.errors.email}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-group mb-2">
                <label>Members</label>
                <select
                        {...formik.getFieldProps("members")}
                        className={clsx(
                          "form form-control",
                          {
                            "is-invalid":
                              formik.touched.members && formik.errors.members,
                          },
                          {
                            "is-valid":
                              formik.touched.members && !formik.errors.members,
                          }
                        )}
                      >
                        <option value="0 - 100">0 - 100</option>
                        <option value="100 - 500">100 - 500</option>
                        <option value="500 - 1000">500 - 1000</option>
                        <option value="> 1000">{">"} 1000</option>
                      </select>
                {formik.touched.members && formik.errors.members && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      <span role="alert" className="text-danger">
                        {formik.errors.members}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group mb-2">
                <label>Organisation Name</label>
                <input
                  type="text"
                  autoComplete="off"
                  {...formik.getFieldProps("companyName")}
                  className={clsx(
                    "form-control form-control-solid",
                    {
                      "is-invalid":
                        formik.touched.companyName && formik.errors.companyName,
                    },
                    {
                      "is-valid":
                        formik.touched.companyName &&
                        !formik.errors.companyName,
                    }
                  )}
                />
                {formik.touched.companyName && formik.errors.companyName && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      <span role="alert" className="text-danger">
                        {formik.errors.companyName}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group mb-2">
                <label>Phone</label>
                <input
                  type="text"
                  autoComplete="off"
                  {...formik.getFieldProps("phone")}
                  className={clsx(
                    "form-control form-control-solid",
                    {
                      "is-invalid": formik.touched.phone && formik.errors.phone,
                    },
                    {
                      "is-valid": formik.touched.phone && !formik.errors.phone,
                    }
                  )}
                />
                {formik.touched.phone && formik.errors.phone && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      <span role="alert" className="text-danger">
                        {formik.errors.phone}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-group mb-2">
                <label>Country or Region</label>
                <select
                  defaultValue="swedish"
                  {...formik.getFieldProps("country")}
                  className={clsx(
                    "form-control form-control-solid",
                    {
                      "is-invalid":
                        formik.touched.country && formik.errors.country,
                    },
                    {
                      "is-valid":
                        formik.touched.country && !formik.errors.country,
                    }
                  )}
                >
                  <option value="sweden" selected>
                    Sweden
                  </option>
                  <option value="india">India</option>
                </select>
                {formik.touched.country && formik.errors.country && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      <span role="alert" className="text-danger">
                        {formik.errors.country}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-group mb-2">
                <label>YouTube Link</label>
                <input
                  type="text"
                  autoComplete="off"
                  {...formik.getFieldProps("youtubeLink")}
                  className={clsx(
                    "form-control form-control-solid",
                    {
                      "is-invalid":
                        formik.touched.youtubeLink && formik.errors.youtubeLink,
                    },
                    {
                      "is-valid":
                        formik.touched.youtubeLink &&
                        !formik.errors.youtubeLink,
                    }
                  )}
                />
                {formik.touched.youtubeLink && formik.errors.youtubeLink && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      <span role="alert" className="text-danger">
                        {formik.errors.youtubeLink}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group mb-2">
                <label>State</label>
                <Select
                  id="states"
                  name="state"
                  options={stateOptions}
                  value={
                    formik.values.selectedStates
                      ? formik.values.selectedStates
                      : data?._CityStateDetails?.map((item) => ({
                          value: item.stateid,
                          label: item.statename,
                        }))
                  }
                  // value={formik.values.selectedStates}
                  onChange={(selectedOptions) => {
                    setData({ ...data, _CityStateDetails: null });
                    formik.setFieldValue("selectedStates", selectedOptions);
                  }}
                />
              </div>
            </div>
            {/* <div className="col-md-4">
              <div className="form-group mb-2">
                <label>State</label>
                <input
                  type="text"
                  autoComplete="off"
                  {...formik.getFieldProps("state")}
                  className={clsx(
                    "form-control form-control-solid",
                    {
                      "is-invalid": formik.touched.state && formik.errors.state,
                    },
                    {
                      "is-valid": formik.touched.state && !formik.errors.state,
                    }
                  )}
                />
                {formik.touched.state && formik.errors.state && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      <span role="alert" className="text-danger">
                        {formik.errors.state}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div> */}

            <div className="col-md-4">
              <div className="form-group mb-2">
                <label>Postal Code</label>
                <input
                  type="text"
                  autoComplete="off"
                  {...formik.getFieldProps("postal")}
                  className={clsx(
                    "form-control form-control-solid",
                    {
                      "is-invalid":
                        formik.touched.postal && formik.errors.postal,
                    },
                    {
                      "is-valid":
                        formik.touched.postal && !formik.errors.postal,
                    }
                  )}
                />
                {formik.touched.postal && formik.errors.postal && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      <span role="alert" className="text-danger">
                        {formik.errors.postal}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-group mb-2">
                <label>Address</label>
                <textarea
                  rows="4"
                  {...formik.getFieldProps("address")}
                  className={clsx(
                    "form-control form-control-solid",
                    {
                      "is-invalid":
                        formik.touched.address && formik.errors.address,
                    },
                    {
                      "is-valid":
                        formik.touched.address && !formik.errors.address,
                    }
                  )}
                ></textarea>
                {formik.touched.address && formik.errors.address && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      <span role="alert" className="text-danger">
                        {formik.errors.address}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group mb-2">
                <label>Data Policy</label>
                <textarea
                  rows="4"
                  {...formik.getFieldProps("policy")}
                  className={clsx(
                    "form-control form-control-solid",
                    {
                      "is-invalid":
                        formik.touched.policy && formik.errors.policy,
                    },
                    {
                      "is-valid":
                        formik.touched.policy && !formik.errors.policy,
                    }
                  )}
                ></textarea>
                {formik.touched.policy && formik.errors.policy && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      <span role="alert" className="text-danger">
                        {formik.errors.policy}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group mb-2">
                <label>Description</label>
                <textarea
                  rows="4"
                  {...formik.getFieldProps("description")}
                  className={clsx(
                    "form-control form-control-solid",
                    {
                      "is-invalid":
                        formik.touched.description && formik.errors.description,
                    },
                    {
                      "is-valid":
                        formik.touched.description &&
                        !formik.errors.description,
                    }
                  )}
                ></textarea>
                {formik.touched.description && formik.errors.description && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      <span role="alert" className="text-danger">
                        {formik.errors.description}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* <div className="col-md-4 mb-2">
              <div className="form-group mb-2 text-center d-flex">
                <input
                        title="Checked if want to allow this app for Ad."
                        id="allowAd"
                        type="checkbox"
                        checked={formik.values.allowAds}
                        {...formik.getFieldProps("allowAds")}
                        className={clsx(
                          "mx-1",
                          {
                            "is-invalid":
                              formik.touched.allowAds && formik.errors.allowAds,
                          },
                          {
                            "is-valid":
                              formik.touched.allowAds && !formik.errors.allowAds,
                          }
                        )}
                      />

                <label htmlFor="allowAd">Enable Advertisement</label>
                
              </div>
            </div>  */}
          </div>
          <div className="row">
            <div className="col-md-12">
              <button type="submit" className="crete-btn" disabled={loading}>
                Update App
              </button>
            </div>
          </div>
        </form>
      )}

      {/* <ImageCropper
        formik={formik}
        show={showImageModal}
        handleClose={closeImageModal}
        setImageToUpload={
          iconType === "icon" ? setIconToUpload : setBackToUpload
        }
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        isSubmit={false}
      /> */}
    </>
  );
};

export default UpdateAppRequestForm;
