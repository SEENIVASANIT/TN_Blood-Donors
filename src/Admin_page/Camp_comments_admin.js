import React, { useState, useEffect } from "react";
import { storage, db } from "../firebase";
import "../components/Comments_for_post.css";
import swal from "sweetalert2";
import {
  Card,
  Image,
  Button,
  Grid,
  Popup,
  Loader,
  Segment,
  Dimmer,
  Feed,
  Icon,
} from "semantic-ui-react";
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
import {
  arrayUnion,
  arrayRemove,
  deleteField,
  FieldPath,
  FieldValue,
} from "firebase/firestore";

const initialState = {
  comment_for_post: "",
};
const Camp_comments_admin = ({ open, setOpen, collection_name, id }) => {
  const [comment, setComment] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [set_replay_datas, setReplay_datas] = useState({});
  const { comment_for_post } = comment;
  const [setcomments, setComments] = useState([]); //SET DATA
  const [comment_Update_id, setUpdate_id] = useState(null); //SET comment_update_id
  const commet_collection = collection_name + "/" + id + "/" + "comments";
  const usersCollectionRef = query(
    collection(db, commet_collection),
    orderBy("timstamp", "desc")
  );
  useEffect(() => {
    comment_Update_id && getSinglecomment();
  }, [comment_Update_id]);
  useEffect(() => {
    //THIS FUNCTION LOAD DATA FOR THIS PAGE
    setLoading(true);
    getAllcomments();
  }, []);
  const getSinglecomment = async () => {
    const docRef = doc(db, commet_collection, id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      setComment({ ...snapshot.data() });
    }
  };
  var getAllcomments = async () => {
    const data = await getDocs(usersCollectionRef);
    if (data.empty) {
      //CHECK COLLECTION EMPTY ARE NOT
    }

    setComments(
      data.docs.map((doc) => ({
        //OFTER CHECKING SET THA ALL DATA.
        ...doc.data(),
        id: doc.id,
      }))
    );
  };

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

  const handleChange = (e) => {
    //INPUT TO TAKE THE DATA
    setComment({ ...comment, [e.target.name]: e.target.value });
  };
  const time = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();

    // const docRef = doc(db,commet_collection,);
    if (comment_Update_id == null) {
      try {
        const get_comment = new FormData(e.target); //Upload DATA TO FIRSTORE
        await addDoc(
          collection(db, commet_collection),
          {
            comment_for_post: arrayUnion(get_comment.get("comment_for_post")),
            comment_poster_id: window.sessionStorage.getItem("user_id"),
            comment_poster_name: window.sessionStorage.getItem("name"),
            commend_post_date: Current_date,
            All_replay_comment: [],
            timstamp: serverTimestamp(),
            Time: time,
          },
          (document.getElementById("no_comment").style.display = "none"),
          (document.getElementById("comment_input").value = null)
        );

        getAllcomments();
      } catch (e) {
        swal.fire("Oops!", "Some network error so tryagain!!!", "error");
      }
    } else {
      try {
        //*UPDATE THE DATA IN FIREBASE*//
        await updateDoc(
          doc(db, commet_collection, comment_Update_id),
          {
            ...comment,
            commend_post_date: Current_date,
            timstamp: serverTimestamp(),
            Time: time,
          },
          (document.getElementById("comment_input").value = "")
        );

        getAllcomments();
      } catch (error) {
        swal.fire("Oops!", "Some network error so tryagain!!!", "error");
      }
    }
  };
  //   const handleUpdate = (id, comment) => {
  //     setUpdate_id(id);
  //     document.getElementById("comment_input").value = comment;
  //     document.getElementById("send").disabled = false;
  //   };
  const delete_comment = async (get_delete_id) => {
    swal
      .fire({
        title: "Do you want to delete this user comment!",
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
            await deleteDoc(
              doc(
                db,
                collection_name + "/" + id + "/" + "comments",
                get_delete_id
              )
            );
            swal.fire("Your comment was deleted!", "", "success"); //DELETE THA DATA
            getAllcomments();
          } catch (err) {
            swal.fire("Oops!", "Some network error so try again!!!", "error");
          }
        }
      });
  };
  //    const add_replay_comment = (id) => {
  //     swal
  //       .fire({
  //         title: "Replay this comment",
  //         input: "text",

  //         inputAttributes: {
  //           autocapitalize: "off",
  //         },
  //         showCancelButton: true,
  //         confirmButtonText: "Publish",
  //         showLoaderOnConfirm: true,
  //         preConfirm: async (data) => {
  //           try {
  //             await updateDoc(doc(db, commet_collection, id), {
  //               All_replay_comment: arrayUnion({
  //                 Replay: data,
  //                 Replyer_id: window.sessionStorage.getItem("user_id"),
  //                 Replayer_name: window.sessionStorage.getItem("name"),
  //                 commend_post_date: Current_date,
  //                 // timstamp: serverTimestamp(),
  //                 Time: time,
  //               }),
  //             });

  //             getAllcomments();
  //           } catch (e) {
  //             swal.fire("Oops!", "Some network error so tryagain!!!", "error");
  //           }
  //         },
  //         allowOutsideClick: () => !swal.isLoading(),
  //       })
  //       .then((result) => {
  //         if (result.isConfirmed) {
  //         }
  //       });
  //   };
  const remove_Replay_Message = async (index, id) => {
    swal
      .fire({
        title: "Do you want to delete this comment!",
        icon: "info",
        text: "You con't undo your message ok!",

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
            await updateDoc(
              doc(db, commet_collection, id),
              {
                All_replay_comment: arrayRemove(index),
              },
              swal.fire({
                position: "top-end",
                icon: "success",
                title: "Success fully delete!",
                showConfirmButton: false,
                timer: 1000,
              })
            );
            getAllcomments();
          } catch (e) {
            swal.fire("Oops!", `Some network error so tryagain!!!`, "error");
          }
        }
      });
  };
  //   const update_Replay_comment = async (id, message) => {
  //     swal
  //       .fire({
  //         title: "Replay this comment",
  //         input: "text",
  //         inputValue: message.Replay,
  //         inputAttributes: {
  //           autocapitalize: "off",
  //         },
  //         showCancelButton: true,
  //         confirmButtonText: "Update",
  //         showLoaderOnConfirm: true,
  //         preConfirm: async (data) => {
  //           try {
  //             await updateDoc(doc(db, commet_collection, id), {
  //               All_replay_comment: arrayUnion({
  //                 Replay: data,
  //                 Replyer_id: message.Replyer_id,
  //                 Replayer_name: message.Replayer_name,
  //                 commend_post_date: Current_date,
  //                 // timstamp: serverTimestamp(),
  //                 Time: time,
  //               }),
  //             });
  //             if (data !== message.Replay) {
  //               await updateDoc(doc(db, commet_collection, id), {
  //                 All_replay_comment: arrayRemove(message),
  //               });
  //             }
  //             swal.fire({
  //               position: "top-end",
  //               icon: "success",
  //               title: "Update Successfully!",
  //               showConfirmButton: false,
  //               timer: 1000,
  //             });

  //             getAllcomments();
  //           } catch (e) {
  //             swal.fire("Oops!", "Some network error so tryagain!!!", "error");
  //           }
  //         },
  //         allowOutsideClick: () => !swal.isLoading(),
  //       })
  //       .then((result) => {
  //         if (result.isConfirmed) {
  //         }
  //       });
  //   };
  return (
    <div className="comment_popup">
      <div className="comment_box2">
        <div id="comment_head">
          <h5>All Comments</h5>
        </div>
        <div className="message_admin_view">
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
          {setcomments == 0 ? (
            <h2 id="admin_nocomment_message">No comment has been post yet!.</h2>
          ) : (
            <></>
          )}
          {setcomments.map((item) => {
            return (
              <div id="all_comments">
                <div className="message_edit_del_contian">
                  {" "}
                  <h3>
                    {" "}
                    <i
                      className="fas fa-user-circle"
                      id="comment_user_icon"
                    ></i>
                    <span id="comment_user_name">
                      {item.comment_poster_name} . {item.commend_post_date}
                      <span id="comment_post_time"> at {item.Time}</span>
                    </span>
                  </h3>
                  <div className="message_e_d_contian">
                    {/* <Popup
                      size="large"
                      content="Edit this comment..."
                      trigger={
                        <i
                          className="fas fa-edit"
                          style={{ color: "green", cursor: "pointer" }}
                          onClick={() =>
                            handleUpdate(item.id, item.comment_for_post)
                          }
                        ></i>
                      }
                    ></Popup> */}
                    <span style={{ padding: "10px" }}></span>
                    <Popup
                      size="large"
                      content="Delete the comment..."
                      trigger={
                        <i
                          className="fas fa-light fa-trash"
                          id="mess_del"
                          onClick={() => delete_comment(item.id)}
                          style={{
                            color: "red",
                            cursor: "pointer",
                            fontSize: "3vh",
                          }}
                        ></i>
                      }
                    ></Popup>
                  </div>
                </div>

                <h4 id="main_post_commet"> -{item.comment_for_post[0]}</h4>
                <input
                  type="checkbox"
                  style={{ display: "none" }}
                  id={item.id}
                  className="replay_bttn_visable"
                ></input>
                <label id="replay_lable" for={item.id}>
                  <div className="replay_message">
                    <span style={{ cursor: "pointer", color: "black" }}>
                      <i class="fa fa-regular fa-reply-all"></i> .Reply{" "}
                      {item.All_replay_comment.length != 0 ? (
                        item.All_replay_comment.length
                      ) : (
                        <></>
                      )}
                    </span>
                  </div>
                </label>

                <div id={item.id} className="hole_replay_message_box_contianer">
                  <div className="replay_message">
                    <span
                      id="function_of_check_div"
                      style={{ cursor: "pointer" }}
                    >
                      {/* {window.sessionStorage.getItem("user_id") ? (
                        <label
                          className="add_more_comment"
                          onClick={() => add_replay_comment(item.id)}
                        >
                          Add comment
                        </label>
                      ) : (
                        <></>
                      )} */}
                      <label className="close_add_more_comment" for={item.id}>
                        Close
                      </label>
                    </span>
                  </div>
                  <div className="massage_box_continar">
                    <div className="replay_box">
                      {item.All_replay_comment.length == 0 ? (
                        <p style={{ color: "red" }}>No replay comments!</p>
                      ) : (
                        <></>
                      )}
                      {item.All_replay_comment.map((replay, intex) => {
                        return (
                          <div className="single_replay_comment">
                            <div className="message_edit_del_contian">
                              {""}
                              <h3>
                                {""}

                                <i
                                  className="fas fa-user-circle"
                                  id="comment_user_icon1"
                                ></i>
                                <span id="comment_user_name1">
                                  {replay.Replayer_name} .{" "}
                                  {replay.commend_post_date}
                                  <span id="comment_post_time">
                                    {" "}
                                    at {replay.Time}
                                  </span>
                                </span>
                              </h3>

                              <div className="message_e_d_contian">
                                {/* <Popup
                                    content="Edit this post."
                                    trigger={
                                      <i
                                        className="fas fa-edit"
                                        id="replay_mess"
                                        style={{
                                          color: "green",
                                          cursor: "pointer",
                                        }}
                                        onClick={() =>
                                          update_Replay_comment(
                                            item.id,
                                            item.All_replay_comment[intex]
                                          )
                                        }
                                      ></i>
                                    }
                                  ></Popup> */}
                                <span style={{ padding: "10px" }}></span>
                                <Popup
                                  content="Delete this user replay!"
                                  trigger={
                                    <i
                                      className="fas fa-light fa-trash"
                                      onClick={() =>
                                        remove_Replay_Message(
                                          item.All_replay_comment[intex],
                                          item.id
                                        )
                                      }
                                      id="replay_mess"
                                      style={{
                                        color: "red",
                                        cursor: "pointer",
                                      }}
                                    ></i>
                                  }
                                ></Popup>
                              </div>
                            </div>
                            <h6 id="replay_message_only"> -{replay.Replay}</h6>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* <form onSubmit={handleSubmit} method="POST">
          <div class="input-comment_container">
            <textarea
              id="comment_input"
              class="input-comment_field"
              name="comment_for_post"
              rows={2}
              cols={40}
              type="text"
              required
              placeholder="Add a comment..."
              onChange={handleChange}
            />
            <Button
              type="submit"
              disabled={comment_for_post == ""}
              primary
              id="send"
            >
              <i class="fa fa-send-o send_icon" id="send_icon1"></i>
            </Button>
          </div>
        </form> */}
        <div className="close_camps_model2">
          <Button negative onClick={() => setOpen(false)}>
            <span>Close Comment</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Camp_comments_admin;
