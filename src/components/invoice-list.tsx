import { Checkbox, TableCell, Tooltip, Button } from "@material-ui/core";
import { useRepository, useRepositoryEvents } from "@sensenet/hooks-react";
import { ContentList } from "@sensenet/list-controls-react";
import React, { useEffect, useState, useCallback } from "react";
import { FullScreenLoader } from "./full-screen-loader";
import { Invoice } from "../types";
import { parentPath } from './new-invoice';

export default function InvoiceList() {
  const repository = useRepository();
  const eventHub = useRepositoryEvents();
  const [invoices, setInvoices] = useState<Invoice[]>();

  const getInvoices = useCallback(
    async function() {
      try {
        const result = await repository.loadCollection<Invoice>({
          path: parentPath,
          oDataOptions: {
            select: ["DisplayName", "Id", "Paid"],
            query: "+TypeIs: Invoice",
            orderby: "DisplayName"
          }
        });
        setInvoices(result.d.results);
      } catch (error) {
        console.log(error);
      }
    },
    [repository]
  );

  useEffect(() => {
    getInvoices();
  }, [getInvoices]);

  useEffect(() => {
    const subscription = [
      eventHub.onContentModified.subscribe(getInvoices),
      eventHub.onContentCreated.subscribe(getInvoices)
    ];
    return () => subscription.forEach(s => s.dispose());
  }, [
    eventHub.onContentCreated,
    eventHub.onContentModified,
    getInvoices,
    invoices
  ]);

  const payClick = async (content: any) => {
    await repository.patch<Invoice>({
      content: { Paid: !content.Paid },
      idOrPath: content.Id
    });
  };

  if (!invoices) {
    return <FullScreenLoader />;
  }

  return (
    <div>
      <ContentList
        items={invoices}
        displayRowCheckbox={false}
        fieldComponent={props => {
          switch (props.field) {
            case "Paid" as any:
              return (
                <TableCell>
                  <Checkbox
                    checked={(props.content as any).Paid}
                    disabled={true}
                  />
                </TableCell>
              );
            case "Actions" as any:
              return (
                <TableCell>
                  <Button onClick={() => payClick(props.content)}>Pay</Button>
                </TableCell>
              );
            default:
              return (
                <TableCell>
                  <Tooltip title={props.content.Path}>
                    <span>{props.content[props.field]} </span>
                  </Tooltip>
                </TableCell>
              );
          }
        }}
        fieldsToDisplay={["DisplayName", "Id", "Paid", "Actions"] as any}
        schema={repository.schemas.getSchemaByName("Invoice")}
      />
    </div>
  );
}
