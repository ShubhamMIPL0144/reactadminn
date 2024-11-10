import React, { useEffect, useRef, useState } from "react";
import "../assets/css/app.min.css";
import "../assets/css/icons.min.css";
import "../assets/css/style.css";
import { useSelector } from 'react-redux'
// import user1 from "../assets/images/users/user-1.jpg";
// import user4 from "../assets/images/users/user-4.jpg";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import SignoutModal from "../components/Modals/SignoutModal";

const Dashboard = () => {
  const location = useLocation();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const { auth } = useSelector((state) => state.auth);
  const { email } = auth?.data
  const [show, setShow] = useState(false);
  const dropdownRef = useRef(null);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      closeDropdown();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
    //eslint-disable-next-line
  }, []);






  return (
    <>
      <SignoutModal show={show} handleClose={handleClose} />
      <div
        className=""
        data-layout-color="light"
        data-layout-mode="default"
        data-layout-size="fluid"
        data-topbar-color="light"
        data-leftbar-position="fixed"
        data-leftbar-color="light"
        data-leftbar-size="default"
        data-sidebar-user="true"
      >
        <div id="wrapper">
          <div className="navbar-custom">
            <ul className="list-unstyled topnav-menu float-end mb-0">


              <li className="dropdown d-inline-block d-lg-none">
                <a
                  className="nav-link dropdown-toggle arrow-none waves-effect waves-light"
                  data-bs-toggle="dropdown"
                  href="#"
                  role="button"
                  aria-haspopup="false"
                  aria-expanded="false"
                >
                  <i className="fe-search noti-icon"></i>
                </a>
                <div className="dropdown-menu dropdown-lg dropdown-menu-end p-0">
                  <form className="p-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search ..."
                      aria-label="Recipient's username"
                    />
                  </form>
                </div>
              </li>

              {/* <li className="dropdown notification-list topbar-dropdown">
                <a
                  className="nav-link dropdown-toggle waves-effect waves-light"
                  data-bs-toggle="dropdown"
                  href="#"
                  role="button"
                  aria-haspopup="false"
                  aria-expanded="false"
                >
                  <i className="fe-bell noti-icon"></i>
                  <span className="badge bg-danger rounded-circle noti-icon-badge">
                    9
                  </span>
                </a>
                <div className="dropdown-menu dropdown-menu-end dropdown-lg">
                  <div className="dropdown-item noti-title">
                    <h5 className="m-0">
                      <span className="float-end">
                        <a href="" className="text-dark">
                          <small>Clear All</small>
                        </a>
                      </span>
                      Notification
                    </h5>
                  </div>

                  <div className="noti-scroll" data-simplebar>
                    <a
                      href="#"
                      className="dropdown-item notify-item active"
                    >
                      <div className="notify-icon">
                        <img
                          src={user1}
                          className="img-fluid rounded-circle"
                          alt=""
                        />{" "}
                      </div>
                      <p className="notify-details">Cristina Pride</p>
                      <p className="text-muted mb-0 user-msg">
                        <small>
                          Hi, How are you? What about our next meeting
                        </small>
                      </p>
                    </a>

                    <a
                      href="javascript:void(0);"
                      className="dropdown-item notify-item"
                    >
                      <div className="notify-icon bg-primary">
                        <i className="mdi mdi-comment-account-outline"></i>
                      </div>
                      <p className="notify-details">
                        Caleb Flakelar commented on Admin
                        <small className="text-muted">1 min ago</small>
                      </p>
                    </a>

                    <a
                      href="#"
                      className="dropdown-item notify-item"
                    >
                      <div className="notify-icon">
                        <img
                          src={user4}
                          className="img-fluid rounded-circle"
                          alt=""
                        />{" "}
                      </div>
                      <p className="notify-details">Karen Robinson</p>
                      <p className="text-muted mb-0 user-msg">
                        <small>
                          Wow ! this admin looks good and awesome design
                        </small>
                      </p>
                    </a>

                    <a
                      href="#"
                      className="dropdown-item notify-item"
                    >
                      <div className="notify-icon bg-warning">
                        <i className="mdi mdi-account-plus"></i>
                      </div>
                      <p className="notify-details">
                        New user registered.
                        <small className="text-muted">5 hours ago</small>
                      </p>
                    </a>

                    <a
                      href="javascript:void(0);"
                      className="dropdown-item notify-item"
                    >
                      <div className="notify-icon bg-info">
                        <i className="mdi mdi-comment-account-outline"></i>
                      </div>
                      <p className="notify-details">
                        Caleb Flakelar commented on Admin
                        <small className="text-muted">4 days ago</small>
                      </p>
                    </a>

                    <a href="#" className="dropdown-item notify-item">
                      <div className="notify-icon bg-secondary">
                        <i className="mdi mdi-heart"></i>
                      </div>
                      <p className="notify-details">
                        Carlos Crouch liked
                        <b>Admin</b>
                        <small className="text-muted">13 days ago</small>
                      </p>
                    </a>
                  </div>

                  <a
                    href="#"
                    className="dropdown-item text-center text-primary notify-item notify-all"
                  >
                    View all
                    <i className="fe-arrow-right"></i>
                  </a>
                </div>
              </li> */}

              <li
                className="dropdown dropdown-toggle notification-list topbar-dropdown"
                onClick={toggleDropdown}
                ref={dropdownRef}

                data-bs-toggle="dropdown"
              >
                <span
                  className="nav-link dropdown-toggle nav-user me-0 waves-effect waves-light"
                  data-bs-toggle="dropdown"
                  role="button"
                  aria-haspopup="false"
                  aria-expanded="false"
                >
                  {/* <img
                    src={user1}
                    alt="user"
                    className="rounded-circle"
                  /> */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="50" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                  </svg>

                  {isDropdownOpen ? (
                    <span className="pro-user-name ms-1">
                      {email} <i className="mdi mdi-chevron-up"></i>
                    </span>
                  ) : (
                    <span className="pro-user-name ms-1">
                      {email} <i className="mdi mdi-chevron-down"></i>
                    </span>
                  )}
                </span>
                <Dropdown.Menu

                  show={isDropdownOpen}
                  className="dropdown-menu dropdown-menu-end profile-dropdown"


                >
                  <Dropdown.Item eventKey="1">
                    <Link to="profile" className="dropdown-item">
                      <i className="fe-user"></i>
                      <span>My Account</span>
                    </Link>
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="2">
                    <Link to="/change-password" className="dropdown-item">
                      <i className="fe-lock"></i>
                      <span>Change Password</span>
                    </Link>
                  </Dropdown.Item>


                  <Dropdown.Item eventKey="3">
                    <span onClick={handleShow} className="dropdown-item">
                      <i className="fe-log-out"></i>
                      <span>Logout</span>
                    </span>
                  </Dropdown.Item>
                </Dropdown.Menu>

                {/*                  
                  {isDropdownOpen && (
                    <>
                      <a href="contacts-profile.html" className="dropdown-item">
                        <i className="fe-user"></i>
                        <span>My Account</span>
                      </a>

                      <a href="auth-lock-screen.html" className="dropdown-item">
                        <i className="fe-lock"></i>
                        <span>Lock Screen</span>
                      </a>

                      <div className="dropdown-divider"></div>

                      <a href="auth-logout.html" className="dropdown-item">
                        <i className="fe-log-out"></i>
                        <span>Logout</span>
                      </a>
                    </>
                  )} */}
              </li>

              {/* <li className="dropdown notification-list">
                <a
                  href="javascript:void(0);"
                  className="nav-link right-bar-toggle waves-effect waves-light"
                >
                  <i className="fe-settings noti-icon"></i>
                </a>
              </li> */}
            </ul>

            <div className="logo-box">
              <Link className="logo logo-dark text-center" to={'/apps'}>
                <h2>LUSGO</h2>
              </Link>
              {   /* <hr style={{ marginTop: 15 }} /> */}
            </div>

            <ul className="list-unstyled topnav-menu topnav-menu-left mb-0">
              <li>
                <button className="button-menu-mobile disable-btn waves-effect">
                  <i className="fe-menu"></i>
                </button>
              </li>

              <li>
                <h4 className="page-title-main dashboard-c">Dashboard</h4>
              </li>
            </ul>

            <div className="clearfix"></div>
          </div>
          <div className="left-side-menu">
            <div className="h-100" data-simplebar>
              <div id="sidebar-menu">
                <ul id="side-menu">
                  <li>
                    <Link
                      to="app-request"
                      className={
                        location.pathname.includes("/app-request")
                          ? "custom-nav-active"
                          : ""
                      }
                    >
                      <i className="fa fa-envelope"></i>
                      <span>New App Requests</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="apps"
                      className={
                        location.pathname.includes("/apps")
                          ? "custom-nav-active"
                          : ""
                      }
                    >
                      <i className="fa fa-crosshairs"></i>
                      <span> Apps </span>
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="profile"
                      className={
                        location.pathname.includes("/profile")
                          ? "custom-nav-active"
                          : ""
                      }
                    >
                      <i className="fa fa-user"></i>
                      <span> My Profile </span>
                    </Link>
                  </li>

                  {/* <li>
                    <Link
                      to="smtp"
                      className={
                        location.pathname.includes("/smtp")
                          ? "custom-nav-active"
                          : ""
                      }
                    >
                      <i className="fa fa-envelope"></i>
                      <span>SMTP Setting </span>
                    </Link>
                  </li> */}
                  <li>
                    <Link
                      to="sms"
                      className={
                        location.pathname.includes("/sms")
                          ? "custom-nav-active"
                          : ""
                      }
                    >
                      <i className="fa fa-mobile"></i>
                      <span> SMS Setting </span>
                    </Link>
                  </li>
                  {/* <li>
                    <Link
                      to="logs"
                      className={
                        location.pathname.includes("/logs")
                          ? "custom-nav-active"
                          : ""
                      }
                    >
                      <i className="fa fa-file"></i>
                      <span> Logs </span>
                    </Link>
                  </li> */}
                  <li>
                    <Link
                      to="customers"
                      className={
                        location.pathname.includes("/customers")
                          ? "custom-nav-active"
                          : ""
                      }
                    >
                      <i className="fa fa-people-arrows"></i>
                      <span> Customers </span>
                    </Link>
                  </li>
                  {/* <li>
                    <Link
                      to="tickets"
                      className={
                        location.pathname.includes("/tickets")
                          ? "custom-nav-active"
                          : ""
                      }
                    >
                      <i className="fa fa-list"></i>
                      <span> Tickets </span>
                    </Link>
                  </li>   */}
                  <li>
                    <Link
                      to="states"
                      className={
                        location.pathname.includes("/states")
                          ? "custom-nav-active"
                          : ""
                      }
                    >
                      <i className="fa fa-city"></i>
                      <span> States </span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="discount-policy"
                      className={
                        location.pathname.includes("/discount-policy")
                          ? "custom-nav-active"
                          : ""
                      }
                    >
                      <i className="fa fa-file"></i>
                      <span> Discount Policy </span>
                    </Link>
                  </li>
                  {/* <li>
                    <Link
                      to="tax-management"
                      className={
                        location.pathname.includes("/tax-management")
                          ? "custom-nav-active"
                          : ""
                      }
                    >
                      <i className="fa fa-chart-bar"></i>
                      <span> Tax Management  </span>
                    </Link>
                  </li> */}
                  <li>
                    <Link
                      to="rate"
                      className={
                        location.pathname.includes("/rate")
                          ? "custom-nav-active"
                          : ""
                      }
                    >
                      <i className="fa fa-comment-dollar"></i>
                      <span> Rates </span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="status"
                      className={
                        location.pathname.includes("/status")
                          ? "custom-nav-active"
                          : ""
                      }
                    >
                      <i className="fa fa-check"></i>
                      <span> App Status </span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="user-statistics"
                      className={
                        location.pathname.includes("/user-statistics")
                          ? "custom-nav-active"
                          : ""
                      }
                    >
                      <i className="fa fa-tasks"></i>
                      <span> User Statistics </span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="ad"
                      className={
                        location.pathname.includes("/ad")
                          ? "custom-nav-active"
                          : ""
                      }
                    >
                      <i className="fas fa-ad"></i>
                      <span> Ad </span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="block-words"
                      className={
                        location.pathname.includes("/block-words")
                          ? "custom-nav-active"
                          : ""
                      }
                    >
                      <i className="fa fa-ban"></i>
                      <span> Block Words </span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="data-policy"
                      className={
                        location.pathname.includes("/data-policy")
                          ? "custom-nav-active"
                          : ""
                      }
                    >
                      <i className="fa fa-paperclip"></i>
                      <span> Data Policy </span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="terms"
                      className={
                        location.pathname.includes("/terms")
                          ? "custom-nav-active"
                          : ""
                      }
                    >
                      <i className="fas fa-shield-alt"></i>
                      <span> Terms </span>
                    </Link>
                  </li> 
                  <li>
                    <Link
                      to="/ad-terms"
                      className={
                        location.pathname.includes("/ad-terms")
                          ? "custom-nav-active"
                          : ""
                      }
                    >
                      <i className="fa fa-file"></i>
                      <span> Ad Terms </span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="clearfix"></div>
          </div>
        </div>

        <div className="content-page">
          <div className="content">
            <Outlet />
          </div>
          <footer className="footer ">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-12 text-center">
                  <script>document.write(new Date().getFullYear())</script>{" "}
                  &copy; Lusgo media platform | All Rights Reserved
                </div>
              </div>
            </div>
          </footer>
        </div>

        <div className="right-bar">
          <div data-simplebar className="h-100">
            <div className="rightbar-title">
              <a
                href="#"
                className="right-bar-toggle float-end"
              >
                <i className="mdi mdi-close"></i>
              </a>
              <h4 className="font-16 m-0 text-white">Theme Customizer</h4>
            </div>

            <div className="tab-content pt-0">
              <div
                className="tab-pane active"
                id="settings-tab"
                role="tabpanel"
              >
                <div className="p-3">
                  <div className="alert alert-warning" role="alert">
                    <strong>Customize </strong> the overall color scheme,
                    Layout, etc.
                  </div>

                  <h6 className="fw-medium font-14 mt-4 mb-2 pb-1">
                    Color Scheme
                  </h6>
                  <div className="form-check form-switch mb-1">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="layout-color"
                      value="light"
                      id="light-mode-check"
                      checked
                    />
                    <label className="form-check-label" htmlFor="light-mode-check">
                      Light Mode
                    </label>
                  </div>

                  <div className="form-check form-switch mb-1">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="layout-color"
                      value="dark"
                      id="dark-mode-check"
                    />
                    <label className="form-check-label" htmlFor="dark-mode-check">
                      Dark Mode
                    </label>
                  </div>

                  <h6 className="fw-medium font-14 mt-4 mb-2 pb-1">Width</h6>
                  <div className="form-check form-switch mb-1">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="layout-size"
                      value="fluid"
                      id="fluid"
                      checked
                    />
                    <label className="form-check-label" htmlFor="fluid-check">
                      Fluid
                    </label>
                  </div>
                  <div className="form-check form-switch mb-1">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="layout-size"
                      value="boxed"
                      id="boxed"
                    />
                    <label className="form-check-label" htmlFor="boxed-check">
                      Boxed
                    </label>
                  </div>

                  <h6 className="fw-medium font-14 mt-4 mb-2 pb-1">
                    Menus (Leftsidebar and Topbar) Positon
                  </h6>

                  <div className="form-check form-switch mb-1">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="leftbar-position"
                      value="fixed"
                      id="fixed-check"
                      checked
                    />
                    <label className="form-check-label" htmlFor="fixed-check">
                      Fixed
                    </label>
                  </div>

                  <div className="form-check form-switch mb-1">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="leftbar-position"
                      value="scrollable"
                      id="scrollable-check"
                    />
                    <label className="form-check-label" htmlFor="scrollable-check">
                      Scrollable
                    </label>
                  </div>

                  <h6 className="fw-medium font-14 mt-4 mb-2 pb-1">
                    Left Sidebar Color
                  </h6>

                  <div className="form-check form-switch mb-1">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="leftbar-color"
                      value="light"
                      id="light"
                    />
                    <label className="form-check-label" htmlFor="light-check">
                      Light
                    </label>
                  </div>

                  <div className="form-check form-switch mb-1">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="leftbar-color"
                      value="dark"
                      id="dark"
                      checked
                    />
                    <label className="form-check-label" htmlFor="dark-check">
                      Dark
                    </label>
                  </div>

                  <div className="form-check form-switch mb-1">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="leftbar-color"
                      value="brand"
                      id="brand"
                    />
                    <label className="form-check-label" htmlFor="brand-check">
                      Brand
                    </label>
                  </div>

                  <div className="form-check form-switch mb-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="leftbar-color"
                      value="gradient"
                      id="gradient"
                    />
                    <label className="form-check-label" htmlFor="gradient-check">
                      Gradient
                    </label>
                  </div>

                  <h6 className="fw-medium font-14 mt-4 mb-2 pb-1">
                    Left Sidebar Size
                  </h6>

                  <div className="form-check form-switch mb-1">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="leftbar-size"
                      value="default"
                      id="default-size-check"
                      checked
                    />
                    <label
                      className="form-check-label"
                      htmlFor="default-size-check"
                    >
                      Default
                    </label>
                  </div>

                  <div className="form-check form-switch mb-1">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="leftbar-size"
                      value="condensed"
                      id="condensed-check"
                    />
                    <label className="form-check-label" htmlFor="condensed-check">
                      Condensed <small>(Extra Small size)</small>
                    </label>
                  </div>

                  <div className="form-check form-switch mb-1">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="leftbar-size"
                      value="compact"
                      id="compact-check"
                    />
                    <label className="form-check-label" htmlFor="compact-check">
                      Compact <small>(Small size)</small>
                    </label>
                  </div>

                  <h6 className="fw-medium font-14 mt-4 mb-2 pb-1">
                    Sidebar User Info
                  </h6>

                  <div className="form-check form-switch mb-1">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="sidebar-user"
                      value="true"
                      id="sidebaruser-check"
                    />
                    <label className="form-check-label" htmlFor="sidebaruser-check">
                      Enable
                    </label>
                  </div>

                  <h6 className="fw-medium font-14 mt-4 mb-2 pb-1">Topbar</h6>

                  <div className="form-check form-switch mb-1">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="topbar-color"
                      value="dark"
                      id="darktopbar-check"
                      checked
                    />
                    <label className="form-check-label" htmlFor="darktopbar-check">
                      Dark
                    </label>
                  </div>

                  <div className="form-check form-switch mb-1">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="topbar-color"
                      value="light"
                      id="lighttopbar-check"
                    />
                    <label className="form-check-label" htmlFor="lighttopbar-check">
                      Light
                    </label>
                  </div>

                  <div className="d-grid mt-4">
                    <button className="btn btn-primary" id="resetBtn">
                      Reset to Default
                    </button>
                    <a
                    target="_blank" without rel="noreferrer"
                      href="https://1.envato.market/admintoadmin"
                      className="btn btn-danger mt-3" s
                    >
                      <i className="mdi mdi-basket me-1"></i> Purchase Now
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rightbar-overlay"></div>

        {/* <script src="assets/libs/jquery/jquery.min.js"></script>
    <script src="assets/libs/bootstrap/js/bootstrap.bundle.min.js"></script>
    <script src="assets/libs/simplebar/simplebar.min.js"></script>
    <script src="assets/libs/node-waves/waves.min.js"></script>
    <script src="assets/libs/waypoints/lib/jquery.waypoints.min.js"></script>
    <script src="assets/libs/jquery.counterup/jquery.counterup.min.js"></script>
    <script src="assets/libs/feather-icons/feather.min.js"></script>

    <script src="assets/libs/jquery-knob/jquery.knob.min.js"></script>

    <script src="assets/libs/morris.js06/morris.min.js"></script>
    <script src="assets/libs/raphael/raphael.min.js"></script>

    <script src="assets/js/pages/dashboard.init.js"></script>

    <script src="assets/js/app.min.js"></script>

    <script src="assets/libs/datatables.net/js/jquery.dataTables.min.js"></script>
    <script src="assets/libs/datatables.net-bs5/js/dataTables.bootstrap5.min.js"></script>
    <script src="assets/libs/datatables.net-responsive/js/dataTables.responsive.min.js"></script>
    <script src="assets/libs/datatables.net-responsive-bs5/js/responsive.bootstrap5.min.js"></script>
    <script src="assets/libs/datatables.net-buttons/js/dataTables.buttons.min.js"></script>
    <script src="assets/libs/datatables.net-buttons-bs5/js/buttons.bootstrap5.min.js"></script>
    <script src="assets/libs/datatables.net-buttons/js/buttons.html5.min.js"></script>
    <script src="assets/libs/datatables.net-buttons/js/buttons.flash.min.js"></script>
    <script src="assets/libs/datatables.net-buttons/js/buttons.print.min.js"></script>
    <script src="assets/libs/datatables.net-keytable/js/dataTables.keyTable.min.js"></script>
    <script src="assets/libs/datatables.net-select/js/dataTables.select.min.js"></script>
    <script src="assets/libs/pdfmake/build/pdfmake.min.js"></script>
    <script src="assets/libs/pdfmake/build/vfs_fonts.js"></script>

    <script src="assets/js/pages/datatables.init.js"></script> */}
      </div>
    </>
  );
};

export default Dashboard;
