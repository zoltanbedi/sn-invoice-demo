import {
  Button,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography
} from "@material-ui/core";
import { useRepository } from "@sensenet/hooks-react";
import React, { useState } from "react";
import snLogo from "./assets/sensenet_logo_transparent.png";
import InvoiceList from "./components/invoice-list";
import NewInvoice from "./components/new-invoice";

/**
 * The main entry point of your app. You can start h@cking from here ;)
 */
export const App: React.FunctionComponent = () => {
  const repo = useRepository();
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false)

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100vh",
        flexDirection: "column",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundImage: `url(${snLogo})`,
        backgroundSize: "auto"
      }}
    >
      <CssBaseline />
      <AppBar color="default" elevation={0}>
        <Toolbar style={{ justifyContent: "space-between" }}>
          <Typography variant="h6" color="inherit" noWrap>
            Sn
          </Typography>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => repo.authentication.logout()}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <InvoiceList />
      <Button onClick={() => setIsNewDialogOpen(true)}>
        Create new Invoice
      </Button>
      <NewInvoice open={isNewDialogOpen} handleCancel={() => setIsNewDialogOpen(false)} />
    </div>
  );
};
