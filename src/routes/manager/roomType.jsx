import { lazy } from "react";
import Loadable from "~/components/Loadable";

const RoomTypeManagePage = Loadable(
  lazy(() => import("../../features/@dashboard/pages/rooms/RoomType"))
);

const roomTypeRoutes = [
  {
    path: "room-type",
    element: <RoomTypeManagePage />,
  },
];

export default roomTypeRoutes;
