import React, { useState, useEffect } from "react";
import { Card, Image, Button, Grid, Feed, Icon } from "semantic-ui-react";
import "../components/Display_own_profile.css";
import woman from "../assert/woman.jpg";
import man from "../assert/men.png";
import { db } from "../firebase";
import {
  addDoc,
  collection,
  getDoc,
  doc,
  serverTimestamp,
  updateDoc,
  limitToLast,
} from "firebase/firestore";
const initialState = {
  Phone: "",
  Dob: "",
  Age: "",
  Blood: "",
  Address: "",
  Donator_email: "",
  Donator_name: "",
  img: "",
};
const Display_own_profile = ({
  open2,
  setOpen2,
  Hospital_name,
  Hospital_id,
  id,
  delete_Donator_profile,
  update_Donator_status,
  update_Donator_profile,
}) => {
  const [list, setSingle_Donator] = useState(initialState); //SET DATA
  const update_Donator = (id) => {
    update_Donator_profile(id);
    setOpen2(false);
  };
  useEffect(() => {
    const getSingleuser = async () => {
      const docRef = doc(db, Hospital_name + Hospital_id, id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        setSingle_Donator({ ...snapshot.data() });
      }
    };
    getSingleuser();
  });
  return (
    <div className="donatar_register_form">
      <div className="single_donator">
        <h4>Your Prifile</h4>
        <div className="single_user">
          <Card color="grey">
            {!list.img ? (
              list.Genter === "Male" ? (
                <Image src={man} className="donator_img" />
              ) : (
                <Image src={woman} className="donator_img" />
              )
            ) : (
              <Image src={list.img} className="donator_img" />
            )}

            <Card.Content>
              <div className="hos_name">
                <Card.Header>
                  <span id="donator_name" title={list.Hospital_name}>
                    {list.Donator_name}
                  </span>
                </Card.Header>
              </div>

              <i className="fa fa-solid fa-droplet" id="Donator_blood">
                <span>{list.Blood}</span>
              </i>

              <div className="hospital_info">
                <Feed.Summary>
                  <div style={{ display: "flex", position: "relative" }}>
                    <span>Status :- </span>{" "}
                    <div className="Avaliable_status2">
                      {list.Status == true ? (
                        <div>
                          <p>Avaliable</p>
                        </div>
                      ) : (
                        <div>
                          <p style={{ color: "red" }}>Not Available</p>
                        </div>
                      )}
                      {/* {window.sessionStorage.getItem("user_id") ===
                      list.Blood_donator_id ? (
                        <div className="check_box_donar_status">
                          <input
                            type="checkbox"
                            checked={list.Status}
                            onClick={() => update_Donator_status(id)}
                            id={list.id}
                          ></input>
                        </div>
                      ) : (
                        <></>
                      )} */}
                    </div>
                  </div>
                </Feed.Summary>
                <Feed.Summary>
                  <span>Age:- </span> <span id="donator_info">{list.Age}</span>
                </Feed.Summary>
                <Feed.Summary>
                  <span>Genter:- </span>{" "}
                  <span id="donator_info">{list.Genter}</span>
                </Feed.Summary>
                <Feed.Summary>
                  <span>Contact No:- </span>{" "}
                  <span id="donator_info">{list.Phone}</span>
                </Feed.Summary>
                <Feed.Summary>
                  <span>Email:- </span>{" "}
                  <span id="donator_info">{list.Donator_email}</span>
                </Feed.Summary>
                <Feed.Summary>
                  <div className="donator_address">
                    <span>Address:- </span>
                    <span id="donator_info">{list.Address}</span>
                  </div>
                </Feed.Summary>
              </div>
              <div className="hos_bttn">
                <a
                  style={{ display: "none" }}
                  id="call_to_donator"
                  href={`tel:${list.Phone}`}
                  target="_blank"
                ></a>

                <Card.Content extra>
                  <div className="ui two buttons">
                    <Button
                      inverted
                      className="city_bttn1"
                      onClick={() => update_Donator(id)}
                      color="green"
                    >
                      <span>Update</span>
                    </Button>
                    <Button
                      inverted
                      className="city_bttn1"
                      color="red"
                      onClick={() => delete_Donator_profile(id)}
                    >
                      <span>Delete</span>
                    </Button>
                  </div>
                </Card.Content>
              </div>
            </Card.Content>
          </Card>

          <Button
            className="close_single_user"
            negative
            onClick={() => setOpen2(false)}
          >
            <span>cancel</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Display_own_profile;
