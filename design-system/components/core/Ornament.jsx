import React from 'react';
export function Ornament({width=320,flip=false,assetsBase='../../assets'}){
  return React.createElement('img',{src:assetsBase+'/elements/tajine2go-ornament.svg',alt:'',style:{width,display:'block',margin:'0 auto',transform:flip?'scaleY(-1)':'none'}});
}