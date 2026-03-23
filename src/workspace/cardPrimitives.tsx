import type { ReactNode } from "react";
import { CLS } from "./styles";

export function NarrativeCard(props: { children: ReactNode; className?: string }) {
  return <div className={`${CLS.narrativeCard} ${props.className ?? ""}`.trim()}>{props.children}</div>;
}

export function ProofCard(props: { children: ReactNode; className?: string }) {
  return <div className={`${CLS.proofCard} ${props.className ?? ""}`.trim()}>{props.children}</div>;
}

export function SurfaceCard(props: { children: ReactNode; className?: string }) {
  return <div className={`${CLS.surfaceCard} ${props.className ?? ""}`.trim()}>{props.children}</div>;
}

export function DossierCard(props: { children: ReactNode; className?: string }) {
  return <div className={`${CLS.dossierCard} ${props.className ?? ""}`.trim()}>{props.children}</div>;
}

export function CompareCard(props: { children: ReactNode; className?: string }) {
  return <div className={`${CLS.compareCard} ${props.className ?? ""}`.trim()}>{props.children}</div>;
}
