import React, { useEffect, useState } from "react";
import clsx from "clsx";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import Loader from "../../common/Loader";
import AppStatusTable from "../../components/Tables/AppStatusTable";
import StatusServices from "../../services/status-services";

const statusSchema = Yup.object().shape({
  status: Yup.string().required("Status is required").trim(),
  priority: Yup.string().required("Priority is required").trim(),
});


const CreateAppStatus = () => {
  const [loading, setLoading] = useState(false);
  const [apiLoad, setApiLoad] = useState(false);
  const [data, setData] = useState([])

  const getStatus = async () => {
    setApiLoad(true)
    try {
      let res = await StatusServices.getAppStatus()
      setData(res.data.data);
    } catch (error) {
      return error
    } finally {
      setApiLoad(false)
    }
  }


  const formik = useFormik({
    initialValues: {
      status: "",
      priority: "",
    },
    validationSchema: statusSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      let payload = {
        statusName: values.status,
        priority: Number(values.priority)

      };

      try {
        let res = await StatusServices.createAppStatus(payload);
        if (res.data.status) {
          toast.success(res.data.message);
          resetForm();
          getStatus()
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        return error;
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    getStatus()
  }, [])


  return (
    <>
      {apiLoad ? (
        <Loader />
      ) : (
        <>
          <div className="row mb-3">
            <form onSubmit={formik.handleSubmit}>
              <div className="row">
                <div className="col-md-4">
                  <div className="mb-3">
                    <label
                      htmlFor="simpleinput"
                      className="form-label"
                    >
                      Status
                    </label>
                    <input
                      type="text"
                      {...formik.getFieldProps("status")}
                      className={clsx(
                        "form-control form-control-solid",
                        {
                          "is-invalid":
                            formik.touched.status &&
                            formik.errors.status,
                        },
                        {
                          "is-valid":
                            formik.touched.status &&
                            !formik.errors.status,
                        }
                      )}
                    />
                    {formik.touched.status &&
                      formik.errors.status && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            <span
                              role="alert"
                              className="text-danger"
                            >
                              {formik.errors.status}
                            </span>
                          </div>
                        </div>
                      )}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="mb-3">
                    <label
                      htmlFor="example-textarea"
                      className="form-label"
                    >
                      Priority
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      {...formik.getFieldProps("priority")}
                      className={clsx(
                        "form-control form-control-solid",
                        {
                          "is-invalid":
                            formik.touched.priority &&
                            formik.errors.priority,
                        },
                        {
                          "is-valid":
                            formik.touched.priority &&
                            !formik.errors.priority,
                        }
                      )}
                    />
                    {formik.touched.priority &&
                      formik.errors.priority && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            <span
                              role="alert"
                              className="text-danger"
                            >
                              {formik.errors.priority}
                            </span>
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </div>

              <button
                className="crete-btn"
                type="submit"
                disabled={loading}
              >
                Add
              </button>
            </form>
          </div>
          <hr />

          <div className="row">
            <AppStatusTable tableData={data} />
          </div>
        </>
      )}
    </>

  )
};

export default CreateAppStatus;
