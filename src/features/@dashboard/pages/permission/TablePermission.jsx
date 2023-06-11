import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

const columns = [
  { id: "#", label: "#", minWidth: 50 },
  { id: "name", label: "Tên quyền", minWidth: 170 },
  { id: "slug", label: "Slug", minWidth: 170 },
  {
    id: "function",
    label: "Chức năng",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
];

export default function TablePermission({ rows = [], onUpdate }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const renderItem = React.useCallback((row, index) => {
    return (
      <>
        <TableRow
          hover
          tabIndex={-1}
          key={index}
          sx={{ bgcolor: !row._id ? "#ededed" : null }}
        >
          <TableCell>
            <Typography textTransform="capitalize" fontWeight="bold">
              {row.name}
            </Typography>
          </TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell align="right"></TableCell>
        </TableRow>

        {row.child &&
          row.child.length &&
          row.child.map((item, idx) => (
            <TableRow hover tabIndex={-1} key={idx}>
              <TableCell>{item._id}</TableCell>
              <TableCell>
                <Typography>{item.name}</Typography>
              </TableCell>
              <TableCell>{item.slug}</TableCell>
              <TableCell align="right">
                <IconButton aria-label="delete" color="error">
                  <DeleteIcon />
                </IconButton>
                <IconButton
                  aria-label="edit"
                  color="info"
                  onClick={() => onUpdate(item)}
                >
                  <EditRoundedIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
      </>
    );
  });

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length &&
              rows.map((row, index) => {
                return renderItem(row, index);
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
