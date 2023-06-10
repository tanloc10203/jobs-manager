import { Box, Container, Grid, Paper } from "@mui/material";
import Page from "~/components/Page";

import { PermissionSchema } from "~/utils";
import FormAddEditPermission from "./FormAddEditPermission";
import TablePermission from "./TablePermission";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { appActions, appState } from "~/features/app/appSlice";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import permissionAPI from "~/apis/permission";

function Permission(props) {
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const { openOverlay: loading } = useSelector(appState);

  const getAll = async (filters = {}) => {
    try {
      const response = await permissionAPI.getPermission(filters);
      setData(response.metadata);
    } catch (error) {
      console.log("get all permission error", error);
    }
  };

  useEffect(() => {
    (async (filters) => {
      await getAll(filters);
    })({});
  }, []);

  const initialValues = {
    name: "",
    slug: "",
    desc: "",
  };

  const handleSubmit = (values, resetForm) => {
    return new Promise((resolve, reject) => {
      console.log("values:::", values);
      start();

      const timer = setTimeout(async () => {
        try {
          const response = await permissionAPI.createPermission(values);

          if (response) {
            clearTimeout(timer);
            end();
            toast.success("Thêm quyền thành công");
            resetForm();
            await getAll();
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
    dispatch(appActions.setText("Đang thêm quyền..."));
  };

  const end = () => {
    dispatch(appActions.setOpenOverlay(false));
    dispatch(appActions.setText(""));
  };

  return (
    <Page title="Quyền">
      <Container maxWidth="xl">
        <Grid container spacing={2}>
          <Grid item xs={5}>
            <Paper sx={{ borderRadius: 0 }}>
              <Box
                bgcolor="#ededed"
                textTransform="uppercase"
                fontWeight="bold"
                p={2}
              >
                Thêm quyền
              </Box>
              <Box p={2}>
                <FormAddEditPermission
                  schema={PermissionSchema}
                  onSubmit={handleSubmit}
                  initialValues={initialValues}
                  loading={loading}
                />
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
              <Box p={2}>{data.length && <TablePermission rows={data} />}</Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

Permission.propTypes = {};

export default Permission;
