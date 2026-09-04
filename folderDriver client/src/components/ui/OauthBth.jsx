import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { loginWithGoogle } from "../../Api/loginWithGoogle.js";

function GoogleBtn() {
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
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => toast.error("Login Failed")}
      theme="filled_blue"
      text="continue_with"
    />
  );
}

export default GoogleBtn;
