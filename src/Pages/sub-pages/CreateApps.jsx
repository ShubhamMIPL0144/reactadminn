import React, { useEffect, useState } from "react";
import ApplicationServices from "../../services/application-service";
import clsx from "clsx";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Steric from "../../common/Steric";
import Select from "react-select";
import AdServices from "../../services/ad-services";

const appSchema = Yup.object().shape({
  appCode: Yup.string()
    .required("Please Enter Code (The app code is unique)")
    .trim(),
  appName: Yup.string().required("Please Enter App Name").trim(),
  username: Yup.string().required("Please Enter Username").trim(),
  firstName: Yup.string().required("Please Enter First Name").trim(),

  contact: Yup.string().required("Please Enter Phone Number").trim(),
  dataPolicy: Yup.string()
    // .required("Please add data policy")
    // .url("The url format is not correct")
    .trim(),
  iosLink: Yup.string()
    .required("Please add apple app store link")
    .url("The url format is not correct")
    .trim(),
  playStoreLink: Yup.string()
    .required("Please add google play store link")
    .url("The url format is not correct")
    .trim(),
  password: Yup.string().required("Please Enter Password").trim(),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const initialValues = {
  appCode: "",
  appName: "",
  username: "",
  firstName: "",
  lastName: "",
  email: "",
  contact: "",
  password: "",
  confirmPassword: "",
  playStoreLink: "",
  iosLink: "",
  dataPolicy: "",
  userTerms: "",
  emailInvite: "",
  smsInvite: "",
  forgotPasswordText: "",
  selectedStates: null,
  allowAds:false,
};

const CreateApps = () => {
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [states, setStates] = useState([]);
  const stateOptions = states.map((state) => ({
    value: state.stateId,
    label: state.stateName,
  }));
  const navigate = useNavigate();

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

  const formik = useFormik({
    initialValues,
    validationSchema: appSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      const formData = new FormData();
      let formattedValues;
      if(values.selectedStates){

        formattedValues = [
        {
          StateId: values.selectedStates.value,
          CityId: [],
        },
      ];
    }else{
      toast.warn("Select Application State!")
      return
    }
      formData.append("Status", "1");
      formData.append("Active", "1");
      formData.append("Link", "");
      formData.append("AppCode", values.appCode);
      formData.append("Name", values.appName);
      formData.append("Foodpdfname", values.forgotPasswordText);
      formData.append("Smscontent", values.smsInvite);
      formData.append("MsgContent", values.emailInvite);
      formData.append("Contact", values.userTerms);
      formData.append("Termscondition", values.dataPolicy);
      formData.append("Playstorelink", values.playStoreLink);
      formData.append("Ioslink", values.iosLink);
      formData.append("Username", values.username);
      formData.append("Firstname", values.firstName);
      formData.append("LastName", values.firstName);
      formData.append("Email", values.email);
      formData.append("Telephone", values.contact);
      formData.append("Password", values.password);
      formData.append("ConfirmPassword", values.confirmPassword);
      formData.append("States", JSON.stringify(formattedValues));
      formData.append("IsAllowedForAd", values.allowAds);
      if (selectedImage) {
        formData.append("BackgroundImg", selectedImage);
      }else{
          toast.warn("Select Image!")
          return
      }
      try {
        let res = await ApplicationServices.createApplication(formData);
        if (res.data.status) {
          toast.success(res.data.message);
          resetForm();
          navigate(-1);
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        return error;
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 3000);
      }
    },
  });

  const handleAppCodeClick = () => {
    // Copy appName value to appCode
    formik.setValues({
      ...formik.values,
      appCode: formik.values.appName,
    });
  };

  const validateImageDimensions = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const { width, height } = img;
        URL.revokeObjectURL(img.src);
        resolve(width === 430 && height === 230);
      };
    });
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // const isValid = await validateImageDimensions(file);
      // if (isValid) {
        setSelectedImage(file);
        toast.success("Image selected successfully.");
      // } else {
      //   setSelectedImage(null);
      //   toast.error("Image must be exactly 430x230 pixels.");
      // }
    }
  };

  useEffect(() => {
    getStatesHandler();
    //eslint-disable-next-line
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="app-head">
          <h2>Add New App</h2>
        </div>
        <hr />
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className="row" style={{ borderBottom: "1px solid lightgray" }}>
          <div className="col-md-6">
            <div className="form-group mb-2">
              <label htmlFor="simpleinput" className="form-label">
                App
                <Steric />
              </label>
              <input
                type="text"
                autoComplete="off"
                {...formik.getFieldProps("appName")}
                className={clsx(
                  "form-control form-control-solid",
                  {
                    "is-invalid":
                      formik.touched.appName && formik.errors.appName,
                  },
                  {
                    "is-valid":
                      formik.touched.appName && !formik.errors.appName,
                  }
                )}
              />
              {formik.touched.appName && formik.errors.appName && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert" className="text-danger">
                      {formik.errors.appName}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group mb-2">
              <label htmlFor="simpleinput" className="form-label">
                Code
                <Steric />
              </label>
              <input
                onClick={handleAppCodeClick}
                type="text"
                autoComplete="off"
                {...formik.getFieldProps("appCode")}
                className={clsx(
                  "form-control form-control-solid",
                  {
                    "is-invalid":
                      formik.touched.appCode && formik.errors.appCode,
                  },
                  {
                    "is-valid":
                      formik.touched.appCode && !formik.errors.appCode,
                  }
                )}
              />
              {formik.touched.appCode && formik.errors.appCode && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert" className="text-danger">
                      {formik.errors.appCode}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group mb-2">
              <label htmlFor="example-textarea" className="form-label">
                Data Policy
              </label>
              <textarea
                rows="4"
                {...formik.getFieldProps("dataPolicy")}
                className={clsx(
                  "form-control form-control-solid",
                  {
                    "is-invalid":
                      formik.touched.dataPolicy && formik.errors.dataPolicy,
                  },
                  {
                    "is-valid":
                      formik.touched.dataPolicy && !formik.errors.dataPolicy,
                  }
                )}
              ></textarea>
              {formik.touched.dataPolicy && formik.errors.dataPolicy && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert" className="text-danger">
                      {formik.errors.dataPolicy}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="col-md-4">
            <div className="form-group mb-2">
              <label htmlFor="example-textarea" className="form-label">
                User Terms
              </label>
              <textarea
                rows="4"
                {...formik.getFieldProps("userTerms")}
                className={clsx(
                  "form-control form-control-solid",
                  {
                    "is-invalid":
                      formik.touched.userTerms && formik.errors.userTerms,
                  },
                  {
                    "is-valid":
                      formik.touched.userTerms && !formik.errors.userTerms,
                  }
                )}
              ></textarea>
              {formik.touched.userTerms && formik.errors.userTerms && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert" className="text-danger">
                      {formik.errors.userTerms}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group mb-2">
              <label htmlFor="example-textarea" className="form-label">
                Google play store link
                <Steric />
              </label>
              <textarea
                rows="4"
                {...formik.getFieldProps("playStoreLink")}
                className={clsx(
                  "form-control form-control-solid",
                  {
                    "is-invalid":
                      formik.touched.playStoreLink &&
                      formik.errors.playStoreLink,
                  },
                  {
                    "is-valid":
                      formik.touched.playStoreLink &&
                      !formik.errors.playStoreLink,
                  }
                )}
              ></textarea>
              {formik.touched.playStoreLink && formik.errors.playStoreLink && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert" className="text-danger">
                      {formik.errors.playStoreLink}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group mb-2">
              <label htmlFor="example-textarea" className="form-label">
                Apple app store link
                <Steric />
              </label>
              <textarea
                rows="4"
                {...formik.getFieldProps("iosLink")}
                className={clsx(
                  "form-control form-control-solid",
                  {
                    "is-invalid":
                      formik.touched.iosLink && formik.errors.iosLink,
                  },
                  {
                    "is-valid":
                      formik.touched.iosLink && !formik.errors.iosLink,
                  }
                )}
              ></textarea>
              {formik.touched.iosLink && formik.errors.iosLink && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert" className="text-danger">
                      {formik.errors.iosLink}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group mb-2">
              <label htmlFor="example-textarea" className="form-label">
                Email invite
              </label>
              <textarea
                rows="4"
                {...formik.getFieldProps("emailInvite")}
                className={clsx(
                  "form-control form-control-solid",
                  {
                    "is-invalid":
                      formik.touched.emailInvite && formik.errors.emailInvite,
                  },
                  {
                    "is-valid":
                      formik.touched.emailInvite && !formik.errors.emailInvite,
                  }
                )}
              ></textarea>
              {formik.touched.emailInvite && formik.errors.emailInvite && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert" className="text-danger">
                      {formik.errors.emailInvite}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group mb-2">
              <label htmlFor="example-textarea" className="form-label">
                Sms invite
              </label>
              <textarea
                rows="4"
                {...formik.getFieldProps("smsInvite")}
                className={clsx(
                  "form-control form-control-solid",
                  {
                    "is-invalid":
                      formik.touched.smsInvite && formik.errors.smsInvite,
                  },
                  {
                    "is-valid":
                      formik.touched.smsInvite && !formik.errors.smsInvite,
                  }
                )}
              ></textarea>
              {formik.touched.smsInvite && formik.errors.smsInvite && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert" className="text-danger">
                      {formik.errors.smsInvite}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group mb-2">
              <label htmlFor="example-textarea" className="form-label">
                Forgot Password Text
              </label>
              <textarea
                rows="4"
                {...formik.getFieldProps("forgotPasswordText")}
                className={clsx(
                  "form-control form-control-solid",
                  {
                    "is-invalid":
                      formik.touched.forgotPasswordText &&
                      formik.errors.forgotPasswordText,
                  },
                  {
                    "is-valid":
                      formik.touched.forgotPasswordText &&
                      !formik.errors.forgotPasswordText,
                  }
                )}
              ></textarea>
              {formik.touched.forgotPasswordText &&
                formik.errors.forgotPasswordText && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      <span role="alert" className="text-danger">
                        {formik.errors.forgotPasswordText}
                      </span>
                    </div>
                  </div>
                )}
            </div>
          </div>

          <div className="col-md-4">
            <div className="form-group mb-2">
              <label className="form-label">State<Steric/></label>

              <Select
                id="states"
                name="Stad"
                options={stateOptions}
                value={formik.values.selectedStates}
                onChange={(selectedOptions) =>
                  formik.setFieldValue("selectedStates", selectedOptions)
                }
              />

              {formik.touched.forgotPasswordText &&
                formik.errors.forgotPasswordText && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      <span role="alert" className="text-danger">
                        {formik.errors.forgotPasswordText}
                      </span>
                    </div>
                  </div>
                )}
            </div>
          </div>










          <div className="col-md-4">
            <div className="">
              <label htmlFor="allowAds" className="form-label">
                Enable Advertisement
              </label>
            </div>
            <input name="allowAds" id="allowAds" type="checkbox" 
            {...formik.getFieldProps("allowAds")}
            
            />
            
          </div>  
















          <div className="col-md-4">
            <div className="mb-3">
              <label htmlFor="imageUpload" className="form-label">
                Recommended Image resolution (430x230 pixels)<Steric />
              </label>
              <input
                type="file"
                accept="image/*"
                id="imageUpload"
                onChange={handleImageChange}
                className="form-control"
              />

              {selectedImage && (
                <div className="mt-3">
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Selected"
                    style={{
                      width: "100%",
                      height: "auto",
                      maxWidth: "512px",
                      maxHeight: "512px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                    }}
                  />
                </div>
              )}
            </div>
          </div>
      
        </div>

        <div className="row">
          <div className="form-group mb-2">
            <h2>Admin Registration</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            <div className="form-group mb-2">
              <label htmlFor="simpleinput" className="form-label">
                Username
                <Steric />
              </label>
              <input
                type="text"
                autoComplete="off"
                {...formik.getFieldProps("username")}
                className={clsx(
                  "form-control form-control-solid",
                  {
                    "is-invalid":
                      formik.touched.username && formik.errors.username,
                  },
                  {
                    "is-valid":
                      formik.touched.username && !formik.errors.username,
                  }
                )}
              />
              {formik.touched.username && formik.errors.username && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert" className="text-danger">
                      {formik.errors.username}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group mb-2">
              <label htmlFor="simpleinput" className="form-label">
                Name
                <Steric />
              </label>
              <input
                type="text"
                autoComplete="off"
                {...formik.getFieldProps("firstName")}
                className={clsx(
                  "form-control form-control-solid",
                  {
                    "is-invalid":
                      formik.touched.firstName && formik.errors.firstName,
                  },
                  {
                    "is-valid":
                      formik.touched.firstName && !formik.errors.firstName,
                  }
                )}
              />
              {formik.touched.firstName && formik.errors.firstName && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert" className="text-danger">
                      {formik.errors.firstName}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="col-md-4">
            <div className="form-group mb-2">
              <label htmlFor="example-textarea" className="form-label">
                Phone Number
                <Steric />
              </label>
              <input
                type="text"
                autoComplete="off"
                {...formik.getFieldProps("contact")}
                className={clsx(
                  "form-control form-control-solid",
                  {
                    "is-invalid":
                      formik.touched.contact && formik.errors.contact,
                  },
                  {
                    "is-valid":
                      formik.touched.contact && !formik.errors.contact,
                  }
                )}
              />
              {formik.touched.contact && formik.errors.contact && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert" className="text-danger">
                      {formik.errors.contact}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group mb-2">
              <label htmlFor="example-textarea" className="form-label">
                Password
                <Steric />
              </label>
              <input
                type="password"
                autoComplete="off"
                {...formik.getFieldProps("password")}
                className={clsx(
                  "form-control form-control-solid",
                  {
                    "is-invalid":
                      formik.touched.password && formik.errors.password,
                  },
                  {
                    "is-valid": formik.touched.title && !formik.errors.password,
                  }
                )}
              />
              {formik.touched.password && formik.errors.password && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert" className="text-danger">
                      {formik.errors.password}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group mb-2">
              <label htmlFor="example-textarea" className="form-label">
                Confirm Password
                <Steric />
              </label>
              <input
                type="password"
                autoComplete="off"
                {...formik.getFieldProps("confirmPassword")}
                className={clsx(
                  "form-control form-control-solid",
                  {
                    "is-invalid":
                      formik.touched.confirmPassword &&
                      formik.errors.confirmPassword,
                  },
                  {
                    "is-valid":
                      formik.touched.confirmPassword &&
                      !formik.errors.confirmPassword,
                  }
                )}
              />
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      <span role="alert" className="text-danger">
                        {formik.errors.confirmPassword}
                      </span>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
        <button className="crete-btn" type="submit" disabled={loading}>
          Save
        </button>
      </form>
    </div>
  );
};

export default CreateApps;
