import React from "react";
import { useEffect, useState } from "react";
import Oplus from "../assert/Oplus.jpg";
import woman from "../assert/woman.jpg";
import man from "../assert/men.png";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import "../Admin_page/Admin.css";
import {
  Menu,
  Segment,
  Card,
  Button,
  Image,
  Grid,
  Message,
  Modal,
  Header,
  Feed,
  Dropdown,
  Icon,
} from "semantic-ui-react";
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
import { storage } from "../firebase";
import Camp_comments_admin from "./Camp_comments_admin";
import swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import { db } from "../firebase";
import Admin_camp_data_view from "./Admin_camp_data_view";
const Admin = () => {
  const [records, setRecords] = useState([]);
  const [setdistric_lis, setDistric_list] = useState([]);
  const [getcollection, setcollection] = useState("");
  const [getcomment_id, setcomment_id] = useState("");
  var [file, setFile] = useState(null);
  const location = useLocation();
  const get_Admin_name = location.state.Admin_name;
  const [getcollection_for_blood_camps, setcollection_for_blood_camps] =
    useState("");
  const [setimg, setImg] = useState({});
  const [progress, setProgress] = useState(null);
  const [manustate, setManustate] = useState("home");
  const [open, setOpen] = useState(false);
  const [comment_open, setComment_open] = useState(false);
  const [Donator, setDonator] = useState([]); //SET DATA
  const [getUser, setUser] = useState([]); //SET DATA
  const [getAdmins, setAdmins] = useState([]); //SET DATA
  const [More_info_camps, setMore_info_camps_datas] = useState([]); //SET DATA
  const [Distric_blood_camp, setDistric_Blood_camps] = useState([]); //SET DATA
  const usersCollectionRef = query(
    collection(db, "Blood_donator_login"),
    orderBy("timstamp")
  );
  const AdminCollectionRef = query(
    collection(db, "Admins"),
    orderBy("timstamp")
  );
  useEffect(() => {
    fetch(`https://sheetdb.io/api/v1/fay54ry1j1nbk`)
      .then((response) => response.json())
      .then((data) => setRecords(data))
      .catch((err) =>
        swal.fire("Oops!", "Some network error so tryagain!!!", "error")
      );
    fetch(`https://sheetdb.io/api/v1/31wbs450fjjw9`)
      .then((response) => response.json())
      .then((data) => setDistric_list(data))
      .catch((err) =>
        swal.fire("Oops!", "Some network error so tryagain!!!", "error")
      );
    get_All_Admins();
    get_All_user();
  }, []);
  useEffect(() => {
    const uploadFile = async () => {
      const name = new Date().getTime() + file.name;
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          /*---------------------------BROGRESS-BAR-------------------------------*/
          if (progress !== null && progress < 100) {
          }
          setProgress(progress);
          switch (snapshot.state) {
            case "paused":
              // toast('Upload is pause!',{
              //   position: "top-center",
              //   autoClose: 5000,
              //   hideProgressBar: false,
              //   closeOnClick: true,
              //   pauseOnHover: true,
              //   draggable: true,
              //   progress: undefined,
              //   theme: "colored",
              // })
              //console.log("upload is pause");
              break;
            case "running":
              break;
            default:
              break;
          }
        },
        (errors) => {
          swal.fire("Oops!", "Some network error so tryagain!!!", "error");
        },
        async () => {
          await getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            //GET IMAGE URL

            setImg((prev) => ({ ...prev, img: downloadURL })); //Upload DATA TO FIRSTORE
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);

  const get_All_user = async () => {
    const datas = await getDocs(usersCollectionRef);
    setUser(
      datas.docs.map((doc) => ({
        //OFTER CHECKING SET THA ALL DATA.
        ...doc.data(),
        id: doc.id,
      }))
    );
  };
  const get_All_Admins = async () => {
    const datas = await getDocs(AdminCollectionRef);
    setAdmins(
      datas.docs.map((doc) => ({
        //OFTER CHECKING SET THA ALL DATA.
        ...doc.data(),
        id: doc.id,
      }))
    );
  };
  const friendOptions = records.map((list, index) => ({
    key: index,
    text: `${list.District},${list.Hospital_name}`,
    value: `${list.Hospital_name}${list.hos_id}`,
    image: { src: list.img1 },
  }));
  const friend_District = setdistric_lis.map((list, index) => ({
    key: index,
    text: `${list.d_name}`,
    value: `${list.d_name}blood_camps`,
    image: { src: list.d_images },
  }));
  const get_dropdown_value = async (e, { value }) => {
    setcollection(value);
    const donatorCollectionRef = collection(db, value);
    const datas = await getDocs(donatorCollectionRef);
    setDonator(
      datas.docs.map((doc) => ({
        //OFTER CHECKING SET THA ALL DATA.
        ...doc.data(),
        id: doc.id,
      }))
    );
  };
  const get_dropdown_value2 = async (e, { value }) => {
    setcollection_for_blood_camps(value);
    const donatorCollectionRef = collection(db, value);
    const datas = await getDocs(donatorCollectionRef);
    setDistric_Blood_camps(
      datas.docs.map((doc) => ({
        //OFTER CHECKING SET THA ALL DATA.
        ...doc.data(),
        id: doc.id,
      }))
    );
  };

  const delete_Donator_profile = async (get_delete_id) => {
    swal
      .fire({
        title: "Do you want to delete this profile!",
        icon: "info",
        text: "You con't undo your profile ok!",

        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp",
        },
        showDenyButton: true,
        confirmButtonText: "Delete",
        denyButtonText: `cancel`,
      })
      .then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          try {
            await deleteDoc(doc(db, getcollection, get_delete_id));
            swal.fire("user Profile wos delete!", "", "success"); //DELETE THA DATA
            const donatorCollectionRef = collection(db, getcollection);
            const datas = await getDocs(donatorCollectionRef);
            setDonator(
              datas.docs.map((doc) => ({
                //OFTER CHECKING SET THA ALL DATA.
                ...doc.data(),
                id: doc.id,
              }))
            );
          } catch (err) {
            swal.fire("Oops!", "Some network error so try again!!!", "error");
          }
        }
      });
  };
  const get_more_info_for_post = (data) => {
    setOpen(true);
    setMore_info_camps_datas(data);
  };
  const Camps_comments = (id) => {
    setComment_open(true);
    setcomment_id(id);
  };
  const delete_post_for_admin = async (get_delete_id) => {
    swal
      .fire({
        title: "Do you want to delete this user post!",
        icon: "info",
        text: "You con't undo your post ok!",

        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp",
        },
        showDenyButton: true,
        confirmButtonText: "Delete",
        denyButtonText: `cancel`,
      })
      .then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          try {
            await deleteDoc(doc(db, getcollection, get_delete_id));
            swal.fire("Your post wos deleted!", "", "success"); //DELETE THA DATA
            const donatorCollectionRef = collection(
              db,
              getcollection_for_blood_camps
            );
            const datas = await getDocs(donatorCollectionRef);
            setDistric_Blood_camps(
              datas.docs.map((doc) => ({
                //OFTER CHECKING SET THA ALL DATA.
                ...doc.data(),
                id: doc.id,
              }))
            );
          } catch (err) {
            swal.fire("Oops!", "Some network error so try again!!!", "error");
          }
        }
      });
  };
  const remove_User_Account = async (get_delete_id) => {
    swal
      .fire({
        title: "Do you want to delete this user account?",
        icon: "question",
        text: "You con't undo user account.",

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
          try {
            await deleteDoc(doc(db, "Blood_donator_login", get_delete_id));
            swal.fire({
              icon: "success",
              position: "top-end",
              title: `<h4>User Account Delete Successfully!</h4>`,

              showConfirmButton: false,
              timer: 1600,
            });
            get_All_user();
          } catch (err) {
            swal.fire("Oops!", "Some network error so try again!!!", "error");
          }
        }
      });
  };
  const add_more_admin = async () => {
    const { value: formValues } = await swal
      .fire({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger",
        },
        buttonsStyling: false,
        showLoaderOnConfirm: true,
        title: "Add New Admin!",
        html:
          "<div id='new_admin_contian'>" +
          "<div>" +
          '<input placeholder="Enter admin name" name="adminName" id="swal-input1" class="swal2-input"  required>' +
          "<p class='more_admin__p_tag'>New Admin Name.*</p>" +
          '<input id="swal-input2" placeholder="Enter Admin work!" name="adminWork" class="swal2-input"  required>' +
          "<p class='more_admin__p_tag'>Admin work.*</p>" +
          '<input  id="swal-input3" placeholder="Enter admin roal in this project!" name="adminRoal" class="swal2-input"  required>' +
          "<p class='more_admin__p_tag'>Admin roal in the project.*</p>" +
          '<input type="file" id="input_admin_image"  placeholder="Enter admin roal in this project!" class="swal2-input" required/>' +
          "<p class='more_admin__p_tag'>New Admin picture.*</p>" +
          "</div>" +
          "<h2>Other details</h2>" +
          "<div>" +
          '<input placeholder="Enter admin email" name="adminName" id="swal-input8" class="swal2-input"  required>' +
          "<p class='more_admin__p_tag'>New Admin Email.*</p>" +
          '<input placeholder="Enter Linkedin id"  id="swal-input4" class="swal2-input"  required>' +
          "<p class='more_admin__p_tag'>Admin Linkedin Profile.*</p>" +
          '<input id="swal-input5" placeholder="Enter WhatsApp"  class="swal2-input"  required>' +
          "<p class='more_admin__p_tag'>Admin WhatsApp Number.*</p>" +
          '<input  id="swal-input6" placeholder="Enter Instagram link"  class="swal2-input"  required>' +
          "<p class='more_admin__p_tag'>Admin Instagram Profie.*</p>" +
          '<input  id="swal-input7" placeholder="Enter Twitter id" name="adminRoal" class="swal2-input"  required>' +
          "<p class='more_admin__p_tag'>Admin Twitter Profile.*</p>" +
          "</div>" +
          "</div>",
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp",
        },
        confirmButtonText: "Add New Admin",

        focusConfirm: true,
        showCloseButton: true,

        preConfirm: () => {
          return [
            document.getElementById("swal-input1").value,
            document.getElementById("swal-input2").value,
            document.getElementById("swal-input3").value,
            document.getElementById("swal-input4").value,
            document.getElementById("swal-input5").value,
            document.getElementById("swal-input6").value,
            document.getElementById("swal-input7").value,
            document.getElementById("swal-input8").value,
          ];
        },
      })
      .then(
        document
          .getElementById("input_admin_image")
          .addEventListener("change", (e) => {
            setFile(e.target.files[0]);
          })
      );
    if (formValues) {
      if (formValues[0] && formValues[1] && formValues[2] && file) {
        try {
          await addDoc(
            collection(db, "Admins"),
            {
              admin_Name: formValues[0],
              admin_work: formValues[1],
              admin_roal: formValues[2],
              Linkedin: formValues[3],
              WhatsApp: formValues[4],
              Instagram: formValues[5],
              Twitter: formValues[6],
              Email: formValues[7],
              ...setimg,
              timstamp: serverTimestamp(),
            },
            get_All_Admins(),
            swal.fire({
              position: "top-end",
              icon: "success",
              title: "Your work has been saved",
              showConfirmButton: false,
              timer: 1500,
            })
          );
        } catch (error) {
          swal.fire(
            "Oops!",
            `Some network error so tryagain!!!`,

            "error"
          );
        }
      }
    }
  };
  return (
    <>
      <div className="Admin_contianer">
        <div className="admin_side_bar">
          <div className="animate__animated animate__slideInLeft site_logo_div">
            <p>
              T<p>N</p>
            </p>
            <span>
              Bloo
              {/* <span id="ww">
                <i
                  class="fa-solid fa-droplet"
                  style={{ color: "red", fontSize: "4vh" }}
                ></i>
                <i
                  class="fa-solid fa-droplet"
                  style={{ color: "red", fontSize: "4vh" }}
                ></i>
              </span> */}
              d Donors
            </span>
          </div>
          <h1
            style={{
              fontFamily: "Gruppo, sans-serif",
              fontWeight: "bold",
              cursor: "pointer",
            }}
            onClick={() => add_more_admin()}
          >
            Admin's Profile
          </h1>
          <div className="admin_card_view">
            <div className="admin_card_view2">
              {getAdmins.map((list) => {
                return (
                  <Card id="single_admin_card">
                    <Card.Content>
                      <Image src={list.img} id="single_admin_card_img" />
                      <Card.Header
                        style={{ fontFamily: "Bebas Neue,sans-serif" }}
                      >
                        {list.admin_Name}
                      </Card.Header>
                      <Card.Meta
                        style={{
                          fontFamily: "Caveat,cursive",
                          fontWeight: "bold",
                          color: "gary",
                        }}
                      >
                        {list.admin_work}
                      </Card.Meta>
                      <Card.Description>{list.admin_roal}</Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                      <div className="admin_social_medias">
                        <a href={list.WhatsApp} target="_blank">
                          <i
                            class="fa-brands fa-square-whatsapp"
                            style={{ color: "#14c829" }}
                          ></i>
                        </a>
                        <a href={list.Email} target="_blank">
                          <i
                            class="fa-solid fa-envelope"
                            style={{ color: "#f20707" }}
                          ></i>
                        </a>

                        <a href={list.Linkedin} target="_blank">
                          <i
                            class="fa-brands fa-linkedin"
                            style={{ color: "#1864e7" }}
                          ></i>
                        </a>
                        <a href={list.Instagram} target="_blank">
                          <i
                            class="fa-brands fa-square-instagram"
                            style={{ color: "#df1111" }}
                          ></i>
                        </a>
                        <a href={list.Twitter} target="_blank">
                          <div id="twitter_icon">
                            <svg
                              viewBox="0 0 24 24"
                              aria-label="Twitter"
                              role="img"
                              class="r-1nao33i r-4qtqp9 r-yyyyoo r-16y2uox r-lwhw9o r-dnmrzs r-bnwqim r-1plcrui r-lrvibr"
                            >
                              <g>
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                              </g>
                            </svg>
                          </div>
                        </a>
                      </div>
                    </Card.Content>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
        <div className="admin_user_datas_continer">
          <div className="welcome_admin_name">
            <h3>
              <spn id="inside_h3_admin_welcome">WelcomeBack!👋</spn>:{" "}
              {get_Admin_name}
            </h3>
          </div>
          <div className="viwe_for_admin_option">
            <Menu pointing secondary>
              <div className="all_option_position">
                <div className="all_user_and_count_contain">
                  {" "}
                  <Menu.Item
                    name="All Users"
                    active={manustate === "home"}
                    onClick={() => setManustate("home")}
                  />
                  <span>{getUser.length}</span>
                </div>
                <Menu.Item
                  name="Blood Donars"
                  active={manustate === "messages"}
                  onClick={() => setManustate("messages")}
                />
                <Menu.Item
                  name="Blood Camps"
                  active={manustate === "Camps"}
                  onClick={() => setManustate("Camps")}
                />
                <Menu.Item
                  name="Other Activity"
                  active={manustate === "OtherActivitys"}
                  onClick={() => setManustate("OtherActivitys")}
                />
              </div>
              <Menu.Menu position="right">
                <Menu.Item
                  name="logout"
                  id="admin_lagout"
                  active={manustate === "logout"}
                  onClick={() => (window.location.href = "/Admin26")}
                />
              </Menu.Menu>
            </Menu>
          </div>
          <div className="dropdown_and_donater_datas_con">
            {manustate === "home" ? (
              <div className="user_login_continar">
                <Grid columns="equal" divided>
                  {getUser.length == 0 ? (
                    <h2
                      style={{
                        color: "red",
                        marginTop: "5%",
                        fontFamily: "Dancing Script, cursive",
                        fontWeight: "800",
                      }}
                    >
                      No one register yet!
                    </h2>
                  ) : (
                    <></>
                  )}
                  <div className="city_card111">
                    {getUser.map((list) => {
                      return (
                        <Card className="user_card_view">
                          <h3>{list.Name}</h3>
                          <div
                            style={{ backgroundColor: "black", height: "1px" }}
                          ></div>
                          <h4 style={{ padding: "0px" }}>
                            {list.Email}
                            <br></br>
                          </h4>
                          <p>
                            <span
                              style={{
                                color: "black",
                                fontWeight: "700",
                                fontFamily: "monospace",
                                marginTop: "-7px",
                              }}
                            >
                              Password
                            </span>
                            : {list.Password}
                          </p>
                          <div id="user_info_card">
                            <p>
                              User was create this account<br></br>
                              <span>
                                @{list.user_register_date} at {list.Time}
                              </span>{" "}
                              <br></br>and user id is <br></br>
                              <span>{list.id}</span>
                            </p>
                          </div>
                          <Button
                            onClick={() => remove_User_Account(list.id)}
                            id="remove_user"
                            negative
                          >
                            Remove
                          </Button>
                        </Card>
                      );
                    })}
                  </div>
                </Grid>
              </div>
            ) : (
              <></>
            )}
            {manustate === "messages" ? (
              <>
                <div className="search_hospital_dropdown">
                  <Dropdown
                    id="dropdown_style"
                    fluid
                    search
                    selection
                    placeholder="Hospital"
                    options={friendOptions}
                    onChange={get_dropdown_value}
                  />
                </div>
                <div className="info1_contian">
                  {Donator.length === 0 ? (
                    <h1
                      style={{
                        color: "red",
                        fontFamily: "Dancing Script, cursive",
                        fontSize: "5vh",
                        marginTop: "25vh",
                      }}
                    >
                      select any one of the hospitals from the above list
                    </h1>
                  ) : (
                    ""
                  )}

                  <Grid columns="equal" divided>
                    <div className="city_card11">
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
                                  <span
                                    id="donator_name"
                                    title={list.Hospital_name}
                                  >
                                    {list.Donator_name}
                                  </span>
                                </Card.Header>
                              </div>

                              <i
                                className="fa fa-solid fa-droplet"
                                id="Donator_blood"
                              >
                                <span>{list.Blood}</span>
                              </i>

                              <div className="hospital_info">
                                <Feed.Summary>
                                  <div
                                    style={{
                                      display: "flex",
                                      position: "relative",
                                    }}
                                  >
                                    <span>Status :- </span>{" "}
                                    <div className="Avaliable_status2">
                                      {list.Status == true ? (
                                        <div>
                                          <p>Avaliable</p>
                                        </div>
                                      ) : (
                                        <div>
                                          <p style={{ color: "red" }}>
                                            Not Available
                                          </p>
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
                                  <span id="donator_info">
                                    {list.Donator_email}
                                  </span>
                                </Feed.Summary>
                                <Feed.Summary>
                                  <div className="donator_address">
                                    <span>Address:- </span>
                                    <span id="donator_info">
                                      {list.Address}
                                    </span>
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
                                  <p hidden id="single_id">
                                    {list.id}
                                  </p>
                                  <div className="ui two buttons">
                                    <Button
                                      inverted
                                      className="city_bttn1"
                                      color="red"
                                      onClick={() =>
                                        delete_Donator_profile(list.id)
                                      }
                                    >
                                      <span>Remove</span>
                                    </Button>
                                  </div>
                                </Card.Content>
                              </div>
                            </Card.Content>
                          </Card>
                        );
                      })}
                    </div>
                  </Grid>
                </div>
              </>
            ) : (
              <></>
            )}
            {manustate === "Camps" ? (
              <div className="admin_post_view1">
                <div className="search_hospital_dropdown">
                  <Dropdown
                    id="blood_camp_dropdown_style"
                    fluid
                    search
                    selection
                    placeholder="Search Distric"
                    options={friend_District}
                    onChange={get_dropdown_value2}
                  />
                </div>
                <div className="admin_post_view">
                  {Distric_blood_camp.length === 0 ? (
                    <h1
                      style={{
                        color: "red",
                        fontFamily: "Dancing Script, cursive",
                        fontSize: "5vh",
                        marginTop: "25vh",
                      }}
                    >
                      Not avalible any blood camps yet!
                    </h1>
                  ) : (
                    ""
                  )}
                  {Distric_blood_camp.map((list) => {
                    return (
                      <div className="blood_camps_view_continar_admin">
                        <img src={list.img}></img>
                        <div className="blood_edit_del_info_button_admin">
                          <span>
                            <Button
                              primary
                              id="btn_1_admin"
                              onClick={() => get_more_info_for_post(list)}
                            >
                              More
                            </Button>
                          </span>
                          <span>
                            <Button
                              positive
                              id="btn_1_admin"
                              onClick={() => Camps_comments(list.id)}
                            >
                              Comments
                            </Button>
                          </span>
                          <span>
                            <Button
                              negative
                              id="btn_1_admin"
                              onClick={() => delete_post_for_admin(list.id)}
                            >
                              Remove
                            </Button>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <></>
            )}
            {manustate === "OtherActivitys" ? (
              <div className="user_login_continar">
                <a
                  href="https://console.firebase.google.com/project/blood-donars-594f5/firestore/data/~2F"
                  target="_blank"
                  id="visite_firebase"
                  hidden
                ></a>
                <a
                  href="https://console.firebase.google.com/project/blood-donars-594f5/firestore/data/~2FMM%20Multi%20Speciality%20Hospital1~2FMdGiWTISMLZ4ytON6K3u"
                  target="_blank"
                  id="visite_hospital_data"
                  hidden
                ></a>
                <a
                  href="https://console.firebase.google.com/project/blood-donars-594f5/firestore/data/~2FMM%20Multi%20Speciality%20Hospital1~2FMdGiWTISMLZ4ytON6K3u"
                  target="_blank"
                  id="visite_firebase"
                  hidden
                ></a>
                <a
                  href="https://console.firebase.google.com/project/blood-donars-594f5/firestore/data/~2FMM%20Multi%20Speciality%20Hospital1~2FMdGiWTISMLZ4ytON6K3u"
                  target="_blank"
                  id="visite_firebase"
                  hidden
                ></a>
                <a
                  href="https://console.firebase.google.com/project/blood-donars-594f5/firestore/data/~2FMM%20Multi%20Speciality%20Hospital1~2FMdGiWTISMLZ4ytON6K3u"
                  target="_blank"
                  id="visite_firebase"
                  hidden
                ></a>
                <a
                  href="https://console.firebase.google.com/project/blood-donars-594f5/firestore/data/~2FMM%20Multi%20Speciality%20Hospital1~2FMdGiWTISMLZ4ytON6K3u"
                  target="_blank"
                  id="visite_firebase"
                  hidden
                ></a>
                <div className="web_datas_contian">
                  <div className="web_message_continar">
                    <Message
                      id="web_message_datas"
                      icon="database"
                      header="Firebase Database"
                      onClick={() =>
                        document.getElementById("visite_firebase").click()
                      }
                      content="For storing donor credentials and their posts"
                    />
                  </div>
                  <div className="web_message_continar">
                    <Message
                      id="web_message_datas"
                      icon="hospital outline"
                      header="Google sheet API"
                      onClick={() =>
                        document.getElementById("visite_hospital_data").click()
                      }
                      content="Used to store more hospitals."
                    />
                  </div>
                  <div className="web_message_continar">
                    <Message
                      id="web_message_datas"
                      icon="tag"
                      header="Google sheet district API"
                      onClick={() =>
                        document.getElementById("visite_firebase").click()
                      }
                      content="Used for storing the disctricts within tamilnadu"
                    />
                  </div>
                  <div className="web_message_continar">
                    <Message
                      id="web_message_datas"
                      icon="github"
                      header="GitHub for colloboration"
                      onClick={() =>
                        document.getElementById("visite_firebase").click()
                      }
                      content="Version control system for our project"
                    />
                  </div>
                  <div className="web_message_continar">
                    <Message
                      id="web_message_datas"
                      icon="users"
                      header="Firebase Databse for Users"
                      onClick={() =>
                        document.getElementById("visite_firebase").click()
                      }
                      content="For storing user credentials"
                    />
                  </div>
                  <div className="web_message_continar">
                    <Message
                      id="web_message_datas"
                      icon="server"
                      header="Render.com"
                      onClick={() =>
                        document.getElementById("visite_firebase").click()
                      }
                      content="We use this platform for deploying our website"
                    />
                  </div>
                  <div className="web_message_continar">
                    <Message
                      id="web_message_datas"
                      icon="mail outline"
                      header="Emailjs Middleware"
                      onClick={() =>
                        document.getElementById("visite_firebase").click()
                      }
                      content="We used this middleware to make automation in mail sending to the donors"
                    />
                  </div>
                  <div className="web_message_continar">
                    <Message
                      id="web_message_datas"
                      icon="grid layout"
                      header="SheetDB"
                      content="For converting the google sheets into JSON format."
                      onClick={() =>
                        document.getElementById("visite_firebase").click()
                      }
                    />
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
          {open && (
            <Admin_camp_data_view
              open={open}
              setOpen={setOpen}
              obj_of_datas={More_info_camps}
            />
          )}
          {comment_open && (
            <Camp_comments_admin
              open={comment_open}
              setOpen={setComment_open}
              collection_name={getcollection_for_blood_camps}
              id={getcomment_id}
            />
          )}
        </div>
      </div>
    </>
  );
};
export default Admin;
