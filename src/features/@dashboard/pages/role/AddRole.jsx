import { Box, Container, Paper, Typography } from "@mui/material";
import Page from "~/components/Page";
import FormAddEditRole from "./FormAddEditRole";
import { useEffect, useState } from "react";
import { getAllPermission } from "../permission/Permission";
import { RoleSchema } from "~/utils";
import { toast } from "react-toastify";
import { appActions, appState } from "~/features/app/appSlice";
import roleAPI from "~/apis/role";
import { AxiosError } from "axios";
import { useDispatch, useSelector } from "react-redux";

function AddRole(props) {
  const [pers, setPers] = useState([]);
  const dispatch = useDispatch();
  const { openOverlay: loading } = useSelector(appState);

  const initialValues = {
    name: "",
    desc: "",
  };

  const initialPers = async (filters) => {
    const response = (await getAllPermission(filters)).map((item) => ({
      ...item,
      child: item.child.map((i) => ({ ...i, isChecked: false })),
    }));
    setPers(response);
  };

  useEffect(() => {
    (async (filters) => {
      await initialPers(filters);
    })({});
  }, []);

  const handleSubmit = (values, resetForm) => {
    if (!pers.some((per) => per.child.some((i) => i.isChecked))) {
      toast.error("Vui lòng chọn quyền cho vai trò này");
      return;
    }

    const permissions = [];

    pers.map((per) => per.child.map((p) => p.isChecked && permissions.push(p)));

    const data = {
      ...values,
      permissions,
    };

    console.log(data);

    return new Promise((resolve) => {
      start();

      const timer = setTimeout(async () => {
        try {
          let response = await roleAPI.createRole(data);

          if (response) {
            clearTimeout(timer);
            end();
            toast.success("Thêm vai trò thành công");
            resetForm();
            await initialPers();
            resolve(true);
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
      appActions.setText("Đang thêm vai trò. Vui lòng chờ trong giây lát.")
    );
  };

  const end = () => {
    dispatch(appActions.setOpenOverlay(false));
    dispatch(appActions.setText(""));
  };

  return (
    <Page title="Thêm vai trò">
      <Container maxWidth="xl">
        <Paper sx={{ borderRadius: 0 }}>
          <Box
            bgcolor="#ededed"
            p={2}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography textTransform="uppercase" fontWeight={700}>
              thêm mới vai trò
            </Typography>
          </Box>
          <Box p={2}>
            <FormAddEditRole
              schema={RoleSchema}
              initialValues={initialValues}
              onSubmit={handleSubmit}
              loading={loading}
              pers={pers}
              onChangePer={(newPers) => setPers(newPers)}
            />
          </Box>
        </Paper>
      </Container>
    </Page>
  );
}

AddRole.propTypes = {};

export default AddRole;
