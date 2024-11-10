import React, { useState, useEffect } from "react";
import { TextEditor } from "../components/Editor/TextEditor";
import useApi from "../hooks/useApi";
import TermsPolicyServices from "../services/terms-policy-services";
import { toast } from "react-toastify";

const DataPolicy = () => {
  const { data } = useApi("/ApplicationSuperAdmin/DataPolicy");
  const [editor, setEditor] = useState("");
  const [loading, setLoading] = useState(false);
  const updatePolicyHandler = async () => {
    setLoading(true);

    let payload = {
      termMobileApp: editor,
    };

    try {
      let res = await TermsPolicyServices.updateDataPolicy(payload);
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
              <h2>Data Policy</h2>
              <TextEditor setEditor={setEditor} editor={editor} toolbarId="policyEditor" placeholder="Enter policy text" />
              <button disabled={loading} onClick={updatePolicyHandler} type="button" className="crete-btn mt-3 mb-2">Save</button>
            </div>
          </div>
        </div>

      </div>








    </div>
  )
}

export default DataPolicy