import { useSearchParams } from "react-router-dom";

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const paymentId = params.get("paymentId");
  return (
    <div>
      <h1>Payment Successful</h1>
      <p>Payment ID: {paymentId}</p>
      <p>Thanks for your order—your receipt has been emailed.</p>
    </div>
  );
};
export default PaymentSuccess;
