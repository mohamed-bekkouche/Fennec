import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import { googleLogin } from "../../services/authService";
import { login } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Button from "../Buttons/Button";

const GoogleSignIn = () => {
  const navigate = useNavigate();

  const handleSuccess = async (tokenResponse: { access_token: string }) => {
    try {
      const res = await googleLogin({ credential: tokenResponse.access_token });
      const { user, access_token } = res.data;
      if (!user.isAdmin) {
        toast.error("User is not Autorized To This Page");
        return;
      }
      toast.success("Logged in with Google!");
      setTimeout(() => {
        login(user, access_token);
        navigate("/");
      }, 2000);
    } catch (err) {
      toast.error("Google login failed");
    }
  };

  const loginWithGoogle = useGoogleLogin({
    flow: "implicit",
    onSuccess: handleSuccess,
    onError: () => toast.error("Google login failed"),
  });

  return (
    <Button
      action={() => loginWithGoogle()}
      styles="bg-off-black border-off-black hover:text-off-black md:!py-2 mx-auto !rounded-full !mb-6"
      content={
        <span className="flex items-center gap-2 justify-center">
          {" "}
          <FcGoogle className="text-[1.75rem] md:text-3xl -mt-0.5" />{" "}
          <span className="text-sm">Continue With Google </span>
        </span>
      }
    />
  );
};

export default GoogleSignIn;
