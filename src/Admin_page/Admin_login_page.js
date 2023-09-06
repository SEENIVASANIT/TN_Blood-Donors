import React from "react";
import { useEffect, useState } from "react";
import { Card, Image, Button, Grid } from "semantic-ui-react";

import swal from "sweetalert2";
import {
  addDoc,
  collection,
  getDocs,
  doc,
  serverTimestamp,
  updateDoc,
  limitToLast,
} from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import "../Admin_page/Admin_login_page.css";
const Admin_login_page = () => {
  const [Admin, setAdmin] = useState([]); //SET DATA
  const navigate = useNavigate();
  const AdminCollectionRef = collection(db, "Admins");
  useEffect(() => {
    getUsers();
  }, []);
  var getUsers = async () => {
    const data = await getDocs(AdminCollectionRef);
    setAdmin(
      data.docs.map((doc) => ({
        //OFTER CHECKING SET THA ALL DATA.
        ...doc.data(),
        id: doc.id,
      }))
    );
  };
  const handleLogin = async (e) => {
    //SUBMIT THE ALL DATA
    e.preventDefault();
    const login_datas = new FormData(e.target);
    let check_mail = true;
    Admin.map(async (item) => {
      if (
        item.Email == login_datas.get("email") &&
        item.admin_Name.toLocaleLowerCase() ===
          login_datas.get("name").toLocaleLowerCase()
      ) {
        check_mail = false;
        await swal
          .fire({
            icon: "success",
            title: `<h3>Welcome, ${login_datas.get("name")}👋</h3>`,
            showConfirmButton: false,
            timer: 1500,
          })
          .then(() => {
            navigate("/Admin_Activity", {
              state: {
                Admin_name: item.admin_Name,
              },
            });
          });
      }
    });
    if (check_mail) {
      swal.fire({
        icon: "error",
        title: `<h3>Invalid login credentials.</h3>`,
        text: `Only admin can have the Access!`,
        showConfirmButton: false,
        timer: 1600,
      });
    }
  };
  return (
    <div className="admin_first_page">
      <h1>TN Blood Donors, Admin portal.</h1>
      <div className="loginpage_admin">
        <div className="Admin_login_form animate__animated animate__backInDown">
          <div className="Admi_login_contan">
            <div className="adminlogin_info">
              <h3>Admin's Login</h3>
              <p>Please enter your credentials to login.</p>
            </div>
          </div>
          <form class="Aminloginform" onSubmit={handleLogin}>
            <input type="text" name="name" placeholder="Enter your Name" />
            <input type="email" name="email" placeholder="Enter your Email" />
            <button>login</button>
            <p class="Adminmessage">
              Forget your login credentials?{" "}
              <a href="#">Mali to other Admin.</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Admin_login_page;
