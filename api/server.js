require('dotenv').config()
const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const cors = require("cors");
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());


const MERCHANT_KEY="40f93ce5-27ef-48a9-8b33-b6e00911301b" //salt key
const MERCHANT_ID="M22V65UE2MMSS"

// const prod_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay"
// const prod_URL = "https://api.phonepe.com/apis/hermes/pg/v1/status"

const MERCHANT_BASE_URL="https://api.phonepe.com/apis/hermes/pg/v1/pay"
const MERCHANT_STATUS_URL="https://api.phonepe.com/apis/hermes/pg/v1/status"

const redirectUrl="https://smartdwelliot.in/phonepe/status"

const successUrl="http://localhost:5173/payment-success"
const failureUrl="http://localhost:5173/payment-failure"


app.post('/create-order', async (req, res) => {

    const {name, mobileNumber, amount} = req.body;
    const orderId = uuidv4()

    //payment
    const paymentPayload = {
        merchantId : MERCHANT_ID,
        merchantUserId: name,
        mobileNumber: mobileNumber,
        amount : amount * 100,
        merchantTransactionId: orderId,
        redirectUrl: `${redirectUrl}/?id=${orderId}`,
        redirectMode: 'POST',
        paymentInstrument: {
            type: 'PAY_PAGE'
        }
    }

    // # Proxy all requests to the Node.js backend API
    // ProxyPass /phonepe/ http://localhost:8070/
    // ProxyPassReverse /phonepe/ http://localhost:8070/


    const payload = Buffer.from(JSON.stringify(paymentPayload)).toString('base64')
    const keyIndex = 1
    const string  = payload + '/pg/v1/pay' + MERCHANT_KEY
    const sha256 = crypto.createHash('sha256').update(string).digest('hex')
    const checksum = sha256 + '###' + keyIndex

    const option = {
        method: 'POST',
        url:MERCHANT_BASE_URL,
        headers: {
            accept : 'application/json',
            'Content-Type': 'application/json',
            'X-VERIFY': checksum
        },
        data :{
            request : payload
        }
    }
    try {
        const response = await axios.request(option);
        // console.log(response.data.data.instrumentResponse.redirectInfo.url)
        return res.status(200).json({msg : "OK", url: response.data.data.instrumentResponse.redirectInfo.url})
    } catch (error) {
        console.log("error in payment", error)
        return res.status(500).json({error : 'Failed to initiate payment'})
    }
});


app.post('/status', async (req, res) => {
    const merchantTransactionId = req.query.id;

    const keyIndex = 1
    const string  = `/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}` + MERCHANT_KEY
    const sha256 = crypto.createHash('sha256').update(string).digest('hex')
    const checksum = sha256 + '###' + keyIndex

    const option = {
        method: 'GET',
        url:`${MERCHANT_STATUS_URL}/${MERCHANT_ID}/${merchantTransactionId}`,
        headers: {
            accept : 'application/json',
            'Content-Type': 'application/json',
            'X-VERIFY': checksum,
            'X-MERCHANT-ID': MERCHANT_ID
        },
    }

    axios.request(option).then((response) => {

        console.log(response.data)
        console.log("Response ........."+response.data.data)
        console.log("Response ........."+response.data.message)


        if (response.data.success === true){
            console.log(response.data)
            console.log("Response ........."+response.data.data)
            console.log("Response ........."+response.data.message)


            
            return res.redirect(successUrl)
        }else{
            return res.redirect(failureUrl)
        }
    })
});


app.listen(8070, () => {
  console.log('Server is running on port 8070');
});
