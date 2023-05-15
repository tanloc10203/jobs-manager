import React from "react";
import PropTypes from "prop-types";
import {
  Box,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

function TableInfo({ loading, dataHead, children }) {
  return (
    <TableContainer sx={{ mt: 2, position: "relative" }} component={Paper}>
      {loading && (
        <Box sx={{ width: "100%", position: "absolute" }}>
          <LinearProgress />
        </Box>
      )}
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {dataHead &&
              dataHead.length > 0 &&
              dataHead.map((item, index) => {
                if (index === 0)
                  return <TableCell key={index}>{item}</TableCell>;

                return (
                  <TableCell align="right" key={index}>
                    {item}
                  </TableCell>
                );
              })}
          </TableRow>
        </TableHead>
        <TableBody>{children}</TableBody>
      </Table>
    </TableContainer>
  );
}

TableInfo.propTypes = {
  loading: PropTypes.bool,
  dataHead: PropTypes.array.isRequired,
  children: PropTypes.node.isRequired,
};

export default TableInfo;
