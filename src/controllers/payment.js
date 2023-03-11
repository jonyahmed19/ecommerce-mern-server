const braintree = require("braintree");
const sgMail =require("@sendgrid/mail");
const Order = require('../models/order')
const sendMailUtility = require("../utils/sendEmailUtility");


const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});


exports.getToken = async (req, res) => {
    try {
        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(response);
            }
        });
    } catch (err) {
        console.log(err);
    }
};

exports.processPayment = async (req, res) => {
    try {
        // console.log(req.body);
        const { nonce, cart, total } = req.body || {};
        console.log(req.body)

        // let total = 0;
        // cart.map((i) => {
        //     total += i.price;
        // });
        // console.log("total => ", total);

        let newTransaction = gateway.transaction.sale(
            {
                amount: total,
                paymentMethodNonce: nonce,
                options: {
                    submitForSettlement: true,
                },
            },
            function (error, result) {
                if (result) {
                    // res.send(result);
                    // create order
                    const order = new Order({
                        products: cart,
                        payment: result,
                        buyer: req.user._id,
                    }).save();
                    // decrement quantity
                    // decrementQuantity(cart);
                    // const bulkOps = cart.map((item) => {
                    //   return {
                    //     updateOne: {
                    //       filter: { _id: item._id },
                    //       update: { $inc: { quantity: -0, sold: +1 } },
                    //     },
                    //   };
                    // });

                    // Product.bulkWrite(bulkOps, {});

                    res.json({ ok: true });
                } else {
                    res.status(500).send(error);
                }
            }
        );
    } catch (err) {
        console.log(err);
    }
};

exports.orderStatus = async (req, res) => {
    try {

        const { orderId } = req.params;
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        ).populate("buyer", "email firstName");
        // send email

        console.log(order.buyer.email)


        const sendEmail = await sendMailUtility(
            order.buyer.email,
            `Hi ${order.buyer.firstName}, Your order's status is: ${order.status}`,
            `#${order._id} is updated`
        )

        // prepare email
      //   const emailData = {
      //       from: process.env.EMAIL_FROM,
      //       to: order.buyer.email,
      //       subject: "Order status",
      //       html: `
      //   <h1>Hi ${order.buyer.name}, Your order's status is: <span style="color:red;">${order.status}</span></h1>
      //   <p>Visit <a href="${process.env.CLIENT_URL}/dashboard/user/orders">your dashboard</a> for more details</p>
      // `,
      //   };
      //
      //   try {
      //       await sgMail.send(emailData);
      //   } catch (err) {
      //       console.log(err);
      //   }

            return res.json(order);
    } catch (err) {
        console.log(err);
    }
};
