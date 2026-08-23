import React from 'react';
export function Button({children='Bestel nu',variant='primary',size='md',href,onClick,disabled,style:extra}){
  const pad=size==='lg'?'16px 28px':size==='sm'?'10px 18px':'14px 24px';
  const fs=size==='lg'?'17px':size==='sm'?'15px':'16px';
  const base={fontFamily:'var(--font-body)',fontWeight:700,fontSize:fs,padding:pad,whiteSpace:'nowrap',borderRadius:'var(--radius-action)',cursor:disabled?'default':'pointer',display:'inline-flex',alignItems:'center',justifyContent:'center',gap:'8px',textDecoration:'none',transition:'background .18s ease,color .18s ease,border-color .18s ease',border:'1px solid transparent',boxSizing:'border-box',opacity:disabled?.5:1};
  const styles={
    primary:{...base,background:'var(--action)',color:'var(--t2g-papier)'},
    secondary:{...base,background:'transparent',color:'var(--t2g-inkt)',borderColor:'var(--t2g-inkt)'},
    onDark:{...base,background:'var(--t2g-merkoranje)',color:'var(--t2g-papier)'},
    onDarkOutline:{...base,background:'transparent',color:'var(--t2g-papier)',borderColor:'var(--t2g-papier)'},
    ghost:{...base,background:'transparent',color:'var(--action)',padding:size==='sm'?'9px 6px':'13px 8px'}
  };
  const [hover,setHover]=React.useState(false);
  const s={...styles[variant]};
  if(hover&&!disabled){
    if(variant==='primary')s.background='var(--action-hover)';
    if(variant==='secondary'){s.background='var(--t2g-inkt)';s.color='var(--t2g-papier)';}
    if(variant==='onDark')s.background='var(--action)';
    if(variant==='onDarkOutline'){s.background='var(--t2g-papier)';s.color='var(--t2g-inkt)';}
    if(variant==='ghost')s.color='var(--action-hover)';
  }
  const Tag=href?'a':'button';
  return React.createElement(Tag,{href,onClick,disabled,style:{...s,minHeight:44,...extra},onMouseEnter:()=>setHover(true),onMouseLeave:()=>setHover(false)},children);
}