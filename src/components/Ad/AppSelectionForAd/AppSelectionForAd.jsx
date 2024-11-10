import React, { useState, useEffect } from "react";
import AppsTable from "./AppsTable";
import DiscountTable from "./DiscountTable";
import PriceTable from "./PriceTable";
import TaxTable from "./TaxTable";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import AdServices from "../../../services/ad-services";
import DiscountPolicyServices from "../../../services/discount-policy-services";

const AppSelectionForAd = ({
  adData,
  setAdData,
  state,
  dispatch
}) => {

  const [submitLoading, setSubmitLoading] = useState(false);
  const [discount, setDiscount] = useState([]);

  const [dataForCalculation, setDataForCalculation] = useState({
    registeredUsers: 0,
    unRegisteredUsers: 0,
    rateRegisteredUsers: 0,
    rateUnregisteredUsers: 0,
    totalDays: 0,
  });

  const [totalRates, setTotalRates] = useState({
    registeredUsersTotalPrice: 0,
    unRegisteredUsersTotalPrice: 0,
    total: 0,
    discount: "0%",
  });

  const { auth } = useSelector((state) => state.auth);

  const { id } = auth.data;

  const navigate = useNavigate();

  const getDiscountPolicies = async () => {
    try {
      let res = await DiscountPolicyServices.getDiscountPolicy();
      setDiscount(res.data.data);
    } catch (error) {
      return error;
    }
  };

 
  const sanitizeSelectedApps = () => {
    const selectedAppsByDate = adData.selectedAppsByDate.map((item) => ({
      applicationId: item.applicationId,
      Date: item.date.split("T")[0],
    }));
    return selectedAppsByDate;
  };

  const handleCreateAd = async () => {
    if (adData.states.length === 0) {
      toast.warn("Välj städer från staterna!");
      return;
    }
    if (adData.videoToUpload === null && adData.photoToUpload === null) {
      toast.warn("Lägg till foto/video för annons.");
      return;
    }
    
    if (adData.selectedAppsByDate.length === 0) {
      toast.warn("Välj applikation tillgängliga dagar för annons!");
      return;
    }
    setSubmitLoading(true);
    const formData = new FormData();

    formData.append("States", JSON.stringify(adData.states));
    formData.append("adLink", adData.adLink);
    formData.append("photo", adData.photoToUpload);
    formData.append("video", adData.videoToUpload);
    formData.append(
      "selectedAppsByDate",
      JSON.stringify(sanitizeSelectedApps())
    );
    formData.append("Fromdate", adData.Fromdate);
    formData.append("Todate", adData.Todate);
    formData.append(
      "registeredUsersTotalPrice",
      adData.registeredUsersTotalPrice
    );
    formData.append(
      "unRegisteredUsersTotalPrice",
      adData.unRegisteredUsersTotalPrice
    );
    formData.append("totalPrice", adData.totalPrice);
    formData.append("priceBeforeTax", adData.priceBeforeTax);
    formData.append("discount", adData.discount);
    formData.append("priceAfterDiscount", adData.priceAfterDiscount);
    formData.append("Tax", adData.Tax);
    formData.append("taxPriceAddition", adData.taxPriceAddition);
    formData.append("priceAfterTaxTotal", adData.priceAfterTaxTotal);
    formData.append("DiscountAmount", adData.DiscountAmount);
    formData.append("CreatedBy", id);

    try {
      let res = await AdServices.createAd(formData);
      if (res.data.status) {
  
        toast.success("Annons publicerad!");
        setAdData({
          states: [],
          adLink: "",
          videoToUpload: null,
          photoToUpload: null,
          selectedAppsByDate: [],
          Fromdate: "",
          Todate: "",
          registeredUsersTotalPrice: "",
          unRegisteredUsersTotalPrice: "",
          totalPrice: "",
          priceBeforeTax: "",
          discount: "",
          DiscountAmount: "",
          priceAfterDiscount: "",
          Tax: "",
          taxPriceAddition: "",
          priceAfterTaxTotal: "",
        });
          navigate("/ad");
      }
    } catch (error) {
      toast.error("Något gick fel.");
      return error;
    } finally {
      setSubmitLoading(false);
    }
  };

  useEffect(() => {
    getDiscountPolicies();
  }, []);

  useEffect(() => {
    const registeredUsersTotalPrice =
      parseInt(dataForCalculation.registeredUsers) *
      parseFloat(dataForCalculation.rateRegisteredUsers) *
      dataForCalculation.totalDays;

    const unRegisteredUsersTotalPrice =
      parseInt(dataForCalculation.unRegisteredUsers) *
      parseFloat(dataForCalculation.rateUnregisteredUsers) *
      dataForCalculation.totalDays;
    const total = registeredUsersTotalPrice + unRegisteredUsersTotalPrice;

    setTotalRates({
      registeredUsersTotalPrice,
      unRegisteredUsersTotalPrice,
      total,
    });

    setAdData({
      ...adData,
      registeredUsersTotalPrice: registeredUsersTotalPrice.toString(),
      unRegisteredUsersTotalPrice: unRegisteredUsersTotalPrice.toString(),
      totalPrice: total.toString(),
      priceBeforeTax: total.toString(),
        Fromdate: new Date().toLocaleDateString('en-US'),
        Todate: new Date().toLocaleDateString('en-US'),
    });
  }, [dataForCalculation]);

  return (
    <>
      <div id="upload" className=" s12">
        <div className="px-3 py-2">
          <div className="row d-flex justify-content-between">
            <div className="col-9 d-flex align-items-center">
              <h5>Select Apps for Ad</h5>
            </div>
            <div className="col-3 d-flex justify-content-end">
              <div className="my-1 d-flex justify-content-between">
                <DiscountTable discount={discount} />
                <div>

                <button
                  type="button"
                  className="btn btn-primary text-center"
                  onClick={handleCreateAd}
                  disabled={submitLoading}
                  style={{height: "2.4rem",
                    width: "10rem"}}
                  >
                 Submit
                </button>
                  </div>
              </div>

              
            </div>
          </div>

          <div className="row">
            <div className="col-md-8">
              <PriceTable
                dataForCalculation={dataForCalculation}
                totalRates={totalRates}
              />
            </div>

            <div className="col-md-4">
              <TaxTable
                totalRates={totalRates}
                discount={discount}
                setTotalRates={setTotalRates}
                setAdData={setAdData}
                adData={adData}
              />
           
            </div>
          </div>
          <hr className="m-0"/>
          <div className="row">
            <AppsTable
            dispatch={dispatch}
            state={state}
              loading={false}
              setAdData={setAdData}
              adData={adData}
              setDataForCalculation={setDataForCalculation}
              dataForCalculation={dataForCalculation}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(AppSelectionForAd);
