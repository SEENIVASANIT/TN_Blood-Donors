import React from "react";
import { useEffect, useState } from "react";
import { Card, Image, Button, Grid, Feed, Modal } from "semantic-ui-react";
import { useLocation, useNavigate } from "react-router-dom";
import "../pages/All_hospital.css";
import swal from "sweetalert2";
import Blood_camps from "../components/Blood_camps";
const All_hospital = () => {
  const [hospital_records, setHospital_records] = useState([]);
  const [model_value, Set_Model_vaue] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const get_hospital_name = location.state.dis_name;
  useEffect(() => {
    //fetch(
    //`https://sheetdb.io/api/v1/fay54ry1j1nbk/search?District=${get_hospital_name}`
    // )
    fetch(
      `https://sheetdb.io/api/v1/wunjevf2jrqy4/search?District=${get_hospital_name}`
    )
      .then((response) => response.json())
      .then((data) => setHospital_records(data))
      .catch((err) =>
        swal.fire("Oops!", "Some network error so try again!!!", "error")
      );
  }, []);
  const Search_fun = async (e, searc) => {
    ///THIS IS A SEARCH VALUE FUNCTION
    var search1 = searc;
    if (search1 === "") {
      //fetch(`https://sheetdb.io/api/v1/fay54ry1j1nbk/search?District=${get_hospital_name}`)
      fetch(
        `https://sheetdb.io/api/v1/wunjevf2jrqy4/search?District=${get_hospital_name}`
      )
        .then((response) => response.json())
        .then((data) => setHospital_records(data))
        .catch((err) =>
          swal.fire("Oops!", "Some network error so tryagain!!!", "error")
        );
    }
    e.preventDefault();
    setHospital_records(
      hospital_records.filter((bolg) =>
        bolg.Hospital_name.toLowerCase().includes(search1.toLowerCase())
      )
    );
  };
  const callModel = (list) => {
    setOpen(true);
    Set_Model_vaue(list);
  };
  const how_to_add_post = () => {
    swal.fire({
      title: "<strong>How To Post Blood Camps?</strong>",
      icon: "info",
      html:
        "If your like to share blood camps in your Distric,</b> " +
        "First You Can Select On Hospital,Then login your account then comback add a post!</b>, " +
        "<br></br>" +
        "Goto login fist!",
      showCloseButton: true,
      focusConfirm: false,
      confirmButtonText: '<i class="fa fa-thumbs-up"></i> Great!',
    });
  };
  return (
    <div>
      <header>
        <nav class="navigation-menu">
          <div class="nav">
            <input type="checkbox" id="nav-check" />
            <div class="nav-header">
              <div class="nav-title">
                <div class="nav-title">
                  <div className="animate__animated animate__slideInLeft site_logo_div">
                    <p>
                      T<p>N</p>
                    </p>
                    <span>Blood Donors</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="nav-btn">
              <label htmlFor="nav-check">
                <span></span>
                <span></span>
                <span></span>
              </label>
            </div>
            <div class="nav-links">
              <a onClick={() => setOpen2(true)}>
                <div id="notification_camp">
                  <div>Announcement</div>
                  <i
                    class="fa-solid fa-bell fa-shake"
                    style={{ color: "#fc0303" }}
                  ></i>
                </div>
              </a>
              <a href="/">Home</a>
              <a href="/About">About</a>
              <a onClick={() => how_to_add_post()}>How-To-Add-Post?</a>
            </div>
          </div>
          {open2 && (
            <Blood_camps
              open={open2}
              setOpen={setOpen2}
              District={get_hospital_name}
            ></Blood_camps>
          )}
        </nav>
      </header>

      <div>
        <div class="search_container">
          <div class="row">
            <div class="col-xs-10 col-xs-offset-1">
              <div class="input-group">
                <input
                  className="form-controls"
                  placeholder="Search Hospitals . . ."
                  type="text"
                  onChange={(e) => {
                    Search_fun(e, e.target.value);
                  }}
                />
                <div class="input-group-btn">
                  <button type="button" id="searchbtn">
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {hospital_records.length == 0 ? (
        <h1
          style={{
            color: "red",
            fontFamily: "initial",
            letterSpacing: "2px",
            fontWeight: "bold",
          }}
        >
          We will add the records as soon as possible.
        </h1>
      ) : (
        <h1 id="select_hos" className="animate__animated animate__slideInLeft">
          Select the hospital from the list below where you need blood.
        </h1>
      )}

      <div className="hospital_continar">
        <Grid columns="equal" divided>
          <div className="city_card">
            {hospital_records.map((list) => {
              return (
                <Card color="grey" className="card_bar1">
                  <Modal
                    closeIcon
                    onClose={() => setOpen(false)}
                    onOpen={() => setOpen(true)}
                    open={open}
                  >
                    <Modal.Header>{model_value.Hospital_name}</Modal.Header>

                    <div className="model_img">
                      <img
                        src={model_value.img1}
                        alt={model_value.Hospital_name}
                      />
                    </div>
                  </Modal>

                  <Image
                    src={list.img1}
                    className="img1"
                    onClick={() => callModel(list)}
                  />
                  <Card.Content>
                    <div className="hos_name">
                      <Card.Header>
                        <span title={list.Hospital_name}>
                          {list.Hospital_name}
                        </span>
                      </Card.Header>
                    </div>
                    <div className="hospital_info">
                      <Feed.Summary>
                        <span>District:</span> {list.District}
                      </Feed.Summary>
                      <div className="hospital_add">
                        <Feed.Summary>
                          <span>Contact No:</span>{" "}
                          <a href={`tel:${list.Contact_no}`} target="_blank">
                            {list.Contact_no}
                          </a>
                        </Feed.Summary>
                        <Feed.Summary>
                          <span>Address:</span>{" "}
                          <a
                            href={`${list.Map}`}
                            title={list.Address}
                            target="_blank"
                          >
                            {list.Address}
                          </a>
                        </Feed.Summary>
                      </div>
                    </div>
                    <div className="hos_bttn">
                      <Button
                        inverted
                        color="green"
                        className="city_bttn1"
                        onClick={() =>
                          navigate("/Blood_donators", {
                            state: {
                              Hospital_Blood_donators: list,
                              Hospital_id: list.hos_id,
                            },
                          })
                        }
                      >
                        <span>Select Hospital</span>
                      </Button>
                    </div>
                  </Card.Content>
                </Card>
              );
            })}
          </div>
        </Grid>
      </div>
    </div>
  );
};

export default All_hospital;
