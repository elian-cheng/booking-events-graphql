import React, { useEffect, useState, useContext, useCallback } from "react";

import Spinner from "../../components/Spinner/Spinner";
import authContext from "../../context/authContext";
import BookingChart from "./components/BookingChart/BookingChart";
import BookingControls from "./components/BookingControls/BookingControls";
import BookingList from "./components/BookingList/BookingList";

const BookingsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [outputType, setOutputType] = useState("list");
  const authCtx = useContext(authContext);
  const token = authCtx.token;

  const fetchBookings = useCallback(() => {
    setIsLoading(true);
    const requestBody = {
      query: `
        query {
          bookings {
            _id
            createdAt
            event {
              _id
              title
              date
              price
            }
          }
        }
      `
    };

    fetch("http://localhost:5000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(resData => {
        const bookings = resData.data.bookings;
        setBookings(bookings);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  }, [token]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const deleteBookingHandler = bookingId => {
    setIsLoading(true);
    const requestBody = {
      query: `
      mutation CancelBooking($id: ID!) {
        cancelBooking(bookingId: $id) {
            _id
            title
          }
        }
        `,
      variables: {
        id: bookingId
      }
    };

    fetch("http://localhost:5000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(resData => {
        setBookings(prevBookings => prevBookings.filter(booking => booking._id !== bookingId));
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const changeOutputTypeHandler = outputType => {
    if (outputType === "list") {
      setOutputType("list");
    } else {
      setOutputType("chart");
    }
  };

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <BookingControls
            activeOutputType={outputType}
            onChange={changeOutputTypeHandler}
          />
          <div>
            {outputType === "list" ? (
              <BookingList
                bookings={bookings}
                onDelete={deleteBookingHandler}
              />
            ) : (
              <BookingChart bookings={bookings} />
            )}
          </div>
        </>
      )}
    </>
  );
};

export default BookingsPage;

