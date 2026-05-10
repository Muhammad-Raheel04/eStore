import axios from "axios";

export const sendOrderEmail = async (order, userEmail) => {
  const itemsHtml = (order.products || [])
    .map(
      (it) => `
        <tr>
          <td style="padding:12px;border-bottom:1px solid #eee;">
            ${it.productId?.productName || "Product"}
          </td>
          <td style="padding:12px;border-bottom:1px solid #eee;text-align:center;">
            ${it.quantity}
          </td>
          <td style="padding:12px;border-bottom:1px solid #eee;text-align:right;">
            PKR ${(it.productId?.productPrice || 0) * it.quantity}
          </td>
        </tr>
      `
    )
    .join("");

  const addr = order.shippingAddress || {};

  const html = `
  <div style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 0;">
      <tr>
        <td align="center">

          <table width="650" cellpadding="0" cellspacing="0" 
            style="background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);">

            <tr>
              <td 
                style="background:linear-gradient(135deg,#111827,#1f2937);padding:35px;text-align:center;">

                <h1 style="color:#ffffff;margin:0;font-size:28px;">
                  Order Confirmed 
                </h1>

                <p style="color:#d1d5db;margin-top:10px;font-size:15px;">
                  Thank you for shopping with us
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:35px;">

                <p style="font-size:16px;color:#374151;">
                  Hi <strong>${addr.fullName || "Customer"}</strong>,
                </p>

                <p style="font-size:15px;color:#6b7280;line-height:1.7;">
                  Your order has been placed successfully. 
                  We are preparing your items for shipment.
                </p>

                <table width="100%" cellpadding="0" cellspacing="0"
                  style="margin:25px 0;background:#f9fafb;border-radius:10px;">
                  
                  <tr>
                    <td style="padding:18px;">
                      <p style="margin:0;font-size:14px;color:#6b7280;">
                        <strong>Order ID:</strong> ${
                          order.orderId || order._id
                        }
                      </p>

                      <p style="margin:10px 0 0;font-size:14px;color:#6b7280;">
                        <strong>Payment:</strong> Cash On Delivery
                      </p>

                      <p style="margin:10px 0 0;font-size:14px;color:#6b7280;">
                        <strong>Total Amount:</strong> 
                        <span style="font-size:18px;font-weight:bold;color:#111827;">
                          PKR ${order.amount}
                        </span>
                      </p>
                    </td>
                  </tr>
                </table>

                <h2 style="font-size:20px;color:#111827;margin-bottom:15px;">
                  Order Items
                </h2>

                <table width="100%" cellpadding="0" cellspacing="0"
                  style="border-collapse:collapse;border:1px solid #eee;border-radius:8px;overflow:hidden;">

                  <thead>
                    <tr style="background:#111827;">
                      <th style="padding:14px;color:#fff;text-align:left;">
                        Product
                      </th>

                      <th style="padding:14px;color:#fff;text-align:center;">
                        Qty
                      </th>

                      <th style="padding:14px;color:#fff;text-align:right;">
                        Price
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    ${itemsHtml}
                  </tbody>
                </table>

                <h2 style="font-size:20px;color:#111827;margin:30px 0 15px;">
                  Shipping Address
                </h2>

                <div style="background:#f9fafb;padding:18px;border-radius:10px;color:#4b5563;font-size:14px;line-height:1.8;">
                  <strong>${addr.fullName || ""}</strong><br/>
                  ${addr.phone || ""}<br/>
                  ${addr.email || ""}<br/>
                  ${addr.address || ""}, ${addr.city || ""}, 
                  ${addr.state || ""}, ${addr.zip || ""}, 
                  ${addr.country || ""}
                </div>

              </td>
            </tr>

            <tr>
              <td 
                style="background:#f3f4f6;padding:25px;text-align:center;font-size:13px;color:#6b7280;">
                
                <p style="margin:0;">
                  Thank you for choosing <strong>Your Store</strong> ❤️
                </p>

                <p style="margin-top:8px;">
                  Need help?  <a href="mailto:hamzaraj541@gmail.com" style="underline">Contact us</a> anytime.
                </p>

              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>
  </div>
  `;

  await axios.post(
    "https://api.brevo.com/v3/smtp/email",
    {
      sender: { email: process.env.EMAIL_FROM },
      to: [{ email: userEmail }],
      subject: "Your Order Has Been Confirmed 🎉",
      htmlContent: html,
    },
    {
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );

  await axios.post(
    "https://api.brevo.com/v3/smtp/email",
    {
      sender: { email: process.env.EMAIL_FROM },
      to: [{ email: process.env.ADMIN_EMAIL }],
      subject: "New Order Received 🛒",
      htmlContent: html,
    },
    {
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );
};