import React, { useEffect, useState } from "react";
import useApi from "../hooks/useApi";
import user from "../assets/images/users/2.jpg";
import clsx from "clsx";
import { useFormik } from "formik";
import { useParams } from "react-router-dom";
import Loader from "../common/Loader";
const CustomerProfile = () => {
  const [initialValues, setInitialValues] = useState({
    name: "",
    companyName: "",
    organizationNo: "",
    email: "",
    address: "",
    userType: "",
  });

  const { id } = useParams();
  const { data: customerRes, loading } = useApi(
    `AddCreatorListById?userid=${id}`
  );

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: async (values) => {},
  });

  useEffect(() => {
    if (customerRes?.data) {
      setInitialValues({
        name: customerRes?.data?.name || "",
        companyName: customerRes?.data?.companyName || "",
        organizationNo: customerRes?.data?.organizationNo || "",
        phone: customerRes?.data?.phoneNo || "",
        email: customerRes?.data?.email || "",
        address: customerRes?.data?.address || "",
        userType: customerRes?.data?.userType || "",
      });
    }
  }, [customerRes]);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="app-head">
          <h2>Customer Profile</h2>
        </div>
        <hr />
      </div>
      <div className="row">
        <div className="col-xl-12">
          <div className="card">
            {loading ? (
              <Loader />
            ) : (
              <div className="card-bodys row">
                <div className="col-2 text-center ps-0">
                  <label htmlFor="iconImage">
                    <img
                      src={customerRes?.data?.imagePath || user}
                      alt="icon"
                      className="image"
                    />
                  </label>
                </div>
                <div className="col-10">
                  <form>
                    <div className="row">
                      <div className="col-md-4">
                        <div className="mb-3">
                          <label htmlFor="simpleinput" className="form-label">
                            Name
                          </label>
                          <input
                            style={{ backgroundColor: "#d9d9d97a" }}
                            type="text"
                            id="simpleinput"
                            {...formik.getFieldProps("name")}
                            className={clsx("form-control form-control-solid")}
                            disabled
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="mb-3">
                          <label
                            htmlFor="example-textarea"
                            className="form-label"
                          >
                            E-mail
                          </label>
                          <input
                            disabled
                            style={{ backgroundColor: "#d9d9d97a" }}
                            type="text"
                            id="simpleinput"
                            {...formik.getFieldProps("email")}
                            className={clsx("form-control form-control-solid")}
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="mb-3">
                          <label htmlFor="simpleinput" className="form-label">
                            User Type
                          </label>
                          <input
                            disabled
                            style={{ backgroundColor: "#d9d9d97a" }}
                            placeholder=""
                            type="text"
                            id="simpleinput"
                            {...formik.getFieldProps("userType")}
                            className="form-control form-control-solid"
                          ></input>
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="mb-3">
                          <label htmlFor="simpleinput" className="form-label">
                            Company Name
                          </label>
                          <input
                            style={{ backgroundColor: "#d9d9d97a" }}
                            disabled
                            type="text"
                            id="simpleinput"
                            {...formik.getFieldProps("companyName")}
                            className={clsx("form-control form-control-solid")}
                          />
                        </div>
                      </div>

                  
                      <div className="col-md-8">
                        <div className="mb-3">
                          <label
                            htmlFor="example-textarea"
                            className="form-label"
                          >
                            Address
                          </label>
                          <input
                            style={{ backgroundColor: "#d9d9d97a" }}
                            disabled
                            type="text"
                            id="simpleinput"
                            {...formik.getFieldProps("address")}
                            className={clsx("form-control form-control-solid")}
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="mb-3">
                          <label
                            htmlFor="example-textarea"
                            className="form-label"
                          >
                            Company Number
                          </label>
                          <input
                            style={{ backgroundColor: "#d9d9d97a" }}
                            disabled
                            type="text"
                            id="simpleinput"
                            {...formik.getFieldProps("organizationNo")}
                            className={clsx("form-control form-control-solid")}
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="mb-3">
                          <label
                            htmlFor="example-textarea"
                            className="form-label"
                          >
                            Phone Number
                          </label>
                          <input
                            style={{ backgroundColor: "#d9d9d97a" }}
                            disabled
                            type="text"
                            id="simpleinput"
                            {...formik.getFieldProps("phone")}
                            className={clsx("form-control form-control-solid")}
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
