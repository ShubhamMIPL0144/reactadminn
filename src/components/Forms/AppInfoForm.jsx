import React,{useEffect, useState} from "react";
import clsx from "clsx";
import * as Yup from "yup";
import { useFormik } from "formik";
import ApplicationServices from "../../services/application-service";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Select from "react-select";
import Steric from "../../common/Steric";
import AdServices from "../../services/ad-services";

const appSchema = Yup.object().shape({
  appCode: Yup.string()
    .required("Please Enter Code (The app code is unique)")
    .trim(),
  appName: Yup.string().required("Please Enter App Name").trim(),

  dataPolicy: Yup.string().trim(),
  iosLink: Yup.string()
    .required("Please add apple app store link")
    .url("The url format is not correct")
    .trim(),
  playStoreLink: Yup.string()
    .required("Please add google play store link")
    .url("The url format is not correct")
    .trim(),
});

export const AppInfoForm = ({loading,setLoading, appDetails,setAppDetails }) => {
  const{id}=useParams()
  const [states, setStates] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const stateOptions = states.map((state) => ({
    value: state.stateId,
    label: state.stateName,
  }));


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

  const formik = useFormik({
    initialValues: {
      appCode: appDetails?.appCode || "",
      appName: appDetails?.name || "",
      dataPolicy: appDetails?.termscondition || "",
      playStoreLink: appDetails?.playstorelink || "",
      iosLink: appDetails?.ioslink || "",
      userTerms: appDetails?.contact || "",
      emailInvite: appDetails?.msgContent || "",
      smsInvite: appDetails?.smscontent || "",
      forgotPasswordText: appDetails?.foodpdfname || "",
      allowAds: appDetails?.isAllowedforAd|| false,
      selectedStates: [],
    },
    validationSchema: appSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true)
      let formattedValues;

      if (values.selectedStates) {
        formattedValues = [
          {
                  StateId:  values.selectedStates.value,
                  CityId: []
                }
                ]
      
      }   else {
        formattedValues = [{
          StateId: appDetails?._CityStateDetails?.stateid,
          CityId: [],
        }];
      }
      const formData = new FormData();
      formData.append("Id", id);
      formData.append("AppCode", values.appCode);
      formData.append("Name", values.appName);
      formData.append("Foodpdfname",values.forgotPasswordText);
      formData.append("Smscontent",values.smsInvite);
      formData.append("MsgContent",values.msgContent||"");
      formData.append("Contact",values.userTerms);
      formData.append("Termscondition",values.dataPolicy);
      formData.append("Playstorelink",values.playStoreLink);
      formData.append("Ioslink",values.iosLink);
      formData.append("IsAllowedforAd", values.allowAds);
      if (formattedValues) {
        formData.append("States", JSON.stringify(formattedValues));
      } else {
        formData.append("States", JSON.stringify([]));
      }
    
      if(selectedImage){

        formData.append("BackgroundImg",selectedImage);
      }
      try {
        let res = await ApplicationServices.updateApplicationDetails(formData);
        if(res.data.status){

          toast.success(res.data.message);
         }
          else {
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

  
  useEffect(() => {
    getStatesHandler();
  }, []);

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="row" style={{ borderBottom: "1px solid lightgray" }}>
   
        <div className="col-md-4">
          <div className="mb-3">
            <label htmlFor="simpleinput" className="form-label">
              App<Steric/>
            </label>
            <input
              type="text"
              autoComplete="off"
              {...formik.getFieldProps("appName")}
              className={clsx(
                "form-control form-control-solid",
                {
                  "is-invalid": formik.touched.appName && formik.errors.appName,
                },
                {
                  "is-valid": formik.touched.appName && !formik.errors.appName,
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
        <div className="col-md-4">
          <div className="mb-3">
            <label htmlFor="simpleinput" className="form-label">
              Code<Steric/>
            </label>
            <input
              type="text"
              autoComplete="off"
              {...formik.getFieldProps("appCode")}
              className={clsx(
                "form-control form-control-solid",
                {
                  "is-invalid": formik.touched.appCode && formik.errors.appCode,
                },
                {
                  "is-valid": formik.touched.appCode && !formik.errors.appCode,
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
          <div className="mb-3">
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
          <div className="mb-3">
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
          <div className="mb-3">
            <label htmlFor="example-textarea" className="form-label">
              Google play store link<Steric/>
            </label>
            <textarea
              rows="4"
              {...formik.getFieldProps("playStoreLink")}
              className={clsx(
                "form-control form-control-solid",
                {
                  "is-invalid":
                    formik.touched.playStoreLink && formik.errors.playStoreLink,
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
          <div className="mb-3">
            <label htmlFor="example-textarea" className="form-label">
              Apple app store link<Steric/>
            </label>
            <textarea
              rows="8"
              {...formik.getFieldProps("iosLink")}
              className={clsx(
                "form-control form-control-solid",
                {
                  "is-invalid": formik.touched.iosLink && formik.errors.iosLink,
                },
                {
                  "is-valid": formik.touched.iosLink && !formik.errors.iosLink,
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
          <div className="mb-3">
            <label htmlFor="example-textarea" className="form-label">
              Email invite
            </label>
            <textarea
              rows="8"
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
          <div className="mb-3">
            <label htmlFor="example-textarea" className="form-label">
              Sms invite
            </label>
            <textarea
              rows="8"
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
          <div className="mb-3">
            <label htmlFor="example-textarea" className="form-label">
              Forgot Password Text
            </label>
            <textarea
              rows="8"
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
                  name="state"
                  options={stateOptions}
                  
                  value={
                    formik.values.selectedStates.length > 0
                      ? formik.values.selectedStates
                      : appDetails?._CityStateDetails?.map((item) => ({
                          value: item.stateid,
                          label: item.statename,
                        }))
                  }
                  // value={formik.values.selectedStates}
                  onChange={(selectedOptions) => {
                    setAppDetails({ ...appDetails, _CityStateDetails: null });
                    formik.setFieldValue("selectedStates", selectedOptions);
                  }}
                />

              
            </div>
          </div>

          <div className="col-md-4">
            <div className="">
              <label htmlFor="allowAds" className="form-label">
                Enable Advertisement
              </label>
            </div>
            <input name="allowAds" id="allowAds" type="checkbox" checked={formik.values.allowAds} {...formik.getFieldProps("allowAds")} />
          
          </div>


        <div className="col-md-4">
          <div className="mb-3">
            <label htmlFor="imageUpload" className="form-label">
            Recommended Image resolution (430x230 pixels)<Steric/>
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
            
             {!selectedImage && appDetails?.backgroundImage.length>0 && (
              <div className="mt-3">
                <img
                  src={appDetails?.backgroundImage}
                  alt="app background"
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

        <div className="d-flex justify-content-center">
          <button className="crete-btn rounded my-2" type="submit" disabled={loading}>
            Update
          </button>
        </div>
      </div>
    </form>
  );
};
