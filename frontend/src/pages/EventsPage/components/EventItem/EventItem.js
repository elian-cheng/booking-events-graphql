import React, { useContext } from "react";
import authContext from "../../../../context/authContext";

import "./EventItem.css";

const EventItem = props => {
  const authCtx = useContext(authContext);
  const userId = authCtx.userId;

  return (
    <li
      key={props.eventId}
      className="events__list-item">
      <div>
        <h1>{props.title}</h1>
        <h2>
          ${props.price} - {new Date(props.date).toLocaleDateString()}
        </h2>
      </div>
      <div>
        {userId === props.creatorId ? (
          <p>You are the owner of this event.</p>
        ) : (
          <button
            className="btn"
            onClick={props.onDetail.bind(this, props.eventId)}>
            View Details
          </button>
        )}
      </div>
    </li>
  );
};

export default EventItem;
