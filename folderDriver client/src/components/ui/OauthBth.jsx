import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { loginWithGoogle } from "../../Api/loginWithGoogle.js";

export default function GoogleBtn({ text = "continue_with" }) {
  const navigate = useNavigate();

  const handleSuccess = async ({ credential }) => {
    try {
      const data = await loginWithGoogle(credential);

      if (data.error) {
        toast.error(data.error);
        return;
      }

      toast.success("Logged in successfully");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  return (
    <div className="flex w-full justify-center overflow-hidden">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => toast.error("Google login failed")}
        theme="outline"
        size="large"
        shape="rectangular"
        text={text}
        width="380"
      />
    </div>
  );
}
