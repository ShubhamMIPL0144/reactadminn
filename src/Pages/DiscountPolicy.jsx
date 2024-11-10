import React, { useEffect, useState } from "react";
import Loader from "../common/Loader";
import clsx from "clsx";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import DiscountPolicyServices from "../services/discount-policy-services";
import DiscountPolicyTable from "../components/Tables/DiscountPolicyTable";

const schema = Yup.object().shape({
  amount: Yup.string().required("Amount is required").trim(),
  discount: Yup.string().required("Discount is required").trim(),
  operator: Yup.string().required("Select operator").trim(),
});

const DiscountPolicy = () => {
  const [loading, setLoading] = useState(false);
  const [apiLoad, setApiLoad] = useState(false);
  const [data, setData] = useState([]);

  const getDiscountPolicies = async () => {
    setApiLoad(true);
    try {
      let res = await DiscountPolicyServices.getDiscountPolicy();
      setData(res.data.data);
    } catch (error) {
      return error;
    } finally {
      setApiLoad(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      amount: "",
      discount: "",
      operator: "",
    },
    validationSchema: schema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      const payload = {
        amount: values.amount,
        discount: values.discount,
        opretor: values.operator,
      };
      try {
        let res = await DiscountPolicyServices.createDiscountPolicy(payload);
        if (res.data.status) {
          toast.success(res.data.message);
          resetForm();
          getDiscountPolicies();
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
    getDiscountPolicies();
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="app-head">
          <h2>Discount Policy</h2>
        </div>
        <hr />
      </div>

      <div className="row mb-3">
        <form onSubmit={formik.handleSubmit}>
          <div className="row">
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
            + Add
          </button>
        </form>
      </div>


      {apiLoad ? (
        <Loader />
      ) : (
        <div className="row">
          <DiscountPolicyTable tableData={data} />
        </div>
      )}
    </div>
  );
};

export default DiscountPolicy;
