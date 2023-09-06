import React from "react";
import { useEffect, useState } from "react";
import Aplus from "../assert/Aplus.jpg";
import Bplus from "../assert/Bplus.jpg";
import Oplus from "../assert/Oplus.jpg";
import ABplus from "../assert/ABplus.jpg";
import Aminus from "../assert/Aminus.jpg";
import Bminus from "../assert/Bminus.jpg";
import ABminus from "../assert/ABminus.jpg";
import Ominus from "../assert/Ominus.jpg";
import A1blood from "../assert/A1+.jpg";
import A2blood from "../assert/A2+.jpg";
import A1minusblood from "../assert/A1-.jpg";
import A2minus from "../assert/A2minus.jpg";
import A1Bminus from "../assert/A1Bminus.jpg";
import A1Bplus from "../assert/A1Bplus.jpg";
import A2Bplus from "../assert/A2Bpluse.jpg";
import A2Bminus from "../assert/A2Bminus.jpg";
import Blood_All from "../assert/Blood.png";
import Login_form from "../components/Login_form.js";
import woman from "../assert/woman.jpg";
import man from "../assert/men.png";
import Display_own_profile from "../components/Display_own_profile";
import swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "animate.css";
import { db } from "../firebase";
import Blood_donator_form from "../components/Blood_donator_form";
import {
  addDoc,
  collection,
  getDocs,
  doc,
  serverTimestamp,
  updateDoc,
  deleteDoc,
  where,
  orderBy,
  limitToLast,
  query,
} from "firebase/firestore";
import { list } from "firebase/storage";
import {
  Card,
  Menu,
  Input,
  Message,
  Checkbox,
  Popup,
  Image,
  Button,
  Grid,
  Feed,
  Item,
  Icon,
  Step,
  Dropdown,
} from "semantic-ui-react";
import { useLocation, useNavigate } from "react-router-dom";
import "../pages/Blood_donators.css";

const Blood_donators = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [temp_id, setTemp_id] = useState("");

  const [reload, setReload] = useState(false);
  const location = useLocation();
  const get_blood_donators = location.state.Hospital_Blood_donators;
  const get_hospital_id = location.state.Hospital_id;
  const [manustate, setManustate] = useState("ALL");
  const [users, setUsers] = useState([]); //SET DATA
  const [Donator, setDonator] = useState([]); //SET DATA
  const usersCollectionRef = collection(db, "Blood_donator_login");

  const donatorCollectionRef = query(
    collection(db, get_blood_donators.Hospital_name + get_hospital_id),
    manustate != "ALL" ? where("Blood", "==", manustate) : ""
  );
  const friendOptions = [
    {
      key: 0,
      text: `ALL Blood Group`,
      value: `ALL`,
      image: { src: Blood_All },
    },
    {
      key: 1,
      text: `A+ Blood Group`,
      value: `A+`,
      image: { src: Aplus },
    },
    {
      key: 2,
      text: `A- Blood Group`,
      value: `A-`,
      image: { src: Aminus },
    },
    {
      key: 3,
      text: `B+ Blood Group`,
      value: `B+`,
      image: { src: Bplus },
    },
    {
      key: 4,
      text: `B- Blood Group`,
      value: `B-`,
      image: { src: Bminus },
    },
    {
      key: 5,
      text: `O+ Blood Group`,
      value: `O+`,
      image: { src: Oplus },
    },
    {
      key: 6,
      text: `O- Blood Group`,
      value: `O-`,
      image: { src: Ominus },
    },
    {
      key: 7,
      text: `AB+ Blood Group`,
      value: `AB+`,
      image: { src: ABplus },
    },
    {
      key: 8,
      text: `AB- Blood Group`,
      value: `AB-`,
      image: { src: ABminus },
    },
    {
      key: 9,
      text: `A1+ Blood Group`,
      value: `A1+`,
      image: { src: A1blood },
    },
    {
      key: 10,
      text: `A1- Blood Group`,
      value: `A1-`,
      image: { src: A1minusblood },
    },
    {
      key: 11,
      text: `A2+ Blood Group`,
      value: `A2+`,
      image: { src: A2blood },
    },
    {
      key: 12,
      text: `A2- Blood Group`,
      value: `A2-`,
      image: { src: A2minus },
    },
    {
      key: 13,
      text: `A1B+ Blood Group`,
      value: `A1B+`,
      image: { src: A1Bplus },
    },
    {
      key: 14,
      text: `A1B- Blood Group`,
      value: `A1B-`,
      image: { src: A1Bminus },
    },
    {
      key: 15,
      text: `A2B+ Blood Group`,
      value: `A2B+`,
      image: { src: A2Bplus },
    },
    {
      key: 1,
      text: `A2B- Blood Group`,
      value: `A2B-`,
      image: { src: A2Bminus },
    },
  ];
  // var filter = donatorCollectionRef.where("Blood", "==", manustate);
  var getUsers = async () => {
    const data = await getDocs(usersCollectionRef);
    setUsers(
      data.docs.map((doc) => ({
        //OFTER CHECKING SET THA ALL DATA.
        ...doc.data(),
        id: doc.id,
      }))
    );
  };
  var getDonator_data = async () => {
    const datas = await getDocs(donatorCollectionRef);
    setDonator(
      datas.docs.map((doc) => ({
        //OFTER CHECKING SET THA ALL DATA.
        ...doc.data(),
        id: doc.id,
      }))
    );
  };
  getDonator_data();
  useEffect(() => {
    getUsers();
  }, []);

  //state = { activeItem: "home" };
  const get_donator_data = async (email) => {
    window.sessionStorage.setItem("email", email);

    users.map((get_id) => {
      if (get_id.Email == email) {
        //json_data[0].donater_id=get_id.id;
        window.sessionStorage.setItem("name", get_id.Name);
        window.sessionStorage.setItem("user_id", get_id.id);
        swal.fire({
          title: `<h2>✋Hi, ${window.sessionStorage.getItem("name")}</h2>`,
          text: `welcome Back!`,

          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
    setOpen(false);
  };
  if (
    window.sessionStorage.getItem("email") &&
    !window.sessionStorage.getItem("name")
  ) {
    users.map((get_id) => {
      getUsers();
      if (get_id.Email == window.sessionStorage.getItem("email")) {
        //json_data[0].donater_id=get_id.id;
        window.sessionStorage.setItem("name", get_id.Name);
        window.sessionStorage.setItem("user_id", get_id.id);
        swal.fire({
          title: `<h2>✋Hi, ${window.sessionStorage.getItem("name")}</h2>`,
          text: `if you like you register your profile in your nearesed hospital`,
          icon: "success",
        });
      }
    });
  }
  const get_reg = async () => {
    if (window.sessionStorage.getItem("email")) {
      getDonator_data();
      await Donator.map((list) => {
        if (
          list.Blood_donator_id == window.sessionStorage.getItem("user_id") &&
          list.Hospital_id == get_hospital_id
        ) {
          window.sessionStorage.setItem("register", list.Hospital_name);
        }
      });
    }
  };
  setTimeout(get_reg, 100);

  const pageload = async () => {
    await swal.fire({
      title: `<h3>Thank you registering with us, ${window.sessionStorage.getItem(
        "name"
      )} ❤️</h3>`,
      text: `if Any ony one need your blood they will call you!`,
      icon: "success",
      confirmButtonText: "<h5>Okay!</h5>",
    });
    window.location.reload();
  };

  const Logout_user = () => {
    window.sessionStorage.removeItem("name");
    window.sessionStorage.removeItem("email");
    window.sessionStorage.removeItem("user_id");
    window.sessionStorage.removeItem("register");
    window.location.reload();
  };

  // const Search_fun = async (e, searc) => {
  //   ///THIS IS A SEARCH VALUE FUNCTION
  //   var search1 = searc;
  //   e.preventDefault();

  //   setDonator(
  //     Donator.filter((bolg) =>
  //       bolg.Donator_name.toLowerCase().includes(search1.toLowerCase())
  //     )
  //   );

  //   if (search1 == "") {
  //     getDonator_data();
  //   }
  // };
  const delete_Donator_profile = async (get_delete_id) => {
    swal
      .fire({
        title: "<h3>Do you want to delete your profile?</h3>",
        icon: "info",
        text: "You can't undo your profile.",

        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp",
        },
        showDenyButton: true,
        confirmButtonText: "<h5>Delete</h5>",
        denyButtonText: `<h5>Cancel</h5>`,
      })
      .then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          if (open2) {
            setOpen2(false);
          }
          try {
            await deleteDoc(
              doc(
                db,
                get_blood_donators.Hospital_name + get_hospital_id,
                get_delete_id
              )
            );
            swal.fire({
              position: "top-end",
              icon: "success",
              title: "<h3 style={{color:'red'}}>Your Profile Delete!</h3>",
              showConfirmButton: false,
              timer: 1500,
            });
            window.sessionStorage.removeItem("register");
          } catch (err) {
            swal.fire("Oops!", "Some network error so try again!!!", "error");
          }
        }
      });
  };
  const update_Donator_profile = (id) => {
    setTemp_id(id);
    setOpen1(true);
  };
  const update_Donator_status = async (id, genter) => {
    try {
      //*UPDATE THE DATA IN FIREBASE*//
      //Upload DATA TO FIRSTORE
      const nextDate = new Date();
      if (genter == "Male") {
        nextDate.setDate(nextDate.getDate() + 90);
      } else {
        nextDate.setDate(nextDate.getDate() + 120);
      }
      // const getNextDays = (currentDate = new Date(), daysToAdd = 90) => {

      //   nextDate.setDate(currentDate.getDate() + daysToAdd)
      //  console.log(nextDate.getFullYear()+'/'+(nextDate.getMonth()+1)+'/'+nextDate.getDate())
      // }
      await updateDoc(
        doc(db, get_blood_donators.Hospital_name + get_hospital_id, id),
        {
          Status: document.getElementById(id).checked ? true : false,
          Allow_Donation: !document.getElementById(id).checked
            ? nextDate.getFullYear() +
              "/" +
              (nextDate.getMonth() + 1) +
              "/" +
              nextDate.getDate()
            : false,
        },
        genter == "Male"
          ? await swal.fire({
              position: "top-end",
              icon: "success",
              title: "<h3 style={{color:'red'}}>Your Status Update!.</h3>",
              text: document.getElementById(id).checked
                ? "Your status Auto update ofter 90 days."
                : "",
              showConfirmButton: false,
              timer: 1500,
            })
          : await swal.fire({
              position: "top-end",
              icon: "success",
              title: "<h3 style={{color:'red'}}>Your Status Update!.</h3>",
              text: document.getElementById(id).checked
                ? "Your status Auto update ofter 120 days."
                : "",
              showConfirmButton: false,
              timer: 1500,
            })
      );
    } catch (error) {
      swal.fire(
        "Oops!",
        `Some network error so try again!!! ${error}`,
        "error"
      );
    }
  };
  const get_dropdown_value = async (e, { value }) => {
    setManustate(value);
  };
  const Auto_Status_Update = async (id) => {
    try {
      await updateDoc(
        doc(db, get_blood_donators.Hospital_name + get_hospital_id, id),
        {
          Status: true,
          Allow_Donation: false,
        }
      );
    } catch (error) {
      swal.fire("Oops!", `Some network error so try again!!!`, "error");
    }
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
              {window.sessionStorage.getItem("email") ? (
                window.sessionStorage.getItem("register") !==
                get_blood_donators.Hospital_name ? (
                  <Button onClick={() => setOpen1(true)} positive>
                    <span
                      style={{
                        letterSpacing: "2px",
                        fontWeight: "bold",
                        fontFamily: "Tektur, cursive",
                        fontSize: "2.5vh",
                        padding: "10px",
                      }}
                    >
                      Register
                    </span>
                  </Button>
                ) : (
                  <Button onClick={() => setOpen2(true)} primary>
                    <span
                      style={{
                        letterSpacing: "2px",
                        fontWeight: "bold",
                        fontFamily: "Tektur, cursive",
                        fontSize: "2.5vh",
                        padding: "10px",
                      }}
                    >
                      Profile
                    </span>
                  </Button>
                )
              ) : (
                ""
              )}
              {open1 && (
                <Blood_donator_form
                  open={open1}
                  setOpen={setOpen1}
                  Hospital_name={get_blood_donators.Hospital_name}
                  Hospital_id={get_hospital_id}
                  pageload={pageload}
                  list={temp_id}
                />
              )}
              <a href="/">Home</a>

              <a
                href="https://en.wikipedia.org/wiki/Blood_donation#:~:text=Many%20donors%20donate%20for%20several,or%20relative%2C%20and%20social%20pressure"
                target="_blank"
              >
                Awareness
              </a>

              <a
                onClick={() =>
                  navigate("/Hospitals", {
                    state: {
                      dis_name: get_blood_donators.Hospital_name,
                    },
                  })
                }
              >
                Back
              </a>
              {open && (
                <Login_form
                  open={open}
                  setOpen={setOpen}
                  getdata={get_donator_data}
                />
              )}
              {open2 && (
                <Display_own_profile
                  open2={open2}
                  setOpen2={setOpen2}
                  Hospital_name={get_blood_donators.Hospital_name}
                  Hospital_id={get_hospital_id}
                  id={document.getElementById("single_id").textContent}
                  delete_Donator_profile={delete_Donator_profile}
                  update_Donator_profile={update_Donator_profile}
                  update_Donator_status={update_Donator_status}
                />
              )}

              {!window.sessionStorage.getItem("email") ? (
                <a onClick={() => setOpen(true)} style={{ color: "black" }}>
                  Login
                </a>
              ) : (
                <a onClick={() => Logout_user()} style={{ color: "black" }}>
                  Logout
                </a>
              )}
            </div>
          </div>

          {/* <div class="navigation-menu__overlay"></div>
          <div className="animate__animated animate__slideInLeft site_logo_div">
            <p>
              T<p>N</p>
            </p>
            <span>Blood Donars</span>
          </div>
          <section class="navigation-menu__labels">
            <div className="menu_item">
              <ul>
                {open && (
                  <Login_form
                    open={open}
                    setOpen={setOpen}
                    getdata={get_donator_data}
                  />
                )}
                {window.sessionStorage.getItem("email") ? (
                  window.sessionStorage.getItem("register") !==
                  get_blood_donators.Hospital_name ? (
                    <li id="add_donater">
                      <Button onClick={() => setOpen1(true)} positive>
                        <span>Register</span>
                      </Button>
                    </li>
                  ) : (
                    <li id="add_donater">
                      <Button onClick={() => setOpen2(true)} primary>
                        <span>Profile</span>
                      </Button>
                    </li>
                  )
                ) : (
                  ""
                )}

                {open1 && (
                  <Blood_donator_form
                    open={open1}
                    setOpen={setOpen1}
                    Hospital_name={get_blood_donators.Hospital_name}
                    Hospital_id={get_hospital_id}
                    pageload={pageload}
                    list={temp_id}
                  />
                )}

                <li className="animate__animated animate__bounceInDown">
                  Home
                </li>

                <li className="animate__animated animate__bounceInDown">
                  Anonsement
                </li>
                {open2 && (
                  <Display_own_profile
                    open2={open2}
                    setOpen2={setOpen2}
                    Hospital_name={get_blood_donators.Hospital_name}
                    Hospital_id={get_hospital_id}
                    id={document.getElementById("single_id").textContent}
                    delete_Donator_profile={delete_Donator_profile}
                    update_Donator_profile={update_Donator_profile}
                  />
                )}

                {!window.sessionStorage.getItem("email") ? (
                  <li
                    onClick={() => setOpen(true)}
                    className="animate__animated animate__bounceInDown"
                  >
                    Login
                  </li>
                ) : (
                  <li
                    onClick={() => Logout_user()}
                    className="animate__animated animate__bounceInDown"
                  >
                    Logout
                  </li>
                )}
              </ul>
            </div>
          </section> */}
        </nav>
      </header>
      <div className="hos_datas">
        <div className="hos_data_con">
          <div className="hos_data_in_con">
            <img
              src={get_blood_donators.img1}
              alt={get_blood_donators.Hospital_name}
            />
            <div className="data_con">
              <div className="hos_data_display">
                <Feed.Summary>
                  <span>
                    Hospital Name: <h3>{get_blood_donators.Hospital_name}</h3>
                  </span>
                </Feed.Summary>
                <Feed.Summary>
                  <span>
                    District: <h3>{get_blood_donators.District}</h3>
                  </span>
                </Feed.Summary>

                <Feed.Summary>
                  <span>
                    Contact No: <h3>{get_blood_donators.Contact_no}</h3>
                  </span>
                </Feed.Summary>
                <Feed.Summary>
                  <span>
                    Address:
                    <div className="hos_addresss">
                      <h3>{get_blood_donators.Address}</h3>
                    </div>
                  </span>
                </Feed.Summary>
                <div className="hos_call_vist_bttn">
                  <a
                    href={`tel:${get_blood_donators.Contact_no}`}
                    target="_blank"
                    id="call_Hospital"
                  ></a>
                  <Button
                    positive
                    id="tow_info_bttn"
                    onClick={() =>
                      document.getElementById("call_Hospital").click()
                    }
                  >
                    <span>
                      <Popup content={"Call to Hospital."} />
                      CALL
                    </span>
                  </Button>
                  <span className="hos_call"></span>
                  <a
                    href={get_blood_donators.Map}
                    target="_blank"
                    style={{ display: "none" }}
                    id="visit_hospital"
                  ></a>
                  <Button
                    primary
                    id="tow_info_bttn"
                    onClick={() =>
                      document.getElementById("visit_hospital").click()
                    }
                  >
                    <span>
                      <Popup content={"Visit the Hospital."} />
                      VISIT
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="user_message_for_info">
        <h2 class="animate__animated animate__fadeInLeft">
          Select the blood group you want!
        </h2>

        <p className="animate__animated animate__fadeInRight">
          Maybe you get blood faster because all donors are from nearby
          hospitals.
        </p>
        <h2 class="animate__animated animate__fadeInLeft">
          Register as a blood donor!
        </h2>
        <p className="animate__animated animate__fadeInRight">
          If you willing to donate a blood under this hospital, Please regiter
          as a donor.
        </p>
      </div>
      <div className="center_menu">
        <input
          type="checkbox"
          className="check_box_for_more_option_visible"
          id={"visible_more_blood_group_option"}
          hidden
        ></input>
        <div className="menu_con">
          <Menu pointing size="large" className="menu_item">
            <Menu.Item
              className="menu_items"
              active={manustate === "ALL"}
              onClick={() => setManustate("ALL")}
            >
              <div className="All_blood">ALL</div>
            </Menu.Item>
            <Menu.Item
              className="menu_items"
              active={manustate === "A+"}
              onClick={() => setManustate("A+")}
            >
              <Popup
                content={"Select A+"}
                trigger={<img alt="A+" src={Aplus} />}
              />
            </Menu.Item>
            <span className="cape_menu"></span>
            <Menu.Item
              className="menu_items"
              active={manustate === "A-"}
              onClick={() => setManustate("A-")}
            >
              {/* <img alt="A-" src={Aminus} /> */}
              <Popup
                content={"Select A-"}
                trigger={<img alt="A-" src={Aminus} />}
              />
            </Menu.Item>
            <span className="cape_menu"></span>

            <Menu.Item
              className="menu_items"
              active={manustate === "B+"}
              onClick={() => setManustate("B+")}
            >
              {/* <img alt="B+" src={Bplus} /> */}
              <Popup
                content={"Select B+"}
                trigger={<img alt="B+" src={Bplus} />}
              />
            </Menu.Item>
            <span className="cape_menu"></span>
            <Menu.Item
              className="menu_items"
              active={manustate === "B-"}
              onClick={() => setManustate("B-")}
            >
              {/* <img alt="B-" src={Bminus} /> */}
              <Popup
                content={"Select B-"}
                trigger={<img alt="B-" src={Bminus} />}
              />
            </Menu.Item>
            <span className="cape_menu"></span>

            <Menu.Item
              className="menu_items"
              active={manustate === "O+"}
              onClick={() => setManustate("O+")}
            >
              {/* <img alt="O+" src={Oplus} /> */}
              <Popup
                content={"Select O+"}
                trigger={<img alt="O+" src={Oplus} />}
              />
            </Menu.Item>
            <span className="cape_menu"></span>

            <Menu.Item
              className="menu_items"
              active={manustate === "O-"}
              onClick={() => setManustate("O-")}
            >
              {/* <img alt="O-" src={Ominus} /> */}
              <Popup
                content={"Select O-"}
                trigger={<img alt="O-" src={Ominus} />}
              />
            </Menu.Item>
            <span className="cape_menu"></span>
            <Menu.Item
              className="menu_items"
              active={manustate === "AB+"}
              onClick={() => setManustate("AB+")}
            >
              {/* <img alt="AB+" src={ABplus} /> */}
              <Popup
                content={"Select AB+"}
                trigger={<img alt="AB+" src={ABplus} />}
              />
            </Menu.Item>
            <span className="cape_menu"></span>
            <Menu.Item
              className="menu_items"
              active={manustate === "AB-"}
              onClick={() => setManustate("AB-")}
            >
              {/* <img alt="AB-" src={ABminus} /> */}
              <Popup
                content={"Select AB-"}
                trigger={<img alt="AB-" src={ABminus} />}
              />
            </Menu.Item>

            <span className="cape_menu"></span>

            <Menu.Item
              className="menu_items"
              active={manustate === "A1+"}
              onClick={() => setManustate("A1+")}
            >
              {/* <img alt="O+" src={Oplus} /> */}
              <Popup
                content={"Select A1+"}
                trigger={<img alt="A1+" src={A1blood} />}
              />
            </Menu.Item>
            <span className="cape_menu"></span>

            <Menu.Item
              className="menu_items"
              active={manustate === "A1-"}
              onClick={() => setManustate("A1-")}
            >
              {/* <img alt="O+" src={Oplus} /> */}
              <Popup
                content={"Select A1-"}
                trigger={<img alt="A1minus" src={A1minusblood} />}
              />
            </Menu.Item>
            <span className="cape_menu"></span>

            <Menu.Item
              className="menu_items"
              active={manustate === "A2+"}
              onClick={() => setManustate("A2+")}
            >
              {/* <img alt="O+" src={Oplus} /> */}
              <Popup
                content={"Select A2+"}
                trigger={<img alt="A2+" src={A2blood} />}
              />
            </Menu.Item>

            <label
              id="clik_more_option_lable"
              htmlFor="visible_more_blood_group_option"
            >
              <Menu.Item
                className="menu_items"
                active={
                  manustate == "more" ||
                  manustate == "A2-" ||
                  manustate == "A1B+" ||
                  manustate == "A1B-" ||
                  manustate == "A2B+" ||
                  manustate == "A2B-"
                }
              >
                <div className="All_blood" style={{ cursor: "pointer" }}>
                  More...
                </div>
              </Menu.Item>
            </label>
          </Menu>
        </div>
        <label htmlFor="visible_more_blood_group_option"></label>
        <div
          onClick={() =>
            (document.getElementById(
              "visible_more_blood_group_option"
            ).checked = false)
          }
          className="display_more_option"
        >
          <div className="more_blood_group">
            <div className="more_option_blood">
              <p onClick={() => setManustate("A2-")}>🩸A2+</p>
              <p onClick={() => setManustate("A1B+")}>🩸A1B+</p>
              <p onClick={() => setManustate("A1B-")}>🩸A1B-</p>
              <p onClick={() => setManustate("A2B+")}>🩸A2B+</p>
              <p onClick={() => setManustate("A2B-")}>🩸A2B-</p>
            </div>
          </div>
        </div>
      </div>
      <div className="response_view_blood_option">
        <div className="dropdown_for_blood_options">
          <Dropdown
            id="blood_deopdown_style"
            fluid
            search
            selection
            options={friendOptions}
            placeholder="Select Required Blood Group!"
            onChange={get_dropdown_value}
          />
        </div>
      </div>
      <div className="show_all_donator_con">
        {Donator.length === 0 ? (
          <h2
            style={{
              color: "red",

              fontFamily: "Dancing Script, cursive",

              fontWeight: "bold",
            }}
          >
            {"Sorry, No Blood Donators Register Yet!"}
          </h2>
        ) : (
          <h2
            style={{
              color: "green",
              fontFamily: "Dancing Script, cursive",
              fontWeight: "bold",
            }}
          >
            There are <span>{Donator.length}</span> Blood Donors.
          </h2>
        )}

        <Grid columns="equal" divided>
          <div className="donator_card">
            {Donator.map((list) => {
              return (
                <Card color="grey" className="card_bar1">
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
                          <div className="Avaliable_status">
                            {list.Status == true ? (
                              <div>
                                <p>Avaliable</p>
                              </div>
                            ) : (
                              <div>
                                <p style={{ color: "red" }}>Not Available</p>
                              </div>
                            )}
                            {/* check auto status update! */}
                            {list.Allow_Donation ? (
                              new Date().getFullYear() +
                                "/" +
                                (new Date().getMonth() + 1) +
                                "/" +
                                new Date().getDate() ==
                              list.Allow_Donation ? (
                                Auto_Status_Update(list.id)
                              ) : (
                                <></>
                              )
                            ) : (
                              <></>
                            )}
                            {window.sessionStorage.getItem("user_id") ===
                            list.Blood_donator_id ? (
                              <div className="check_box_donar_status">
                                <input
                                  type="checkbox"
                                  checked={list.Status}
                                  onClick={() =>
                                    update_Donator_status(list.id, list.Genter)
                                  }
                                  id={list.id}
                                ></input>
                              </div>
                            ) : (
                              <></>
                            )}
                          </div>
                        </div>
                      </Feed.Summary>
                      <Feed.Summary>
                        <span>Age:- </span>{" "}
                        <span id="donator_info">{list.Age}</span>
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
                      {window.sessionStorage.getItem("user_id") ===
                      list.Blood_donator_id ? (
                        <Card.Content extra>
                          <p hidden id="single_id">
                            {list.id}
                          </p>
                          <div className="ui two buttons">
                            <Button
                              inverted
                              className="city_bttn1"
                              color="green"
                              onClick={() => update_Donator_profile(list.id)}
                            >
                              <span>Update</span>
                            </Button>
                            <Button
                              inverted
                              className="city_bttn1"
                              color="red"
                              onClick={() => delete_Donator_profile(list.id)}
                            >
                              <span>Delete</span>
                            </Button>
                          </div>
                        </Card.Content>
                      ) : (
                        <Button
                          inverted
                          color="green"
                          className="city_bttn1"
                          onClick={() =>
                            document.getElementById("call_to_donator").click()
                          }
                          icon="phone"
                        >
                          <span>📞Call...</span>
                        </Button>
                      )}
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

export default Blood_donators;
