let Button,Eyebrow,Ornament,OrderBar;
const A2='../../assets';
function MenuSection({sec}){
  const hasSizes=sec.sizes.length>0;
  return <section style={{marginTop:48}}>
    <div style={{display:'flex',alignItems:'baseline',justifyContent:'space-between',borderBottom:'2px solid var(--border-soft)',paddingBottom:10}}>
      <h2 style={{fontFamily:'var(--font-display)',fontWeight:500,fontSize:34,margin:0}}>{sec.label.nl}</h2>
      {hasSizes&&<span style={{fontSize:14,color:'var(--text-soft)',fontWeight:600,letterSpacing:'.06em'}}>{sec.sizes.length>1?'M · L':'M'}</span>}
    </div>
    <div style={{display:'grid',gap:0}}>
      {sec.items.map(it=><div key={it.nl} style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',gap:16,padding:'14px 0',borderBottom:'1px solid var(--border-soft)'}}>
        <div><div style={{fontFamily:'var(--font-display)',fontWeight:600,fontSize:22}}>{it.nl}</div><div style={{fontSize:13,color:'var(--text-soft)',marginTop:2}}>{it.fr} · {it.en}</div></div>
        <div style={{fontWeight:700,fontSize:17,whiteSpace:'nowrap',color:'var(--text-price)'}}>{it.prijs||(it.L?it.M+' / '+it.L:it.M)}</div>
      </div>)}
    </div>
  </section>;
}
function MenuPage(){
  const m=window.tajine2goMenu;
  return <div>
    <header style={{position:'sticky',top:0,zIndex:10,background:'var(--surface-page)',borderBottom:'1px solid var(--border-soft)'}}>
      <div style={{maxWidth:860,margin:'0 auto',padding:'0 24px',display:'flex',alignItems:'center',justifyContent:'space-between',height:76}}>
        <img src={A2+'/logo/tajine2go-horizontal-light.svg'} alt="Tajine2Go" style={{height:46}}/>
        <Button size="sm">Bestel nu</Button>
      </div></header>
    <div style={{maxWidth:860,margin:'0 auto',padding:'56px 24px 80px'}}>
      <div style={{textAlign:'center'}}>
        <Eyebrow>Ons menu</Eyebrow>
        <h1 style={{fontFamily:'var(--font-display)',fontWeight:500,fontSize:'var(--size-h1)',margin:'10px 0 0',lineHeight:1.05}}>Tajines, couscous en meer</h1>
        <p style={{fontSize:17,lineHeight:1.6,color:'var(--text-soft)',maxWidth:520,margin:'16px auto 0'}}>Alles wordt langzaam en met zorg bereid. Prijzen per portie, M of L waar aangegeven.</p>
        <div style={{marginTop:24}}><Ornament width={280} assetsBase={A2}/></div>
      </div>
      {Object.values(m).map(sec=><MenuSection key={sec.label.nl} sec={sec}/>)}
    </div>
    <OrderBar note="Afhalen in Gentbrugge" href="#"/>
  </div>;
}
(function mount(tries){
  const ns=window.Tajine2GoDesignSystem_2aba92;
  if(!ns||!window.tajine2goMenu){ if(tries<100) setTimeout(()=>mount(tries+1),100); return; }
  ({Button,Eyebrow,Ornament,OrderBar}=ns);
  ReactDOM.createRoot(document.getElementById('root')).render(<MenuPage/>);
})(0);
