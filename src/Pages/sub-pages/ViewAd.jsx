import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import phoneImage from "../../assets/images/phone.png";
import {
  convertISOToCustomFormat,
  stringDateRangeFormate,
} from "../../helper/TimeFormate";
import AdServices from "../../services/ad-services";
import Invoice from "../../common/Invoice";

const Table = ({ adDetail }) => {
  const {
    totalprice,
    priceafterdiscount,
    discount,
    pricebeforetax,
    tax,
    taxPriceAddition,
    priceAfterTaxTotal,
  } = adDetail;
  return (
    <div className="table-responsive custom-scroll">
      <table
        id="demo-foo-addrow"
        className="table m-t-10 highlight contact-list"
        data-page-size="10"
      >
        <tbody>
          <tr>
            <td>Price before tax</td>
            <td>{Number(pricebeforetax)?.toFixed(2)} kr</td>
          </tr>
          <tr>
            <td>Discount {discount}%</td>
            <td>{0} kr</td>
          </tr>
          <tr>
            <td>Price after discount</td>
            <td>{Number(priceafterdiscount)?.toFixed(2)} Kr</td>
          </tr>
          <tr>
            <td>Tax {tax}</td>
            <td>+{taxPriceAddition} kr</td>
          </tr>
          <tr>
            <td className="fw-bold ">{"Price including VAT"}</td>
            <td className="fw-bold ">
              {Number(priceAfterTaxTotal)?.toFixed(2) ||
                Number(totalprice)?.toFixed(2)}{" "}
              kr
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const StateAndCities = ({ statesDetails }) => {
  const statesWithCities = useMemo(() => {
    const uniqueStateIds = Array.from(
      new Set(statesDetails.map((state) => state.stateId))
    );

    const result = uniqueStateIds.map((stateId) => {
      const state = statesDetails.find((state) => state.stateId === stateId);
      const cityLists = statesDetails
        .filter((city) => city.stateId === stateId)
        .map((city) => ({ cityId: city.cityId, cityName: city.cityName }));

      return {
        stateId: state.stateId,
        stateName: state.stateName,
        citylists: cityLists,
      };
    });

    return result;
  }, [statesDetails]);

  return (
    <div className="table-responsive custom-scroll">
      {/* <label className="my-0">Välj stat och stad</label> */}

      <table
        id="demo-foo-addrow"
        className="table m-t-10 highlight contact-list"
        data-page-size="10"
      >
        <thead>
          <tr>
            <th>States</th>
            <th>Cities</th>
          </tr>
        </thead>

        <tbody>
          {statesWithCities?.map((item, index) => (
            <tr key={item.stateId}>
              <td>{item.stateName}</td>
              <td>
                {item.citylists.map((city, idx) => (
                  <span key={city.cityId}>
                    {city.cityName}
                    {","}{" "}
                  </span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const SelectedApps = ({ adDetail }) => {
  const [dateRange, setDateRange] = useState([]);
  const [selectedAppsData, setSelectedAppsData] = useState([]);

  const sanitizeDates = () => {
    const startDate = new Date(adDetail.fromdate);
    const endDate = new Date(adDetail.todate);

    const datesArray = [];

    for (
      let date = startDate;
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      datesArray.push(`${month}/${day}`);
    }
    setDateRange(datesArray);
  };

  const sanitizeAppsDate = () => {
    let data = adDetail._AddDateRange.map((app) => {
      let dateArr = app.date?.map((d) => {
        const date = new Date(d);
        const formattedDate = date.toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
        });
        return formattedDate;
      });

      return { ...app, date: dateArr };
    });

    setSelectedAppsData(data);
  };

  useEffect(() => {
    sanitizeDates();
    sanitizeAppsDate();
  }, [adDetail]);

  return (
    <div className="col s12">
      <div className="card">
        <div className="">
          <div className="table-responsive custom-scroll">
            <table
              id="demo-foo-addrow"
              className="table m-t-10 highlight contact-list"
              data-page-size="10"
            >
              <thead>
                <tr>
                  <th>S.No</th>
                  <th className="">Icon</th>
                  <th>App</th>
                  {dateRange?.map((item, index) => (
                    <th key={index} className="text-center">
                      {item}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {selectedAppsData.map((app, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>

                    <td className="p-1">
                      <img
                        src={app.appIcon}
                        alt="ikon"
                        style={{
                          height: "3rem",
                          width: "3rem",
                          objectFit: "fill",
                        }}
                        className="rounded"
                      />
                    </td>
                    <td>{app.appName}</td>

                    {dateRange.map((d, dateIndex) => (
                      <td key={dateIndex} className="">
                        {app.date.includes(d) ? (
                          <div className=" d-flex align-items-center justify-content-center">
                            <input
                              className="d-flex align-items-center"
                              style={{
                                accentColor: app.date.includes(d)
                                  ? "#58D68D"
                                  : "#E74C3C",
                              }}
                              type="checkbox"
                              name=""
                              id={dateIndex}
                              disabled={app.date.includes(d) ? false : true}
                              checked={app.date.includes(d) ? true : false}
                            />
                          </div>
                        ) : (
                          <div className=" d-flex align-items-center justify-content-center">
                            <div
                              className="bg-danger"
                              style={{
                                width: "1.1rem",
                                height: "1.1rem",
                                borderRadius: "2px",
                              }}
                            ></div>
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const ViewAd = () => {
  const [adDetail, setAdDetail] = useState([]);
  const [loading, setLoading] = useState(true);
  const { state: adInfo } = useLocation();
  const { id: adId, adminAd } = useParams();
  const getAdDetailHandler = async () => {
    setLoading(true);
    try {
      let res = await AdServices.getAdDetail(adId);
      setAdDetail(res.data.data);
    } catch (error) {
      return;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAdDetailHandler();
  }, []);

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="app-head">
            <h2>View Ad</h2>
          </div>
          <hr />
        </div>
        <div className="container-fluid container-fluids">
          <div className="">
            <div id="days" className=" s12">
              {loading ? (
                <div className="loader-container my-3">
                  <i className="fa fa-spinner fa-spin"></i>
                </div>
              ) : (
                <>
                  {!adminAd && (
                    <div className="row d-flex justify-content-end">
                  
                      <div className="col-8 d-flex justify-content-end">
                        <Invoice
                          invoice={adDetail}
                          userData={adInfo?.userInfodetails}
                        />
                      </div>
                    </div>
                  )}

<div className="row">
<div className="col-md-12">
                        {/* <h4 > */}
                        <label className="">
                          Customer Email:{" "}
                          <Link
                            className="text-primary"
                            to={`/customer-profile/${adInfo.userInfodetails.id}`}
                          >
                            {adInfo?.userInfodetails?.email}
                          </Link>
                        </label>
                        {/* </h4> */}
                      </div>
<div className="col-md-12">
                      <label className="">Customer Name: <span> {adInfo?.userInfodetails?.name}</span>

                      </label>
                   
                    </div>
                    <div className="col-md-12">
                      <label className="">Customer No: <span> {adInfo?.userInfodetails?.id}</span>

                      </label>
                   
                    </div>
                    <div className="col-md-12">
                      <label className="">Invoice No: <span> {adDetail?.invoiceNo}</span>

                      </label>
                   
                    </div>
                    </div>
                  <div className="row">
                    <div className="col-md-12">
                      <label className="">Date: <span> {stringDateRangeFormate(
                          convertISOToCustomFormat(adDetail.fromdate) +
                            " - " +
                            convertISOToCustomFormat(adDetail.todate)
                        )}</span></label>
                    
                    </div>

                    {adDetail.link && (
                      <div className="col-md-9 my-2">
                        <label className="">Ad Link</label>
                        <p className="m-0 pt-1 border-2 border-bottom">
                          {adDetail.link}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <div className="card mt-2 mb-0">
                        <div className="card-content">
                          <StateAndCities
                            statesDetails={adDetail._CityStateDetails}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="input-field col s12 m6 l6">
                      <div className="col-xs-12 col-sm-12 col s12 ">
                        <div className="image-overlay-container">
                          <div className="image-frame-photo">
                            <img
                              src={phoneImage}
                              alt="Mobile Frame"
                              className="frame"
                              style={{ width: "200px" }}
                            />

                            {adDetail?.photoPath.length > 0 ? (
                              <img
                                className="overlay"
                                src={adDetail.photoPath}
                                alt="user"
                                // className="form-img"
                              />
                            ) : (
                              <iframe
                                className="overlay"
                                // width="300"
                                // height="200"
                                src={adDetail.videoPath}
                                title="Video"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                frameBorder={0}
                                allowFullScreen
                              ></iframe>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col s12">
                      {/* <h6>Price Table</h6> */}
                      <div className="card mt-3">
                        <div className="card-content">
                          <Table adDetail={adDetail} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <SelectedApps adDetail={adDetail} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewAd;
