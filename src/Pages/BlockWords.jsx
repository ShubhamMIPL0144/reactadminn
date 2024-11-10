import React, { useState, useEffect } from "react";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";
import useApi from "../hooks/useApi";
import { toast } from "react-toastify";
import TermsPolicyServices from "../services/terms-policy-services";
import Loader from "../common/Loader";

const BlockWords = () => {
  const { data,loading:loadingData } = useApi("/ApplicationSuperAdmin/GetBlockWords");
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const updateBlockWordsHandler = async () => {
    setLoading(true);
    let payload = {
      words: tags.length===0?[""]:tags,
    };

    try {
      let res = await TermsPolicyServices.updateBlockWords(payload);
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
    if(data){
      if(Array.isArray(data.data) && data.data.length === 1 && data.data[0] === ""){
        setTags([])
      }else{

        setTags(data.data);
      }
    }
  }, [data]);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="app-head">
          <h2>Block Words</h2>
        </div>
        <hr />
      </div>

      {
        loadingData?<Loader/>:<>
      <div>
        <div className="col-md-12 block-word">
          <label>Words</label>
          <TagsInput value={tags} onChange={setTags} />
        </div>
      </div>
      <button
        type="button"
        disabled={loading}
        onClick={updateBlockWordsHandler}
        className="crete-btn mt-3 mb-2"
      >
        Save
      </button>
        </>
      }

    </div>
  );
};

export default BlockWords;
