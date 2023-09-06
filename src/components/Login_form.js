import React, { useState, useEffect } from "react";
import "../components/Login_form.css";
import { Button, Item, Message, Confirm, Icon } from "semantic-ui-react";
import { db } from "../firebase";
import swal from "sweetalert2";
import emailjs from "@emailjs/browser";

import { ToastContainer, toast } from "react-toastify";
import {
  addDoc,
  collection,
  getDocs,
  doc,
  serverTimestamp,
  updateDoc,
  limitToLast,
} from "firebase/firestore";
import { list } from "firebase/storage";
const Login_form = ({ open, setOpen, getdata }) => {
  const [users, setUsers] = useState([]); //SET DATA

  const usersCollectionRef = collection(db, "Blood_donator_login");
  useEffect(() => {
    getUsers();
  }, []);
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

  const handleSubmit = async (e) => {
    //SUBMIT THE ALL DATA
    e.preventDefault(); //page not reload
    const get_date = new Date();
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
    const Current_date =
      monthNames[get_date.getMonth()] +
      " " +
      String(get_date.getDate()).padStart(2, "0") +
      "-" +
      get_date.getFullYear();
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const user_datas = new FormData(e.target);
    let check_mail = true;
    users.map((item) => {
      if (item.Email === user_datas.get("email")) {
        swal.fire("Oops!", "Email already use!", "error");
        check_mail = false;
      }
    });

    if (check_mail) {
      try {
        //ADD DADA UPLOAD TO COLLECTION FIREBASE
        /// *THIS COLLECTION IN CHANGE FOR CITYS* /////////////////////
        const user_Account = {
          user_name: user_datas.get("name"),
          userpassword: user_datas.get("password"),
          mail_to: user_datas.get("email"),
          date: Current_date,
          time: time,
        };
        await addDoc(collection(db, "Blood_donator_login"), {
          Name: user_datas.get("name"),
          Email: user_datas.get("email"),
          Password: user_datas.get("password"),
          timstamp: serverTimestamp(),
          user_register_date: Current_date,
          Time: time,
        });

        // emailjs.send(
        //   "service_ywzxyxg",
        //   "template_vgyybeq",
        //   user_Account,
        //   "dh_ZTI21bagX5IQK7"
        // );

        getdata(user_datas.get("email"));
      } catch (error) {
        swal.fire("Oops!", "Some network error so tryagain!!!", "error");
      }
    }
  };
  const handleLogin = async (e) => {
    //SUBMIT THE ALL DATA
    e.preventDefault();
    const user_datas = new FormData(e.target);
    let check_mail = true;
    users.map((item) => {
      if (
        item.Email === user_datas.get("email") &&
        item.Password === user_datas.get("password")
      ) {
        check_mail = false;
        getdata(user_datas.get("email"));
        // json_data[0].donater_name=user_datas.get("name")
        // json_data[0].donater_emil=user_datas.get("email")
        // setOpen(false)
      }
    });
    if (check_mail) {
      swal.fire("Oops!", "Invalid gmail or password!", "error");
    }
  };
  return (
    <>
      <div className="login_model">
        <div className="close_model">
          <span>
            <Button
              className="close_login_btn"
              content="CLOSE"
              size="large"
              labelPosition="right"
              icon="close"
              onClick={() => setOpen(false)}
              negative
            />
          </span>
          <div className="container">
            <input type="checkbox" id="check" />
            <div className="login form">
              <header>
                <span>Donor Login</span>
              </header>
              <form onSubmit={handleLogin} method="POST">
                <input
                  type="text"
                  placeholder="Enter your email"
                  name="email"
                  required
                />
                <input
                  type="password"
                  placeholder="Enter your password"
                  name="password"
                  required
                />
                <a
                  href="javascript:"
                  onClick={() =>
                    swal.fire({
                      icon: "info",
                      title:
                        "Your login detail alerady send your mail address.",
                      showClass: {
                        popup: "animate__animated animate__fadeInDown",
                      },
                      hideClass: {
                        popup: "animate__animated animate__fadeOutUp",
                      },
                    })
                  }
                >
                  Forgot password?
                </a>
                <input type="submit" className="button" value="Login" />
              </form>
              <div className="signup">
                <span className="signup">
                  Don't have an account?
                  <label for="check">Signup</label>
                </span>
              </div>
            </div>
            <div className="registration form">
              <header>
                <span>Now Donor Signup</span>
              </header>
              <form onSubmit={handleSubmit} method="POST">
                <input
                  type="text"
                  placeholder="Enter your name"
                  required
                  name="name"
                />
                <input
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                  required
                />
                <input
                  type="password"
                  placeholder="Create a password"
                  name="password"
                  required
                />
                <input type="submit" className="button" value="Signup" />
              </form>
              <div className="signup">
                <span className="signup">
                  Already have an account?
                  <label for="check" id="again_login">
                    Login
                  </label>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Login_form;
