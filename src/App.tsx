import { useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import type { Aid, Command, Field, Id, ListState, Model, Page, Profile, Row, Year } from './shared/contracts';
import { freshList, freshModel, DEMO_LABEL } from './shared/defaults';
import { FOCUS, focusId } from './shared/focus';
import { catalogue, assess, visibleRows, contextKey, applyCommand, read, write, reset, Discover, OpportunityDetail, MyPlan } from './integration/live';

type Notice = { kind:'success'|'warning'|'info'; text:string } | null;
type Origin = 'discover'|'plan';
const ID_SET = new Set<Id>(['M','F','B','C','L','D']);

function useWide():boolean {
  const [wide,setWide] = useState(()=>window.matchMedia('(min-width: 900px)').matches);
  useEffect(()=>{
    const media=window.matchMedia('(min-width: 900px)');
    const handler=()=>setWide(media.matches);
    media.addEventListener('change',handler);
    return ()=>media.removeEventListener('change',handler);
  },[]);
  return wide;
}
function initialHydration():{model:Model; lock:boolean; notice:Notice} {
  // One guarded read; never write during hydration, even on empty or invalid data.
  const result=read();
  if(result.kind==='ok') return {model:result.model,lock:false,notice:null};
  if(result.kind==='invalid') return {model:freshModel(),lock:true,notice:{kind:'warning',text:'This browser has unreadable GRANTLY data. Existing bytes were kept. Confirm Reset demo to clear it before saving.'}};
  if(result.kind==='unavailable') return {model:freshModel(),lock:true,notice:{kind:'warning',text:'This browser couldn’t read saved data. Edits can be used in this tab but will not overwrite unknown data. Confirm Reset demo before retrying storage.'}};
  return {model:freshModel(),lock:false,notice:null};
}

export default function App() {
  const [hydrated] = useState(initialHydration);
  const [model,setModel]=useState<Model>(hydrated.model);
  const [locked,setLocked]=useState(hydrated.lock);
  const [notice,setNotice]=useState<Notice>(hydrated.notice);
  const [list,setList]=useState<ListState>(freshList);
  const [page,setPage]=useState<Page>('discover');
  const [origin,setOrigin]=useState<Origin>('discover');
  const [detailId,setDetailId]=useState<Id|null>(null);
  const [announcement,setAnnouncement]=useState('');
  const lastReturnRef=useRef<{id:string;scroll:number}|null>(null);
  const wide=useWide();
  const [profileExpanded,setProfileExpanded]=useState(false);
  const storageDetailsRef=useRef<HTMLDetailsElement>(null);
  const profileToggleRef=useRef<HTMLButtonElement>(null);

  const rows=useMemo<Row[]>(()=>catalogue.map(opportunity=>{
    const assessment=assess(opportunity,model.profile);
    const entry=model.entries.find(e=>e.id===opportunity.id) ?? null;
    return { opportunity, assessment, entry,
      needsReview: entry!==null && entry.acknowledgedKey!==contextKey(opportunity,model.profile) };
  }),[model]);
  const visible=useMemo(()=>visibleRows(rows,list),[rows,list]);
  const selected:Id|null=useMemo(()=>{
    if(visible.length===0) return null;
    return list.selected!==null && visible.some(r=>r.opportunity.id===list.selected)
      ? list.selected : visible[0]!.opportunity.id;
  },[visible,list.selected]);
  const canonicalList=useMemo<ListState>(()=>selected===list.selected?list:{...list,selected},[list,selected]);
  const selectedRow=rows.find(r=>r.opportunity.id===(detailId??selected)) ?? null;
  const wideRow=rows.find(r=>r.opportunity.id===selected) ?? null;
  const savedRows=useMemo(()=>rows.filter(r=>r.entry).sort((a,b)=>a.opportunity.deadline.localeCompare(b.opportunity.deadline)||a.opportunity.id.localeCompare(b.opportunity.id)),[rows]);

  // Model writes only follow explicit user events; failed I/O never discards memory.
  const commitModel=(next:Model,changedMessage?:string)=>{
    setModel(next);
    if(locked) {setNotice({kind:'warning',text:'Changes remain in this tab. Existing unreadable/unavailable device data was not overwritten; use confirmed Reset demo before saving.'});if(changedMessage)setAnnouncement(changedMessage);return;}
    const io=write(next);
    setNotice(io.ok ? {kind:'success',text:'Saved on this device'} : {kind:'warning',text:'Changes are available in this tab. This browser couldn’t save them.'});
    if(changedMessage)setAnnouncement(changedMessage);
  };
  const updateProfile=(patch:Partial<Profile>)=>{
    // No focus move on profile changes; selected opportunity and query persist.
    const before=selectedRow?.assessment;
    const next={...model,profile:{...model.profile,...patch}};
    commitModel(next);
    if(before && selectedRow) {
      // Announce current B-owned results, not a generic hint or an inferred permission.
      const outcome=assess(selectedRow.opportunity,next.profile);
      const fitText=outcome.fit==='met'?'met':outcome.fit==='unmet'?'not met':'not fully known';
      const stageText=(value:string)=>value==='notApplicable'?'not applicable':value;
      setAnnouncement(`Study context updated. ${selectedRow.opportunity.name}: listed academic criteria ${fitText}; application ${stageText(outcome.application.outcome)}; holding ${stageText(outcome.holding.outcome)}.`);
    } else {
      setAnnouncement('Study context updated. Review the listed scholarship criteria.');
    }
  };
  const onList=(next:ListState)=>{
    const view=visibleRows(rows,next);
    const nextSelected=next.selected && view.some(r=>r.opportunity.id===next.selected)
      ? next.selected : view[0]?.opportunity.id ?? null;
    setList({...next,selected:nextSelected});
  };
  const closeProfilePanels=()=>{
    setProfileExpanded(false);
    if(storageDetailsRef.current)storageDetailsRef.current.open=false;
  };
  const goDiscover=(focusResults=false)=>{
    closeProfilePanels();
    setPage('discover');setDetailId(null);
    if(focusResults) focusId(FOCUS.results);
  };
  const openRow=(id:Id, from:Origin)=>{
    if(!ID_SET.has(id)||!rows.some(r=>r.opportunity.id===id))return;
    closeProfilePanels();
    setOrigin(from);setDetailId(id);
    lastReturnRef.current={id:from==='plan'?FOCUS.planOpen(id):FOCUS.opportunityRow(id),scroll:window.scrollY};
    if(from==='discover')setList(s=>({...s,selected:id}));
    if(from==='plan'||!wide){setPage('detail');window.scrollTo({top:0});}
    focusId(FOCUS.detailHeading);
  };
  const backToOrigin=()=>{
    closeProfilePanels();
    setPage(origin==='plan'?'plan':'discover');setDetailId(null);
    const target=lastReturnRef.current;
    if(target){
      window.requestAnimationFrame(()=>{
        window.scrollTo({top:target.scroll});
        document.getElementById(target.id)?.focus({preventScroll:true});
      });
    } else focusId(origin==='plan'?'g-plan-heading':FOCUS.results);
  };
  const onCommand=(command:Command)=>{
    const row=rows.find(r=>r.opportunity.id===command.id);
    if(!row)return;
    const updated=applyCommand(model,command,row);
    if(updated===model){
      setNotice({kind:'info',text:'No change was made. This action is unavailable for the current saved plan and assessment.'});
      return;
    }
    commitModel(updated, 'Your plan was updated. The current assessment is shown with the saved context.');
  };
  const resetDemo=()=>{
    if(!window.confirm('Reset demo? This removes only GRANTLY data saved in this browser. This cannot be undone.'))return;
    const result=reset();
    if(!result.ok){setNotice({kind:'warning',text:'Couldn’t clear this device’s saved plan.'});return;}
    setModel(freshModel());setList(freshList());setLocked(false);
    setPage('discover');setDetailId(null);setNotice({kind:'info',text:'GRANTLY demo reset. No defaults were written.'});
    focusId(FOCUS.results);
  };
  const explore=()=>{
    const fresh:ListState={query:'',openOnly:true,selected:null};
    onList(fresh);setPage('discover');setDetailId(null);focusId(FOCUS.results);
  };
  const compare=()=>{setPage('discover');setDetailId(null);focusId(FOCUS.results);};
  const showPlan=()=>{closeProfilePanels();setPage('plan');setDetailId(null);focusId('g-plan-heading');};
  const openProfileEditor=()=>{
    if(storageDetailsRef.current)storageDetailsRef.current.open=false;
    setProfileExpanded(true);
    focusId(FOCUS.profileEditor);
  };
  const detailProps=(row:Row)=>({
    row, profile:model.profile, onCommand, onProfile:openProfileEditor,
    onCompare:compare,onExplore:explore,onPlan:showPlan,onBack:backToOrigin
  });
  const detailVisible=(page==='detail'||(page==='discover'&&wide));
  const pageTitle=page==='plan'?'My plan':page==='detail'?'Opportunity details':'Discover scholarships';
  // Presentation only: the complete I/O result remains inspectable below.
  const storageSummary=!notice?'Device storage · no edits in this tab.'
    :notice.kind==='success'?'Saved on this device.'
    :notice.kind==='warning'?notice.text.includes('Couldn’t clear')?'Reset failed · tab state kept.'
      :locked?'Storage locked · tab only. Reset before saving.'
      :'Not saved · edits stay in this tab.'
    :notice.text.startsWith('GRANTLY demo reset')?'Demo reset · no defaults saved.'
    :'No change was made.';

  return <div className={`g-app g-page-${page}`}>
    <a className="g-skip" href="#g-main">Skip to main content</a>
    <header className="g-site-header"><div className="g-header-inner">
      <div className="g-brand" aria-label="GRANTLY home"><span className="g-brand-emblem" aria-hidden="true">G</span><span className="g-brand-name">GRANTLY<span className="g-brand-dot">.</span></span></div>
      <nav className="g-topnav" aria-label="Main navigation">
        <button type="button" className={page==='discover'||page==='detail'?'g-nav-active':''} onClick={()=>goDiscover(true)} aria-current={page!=='plan'?'page':undefined}>Discover</button>
        <button type="button" className={page==='plan'?'g-nav-active':''} onClick={showPlan} aria-current={page==='plan'?'page':undefined}>My plan <span className="g-count">{model.entries.length}</span></button>
      </nav>
      <span className="g-demo-mark">{DEMO_LABEL}</span>
    </div></header>
    <main id="g-main" className="g-workspace" tabIndex={-1}>
      <div className="g-intro">
        <div className="g-intro-copy"><div className="g-eyebrow">THE SCHOLARSHIP DECISION DESK / ISSUE 01</div><h1>{page==='discover'?<>Find funding. <em>Know the terms.</em></>:pageTitle}</h1>
          <p className="g-intro-description">{page==='plan'
            ? 'Your saved intentions, outstanding questions and current award conditions — in one place.'
            : page==='detail'
              ? 'Read the award, understand its conditions, and choose a deliberate next step.'
              : 'Explore funding, check listed criteria, and see how existing aid changes what you can hold.'}</p>
        </div>
        {page==='discover'&&<aside className="g-intro-aside" aria-label="What GRANTLY helps you compare">
          <span className="g-intro-aside-label">THE TWO QUESTIONS</span>
          <div><span aria-hidden="true">01</span><strong>Can I apply?</strong></div>
          <div><span aria-hidden="true">02</span><strong>Can I hold both awards?</strong></div>
        </aside>}
        <span className="g-demo-mobile">{DEMO_LABEL}</span>
      </div>
      <section id={FOCUS.profileEditor} tabIndex={-1} className={`g-profile-editor g-focus-target ${profileExpanded?'g-profile-expanded':''}`} aria-label="Study details and existing aid"
        onBlur={event=>{if(event.relatedTarget&&!event.currentTarget.contains(event.relatedTarget))closeProfilePanels();}}
        onKeyDown={event=>{
          if(event.key==='Escape'){
            if(storageDetailsRef.current?.open){storageDetailsRef.current.open=false;storageDetailsRef.current.querySelector('summary')?.focus();}
            else if(profileExpanded){setProfileExpanded(false);profileToggleRef.current?.focus();}
          }
        }}>
        <div className="g-profile-lead">
          <details ref={storageDetailsRef} className={`g-notice g-${notice?.kind??'idle'} g-storage-details`}
            onToggle={event=>{if(event.currentTarget.open)setProfileExpanded(false);}}>
            <summary aria-label={`Study context and storage details. ${storageSummary}`}>
              <strong>Your study context <span className="g-storage-cue">Details ▾</span></strong>
            <span className="g-profile-summary">{model.profile.year===null?'Year not set':`Year ${model.profile.year}`} · {model.profile.field===null?'Field not set':model.profile.field==='stem'?'STEM':'Other field'} · {model.profile.aid==='none'?'No existing aid':model.profile.aid==='CW'?'Campus Tuition Waiver':'Founders Tuition Award'}</span>
              <span className="g-storage-summary" role="status" aria-live="polite" aria-atomic="true">{storageSummary}</span>
            </summary>
            <div className="g-storage-copy"><strong>{notice?.kind==='warning'?'Storage notice':'Device storage'}</strong>
              <p>{notice?.text??'No edits have been made in this tab. Device saving is reported only after a successful write.'}</p>
              <p>Change any field to update the listed assessment below.</p>
            </div>
          </details>
          <button ref={profileToggleRef} type="button" className="g-profile-toggle" aria-expanded={profileExpanded} aria-controls="g-profile-fields" onClick={()=>{
            if(storageDetailsRef.current)storageDetailsRef.current.open=false;
            setProfileExpanded(expanded=>!expanded);
          }}>{profileExpanded?'Done':'Edit'} <span aria-hidden="true">{profileExpanded?'−':'+'}</span></button>
        </div>
        <div id="g-profile-fields" className="g-profile-fields"><div className="g-field"><label htmlFor="g-profile-year">Undergraduate year</label><select id="g-profile-year" value={model.profile.year??''} onChange={(e:ChangeEvent<HTMLSelectElement>)=>updateProfile({year:e.target.value===''?null:Number(e.target.value) as Year})}>
          <option value="">Not answered</option><option value="1">Year 1</option><option value="2">Year 2</option><option value="3">Year 3</option><option value="4">Year 4</option>
        </select></div>
        <div className="g-field"><label htmlFor="g-profile-field">Field of study</label><select id="g-profile-field" value={model.profile.field??''} onChange={(e:ChangeEvent<HTMLSelectElement>)=>updateProfile({field:e.target.value===''?null:e.target.value as Field})}>
          <option value="">Not answered</option><option value="stem">STEM</option><option value="other">Other</option>
        </select></div>
        <div className="g-field"><label htmlFor="g-profile-aid">Existing aid</label><select id="g-profile-aid" value={model.profile.aid} onChange={(e:ChangeEvent<HTMLSelectElement>)=>updateProfile({aid:e.target.value as Aid})}>
          <option value="none">None</option><option value="CW">Campus Tuition Waiver</option><option value="FT">Founders Tuition Award</option>
        </select></div></div>
      </section>
      <div id="g-live-assessment" className="g-sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</div>
      {page==='plan'&&<MyPlan rows={savedRows} profile={model.profile} onCommand={onCommand} onOpen={id=>openRow(id,'plan')} onDiscover={()=>goDiscover(true)} onReset={resetDemo}/>}
      {page==='discover'&&<div className={`g-discover-layout ${wide?'g-two-col':''}`}>
        <Discover rows={rows} list={canonicalList} onList={onList} onOpen={id=>openRow(id,'discover')}/>
        {wide&&<div className="g-reading-pane">{wideRow ? <OpportunityDetail {...detailProps(wideRow)}/> : <div className="g-empty-detail"><h2>No scholarships match these filters.</h2><p>Clear search and filters.</p><button className="g-secondary" onClick={explore}>Clear search and filters</button></div>}</div>}
      </div>}
      {detailVisible && page==='detail' && <div className="g-reading-single">{selectedRow?<OpportunityDetail {...detailProps(selectedRow)}/>:<p>No selected scholarship.</p>}</div>}
      <footer className="g-footer"><span>GRANTLY / DEMONSTRATION ONLY</span><span>No provider affiliation · No application is submitted here</span></footer>
    </main>
  </div>;
}
