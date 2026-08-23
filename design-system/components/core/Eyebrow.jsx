import React from 'react';
export function Eyebrow({children,onDark=false}){
  return React.createElement('div',{style:{fontFamily:'var(--font-body)',fontWeight:600,fontSize:13,letterSpacing:'.18em',textTransform:'uppercase',color:onDark?'var(--line-on-dark)':'var(--action)'}},children);
}