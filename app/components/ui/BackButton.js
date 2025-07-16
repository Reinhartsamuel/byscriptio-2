"use client";
import { cn } from "@/lib/util";
import { useRouter } from "next/navigation";
import React from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import PropTypes from "prop-types";

const BackButton = (props) => {
  const router = useRouter();
  return (
    <button className={cn(props?.className)} onClick={() => router.back()}>
      <FaArrowLeftLong color="lightgray" />
    </button>
  );
};

BackButton.propTypes = {
  className: PropTypes.string,
};

export default BackButton;
