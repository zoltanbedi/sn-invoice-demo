import { File } from "@sensenet/default-content-types";

export interface Invoice extends File {
  Paid: boolean;
}
