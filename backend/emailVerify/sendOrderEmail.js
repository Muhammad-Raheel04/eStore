import axios from "axios";

export const sendOrderEmail = async (order, userEmail) => {
  const itemsHtml = (order.products || [])
    .map(
      (it) =>
        `<li>${it.productId?.productName || "Product"} × ${it.quantity} — PKR ${(it.productId?.productPrice || 0) * it.quantity
        }</li>`
    )
    .join("");

  const addr = order.shippingAddress || {};

  const html = `
    <h2>Order Confirmation</h2>
    <p>Your order has been placed successfully.</p>
    <p><strong>Order ID:</strong> ${order.orderId || order._id}</p>
    <h3>Items</h3>
    <ul>${itemsHtml}</ul>
    <p><strong>Total Amount:</strong> PKR ${order.amount}</p>
    <p><strong>Payment Method:</strong> Cash On Delivery</p>
    <h3>Shipping Address</h3>
    <p>
      ${addr.fullName || ""}<br/>
      ${addr.phone || ""}<br/>
      ${addr.email || ""}<br/>
      ${addr.address || ""}, ${addr.city || ""}, ${addr.state || ""}, ${addr.zip || ""}, ${addr.country || ""}
    </p>
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