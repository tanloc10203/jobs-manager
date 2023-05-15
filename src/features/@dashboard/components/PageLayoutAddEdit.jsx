import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Button, Container, Stack, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Page from "~/components/Page";

function PageLayoutAddEdit(props) {
  const { title, children, backLink } = props;
  const navigation = useNavigate();

  return (
    <Page title={title}>
      <Container maxWidth="xl">
        <Typography variant="h4">{title}</Typography>

        <KeyboardBackspaceIcon
          onClick={() => navigation(backLink, { replace: true })}
          sx={{ cursor: "pointer" }}
        />
        <Button component={RouterLink} to={backLink}></Button>

        <Stack mt={2}>{children}</Stack>
      </Container>
    </Page>
  );
}

PageLayoutAddEdit.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  backLink: PropTypes.string,
};

export default PageLayoutAddEdit;
