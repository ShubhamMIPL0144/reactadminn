import React, { useState } from "react";
import clsx from "clsx";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import DiscountPolicyServices from "../../services/discount-policy-services";


const schema = Yup.object().shape({
    amount: Yup.string().required("Amount is required").trim(),
    discount: Yup.string().required("Discount is required").trim(),
    operator: Yup.string().required("Select operator").trim(),
  });
  
const UpdateDiscountPolicy = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const {id,operator,discount,amount} = location?.state
  const formik = useFormik({
    initialValues: {
        amount: amount||"",
        discount: discount||"",
        operator: operator||"",
      },
    validationSchema: schema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      const payload = {
        id,
        amount: values.amount,
        discount: values.discount,
        opretor: values.operator,
      };

      try {
        let res = await DiscountPolicyServices.updateDiscountPolicy(payload);
        if (res.data.status) {
          toast.success(res.data.message);
          resetForm();
          navigate(-1)
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

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="app-head">
          <h2>Update Discount Policy</h2>
        </div>
        <hr />
      </div>

        <div className="row mb-3">
        <form onSubmit={formik.handleSubmit}>
          <div className="row">
            <div className="col-md-4">
              <div className="mb-3">
                <label htmlFor="simpleinput" className="form-label">
                  Amount
                </label>
                <input
                  type="text"
                  {...formik.getFieldProps("amount")}
                  className={clsx(
                    "form-control form-control-solid",
                    {
                      "is-invalid":
                        formik.touched.amount && formik.errors.amount,
                    },
                    {
                      "is-valid":
                        formik.touched.amount && !formik.errors.amount,
                    }
                  )}
                />
                {formik.touched.amount && formik.errors.amount && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      <span role="alert" className="text-danger">
                        {formik.errors.amount}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="col-md-4">
              <div className="mb-3">
                <label htmlFor="simpleinput" className="form-label">
                  Select Operator
                </label>
                <select
                  {...formik.getFieldProps("operator")}
                  className={clsx(
                    "form-control form-control-solid",
                    {
                      "is-invalid":
                        formik.touched.operator && formik.errors.operator,
                    },
                    {
                      "is-valid":
                        formik.touched.operator && !formik.errors.operator,
                    }
                  )}
                >
                  <option value="">Select</option>
                  <option value="=">{"(=)"} Equal to Amount</option>
                  <option value=">">{"(>)"} Greater than Amount</option>
                  <option value="<">{"(<)"} Less than Amount</option>
                </select>
                {formik.touched.operator && formik.errors.operator && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      <span role="alert" className="text-danger">
                        {formik.errors.operator}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Discount</label>
                <input
                  type="text"
                  {...formik.getFieldProps("discount")}
                  className={clsx(
                    "form-control form-control-solid",
                    {
                      "is-invalid":
                        formik.touched.discount && formik.errors.discount,
                    },
                    {
                      "is-valid":
                        formik.touched.discount && !formik.errors.discount,
                    }
                  )}
                />
                {formik.touched.discount && formik.errors.discount && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      <span role="alert" className="text-danger">
                        {formik.errors.discount}
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
        </div>
        
    
       </div>
)};

export default UpdateDiscountPolicy;
