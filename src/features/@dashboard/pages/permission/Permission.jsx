import {
  Box,
  Container,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import Page from "~/components/Page";
import { PermissionSchema } from "~/utils";
import FormAddEditPermission from "./FormAddEditPermission";
import TablePermission from "./TablePermission";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { appActions, appState } from "~/features/app/appSlice";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import permissionAPI from "~/apis/permission";
import AddIcon from "@mui/icons-material/Add";

export const getAllPermission = async (filters = {}) => {
  try {
    const response = await permissionAPI.getPermission(filters);
    return response.metadata;
  } catch (error) {
    console.log("get all permission error", error);
  }
};

function Permission(props) {
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const { openOverlay: loading } = useSelector(appState);
  const [selected, setSelected] = useState(null);

  const handleGetAllPer = async (filters) => {
    const response = await getAllPermission(filters);
    setData(response);
  };

  useEffect(() => {
    (async (filters) => {
      await handleGetAllPer(filters);
    })({});
  }, []);

  const initialValues = useMemo(
    () => ({
      name: "",
      slug: "",
      desc: "",
      ...selected,
    }),
    [selected]
  );

  const handleSubmit = (values, resetForm) => {
    return new Promise((resolve, reject) => {
      start();

      const timer = setTimeout(async () => {
        try {
          let response;
          if (selected) {
            response = await permissionAPI.updatePermission(values._id, values);
          } else {
            response = await permissionAPI.createPermission(values);
          }

          if (response) {
            clearTimeout(timer);
            end();
            toast.success(
              selected ? "Cập nhật quyền thành công" : "Thêm quyền thành công"
            );
            resetForm();
            setSelected(null);
            await handleGetAllPer();
          }
        } catch (error) {
          clearTimeout(timer);
          end();
          if (error instanceof AxiosError) {
            toast.error(error.response.data.message);
          }
        }
      }, 1500);
    });
  };

  const start = () => {
    dispatch(appActions.setOpenOverlay(true));
    dispatch(
      appActions.setText(
        selected ? "Đang cập nhật quyền..." : "Đang thêm quyền..."
      )
    );
  };

  const end = () => {
    dispatch(appActions.setOpenOverlay(false));
    dispatch(appActions.setText(""));
  };

  const handleUpdate = (permission) => {
    setSelected(permission);
  };

  return (
    <Page title="Quyền">
      <Container maxWidth="xl">
        <Grid container spacing={2}>
          <Grid item xs={5}>
            <Paper sx={{ borderRadius: 0 }}>
              <Box
                bgcolor="#ededed"
                p={2}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography textTransform="uppercase" fontWeight={700}>
                  {selected ? "Cập nhật quyền" : "Thêm quyền"}
                </Typography>
                <IconButton
                  aria-label="edit"
                  color="info"
                  onClick={() => setSelected(null)}
                >
                  <AddIcon />
                </IconButton>
              </Box>
              <Box p={2}>
                {selected ? (
                  <FormAddEditPermission
                    schema={PermissionSchema}
                    onSubmit={handleSubmit}
                    initialValues={initialValues}
                    loading={loading}
                  />
                ) : (
                  <FormAddEditPermission
                    schema={PermissionSchema}
                    onSubmit={handleSubmit}
                    initialValues={initialValues}
                    loading={loading}
                  />
                )}
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={7}>
            <Paper sx={{ borderRadius: 0 }}>
              <Box
                bgcolor="#ededed"
                textTransform="uppercase"
                fontWeight="bold"
                p={2}
              >
                Danh sách quyền
              </Box>
              <Box p={2}>
                {data.length && (
                  <TablePermission rows={data} onUpdate={handleUpdate} />
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

Permission.propTypes = {};

export default Permission;
