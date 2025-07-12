import React, { useState, useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { TbFlagCancel } from "react-icons/tb";

export default function UploadStatusComponent({ status, message }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (status !== null && status !== undefined) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status, message]);

  if (!show) return null;

  return (
    <div>
      {status === true && (
        <div className="mt-4 p-3 bg-green-100/80 border border-green-300/50 rounded-lg">
          <p className="text-green-700 flex items-center">
            <FaCheckCircle className="mr-2" />
            {message || "File Uploaded Successfully"}
          </p>
        </div>
      )}

      {status === false && (
        <div className="mt-4 p-3 bg-red-100/80 border border-red-300/50 rounded-lg">
          <p className="text-red-700 flex items-center">
            <TbFlagCancel className="mr-2" />
            {message || "Error Uploading the file"}
          </p>
        </div>
      )}
    </div>
  );
}
