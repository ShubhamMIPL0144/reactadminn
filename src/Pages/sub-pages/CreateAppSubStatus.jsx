import React, { useEffect, useState } from "react";
import clsx from "clsx";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import Loader from "../../common/Loader";
import AppSubStatusTable from "../../components/Tables/AppSubStatusTable";
import StatusServices from "../../services/status-services";

const schema = Yup.object().shape({
 
  checklist: Yup.string().required("Checklist is required").trim(),
});

const CreateAppSubStatus = () => {
  const [loading, setLoading] = useState(false);
  const [apiLoad, setApiLoad] = useState(false);
  const [data, setData] = useState([]);


  const getStatus = async () => {
    setApiLoad(true);
    try {
      let res = await StatusServices.getAppSubStatus();
      setData(res.data.data);
    } catch (error) {
      return error;
    } finally {
      setApiLoad(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      checklist: "",
    },
    validationSchema: schema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      let payload = {
        id:0,
        subStatusName: values.checklist,
        priority: null,
        statusId: null,
        isActive:true,
      };

      try {
        let res = await StatusServices.createAppSubStatus(payload);
        if (res.data.status) {
          toast.success(res.data.message);
          resetForm();
          getStatus();
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
    getStatus();
  }, []);

  return (
    <>
      
          <div className="row mb-3">
            <form onSubmit={formik.handleSubmit}>
              <div className="row">
             

                <div className="col-md-4">
                  <div className="mb-3">
                    <label htmlFor="example-textarea" className="form-label">
                      Checklist
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      {...formik.getFieldProps("checklist")}
                      className={clsx(
                        "form-control form-control-solid",
                        {
                          "is-invalid":
                            formik.touched.checklist && formik.errors.checklist,
                        },
                        {
                          "is-valid":
                            formik.touched.checklist &&
                            !formik.errors.checklist,
                        }
                      )}
                    />
                    {formik.touched.checklist && formik.errors.checklist && (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          <span role="alert" className="text-danger">
                            {formik.errors.checklist}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
               
              </div>

              <button className="crete-btn" type="submit" disabled={loading}>
                Add
              </button>
            </form>
          </div>
          <hr />

          {apiLoad ? (
        <Loader />
      ) : (
          <div className="row">

        
            <AppSubStatusTable tableData={data} />
          </div>
      )}
    </>
  );
};

export default CreateAppSubStatus;
