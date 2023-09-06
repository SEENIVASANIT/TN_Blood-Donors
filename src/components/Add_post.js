import React, { useEffect, useState } from "react";
import { Button } from "semantic-ui-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import "../components/Add_post.css";
import swal from "sweetalert2";
import { storage, db } from "../firebase";
import {
  doc,
  collection,
  setDoc,
  updateDoc,
  getDoc,
  addDoc,
  query,
  getDocs,
  deleteDoc,
  orderBy,
  serverTimestamp,
} from "@firebase/firestore";
const initialState = {
  camp_name: "",
  campaddress: "",
  camp_Date: "",
  Mobile: "",
  Moreinfo: "",
};
const Add_post = ({
  open,
  setOpen,
  District,
  update_id,
  update_img,
  post_update_message,
}) => {
  const [description_data, set_Description_Data] = useState(initialState);
  const [post_image, setPost_image] = useState({});
  const { camp_name, campaddress, camp_Date, Mobile, Moreinfo } =
    description_data;
  const [selectImg, setSelectImg] = useState();
  const wrapper = document.querySelector(".post_img_wrapper");
  const fileName = document.querySelector(".file-name");
  const cancelBtn = document.querySelector("#cancel-btn i");
  var [file, setFile] = useState(null);
  const [progress, setProgress] = useState(null);
  const commet_collections = District + "blood_camps";

  const select_img = () => {
    const defaultBtn = document.getElementById("default-btn");
    defaultBtn.click();
  };
  useEffect(() => {
    update_id && getSingleuser();
    if (update_img !== false) {
      setProgress(100);
    }
  }, [update_id]);
  const getSingleuser = async () => {
    const docRef = doc(db, commet_collections, update_id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      set_Description_Data({ ...snapshot.data() });
    }
  };
  const imagechange = (e) => {
    //        const defaultBtn = document.getElementById("default-btn");
    //       defaultBtn.click();
    if (update_img !== false) {
      document.getElementById("display-upimg").style.display = "none";
    }
    setSelectImg(e);
    wrapper?.classList.add("active");

    cancelBtn?.addEventListener("click", () => {
      setSelectImg();
      setFile(null);

      wrapper.classList.remove("active");
    });
    fileName.textContent = e.name;
  };
  const handleChange = (e) => {
    //INPUT TO TAKE THE DATA
    set_Description_Data({
      ...description_data,
      [e.target.name]: e.target.value,
    });
  };
  useEffect(() => {
    if (update_img === false) {
      document.getElementById("display-upimg").style.display = "none";
    }

    file && imagechange(file);
  }, [file]);

  useEffect(() => {
    const uploadFile = () => {
      //imagechange(file);
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
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            //GET IMAGE URL
            setPost_image((prev) => ({ ...prev, img: downloadURL })); //Upload DATA TO FIRSTORE
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);

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
  const get_date = new Date();
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    //SUBMIT THE ALL DATA
    if (!update_id) {
      try {
        //ADD DADA UPLOAD TO COLLECTION FIREBASE
        /// *THIS COLLECTION IN CHANGE FOR CITYS* /////////////////////
        const get_post_data = new FormData(e.target); //Upload DATA TO FIRSTORE
        await addDoc(
          collection(db, commet_collections),
          {
            camp_name: get_post_data.get("camp_name"),
            campaddress: get_post_data.get("campaddress"),
            camp_Date: get_post_data.get("camp_Date"),
            Mobile: get_post_data.get("Mobile"),
            Moreinfo: get_post_data.get("Moreinfo"),
            Uploader_name: window.sessionStorage.getItem("name"),
            Uploader_id: window.sessionStorage.getItem("user_id"),
            publish_post_date: Current_date,
            timstamp: serverTimestamp(),
            ...post_image,
            Time: time,
          },
          await swal.fire({
            icon: "success",
            title: "<h3>Post added successfully!</h3>",
            text: "Thanku for shere this inforamation!",
            showConfirmButton: false,
            timer: 1500,
          })
        );
      } catch (error) {
        swal.fire("Oops!", "Some network error so try again!!!", "error");
      }
      setOpen(false);
    } else {
      try {
        //*UPDATE THE DATA IN FIREBASE*//
        await updateDoc(
          doc(db, commet_collections, update_id),
          {
            ...description_data,
            ...post_image,
            timstamp: serverTimestamp(),
          },
          post_update_message()
        );
      } catch (error) {
        swal.fire("Oops!", "Some network error so try again!!!", "error");
      }
      setOpen(false);
    }
  };

  return (
    <div className="add_post_contianer">
      <div className="add_post_input_con">
        <form onSubmit={handleSubmit} method="POST">
          <div class="img_post_container">
            <div class="post_img_wrapper">
              <div class="select_image" onClick={() => select_img()}>
                {selectImg && (
                  <img
                    src={URL.createObjectURL(selectImg)}
                    alt=""
                    id="display-img"
                  />
                )}
                <img src={update_img} alt="" id="display-upimg" />
              </div>
              <div class="insite_content">
                <div class="file-icon">
                  <i
                    style={{ cursor: "pointer" }}
                    class="fas fa-cloud-upload-alt"
                    onClick={() => select_img()}
                  ></i>
                </div>
                <div class="show_text_below_icon">
                  No file chosen, yet!{" "}
                  <p
                    id="brouse"
                    onClick={() => select_img()}
                    //   style={{ color: "blue", cursor: "pointer" }}
                  >
                    Browrs
                  </p>
                </div>
              </div>
              <div id="cancel-btn">
                <i class="fas fa-times"></i>
              </div>
              <div class="file-name">File name here</div>
            </div>

            <input
              id="default-btn"
              type="file"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
              hidden
            />
          </div>

          <div id="posttitlediv">
            <input
              type="text"
              placeholder="Enter Camp Name*"
              name="camp_name"
              onChange={handleChange}
              value={camp_name}
              required
            />
          </div>
          <div className="Verification_input-field1">
            <input
              type="text"
              placeholder="Enter Camp Location *"
              name="campaddress"
              onChange={handleChange}
              value={campaddress}
              required
            />
            <span></span>
            <input
              type="date"
              placeholder="The Day Of The Camp *"
              name="camp_Date"
              onChange={handleChange}
              value={camp_Date}
              id="camp_date"
              required
            />
          </div>
          <div className="Verification_input-field1">
            <input
              type="tel"
              pattern="^[6-9]\d{9}"
              placeholder="Incharge Phone No *"
              name="Mobile"
              onChange={handleChange}
              value={Mobile}
              // title={description_data.image_Description}
              required
            />

            <span></span>

            <input
              type="text"
              placeholder="more-info-link"
              name="Moreinfo"
              onChange={handleChange}
              value={Moreinfo}
              // title={description_data.image_Description}
            />
          </div>
          <div id="post-cancle-bttn-con">
            <Button
              size="large"
              positive
              type="submit"
              id="upload-psat-all"
              disabled={progress < 100}
            >
              <span>Upload</span>
            </Button>
            <Button
              id="cancal-post-input"
              primary
              onClick={() => setOpen(false)}
            >
              <span>Cancle</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Add_post;
