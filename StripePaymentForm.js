import React, {  useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { ErrorToaster, SuccessToaster } from "../Toaster/toaster";
import { Grid } from "@mui/material";

export default function CheckoutForm({ clientSecret, punchOrder }) {
  // const newElement = useCartElementState();

  const newStripe = useStripe();
  const newElement = useElements();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#9e2146",
        iconColor: "#9e2146",
      },
    },
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    try {
      const { error: stripeError, paymentIntent } =
        await newStripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: newElement.getElement(CardElement),
          },
        });
      if (stripeError) {
        return;
      }
      if (paymentIntent.status === "succeeded") {
        SuccessToaster("Payment succeeded");
        punchOrder();
      }
    } catch (e) {
      ErrorToaster(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Grid container spacing={2} alignItems="center">
        <Grid item sm={12} md={9} sx={{ my: 2 }}>
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </Grid>
      </Grid>
      <button onClick={() => handleSubmit()} id="submit">
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </span>
      </button>
      {message && <div id="payment-message">{message}</div>}
    </>
  );
}
