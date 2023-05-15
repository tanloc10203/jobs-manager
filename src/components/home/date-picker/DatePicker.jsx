import { vi } from "date-fns/locale";
import PropTypes from "prop-types";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file

function DatePicker({ date, onChangeDate }) {
  return (
    <DateRange
      editableDateInputs={true}
      onChange={(item) => onChangeDate(item)}
      moveRangeOnFirstSelection={false}
      ranges={date}
      minDate={new Date()}
      locale={vi}
      scroll={{ enabled: true }}
    />
  );
}

DatePicker.propTypes = {
  date: PropTypes.array.isRequired,
  onChangeDate: PropTypes.func,
};

export default DatePicker;
