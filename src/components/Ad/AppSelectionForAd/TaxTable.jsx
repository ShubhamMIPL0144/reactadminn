import React, { useEffect, useState } from "react";
// import AdServices from "../../../../services/ad";

const TaxTable = ({ totalRates, discount, adData, setAdData }) => {
  const [discountsValues, setDiscountsValues] = useState({
    discountPrice: 0,
    discountPerc: 0,
  });
  const [taxData] = useState({
    desc: "VAT",
    value: "25%",
  });

  // const getTaxHandler = async () => {
  //   try {
  //     let res = await AdServices.getTax();
  //     setTaxData(res.data.data[0]);
  //   } catch (error) {
  //     return error;
  //   }
  // };

  let totalPrice = totalRates?.total;
  let calculatedDiscount = (discountsValues?.discountPerc / 100) * totalPrice;
  let priceAfterDiscount = totalPrice - calculatedDiscount || 0;
  let calculatedTax = priceAfterDiscount * (parseInt(taxData?.value) / 100);
  let priceAfterTaxTotal = priceAfterDiscount + calculatedTax;

  useEffect(() => {
    let totalPrice = totalRates?.total;

    if (discount.length > 0 && totalPrice > 0) {
      let discountedPrice = 0;
      let discountValue = 0;
      discount.forEach((item) => {
        let amount = parseInt(item.amount);
        if (item.operator === ">" && totalPrice > amount) {
          discountedPrice = (totalPrice * Number(item.discount)) / 100;
          discountValue = item.discount;
        } else {
          discountedPrice = totalPrice;
        }
      });
      setDiscountsValues({
        discountPrice: discountedPrice,
        discountPerc: discountValue,
      });
    }
  }, [discount, totalRates, taxData]);

  useEffect(() => {
    if (taxData) {
      let totalPrice = totalRates?.total;
      let calculatedDiscount =
        (discountsValues?.discountPerc / 100) * totalPrice;
      let priceAfterDiscount = totalPrice - calculatedDiscount;
      let calculatedTax = priceAfterDiscount * (parseInt(taxData?.value) / 100);
      let priceAfterTaxTotal = priceAfterDiscount + calculatedTax;
      setAdData({
        ...adData,
        discount: discountsValues?.discountPerc.toString(),
        DiscountAmount: Number(calculatedDiscount).toFixed(2),
        Tax: taxData?.value,
        taxPriceAddition: calculatedTax.toFixed(2),
        priceAfterTaxTotal: priceAfterTaxTotal.toFixed(2),
        totalPrice: totalPrice.toString(),
        priceBeforeTax: priceAfterDiscount.toString(),
        priceAfterDiscount: priceAfterDiscount.toString(),
      });
    }
  }, [discount, totalRates, taxData, discountsValues]);

  // useEffect(() => {
  //   getTaxHandler();
  // }, []);

  return (
    <div className="">
      <table id="demo-foo-addrow" className="table border" data-page-size="10">
        {/* Table headers */}
        {/* <thead>
                <tr>
                  <th>Amount</th>
                  <th>Discount</th>
                </tr>
              </thead> */}
        <tbody>
          <tr>
            <td>Price before tax</td>
            <td>{totalPrice?.toFixed(2)} kr</td>
          </tr>
          <tr>
            <td>Discount {discountsValues?.discountPerc}%</td>
            <td>{calculatedDiscount?.toFixed(2)} kr</td>
          </tr>
          <tr>
            <td>Price after discount</td>
            <td>{priceAfterDiscount?.toFixed(2)} kr</td>
          </tr>
          <tr>
            <td>Tax {taxData?.value}</td>
            <td>+{calculatedTax?.toFixed(2)} kr</td>
          </tr>
          <tr>
            <td className="fw-bold ">{"Price including VAT"}</td>
            <td className="fw-bold ">{priceAfterTaxTotal?.toFixed(2)} kr</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TaxTable;
