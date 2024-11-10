import React from "react";
import { Modal } from "react-bootstrap";
import OtpInput from "react-otp-input";

const OTPVerification = ({
  showVerificationModal,
  closeVerificationModal,
  verifyCodeHandler,
  otp,
  setOtp,
  loadingOtp,
  title,
  description,
}) => {

  const handleOtpChange = (otp) => {
    setOtp({...otp,otpCode:otp});
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      verifyCodeHandler();
    }
  };

  return (
    <Modal show={showVerificationModal} centered>
      <Modal.Body>
        <div className="mb-10 mt-7">
          <div className="">
            <h3 className="mb-2">{title}</h3>
            <hr className="mb-2"/>
            <label className="fw-bolder text-dark fs-5 mb-2">
              {description}
            </label>
            <div className="position-relative">
              <div className="input-group form-border">
                <OtpInput
                  value={otp.otpCode}
                  onChange={handleOtpChange}
                  numInputs={4}
                  inputType="tel"
                  // isInputNum={true}
                  shouldAutoFocus={true}
                  renderSeparator={<span>-</span>}
                  renderInput={(props) => <input {...props}   onKeyDown={handleKeyPress} onPaste={(e)=>e.preventDefault()}/>}
                  inputStyle={{
                    width: "4rem",
                    height: "3.7rem",
                    margin: "0 0.5rem",
                    fontSize: "2rem",
                    borderRadius: "7px",
                    padding:"5px 10px",
                    border: "1px solid rgba(0,0,0,0.3)"
              
                  }}
                  containerStyle={{
                    justifyContent: "center",
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "1rem",
                    width:"100%",
                  }}
                
                />
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="d-flex justify-content-center">
          <button
            className="btn btn-secondary"
            onClick={closeVerificationModal}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary mx-1"
            onClick={verifyCodeHandler}
            disabled={loadingOtp}
          >
            {loadingOtp ? "Verifying..." : "Submit"}
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default OTPVerification;
