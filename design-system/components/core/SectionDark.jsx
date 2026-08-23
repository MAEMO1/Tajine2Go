import React from 'react';
export function SectionDark({children,style}){
  return React.createElement('section',{style:{background:'var(--surface-dark)',color:'var(--text-on-dark)',padding:'64px 24px',...style}},children);
}