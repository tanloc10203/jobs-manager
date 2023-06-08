import PropTypes from "prop-types";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import permissionAPI from "~/apis/permission";
import { authState } from "~/features/authentication/authSlice";
import { history } from "~/utils";

function PassLogin({ children }) {
  const { accessToken } = useSelector(authState);

  useEffect(() => {
    (async () => {
      const response = await permissionAPI.checkFirstStartApp();

      const { metadata } = response;

      console.log(metadata);

      if (!metadata.start) {
        Swal.fire({
          icon: "error",
          title: "Đã xảy ra lỗi...",
          text: `Có vẻ như bạn chưa tạo tài khoản admin. Vui lòng đăng ký để được quản trị.`,
        });

        history.push("/sign-up-admin");
      }
    })();
  }, []);

  // if (accessToken) {
  //   return <Navigate to="/manager/app" />;
  // }

  return children;
}

PassLogin.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PassLogin;
