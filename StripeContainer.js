import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import "./Stripe.css";
import CheckoutFormStripe from "app/components/Stripe/CheckoutFormStripe.js";
import { StripeServices } from "app/apis/Stripe/Stripe.Services";
import { ErrorToaster } from "../Toaster/toaster";
import { useDispatch } from "react-redux";
import { Stripekey } from "app/redux/slices/cartDetailSlice";

// Load Stripe Publish Key
let Value = "";
const stripePromise = loadStripe(Value);

export default function StripeContainer({ Total, punchOrder }) {
  const dispatch = useDispatch();
  const [clientSecret, setClientSecret] = useState("");
  const [puclicKey, setPublicKey] = useState("");

  const HandlePayment = async (price) => {
    try {
      const form = new FormData();
      form.append("total", price);
      const result = await StripeServices.paymentStripe(form);

      if (result.responseCode === 200) {
        Value = result.data[0].clientsecret_key;
        setClientSecret(result.data[0].clientsecret_key);
        setPublicKey(result.data[0].public_key);
        dispatch(Stripekey(result.data[0].key_id));
      } else {
        ErrorToaster("Oops Error Occur");
      }
    } catch (e) {
      ErrorToaster(e);
    } finally {
    }
  };

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    HandlePayment(Total);
  }, [URL]);

  const appearance = {
    theme: "stripe",
  };

  return (
    <div className="App">
      {clientSecret && (
        <Elements stripe={loadStripe(puclicKey)}>
          <CheckoutFormStripe
            clientSecret={clientSecret}
            punchOrder={punchOrder}
          />
        </Elements>
      )}
    </div>
  );
}
