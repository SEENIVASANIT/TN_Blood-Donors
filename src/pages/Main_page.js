import React from "react";
import { useEffect, useState } from "react";
import { Card, Image, Button, Grid } from "semantic-ui-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Carousel } from "react-bootstrap"; // If using Bootstrap carousel, otherwise import your preferred carousel library
import swal from "sweetalert2";
import "../pages/Main_page.css";
const Main_page = () => {
  const [records, setRecords] = useState([]);
  const navigate = useNavigate();
  const [interval, setIntervalState] = useState(5000);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetch("https://sheetdb.io/api/v1/31wbs450fjjw9")
      .then((response) => response.json())
      .then((data) => setRecords(data))
      .catch((err) =>
        swal.fire("Oops!", "Some network error so try again!!!", "error")
      );
  }, []);
  useEffect(() => {
    const carouselInterval = setInterval(() => {
      // Calculate the next slide index based on the to;tal number of slides
      const totalSlides = 3;
      /* Replace this with the total number of slides */
      setActiveIndex((prevIndex) => (prevIndex + 1) % totalSlides);
    }, interval);

    // Clear the interval when the component unmounts to avoid memory leaks
    return () => clearInterval(carouselInterval);
  }, [interval]);
  const Search_fun = async (e, searc) => {
    ///THIS IS A SEARCH VALUE FUNCTION
    var search1 = searc;
    if (search1 === "") {
      //fetch("https://sheetdb.io/api/v1/bsp043atzmrsd")
      fetch("https://sheetdb.io/api/v1/31wbs450fjjw9")
        .then((response) => response.json())
        .then((data) => setRecords(data))
        .catch((err) =>
          swal.fire("Oops!", "Some network error so try again!!!", "error")
        );
    }
    e.preventDefault();
    setRecords(
      records.filter((bolg) =>
        bolg.d_name.toLowerCase().includes(search1.toLowerCase())
      )
    );
    // if (records.length == records.length) {
    //   setTimeout(
    //     (document.getElementById("result_tag").style.display = "block")
    //   );
    // }
  };

  return (
    <div className="App">
      <nav>
        <Carousel controls={false}>
          {/* Add carousel items here */}
          {/* For Bootstrap carousel, you can use Carousel.Item */}
          <Carousel.Item>
            <div class="header3">
              {/* <img src="https://www.sriramakrishnahospital.com/wp-content/uploads/2021/06/Blood-Donation-1.jpg"></img> */}

              <div class="header-text">
                <div class="content_1">
                  <a href="#Distric" class="start_btn">
                    Donate Now
                  </a>
                </div>
              </div>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div class="header1">
              {/* <img src="http://il6.picdn.net/shutterstock/videos/5915768/thumb/1.jpg"></img> */}
              <div class="header-text">
                <div className="content_1">
                  <p>
                    Our blood donation website is your beacon of hope in times
                    of need.
                  </p>
                  <h4>
                    Together we make finding nearby blood donors as effortless
                    as a heartbeat.
                  </h4>
                  <h1>Connecting Hearts, Saving Lives.</h1>
                </div>
              </div>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div class="header2">
              {/* <img src="https://media.npr.org/assets/img/2015/12/21/blood-donation_wide-61f7f7edb448b248a1a40d8de4f50aa7130a1490.jpg?s=1400"></img> */}
              <div class="header-text">
                <div className="content_1">
                  <h1
                    style={{
                      fontFamily: "IBM Plex Mono, monospace",
                      textDecorationLine: "underline",
                    }}
                  >
                    TN Blood Donors-db
                  </h1>
                  <ul>
                    <li>
                      This website contian Avalible Bloood Donors in our Nearby
                      Hospital!
                    </li>
                    <li>Easy account registeration for everyone in need.</li>
                    <li>
                      The availability status of the users is also visible in
                      our website and also they are able to update the status.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Carousel.Item>
        </Carousel>
      </nav>
      <div className="city_contianer">
        <h1 className="animate__animated animate__wobble">
          Welcome To TN Blood-Donation!
        </h1>
        <div class="search_container1">
          <div class="row">
            <div class="col-xs-10 col-xs-offset-1">
              <div class="input-group">
                <input
                  className="form-controls"
                  placeholder="Search District . . ."
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
        <h1>Select your district.</h1>
        <Grid columns="equal" id="Distric" divided>
          <div className="city_card">
            {records.map((list) => {
              return (
                <Card color="grey" className="card_bar">
                  <Image src={list.d_images} className="img" />
                  <Card.Content>
                    <Card.Header>{list.d_name}</Card.Header>
                    <Card.Description>Select Your District.</Card.Description>
                    <Button
                      inverted
                      color="green"
                      className="city_bttn"
                      onClick={() =>
                        navigate("/Hospitals", {
                          state: {
                            dis_name: list.d_name,
                          },
                        })
                      }
                    >
                      <span>Select</span>
                    </Button>
                  </Card.Content>
                </Card>
              );
            })}
          </div>
        </Grid>
      </div>
      <h1 className="result_tag">Result Not Found!</h1>
    </div>
  );
};
export default Main_page;
