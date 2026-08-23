// Gedeelde navigatiebalk — één bron voor alle pagina's.
(function(){
const A='../../assets';
const DS=()=>window.Tajine2GoDesignSystem_2aba92;
const Wrap=({children,style})=>{const mob=useIsMobile();return <div style={{maxWidth:1120,margin:'0 auto',padding:mob?'0 16px':'0 24px',...style}}>{children}</div>;};
function useIsMobile(){const [m,setM]=React.useState(typeof window!=='undefined'&&window.innerWidth<768);
React.useEffect(()=>{const on=()=>setM(window.innerWidth<768);window.addEventListener('resize',on);return()=>window.removeEventListener('resize',on);},[]);
return m;}
function useCompactNav(){const [c,setC]=React.useState(typeof window!=='undefined'&&window.innerWidth<1080);
React.useEffect(()=>{const on=()=>setC(window.innerWidth<1080);window.addEventListener('resize',on);return()=>window.removeEventListener('resize',on);},[]);
return c;}
const PhoneIcon=({size=17})=><svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{flexShrink:0}}><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z"/></svg>;

function BestelKnop({size='lg',align='left',variant='primary',full=false,style:extra}){
  const {Button}=DS();
  const [open,setOpen]=React.useState(false);
  const [up,setUp]=React.useState(false);
  const ref=React.useRef(null);
  const toggle=()=>{
    if(!open&&ref.current){const r=ref.current.getBoundingClientRect();setUp(window.innerHeight-r.bottom<140);}
    setOpen(o=>!o);
  };
  React.useEffect(()=>{
    if(!open)return;
    const close=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false);};
    document.addEventListener('click',close);return()=>document.removeEventListener('click',close);
  },[open]);
  return <div ref={ref} style={{position:'relative',display:full?'block':'inline-block'}}>
    <Button size={size} variant={variant} onClick={toggle} style={{...(full?{width:'100%',justifyContent:'center'}:null),...extra}}><PhoneIcon size={18}/>Bestel nu</Button>
    {open&&<div style={{position:'absolute',[align]:0,[up?'bottom':'top']:'calc(100% + 8px)',zIndex:20,background:'var(--t2g-papier)',borderRadius:'var(--radius-action)',boxShadow:'var(--shadow-card-hover)',border:'1px solid var(--border-soft)',padding:'10px 0',minWidth:230}}>
      <div style={{padding:'4px 18px 8px',fontSize:12,letterSpacing:'.18em',textTransform:'uppercase',fontWeight:600,color:'var(--action)'}}>Bestel telefonisch</div>
      <a href="tel:093773251" style={{display:'block',padding:'10px 18px',fontWeight:700,fontSize:17,color:'var(--t2g-inkt)',textDecoration:'none',whiteSpace:'nowrap'}}>09 377 32 51</a>
      <a href="tel:0451016144" style={{display:'block',padding:'10px 18px',fontWeight:700,fontSize:17,color:'var(--t2g-inkt)',textDecoration:'none',whiteSpace:'nowrap'}}>0451 01 61 44</a>
    </div>}
  </div>;
}

function navItems(base){return [['Menu',base+'#menu'],['Over ons',base+'#verhaal'],['Catering','contact.html'],['Bereikbaarheid',base+'#bereikbaarheid'],['Praktisch',base+'#praktisch'],['Contact','contact.html']];}

function LogoLink({mob,home}){const [h,setH]=React.useState(false);
return <a href={home} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{display:'block',lineHeight:0}}>
<img src={A+'/logo/tajine2go-horizontal-light.svg'} alt="Tajine2Go" style={{height:mob?34:46,transform:h?'scale(1.06)':'scale(1)',transformOrigin:'left center',transition:'transform .22s ease'}}/>
</a>;}

function bgAt(x,y){let el=document.elementFromPoint(x,y);
while(el){const c=getComputedStyle(el).backgroundColor;const m=c&&c.match(/rgba?\(([\d.]+), ?([\d.]+), ?([\d.]+)(?:, ?([\d.]+))?\)/);
if(m&&(m[4]===undefined||parseFloat(m[4])>0.5))return [+m[1],+m[2],+m[3]];el=el.parentElement;}
return [253,243,226];}

function BurgerMenu({items}){const [open,setOpen]=React.useState(false);const [dark,setDark]=React.useState(false);const wrap=React.useRef(null);
React.useEffect(()=>{if(!open)return;const close=e=>{if(wrap.current&&!wrap.current.contains(e.target))setOpen(false);};document.addEventListener('click',close);return()=>document.removeEventListener('click',close);},[open]);
React.useEffect(()=>{const on=()=>{const [r,g,b]=bgAt(Math.round(window.innerWidth*0.3),Math.round(window.innerHeight*0.5));setDark((0.299*r+0.587*g+0.114*b)<128);};on();window.addEventListener('scroll',on);return()=>window.removeEventListener('scroll',on);},[open]);
const panelBg=dark?'var(--surface-dark)':'var(--t2g-papier)';
const panelText=dark?'var(--text-on-dark)':'var(--text-body)';
const panelLine=dark?'rgba(253,243,226,.22)':'var(--border-soft)';
return <div ref={wrap} style={{position:'relative'}}>
<button onClick={()=>setOpen(o=>!o)} aria-label="Menu" style={{width:44,height:44,display:'grid',placeItems:'center',background:'transparent',border:'1px solid var(--border-soft)',borderRadius:'var(--radius-action)',cursor:'pointer',color:'var(--text-body)'}}>
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">{open?<path d="M6 6l12 12M18 6L6 18"/>:<React.Fragment><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></React.Fragment>}</svg>
</button>
{open&&<div style={{position:'absolute',right:0,top:'calc(100% + 10px)',zIndex:61,minWidth:220,background:panelBg,border:'1px solid '+panelLine,borderRadius:'var(--radius-action)',boxShadow:'var(--shadow-card-hover)',padding:'var(--space-2) var(--space-4) var(--space-3)',display:'grid',gap:0}}>
{items.map(([x,href],i)=><a key={x} href={href} onClick={()=>setOpen(false)} style={{fontFamily:'var(--font-display)',fontSize:20,color:panelText,textDecoration:'none',padding:'11px 0',borderTop:i===0?'none':'1px solid '+panelLine}}>{x}</a>)}
</div>}
</div>;}

function NavLink({label,href}){const [h,setH]=React.useState(false);
return <a href={href} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{position:'relative',textDecoration:'none',color:h?'var(--action)':'var(--text-body)',whiteSpace:'nowrap',display:'inline-block',transform:h?'scale(1.06)':'scale(1)',transition:'transform .22s ease,color .18s ease'}}>{label}
<span style={{position:'absolute',left:0,right:0,bottom:-4,height:1,background:'var(--action)',transform:h?'scaleX(1)':'scaleX(0)',transformOrigin:'center',transition:'transform .22s ease'}}></span></a>;}

/** base: '' op de homepagina, 'index.html' elders. reveal: pas tonen na de hero. */
function SiteNav({base='',reveal=false,home='#top'}){
const mob=useIsMobile();const compact=useCompactNav();const items=navItems(base);
const [show,setShow]=React.useState(!reveal);
React.useEffect(()=>{if(!reveal)return;const on=()=>setShow(window.scrollY>window.innerHeight*0.7);on();window.addEventListener('scroll',on);return()=>window.removeEventListener('scroll',on);},[reveal]);
return <header style={{position:'fixed',top:0,left:0,right:0,zIndex:30,background:'var(--surface-page)',borderBottom:'1px solid var(--border-soft)',transform:show?'translateY(0)':'translateY(-100%)',opacity:show?1:0,transition:'transform .25s ease,opacity .25s ease'}}>
<Wrap style={{display:'flex',alignItems:'center',justifyContent:'space-between',height:mob?60:76,gap:'var(--space-3)'}}>
<LogoLink mob={mob} home={home}/>
<nav style={{display:'flex',alignItems:'center',flexShrink:0,gap:compact?'var(--space-3)':'var(--space-4)',fontSize:16,fontWeight:500}}>
{!compact&&items.map(([x,href])=><NavLink key={x} label={x} href={href}/>)}
<BestelKnop size="sm" align="right"/>
{compact&&<BurgerMenu items={items}/>}
</nav></Wrap></header>;}

window.T2GNav={SiteNav,BestelKnop,PhoneIcon,BurgerMenu,LogoLink,navItems,useIsMobile};
})();
