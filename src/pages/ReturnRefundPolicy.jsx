import React from "react";

const ReturnRefundPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-3xl font-bold text-green-700 mb-6">Return & Refund Policy</h1>

      <p className="mb-4">
        At Cutting Corners shop, customer satisfaction is very important to us. 
        As a small business, we do not accept product returns at this time.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Store Credit Option</h2>
      <p className="mb-4">
        - If you still wish to return an order, you may do so at your own courier expense.<br />
        - Once we receive the returned item and verify its condition, we will issue store credit equivalent to the value of the product.<br />
        - Store credit can be used for future purchases on our platform.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Non-Returnable Items</h2>
      <p className="mb-4">
        - Items marked as "Final Sale" or "Non-Returnable"<br />
        - Opened or tampered packaged food products<br />
        - Custom or bulk orders unless defective
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Contact Us</h2>
      <p className="mb-2">
        If you have any questions about our Return & Refund Policy, feel free to contact our customer support team at 
        <a className="text-green-600 underline" href="mailto:support@cuttingcorners.in"> support@cuttingcorners.in</a>.
      </p>
    </div>
  );
};

export default ReturnRefundPolicy;
