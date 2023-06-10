// component
import Iconify from "../../components/Iconify";

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: "dashboard",
    path: "/manager/app",
    icon: getIcon("eva:pie-chart-2-fill"),
  },
  {
    title: "Quản lý trạng thái",
    path: "/manager/status",
    icon: getIcon("material-symbols:detector-status"),
  },
  {
    title: "Quản lý người dùng",
    path: "/manager/user",
    icon: getIcon("eva:people-fill"),
  },
  {
    title: "Quản lý đặt phòng",
    path: "/manager/booking",
    icon: getIcon("tabler:brand-booking"),
  },
  {
    title: "Quản lý khách sạn",
    path: "/manager/hotel",
    icon: getIcon("carbon:manage-protection"),
  },
  {
    title: "Quản lý tầng",
    path: "/manager/floor",
    icon: getIcon("material-symbols:floor"),
  },
  {
    title: "Quản lý thiết bị",
    path: "/manager/device",
    icon: getIcon("material-symbols:device-hub"),
  },
  {
    title: "Quản lý loại phòng",
    path: "/manager/room-type",
    icon: getIcon("ic:round-room-preferences"),
  },
  {
    title: "Quản lý phòng",
    path: "/manager/room",
    icon: getIcon("material-symbols:auto-meeting-room"),
  },
  {
    title: "Quản lý doanh nghiệp",
    path: "/manager/concern",
    icon: getIcon("icon-park-outline:concern"),
  },
];

export const navConfigHotel = [
  {
    title: "dashboard",
    path: "/manager/app",
    icon: getIcon("eva:pie-chart-2-fill"),
  },
  {
    title: "Quyền",
    path: "/manager/permission",
    icon: getIcon("icon-park-twotone:permissions"),
  },
  {
    title: "Thêm vai trò",
    path: "/manager/role",
    icon: getIcon("carbon:user-role"),
  },
  {
    title: "danh sách vai trò",
    path: "/manager/list-role",
    icon: getIcon("mdi:format-list-bulleted-type"),
  },
];

export default navConfig;
