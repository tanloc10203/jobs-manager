import { Container } from "@mui/material";
import React from "react";
import "./footer.css";

function generate(element) {
  return [0, 1, 2, 3, 4, 5].map((value) =>
    React.cloneElement(element, {
      key: value,
    })
  );
}

function Footer(props) {
  return (
    <Container maxWidth="lg">
      <div className="footer">
        <div className="fLists">
          <ul className="fList">
            <li className="fListItem">Các quốc gia</li>
            <li className="fListItem">Khu vực</li>
            <li className="fListItem">Thành phố</li>
            <li className="fListItem">Quận</li>
            <li className="fListItem">Sân bay</li>
            <li className="fListItem">Khách sạn</li>
          </ul>
          <ul className="fList">
            <li className="fListItem">Nhà</li>
            <li className="fListItem">Căn hộ</li>
            <li className="fListItem">Resort</li>
            <li className="fListItem">Biệt thự</li>
            <li className="fListItem">Nhà trọ</li>
            <li className="fListItem">Nhà nghỉ B&B</li>
            <li className="fListItem">Nhà khách</li>
          </ul>
          <ul className="fList">
            <li className="fListItem">Những chỗ nghỉ độc đáo</li>
            <li className="fListItem">Tất cả các điểm đến</li>
            <li className="fListItem">Đánh giá của khách</li>
            <li className="fListItem">Khám phá lưu trú theo tháng</li>
            <li className="fListItem">Các bài viết</li>
          </ul>
          <ul className="fList">
            <li className="fListItem">Cho thuê xe hơi</li>
            <li className="fListItem">Tìm chuyến bay</li>
            <li className="fListItem">Đặt nhà hàng</li>
            <li className="fListItem">Dành cho Đại Lý Du Lịch</li>
          </ul>
          <ul className="fList">
            <li className="fListItem">Dịch vụ Khách Hàng</li>
            <li className="fListItem">Liên hệ công ty</li>
            <li className="fListItem">Thông báo về Bảo mật và Cookie</li>
            <li className="fListItem">Điều khoản và điều kiện</li>
            <li className="fListItem">Chúng tôi hoạt động như thế nào</li>
          </ul>
        </div>
        <div className="fText">Copyright © 2023 Endcool.booking</div>
      </div>
    </Container>
  );
}

Footer.propTypes = {};

export default Footer;
