import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../components/Blood_donator_form.css";
import { storage, db } from "../firebase";
import swal from "sweetalert2";
import {
  addDoc,
  collection,
  getDoc,
  doc,
  serverTimestamp,
  updateDoc,
  limitToLast,
} from "firebase/firestore";
import { list } from "firebase/storage";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Button } from "semantic-ui-react";
import emailjs from "@emailjs/browser";
const Blood_donator_form = ({
  open,
  setOpen,
  Hospital_name,
  Hospital_id,
  pageload,
  list,
}) => {
  const [file, setFile] = useState(null);

  const id = list;

  const initialState = {
    Phone: "",
    Dob: "",
    Age: "",
    Blood: "",
    Address: "",
    img: "",
  };

  const [data, setData] = useState(initialState);
  const { Phone, Dob, Age, Blood, Address, img } = data;
  const [setimg, setImg] = useState({});
  const [progress, setProgress] = useState(null);
  const [users, setUsers] = useState([]); //SET DATA
  useEffect(() => {
    id && getSingleuser();
  }, [id]);
  const getSingleuser = async () => {
    const docRef = doc(db, Hospital_name + Hospital_id, id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      setData({ ...snapshot.data() });
    }
  };

  useEffect(() => {
    const uploadFile = () => {
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
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            //GET IMAGE URL

            id
              ? setData((prev) => ({ ...prev, img: downloadURL }))
              : setImg((prev) => ({ ...prev, img: downloadURL })); //Upload DATA TO FIRSTORE
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);
  const handleSubmit = async (e) => {
    //SUBMIT THE ALL DATA

    e.preventDefault();

    if (!id) {
      const user_datas = new FormData(e.target); //Upload DATA TO FIRSTORE
      try {
        //ADD DADA UPLOAD TO COLLECTION FIREBASE
        /// *THIS COLLECTION IN CHANGE FOR CITYS* ////////////////////
        const monthNames = [
          "January",
          "February",
          "March",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        const today = new Date();
        var dd = String(today.getDate()).padStart(2, "0");
        var mm = String(today.getMonth() - 2);
        var yyyy = today.getFullYear();
        const time = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        const send_mail_for_Blood_Donar = {
          To_bloodDonar: window.sessionStorage.getItem("email"),
          Donar_name: window.sessionStorage.getItem("name"),
          blood_group: user_datas.get("Blood"),
          Age: user_datas.get("Age"),
          dob: user_datas.get("Dob"),
          Mobile: user_datas.get("Phone"),
          Address: user_datas.get("Address"),
          hospital: Hospital_name,
          Date: monthNames[mm] + " " + dd + " " + yyyy,
          Time: time,
        };
        await addDoc(
          collection(db, Hospital_name + Hospital_id),
          {
            Age: user_datas.get("Age"),
            Dob: user_datas.get("Dob"),
            Phone: user_datas.get("Phone"),
            Blood: user_datas.get("Blood"),
            Address: user_datas.get("Address"),
            Genter: user_datas.get("Genter"),
            ...setimg,
            Status: true,
            Allow_Donation: false,
            Hospital_id: Hospital_id,
            Hospital_name: Hospital_name,
            Blood_donator_id: window.sessionStorage.getItem("user_id"),
            Donator_name: window.sessionStorage.getItem("name"),
            Donator_email: window.sessionStorage.getItem("email"),
            timstamp: serverTimestamp(),
          },
          pageload(),
          //emailjs.send(
          //   "service_ywzxyxg",
          //   "template_3huhcy7",
          //   send_mail_for_Blood_Donar,
          //   "dh_ZTI21bagX5IQK7"
          // ),
          setOpen(false)
        );
      } catch (error) {
        swal.fire("Oops!", "Some network error so tryagain!!!", "error");
      }
    } else {
      try {
        //*UPDATE THE DATA IN FIREBASE*//
        const user_datas = new FormData(e.target); //Upload DATA TO FIRSTORE

        await updateDoc(
          doc(db, Hospital_name + Hospital_id, id),
          {
            ...data,
            Genter: user_datas.get("Genter"),
            timstamp: serverTimestamp(),
          },
          await swal.fire({
            icon: "success",
            title: "Updated!",
            showConfirmButton: false,
            timer: 1500,
            footer: "<h4>Update your profile successfully!</h4>",
          }),
          setOpen(false)
        );
      } catch (error) {
        swal.fire("Oops!", "Some network error so tryagain!!!", "error");
      }
    }
  };
  const Response_handleSubmit = async (e) => {
    //SUBMIT THE ALL DATA
    e.preventDefault();

    if (!id) {
      const user_datas = new FormData(e.target);
      try {
        //ADD DADA UPLOAD TO COLLECTION FIREBASE
        /// *THIS COLLECTION IN CHANGE FOR CITYS* ////////////////////
        await addDoc(
          collection(db, Hospital_name + Hospital_id),
          {
            Age: user_datas.get("Age"),
            Dob: user_datas.get("Dob"),
            Phone: user_datas.get("Phone"),
            Blood: user_datas.get("Blood"),
            Address: user_datas.get("Address"),
            Genter: user_datas.get("Genter"),
            ...setimg,
            Hospital_id: Hospital_id,
            Hospital_name: Hospital_name,
            Blood_donator_id: window.sessionStorage.getItem("user_id"),
            Donator_name: window.sessionStorage.getItem("name"),
            Donator_email: window.sessionStorage.getItem("email"),
            timstamp: serverTimestamp(),
          },
          pageload(),
          setOpen(false)
        );
      } catch (error) {
        swal.fire("Oops!", "Some network error so tryagain!!!", "error");
      }
    } else {
      try {
        //*UPDATE THE DATA IN FIREBASE*//
        const user_datas = new FormData(e.target);
        await updateDoc(
          doc(db, Hospital_name + Hospital_id, id),
          {
            ...data,
            Genter: user_datas.get("Genter"),
            timstamp: serverTimestamp(),
          },
          await swal.fire({
            icon: "success",
            title: "Updated!",
            showConfirmButton: false,
            timer: 1500,
          }),
          setOpen(false)
        );
      } catch (error) {
        swal.fire("Oops!", "Some network error so tryagain!!!", "error");
      }
    }
  };
  //if update value not edit check this funtion
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  //set blood donors eligibility date
  const blood_donor_eligibility_start = new Date();
  blood_donor_eligibility_start.setDate(
    blood_donor_eligibility_start.getDate() - 6570
  );
  const blood_donor_eligibility_end = new Date();
  blood_donor_eligibility_end.setDate(
    blood_donor_eligibility_end.getDate() - 21900
  );

  //alert(blood_donor_eligibility.toISOString().slice(0, 10));
  return (
    <div className="donatar_register_form">
      <div className="response_window_form">
        <section class="Reg_form_container">
          <header>Registration Form</header>
          <form class="reg_form" onSubmit={handleSubmit} method="POST">
            <div class="input-box">
              <label>Name</label>
              <div className="defult_name">
                <h4>{window.sessionStorage.getItem("name")}</h4>
              </div>
            </div>

            <div class="column" id="display_non_1">
              <div class="input-box">
                <label>Email</label>
                <div className="defult_email">
                  <h4>{window.sessionStorage.getItem("email")}</h4>
                </div>
              </div>
              <div class="input-box">
                <label>Age</label>
                <input
                  type="number"
                  name="Age"
                  onChange={handleChange}
                  value={Age}
                  min="18"
                  max="60"
                  placeholder="Enter Age"
                  required
                />
              </div>
            </div>

            <div class="column" id="display_non_1">
              <div class="input-box">
                <label>Phone Number</label>
                <input
                  type="tel"
                  pattern="^[6-9]\d{9}"
                  placeholder="Enter phone number"
                  name="Phone"
                  onChange={handleChange}
                  value={Phone}
                  maxLength={10}
                  required
                />
              </div>
              <div class="input-box">
                <label>Birth Date</label>

                <input
                  type="date"
                  max={blood_donor_eligibility_start.toISOString().slice(0, 10)}
                  min={blood_donor_eligibility_end.toISOString().slice(0, 10)}
                  placeholder="Enter birth date"
                  name="Dob"
                  onChange={handleChange}
                  value={Dob}
                  required
                />
              </div>
            </div>
            <div class="gender-box">
              <h3>Gender</h3>
              <div class="gender-option">
                <div class="gender">
                  <input
                    type="radio"
                    id="check-male"
                    value={"Male"}
                    name="Genter"
                    required
                  />
                  <label for="check-male">male</label>
                </div>
                <div class="gender">
                  <input
                    type="radio"
                    id="check-female"
                    name="Genter"
                    value={"Female"}
                  />
                  <label for="check-female">Female</label>
                </div>
                <div class="gender">
                  <input
                    type="radio"
                    id="check-other"
                    name="Genter"
                    value={"Other"}
                  />
                  <label for="check-other">Other</label>
                </div>
              </div>
            </div>
            <div class="input-box address">
              <div class="column" id="display_non_1">
                <div class="input-box">
                  <label>Blood Group</label>
                  <div class="select-box">
                    <select
                      name="Blood"
                      onChange={handleChange}
                      value={Blood}
                      required
                    >
                      <option value="" hidden>
                        Select Blood group
                      </option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="A1+">A1+</option>
                      <option value="A1-">A1-</option>
                      <option value="A2+">A2+</option>
                      <option value="A2-">A2-</option>
                      <option value="A1B+">A1B+</option>
                      <option value="A1B-">A1B-</option>
                      <option value="A2B+">A2B+</option>
                      <option value="A2B-">A2B-</option>
                    </select>
                  </div>
                </div>
                <div class="input-box">
                  <label>Your Profile</label>
                  <input
                    type="file"
                    name="img"
                    placeholder="Upload your profile!"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </div>
              </div>

              <label>Address</label>
              <input
                type="text"
                name="Address"
                id="donatar_address"
                value={Address}
                onChange={handleChange}
                placeholder="Enter street address short form"
                required
              />
            </div>
            <div className="regster_and_close">
              {id ? (
                <Button
                  positive
                  disabled={
                    (id == null && progress == null) ||
                    (progress !== null && progress < 100)
                  }
                >
                  <span>Update</span>
                </Button>
              ) : (
                <Button
                  positive
                  disabled={
                    (id == null && progress == null) ||
                    (progress !== null && progress < 100)
                  }
                >
                  <span>Submit</span>
                </Button>
              )}

              <p></p>
              <Button negative onClick={() => setOpen(false)}>
                <span>Close</span>
              </Button>
            </div>
          </form>
        </section>
      </div>

      {/* response */}

      <div className="response_reg">
        <section class="Reg_form_container">
          <header>Registration Form</header>
          <form class="reg_form" onSubmit={Response_handleSubmit} method="POST">
            <div class="input-box">
              <label>Name</label>
              <div className="defult_name">
                <h4>{window.sessionStorage.getItem("name")}</h4>
              </div>
            </div>

            <div id="display_non_con">
              <div class="input-box">
                <label>Email</label>
                <div className="defult_email">
                  <h4>{window.sessionStorage.getItem("email")}</h4>
                </div>
              </div>
              <div class="input-box">
                <label>Age</label>
                <input
                  type="number"
                  onChange={handleChange}
                  name="Age"
                  value={Age}
                  min="18"
                  max="60"
                  placeholder="Enter Age"
                  required
                />
              </div>
            </div>
            <div id="display_non_con">
              <div class="input-box">
                <label>Phone Number</label>
                <input
                  type="tel"
                  pattern="^[6-9]\d{9}"
                  placeholder="Enter phone number"
                  name="Phone"
                  onChange={handleChange}
                  value={Phone}
                  maxLength={10}
                  required
                />
              </div>
              <div class="input-box">
                <label>Birth Date</label>
                <input
                  type="date"
                  max={blood_donor_eligibility_start.toISOString().slice(0, 10)}
                  min={blood_donor_eligibility_end.toISOString().slice(0, 10)}
                  placeholder="Enter birth date"
                  name="Dob"
                  value={Dob}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div class="gender-box">
              <h3>Gender</h3>
              <div class="gender-option">
                <div class="gender">
                  <input
                    type="radio"
                    id="check-male"
                    value={"Male"}
                    name="Genter"
                    required
                  />
                  <label for="check-male">male</label>
                </div>
                <div class="gender">
                  <input
                    type="radio"
                    id="check-female"
                    name="Genter"
                    value={"Female"}
                  />
                  <label for="check-female">Female</label>
                </div>
                <div class="gender">
                  <input
                    type="radio"
                    id="check-other"
                    name="Genter"
                    value={"Other"}
                  />
                  <label for="check-other">Other</label>
                </div>
              </div>
            </div>
            <div class="input-box address">
              <div id="display_non_con">
                <div class="input-box">
                  <label>Blood Group</label>
                  <div class="select-box">
                    <select
                      name="Blood"
                      value={Blood}
                      onChange={handleChange}
                      required
                    >
                      <option value="" hidden>
                        Select Blood group
                      </option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="A1+">A1+</option>
                      <option value="A1-">A1-</option>
                      <option value="A2+">A2+</option>
                      <option value="A2-">A2-</option>
                      <option value="A1B+">A1B+</option>
                      <option value="A1B-">A1B-</option>
                      <option value="A2B+">A2B+</option>
                      <option value="A2B-">A2B-</option>
                    </select>
                  </div>
                </div>
                <div class="input-box">
                  <label>Your Profile</label>
                  <input
                    type="file"
                    name="img"
                    placeholder="Upload your profile!"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </div>
              </div>
              <label id="donatar_address">Address</label>
              <input
                type="text"
                name="Address"
                value={Address}
                placeholder="Enter street address short form"
                required
                onChange={handleChange}
              />
            </div>
            <div className="regster_and_close">
              {id ? (
                <Button
                  positive
                  disabled={
                    (id == null && progress == null) ||
                    (progress !== null && progress < 100)
                  }
                >
                  <span>Update</span>
                </Button>
              ) : (
                <Button
                  positive
                  disabled={
                    (id == null && progress == null) ||
                    (progress !== null && progress < 100)
                  }
                >
                  <span>Submit</span>
                </Button>
              )}
              <p></p>
              <Button negative onClick={() => setOpen(false)}>
                <span>Close</span>
              </Button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};
export default Blood_donator_form;
