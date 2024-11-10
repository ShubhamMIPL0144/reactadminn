import React, { useState, useEffect } from "react";
import { TextEditor } from "../components/Editor/TextEditor";
import useApi from "../hooks/useApi";
import TermsPolicyServices from "../services/terms-policy-services";
import { toast } from "react-toastify";

const Terms = () => {
  const { data } = useApi("/ApplicationSuperAdmin/PrivacyPolicy");
  const [editor, setEditor] = useState("");
  const [loading, setLoading] = useState(false);

  const updateTermHandler = async () => {
    setLoading(true);
    let payload = {
      termMobileApp: editor,
    };

    try {
      let res = await TermsPolicyServices.updateTerms(payload);
      if (res.data.status) {
        toast.success(res.data.message);

      } else {

        toast.error(res.data.message);
      }
    } catch (error) {
      return error;
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 4000);
    }
  };
  useEffect(() => {
    setEditor(data?.data);
  }, [data]);

  return (
    <div className="container-fluid">
      <div className="data-policy-wrapper">
        <div className="row">
          <div className="col-md-12">
            <div className="data-policy">
              <h2>Terms</h2>
              <TextEditor
                setEditor={setEditor}
                editor={editor}
                toolbarId="termEditor"
                placeholder="Enter term text"
              />

              <button
                type="button"
                disabled={loading}
                onClick={updateTermHandler}
                className="crete-btn mt-3 mb-2"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
