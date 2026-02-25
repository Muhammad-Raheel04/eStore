import axios from "axios";

export const sendOrderEmail = async (order, userEmail) => {

  const html = `
    <h2>Order Confirmation</h2>
    <p>Your order has been placed successfully.</p>
    <p><strong>Order ID:</strong> ${order._id}</p>
    <p><strong>Total Amount:</strong> PKR ${order.amount}</p>
    <p><strong>Payment Method:</strong> Cash On Delivery</p>
  `;

  await axios.post(
    'https://api.brevo.com/v3/smtp/email',
    {
      sender: { email: process.env.EMAIL_FROM },
      to: [{ email: userEmail }],
      subject: 'Order Confirmation',
      htmlContent: html
    },
    {
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json'
      }
    }
  );

  // Send to Admin
  await axios.post(
    'https://api.brevo.com/v3/smtp/email',
    {
      sender: { email: process.env.EMAIL_FROM },
      to: [{ email: process.env.ADMIN_EMAIL }],
      subject: 'New Order Received',
      htmlContent: html
    },
    {
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json'
      }
    }
  );
};