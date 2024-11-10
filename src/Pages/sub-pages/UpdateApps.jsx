import React, { useEffect, useState } from "react";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import ApplicationServices from "../../services/application-service";
import { AppInfoForm } from "../../components/Forms/AppInfoForm";
import AdminInfoForm from "../../components/Forms/AdminInfoForm";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const UpdateApps = () => {
  const [appDetails, setAppDetails] = useState(null);
  const [commentsState, setCommentsState] = useState("");
  const [loading, setLoading] = useState(false)
 

  const {id:appId} = useParams()
  const getApplicationHandler = async () => {
    try {
      let res = await ApplicationServices.getApplication(appId);
      setAppDetails(res.data);
      
    } catch (error) {
      return error;
    }
  };

  const handleSubmitComments=async()=>{
    setLoading(true)
    const payload={
      id:appId,comments:commentsState
    }
    try {
      let res = await ApplicationServices.updateComments(payload);
      if(res.data.status){

        toast.success(res.data.message);
       }
        else {
        toast.error(res.data.message);
         
        }
    } catch (error) {
      return error
    }finally{
      setTimeout(() => {
        setLoading(false)
      }, 3000);
    }
  }

 
  useEffect(() => {
    getApplicationHandler();
        //eslint-disable-next-line
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="app-head">
          <h2>Update App</h2>
        </div>
        <hr />
      </div>

      <Tab.Container id="left-tabs-example" defaultActiveKey="first" transition>
        <div className="row">
          <div className="col-md-12 text-center">
            <Nav variant="pills" className="flex-row bg-white">
              <Nav.Item className="col-md-4">
                <Nav.Link eventKey="first" className="p-3 fs-5">
                  App info
                </Nav.Link>
              </Nav.Item>
              <Nav.Item className="col-md-4">
                <Nav.Link eventKey="second" className="p-3 fs-5">
                  Admin Info
                </Nav.Link>
              </Nav.Item>
              <Nav.Item className="col-md-4">
                <Nav.Link eventKey="third" className="p-3 fs-5">
                  Comments
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </div>
          <div className="col-md-12">
            <Tab.Content>
              <Tab.Pane eventKey="first">
                <AppInfoForm appDetails={appDetails} setLoading={setLoading} setAppDetails={setAppDetails} loading={setLoading}/>
              </Tab.Pane>
              <Tab.Pane eventKey="second">
                <AdminInfoForm appDetails={appDetails} setLoading={setLoading} loading={setLoading}/>
              </Tab.Pane>
              <Tab.Pane eventKey="third">
                <div className="mb-3">
                  <label htmlFor="example-textarea" className="form-label">
                    Comments
                  </label>
                  <textarea
                    className="form-control"
                    id="example-textarea"
                    rows="10"
                    value={commentsState}
                    onChange={(e)=>setCommentsState(e.target.value)}
                  ></textarea>
                  <div className="d-flex justify-content-center">
                    <button disabled={loading}  className="crete-btn rounded my-2" onClick={handleSubmitComments}>Update</button>
                  </div>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </div>
        </div>
      </Tab.Container>
    </div>
  );
};

export default UpdateApps;
