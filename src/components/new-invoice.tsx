import React, { useState } from "react";
import { NewView } from "@sensenet/controls-react";
import { useRepository } from "@sensenet/hooks-react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Snackbar
} from "@material-ui/core";
import { object, string } from "yup";

const validationSchema = object().shape({
  Name: string().required(),
  Description: string().required()
});

export default function NewInvoice({
  open,
  handleCancel
}: {
  open: boolean;
  handleCancel: () => void;
}) {
  const repo = useRepository();
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  return (
    <Dialog open={open}>
      <DialogTitle>Create new Invoice</DialogTitle>
      <DialogContent>
        <NewView
          repository={repo}
          handleCancel={handleCancel}
          contentTypeName="Invoice"
          path="Root/Sites/Default_Site/Zoltán-s workspace"
          onSubmit={async content => {
            try {
              await validationSchema.validate(content, {
                abortEarly: false
              });

              try {
                const created = await repo.post({
                  contentType: "Invoice",
                  parentPath: "Root/Sites/Default_Site/Zoltán-s workspace",
                  content
                });
                handleCancel();
                console.log({ created });
              } catch (error) {
                console.log(error);
              }
            } catch (error) {
              setIsSnackbarOpen(true);
              setErrorMessage(error.message);
            }
          }}
        />
        <Snackbar
          open={isSnackbarOpen}
          onClose={() => setIsSnackbarOpen(false)}
          autoHideDuration={3000}
          message={errorMessage}
        />
      </DialogContent>
    </Dialog>
  );
}
