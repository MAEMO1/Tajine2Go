import React from 'react';
import {Button} from './Button.jsx';
export function OrderBar({label='Bestel nu',href='#',note='Afhalen in Gentbrugge'}){
  return React.createElement('div',{style:{position:'sticky',bottom:0,left:0,right:0,background:'var(--t2g-papier)',borderTop:'1px solid var(--border-soft)',padding:'10px 16px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:16,fontFamily:'var(--font-body)'}},
    React.createElement('span',{style:{fontSize:14,color:'var(--text-soft)'}},note),
    React.createElement(Button,{href,size:'md'},label));
}