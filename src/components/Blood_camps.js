import React, { useState, useEffect } from "react";
import {
  Card,
  Image,
  Button,
  Grid,
  Segment,
  Dimmer,
  Popup,
  Loader,
  Feed,
  Icon,
} from "semantic-ui-react";
import "../components/Blood_camps.css";
import { db } from "../firebase";
import Aplus from "../assert/Aplus.jpg";
import Add_post from "./Add_post";
import swal from "sweetalert2";
import Comments_for_post from "./Comments_for_post";
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
const Blood_camps = ({ open, setOpen, District }) => {
  const [post_id, setpost_id] = useState("");
  const [post, setPost] = useState([]); //SET DATA
  const [update_img_pass, setUpdate_img_pass] = useState({});
  const [Add_post_open, setAdd_post_open] = useState(false);
  const [post_comment_open, setpost_comment_open] = useState(false);
  const [post_id_comments, setPost_id_comments] = useState("");
  const [getUploader_id, setUploader_id] = useState("");
  const [loading, setLoading] = useState(false);
  const usersCollectionRef = query(
    collection(db, District + "blood_camps"),
    orderBy("timstamp")
  );
  useEffect(() => {
    setLoading(true);
    getUsers();
  }, []);
  var getUsers = async () => {
    const data = await getDocs(usersCollectionRef);
    setPost(
      data.docs.map((doc) => ({
        //OFTER CHECKING SET THA ALL DATA.
        ...doc.data(),
        id: doc.id,
      }))
    );
  };
  const delete_post = async (get_delete_id) => {
    swal
      .fire({
        title: "Do you want to delete this post?",
        icon: "question",
        text: "You can't undo your post!",

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
            await deleteDoc(doc(db, District + "blood_camps", get_delete_id));
            await swal.fire({
              position: "top-end",
              icon: "success",
              title: "Post Delete Successfully!",
              showConfirmButton: false,
              timer: 1500,
            });
            getUsers();
          } catch (err) {
            swal.fire("Oops!", "Some network error so try again!!!", "error");
          }
        }
      });
  };
  const update_post = (id, img) => {
    setpost_id(id);
    setUpdate_img_pass(img);
    setAdd_post_open(true);
  };
  const add_comments = (id, Uploader_id) => {
    setPost_id_comments(id);
    setUploader_id(Uploader_id);
    setpost_comment_open(true);
  };
  const post_update_message = async () => {
    await swal.fire({
      position: "top-end",
      icon: "success",
      title: "This Post Update Successfully!",
      showConfirmButton: false,
      timer: 1500,
    });
    getUsers();
    setAdd_post_open(false);
  };
  return (
    <>
      <div className="add_post_contianer">
        <div className="comment_popup">
          <div className="comment_box1">
            <div>
              <i
                className="fa fa-close"
                id="close_comment1"
                onClick={() => setOpen(false)}
              ></i>
            </div>

            <div class="message1">
              {!loading ? (
                <Segment>
                  <Dimmer active inverted>
                    <Loader inverted>Loading...</Loader>
                  </Dimmer>

                  <Image src="/images/wireframe/short-paragraph.png" />
                </Segment>
              ) : (
                ""
              )}
              {post.length === 0 ? (
                <h1
                  id="nopost-has-add-message"
                  style={{
                    color: "red",
                    textAlign: "center",
                    fontFamily: "monospace",
                    fontWeight: "900",
                  }}
                >
                  Be the first one to post Blood Camp!
                </h1>
              ) : (
                ""
              )}

              {post.map((list) => {
                return (
                  <div className="all_comments1">
                    <div id="edit-delete-poster_info">
                      <div className="post_uploader_info">
                        {" "}
                        <h3>
                          {" "}
                          <i
                            className="fas fa-user-circle"
                            id="comment_user_icon1"
                          ></i>
                          <span id="comment_user_name">
                            {list.Uploader_name} . {list.publish_post_date}
                            <span id="comment_post_time"> at {list.Time}</span>
                          </span>
                        </h3>
                      </div>
                      {window.sessionStorage.getItem("user_id") ==
                      list.Uploader_id ? (
                        <>
                          <Popup
                            content="Edit this post."
                            trigger={
                              <i
                                className="fas fa-edit"
                                id="post-edit"
                                onClick={() => update_post(list.id, list.img)}
                              ></i>
                            }
                          ></Popup>
                          <span id="edit_del_cap"></span>
                          <Popup
                            content="Delete the post."
                            trigger={
                              <i
                                className="fas fa-light fa-trash"
                                id="post-delete"
                                onClick={() => delete_post(list.id)}
                              ></i>
                            }
                          ></Popup>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>

                    <a href={list.img} target="_blank">
                      <img src={list.img} id="post_image"></img>
                    </a>

                    <div className="post_title">
                      <h1 id="title_post_">{list.camp_name}</h1>
                    </div>
                    <div className="window_response_for_post_disc">
                      <div className="post_des">
                        <p></p>
                        <div className="post_Address">
                          <Popup
                            content={list.campaddress}
                            trigger={
                              <h4 id="wind_display_address">
                                <span>Address:</span>
                                {list.campaddress}
                              </h4>
                            }
                          ></Popup>
                        </div>
                        <div className="gap_line"></div>
                        <div className="camp_start_date">
                          <Popup
                            content="The day of blood camp."
                            trigger={
                              <h4>
                                <span>Date:</span>
                                {list.camp_Date}
                              </h4>
                            }
                          ></Popup>
                        </div>
                        <div className="gap_line"></div>
                        <div className="incharage_mobile">
                          <h4>
                            <span> Mobile:</span>
                            <Popup
                              size="large"
                              content="Click to call..."
                              trigger={
                                <a
                                  href={`tel:${list.Mobile}`}
                                  target="_blank"
                                  style={{
                                    cursor: "pointer",
                                    textDecoration: "non",
                                    color: "black",
                                  }}
                                >
                                  {list.Mobile}
                                </a>
                              }
                            ></Popup>
                          </h4>
                        </div>

                        <div className="gap_line"></div>
                        <div className="comments_button_design">
                          <Popup
                            content="Comments for this post."
                            trigger={
                              <h4
                                id="post_comment"
                                onClick={() =>
                                  add_comments(list.id, list.Uploader_id)
                                }
                              >
                                {" "}
                                <i
                                  className="fas fa-comment-dots"
                                  style={{ color: "red", padding: "2px" }}
                                  id="post_comment"
                                ></i>
                                Commend
                              </h4>
                            }
                          ></Popup>
                        </div>
                        {list.Moreinfo ? (
                          <>
                            <div className="gap_line"></div>
                            <div className="comments_button_design">
                              <Popup
                                content={list.Moreinfo}
                                trigger={
                                  <h4 className="more_info">
                                    <a href={list.Moreinfo} target="_blank">
                                      More... <i class="fa fas fa-link"></i>
                                    </a>
                                  </h4>
                                }
                              ></Popup>
                            </div>
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                    <div className="response_design_for_post_desc">
                      <div className="post_des">
                        <p></p>
                        <div className="post_Address">
                          <Popup
                            content={list.campaddress}
                            trigger={
                              <h5>
                                <span>Address: </span>
                                {list.campaddress}
                              </h5>
                            }
                          ></Popup>
                        </div>
                        <h5>
                          <span>date :</span>
                          {list.camp_Date}
                        </h5>
                      </div>
                      <div className="post_des2">
                        <p></p>
                        <h5>
                          <span style={{ fontWeight: "bold" }}>Mobile: </span>
                          <Popup
                            content="Click to call..."
                            trigger={
                              <a
                                href={`tel:${list.Mobile}`}
                                target="_blank"
                                style={{
                                  cursor: "pointer",
                                  textDecoration: "non",
                                  color: "black",
                                }}
                              >
                                {list.Mobile}
                              </a>
                            }
                          ></Popup>
                        </h5>
                        <Popup
                          content="Comments for this post."
                          trigger={
                            <h5
                              style={{ fontWeight: "bold", cursor: "pointer" }}
                              onClick={() =>
                                add_comments(list.id, list.Uploader_id)
                              }
                            >
                              <i
                                className="fas fa-comment-dots"
                                style={{
                                  color: "red",
                                  fontSize: "12px",
                                  padding: "3px",
                                }}
                                id="post_comment"
                              ></i>
                              Comments
                            </h5>
                          }
                        ></Popup>
                        {list.Moreinfo ? (
                          <Popup
                            content="link"
                            trigger={
                              <h5 className="more_info">
                                <a href={list.Moreinfo} target="_blank">
                                  More...<i class="fa fas fa-link"></i>
                                </a>
                              </h5>
                            }
                          ></Popup>
                        ) : (
                          <></>
                        )}

                        <p></p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {window.sessionStorage.getItem("user_id") ? (
              <Button
                id="add_post"
                primary
                onClick={() => setAdd_post_open(true)}
              >
                <span>Add post</span>
              </Button>
            ) : (
              <div className="post_add_steps_continar">
                <div className="post_add_steps">
                  <Popup
                    size="huge"
                    content={`setp 1: First select one hospital.
step 2: Then login or sign up your account.

                    step 3: Come back this page then add blood camp.`}
                    trigger={
                      <h2 style={{ color: "red", marginTop: "-1px" }}>
                        How to add post...hover hear!
                      </h2>
                    }
                  ></Popup>
                </div>
              </div>
            )}
            {post_comment_open && (
              <Comments_for_post
                open={post_comment_open}
                setOpen={setpost_comment_open}
                collection_name={District}
                id={post_id_comments}
                Uploader_id={getUploader_id}
              />
            )}
            {Add_post_open && (
              <Add_post
                open={Add_post_open}
                setOpen={setAdd_post_open}
                District={District}
                update_id={post_id}
                post_update_message={post_update_message}
                update_img={update_img_pass}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Blood_camps;
