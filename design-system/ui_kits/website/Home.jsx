let Button,Eyebrow,Ornament,ArchFrame,DishCard,ContactRow,SectionDark,OrderBar;
let useTweaks,TweaksPanel,TweakSection,TweakSelect;
const BestelKnop=(p)=><window.T2GNav.BestelKnop {...p}/>;
const A='../../assets';
const PhoneIcon=({size=17})=><svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{flexShrink:0}}><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z"/></svg>;
function useIsMobile(){const [m,setM]=React.useState(typeof window!=='undefined'&&window.innerWidth<768);
React.useEffect(()=>{const on=()=>setM(window.innerWidth<768);window.addEventListener('resize',on);return()=>window.removeEventListener('resize',on);},[]);
return m;}
const H2={fontFamily:'var(--font-display)',fontWeight:500,fontSize:'var(--size-h2)',margin:'var(--space-2) 0 0',color:'var(--text-heading)',lineHeight:1.1};
const P={fontSize:'var(--size-body)',lineHeight:1.6,color:'var(--text-body)',maxWidth:560};
const Wrap=({children,style})=>{const mob=useIsMobile();return <div style={{maxWidth:1120,margin:'0 auto',padding:mob?'0 16px':'0 24px',...style}}>{children}</div>;};
function Foto({h=220,label='foto volgt'}){return <div style={{height:h,background:'var(--t2g-merkoranje)',borderRadius:'var(--radius-card)',display:'grid',placeItems:'center',color:'var(--t2g-papier)',fontSize:13}}>{label}</div>;}

function Hero(){const mob=useIsMobile();
return <section style={{position:'relative',minHeight:mob?'100svh':'100vh',display:'grid',placeItems:'center',background:'var(--surface-dark)',overflow:'hidden',padding:mob?'var(--space-8) 20px':'var(--space-8) 24px'}}>
<div style={{position:'absolute',inset:0,background:"url('../../assets/elements/tajine2go-pattern.png')",backgroundSize:'320px',opacity:.5,mixBlendMode:'luminosity'}}></div>
<div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at center, rgba(68,12,0,.62) 0%, rgba(68,12,0,.88) 70%)'}}></div>
<div style={{position:'relative',textAlign:'center',display:'grid',justifyItems:'center',gap:'var(--space-6)',maxWidth:900}}>
<div style={{fontFamily:'var(--font-display)',fontStyle:'italic',fontSize:'clamp(20px,2.2vw,26px)',color:'var(--line-on-dark)',whiteSpace:'nowrap'}}>Welkom bij</div>
<img src={A+'/logo/tajine2go-horizontal-dark.svg'} alt="Tajine2Go" style={{width:mob?'88%':'auto',height:mob?'auto':130}}/>
<div style={{display:'flex',alignItems:'center',gap:'var(--space-4)',width:'100%'}}>
{!mob&&<div style={{flex:1,height:1,background:'var(--line-on-dark)',opacity:.55}}></div>}
<span style={{fontFamily:'var(--font-body)',fontWeight:600,fontSize:mob?11:13,letterSpacing:'.18em',textTransform:'uppercase',color:'var(--line-on-dark)',whiteSpace:mob?'normal':'nowrap',textAlign:'center'}}>Marokkaanse afhaalgerechten en catering</span>
{!mob&&<div style={{flex:1,height:1,background:'var(--line-on-dark)',opacity:.55}}></div>}
</div>
<div style={{display:'flex',gap:'var(--space-3)',alignItems:'center',flexDirection:mob?'column':'row',justifyContent:'center',width:mob?'100%':'auto'}}>
<BestelKnop size="lg" variant="onDark" full={mob} style={mob?null:{minWidth:230}}/>
<Button variant="onDarkOutline" size="lg" href="contact.html" style={mob?null:{minWidth:230}}>Catering aanvragen</Button>
</div>
</div>
<a href="#menu" style={{position:'absolute',bottom:'var(--space-6)',left:'50%',transform:'translateX(-50%)',color:'var(--text-on-dark)',opacity:.8}}><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 9l6 6 6-6"/></svg></a>
</section>;}

function Concept(){const mob=useIsMobile();const w=mob?130:210,h=w*0.264,lineY=h*0.21;
return <Wrap style={{padding:'0 24px var(--space-7)'}}>
<div style={{display:'flex',alignItems:'flex-start',gap:0}}>
<div style={{flex:1,height:2,background:'var(--t2g-espresso)',marginTop:lineY-1,marginRight:-6}}></div>
<img src={A+'/elements/tajine2go-ornament.svg'} alt="" style={{width:w,display:'block'}}/>
<div style={{flex:1,height:2,background:'var(--t2g-espresso)',marginTop:lineY-1,marginLeft:-6}}></div>
</div>
</Wrap>;}

function MenuRow({it}){const mob=useIsMobile();
return <div style={{display:'flex',alignItems:'flex-start',gap:'var(--space-4)',padding:'var(--space-3) 0'}}>
<div style={{width:mob?56:72,height:mob?56:72,flexShrink:0,borderRadius:12,background:'var(--t2g-merkoranje)',display:'grid',placeItems:'center',color:'var(--t2g-papier)',fontSize:9,textAlign:'center'}}>foto volgt</div>
<div style={{flex:1,minWidth:0}}>
<div style={{display:'flex',alignItems:'baseline',gap:'var(--space-2)'}}>
<div style={{fontFamily:'var(--font-display)',fontWeight:600,fontSize:mob?19:22,lineHeight:1.15}}>{it.nl}</div>
{!mob&&<div style={{flex:1,borderBottom:'1.5px dotted var(--border-soft)',transform:'translateY(-5px)'}}></div>}
{mob&&<div style={{flex:1}}></div>}
<div style={{fontWeight:700,fontSize:mob?15:17,whiteSpace:'nowrap',color:'var(--text-price)',lineHeight:1.15}}>{it.prijs||(it.L?it.M+' / '+it.L:it.M)}</div>
</div>
<div style={{fontSize:12,color:'var(--text-soft)',marginTop:'var(--space-1)'}}>{it.fr} · {it.en}</div>
</div>
</div>;}
function MenuSection({sec}){
const titleRef=React.useRef(null);
const [tw,setTw]=React.useState(0);
React.useLayoutEffect(()=>{if(titleRef.current)setTw(titleRef.current.offsetWidth);},[sec]);
return <section id={slug(sec.label.nl)} style={{marginTop:'var(--space-7)',scrollMarginTop:150}}>
<div style={{position:'relative',textAlign:'center'}}>
<div style={{display:'inline-block'}}>
<h3 ref={titleRef} style={{fontFamily:'var(--font-display)',fontWeight:500,fontSize:'clamp(24px,5vw,28px)',margin:0}}>{sec.label.nl}</h3>
<img src={A+'/elements/tajine2go-ornament.svg'} alt="" style={{width:72,height:14,display:'block',margin:'var(--space-1) auto 0'}}/>
</div>
{sec.sizes.length>0&&<span style={{position:'absolute',right:0,bottom:0,fontSize:12,color:'var(--text-soft)',fontWeight:600,letterSpacing:'.06em',whiteSpace:'nowrap'}}>{sec.sizes.length>1?'M · L':'M'}</span>}
</div>
{sec.items.map(it=><MenuRow key={it.nl} it={it}/>)}
</section>;}
function SerifCat({sec,on,a}){const mob=useIsMobile();const [h,setH]=React.useState(false);
const active=on||(!mob&&h);
return <a {...a} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{flex:'0 0 auto',position:'relative',fontFamily:'var(--font-display)',fontSize:mob?18:22,color:active?'var(--action)':'var(--text-body)',padding:mob?'6px 11px':'6px 16px',textDecoration:'none',whiteSpace:'nowrap',transition:'color .18s ease'}}>{sec.label.nl}</a>;}
function slug(s){return 'cat-'+s.toLowerCase().replace(/[^a-z0-9]+/g,'-');}
function CatNav({secs,variant,active,onPick}){
  const mob=useIsMobile();
  const rowBase={display:'flex',gap:'var(--space-2)',overflowX:'auto',paddingBottom:4};
  const A2=(sec)=>({key:sec.label.nl,href:'#'+slug(sec.label.nl),onClick:()=>onPick(sec.label.nl)});
  const on=(sec)=>sec.label.nl===active;
  if(variant==='pills')return <div style={{...rowBase,justifyContent:mob?'flex-start':'center'}}>
    {secs.map(s=><a {...A2(s)} style={{flex:'0 0 auto',padding:'10px 18px',borderRadius:999,border:'1px solid '+(on(s)?'var(--action)':'var(--border-soft)'),background:on(s)?'var(--action)':'transparent',color:on(s)?'var(--t2g-papier)':'var(--text-body)',fontSize:15,fontWeight:600,textDecoration:'none'}}>{s.label.nl}</a>)}</div>;
  if(variant==='tabs')return <div style={{...rowBase,gap:'var(--space-6)',borderBottom:'1px solid var(--border-soft)',justifyContent:mob?'flex-start':'center'}}>
    {secs.map(s=><a {...A2(s)} style={{flex:'0 0 auto',padding:'10px 0 12px',fontFamily:'var(--font-display)',fontSize:21,color:on(s)?'var(--text-heading)':'var(--text-soft)',borderBottom:'2px solid '+(on(s)?'var(--action)':'transparent'),marginBottom:-1,textDecoration:'none'}}>{s.label.nl}</a>)}</div>;
  if(variant==='inkbar')return <div style={{...rowBase,background:'var(--surface-dark)',borderRadius:'var(--radius-action)',padding:8,gap:4}}>
    {secs.map(s=><a {...A2(s)} style={{flex:'0 0 auto',padding:'10px 16px',borderRadius:4,background:on(s)?'var(--action)':'transparent',color:'var(--text-on-dark)',opacity:on(s)?1:.75,fontSize:15,fontWeight:600,textDecoration:'none'}}>{s.label.nl}</a>)}</div>;
  if(variant==='serif')return <div style={{display:'flex',flexWrap:mob?'nowrap':'wrap',alignItems:'center',justifyContent:mob?'flex-start':'center',overflowX:mob?'auto':'visible',scrollbarWidth:'none',WebkitOverflowScrolling:'touch'}}>
    {secs.map((s,i)=><React.Fragment key={s.label.nl}>{i>0&&<i style={{flex:'0 0 auto',width:4,height:4,transform:'rotate(45deg)',background:'var(--t2g-espresso)',opacity:.5}}></i>}<SerifCat sec={s} on={on(s)} a={A2(s)}/></React.Fragment>)}</div>;
  if(variant==='blocks')return <div style={{display:'grid',gridTemplateColumns:mob?'1fr 1fr':'repeat(3,1fr)',gap:'var(--space-2)'}}>
    {secs.map(s=><a {...A2(s)} style={{padding:'16px 12px',border:'1px solid '+(on(s)?'var(--t2g-inkt)':'var(--border-soft)'),background:on(s)?'var(--t2g-inkt)':'transparent',color:on(s)?'var(--t2g-papier)':'var(--text-body)',borderRadius:'var(--radius-action)',textAlign:'center',fontFamily:'var(--font-display)',fontSize:19,textDecoration:'none'}}>{s.label.nl}</a>)}</div>;
  return <div style={{...rowBase,gap:'var(--space-5)',borderTop:'1px solid var(--border-soft)',borderBottom:'1px solid var(--border-soft)',padding:'10px 0',justifyContent:mob?'flex-start':'center'}}>
    {secs.map(s=><a {...A2(s)} style={{flex:'0 0 auto',display:'flex',alignItems:'baseline',gap:6,fontSize:15,fontWeight:600,color:on(s)?'var(--action)':'var(--text-soft)',textDecoration:'none'}}>{s.label.nl} <span style={{fontSize:11,fontWeight:700,opacity:.7}}>{s.items.length}</span></a>)}</div>;
}
function Menu({navVariant}){const m=window.tajine2goMenu;const secs=Object.values(m);const mobNav=useIsMobile();
const [active,setActive]=React.useState(secs[0].label.nl);
React.useEffect(()=>{const on=()=>{let cur=secs[0].label.nl;for(const s of secs){const el=document.getElementById(slug(s.label.nl));if(el&&el.getBoundingClientRect().top<160)cur=s.label.nl;}setActive(cur);};on();window.addEventListener('scroll',on);return()=>window.removeEventListener('scroll',on);},[]);
return <Wrap style={{padding:'var(--space-8) 24px var(--space-8)',maxWidth:860}} ><div id="menu" style={{scrollMarginTop:130}}></div>
<div style={{textAlign:'center'}}><Eyebrow>Uit onze keuken</Eyebrow></div>
<div style={{position:'sticky',top:mobNav?60:76,zIndex:20,background:'var(--surface-page)',marginTop:'var(--space-5)',paddingTop:'var(--space-2)',paddingBottom:'var(--space-2)',borderBottom:'1px solid var(--border-soft)'}}><CatNav secs={secs} variant={navVariant} active={active} onPick={setActive}/></div>
{secs.map(sec=><MenuSection key={sec.label.nl} sec={sec}/>)}
</Wrap>;}

function Verhaal(){const mob=useIsMobile();
return <SectionDark style={{...(mob?{padding:'var(--space-8) 16px'}:null),position:'relative',scrollMarginTop:76}}><div id="verhaal" style={{position:'absolute',top:-130}}></div><Wrap style={{display:'grid',gridTemplateColumns:mob?'1fr':'1fr 1fr',gap:'var(--space-6)',alignItems:'center'}}>
<div>
<Eyebrow onDark>Ons verhaal</Eyebrow>
<h2 style={{...H2,color:'var(--text-on-dark)'}}>De warmte van Marokko, klaar om mee te nemen.</h2>
<p style={{...P,color:'var(--text-on-dark)',opacity:.9,marginTop:'var(--space-4)'}}>Afhaaleten hoeft niet onpersoonlijk te zijn. Bij Tajine2Go krijgt elk gerecht de tijd die het nodig heeft, met kruiden uit Marokko en verse groenten van de markt. Kom binnen, voel je thuis en eet iets lekkers.</p>
<div style={{width:120,height:2,background:'var(--line-on-dark)',marginTop:'var(--space-5)'}}></div>
</div>
<Foto h={300} label="foto: familietafel"/>
</Wrap></SectionDark>;}

function Catering(){const mob=useIsMobile();
return <div style={{position:'relative'}}><div id="catering" style={{position:'absolute',top:-130}}></div><Wrap style={{padding:'var(--space-8) 24px',display:'grid',gridTemplateColumns:mob?'1fr':'1fr 1fr',gap:'var(--space-6)',alignItems:'center'}}>
<Foto h={mob?200:280} label="foto: cateringbuffet"/>
<div>
<Eyebrow>Catering</Eyebrow>
<h2 style={H2}>Voor feesten, families en collega's</h2>
<p style={{...P,marginTop:'var(--space-4)'}}>Van een familiefeest tot een lunch op kantoor: wij verzorgen Marokkaanse gerechten voor kleine en grotere groepen. Vertel ons je gelegenheid en het aantal personen, wij doen een voorstel.</p>
<div style={{fontWeight:700,fontSize:24,color:'var(--text-price)',marginTop:'var(--space-5)'}}>Op aanvraag</div>
<div style={{display:'flex',gap:'var(--space-3)',marginTop:'var(--space-4)',flexDirection:mob?'column':'row'}}><Button href="contact.html">Catering aanvragen</Button></div>
</div></Wrap></div>;}

function Bereikbaarheid(){const mob=useIsMobile();
const items=[['Met de auto','Vlot bereikbaar. Parkeren kan in de straat, of vlakbij aan het Arsenaal — vandaar is het een korte wandeling.'],['Met het openbaar vervoer','Vlot bereikbaar met tram en bus. Tramlijn 2 stopt aan Gentbrugge Schooldreef, buslijn 9 aan Gentbrugge Arsenaal — beide op een korte wandeling van de zaak.'],['Met de fiets','Je zet je fiets voor de deur in de stallingen langs de Brusselsesteenweg. Wie van verder komt: op de site van Het Arsenaal, enkele honderden meters verderop, staan ruim 250 (deels overdekte) fietsenstallingen.']];
return <SectionDark style={{padding:mob?'var(--space-8) 16px':'var(--space-8) 24px',position:'relative'}}><div id="bereikbaarheid" style={{position:'absolute',top:-130}}></div><Wrap>
<Eyebrow onDark>Bereikbaarheid</Eyebrow>
<h2 style={{...H2,color:'var(--text-on-dark)'}}>Zo vind je ons in Gentbrugge</h2>
<div style={{display:'grid',gridTemplateColumns:mob?'1fr':'repeat(3,1fr)',gap:'var(--space-6)',marginTop:'var(--space-6)'}}>
{items.map(([t,d])=><div key={t}>
<div style={{fontFamily:'var(--font-display)',fontWeight:600,fontSize:22,color:'var(--text-on-dark)'}}>{t}</div>
<p style={{fontSize:16,lineHeight:1.55,color:'var(--text-on-dark)',opacity:.85,marginTop:'var(--space-2)'}}>{d}</p>
</div>)}
</div>
<div style={{marginTop:'var(--space-6)'}}><Foto h={mob?200:280} label="kaart of foto: gevel Brusselsesteenweg 455"/></div>
</Wrap></SectionDark>;}
function Praktisch(){const mob=useIsMobile();
return <div style={{padding:mob?'var(--space-8) 16px':'var(--space-8) 24px',position:'relative'}}><div id="praktisch" style={{position:'absolute',top:-130}}></div><Wrap style={{display:'grid',gridTemplateColumns:mob?'1fr':'1fr 1fr auto',gap:'var(--space-6)',alignItems:'center',justifyItems:mob?'start':'stretch'}}>
<div style={{display:'grid',gap:'var(--space-4)'}}>
<Eyebrow>Praktisch</Eyebrow>
<div style={{display:'grid',gap:'var(--space-3)'}}>
<ContactRow icon="pin">Brusselsesteenweg 455, 9050 Gentbrugge</ContactRow>
<ContactRow icon="phone">Tel. 09 377 32 51 · 0451 01 61 44</ContactRow>
<ContactRow icon="mail">info@tajine2go.be</ContactRow>
<ContactRow icon="instagram"><a href="#" style={{color:'var(--text-body)',textDecoration:'none'}}>@tajine2go.gent</a></ContactRow>
<ContactRow icon="facebook"><a href="#" style={{color:'var(--text-body)',textDecoration:'none'}}>Tajine2Go</a></ContactRow>
</div></div>
<div style={{fontSize:17,lineHeight:1.6,display:'grid',gap:'var(--space-2)',alignContent:'start'}}>
<div style={{fontFamily:'var(--font-display)',fontWeight:600,fontSize:22,marginBottom:'var(--space-1)'}}>Openingsuren</div>
<div style={{maxWidth:280,color:'var(--text-soft)'}}>Openingsuren volgen binnenkort. Bel ons gerust voor afhaalmomenten.</div>
<div style={{marginTop:'var(--space-5)'}}>
<div style={{fontFamily:'var(--font-body)',fontWeight:600,fontSize:12,letterSpacing:'.18em',textTransform:'uppercase',color:'var(--action)'}}>Snelle links</div>
<nav style={{display:'flex',flexWrap:'wrap',gap:'var(--space-2) var(--space-4)',fontSize:16,marginTop:'var(--space-3)'}}>
{[['Menu','#menu'],['Catering','#catering'],['Over ons','#verhaal'],['Contact','mailto:info@tajine2go.be']].map(([x,href])=><a key={x} href={href} style={{color:'var(--text-body)',textDecoration:'none'}}>{x}</a>)}
</nav>
</div>
</div>
<img src={A+'/qr/tajine2go-qr-ink-on-paper.svg'} alt="QR naar tajine2go.be" style={{height:mob?120:150}}/>
</Wrap>
<Wrap style={{marginTop:'var(--space-7)',paddingTop:'var(--space-4)',borderTop:'1px solid var(--border-soft)',fontSize:14,color:'var(--text-soft)'}}>© 2026 Tajine2Go · BTW BE 1019936687</Wrap>
</div>;}

function Footer(){return <footer style={{padding:'var(--space-8) 24px',background:'var(--surface-dark)'}}><div style={{display:'flex',justifyContent:'center'}}>
<img src={A+'/logo/tajine2go-wordmark-dark.svg'} alt="Tajine2Go" style={{width:'min(1100px,92vw)',display:'block'}}/>
</div>
</footer>;}

function MobileOrderBar(){const mob=useIsMobile();const [show,setShow]=React.useState(false);
React.useEffect(()=>{const on=()=>setShow(window.scrollY>window.innerHeight*0.7);on();window.addEventListener('scroll',on);return()=>window.removeEventListener('scroll',on);},[]);
if(!mob)return null;
return <div style={{position:'fixed',bottom:0,left:0,right:0,zIndex:40,background:'var(--t2g-papier)',borderTop:'1px solid var(--border-soft)',padding:'10px 16px calc(10px + env(safe-area-inset-bottom))',transform:show?'translateY(0)':'translateY(120%)',transition:'transform .25s ease'}}>
<a href="tel:093773251" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'var(--space-2)',background:'var(--action)',color:'var(--t2g-papier)',fontWeight:700,fontSize:17,padding:'14px 24px',borderRadius:'var(--radius-action)',textDecoration:'none'}}><PhoneIcon size={18}/>Bestel nu</a>
</div>;}
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "menuNav": "serif"
}/*EDITMODE-END*/;
function Home(){const [t,setTweak]=useTweaks(TWEAK_DEFAULTS);
return <div id="top">
<window.T2GNav.SiteNav reveal={true}/><Hero/><Menu navVariant={t.menuNav}/><Verhaal/><Catering/><Bereikbaarheid/><Praktisch/><Footer/>
<MobileOrderBar/>
<TweaksPanel>
  <TweakSection label="Menunavigatie"/>
  <TweakSelect label="Variant" value={t.menuNav} options={['pills','tabs','inkbar','serif','blocks','teller']} onChange={v=>setTweak('menuNav',v)}/>
</TweaksPanel>
</div>;}
(function mount(tries){
  const ns=window.Tajine2GoDesignSystem_2aba92;
  if(!ns||!window.tajine2goMenu){ if(tries<100) setTimeout(()=>mount(tries+1),100); return; }
  ({Button,Eyebrow,Ornament,ArchFrame,DishCard,ContactRow,SectionDark,OrderBar}=ns);
  if(!window.useTweaks||!window.T2GNav){ if(tries<100) setTimeout(()=>mount(tries+1),100); return; }
  ({useTweaks,TweaksPanel,TweakSection,TweakSelect}=window);
  const el=document.getElementById('root');
  if(!window.__t2gRoot){el.innerHTML='';window.__t2gRoot=ReactDOM.createRoot(el);}
  window.__t2gRoot.render(<Home/>);
})(0);
