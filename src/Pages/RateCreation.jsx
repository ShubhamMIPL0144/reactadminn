import React, { useEffect, useState } from "react";
import Loader from "../common/Loader";
import clsx from "clsx";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import TaxServices from "../services/tax-services";

const schema = Yup.object().shape({
  registredUserRate: Yup.string().required("Registered user rate is required").trim(),
  unRegistredUserRate: Yup.string().required("Unregistered user rate is required").trim(),
});

const RateCreation = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const getRateHandler = async () => {
    setLoading(true);
    try {
      let res = await TaxServices.getRate();
      setData(res.data.data[0]);
    } catch (error) {
      return error;
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      registredUserRate: data?.registredUserRate|| "",
      unRegistredUserRate: data?.unRegistredUserRate||"",
    
    },
    validationSchema: schema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      // setLoading(true);
      const payload = {
        id: data?.id || 0,
        registredUserRate: values.registredUserRate,
        unRegistredUserRate: values.unRegistredUserRate,
      }
      
      try {
        let res = await TaxServices.createRate(payload);
        if (res.data.status) {
          toast.success(res.data.message);
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        return error;
      } finally {
        // setLoading(false);
      }
    },
  });

  useEffect(() => {
    getRateHandler();
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="app-head">
          <h2>User Rates</h2>
        </div>
        <hr />
      </div>

      <div className="row mb-3">
        
           {loading ? 
            <Loader /> :
        <form onSubmit={formik.handleSubmit}>
          <div className="row">
 

            <div className="col-md-4">
              <div className="mb-3">
                <label htmlFor="simpleinput" className="form-label">
                Registered User Rate
                </label>
                <input
                  type="text"
                  {...formik.getFieldProps("registredUserRate")}
                  className={clsx(
                    "form-control form-control-solid",
                    {
                      "is-invalid":
                        formik.touched.registredUserRate && formik.errors.registredUserRate,
                    },
                    {
                      "is-valid":
                        formik.touched.registredUserRate && !formik.errors.registredUserRate,
                    }
                  )}
                />
                {formik.touched.registredUserRate && formik.errors.registredUserRate && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      <span role="alert" className="text-danger">
                        {formik.errors.registredUserRate}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          
            <div className="col-md-4">
              <div className="mb-3">
                <label htmlFor="simpleinput" className="form-label">
                Unregistered User Rate
                </label>
                <input
                  type="text"
                  {...formik.getFieldProps("unRegistredUserRate")}
                  className={clsx(
                    "form-control form-control-solid",
                    {
                      "is-invalid":
                        formik.touched.unRegistredUserRate && formik.errors.unRegistredUserRate,
                    },
                    {
                      "is-valid":
                        formik.touched.unRegistredUserRate && !formik.errors.unRegistredUserRate,
                    }
                  )}
                />
                {formik.touched.unRegistredUserRate && formik.errors.unRegistredUserRate && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      <span role="alert" className="text-danger">
                        {formik.errors.unRegistredUserRate}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          
     
          </div>

          <button className="crete-btn" type="submit" disabled={loading}>
            Update
          </button>
        </form>
      }

      </div>


     
   
    </div>
  );
};

export default RateCreation;
