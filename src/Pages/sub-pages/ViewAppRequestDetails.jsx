import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import clsx from "clsx";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import TicketServices from "../../services/ticket-services";
import Loader from "../../common/Loader";

const appRegisterSchema = Yup.object().shape({
  applicationName: Yup.string()
    .required("Name is required")
    .max(100, "Högst 100 tecken är tillåtna.")
    .min(3, "Minst 3 tecken krävs.")
    .max(100, "Högst 100 tecken är tillåtna.")
    .min(3, "Minst 3 tecken krävs."),
  email: Yup.string()
    .email("Invalid email")
    .required("Email is required")
    .max(100, "Högst 100 tecken är tillåtna.")
    .min(3, "Minst 3 tecken krävs."),
  companyName: Yup.string()
    .required("Company name is required")
    .max(100, "Högst 100 tecken är tillåtna.")
    .min(3, "Minst 3 tecken krävs."),
  description: Yup.string()
    .required("Description is required")
    .max(200, "Högst 200 tecken är tillåtna.")
    .min(3, "Minst 3 tecken krävs."),
  policy: Yup.string()
    .required("Policy is required")
    .max(200, "Högst 200 tecken är tillåtna.")
    .min(3, "Minst 3 tecken krävs."),
  members: Yup.string().required("Number of members are required"),
  phone: Yup.string().required("Phone is required"),
  country: Yup.string().required("Country is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  postal: Yup.string().required("Postal is required"),

  address: Yup.string()
    .required("Address is required")
    .max(150, "Högst 100 tecken är tillåtna.")
    .min(3, "Minst 3 tecken krävs."),
});

const ViewAppRequestDetails = () => {
  const [iconToUpload, setIconToUpload] = useState(null);
  const [backToUpload, setBackToUpload] = useState(null);
  const [backView, setBackView] = useState(null);
  const [iconView, setIconView] = useState(null);

  const [apiLoader, setApiLoader] = useState(false);
  const [data, setData] = useState({});
  const { auth } = useSelector((state) => state.auth);
  const { id: userId } = auth.data;
  const { id: appId } = useParams();
  const navigate = useNavigate();

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
      city: data.city || "",
      state: data.state || "",
      postal: data.postalCode || "",
      address: data.address || "",
      ModifiedBy: userId,
    },
    validationSchema: appRegisterSchema,
    enableReinitialize: true,

    onSubmit: async (values, { resetForm }) => {
      // setLoading(true);
      if (data.iconImage.length === 0 || data.backgroundImg.length === 0) {

        if (iconToUpload === null || backToUpload === null) {
          toast.warn("Icon and background image are required!");
          return
        }
      }
      const {
        applicationName: FullName,
        companyName: Organisation,
        description: Desc,
        policy: Datapolicy,
        members: NoOfMembers,
        phone: Phone,
        email: Email,
        country: Country,
        address: Address,
        city: City,
        state: State,
        postal: Postal,
      } = values;

      const formData = new FormData();

      formData.append("Id", appId);
      formData.append("FullName", FullName);
      formData.append("Organisation", Organisation);
      formData.append("Desc", Desc);
      formData.append("Datapolicy", Datapolicy);
      formData.append("NoOfMembers", Number(NoOfMembers));
      formData.append("Phone", Phone);
      formData.append("Email", Email);
      formData.append("Country", Country);
      formData.append("Address", Address);
      formData.append("City", City);
      formData.append("State", State);
      formData.append("PostalCode", Postal);
      formData.append("ModifiedBy", userId);


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
      }
      //  finally {
      //   setLoading(false);
      // }
    },
  });


  // Function to handle file selection
  const handleFileChange = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (type === "icon") {
          setIconToUpload(file);
          setIconView(reader.result);
        } else {
          setBackToUpload(file);
          setBackView(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const getAppDetails = async () => {
    setApiLoader(true)
    try {
      let res = await TicketServices.getAppDetails(appId);
      if (res.data.status) {
        setData(res.data.data);
      }
    } catch (error) {
      return error;
    } finally {
      setApiLoader(false)

    }
  };

  useEffect(() => {
    getAppDetails();
    //eslint-disable-next-line
  }, []);

  return (



    <div className="container-fluid">
      <div className="row">
        <div className="app-head">
          <h2>Application</h2>
        </div>
        <hr />
      </div>
      {
        apiLoader ? <Loader /> :

          <form onSubmit={formik.handleSubmit}>
            <div className="row mb-2">
              <div className="col-md-2 text-center ps-0">
                <label htmlFor="iconImage">
                <a href={data?.iconImage} download target="_blank" rel="noreferrer">
                  <img
                    src={iconView || data?.iconImage}
                    alt="icon"
                    className=""   style={{     width: "116px",
                    height: "100px",
                    borderRadius: "9px",
                    border: "1px solid gray",
                    objectFit: "contain" }}
                  />
                  </a>
                </label>
                <input disabled
                  type="file"
                  id="iconImage"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "icon")}
                  style={{ display: "none" }}
                />
                <h4 className="text-center">App Icon</h4>
              </div>
              <div className="circle-image-selector col-md-2 text-center">
                <label htmlFor="backImage">
                <a href={data?.backgroundImg} download target="_blank" rel="noreferrer">
                  <img
                    src={backView || data?.backgroundImg}
                    alt="background"
                    style={{     width: "116px",
                    height: "100px",
                    borderRadius: "9px",
                    border: "1px solid gray",
                    objectFit: "contain" }}
                  />
                  </a>
                </label>
                <input disabled
                  type="file"
                  id="backImage"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "back")}
                  style={{ display: "none" }}
                />
                <h4 className="text-center ps-0">App Background</h4>
              </div>
            </div>

            <div className="row">
              <div className="col-md-4">
                <div className="form-group mb-2">
                  <label>Application Name </label>
                  <input disabled
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
                  <input disabled
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
                  <input disabled
                    type="text"
                    autoComplete="off"
                    {...formik.getFieldProps("members")}
                    className={clsx(
                      "form-control form-control-solid",
                      {
                        "is-invalid":
                          formik.touched.members && formik.errors.members,
                      },
                      {
                        "is-valid":
                          formik.touched.members && !formik.errors.members,
                      }
                    )}
                  />
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
                  <input disabled
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
                          formik.touched.companyName && !formik.errors.companyName,
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
                  <input disabled
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
                  <label>City</label>
                  <input disabled
                    type="text"
                    autoComplete="off"
                    {...formik.getFieldProps("city")}
                    className={clsx(
                      "form-control form-control-solid",
                      {
                        "is-invalid": formik.touched.city && formik.errors.city,
                      },
                      {
                        "is-valid": formik.touched.city && !formik.errors.city,
                      }
                    )}
                  />
                  {formik.touched.city && formik.errors.city && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        <span role="alert" className="text-danger">
                          {formik.errors.city}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-group mb-2">
                  <label>State</label>
                  <input disabled
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
              </div>
              <div className="col-md-4">
                <div className="form-group mb-2">
                  <label>Postal Code</label>
                  <input disabled
                    type="text"
                    autoComplete="off"
                    {...formik.getFieldProps("postal")}
                    className={clsx(
                      "form-control form-control-solid",
                      {
                        "is-invalid": formik.touched.postal && formik.errors.postal,
                      },
                      {
                        "is-valid": formik.touched.postal && !formik.errors.postal,
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
                  <textarea disabled
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
                  <textarea disabled
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
                  <textarea disabled
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
                          formik.touched.description && !formik.errors.description,
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

            </div>
            {/* <div className="row">
          <div className="col-md-12">
            <button type="submit" className="crete-btn" disabled={loading}>
              Save
            </button>
          </div>
        </div> */}
          </form>
      }

    </div>
  );
};

export default ViewAppRequestDetails;
