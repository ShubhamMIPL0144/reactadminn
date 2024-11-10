import React, { useMemo } from "react";

const PriceTable = ({dataForCalculation,totalRates}) => {
  const calculatedData = useMemo(() => dataForCalculation, [dataForCalculation])
  const rates = useMemo(() => totalRates, [totalRates])
    return (
     
            <div className="border">
              <table
                id="demo-foo-addrow"
                className="table "
                data-page-size="10"
              >
               
                <tbody>
                  <tr>
                    <td className="text-center p-1 py-2 fw-bold"></td>
                    <td className="text-center p-1 py-2 fw-bold"></td>
                    <td className="text-center p-1 py-2 fw-bold">Price per user/day</td>
                    <td className="text-center p-1 py-2 fw-bold">Total number of days</td>
                    <td className="text-center p-1 py-2 fw-bold">Price</td>
                  </tr>
                 
                  <tr>
                    <td  className="text-center p-1 py-2 fw-bold">Registered Users</td>
                    <td className="text-center p-1 py-2">{calculatedData.registeredUsers}</td>
                    <td className="text-center p-1 py-2">{calculatedData.rateRegisteredUsers} kr</td>
                    <td className="text-center p-1 py-2">{calculatedData.totalDays}</td>
                    <td className="text-center p-1 py-2">{rates.registeredUsersTotalPrice?.toFixed(2)} Kr</td>
                  </tr>
                  
                  <tr>
                    <td  className="text-center p-1 py-2 fw-bold">Unregistered Users</td>
                    <td className="text-center p-1 py-2">{calculatedData.unRegisteredUsers}</td>
                    <td className="text-center p-1 py-2">{calculatedData.rateUnregisteredUsers} kr</td>
                    <td className="text-center p-1 py-2">{calculatedData.totalDays}</td>
                    <td className="text-center p-1 py-2">{rates.unRegisteredUsersTotalPrice?.toFixed(2)} kr</td>
                  </tr>   
                  <tr>
                 
                    <td className="text-center p-1 py-2"></td>
                    <td className="text-center p-1 py-2"></td>
                    <td className="text-center p-1 py-2"></td>
                    <td className="text-center p-1 py-2 fw-bold">Total Amount</td>
                    <td className="text-center p-1 py-2 fw-bold border-bottom">{rates.total?.toFixed(2)} kr</td>
                  </tr>
                  
  
                  
                </tbody>
              </table>
            </div>
    );
  };
  
  export default React.memo(PriceTable);
  