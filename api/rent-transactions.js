import { serveLedger } from "./_ledger-store.js";

export default function handler(req, res) {
  return serveLedger("rent-transactions", req, res);
}
