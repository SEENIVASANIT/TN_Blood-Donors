import React from "react";
import { useEffect, useState } from "react";
import { Button, Message } from "semantic-ui-react";

const Admin_camp_data_view = ({ open, setOpen, obj_of_datas }) => {
  return (
    <div className="add_post_contianer">
      <div className="admin_show_info_contian_camps">
        {/* {new Date() == obj_of_datas.camp_Date ? (
          <Message positive id="camp_status">
            <Message.Header>Today camp..</Message.Header>
          </Message>
        ) : new Date() > obj_of_datas.camp_Date ? (
          <Message negative id="camp_status">
            <Message.Header>Camp end!</Message.Header>
          </Message>
        ) : (
          <Message info id="camp_status">
            <Message.Header>camp Not end</Message.Header>
          </Message>
        )} */}

        <div className="admin_show_info_contian_camps1">
          <img id="admin_more_info_img" src={obj_of_datas.img}></img>
          <div className="camp_datas_contian">
            <div className="admin_view_blood_other_other_info">
              <p id="view1">Camp Name: </p>
              <span>{obj_of_datas.camp_name}</span>
            </div>
            <div className="admin_view_blood_other_other_info">
              <p id="view1">Camp Date: </p>
              <span>{obj_of_datas.camp_Date}</span>
            </div>
            <div className="admin_view_blood_other_other_info">
              <p id="view2">Camp Address: </p>
              <span>{obj_of_datas.campaddress}</span>
            </div>
            <div className="admin_view_blood_other_other_info">
              <p id="view4">Incharge Mobile: </p>
              <span>{obj_of_datas.Mobile}</span>
            </div>
            <div className="admin_view_blood_other_other_info">
              <p id="view3">More Info: </p>
              <span>{obj_of_datas.Moreinfo}</span>
            </div>
            <div className="admin_view_blood_other_other_info">
              <p id="view1">Published By: </p>
              <span>{obj_of_datas.Uploader_name}</span>
            </div>
            <div className="admin_view_blood_other_other_info">
              <p id="view5">Published Date: </p>
              <span>
                {obj_of_datas.publish_post_date + "at" + obj_of_datas.Time}
              </span>
            </div>
            <div className="admin_view_blood_other_other_info">
              <p id="view1">Publisher Id: </p>
              <span>{obj_of_datas.Uploader_id}</span>
            </div>
          </div>
        </div>
        <div className="close_camps_model">
          <Button negative onClick={() => setOpen(false)}>
            <span>Close info</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Admin_camp_data_view;
