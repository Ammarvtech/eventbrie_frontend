
import React, { useMemo,useState } from "react";
import style from "@/styles/scss/app.module.scss"
import {
    CardElement,
    useStripe,
    useElements,
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement
  } from "@stripe/react-stripe-js";
import axios from "axios"
import {useRouter} from "next/router"
import Cookies from "js-cookie"
import { toast } from 'react-toastify';


  const useOptions = () => {
    const options = useMemo(
      () => ({
        style: {
          base: {
            display: "block",
            width: "100%",
            height: "5.3rem",
            fontFamily: "'Red Hat Display', sans-serif",
            fontWeight: "500",
            color: "#061237",
            background: "#fff",
            "text-align": "left",
            padding: "0.6rem 1.4rem",
            "::placeholder": {
              color: "#130a2952",
              fontSize: "15px"
            }
          },
          invalid: {
            color: "#9e2146"
          }
        }
      }),
      []
    );
  
    return options;
  };
const PaymentForm = () => {
  const options = useOptions();
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState("");

  
  const chargePayment = async (clientSecret: any, paymentMethodReq: any, setup_id: any, paymentMethodSetup: any, customer_id: any) => {
    const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethodSetup,
        setup_future_usage: 'off_session'
    });
    // console.log(result);
    if (result.error) {
      toast.error(result.error.message)
      return;
    } else if (result.paymentIntent?.status === "succeeded") {
      toast.success("Payment Successful")
    }
  }

const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    const cardElement = elements.getElement(CardNumberElement);
    if (!cardElement) {
        alert();
      return;
    }
    const paymentMethodReq = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      // billing_details: billingDetails
      });
      if (paymentMethodReq.error) {
        console.log(paymentMethodReq.error.message);
          // setCheckoutError(paymentMethodReq.error.message);
          // setProcessingTo(false);
          // return;
      } else {
        var form_data = new FormData();
        form_data.append('payment_token', paymentMethodReq.paymentMethod?.id as string);
        form_data.append('user_id', Cookies.get('user_id') as string);
        form_data.append('amount', 100 as any);
        await axios.post(process.env.API_URL + "/create-indent-payment", form_data).then((data : any) => {
          let client_secret = data.data.data.arr.client_secret;
          let client_secret_setup = data.data.data.arr.setup_client_secret;
          // console.log(client_secret)
          // console.log(client_secret_setup)

          if (data.data.data.status === 1) {
              let card_result = stripe.confirmCardSetup(client_secret_setup, {
                  payment_method: {
                      card: cardElement,
                      // billing_details: billingDetails,
                  },
              });
              card_result.then(response => {
                if(response.error) {
                  toast.error(response.error.message)
                }
                else {
                  let paymentMethod = response.setupIntent.payment_method;
                  let setup_intent_id = response.setupIntent.id;
                  chargePayment(client_secret, paymentMethodReq, setup_intent_id, paymentMethod, data.data.data.arr.customer);
                }
              })


              // if (card_result.error) {
              //     setCheckoutError(card_result.error.message);
              //     setProcessingTo(false);
              //     return;
              // }
              // else {
              //     let paymentMethod = '';
              //     let setup_intent_id = '';
              //     card_result.then(response => {
              //         if (response.error) {
              //             setCheckoutError(response.error.message);
              //             setProcessingTo(false);
              //             return;
              //         }
              //         else {

              //             paymentMethod = response.setupIntent.payment_method;
              //             setup_intent_id = response.setupIntent.id;
              //             chargePayment(client_secret, paymentMethodReq, setup_intent_id, paymentMethod, data.arr.customer);
              //         }

              //     })
              // }
          }
        })

        // try {
        //     const res = await axios.post(process.env.API_URL + "/create-indent-payment", form_data, {
        //         headers: {
        //             'Content-Type': 'multipart/form-data',
        //         },
        //     })
        //     let client_secret = data.arr.client_secret;
        //     let client_secret_setup = data.arr.setup_client_secret;
        //     // toast.success("Payment Successful")
        //     // const router = useRouter()
        //     // router.push("/production")
        // }
        // catch (err) {
        //     if(axios.isAxiosError(err)) {
        //         console.log(err.response?.data)
        //     }
        // }
      }


    // const result = await stripe.createToken(cardElement as any);
    // if (result.error) {
    //     setCardError(result.error.message as any); 
    // } else {
    //   // Send the token to your server for further processing
    //   console.log(result.token);
    //   const formData = new FormData();
    //   formData.append('payment_token', result.token.id);
    //   formData.append('user_id', Cookies.get('user_id') as string);
    //   formData.append('amount', 100 as any);

    //   try {const res = await axios.post(process.env.API_URL + "/create-indent-payment", formData, {
    //         headers: {
    //             'Content-Type': 'multipart/form-data',
    //         },
    //     })
    //        console.log(res.data)
    //     }
    //     catch (err) {
    //         if(axios.isAxiosError(err)) {
    //             console.log(err.response?.data)
    //         }
    //     }
    // }
  };

  return (
    <div style={{background: "white"}}>
        <form onSubmit={handleSubmit}>
            <div>
                <label>Name on Card*</label>
                <input
                type="text"
                className="input"
                placeholder="Name on card"
                />
                <span className="validation-error"></span>
            </div>
            <div>
                <label>Card Number*</label>
                <div>
                <CardNumberElement options={options} />
                <span>
                    <img src="/images/card.svg" alt="" />
                </span>
                </div>
            </div>
            <div>
                <div >
                <label>Expiry date*</label>
                <CardExpiryElement options={options} />
                </div>
                <div >
                <label>CVC*</label>
                <CardCvcElement options={options} />
                </div>
            </div>
            <span className="validation-error" style={{color: "red"}}>{cardError}</span>
          
            <div>
                <button type="submit">
                    Pay Now
                </button>
            </div>
            </form>
    </div>
  );
};

export default PaymentForm;