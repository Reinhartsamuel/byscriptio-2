"use client";
import ModalPurchasePlan from "@/app/components/ModalPurchasePlan";
import Spinner from "@/app/components/ui/Spinner";
import { authFirebase } from "@/app/config/firebase";
import { useUserStore } from "@/app/store/userStore";
import calculateCommission from "@/app/utils/calculateCommission";
import {
  getCollectionFirebase,
  getSingleDocumentFirebase,
  updateDocumentFirebase,
} from "@/app/utils/firebaseApi";
import { cn } from "@/lib/util";
import moment from "moment";
import { useSearchParams } from "next/navigation";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2/dist/sweetalert2.js";

export default function CheckoutPage() {
  const { customer } = useUserStore();
  const searchParams = useSearchParams();

  const subscriptionId = searchParams.get("sid");

  const [loading, setLoading] = useState(false);
  const [voucherCode, setVoucherCode] = useState("");
  const [paymentLink, setPaymentLink] = useState("");
  const [productDetail, setProductDetail] = useState(null);

  // modal manual transfer
  const [purchaseModal, setPurchaseModal] = useState(false);

  const [data, setData] = useState({});

  function selectPayment(e) {
    e.preventDefault();
    Swal.fire({
      title: "Continue payment?",
      icon: "info",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Manual Bank Transfer",
      denyButtonText: "Pay with Crypto",
      confirmButtonColor: "#4080f0",
      denyButtonColor: "#ffffff",
      color: "#716add",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        // alert("pay with transfer");
        setPurchaseModal(true);
      } else if (result.isDenied) {
        handleSubmit();
        // alert("pay with crypto");
      }
    });
  }

  async function handleSubmit() {
    try {
      setLoading(true);

      // create nowpayments invoice
      const r = await fetch("/api/invoice/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          price: data.price,
          subscriptionId,
          productName: data.productName,
          customer,
        }),
      });
      const { data: nowpaymentsData, error, message } = await r.json();
      // console.log(nowpaymentsData, 'nowpaymentsData');
      updateDocumentFirebase("subscriptions", subscriptionId, {
        paymentLink: nowpaymentsData?.invoice_url,
      }).catch(console.error);

      // console.log(error, 'error')
      // console.log(message, 'message')
      if (error || message) throw new Error(message);
      setPaymentLink(nowpaymentsData?.invoice_url);
      if (nowpaymentsData?.invoice_url)
        window.open(nowpaymentsData?.invoice_url);
      const iframe = document.getElementById("iframe-payment");
      if (iframe) {
        iframe.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } catch (error) {
      Swal.fire("", error.message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function redeemVoucher() {
    try {
      // find voucher code
      const result = await getCollectionFirebase("vouchers", [
        { field: "voucherCode", operator: "==", value: voucherCode },
      ]);

      if (Array.isArray(result) && result?.length > 0) {
        const voucherData = result[0];
        //check if still active
        if (voucherData?.expiredAt?.seconds < moment().unix()) {
          return Swal.fire("", "Voucher code has expired", "warning");
        } else if (!voucherData?.active) {
          return Swal.fire("", "This voucher cannot be used", "warning");
        } else {
          // check if voucher is for only new customers
          if (voucherData?.isForNewUser) {
            // search for previous subscriptions
            const searchPreviousSubscriptions = await getCollectionFirebase(
              "subscriptions",
              [
                {
                  field: "email",
                  operator: "==",
                  value: authFirebase.currentUser?.email,
                },
              ],
            );
            if (searchPreviousSubscriptions?.length > 0)
              return Swal.fire("", "Voucher is only for new users", "warning");
          }

          //check if already redeemed
          const resultSubscription = await getCollectionFirebase(
            "subscriptions",
            [{ field: "voucherCode", operator: "==", value: voucherCode }],
          );
          if (resultSubscription?.length >= voucherData?.maxSlot) {
            return Swal.fire(
              "",
              "Oops! The voucher's quota has been reached",
              "warning",
            );
          } else if (!voucherData?.productIds?.includes(data?.id)) {
            return Swal.fire(
              "",
              "Oops! The voucher code is not valid for this product",
              "warning",
            );
          } else {
            let discount =
              voucherData?.type === "DISCOUNT"
                ? voucherData?.amount
                : (data?.price * voucherData?.amount) / 100;
            let previousPrice = data?.price;
            let price =
              voucherData?.type === "DISCOUNT"
                ? data?.price - parseInt(voucherData?.amount)
                : data?.price * ((100 - voucherData?.amount) / 100);
            updateDocumentFirebase("subscriptions", subscriptionId, {
              voucherCode,
              price,
              previousPrice,
              discount,
              affiliateCommission: customer?.affiliatorCustomerId
                ? calculateCommission(
                    customer?.affiliateLevel,
                    parseInt(price) || 0,
                  ).amount
                : 0,
            });
            setData({
              ...data,
              voucherCode,
              price,
              previousPrice,
              discount,
              affiliateCommission: customer?.affiliatorCustomerId
                ? calculateCommission(
                    customer?.affiliateLevel,
                    parseInt(price) || 0,
                  ).amount
                : 0,
            });
            Swal.fire(
              "Voucher code redeemed successfully",
              `You get Rp ${discount} discount`,
              "success",
            );
          }
        }
      } else {
        return Swal.fire("", "Voucher code not found", "warning");
      }
    } catch (error) {
      Swal.fire("", error.message, "error");
    }
  }

  async function getData() {
    try {
      setLoading(true);
      const res = await getSingleDocumentFirebase(
        "subscriptions",
        subscriptionId,
      );
      setData(res);
      const res2 = await getSingleDocumentFirebase("products", res.productId);
      setProductDetail(res2);
    } catch (error) {
      console.error("ERRORGETDATAAAAA", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, [subscriptionId]);

  return (
    <div
      className={`min-h-screen p-4 bg-gray-900 text-white dark:bg-gray-800 transition duration-500 dark:text-white`}
    >
      {/* Header */}
      <nav className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Checkout</span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Order Summary Section */}
        <div className="w-full md:w-1/2 bg-gray-800 rounded-lg p-4 shadow-md">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="bg-gray-700 rounded-lg p-4 mb-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-medium">{data?.productName}</h3>

                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  {productDetail?.features?.length > 0 && (
                    <ul>
                      {productDetail?.features?.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="">
                <p className="text-base font-medium">
                  IDR {data?.price?.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Discount Code */}
          <div className="bg-gray-700 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6v2H2v-2a6 6 0 016-6zM7 13h5v2H7z" />
              </svg>
              <span className="text-sm">Voucher</span>
            </div>
            <div className="flex items-center justify-between gap-2 mt-2">
              <input
                onKeyDown={(e) => {
                  if (paymentLink) return;
                  if (e.key === "Enter") redeemVoucher();
                }}
                onChange={(e) => setVoucherCode(e.target.value)}
                disabled={paymentLink?.length > 0}
                type="text"
                id="input-group-1"
                className={cn(
                  "bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
                  paymentLink ? "cursor-not-allowed" : "",
                )}
                placeholder="Input your voucher code"
              />
              <button
                onClick={redeemVoucher}
                disabled={loading || paymentLink?.length > 0}
                className={cn(
                  "whitespace-nowrap px-4 py-2 text-white rounded",
                  paymentLink?.length > 0
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed hover:bg-gray-600"
                    : "bg-indigo-600 hover:bg-indigo-700",
                )}
              >
                Redeem
              </button>
            </div>
          </div>

          {/* Payment Section */}
          <div className="w-full bg-gray-800 rounded-lg p-4 shadow-md">
            <h2 className="text-xl font-bold mb-4">Payment Details</h2>

            {/* Subtotal and Total */}
            <div className="w-full flex justify-between">
              <p className="text-sm text-gray-400">Subtotal</p>
              <p className="text-base font-medium">
                IDR{" "}
                {data?.previousPrice
                  ? data?.previousPrice?.toLocaleString()
                  : data?.price?.toLocaleString()}
              </p>
            </div>
            {data?.discount && (
              <div className="w-full flex justify-between">
                <p className="text-sm text-gray-400">Discount</p>
                <p className="text-base font-medium">
                  IDR {data?.discount?.toLocaleString()}
                </p>
              </div>
            )}
            <div className="w-full flex justify-between">
              <p className="text-sm text-gray-400">Total</p>
              <p className="text-base font-medium">
                IDR {data?.price?.toLocaleString()}
              </p>
            </div>
          </div>
          {/* Pay Button */}
          <button
            onClick={selectPayment}
            disabled={loading || paymentLink.length !== 0}
            className={cn(
              "w-full px-4 py-4 flex items-center justify-center bg-indigo-600 text-white rounded hover:bg-indigo-700",
              (loading || paymentLink.length !== 0) &&
                "bg-gray-600 text-gray-400 cursor-not-allowed hover:bg-gray-600",
            )}
          >
            {loading && <Spinner className="mr-2" />}
            <p>Pay IDR {data?.price?.toLocaleString()}</p>
          </button>
          {paymentLink && (
            <a
              className="mb-10"
              href={paymentLink}
              target="_blank"
              rel="noreferrer"
            >
              Payment page not showing? Manually click{" "}
              <span className="underline text-blue-400">here</span> to proceed
              payment
            </a>
          )}
        </div>

        {paymentLink && (
          <div
            className="h-screen w-full md:w-1/2 flex flex-col gap-2"
            id="iframe-payment"
          >
            <iframe
              src={`${paymentLink}&_=${Date.now()}`}
              style={{ width: "100%", height: "100%" }}
            />
            <div className="mt-4 text-sm text-gray-400">
              Powered by Nowpayments
            </div>
          </div>
        )}
      </div>
      <ModalPurchasePlan
        purchaseModal={purchaseModal}
        setPurchaseModal={setPurchaseModal}
        detail={data}
      />
    </div>
  );
}

CheckoutPage.propTypes = {
  purchaseModal: PropTypes.bool,
  setPurchaseModal: PropTypes.any,
  detail: PropTypes.any,
};
