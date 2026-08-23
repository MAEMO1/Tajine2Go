import React from 'react';
export function DishCard({name,description,price,image,badge}){
  const [hover,setHover]=React.useState(false);
  return React.createElement('div',{onMouseEnter:()=>setHover(true),onMouseLeave:()=>setHover(false),style:{background:'#fff',borderRadius:'var(--radius-card)',boxShadow:hover?'var(--shadow-card-hover)':'var(--shadow-card)',overflow:'hidden',transition:'box-shadow .2s ease',fontFamily:'var(--font-body)'}},
    React.createElement('div',{style:{height:150,background:'var(--t2g-merkoranje)',position:'relative'}},
      image?React.createElement('img',{src:image,alt:name,style:{width:'100%',height:'100%',objectFit:'cover',display:'block'}}):React.createElement('div',{style:{position:'absolute',inset:0,display:'grid',placeItems:'center',color:'var(--t2g-papier)',fontSize:13,opacity:.85}},'foto volgt'),
      badge?React.createElement('span',{style:{position:'absolute',top:10,left:10,background:'var(--t2g-inkt)',color:'var(--t2g-papier)',fontSize:12,fontWeight:600,padding:'4px 12px',borderRadius:999}},badge):null),
    React.createElement('div',{style:{padding:'14px 16px 16px'}},
      React.createElement('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'baseline',gap:12}},
        React.createElement('span',{style:{fontFamily:'var(--font-display)',fontWeight:600,fontSize:22,color:'var(--text-heading)'}},name),
        React.createElement('span',{style:{fontWeight:700,fontSize:17,color:'var(--text-price)',whiteSpace:'nowrap'}},price)),
      description?React.createElement('p',{style:{margin:'6px 0 0',fontSize:14,lineHeight:1.5,color:'var(--text-soft)'}},description):null));
}