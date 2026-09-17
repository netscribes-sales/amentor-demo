import React, { useState, useRef, useEffect, useMemo } from "react";

/* ------------------------------------------------------------------ */
/*  Audit Mentor, running as an app inside Microsoft Teams             */
/*  Netscribes demonstration build for Titan Industries                */
/*  Responses are scripted. No live model call.                        */
/* ------------------------------------------------------------------ */

const CSS = `
.tm * { box-sizing: border-box; }
.tm {
  --brand:#5B5FC7; --brand-bg:#E8EBFA; --brand-soft:#F0F2FC;
  --bg:#FFFFFF; --rail:#F0F0F0; --chrome:#FAF9F8;
  --hov:#F5F5F5; --sel:#EBEBEB;
  --bd:#D1D1D1; --bd-soft:#E1DFDD;
  --tx:#242424; --tx2:#616161; --tx3:#8A8886;
  --ok:#0F7B0F; --err:#C4314B;
  --sg:'Segoe UI','Segoe UI Web (West European)',-apple-system,BlinkMacSystemFont,Roboto,'Helvetica Neue',sans-serif;
  font-family: var(--sg); font-size:14px; line-height:1.45; color:var(--tx);
  background:var(--rail); height:100vh; display:flex; overflow:hidden; -webkit-font-smoothing:antialiased;
}
.tm button { font-family:inherit; color:inherit; background:none; border:none; cursor:pointer; }
.tm button:focus-visible, .tm input:focus-visible { outline:2px solid var(--brand); outline-offset:1px; }

.rail { width:68px; flex:none; background:var(--rail); border-right:1px solid var(--bd-soft);
  display:flex; flex-direction:column; align-items:center; padding:8px 0; gap:2px; }
.ri { width:60px; padding:7px 0 5px; display:flex; flex-direction:column; align-items:center;
  gap:3px; color:var(--tx2); position:relative; border-radius:4px; }
.ri:hover { background:var(--sel); }
.ri.on { color:var(--brand); }
.ri.on::before { content:''; position:absolute; left:2px; top:50%; transform:translateY(-50%);
  width:3px; height:16px; background:var(--brand); border-radius:2px; }
.ri svg { width:20px; height:20px; } .ri span { font-size:10px; line-height:1.2; }
.rsp { flex:1; }
.rav { width:32px; height:32px; border-radius:50%; background:var(--brand); color:#fff;
  display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:600; margin-bottom:4px; }

.app { flex:1; display:flex; flex-direction:column; min-width:0; background:var(--bg); }
.hdr { background:var(--bg); border-bottom:1px solid var(--bd-soft); padding:0 20px; flex:none; }
.hdr-t { display:flex; align-items:center; gap:12px; height:54px; }
.appic { width:32px; height:32px; flex:none; border-radius:4px; background:var(--brand); color:#fff;
  display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:700; }
.appnm { font-size:15px; font-weight:600; }
.appsub { font-size:11.5px; color:var(--tx2); margin-top:1px; }
.viewas { margin-left:auto; display:flex; align-items:center; gap:8px; border:1px solid var(--bd);
  border-radius:4px; padding:4px 6px 4px 10px; background:var(--bg); }
.viewas-l { font-size:10.5px; color:var(--tx3); }
.viewas-v { font-size:12.5px; } .viewas-v b { color:var(--brand); font-weight:600; }
.viewas-b { font-size:12px; color:var(--brand); border:1px solid var(--bd); border-radius:4px;
  padding:4px 9px; font-weight:600; }
.viewas-b:hover { background:var(--brand-soft); border-color:var(--brand); }
.tabs { display:flex; gap:20px; height:34px; align-items:flex-end; }
.tab { font-size:13px; color:var(--tx2); padding-bottom:8px; border-bottom:2px solid transparent; }
.tab.on { color:var(--tx); font-weight:600; border-bottom-color:var(--brand); }
.tab:hover { color:var(--tx); }

.body { flex:1; overflow-y:auto; }
.body-in { max-width:840px; margin:0 auto; padding:26px 24px 40px; }
.pg-h { font-size:20px; font-weight:600; margin:0 0 6px; }
.pg-s { font-size:13.5px; color:var(--tx2); margin:0 0 4px; max-width:72ch; }

.thr { flex:1; overflow-y:auto; padding:20px 0 6px; }
.thr-in { max-width:780px; margin:0 auto; padding:0 24px; }
.row { display:flex; gap:10px; margin-bottom:16px; }
.row.me { justify-content:flex-end; }
.av { width:32px; height:32px; flex:none; border-radius:50%; background:var(--brand); color:#fff;
  display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; }
.col { min-width:0; max-width:92%; }
.nm { display:flex; align-items:baseline; gap:8px; margin-bottom:4px; }
.nm b { font-size:13px; font-weight:600; } .nm i { font-style:normal; font-size:11px; color:var(--tx3); }
.bub { background:var(--brand-bg); border-radius:8px 8px 2px 8px; padding:9px 13px;
  font-size:14px; max-width:520px; }
.bub-t { font-size:11px; color:var(--tx3); margin-top:4px; text-align:right; }
.quote { border-left:3px solid var(--brand); background:var(--brand-soft); border-radius:0 4px 4px 0;
  padding:7px 11px; margin-bottom:6px; font-size:11.5px; color:var(--tx2); max-width:520px; }
.quote b { color:var(--brand); }

.card { background:var(--bg); border:1px solid var(--bd-soft); border-radius:6px;
  box-shadow:0 1px 2px rgba(0,0,0,.06); overflow:hidden; max-width:640px; }
.sec { padding:13px 16px; border-bottom:1px solid var(--bd-soft); }
.sec:last-child { border-bottom:none; }
.sk { font-size:11px; font-weight:600; color:var(--tx3); text-transform:uppercase;
  letter-spacing:.04em; margin-bottom:6px; }
.card .lead { font-size:14.5px; }
.card p { margin:0; font-size:13.5px; }
.card ul { margin:0; padding-left:18px; }
.card li { font-size:13.5px; margin-bottom:5px; } .card li:last-child { margin-bottom:0; }
.ask li::marker { color:var(--brand); }
.card.refuse { border-left:3px solid var(--err); }
.card.refuse .sk.head { color:var(--err); }
.src { display:flex; gap:9px; align-items:flex-start; margin-bottom:6px; font-size:12.5px; }
.src:last-child { margin-bottom:0; }
.tier { flex:none; font-size:10px; font-weight:600; border-radius:3px; padding:2px 6px;
  background:var(--sel); color:var(--tx2); margin-top:1px; }
.tier.t1 { background:var(--brand-bg); color:var(--brand); }
.src span { color:var(--tx2); } .src span i { font-style:normal; color:var(--tx3); }
.acts { display:flex; flex-wrap:wrap; gap:8px; padding:12px 16px; background:var(--chrome); }
.act { font-size:12.5px; font-weight:600; color:var(--brand); background:var(--bg);
  border:1px solid var(--bd); border-radius:4px; padding:7px 12px; text-align:left; }
.act:hover { background:var(--brand-soft); border-color:var(--brand); }

.wel { padding:6px 0 14px; }
.wel h1 { font-size:22px; font-weight:600; margin:0 0 6px; }
.wel p { font-size:13.5px; color:var(--tx2); margin:0; max-width:64ch; }
.grp { margin-top:18px; }
.gk { font-size:11px; font-weight:600; color:var(--tx3); text-transform:uppercase;
  letter-spacing:.04em; margin-bottom:8px; }
.chips { display:grid; grid-template-columns:repeat(2,1fr); gap:8px; }
@media (max-width:740px){ .chips{ grid-template-columns:1fr; } }
.chip { border:1px solid var(--bd); border-radius:6px; background:var(--bg); padding:11px 13px;
  font-size:13px; text-align:left; color:var(--tx); }
.chip:hover { background:var(--brand-soft); border-color:var(--brand); }
.hint { font-size:12.5px; color:var(--tx3); margin-top:20px; }

.lib { border:1px solid var(--bd-soft); border-radius:6px; overflow:hidden; margin-top:8px; }
.lib-row { display:flex; gap:14px; align-items:flex-start; padding:12px 16px; width:100%;
  text-align:left; border-bottom:1px solid var(--bd-soft); }
.lib-row:last-child { border-bottom:none; }
.lib-row:hover { background:var(--brand-soft); }
.lib-q { font-size:13.5px; font-weight:600; }
.lib-d { font-size:12.5px; color:var(--tx2); margin-top:2px; }
.lib-go { margin-left:auto; flex:none; font-size:12px; color:var(--brand); font-weight:600; }

.st { width:100%; border-collapse:collapse; margin-top:10px; border:1px solid var(--bd-soft); }
.st th { text-align:left; font-size:11px; font-weight:600; color:var(--tx3); text-transform:uppercase;
  letter-spacing:.04em; padding:9px 13px; background:var(--chrome); border-bottom:1px solid var(--bd-soft); }
.st td { padding:11px 13px; font-size:13px; border-bottom:1px solid var(--bd-soft); vertical-align:top; }
.st tr:last-child td { border-bottom:none; }
.st .doc { font-weight:600; } .st .meta { font-size:12px; color:var(--tx2); margin-top:2px; }
.st .num { white-space:nowrap; color:var(--tx2); font-size:12.5px; }
.pill { display:inline-block; font-size:10.5px; font-weight:600; border-radius:3px; padding:2px 7px; }
.pill.idx { background:#DFF6DD; color:var(--ok); }
.pill.exc { background:#FDE7E9; color:var(--err); }
.tierhead { margin:26px 0 0; } .tierhead h3 { font-size:14px; font-weight:600; margin:0; }

.ab { margin-top:22px; }
.ab h3 { font-size:14px; font-weight:600; margin:0 0 8px; }
.ab ul { margin:0 0 4px; padding-left:18px; }
.ab li { font-size:13.5px; margin-bottom:6px; }
.note { border-left:3px solid var(--brand); background:var(--brand-soft); border-radius:0 4px 4px 0;
  padding:12px 14px; font-size:13px; color:var(--tx2); margin-top:18px; }
.flow { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; margin-top:10px; }
@media (max-width:760px){ .flow{ grid-template-columns:1fr 1fr; } }
.fl { border:1px solid var(--bd-soft); border-radius:6px; padding:12px 13px; }
.fl b { display:block; font-size:12.5px; font-weight:600; margin-bottom:4px; }
.fl span { font-size:12px; color:var(--tx2); }

.cmp { flex:none; padding:0 24px 16px; background:var(--bg); }
.cmp-in { max-width:780px; margin:0 auto; position:relative; }
.sug { position:absolute; bottom:calc(100% + 6px); left:0; right:0; background:var(--bg);
  border:1px solid var(--bd); border-radius:6px; box-shadow:0 4px 16px rgba(0,0,0,.14);
  overflow:hidden; z-index:30; }
.sug-h { font-size:11px; font-weight:600; color:var(--tx3); text-transform:uppercase;
  letter-spacing:.04em; padding:9px 14px 7px; background:var(--chrome);
  border-bottom:1px solid var(--bd-soft); }
.sug-i { display:flex; align-items:center; gap:12px; width:100%; text-align:left;
  padding:10px 14px; border-bottom:1px solid var(--bd-soft); }
.sug-i:last-child { border-bottom:none; }
.sug-i:hover, .sug-i.on { background:var(--brand-soft); }
.sug-q { font-size:13.5px; }
.sug-q mark { background:#FFF3C4; color:inherit; padding:0 1px; border-radius:2px; }
.sug-s { margin-left:auto; flex:none; font-size:11px; color:var(--tx3); }
.cbox { border:1px solid var(--bd); border-radius:6px; background:var(--bg); }
.cbox:focus-within { border-color:var(--brand); box-shadow:0 0 0 1px var(--brand); }
.cbox input { width:100%; border:none; background:none; padding:12px 14px 6px;
  font-family:inherit; font-size:14px; color:var(--tx); outline:none; }
.cbox input::placeholder { color:var(--tx3); }
.crow { display:flex; align-items:center; gap:6px; padding:4px 8px 8px; }
.cic { width:28px; height:28px; border-radius:4px; display:flex; align-items:center;
  justify-content:center; color:var(--tx2); }
.cic:hover { background:var(--hov); } .cic svg { width:16px; height:16px; }
.csp { flex:1; }
.send { width:30px; height:30px; border-radius:4px; display:flex; align-items:center;
  justify-content:center; color:var(--tx3); }
.send.hot { color:var(--brand); } .send.hot:hover { background:var(--brand-soft); }
.send svg { width:18px; height:18px; }
.foot { margin-top:7px; display:flex; justify-content:space-between; gap:14px; flex-wrap:wrap;
  font-size:11px; color:var(--tx3); }
.foot button { font-size:11px; color:var(--tx3); text-decoration:underline; }
.foot button:hover { color:var(--brand); }

.typ { display:flex; gap:4px; padding:10px 2px; }
.typ i { width:6px; height:6px; border-radius:50%; background:var(--tx3);
  animation:tp 1.2s infinite ease-in-out; }
.typ i:nth-child(2){ animation-delay:.16s } .typ i:nth-child(3){ animation-delay:.32s }
@keyframes tp { 0%,72%,100%{opacity:.3;transform:translateY(0)} 36%{opacity:1;transform:translateY(-3px)} }
@media (prefers-reduced-motion: reduce){ .tm *,.tm *::before,.tm *::after{
  transition:none !important; animation:none !important; } }
`;

const ROLES = {
  rotational: { key: "rotational", who: "Ananya R", initials: "AR", title: "Rotational Auditor, Year 1" },
  lead: { key: "lead", who: "Vikram N", initials: "VN", title: "Lead Auditor" },
};

/* source shorthand */
const SRC = {
  std: { t: 1, n: "IIA Global Internal Audit Standards", i: "2024 edition" },
  gtag: { t: 1, n: "IIA GTAG Continuous Auditing and Monitoring", i: "3rd edition" },
  lines: { t: 1, n: "IIA Three Lines Model", i: "2020" },
  meth: { t: 2, n: "Titan Internal Audit Methodology", i: "version 4.2" },
  wp: { t: 2, n: "Titan IA Workpaper Standard", i: "version 2.1" },
  p2p: { t: 2, n: "Titan P2P Audit Programme FY26", i: "version 1.4" },
  doa: { t: 2, n: "Titan Delegation of Authority Matrix, Jewellery", i: "version 9" },
  comp: { t: 2, n: "Titan Audit Competency Framework", i: "version 1.3" },
  charter: { t: 2, n: "Titan Internal Audit Charter", i: "version 3.0" },
  inv: { t: 2, n: "Titan Inventory and Bullion Control Manual", i: "version 2.0" },
  jw: { t: 2, n: "Titan Job Work and Karigar Control Procedure", i: "version 3.1" },
  ret: { t: 2, n: "Titan Retail and Franchise Audit Programme FY26", i: "version 1.1" },
  itgc: { t: 2, n: "Titan ITGC Audit Programme FY26", i: "version 1.2" },
  jwl25: { t: 3, n: "Jewellery Division P2P Audit FY25", i: "issued 18 Jul 2025" },
  wch25: { t: 3, n: "Watches Division P2P Audit FY25", i: "issued 22 Sep 2025" },
  r2r25: { t: 3, n: "Corporate R2R Audit FY25", i: "issued 04 Nov 2025" },
};
const s = (k, i) => (i ? { ...SRC[k], i } : SRC[k]);

/* ------------------------------------------------------------------ */
/*  Topic corpus                                                       */
/* ------------------------------------------------------------------ */

const Q = {

  /* ---------------- PLANNING ---------------- */
  scoping: {
    ask: "How do I scope a P2P audit?",
    blurb: "Build scope from the risk and the control universe rather than from last year's programme.",
    stage: "Planning", keys: ["scope", "scoping", "plan the audit", "planning an audit"],
    r: {
      lead: "Start from the risk assessment and the control universe for the entity, then decide what to leave out and be able to defend it. Last year's programme is an input, not the starting point.",
      why: "Titan methodology requires the engagement objective to trace back to an assessed risk. Scoping from the prior programme quietly carries forward last year's blind spots, and it is the most common reason a scope memo fails review. Where continuous testing already covers a control across the full population, the scoping question changes from whether to test it to what to do with what it already found.",
      consider: [
        "Controls already running continuously do not need a separate substantive test. Effort moves to exception disposition and to controls the engine does not cover.",
        "Scope the process end to end rather than by SAP module, because the risks that matter sit at the handoffs.",
        "Be explicit about what is excluded and why. An unstated exclusion reads as an oversight at review.",
        "Check whether prior year actions are due for follow up in this period, since that is scope whether you planned it or not.",
      ],
      askNext: [
        "Which risks in the register map to P2P for this entity, and which have no control tested against them",
        "What the continuous testing already covers, so you are not duplicating it",
        "Whether the process owner agrees with your understanding of the process before you fix the scope",
      ],
      sources: [s("meth", "engagement planning and scope memo"), s("p2p", "risk to control mapping"), s("std", "Standard 2201, planning considerations")],
      fups: ["coverage", "riskassess", "materiality"],
    },
  },

  riskassess: {
    ask: "How do I build the risk assessment for an entity?",
    blurb: "Move from a generic risk list to the risks that actually apply to this division.",
    stage: "Planning", keys: ["risk assessment", "risk register", "assess risk", "inherent risk"],
    r: {
      lead: "Start from the process, not from a risk library. Walk the process with the owner, identify what could go wrong at each step, then rate inherent risk before considering controls.",
      why: "A risk library gives you the risks that apply to every jewellery company. The risks that matter to this division come from how the process actually runs here, which is why the walkthrough comes first. Rating residual risk before you have tested the controls is the most common sequencing error, because it assumes the control works.",
      consider: [
        "Rate inherent risk first, then test, then conclude on residual. Doing it in the other order builds your conclusion into your planning.",
        "Risks concentrate at handoffs between functions and between systems, so give those disproportionate attention.",
        "Where a division handles bullion or high value stock, the value at risk per transaction changes the rating even when likelihood is low.",
        "Management's own risk register is an input and not the answer. Where you disagree with their rating, that gap is itself worth reporting.",
      ],
      askNext: [
        "Which risks have no control mapped against them at all, since that is usually the most useful output of the exercise",
        "Whether the process has changed since the last assessment, because a system change often invalidates the prior rating",
        "What the division's own risk owners would say is their biggest exposure, and whether it matches your list",
      ],
      sources: [s("meth", "risk assessment and rating"), s("std", "Standard 2210.A1, engagement risk assessment"), s("lines")],
      fups: ["scoping", "materiality", "sod"],
    },
  },

  materiality: {
    ask: "How do I set materiality for an operational audit?",
    blurb: "Why financial materiality rarely works for control testing, and what to use instead.",
    stage: "Planning", keys: ["materiality", "threshold", "how much matters", "significance"],
    r: {
      lead: "Operational audits rarely use a single financial threshold. Titan methodology asks you to set significance by reference to the control's purpose, which may be value, volume, or the nature of the breach.",
      why: "A vendor created without KYC documentation is significant regardless of the value of spend that followed, because the risk is who was let into the vendor master rather than how much they were paid. Applying a financial floor to that control would suppress exactly the exceptions worth seeing. Value based materiality works for payment and invoice controls, and works badly for master data and access controls.",
      consider: [
        "Set the basis per control family rather than once for the engagement, and record why.",
        "For value based controls, the exposure figure from continuous testing gives you a defensible basis, so use it rather than a percentage of turnover.",
        "For access and master data controls, a single instance can be significant, and the right measure is nature rather than size.",
        "Agree the basis with the process owner before fieldwork, because it determines which exceptions you will raise with them.",
      ],
      askNext: [
        "Whether your basis would let through a breach you would be uncomfortable explaining to the audit committee",
        "Whether the same basis was used last year, since changing it mid series makes trend comparison meaningless",
        "How you will treat a large population of individually immaterial exceptions that are material in aggregate",
      ],
      sources: [s("meth", "significance and materiality"), s("std", "Standard 2210, engagement objectives")],
      fups: ["scoping", "falsepositive", "rating"],
    },
  },

  coverage: {
    ask: "If every transaction is tested, do I still need to sample?",
    blurb: "How sampling changes when the control test runs across the full population.",
    stage: "Planning", keys: ["sample", "sampling", "population", "coverage", "every transaction", "100%"],
    r: {
      lead: "Not for the control test itself. The test already runs across the population, so there is no sampling risk to manage there. You will still sample, but you sample exceptions for investigation rather than transactions for testing.",
      why: "Sampling exists to make an inference about a population you cannot examine in full. Once the rule runs over every record, that inference is unnecessary and the conclusion about the control rests on complete evidence. What is not feasible is investigating every exception individually, so judgement moves one step downstream, to which exceptions you work and why.",
      consider: [
        "Your workpaper has to be explicit that the population was tested in full, otherwise a reviewer will look for the sampling rationale and not find one.",
        "Exception selection needs its own documented basis, usually value, severity and pattern. Picking the first twenty in the list is not a basis.",
        "A very large exception population is often a tolerance problem rather than a control problem, and that is worth recording rather than investigating around.",
        "External audit may still expect a sampling approach for their own reliance. Agree that early rather than at year end.",
      ],
      askNext: [
        "What basis you will document for choosing which exceptions to investigate",
        "Whether the exception rate is stable against prior periods, since a sudden change is more informative than the absolute number",
        "Whether the rule logic itself has been validated, because full population testing of a wrong rule is still wrong",
      ],
      sources: [s("meth", "sampling and population testing"), s("gtag", "coverage and reliance"), s("std", "Standard 2320, analysis and evaluation")],
      fups: ["evidence", "falsepositive", "scoping"],
    },
  },

  /* ---------------- FIELDWORK, P2P CONTROLS ---------------- */
  splitting: {
    ask: "What is control 4.1-R2 actually testing for?",
    blurb: "Order splitting, and why it leaves no trace in the approval record.",
    stage: "Fieldwork, P2P controls", keys: ["4.1-r2", "split", "splitting", "order split"],
    context: { rule: "4.1-R2", count: "1,517 exceptions" },
    byRole: {
      rotational: {
        lead: "Order splitting. The control looks for several purchase orders raised to the same vendor inside a short window that, added together, cross an approval limit a single order of that value would have triggered.",
        why: "Delegation of authority limits at Titan apply per purchase order, not per vendor per period. The limit can be stayed under without any override being recorded, because each individual order was properly approved at its own level. Nothing in the approval trail looks wrong. The pattern is only visible across orders, which is why this is tested analytically rather than by inspecting approvals.",
        consider: [
          "A hit is not automatically a finding. Genuine separate requirements raised days apart by different cost centres will surface here and are legitimate.",
          "Call off orders against an existing rate contract commonly trigger this rule and are usually explained by the contract.",
          "The window matters. Titan uses 7 days for this rule, and a deliberate splitter often spaces orders just outside a known window.",
        ],
        askNext: [
          "Which approval threshold was crossed by the combined value, and by how much",
          "Whether the same person raised all the orders in the group",
          "Whether a rate contract already existed that should have been used instead",
          "Whether this vendor also appears in exceptions for 1.1-R1 or 6.1-R2, which suggests something other than sloppiness",
        ],
        sources: [s("p2p", "section 4.1, purchase order controls"), s("doa", "approval bands"), s("std", "Standard 2320, analysis and evaluation")],
        fups: ["controlType", "opinion", "rootcause"],
      },
      lead: {
        lead: "Order splitting, tested across orders rather than within any single approval trail. For scoping, treat the 1,517 hits as a population to be stratified, not a list to be worked through.",
        why: "Per order delegation limits mean splitting leaves no override in the approval record, so the exception population will be large and mostly benign. The audit judgement sits in how you stratify it, not in whether the rule fired. Working the list sequentially is the most common way teams lose three weeks on this control.",
        consider: [
          "Stratify by combined value against the threshold crossed. Groups that cleared a threshold by a wide margin are a different risk from those that cleared it marginally.",
          "Cross reference against 1.1-R1 and 6.1-R2 on the same vendor. Repeat appearance across unrelated controls is the cross control signal worth escalating.",
          "Agree the materiality floor with the business before fieldwork, not after, or you will renegotiate every finding.",
          "Decide whether the recommendation is tighter detection or moving the check upstream into the SAP release strategy, because that changes who needs to be in the closing meeting.",
        ],
        askNext: [
          "What proportion of the population sits above your materiality floor once grouped",
          "Whether the split pattern concentrates in one cost centre or is spread across the division",
          "Whether prior year fieldwork raised the same control, and what management committed to then",
        ],
        sources: [s("p2p", "section 4.1, purchase order controls"), s("meth", "scoping and stratification"), s("jwl25", "order splitting observation"), s("std", "Standard 2320")],
        fups: ["controlType", "opinion", "repeatfinding"],
      },
    },
  },

  vendorkyc: {
    ask: "A vendor was created without KYC documents. What do I test?",
    blurb: "Control 1.1-R1, and why the exception matters regardless of spend value.",
    stage: "Fieldwork, P2P controls", keys: ["kyc", "1.1-r1", "vendor created", "vendor master", "pan", "gst certificate"],
    r: {
      lead: "Establish what is actually missing, whether the vendor transacted while incomplete, and who approved the creation. The gap in documentation is the condition, but the exposure is what happened in the window while it was open.",
      why: "The vendor master is the entry point to the payment process. A vendor without verified identity and bank evidence can receive payment on the strength of an internal record alone, which is the mechanism behind most vendor fraud. Titan requires PAN, GST registration, bank proof and registered address before activation, so any gap means the gate was not closed.",
      consider: [
        "Check the sequence. A vendor created incomplete and completed two days later is a different risk from one that transacted for six months incomplete.",
        "Look at spend during the incomplete window. Zero spend narrows this to a process discipline issue rather than an exposure.",
        "Check whether the same creator appears repeatedly, since a pattern points to a workaround rather than an oversight.",
        "A missing GST registration also carries an input credit consequence, so finance may already be aware of the vendor for a different reason.",
      ],
      askNext: [
        "Whether the vendor bank details were independently verified at any point, even informally",
        "Whether this vendor also failed 1.1-R2, meaning the creator and the requester were the same person",
        "Whether the grace period in policy is realistic, because an unrealistic one guarantees recurring exceptions",
      ],
      sources: [s("p2p", "section 1.1, vendor master controls"), s("meth", "evidence and corroboration"), s("std", "Standard 2320")],
      fups: ["dupvendor", "bankchange", "sod"],
    },
  },

  dupvendor: {
    ask: "How do I investigate potential duplicate vendors?",
    blurb: "Control 1.3-R2, and why duplicates are both a control issue and a payment risk.",
    stage: "Fieldwork, P2P controls", keys: ["duplicate vendor", "1.3-r2", "same pan", "duplicate bank"],
    r: {
      lead: "Match on the attributes that are hard to change rather than on name. Tax registration and bank account are the reliable identifiers. Name matching produces noise because the same entity is spelled six ways.",
      why: "A duplicate vendor record is not itself fraud, but it defeats several controls at once. Spend against one supplier is split across two records so no threshold is reached, payment history looks thinner than it is, and a duplicate invoice can be paid twice against two different vendor codes without the duplicate check ever firing.",
      consider: [
        "Same PAN on two active codes is the strongest signal. Same bank account across differently named vendors is stronger still and needs escalation, not just clean up.",
        "Legitimate duplicates exist, for example a vendor operating across two states with separate GST registrations. Establish that before concluding.",
        "Check whether the duplicates were created by the same user, and whether they were created close together in time.",
        "Test whether any invoice was paid against both codes, because that converts a master data finding into a recovery.",
      ],
      askNext: [
        "Whether spend split across the codes would have crossed an approval threshold if combined",
        "Whether the consolidation process exists at all, or whether duplicates simply accumulate",
        "Whether either code shows a recent bank change, which changes the risk significantly",
      ],
      sources: [s("p2p", "section 1.3, vendor master maintenance"), s("jwl25", "vendor master observations"), s("std", "Standard 2320")],
      fups: ["vendorkyc", "dupinvoice", "bankchange"],
    },
  },

  bankchange: {
    ask: "How should I test vendor bank detail changes?",
    blurb: "Controls 1.2-R2 and 7.1-R1, the highest value fraud path in P2P.",
    stage: "Fieldwork, P2P controls", keys: ["bank change", "bank detail", "1.2-r2", "7.1-r1", "call back", "bank account change"],
    r: {
      lead: "Test three things together. Who made the change, whether independent verification happened before it took effect, and whether a payment followed shortly afterwards.",
      why: "Changing a vendor's bank account is the single most direct route from system access to money leaving the organisation. It needs no fake invoice and no collusion with procurement. Testing the change in isolation misses the point, because the risk only crystallises when a payment runs against the new details. That is why Titan pairs the master data control with a payment side control.",
      consider: [
        "A change followed by payment within days is the pattern worth prioritising, regardless of value.",
        "Call back verification is only meaningful if the number was obtained independently rather than from the change request itself.",
        "Check whether dual control was applied or bypassed under an emergency flag, and whether the emergency was documented.",
        "Watch for a change reverted shortly after payment, which is a deliberate concealment pattern rather than an error.",
      ],
      askNext: [
        "Whether the verification evidence would satisfy you if you were investigating an actual loss",
        "Whether the same user has made multiple bank changes across different vendors",
        "Whether payment release and master data maintenance can be performed by the same role",
      ],
      sources: [s("p2p", "sections 1.2 and 7.1"), s("meth", "fraud risk in engagement planning"), s("std", "Standard 1210.A2, fraud awareness")],
      fups: ["sod", "paymentdual", "vendorkyc"],
    },
  },

  threeway: {
    ask: "What does the three way match control actually prove?",
    blurb: "Control 6.1-R1, and the assertion it does and does not cover.",
    stage: "Fieldwork, P2P controls", keys: ["three way", "3 way", "6.1-r1", "match", "goods receipt invoice"],
    r: {
      lead: "It proves that what was ordered, what was received and what was invoiced agree. It does not prove the goods were needed, that the price was competitive, or that the receipt was genuine.",
      why: "Auditors frequently treat a passing three way match as assurance over the whole purchase. It is narrower than that. It is a consistency check across three documents, and every one of those documents can be created inside the organisation. If the same person can raise the order and post the receipt, the match can be satisfied without anything physical arriving.",
      consider: [
        "The match is only as strong as the segregation behind it, which is why 5.1-R2 exists alongside it.",
        "Service purchases have no physical receipt, so the service entry sheet carries the whole weight and needs different evidence.",
        "A high match failure rate is often a tolerance configuration issue rather than a control breakdown, so check the tolerance before concluding.",
        "Manually released blocked invoices are worth examining separately, because that is where the match is overridden rather than satisfied.",
      ],
      askNext: [
        "Who can release a blocked invoice, and whether that is the same population who can post receipts",
        "Whether the tolerance percentages are documented and approved, or simply inherited from the system default",
        "Whether non purchase order invoices bypass this control entirely, and how large that population is",
      ],
      sources: [s("p2p", "section 6.1, invoice processing"), s("meth", "control reliance"), s("std", "Standard 2320")],
      fups: ["nonpo", "dupinvoice", "grnvariance"],
    },
  },

  dupinvoice: {
    ask: "How do I test for duplicate invoices?",
    blurb: "Control 6.1-R2, and the variants a simple match will miss.",
    stage: "Fieldwork, P2P controls", keys: ["duplicate invoice", "6.1-r2", "paid twice", "double payment"],
    r: {
      lead: "Exact matching on vendor, amount and reference catches the accidental duplicates. The ones that matter usually differ slightly, so test fuzzy variants as well.",
      why: "Genuine duplicate payments are usually errors, and errors are untidy. The same invoice re entered often has a transposed reference, a different date, or is booked against a second vendor code for the same supplier. A control that only matches exactly reports a low duplicate rate and gives false comfort.",
      consider: [
        "Test across vendor codes, not within them, since duplicates and duplicate vendors compound each other.",
        "Check reference numbers with characters transposed or leading zeros dropped, which is the most common data entry variant.",
        "Same amount and same date to different references can be a genuine split delivery, so do not treat similarity as proof.",
        "Where a duplicate was paid and later recovered, the control still failed, and the recovery is mitigation rather than absence of a finding.",
      ],
      askNext: [
        "Whether any identified duplicate resulted in a payment, and whether it was recovered",
        "Whether the vendor notified the overpayment, since relying on vendors to report is not a control",
        "Whether credit notes issued against duplicates were actually applied or left open",
      ],
      sources: [s("p2p", "section 6.1, invoice processing"), s("jwl25", "duplicate payment observation"), s("std", "Standard 2320")],
      fups: ["dupvendor", "threeway", "rootcause"],
    },
  },

  nonpo: {
    ask: "How should I treat non purchase order spend?",
    blurb: "Control 6.2-R1, usually the largest exception population in P2P.",
    stage: "Fieldwork, P2P controls", keys: ["non po", "non-po", "6.2-r1", "without po", "no purchase order"],
    r: {
      lead: "Separate the categories where policy permits it from the categories where it does not. The finding is almost never that non purchase order spend exists, it is that it exists where a purchase order was mandatory.",
      why: "Every organisation has legitimate non purchase order spend, utilities, statutory payments, some professional fees. Titan defines which categories those are. Reporting the whole population as a finding gets the observation dismissed in the closing meeting, because management knows most of it is allowed. The credible finding is confined to the categories where the policy was breached.",
      consider: [
        "Volume here is usually high and value per item low, so this is a control discipline issue rather than an exposure issue unless the values are large.",
        "Check whether non purchase order invoices bypass the three way match entirely, because that is the real control consequence.",
        "Look at who approves these invoices, since the approval often sits with the person who incurred the spend.",
        "A category appearing repeatedly may indicate the policy is impractical rather than ignored, which changes the recommendation.",
      ],
      askNext: [
        "Which categories account for most of the population, and whether policy permits them",
        "What the approval evidence is when there is no purchase order to approve against",
        "Whether the same vendor receives both purchase order and non purchase order invoices, which is worth understanding",
      ],
      sources: [s("p2p", "section 6.2, non purchase order spend"), s("doa", "approval requirements by category"), s("std", "Standard 2320")],
      fups: ["threeway", "falsepositive", "rating"],
    },
  },

  grnvariance: {
    ask: "How do I test goods receipt quantity variances?",
    blurb: "Control 5.1-R1, and why the tolerance is usually the story.",
    stage: "Fieldwork, P2P controls", keys: ["grn", "goods receipt", "5.1-r1", "quantity variance", "over receipt"],
    r: {
      lead: "Test both directions. Over receipt creates a payment exposure, under receipt with no follow up means the organisation paid for something it did not get. Then test whether the tolerance itself is reasonable.",
      why: "Variance controls are usually configured once and never revisited. A tolerance set generously enough that nothing fails gives the appearance of a working control while providing no assurance. Conversely a tolerance set too tight generates thousands of exceptions nobody investigates, which is equally worthless. The control's effectiveness is largely determined by a configuration decision rather than by operation.",
      consider: [
        "Establish who set the tolerance and when, and whether it was approved or inherited.",
        "Over receipt matters most where the goods are high value by weight, which in a jewellery division means anything involving metal.",
        "Under receipts left open create a purchase order that never closes, which distorts commitment reporting as well.",
        "Check whether receipts are posted by the same people who raise orders, since that undermines the whole control.",
      ],
      askNext: [
        "Whether the tolerance is the same across all material categories, and whether that makes sense",
        "What happens to a variance once flagged, and whether anyone closes the loop",
        "Whether quality rejection after receipt is handled separately, since that is a different exposure",
      ],
      sources: [s("p2p", "section 5.1, goods receipt"), s("inv", "receipt and variance tolerances"), s("std", "Standard 2320")],
      fups: ["threeway", "goldstock", "sod"],
    },
  },

  paymentdual: {
    ask: "How do I test dual authorisation on payments?",
    blurb: "Control 7.3-R2, and the difference between two approvals and real dual control.",
    stage: "Fieldwork, P2P controls", keys: ["dual authorisation", "dual control", "7.3-r2", "payment approval", "two approvers"],
    r: {
      lead: "Test that two distinct people approved, that neither could have performed the other's role, and that the second approval happened before release rather than after.",
      why: "Dual authorisation fails in three ways that all look compliant in the system record. The same person holding two user accounts, two people in the same reporting line where one cannot realistically challenge the other, and a second approval applied retrospectively to clear an exception report. The system shows two approvals in every one of those cases.",
      consider: [
        "Check the timestamp sequence, not just the presence of two approvals.",
        "Look at whether the two approvers are ever different. A pair that always appears together is a routine rather than a control.",
        "Confirm the threshold above which dual authorisation applies is set where the policy says it is.",
        "Emergency or manual payment runs often sit outside the normal control path and need testing separately.",
      ],
      askNext: [
        "Whether any single user holds both approval roles in the access matrix, even if never used together",
        "Whether payments just below the dual control threshold cluster suspiciously",
        "How manual and emergency payments are authorised, since that is usually where the exception lives",
      ],
      sources: [s("p2p", "section 7.3, payment processing"), s("itgc", "role conflict matrix"), s("std", "Standard 2320")],
      fups: ["sod", "bankchange", "itgcaccess"],
    },
  },

  /* ---------------- FIELDWORK, OTHER PROCESSES ---------------- */
  sod: {
    ask: "How do I audit segregation of duties conflicts?",
    blurb: "Distinguishing a conflict that exists on paper from one that was actually used.",
    stage: "Fieldwork, other processes", keys: ["segregation", "sod", "conflict", "duties", "role conflict"],
    r: {
      lead: "Report two populations separately. Users who hold conflicting access, and users who actually executed both sides of a conflicting pair. The second is a much smaller list and a much stronger finding.",
      why: "A conflict matrix run against the access tables produces a large number of theoretical conflicts, most of which were never exercised. Reporting that number alone invites management to dispute the whole finding as overstated. Testing which conflicts were exercised converts a governance observation into evidence of an actual control breakdown.",
      consider: [
        "Access conflict is the exposure, execution is the event. Both belong in the report, framed differently.",
        "Mitigating controls may legitimately exist, for example an independent review of what the conflicted user did. Test the mitigation rather than accepting its existence.",
        "Smaller divisions genuinely have fewer people, so some conflicts are structural. The recommendation there is compensating control, not separation.",
        "Emergency and firefighter access is often excluded from the matrix, and it is where the conflicts concentrate.",
      ],
      askNext: [
        "Which conflicts were actually exercised in the period, and by whom",
        "Whether the conflict matrix itself is current, since it usually lags organisational change",
        "How elevated access is granted, logged and revoked",
      ],
      sources: [s("itgc", "role conflict matrix and access review"), s("meth", "control design and mitigation"), s("std", "Standard 2110, governance")],
      fups: ["itgcaccess", "paymentdual", "bankchange"],
    },
  },

  itgcaccess: {
    ask: "What should I test in user access reviews?",
    blurb: "Joiners, movers and leavers, and why movers are the weak point.",
    stage: "Fieldwork, other processes", keys: ["access", "user access", "itgc", "provisioning", "leavers", "privileged"],
    r: {
      lead: "Test the three population movements separately. Joiners for whether access matched the approved role, leavers for revocation timing, and movers for whether old access was removed when they changed roles.",
      why: "Joiners and leavers are usually controlled because HR triggers them. Movers rarely are, because an internal transfer generates a request to add access and almost never one to remove it. Access accumulates over a career, which is how long serving employees end up holding combinations no one would ever have approved in one go.",
      consider: [
        "Test leaver revocation against the actual last working day, not the HR record date, since these differ.",
        "Accumulated access from movers is where segregation of duties conflicts originate, so the two tests inform each other.",
        "Privileged and generic accounts need separate treatment, since they are shared and the audit trail attributes actions to the account rather than a person.",
        "Check whether the periodic access review is performed by someone who understands the roles, or signed off as a formality.",
      ],
      askNext: [
        "How many active accounts belong to people who have left, and how long they have been open",
        "Whether anyone reviewed what movers retained rather than what they gained",
        "Who can grant themselves access, and whether that is logged and reviewed independently",
      ],
      sources: [s("itgc", "access provisioning and periodic review"), s("std", "Standard 2110.A2, information technology governance")],
      fups: ["sod", "paymentdual", "evidence"],
    },
  },

  goldstock: {
    ask: "What are the key risks in bullion and gold stock?",
    blurb: "Where physical verification and system records diverge in a jewellery division.",
    stage: "Fieldwork, other processes", keys: ["gold", "bullion", "stock", "inventory", "metal", "precious"],
    r: {
      lead: "Reconciliation between physical weight, system stock and metal account is the core test. The risks cluster at movements, conversions and wastage rather than at rest in the vault.",
      why: "Gold does not go missing from a locked vault very often. It goes missing where its form changes, when it moves between locations, is issued for manufacturing, is converted between purity levels, or is recorded as process loss. Each of those steps involves a weight and a purity assumption, and a small assumption error carries a large value because of what the material is worth.",
      consider: [
        "Test purity and weight together. A record correct in weight but wrong in purity misstates value materially.",
        "Wastage and process loss norms are the most common concealment route, because loss within norm is not investigated.",
        "Movements between stores, plants and karigars each need their own reconciliation, and the handoffs are where records diverge.",
        "Metal loan and customer exchange gold both enter the same physical stock but carry different ownership, so the accounting treatment differs from the physical count.",
      ],
      askNext: [
        "Whether physical verification is performed by someone independent of custody",
        "What the wastage norms are, who set them, and when they were last reviewed against actual",
        "How gold received from customer exchange is assayed and recorded before it enters stock",
      ],
      sources: [s("inv", "bullion custody, movement and reconciliation"), s("jw", "issue and return of metal"), s("std", "Standard 2320")],
      fups: ["karigar", "hallmark", "grnvariance"],
    },
  },

  karigar: {
    ask: "How do I audit karigar and job work payments?",
    blurb: "Metal issued out, finished goods returned, and the wastage in between.",
    stage: "Fieldwork, other processes", keys: ["karigar", "job work", "artisan", "wastage", "making charges", "jobwork"],
    r: {
      lead: "Reconcile metal issued against finished goods received plus scrap returned plus approved wastage, per karigar, over the period. Then test the wastage norm itself and the making charge calculation separately.",
      why: "Job work moves valuable material outside direct custody into a process the organisation cannot observe. The reconciliation is the primary control, and it only works if all four elements are recorded accurately. The weakness is usually the wastage norm, because anything lost within norm requires no explanation, which makes the norm itself the control that matters most.",
      consider: [
        "Compare actual wastage against norm by karigar over time. A karigar consistently at the norm ceiling is more interesting than one who occasionally exceeds it.",
        "Test whether returns are weighed and assayed independently, or accepted on the karigar's declaration.",
        "Making charges are usually per gram or per piece, so test the basis applied against the agreed rate card, since rate creep is common.",
        "Long outstanding issues where metal has gone out and nothing has come back need ageing and follow up, and they are often not tracked.",
      ],
      askNext: [
        "What the ageing profile of outstanding metal with karigars looks like",
        "Whether wastage norms differ by product complexity, and whether the applied norm matches the actual product",
        "Whether any karigar is related to an employee, which changes the nature of the risk",
      ],
      sources: [s("jw", "metal issue, return and wastage norms"), s("inv", "stock reconciliation"), s("std", "Standard 2320")],
      fups: ["goldstock", "hallmark", "rootcause"],
    },
  },

  hallmark: {
    ask: "What should I check on hallmarking compliance?",
    blurb: "BIS hallmarking and unique identification, where compliance meets inventory control.",
    stage: "Fieldwork, other processes", keys: ["hallmark", "bis", "huid", "purity", "certification", "hallmarking"],
    r: {
      lead: "Test that every item requiring hallmarking carries valid certification before sale, that the unique identification reconciles to the stock record, and that the purity marked matches the purity recorded.",
      why: "Hallmarking is a statutory obligation and a consumer protection measure, but for an auditor it is also an inventory control. The unique identification creates a per item record, which means stock can be reconciled at item level rather than by weight alone. A gap between hallmarked items and stock records is either a compliance breach or an inventory discrepancy, and both need explaining.",
      consider: [
        "Test at the point of sale as well as in stock, because an unhallmarked item sold is the breach that carries consequences.",
        "Items returned, exchanged or repaired re enter stock and may lose the link to their original certification.",
        "Check the reconciliation between items sent for hallmarking and items received back, since this is another custody handoff.",
        "Old stock predating the current requirement may have a different treatment, so establish the applicable rule before concluding.",
      ],
      askNext: [
        "Whether any item was sold without valid certification, and how that was detected or missed",
        "How the certification record links to the stock record, and whether the link survives a return",
        "Who is accountable for compliance at store level, and how head office monitors it",
      ],
      sources: [s("ret", "store compliance checks"), s("inv", "item level stock identification"), s("std", "Standard 2110, governance")],
      fups: ["goldstock", "retailstore", "karigar"],
    },
  },

  retailstore: {
    ask: "What do I focus on in a retail store audit?",
    blurb: "Own stores and franchise stores carry different risks and different rights.",
    stage: "Fieldwork, other processes", keys: ["store", "retail", "franchise", "boutique", "showroom", "cash"],
    r: {
      lead: "Cash and stock custody, discount and exchange authorisation, and the completeness of what gets reported back to head office. For franchise stores, establish your audit rights before scoping anything.",
      why: "Stores are where inventory, cash and customers meet, and where head office controls are furthest away. The distinctive risk is not theft of stock, which is usually well controlled physically, but authorisation of value giving transactions, discounts, exchanges, old gold valuation, since each one transfers value with a judgement attached to it.",
      consider: [
        "Old gold exchange is the highest judgement transaction in the store, because purity assessment sets the value given to the customer.",
        "Discount authority limits are frequently exceeded at store level and approved retrospectively.",
        "Franchise stores hold company stock but employ other people's staff, so your access depends on the franchise agreement rather than on internal authority.",
        "Reconcile store reported sales against system sales and against banking, since the three diverging is where problems surface.",
      ],
      askNext: [
        "What the franchise agreement actually permits you to inspect, and whether anyone has read it recently",
        "How old gold purity assessment is performed and whether it is independently checked",
        "Whether stock counts at store level are announced in advance",
      ],
      sources: [s("ret", "store and franchise audit scope"), s("inv", "store stock custody"), s("charter", "audit rights and access")],
      fups: ["hallmark", "goldstock", "independence"],
    },
  },

  payrollghost: {
    ask: "How do I test for ghost employees?",
    blurb: "Combining HR, payroll and attendance rather than testing payroll alone.",
    stage: "Fieldwork, other processes", keys: ["ghost employee", "payroll", "headcount", "attendance", "salary"],
    r: {
      lead: "The test only works across three sources. An employee in payroll with no HR master record, or no attendance, or a bank account shared with another employee, is the signal. Payroll alone will never show it.",
      why: "A ghost employee exists correctly in payroll by definition, because that is the point. Everything within the payroll system will reconcile. The exception only appears when payroll is joined to a source controlled by someone else, which is why this control cannot be tested within one system and is a good example of why the data layer matters.",
      consider: [
        "Shared bank accounts across employees is the strongest single indicator and the easiest to test.",
        "Employees with no leave ever taken, or no attendance record, deserve examination even where an explanation exists.",
        "Leavers still on payroll are the more common finding and are usually a process failure rather than fraud.",
        "Contract and temporary staff often sit outside the main HR master, so establish the population boundary before concluding.",
      ],
      askNext: [
        "Whether anyone reconciles payroll headcount to HR headcount independently, and how often",
        "Who can create both an HR record and a payroll record, since that combination enables this entirely",
        "Whether payroll exceptions from prior periods were resolved or simply carried forward",
      ],
      sources: [s("meth", "multi source testing"), s("itgc", "role conflict matrix"), s("std", "Standard 1210.A2, fraud awareness")],
      fups: ["sod", "itgcaccess", "evidence"],
    },
  },

  /* ---------------- FIELDWORK, TECHNIQUE ---------------- */
  controlType: {
    ask: "Is this a preventive or a detective control?",
    blurb: "Place a control among the four types, and judge whether it is the right control at all.",
    stage: "Fieldwork, technique", keys: ["preventive", "detective", "control type", "type of control", "corrective"],
    r: {
      lead: "Detective. It identifies orders after they have already been raised and approved.",
      why: "The useful part is not the label, it is knowing why it is not one of the others. Titan methodology recognises four types, and being able to place a control among them is what lets you judge whether it is the right control at all.",
      consider: [
        "Preventive stops the transaction at entry. A hard block in SAP refusing a second order to the same vendor inside the window would be preventive.",
        "Detective finds it afterwards, which is what 4.1-R2 does. The cost is the gap between the event and the discovery.",
        "Corrective fixes what the detective control found, for example a recovery process for an overpayment.",
        "Directive tells people what to do in the first place, for example the procurement policy that sets the limits.",
      ],
      askNext: [
        "How long the detection lag actually is, since a detective control running daily is a different proposition from one running quarterly",
        "What it would take to move this check into the SAP workflow, and who owns that decision",
        "Whether a corrective process exists once a split order is confirmed, or whether the finding just gets reported",
      ],
      sources: [s("meth", "control classification"), s("std", "Standard 2210, engagement objectives")],
      fups: ["evidence", "rootcause", "writeup"],
    },
  },

  evidence: {
    ask: "What evidence do I need for a continuous control test?",
    blurb: "What goes in the file when the test was run by a system rather than by you.",
    stage: "Fieldwork, technique", keys: ["evidence", "workpaper", "documentation", "support", "audit file"],
    r: {
      lead: "Three things. That the rule was the approved version, that it ran on the days it should have, and what happened to every exception it raised.",
      why: "When a person performs a test, the workpaper evidences their work. When a system performs it, the workpaper has to evidence the system's work instead, and that is a different set of assertions. A reviewer cannot re perform your test by looking over your shoulder, so the file has to stand in for that.",
      consider: [
        "Rule version matters. If the logic changed mid period, your conclusion covers two different tests and the file should say so.",
        "A run that did not happen is itself a finding. Evidence of completeness is as important as evidence of the results.",
        "Exception disposition needs to be traceable to a named person and a date, not just marked closed.",
        "Keep the population count for each run. It is what lets you demonstrate coverage later, and it cannot be reconstructed after the fact.",
      ],
      askNext: [
        "Whether your file would let a reviewer reach your conclusion without speaking to you",
        "Whether you can evidence that the rule logic was approved by internal audit rather than changed by someone else",
        "Whether external audit would accept this evidence for their own reliance, and whether anyone has asked them",
      ],
      sources: [s("wp", "documentation sufficiency"), s("gtag", "evidence from automated testing"), s("std", "Standard 2330, documenting information")],
      fups: ["coverage", "writeup", "feedback"],
    },
  },

  rootcause: {
    ask: "How do I get to the root cause of an exception?",
    blurb: "The element most weak findings are missing, and how to find it.",
    stage: "Fieldwork, technique", keys: ["root cause", "why did", "cause", "underlying"],
    r: {
      lead: "Keep asking why until the answer is something the organisation designed rather than something a person did. If your cause is a named individual made a mistake, you have not finished.",
      why: "A cause attributed to a person produces a recommendation about training or reminders, which fixes nothing durable. Titan methodology treats cause as belonging to one of three categories, process design, system configuration, or awareness and capability. Which category it falls into determines who owns the action, so getting it wrong sends the recommendation to the wrong function.",
      consider: [
        "If the same exception occurs across several people, it is almost never a people problem.",
        "Ask whether the correct behaviour was actually possible. A control people cannot comply with while doing their job is a design problem.",
        "System configuration causes are the most actionable and the most often missed, because auditors treat the system as fixed.",
        "Where the cause is a deliberate workaround, understand what pressure created it before recommending its removal.",
      ],
      askNext: [
        "Whether your cause would survive the question why did that happen asked twice more",
        "Whether the same cause explains exceptions in other controls, which would consolidate several findings into one",
        "What would have to be true for this to never happen again, and whether that is realistic",
      ],
      sources: [s("meth", "root cause analysis"), s("std", "Standard 2320, analysis and evaluation")],
      fups: ["writeup", "rating", "falsepositive"],
    },
  },

  falsepositive: {
    ask: "Most of these exceptions look like false positives. What now?",
    blurb: "When the rule is the problem rather than the process.",
    stage: "Fieldwork, technique", keys: ["false positive", "noise", "too many exceptions", "not real"],
    r: {
      lead: "Establish whether they are genuinely false positives or simply explained exceptions, because the two lead to different actions. Then treat the rule configuration as a finding in its own right if it is generating noise.",
      why: "A false positive is the rule firing where no control weakness exists, usually because the logic does not account for a legitimate business pattern. An explained exception is the control correctly identifying something that turned out to be acceptable. The first means the rule needs changing, the second means the control works and the population needs better triage. Treating them as the same thing either weakens a valid control or buries a real one in noise.",
      consider: [
        "A rule generating overwhelming noise will be ignored, which makes it worse than no rule, and that is worth reporting.",
        "Tuning the rule is a change to a control and needs the same approval and version trail as any other control change.",
        "Resist tuning until you understand the pattern, because suppressing a category is how genuine exceptions get filtered out permanently.",
        "Document the tuning rationale. A future auditor needs to know why the threshold is where it is.",
      ],
      askNext: [
        "What proportion are genuinely false positives once you have tested a sample of the explanations",
        "Who has authority to change rule logic, and whether internal audit retains that authority",
        "Whether the noise is concentrated in one business unit, which would point to a local practice rather than a rule flaw",
      ],
      sources: [s("gtag", "rule tuning and control change"), s("meth", "control change governance"), s("std", "Standard 2320")],
      fups: ["coverage", "rootcause", "rating"],
    },
  },

  /* ---------------- REPORTING ---------------- */
  writeup: {
    ask: "How do I write this up as a finding?",
    blurb: "The five element structure, and the element most weak findings are missing.",
    stage: "Reporting", keys: ["write", "finding", "report", "draft the", "observation"],
    r: {
      lead: "Titan uses the five element structure, criteria, condition, cause, effect and recommendation. Most weak findings at review are weak because cause is missing, not because the testing was wrong.",
      why: "Condition is what you found and it is the easy part. Cause is why it happened, and without it the recommendation has nothing to attach to. A finding that jumps from condition straight to recommendation usually produces a management response that fixes the symptom.",
      consider: [
        "Criteria comes from policy or the delegation matrix, and it should be quotable. If you cannot cite it, you may not have a finding.",
        "Effect should be quantified where the data allows it. The engine gives you exposure value, so use it rather than describing the effect qualitatively.",
        "Cause is usually process design, system configuration, or awareness. Which one it is determines who owns the action.",
        "Agree the condition with the process owner before drafting. Disputes at closing are almost always about facts rather than about the recommendation.",
      ],
      askNext: [
        "Whether your cause would survive the question why did that happen asked twice more",
        "Whether the recommendation is something the named owner can actually implement",
        "Whether a prior year finding covers the same cause, since a repeat finding is written and escalated differently",
      ],
      sources: [s("meth", "finding construction and rating"), s("jwl25", "worked example of a rated finding"), s("std", "Standard 2410, criteria for communicating")],
      fups: ["rating", "mgmtresponse", "rootcause"],
    },
  },

  rating: {
    ask: "How do I rate a finding?",
    blurb: "Why exposure value alone produces the wrong rating.",
    stage: "Reporting", keys: ["rating", "rate the finding", "severity", "high medium low", "how serious"],
    r: {
      lead: "Rate on the risk the weakness creates, not on the value of what you found. A control that could have permitted a large loss but happened not to this period is still a high rating.",
      why: "Auditors anchor on the exposure figure because it is concrete and defensible. But the exposure is the outcome of one period, and the rating is a statement about the control. A bank change control with no verification is severe whether or not anyone exploited it, because the absence of loss was luck rather than control.",
      consider: [
        "Consider likelihood and impact of the weakness, then adjust for whether compensating controls genuinely mitigate it.",
        "Pervasiveness matters. The same weakness across every division rates higher than one confined to a single location.",
        "A repeat finding usually rates higher than its first occurrence, because management was already aware.",
        "Be consistent across the report. An inconsistent rating scale is the fastest way to lose credibility with the audit committee.",
      ],
      askNext: [
        "Whether you would rate it the same way if the exposure this period had been zero",
        "Whether the compensating control you are relying on has itself been tested",
        "How similar findings were rated in prior reports, since consistency matters more than precision",
      ],
      sources: [s("meth", "finding rating criteria"), s("r2r25", "rating precedent"), s("std", "Standard 2410")],
      fups: ["writeup", "mgmtresponse", "repeatfinding"],
    },
  },

  mgmtresponse: {
    ask: "Management disagrees with my finding. What do I do?",
    blurb: "Separating a dispute about facts from a dispute about judgement.",
    stage: "Reporting", keys: ["disagree", "management response", "pushback", "dispute", "reject the finding"],
    r: {
      lead: "Establish first whether the disagreement is about the facts, the rating, or the recommendation. Each one is handled differently, and conflating them is how closing meetings go badly.",
      why: "A dispute about facts means your evidence is incomplete or wrong, and that is yours to resolve before the report is issued. A dispute about rating or recommendation is a legitimate difference of professional view, and the methodology provides for recording it rather than resolving it. Treating a judgement dispute as a factual one leads to negotiating the finding away.",
      consider: [
        "Facts should never be in dispute at the closing meeting. If they are, the condition was not agreed early enough.",
        "Management may accept the finding and accept the risk rather than act. That is a legitimate response and it gets recorded as risk acceptance at the appropriate level.",
        "Where disagreement persists, the methodology allows the finding to be issued with management's position stated alongside. You do not need their agreement to report.",
        "Check whether their objection reveals something you did not know about the process. Sometimes they are right.",
      ],
      askNext: [
        "Whether the disagreement is really about the finding or about who will own the action",
        "Whether the person disagreeing has the authority to accept the risk, because that determines escalation",
        "Whether your evidence would convince a reviewer who had not met either of you",
      ],
      sources: [s("meth", "closing meetings and disputed findings"), s("charter", "reporting and escalation"), s("std", "Standard 2600, communicating acceptance of risks")],
      fups: ["rating", "repeatfinding", "firstclosing"],
    },
  },

  repeatfinding: {
    ask: "A prior year finding was never closed. How do I handle it?",
    blurb: "Repeat findings are an escalation question, not just a reporting one.",
    stage: "Reporting", keys: ["repeat", "prior year", "not closed", "follow up", "overdue action", "recurring"],
    r: {
      lead: "Report it as a repeat, establish why the agreed action did not happen, and escalate according to the charter rather than simply raising it again.",
      why: "A finding raised twice tells the audit committee something different from a finding raised once. It says the process for acting on internal audit findings is not working, which is a governance issue above the original control issue. Re reporting it at the same rating without escalation quietly signals that findings can be ignored without consequence.",
      consider: [
        "Establish whether the action was attempted and failed, or never started. These lead to very different recommendations.",
        "An action that was implemented but did not fix the problem means the original root cause was wrong, which is your issue rather than management's.",
        "Check whether the original owner is still in the role, since ownership often evaporates at a reorganisation.",
        "The charter usually specifies escalation for overdue actions. Follow it rather than deciding case by case.",
      ],
      askNext: [
        "Whether the original agreed action would actually have addressed the cause",
        "Whether the due date was realistic when it was agreed",
        "How many other actions from the same period are outstanding, since a pattern is the real finding",
      ],
      sources: [s("charter", "follow up and escalation"), s("meth", "monitoring progress"), s("std", "Standard 2500, monitoring progress")],
      fups: ["mgmtresponse", "rating", "rootcause"],
    },
  },

  /* ---------------- DEVELOPMENT ---------------- */
  ready: {
    ask: "Am I ready to lead an audit?",
    blurb: "Measure yourself against the competency framework rather than against a feeling.",
    stage: "Development and coaching", keys: ["ready", "lead an audit", "career", "progression", "promoted", "next level"],
    byRole: {
      rotational: {
        lead: "That is not a question I can answer for you, but the competency framework tells you what readiness looks like, and you can measure yourself against it honestly.",
        why: "Titan maps the IIA professional skills into four levels for each competency, described in the language of this department. Lead readiness is not a single threshold. It is intermediate or above across planning, evidence and communication, judged over completed engagements rather than time served.",
        consider: [
          "Planning. Can you scope an engagement from the risk rather than from last year's programme, and defend what you chose to leave out.",
          "Evidence. Do your workpapers stand on their own, meaning a reviewer reaches your conclusion without asking what you meant.",
          "Communication. Have you held a difficult closing conversation with a process owner who disagreed with you.",
          "Judgement. Have you concluded that something was not a finding, and been comfortable defending that. This is the one most people underweight.",
        ],
        askNext: [
          "Which of the four you have the least evidence for, and what engagement would give you that evidence",
          "Whether you have ever led a closing meeting, even for a small process area",
          "What your last two review notes had in common, since a repeated note is a competency signal rather than a one off",
        ],
        sources: [s("comp", "levels and descriptors"), s("std", "Standard 1210, proficiency")],
        fups: ["feedback", "firstclosing", "jargon"],
      },
      lead: {
        lead: "You are already leading. If you are asking about someone on your team, the competency framework gives you four areas to assess them against rather than a general impression.",
        why: "Readiness at Titan is assessed as intermediate or above across planning, evidence and communication, evidenced over completed engagements. Framing the conversation around the descriptors rather than your overall sense of the person makes the feedback specific and gives them something to work on.",
        consider: [
          "Ask them to self assess against the four areas first. The gap between their view and yours is usually the most useful part of the conversation.",
          "Over confidence and under confidence both show up here, and the framework handles both better than a general conversation does.",
          "An auditor who has never concluded that something was not a finding has not yet shown the judgement the lead role needs.",
        ],
        askNext: [
          "Which engagement in the next two quarters would give them the evidence they are missing",
          "Whether you can hand over a small process area as a trial lead rather than waiting for full readiness",
          "What support you will give them during it, since a first lead without a safety net teaches the wrong lesson",
        ],
        sources: [s("comp", "levels and descriptors"), s("std", "Standard 1210, proficiency")],
        fups: ["feedback", "firstclosing", "writeup"],
      },
    },
  },

  feedback: {
    ask: "How do I give a peer feedback on their workpaper?",
    blurb: "Hold a difficult review conversation when you are not their line manager.",
    stage: "Development and coaching", keys: ["feedback", "peer", "coaching", "review note", "difficult conversation"],
    r: {
      lead: "Anchor the conversation on the workpaper standard rather than on them. The standard is the thing that disagrees with the work, and you are the person pointing at it.",
      why: "Peer feedback is difficult at Titan specifically because leads are not line managers. You have no authority to fall back on, so the authority has to come from the methodology. That reframing also makes the note easier to receive, because it stops being one auditor's opinion of another's work.",
      consider: [
        "Name the gap against the standard, not the quality of the effort. The workpaper does not evidence the conclusion is a fact. This is a bit thin is a judgement.",
        "Be specific about what would close it. Vague notes get vague responses and a second round of review.",
        "Ask before asserting. Check whether they have evidence that did not make it into the file before you conclude it is missing.",
        "Deliver it in the same channel you would use for good news. Saving a call for bad news trains people to dread the call.",
      ],
      askNext: [
        "Whether the gap is a one off or the same note you gave last time, because the second one is a development conversation",
        "Whether the workpaper standard is actually clear on this point, since a repeated gap across several people is a methodology problem",
        "Whether you would reach their conclusion from their file alone, which is the test the standard actually sets",
      ],
      sources: [s("wp", "review notes"), s("meth", "supervision and review"), s("std", "Standard 2330, documenting information")],
      fups: ["ready", "evidence", "firstclosing"],
    },
  },

  firstclosing: {
    ask: "How do I run my first closing meeting?",
    blurb: "What to settle before the meeting so the meeting itself is straightforward.",
    stage: "Development and coaching", keys: ["closing meeting", "exit meeting", "present findings", "first closing"],
    r: {
      lead: "Almost all of the work happens before the meeting. Agree the facts individually with each process owner first, so the meeting is about ratings and actions rather than about what happened.",
      why: "A closing meeting that surprises anyone will go badly, and the surprise is almost always about a factual condition rather than about your judgement. Walking each finding through with its owner in advance removes the defensiveness, because nobody has to react in front of their colleagues and their director.",
      consider: [
        "Send the draft findings in advance. Reading them aloud for the first time in the room wastes the meeting.",
        "Lead with what worked. It is true, it is usually omitted, and it makes the rest easier to hear.",
        "Be clear about what is open for discussion, ratings and actions, and what is not, the facts you have evidenced.",
        "Have your evidence to hand but do not open with it. Producing evidence unprompted reads as defensiveness.",
      ],
      askNext: [
        "Whether every finding has been individually walked through with its owner already",
        "Who in the room can actually commit to an action, since a meeting without them produces nothing",
        "What you will do if management asks for a finding to be downgraded in the room",
      ],
      sources: [s("meth", "closing meetings"), s("comp", "communication competency"), s("std", "Standard 2440, disseminating results")],
      fups: ["mgmtresponse", "ready", "writeup"],
    },
  },

  jargon: {
    ask: "What does SoD mean, and what other terms should I know?",
    blurb: "The acronyms everyone assumes you already understand.",
    stage: "Development and coaching", keys: ["what does", "acronym", "jargon", "mean", "terminology", "abbreviation"],
    r: {
      lead: "SoD is segregation of duties, the principle that no single person should control a whole transaction from initiation to payment. Here are the others that come up constantly in Titan P2P work.",
      why: "Nobody in a meeting will explain these, and asking after the third mention feels harder than asking after the first. Career auditors stop hearing them as jargon, so the gap rarely gets noticed by the people who could close it.",
      consider: [
        "DOA is delegation of authority, the matrix setting who can approve what value in which cost centre.",
        "GRN is goods receipt note, the record that something ordered actually arrived. Three way match compares order, receipt and invoice.",
        "ITGC is IT general controls, covering access, change management and operations rather than a specific business process.",
        "P2P, O2C and R2R are procure to pay, order to cash and record to report, the three main transaction cycles.",
        "QAIP is the quality assurance and improvement programme, the periodic assessment of whether internal audit itself conforms to the standards.",
      ],
      askNext: [
        "Whether the term means the same thing in Titan as it does generally, since local usage drifts",
        "Which terms appear in the audit programme you are working from that you have not yet looked up",
      ],
      sources: [s("meth", "glossary"), s("p2p", "process terminology"), s("std", "glossary")],
      fups: ["sod", "controlType", "ready"],
    },
  },

  /* ---------------- STANDARDS ---------------- */
  independence: {
    ask: "I used to work in this process. Can I audit it?",
    blurb: "Impairment to objectivity, and what the standards actually require.",
    stage: "Standards and independence", keys: ["independence", "objectivity", "conflict of interest", "used to work", "impairment"],
    r: {
      lead: "Not for at least a year after leaving the area, and even then you should disclose it. The standards treat recent responsibility for an activity as an impairment to objectivity, not merely a perception issue.",
      why: "The concern is not that you would deliberately go easy. It is that you cannot objectively evaluate a process you designed or operated, because you would be assessing your own judgement. In a rotational department this comes up constantly, which is why the disclosure requirement matters more here than it would elsewhere.",
      consider: [
        "Disclose to the engagement lead and the head of internal audit rather than deciding yourself whether it matters.",
        "The impairment may be manageable by assigning you a different part of the scope rather than removing you entirely.",
        "Perceived impairment counts too. A relative in the audited function is disclosable even if it changes nothing about your work.",
        "Where the whole department has the same background, the response is usually independent review rather than reassignment.",
      ],
      askNext: [
        "How recently you held the role, and whether you designed any of the controls you would be testing",
        "Whether anyone else could cover that part of the scope",
        "Whether the disclosure was recorded, because an undocumented disclosure offers no protection later",
      ],
      sources: [s("std", "Standard 1130, impairment to independence or objectivity"), s("charter", "independence and objectivity"), s("meth", "engagement assignment")],
      fups: ["retailstore", "ready", "conformance"],
    },
  },

  conformance: {
    ask: "What does conformance with the standards actually require?",
    blurb: "What the department has to do to say it conforms, and who checks.",
    stage: "Standards and independence", keys: ["conformance", "qaip", "quality assurance", "external assessment", "comply with standards"],
    r: {
      lead: "A quality assurance and improvement programme covering ongoing monitoring, periodic self assessment, and an external assessment at least every five years by a qualified independent assessor.",
      why: "Conformance is not a statement the department can simply make about itself. The standards require evidence, and the external assessment is what converts an internal belief into a defensible position. A department that has never had an external assessment cannot claim conformance regardless of how well it works.",
      consider: [
        "Ongoing monitoring is the supervision and review that already happens on every engagement, so it is mostly a documentation question.",
        "Periodic self assessment is a structured review against the standards, not a general reflection.",
        "Results go to the board and senior management, which makes this a governance matter rather than an internal one.",
        "Where nonconformance exists, it must be disclosed along with its effect, rather than quietly remediated.",
      ],
      askNext: [
        "When the last external assessment was performed, and what it concluded",
        "Whether the actions from that assessment were completed",
        "Whether the engagement files would support a conformance claim if examined externally",
      ],
      sources: [s("std", "Standards 1300 to 1320, quality assurance and improvement"), s("charter", "quality assurance"), s("meth", "supervision and review")],
      fups: ["independence", "evidence", "feedback"],
    },
  },

  /* ---------------- REFUSALS ---------------- */
  opinion: {
    ask: "Does this exception mean the control has failed?",
    blurb: "Where the mentor stops and your judgement begins.",
    stage: "Fieldwork, technique", keys: ["failed", "has it failed", "is this a finding", "control failed", "should i conclude"],
    refuse: true,
    r: {
      lead: "I cannot conclude that, and I am not built to. Whether a control failed is an audit opinion, and it carries your name on the signoff rather than mine.",
      why: "Titan methodology is explicit that the conclusion on control effectiveness rests with the assigned auditor and the engagement lead. A tool forming that view, even helpfully, would sit between you and a judgement you are accountable for. What I can do is make sure you have everything you need before you form it.",
      consider: [
        "An exception is the rule firing. A finding is what you conclude after testing the explanation. The gap between them is your work.",
        "Before concluding, establish whether the combined value genuinely crossed a threshold, whether a valid explanation exists, and whether the pattern repeats.",
        "If the explanation holds, the correct outcome may be that the control operated as designed and the rule needs a tolerance adjustment, which is itself worth recording.",
      ],
      askNext: [
        "What evidence would have to exist for you to conclude the control operated effectively",
        "Who in procurement owns the explanation, and whether you have asked them yet",
        "Whether your workpaper records the test clearly enough for a reviewer to reach the same conclusion independently",
      ],
      sources: [s("meth", "forming conclusions"), s("std", "Standard 2410, criteria for communicating")],
      fups: ["falsepositive", "writeup", "evidence"],
    },
  },

  draftit: {
    ask: "Can you draft the finding for me?",
    blurb: "The line between explaining the work and producing it.",
    stage: null, keys: ["draft it for me", "write it for me", "can you draft", "write the finding for me", "do it for me"],
    refuse: true,
    r: {
      lead: "No. I will explain how a finding is constructed and critique yours once you have written it, but I will not write it for you.",
      why: "This application is deliberately scoped to learning rather than to producing work. The reasoning is straightforward. A finding you drafted is one you can defend in a closing meeting, and one you understand well enough to adjust when management raises something you had not considered. A finding I drafted is one you would be reading aloud.",
      consider: [
        "Prompts intended to help perform work are kept in a separate library, with their own review and their own guard rails.",
        "Once you have a draft, ask me to check it against the five element structure and I will tell you what is missing.",
        "The most common gap in a first draft is cause, so start there rather than with the wording.",
      ],
      askNext: [
        "What your criteria is, and whether you can quote it from policy",
        "What you would say the cause is, in one sentence, before writing anything",
      ],
      sources: [s("meth", "finding construction and rating"), s("charter", "role of internal audit")],
      fups: ["writeup", "rootcause", "rating"],
    },
  },

  offcorpus: {
    ask: "What is our policy on paying vendors in cryptocurrency?",
    stage: null, keys: ["crypto", "cryptocurrency", "bitcoin", "digital asset"],
    refuse: true,
    r: {
      lead: "Titan internal audit methodology does not cover this, and I will not construct an answer from general knowledge.",
      why: "I answer only from the sources loaded for this department. Nothing in the methodology, the P2P audit programme or the treasury control documentation addresses digital asset settlement. Giving you a plausible answer from outside those sources is how a tool like this quietly becomes unreliable.",
      consider: [
        "Treasury policy sits outside the internal audit corpus and is held by the corporate treasury function.",
        "If this came up in an engagement, raise it with your lead as a possible scope gap rather than resolving it informally.",
        "If it is becoming a recurring question, the methodology may genuinely need to address it, which is feedback worth logging.",
      ],
      askNext: [
        "Whether this arose from something you saw in testing, or as a general question",
        "Who owns treasury policy for your entity",
      ],
      sources: [],
      fups: ["splitting", "ready", "scoping"],
    },
  },
};

/* normalise single response topics into the byRole shape */
Object.keys(Q).forEach((k) => { if (Q[k].r && !Q[k].byRole) Q[k].byRole = { both: Q[k].r }; });

const GROUPS = [
  { k: "Fieldwork", qs: ["splitting", "bankchange", "opinion"] },
  { k: "Titan specific", qs: ["goldstock", "karigar"] },
  { k: "Reporting and development", qs: ["writeup", "ready"] },
];

const LIB_STAGES = [
  "Planning", "Fieldwork, P2P controls", "Fieldwork, other processes",
  "Fieldwork, technique", "Reporting", "Development and coaching", "Standards and independence",
];

/* ---------------- corpus for Sources tab ---------------- */
const CORPUS = [
  {
    tier: 1, label: "Tier 1, external standards",
    note: "Outranks everything below. Where Titan methodology and a standard disagree, the standard wins and the answer says so.",
    docs: [
      { n: "IIA Global Internal Audit Standards", v: "2024 edition", eff: "09 Jan 2025", own: "The IIA", chunks: 412, st: "idx" },
      { n: "IIA GTAG Continuous Auditing and Monitoring", v: "3rd edition", eff: "Sep 2025", own: "The IIA", chunks: 96, st: "idx" },
      { n: "IIA Three Lines Model", v: "2020", eff: "Jul 2020", own: "The IIA", chunks: 24, st: "idx" },
    ],
  },
  {
    tier: 2, label: "Tier 2, Titan internal audit authority",
    note: "Owned and version controlled by Internal Audit. A change here is an approved change, recorded with who made it and when.",
    docs: [
      { n: "Titan Internal Audit Charter", v: "3.0", eff: "01 Apr 2025", own: "Audit Committee", chunks: 18, st: "idx" },
      { n: "Titan Internal Audit Methodology", v: "4.2", eff: "01 Apr 2026", own: "Head of Internal Audit", chunks: 287, st: "idx" },
      { n: "Titan IA Workpaper Standard", v: "2.1", eff: "01 Apr 2026", own: "Head of Internal Audit", chunks: 64, st: "idx" },
      { n: "Titan Audit Competency Framework", v: "1.3", eff: "01 Apr 2026", own: "Head of Internal Audit", chunks: 58, st: "idx" },
      { n: "Titan P2P Audit Programme FY26", v: "1.4", eff: "12 May 2026", own: "IA Process Lead, P2P", chunks: 173, st: "idx" },
      { n: "Titan Inventory and Bullion Control Manual", v: "2.0", eff: "01 Jan 2026", own: "Jewellery Division Finance", chunks: 121, st: "idx" },
      { n: "Titan Job Work and Karigar Control Procedure", v: "3.1", eff: "01 Jan 2026", own: "Jewellery Manufacturing", chunks: 88, st: "idx" },
      { n: "Titan Retail and Franchise Audit Programme FY26", v: "1.1", eff: "20 Apr 2026", own: "IA Process Lead, Retail", chunks: 96, st: "idx" },
      { n: "Titan ITGC Audit Programme FY26", v: "1.2", eff: "20 Apr 2026", own: "IA Process Lead, IT", chunks: 104, st: "idx" },
      { n: "Titan Delegation of Authority Matrix, Jewellery", v: "9", eff: "01 Jan 2026", own: "Corporate Finance", chunks: 41, st: "idx" },
      { n: "Titan O2C Audit Programme FY26", v: "1.0", eff: "pending", own: "IA Process Lead, O2C", chunks: 0, st: "pend" },
    ],
  },
  {
    tier: 3, label: "Tier 3, prior engagement precedent",
    note: "Issued reports only. Used to show how something was handled before, never as authority for how it should be handled.",
    docs: [
      { n: "Jewellery Division P2P Audit FY25", v: "issued", eff: "18 Jul 2025", own: "Internal Audit", chunks: 52, st: "idx" },
      { n: "Watches Division P2P Audit FY25", v: "issued", eff: "22 Sep 2025", own: "Internal Audit", chunks: 47, st: "idx" },
      { n: "Corporate R2R Audit FY25", v: "issued", eff: "04 Nov 2025", own: "Internal Audit", chunks: 39, st: "idx" },
    ],
  },
];

const EXCLUDED = [
  { n: "Corporate treasury policy", why: "Owned by Corporate Treasury, outside the internal audit corpus" },
  { n: "Draft reports not yet issued", why: "Excluded until issued, to avoid citing a conclusion that may still change" },
  { n: "HR personnel and performance records", why: "Out of scope for this application entirely" },
  { n: "The open web", why: "No external retrieval. The mentor cannot reach anything not listed above" },
];

/* ------------------------------------------------------------------ */

function score(text, k) {
  const t = text.toLowerCase();
  let sc = 0;
  for (const kw of Q[k].keys) if (t.includes(kw)) sc += kw.length + 4;
  const q = Q[k].ask.toLowerCase();
  for (const w of t.split(/\s+/)) if (w.length > 3 && q.includes(w)) sc += 2;
  return sc;
}
function match(text) {
  if (!text.trim()) return null;
  let best = null, top = 0;
  for (const k of Object.keys(Q)) { const sc = score(text, k); if (sc > top) { top = sc; best = k; } }
  return top >= 6 ? best : null;
}
function suggest(text) {
  const t = text.trim();
  if (t.length < 2) return [];
  return Object.keys(Q)
    .map((k) => ({ k, sc: score(t, k) }))
    .filter((x) => x.sc > 0)
    .sort((a, b) => b.sc - a.sc)
    .slice(0, 5)
    .map((x) => x.k);
}
function hilite(q, t) {
  const words = t.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
  if (!words.length) return q;
  const re = new RegExp("(" + words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") + ")", "ig");
  return q.split(re).map((p, i) =>
    words.includes(p.toLowerCase()) ? <mark key={i}>{p}</mark> : <React.Fragment key={i}>{p}</React.Fragment>);
}

const NO_MATCH = {
  lead: "That is outside the corpus loaded for this demonstration build.",
  why: "This prototype carries a slice of the Titan corpus covering planning, P2P controls, jewellery specific processes, reporting, development and the standards. A production build would carry the full methodology and every audit programme. The behaviour is the same either way. When no loaded source supports an answer, the mentor says so rather than composing one.",
  consider: [
    "A production deployment answers from the complete corpus, so refusals would be rarer and would signal a genuine methodology gap.",
    "Every refusal is logged. Repeated refusals on the same theme tell the audit team what the methodology does not yet cover.",
  ],
  askNext: ["Start typing and suggestions will appear, or open the Prompt library tab for everything loaded"],
  sources: [],
  fups: ["splitting", "goldstock", "scoping"],
};

const S = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
    strokeLinecap="round" strokeLinejoin="round">{p}</svg>
);

function Card({ r, refuse }) {
  return (
    <div className={"card" + (refuse ? " refuse" : "")}>
      <div className="sec"><div className="sk head">{refuse ? "Cannot answer this" : "Answer"}</div>
        <p className="lead">{r.lead}</p></div>
      <div className="sec"><div className="sk">Why that is the answer</div><p>{r.why}</p></div>
      <div className="sec"><div className="sk">What else to consider</div>
        <ul>{r.consider.map((c, i) => <li key={i}>{c}</li>)}</ul></div>
      <div className="sec"><div className="sk">Questions you did not ask</div>
        <ul className="ask">{r.askNext.map((c, i) => <li key={i}>{c}</li>)}</ul></div>
      <div className="sec"><div className="sk">Sources</div>
        {r.sources.length === 0
          ? <p style={{ color: "var(--tx2)", fontSize: 12.5 }}>
              No source in the loaded corpus supports an answer to this question.</p>
          : r.sources.map((x, i) => (
              <div className="src" key={i}>
                <span className={"tier" + (x.t === 1 ? " t1" : "")}>Tier {x.t}</span>
                <span>{x.n} <i>{x.i}</i></span>
              </div>))}
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("chat");
  const [role, setRole] = useState("rotational");
  const [msgs, setMsgs] = useState([]);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const [sugIdx, setSugIdx] = useState(0);
  const [showSug, setShowSug] = useState(true);
  const endRef = useRef(null);
  const user = ROLES[role];

  const sugs = useMemo(() => (showSug ? suggest(draft) : []), [draft, showSug]);

  useEffect(() => { setSugIdx(0); }, [draft]);
  useEffect(() => {
    if (tab === "chat") endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs, typing, tab]);

  const push = (text, key, ctx) => {
    setMsgs((m) => [...m, { side: "u", text, at: clock(), ctx }]);
    setTyping(true);
    const reduced = typeof window !== "undefined"
      && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { side: "b", key, at: clock() }]);
    }, reduced ? 120 : 850);
  };

  const sendKey = (key) => { setTab("chat"); setDraft(""); push(Q[key].ask, key, Q[key].context); };
  const sendTyped = () => {
    const t = draft.trim(); if (!t) return;
    setDraft(""); push(t, match(t));
  };
  const onKey = (e) => {
    if (sugs.length) {
      if (e.key === "ArrowDown") { e.preventDefault(); setSugIdx((i) => (i + 1) % sugs.length); return; }
      if (e.key === "ArrowUp") { e.preventDefault(); setSugIdx((i) => (i - 1 + sugs.length) % sugs.length); return; }
      if (e.key === "Tab") { e.preventDefault(); setDraft(Q[sugs[sugIdx]].ask); return; }
      if (e.key === "Escape") { setShowSug(false); return; }
      if (e.key === "Enter") { e.preventDefault(); sendKey(sugs[sugIdx]); setShowSug(true); return; }
    }
    if (e.key === "Enter") sendTyped();
  };
  const resolve = (key) => key ? (Q[key].byRole[role] || Q[key].byRole.both) : NO_MATCH;

  return (
    <div className="tm">
      <style>{CSS}</style>

      <nav className="rail" aria-label="Teams navigation">
        <button className="ri">{S(<path d="M4 13h4l2 5 4-12 2 7h4" />)}<span>Activity</span></button>
        <button className="ri">{S(<path d="M20 12a7 7 0 0 1-9.9 6.4L4 20l1.6-6A7 7 0 1 1 20 12z" />)}<span>Chat</span></button>
        <button className="ri">{S(<><circle cx="9" cy="9" r="3" /><path d="M3 20a6 6 0 0 1 12 0" /><circle cx="17" cy="10" r="2.2" /><path d="M16 15.5A5 5 0 0 1 21 20" /></>)}<span>Teams</span></button>
        <button className="ri">{S(<><rect x="3.5" y="5" width="17" height="15" rx="1.5" /><path d="M3.5 10h17M8 3.5v3M16 3.5v3" /></>)}<span>Calendar</span></button>
        <button className="ri on">{S(<><path d="M12 4 4 8l8 4 8-4-8-4z" /><path d="M6.5 10.5V15c0 1.7 2.5 3 5.5 3s5.5-1.3 5.5-3v-4.5" /></>)}<span>Mentor</span></button>
        <div className="rsp" />
        <div className="rav" title={user.who}>{user.initials}</div>
      </nav>

      <div className="app">
        <header className="hdr">
          <div className="hdr-t">
            <div className="appic">N</div>
            <div>
              <div className="appnm">Audit Mentor</div>
              <div className="appsub">Netscribes &middot; Titan Internal Audit</div>
            </div>
            <div className="viewas">
              <div>
                <div className="viewas-l">Signed in via Entra</div>
                <div className="viewas-v">{user.who}, <b>{user.title}</b></div>
              </div>
              <button className="viewas-b"
                onClick={() => { setRole(role === "rotational" ? "lead" : "rotational"); setMsgs([]); }}>
                Switch role
              </button>
            </div>
          </div>
          <div className="tabs">
            {[["chat", "Chat"], ["library", "Prompt library"], ["sources", "Sources"], ["about", "About"]]
              .map(([k, l]) => (
                <button key={k} className={"tab" + (tab === k ? " on" : "")} onClick={() => setTab(k)}>{l}</button>
              ))}
          </div>
        </header>

        {tab === "chat" && (
          <>
            <div className="thr">
              <div className="thr-in">
                {msgs.length === 0 && (
                  <div className="wel">
                    <h1>Good morning, {user.who.split(" ")[0]}</h1>
                    <p>
                      Ask the way you would ask a colleague. I answer from Titan methodology,
                      the audit programmes and the IIA standards, and I show where each answer
                      came from. I explain and I teach. I do not form audit opinions.
                    </p>
                    {GROUPS.map((g) => (
                      <div className="grp" key={g.k}>
                        <div className="gk">{g.k}</div>
                        <div className="chips">
                          {g.qs.map((k) => (
                            <button className="chip" key={k} onClick={() => sendKey(k)}>{Q[k].ask}</button>
                          ))}
                        </div>
                      </div>
                    ))}
                    <p className="hint">
                      Or start typing below. Suggestions appear as you type, and there are{" "}
                      {Object.keys(Q).length} topics loaded across planning, fieldwork, reporting,
                      development and the standards.
                    </p>
                  </div>
                )}

                {msgs.map((m, i) =>
                  m.side === "u" ? (
                    <div className="row me" key={i}>
                      <div className="col">
                        {m.ctx && (
                          <div className="quote">
                            Opened from Exceptions dashboard &middot; <b>Rule {m.ctx.rule}</b> &middot; {m.ctx.count}
                          </div>
                        )}
                        <div className="bub">{m.text}</div>
                        <div className="bub-t">{m.at}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="row" key={i}>
                      <div className="av">N</div>
                      <div className="col">
                        <div className="nm"><b>Audit Mentor</b><i>{m.at}</i></div>
                        <Card r={resolve(m.key)} refuse={m.key && Q[m.key]?.refuse} />
                        <div className="acts">
                          {resolve(m.key).fups.map((k) => (
                            <button className="act" key={k} onClick={() => sendKey(k)}>{Q[k].ask}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                )}

                {typing && (
                  <div className="row">
                    <div className="av">N</div>
                    <div className="col">
                      <div className="nm"><b>Audit Mentor</b><i>now</i></div>
                      <div className="typ"><i /><i /><i /></div>
                    </div>
                  </div>
                )}
                <div ref={endRef} />
              </div>
            </div>

            <div className="cmp">
              <div className="cmp-in">
                {sugs.length > 0 && (
                  <div className="sug">
                    <div className="sug-h">Suggested questions &middot; Tab to complete, Enter to ask</div>
                    {sugs.map((k, i) => (
                      <button key={k} className={"sug-i" + (i === sugIdx ? " on" : "")}
                        onMouseEnter={() => setSugIdx(i)} onClick={() => sendKey(k)}>
                        <span className="sug-q">{hilite(Q[k].ask, draft)}</span>
                        <span className="sug-s">{Q[k].stage || "Guard rail"}</span>
                      </button>
                    ))}
                  </div>
                )}
                <div className="cbox">
                  <input value={draft} placeholder="Ask the mentor a question"
                    onChange={(e) => { setDraft(e.target.value); setShowSug(true); }}
                    onKeyDown={onKey} aria-label="Ask the mentor a question" />
                  <div className="crow">
                    <button className="cic" aria-label="Format">{S(<path d="M5 6h14M5 12h9M5 18h12" />)}</button>
                    <button className="cic" aria-label="Attach">{S(<path d="M21 11.5 12.5 20a5 5 0 0 1-7-7l8-8a3.5 3.5 0 0 1 5 5l-8 8a2 2 0 0 1-3-3l7.5-7.5" />)}</button>
                    <button className="cic" aria-label="Emoji">{S(<><circle cx="12" cy="12" r="8.5" /><path d="M9 10h.01M15 10h.01M8.5 14a4.5 4.5 0 0 0 7 0" /></>)}</button>
                    <div className="csp" />
                    <button className={"send" + (draft.trim() ? " hot" : "")} onClick={sendTyped} aria-label="Send">
                      {S(<path d="M4 12 20 4l-4 8 4 8-16-8z" />)}
                    </button>
                  </div>
                </div>
                <div className="foot">
                  <span>Answers cite their source. The mentor does not form audit opinions.</span>
                  {msgs.length > 0 && <button onClick={() => setMsgs([])}>Clear conversation</button>}
                </div>
              </div>
            </div>
          </>
        )}

        {tab === "library" && (
          <div className="body"><div className="body-in">
            <h2 className="pg-h">Prompt library</h2>
            <p className="pg-s">
              {Object.keys(Q).length} questions written for the audit lifecycle, so nobody has to
              work out how to phrase a prompt. Select one to ask it in chat.
            </p>
            {LIB_STAGES.map((st) => {
              const keys = Object.keys(Q).filter((k) => Q[k].stage === st);
              if (!keys.length) return null;
              return (
                <div key={st} style={{ marginTop: 22 }}>
                  <div className="gk">{st}</div>
                  <div className="lib">
                    {keys.map((k) => (
                      <button className="lib-row" key={k} onClick={() => sendKey(k)}>
                        <div>
                          <div className="lib-q">{Q[k].ask}</div>
                          <div className="lib-d">{Q[k].blurb}</div>
                        </div>
                        <span className="lib-go">Ask</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
            <div className="note">
              Prompts for performing work, rather than learning, are kept in a separate library
              with their own review. Keeping the two apart is deliberate. This app is for
              understanding the work, not for producing it.
            </div>
          </div></div>
        )}

        {tab === "sources" && (
          <div className="body"><div className="body-in">
            <h2 className="pg-h">Sources</h2>
            <p className="pg-s">
              Everything the mentor can answer from, and the order of authority between them.
              Nothing outside this list is reachable.
            </p>
            {CORPUS.map((g) => (
              <div key={g.tier}>
                <div className="tierhead"><h3>{g.label}</h3></div>
                <p className="pg-s" style={{ marginTop: 4 }}>{g.note}</p>
                <table className="st">
                  <thead><tr>
                    <th>Document</th><th style={{ width: 150 }}>Owner</th>
                    <th style={{ width: 110 }}>Effective</th><th style={{ width: 96 }}>Indexed</th>
                  </tr></thead>
                  <tbody>
                    {g.docs.map((d) => (
                      <tr key={d.n}>
                        <td><div className="doc">{d.n}</div><div className="meta">Version {d.v}</div></td>
                        <td className="num">{d.own}</td>
                        <td className="num">{d.eff}</td>
                        <td>{d.st === "idx"
                          ? <span className="pill idx">{d.chunks} sections</span>
                          : <span className="pill exc">Not indexed</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
            <div className="tierhead"><h3>Deliberately not loaded</h3></div>
            <p className="pg-s" style={{ marginTop: 4 }}>
              Questions touching these return a refusal rather than an answer.
            </p>
            <table className="st">
              <thead><tr><th>Source</th><th>Reason</th></tr></thead>
              <tbody>{EXCLUDED.map((e) => (
                <tr key={e.n}><td className="doc">{e.n}</td><td className="num">{e.why}</td></tr>
              ))}</tbody>
            </table>
            <div className="note">
              Every source carries a version and an effective date, so an answer given in May can be
              reconstructed in November even after the methodology has been revised. Internal Audit
              approves every change to a tier 2 source.
            </div>
          </div></div>
        )}

        {tab === "about" && (
          <div className="body"><div className="body-in">
            <h2 className="pg-h">About Audit Mentor</h2>
            <p className="pg-s">
              A learning tool for the internal audit function. It explains Titan methodology and the
              standards behind it, pitched to who is asking.
            </p>
            <div className="ab">
              <h3>How an answer is built</h3>
              <div className="flow">
                <div className="fl"><b>1. Retrieve</b><span>Keyword and meaning search across the indexed corpus, together</span></div>
                <div className="fl"><b>2. Rank</b><span>Higher authority sources win where sources disagree</span></div>
                <div className="fl"><b>3. Compose</b><span>Fixed five part structure, pitched to the role from Entra</span></div>
                <div className="fl"><b>4. Cite</b><span>Every claim traces to a source, or the answer is refused</span></div>
              </div>
            </div>
            <div className="ab">
              <h3>What it will not do</h3>
              <ul>
                <li><b>No audit opinion.</b> It will not say whether a control passed, failed, or whether something is a finding. That conclusion is the auditor's and carries their name.</li>
                <li><b>No answers from outside the corpus.</b> It cannot reach the open web. If no loaded source supports an answer, it says so.</li>
                <li><b>No flattery.</b> Neutral and fact based. It will critique work against the standard, and it will not tell anyone their work is good to be encouraging.</li>
                <li><b>No producing the work.</b> It explains how to construct a finding. It does not draft the finding.</li>
              </ul>
            </div>
            <div className="ab">
              <h3>Governance</h3>
              <ul>
                <li>Every source is versioned and effective dated. Internal Audit approves changes to its own documents.</li>
                <li>Every question, the sources retrieved, the corpus version and the answer are logged, so any answer can be reconstructed later.</li>
                <li>A fixed evaluation set runs on every corpus, prompt or model change, checking retrieval accuracy, citation support, format and correct refusal.</li>
                <li>Model version is pinned. A model change is a governed change, not an automatic upgrade.</li>
              </ul>
            </div>
            <div className="ab">
              <h3>Where it connects</h3>
              <ul>
                <li>Exceptions raised by continuous control testing carry a rule ID. Selecting explain this control in the exceptions dashboard opens the mentor with that rule already in context.</li>
                <li>The engine finds the exception. The mentor explains what the control exists to catch. The auditor decides what it means.</li>
              </ul>
            </div>
            <div className="note">
              Demonstration build. Responses are prepared in advance and the corpus shown is
              illustrative of how a Titan deployment would be structured.
            </div>
          </div></div>
        )}
      </div>
    </div>
  );
}

function clock() {
  const d = new Date();
  let h = d.getHours(); const m = String(d.getMinutes()).padStart(2, "0");
  const ap = h >= 12 ? "PM" : "AM"; h = h % 12 || 12;
  return `${h}:${m} ${ap}`;
}
