import CheckIcon from "@mui/icons-material/Check";
import ErrorIcon from "@mui/icons-material/Error";
import OfflinePinIcon from "@mui/icons-material/OfflinePin";
import CancelIcon from "@mui/icons-material/Cancel";

const statuses = {
  UNPAID: {
    key: "UNPAID",
    value: "Khách hàng sẽ thanh toán trong kì nghỉ.",
    response: "Phòng này bạn đã đặt trước đó. Vui lòng kiểm tra lại!",
    transform: "Đã nhận phòng",
    temp: "Khách hàng đã nhận phòng và đã thanh toán",
    color: "default",
    icon: <CheckIcon fontSize="inherit" />,
    title: "Xác nhận đã nhận phòng",
    textColor: "red",
    disabled: false,
  },
  PAID: {
    key: "PAID",
    value: "Khách hàng đã thanh toán.",
    response: "Phòng này bạn đã đặt trước đó. Vui lòng kiểm tra lại!",
    transform: "Đã nhận phòng",
    temp: "Khách hàng đã nhận phòng và đã thanh toán",
    color: "default",
    icon: <CheckIcon fontSize="inherit" />,
    title: "Xác nhận đã nhận phòng",
    textColor: "red",
    disabled: false,
  },
  OTHER: {
    key: "OTHER",
    value: "Đang thanh toán...",
    response: "Lỗi không xác định. Vui lòng quay lại sau!",
    transform: "Không xác định",
    temp: "Khách hàng đã nhận phòng",
    color: "error",
    icon: <ErrorIcon fontSize="inherit" />,
    textColor: "organce",
    title: "Xác nhận không xác định",
    disabled: true,
  },
  STARTED_USE: {
    key: "STARTED_USE",
    value: "Khách hàng đang sử dụng phòng.",
    response: "Phòng này bạn đang được sử dụng trong kỳ nghỉ của bạn!",
    transform: "Kết thúc kì nghỉ",
    temp: "Khách hàng đã trả phòng và thanh toán",
    color: "success",
    icon: <CheckIcon fontSize="inherit" />,
    textColor: "green",
    title: "Xác nhận kết thúc kì nghỉ",
    disabled: false,
  },
  ENDED_USE: {
    key: "ENDED_USE",
    value: "Khách hàng đã kết thúc kì nghỉ.",
    transform: "Kết thúc kì nghỉ",
    temp: "Khách hàng đã trả phòng và thanh toán",
    color: "error",
    icon: <OfflinePinIcon fontSize="inherit" />,
    title: "Kì nghỉ đã kết thúc",
    textColor: "blue",
    disabled: true,
  },
  CANCEL: {
    key: "CANCEL",
    value: "Khách hàng đã huỷ đặt phòng.",
    transform: "Huỷ",
    temp: "",
    color: "error",
    icon: <CancelIcon fontSize="inherit" />,
    title: "Đã huỷ phòng",
    textColor: "error",
    disabled: true,
  },
};

export default statuses;
