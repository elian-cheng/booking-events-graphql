import React, { useEffect, useState, useContext, useCallback } from "react";

import Spinner from "../../components/Spinner/Spinner";
import authContext from "../../context/authContext";
import BookingList from "./components/BookingList/BookingList";

const BookingsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
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
        mutation {
          cancelBooking(bookingId: "${bookingId}") {
            _id
            title
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
        setBookings(prevBookings => prevBookings.filter(booking => booking._id !== bookingId));
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <BookingList
          bookings={bookings}
          onDelete={deleteBookingHandler}
        />
      )}
    </>
  );
};

export default BookingsPage;

