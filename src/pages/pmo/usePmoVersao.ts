import { useOutletContext } from "react-router-dom";

export type PmoVersaoOutletContext = {
  versaoId: number;
};

export function usePmoVersao() {
  return useOutletContext<PmoVersaoOutletContext>();
}
