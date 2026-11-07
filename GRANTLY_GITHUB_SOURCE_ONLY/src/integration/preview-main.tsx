// DEVELOPMENT-ONLY entry point. Excluded from vite production rollup input.
import React,{useState} from 'react';
import type {ChangeEvent} from 'react';
import {createRoot} from 'react-dom/client';
import type {Id, Row} from '../shared/contracts';
import {sampleRows,savedReviewRow,specimenEmptyIndex,specimenList} from './fixtures';
import '../styles/global.css';
const cases=['Meridian + CW','Fieldwork + FT','Bridge + CW','Meridian + no aid','Saved Fieldwork (review)','Empty index'] as const;
const caseRows:Row[]=[sampleRows.meridianCW,sampleRows.fieldworkFT,sampleRows.bridgeCW,sampleRows.meridianNoAid,savedReviewRow];
function Display(){
 const [selected,setSelected]=useState(0);
 const [selectedId,setSelectedId]=useState<Id>('B');
 const specimen=caseRows[selected];
 return <main className="g-workspace" id="g-main">
  <p className="g-kicker">G1 PREVIEW FIXTURES · NOT APPLICATION DATA</p>
  <h1>Contract specimen desk</h1>
  <p className="g-muted">Development-only fixture harness. B supplies real rules, C real discovery, D real planning. Do not treat these hand-authored results as evaluated output.</p>
  <label htmlFor="specimen-select">Specimen</label>
  <select id="specimen-select" className="g-secondary" style={{margin:'8px 0 24px'}} value={selected} onChange={(e:ChangeEvent<HTMLSelectElement>)=>setSelected(Number(e.target.value))}>{cases.map((c,i)=><option key={c} value={i}>{c}</option>)}</select>
  {selected===5? <section className="g-section"><h2 id="g-results-list" tabIndex={-1}>No scholarships match these filters.</h2><p>Clear search and filters.</p><pre>{JSON.stringify(specimenEmptyIndex)}</pre></section>:
  specimen&&<div className="g-discover-layout g-two-col">
    <section className="g-module-wait"><h2 id="g-results-list" tabIndex={-1}>Preview selection</h2><p>Specimen list: {specimenList.query||'(no query)'} · Open only</p>{(['B','M','F'] as Id[]).map(id=><button key={id} id={`g-opportunity-row-${id}`} className="g-row" onClick={()=>setSelectedId(id)} aria-current={selectedId===id?'true':undefined}>{id} · View details</button>)}</section>
    <article className="g-reading-pane"><p className="g-kicker">LISTED CRITERIA · SAMPLE</p><h2 id="g-detail-heading" tabIndex={-1} style={{fontFamily:'Georgia',fontSize:'34px',lineHeight:'38px',fontWeight:400}}>{specimen.opportunity.name}</h2><h2 className="g-money">{specimen.opportunity.benefit} <small>{specimen.opportunity.frequency}</small></h2><p>Apply by <strong>{specimen.opportunity.deadline}</strong></p><p>{specimen.opportunity.audience}</p><section className="g-section"><h3>Listed criteria · {specimen.assessment.fit}</h3>{specimen.assessment.reasons.map(r=><p key={r.criterion}>{r.text}</p>)}</section>
      <section className="g-section"><p>Applying with this aid · <strong>{specimen.assessment.application.outcome}</strong></p><p>{specimen.assessment.application.reason}</p><p>Holding both awards · <strong>{specimen.assessment.holding.outcome}</strong></p><p>{specimen.assessment.holding.reason}</p></section>
      <button className="g-primary" onClick={()=>alert('Preview only. Real command callbacks arrive with D.')}>Action specimen: {specimen.assessment.primary}</button>
      {specimen.needsReview&&<p className="g-status-unknown">Review change · Existing intention and progress preserved in specimen</p>}
      <details className="g-section"><summary>Read both providers’ terms</summary>{[...specimen.assessment.application.evidence,...specimen.assessment.holding.evidence].map((e,i)=><p key={`${e.owner}-${i}`}>{e.owner}: {e.clause?.text??e.note}</p>)}</details>
      <section className="g-section"><h3>Required documents</h3><ul>{specimen.opportunity.documents.map(d=><li key={d}>{d}</li>)}</ul></section>
    </article>
  </div>}
  <footer className="g-footer"><span>Fictional demo · as of 7 Nov 2026</span><span>Preview fixtures only · Excluded from production bundle</span></footer>
 </main>;
}
const target=document.getElementById('root');if(target)createRoot(target).render(<React.StrictMode><Display/></React.StrictMode>);
