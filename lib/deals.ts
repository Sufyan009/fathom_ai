// CRM-lite data model. Mirrors what Fathom's real "CRM sync" (Business plan)
// does — turn sales/CS calls into deal records with a pipeline stage, an
// owner, and synced fields — as local seed data. No real Salesforce/HubSpot
// connection; the "Sync" affordances are labeled as such.

export type DealStage = "discovery" | "qualified" | "proposal" | "negotiation" | "closed_won" | "closed_lost";
export type CrmSystem = "salesforce" | "hubspot" | null;
export type Health = "green" | "yellow" | "red";

export interface Deal {
  id: string;
  company: string;
  contactName: string;
  contactEmail: string;
  owner: string; // matches a User.name
  stage: DealStage;
  valueUsd: number;
  health: Health;
  crmSystem: CrmSystem;
  meetingIds: string[]; // linked calls, empty if no call yet
  nextStep: string;
  lastActivityAt: string; // ISO
}

export const STAGES: { id: DealStage; label: string }[] = [
  { id: "discovery", label: "Discovery" },
  { id: "qualified", label: "Qualified" },
  { id: "proposal", label: "Proposal" },
  { id: "negotiation", label: "Negotiation" },
  { id: "closed_won", label: "Closed Won" },
  { id: "closed_lost", label: "Closed Lost" },
];

/** Stages a deal can still move forward through (excludes the closed_lost
 * side-exit, which is reached via "Mark as lost" rather than advancing). */
export const OPEN_STAGE_FLOW: DealStage[] = ["discovery", "qualified", "proposal", "negotiation", "closed_won"];

export const DEALS: Deal[] = [
  {
    id: "d_brightwave",
    company: "Brightwave",
    contactName: "Alex Turner",
    contactEmail: "alex@brightwave.com",
    owner: "Sam Rivera",
    stage: "proposal",
    valueUsd: 54000,
    health: "yellow",
    crmSystem: "salesforce",
    meetingIds: ["m_sales_brightwave"],
    nextStep: "Send SOC 2 report and DPA to security team",
    lastActivityAt: "2026-09-07T15:30:00.000Z",
  },
  {
    id: "d_acme_expansion",
    company: "Acme Co.",
    contactName: "Jordan Kim",
    contactEmail: "jordan@acme.co",
    owner: "Mohsin Ali",
    stage: "negotiation",
    valueUsd: 18000,
    health: "green",
    crmSystem: "hubspot",
    meetingIds: ["m_cs_acme"],
    nextStep: "Send expansion quote for ~30 seats",
    lastActivityAt: "2026-09-05T18:40:00.000Z",
  },
  {
    id: "d_lighthouse",
    company: "Lighthouse Partners",
    contactName: "Nina Cole",
    contactEmail: "nina@lighthousepartners.io",
    owner: "Sam Rivera",
    stage: "closed_won",
    valueUsd: 32000,
    health: "green",
    crmSystem: "salesforce",
    meetingIds: [],
    nextStep: "Kick off onboarding",
    lastActivityAt: "2026-08-29T13:00:00.000Z",
  },
  {
    id: "d_northwind_renewal",
    company: "Northwind Retail",
    contactName: "Priya Malhotra",
    contactEmail: "priya@northwindretail.com",
    owner: "Mohsin Ali",
    stage: "discovery",
    valueUsd: 21000,
    health: "yellow",
    crmSystem: "hubspot",
    meetingIds: [],
    nextStep: "Book a renewal call before contract end",
    lastActivityAt: "2026-09-02T10:00:00.000Z",
  },
  {
    id: "d_stratus",
    company: "Stratus Analytics",
    contactName: "Owen Fields",
    contactEmail: "owen@stratusanalytics.ai",
    owner: "Sam Rivera",
    stage: "qualified",
    valueUsd: 40000,
    health: "green",
    crmSystem: "salesforce",
    meetingIds: [],
    nextStep: "Scope a technical evaluation",
    lastActivityAt: "2026-09-03T16:00:00.000Z",
  },
];

export function findDealByMeeting(meetingId: string): Deal | undefined {
  return DEALS.find((d) => d.meetingIds.includes(meetingId));
}

export function dealsByStage(deals: Deal[]): Record<DealStage, Deal[]> {
  const out = Object.fromEntries(STAGES.map((s) => [s.id, [] as Deal[]])) as Record<DealStage, Deal[]>;
  for (const d of deals) out[d.stage].push(d);
  return out;
}
