let Button,Eyebrow,ContactRow,SectionDark;
const A='../../assets';
const Wrap=({children,style})=><div style={{maxWidth:1120,margin:'0 auto',padding:'0 24px',...style}}>{children}</div>;
function useIsMobile(){const [m,setM]=React.useState(typeof window!=='undefined'&&window.innerWidth<768);
React.useEffect(()=>{const on=()=>setM(window.innerWidth<768);window.addEventListener('resize',on);return()=>window.removeEventListener('resize',on);},[]);
return m;}
const label={fontFamily:'var(--font-body)',fontSize:14,fontWeight:600,color:'var(--text-soft)',display:'block',marginBottom:'var(--space-1)'};
const field={width:'100%',fontFamily:'var(--font-body)',fontSize:16,color:'var(--text-body)',background:'#fff',border:'1px solid var(--border-soft)',borderRadius:'var(--radius-action)',padding:'12px 14px'};

function Formulier(){const mob=useIsMobile();const [sent,setSent]=React.useState(false);
const sub={fontFamily:'var(--font-body)',fontWeight:600,fontSize:12,letterSpacing:'.18em',textTransform:'uppercase',color:'var(--action)',marginTop:'var(--space-3)'};
return <form onSubmit={e=>{e.preventDefault();setSent(true);}} style={{display:'grid',gap:'var(--space-4)'}}>
<div style={sub}>Persoonlijke gegevens</div>
<div style={{display:'grid',gridTemplateColumns:mob?'1fr':'1fr 1fr',gap:'var(--space-4)'}}>
<div><label style={label} htmlFor="voornaam">Voornaam</label><input id="voornaam" style={field} required/></div>
<div><label style={label} htmlFor="naam">Naam</label><input id="naam" style={field} required/></div>
<div><label style={label} htmlFor="mail">E-mail</label><input id="mail" type="email" style={field} required/></div>
<div><label style={label} htmlFor="tel">Telefoon</label><input id="tel" style={field}/></div>
</div>
<div style={sub}>Evenement</div>
<div style={{display:'grid',gridTemplateColumns:mob?'1fr':'1fr 1fr 1fr',gap:'var(--space-4)'}}>
<div><label style={label} htmlFor="soort">Type</label>
<select id="soort" style={field}><option>Evenementen</option><option>Recepties</option><option>Feesten</option><option>Andere</option></select></div>
<div><label style={label} htmlFor="datum">Datum</label><input id="datum" type="date" style={field}/></div>
<div><label style={label} htmlFor="gasten">Aantal gasten</label><input id="gasten" type="number" min="1" style={field} placeholder="bv. 25"/></div>
</div>
<div style={sub}>Persoonlijk bericht</div>
<div><textarea id="bericht" rows="5" style={{...field,resize:'vertical'}} placeholder="Vertel ons kort waarmee we je kunnen helpen." required></textarea></div>
<div style={{display:'flex',alignItems:'center',gap:'var(--space-4)',flexWrap:'wrap'}}>
<Button>Verstuur bericht</Button>
{sent&&<span style={{fontSize:15,color:'var(--text-soft)'}}>Bedankt, we nemen snel contact op.</span>}
</div>
</form>;}

function Contact(){const mob=useIsMobile();
return <div>
<window.T2GNav.SiteNav base="index.html" home="index.html"/>
<div style={{height:useIsMobile()?60:76}}></div>
<Wrap style={{padding:'var(--space-8) 24px'}}>
<Eyebrow>Contact</Eyebrow>
<h1 style={{fontFamily:'var(--font-display)',fontWeight:500,fontSize:'var(--size-h1)',lineHeight:1.05,margin:'var(--space-2) 0 0'}}>Laat ons weten wat je nodig hebt</h1>
<p style={{fontSize:'var(--size-body)',lineHeight:1.6,maxWidth:560,marginTop:'var(--space-4)'}}>Een vraag over het menu, een bestelling voor meerdere personen of een cateringaanvraag: bel ons of vul het formulier in. We antwoorden zo snel we kunnen.</p>
<div style={{display:'grid',gridTemplateColumns:mob?'1fr':'1.2fr .8fr',gap:'var(--space-7)',marginTop:'var(--space-7)',alignItems:'start'}}>
<Formulier/>
<div style={{display:'grid',gap:'var(--space-3)'}}>
<img src={A+'/elements/tajine2go-frame-pattern.png'} alt="" style={{width:'min(200px,50%)',display:'block',marginBottom:'var(--space-3)'}}/>
<ContactRow icon="pin">Brusselsesteenweg 455, 9050 Gentbrugge</ContactRow>
<ContactRow icon="phone">Tel. 09 377 32 51 · 0451 01 61 44</ContactRow>
<ContactRow icon="mail">info@tajine2go.be</ContactRow>
<ContactRow icon="instagram">@tajine2go.gent</ContactRow>
<ContactRow icon="facebook">Tajine2Go</ContactRow>
</div>
</div>
</Wrap>
<SectionDark style={{padding:mob?'var(--space-8) 16px':'var(--space-8) 24px',marginTop:'var(--space-8)'}}><Wrap style={{display:'grid',gap:'var(--space-4)',justifyItems:'start'}}>
<Eyebrow onDark>Catering</Eyebrow>
<h2 style={{fontFamily:'var(--font-display)',fontWeight:500,fontSize:'var(--size-h2)',margin:0,color:'var(--text-on-dark)'}}>Bestellen voor een groep?</h2>
<p style={{fontSize:'var(--size-body)',lineHeight:1.6,color:'var(--text-on-dark)',opacity:.9,maxWidth:560}}>Vertel ons de gelegenheid, het aantal personen en de datum. Wij stellen een menu op maat voor.</p>
<Button variant="onDark" href="index.html#catering">Meer over catering</Button>
</Wrap></SectionDark>
<footer style={{padding:'var(--space-8) 24px',background:'var(--surface-dark)'}}><Wrap style={{display:'flex',justifyContent:'center'}}>
<img src={A+'/logo/tajine2go-wordmark-dark.svg'} alt="Tajine2Go" style={{width:'min(1100px,92vw)',display:'block'}}/>
</Wrap></footer>
</div>;}
(function mount(tries){
  const ns=window.Tajine2GoDesignSystem_2aba92;
  if(!ns||!window.T2GNav){ if(tries<100) setTimeout(()=>mount(tries+1),100); return; }
  ({Button,Eyebrow,ContactRow,SectionDark}=ns);
  const el=document.getElementById('root');
  if(!window.__t2gRoot){window.__t2gRoot=ReactDOM.createRoot(el);}
  window.__t2gRoot.render(<Contact/>);
})(0);
