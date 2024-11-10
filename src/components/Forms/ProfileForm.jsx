import React, { useState,useEffect } from "react";
import * as Yup from "yup";
import clsx from "clsx";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import ProfileServices from "../../services/profile-services";
import Loader from "../../common/Loader";

const Schema = Yup.object().shape({
  firstname: Yup.string().required("Enter First Name").trim(),
  lastname: Yup.string().required("Enter Last Name").trim(),
});

const ProfileForm = ({profileDetails,profileLoading}) => {
  const [initialValues, setInitialValues] = useState({
    firstname: "",
    lastname: "",
    email: "",
    telephone: "",
    usertype: "",
  });
  const [loading, setLoading] = useState(false)
  const formik = useFormik({
    initialValues,
    validationSchema: Schema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true)
      try {
        let res = await ProfileServices.updateProfile(values);
        if (res.data.status) {
          toast.success(res.data.message);
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        return error;
      }finally{
        setTimeout(() => {
          setLoading(false)
        }, 3000);
      }
    },
  });

  useEffect(() => {
    if(profileDetails){
        setInitialValues({
            firstname: profileDetails?.firstname||"",
            lastname: profileDetails?.lastname||"",
            email: profileDetails?.email||"",
            telephone: profileDetails?.telephone||"",
            usertype: `${profileDetails?.usertype}`,
          });
    }
    
  }, [profileDetails])
  
  return (
    !profileLoading ?(<form onSubmit={formik.handleSubmit}>
      <div className="row">
        <div className="col-md-4">
          <div className="mb-3">
            <label htmlFor="simpleinput" className="form-label">
              User Type
            </label>
            <select
            disabled
            style={{backgroundColor:'#d9d9d9'}}
            placeholder=""
              type="text"
              id="simpleinput"
              {...formik.getFieldProps("usertype")}
              className={clsx(
                "form-control form-control-solid",
                {
                  "is-invalid":
                    formik.touched.usertype && formik.errors.usertype,
                },
                {
                  "is-valid":
                    formik.touched.usertype && !formik.errors.usertype,
                }
              )}
            >
               <option selected>{profileDetails?.usertype===1?"SuperAdmin":profileDetails?.usertype===2?"SubAdmin":profileDetails?.usertype===3?"TeamLeader":"User"}</option>
            </select>
            {formik.touched.usertype && formik.errors.usertype && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert" className="text-danger">
                    {formik.errors.usertype}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="col-md-4">
          <div className="mb-3">
            <label htmlFor="example-textarea" className="form-label">
              E-mail
            </label>
            <input
            disabled
            style={{backgroundColor:'#d9d9d9'}}
              type="text"
              id="simpleinput"
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
          <div className="mb-3">
            <label htmlFor="simpleinput" className="form-label">
              First Name
            </label>
            <input
              type="text"
              id="simpleinput"
              {...formik.getFieldProps("firstname")}
              className={clsx(
                "form-control form-control-solid",
                {
                  "is-invalid":
                    formik.touched.firstname && formik.errors.firstname,
                },
                {
                  "is-valid":
                    formik.touched.firstname && !formik.errors.firstname,
                }
              )}
            />
            {formik.touched.firstname && formik.errors.firstname && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert" className="text-danger">
                    {formik.errors.firstname}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="col-md-4">
          <div className="mb-3">
            <label htmlFor="simpleinput" className="form-label">
              Last Name
            </label>
            <input
              type="text"
              id="simpleinput"
              {...formik.getFieldProps("lastname")}
              className={clsx(
                "form-control form-control-solid",
                {
                  "is-invalid":
                    formik.touched.lastname && formik.errors.lastname,
                },
                {
                  "is-valid":
                    formik.touched.lastname && !formik.errors.lastname,
                }
              )}
            />
            {formik.touched.lastname && formik.errors.lastname && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert" className="text-danger">
                    {formik.errors.lastname}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="col-md-4">
          <div className="mb-3">
            <label htmlFor="example-textarea" className="form-label">
              Telephone Number
            </label>
            <input
              type="text"
              id="simpleinput"
              {...formik.getFieldProps("telephone")}
              className={clsx(
                "form-control form-control-solid",
                {
                  "is-invalid":
                    formik.touched.telephone && formik.errors.telephone,
                },
                {
                  "is-valid":
                    formik.touched.telephone && !formik.errors.telephone,
                }
              )}
            />
            {formik.touched.telephone && formik.errors.telephone && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert" className="text-danger">
                    {formik.errors.telephone}
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
    </form>)
    :<Loader />
  );
};

export default ProfileForm;
