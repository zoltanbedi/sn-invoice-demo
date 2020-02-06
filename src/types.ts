import { GenericContent } from "@sensenet/default-content-types";

export interface Invoice extends GenericContent {
  Paid: boolean;
}
