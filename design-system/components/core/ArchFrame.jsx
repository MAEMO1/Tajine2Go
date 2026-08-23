import React from 'react';
export function ArchFrame({children,width=280,assetsBase='../../assets'}){
  return React.createElement('div',{style:{position:'relative',width,aspectRatio:'2/3'}},
    React.createElement('img',{src:assetsBase+'/elements/tajine2go-frame.svg',alt:'',style:{position:'absolute',inset:0,width:'100%',height:'100%'}}),
    React.createElement('div',{style:{position:'absolute',inset:'16% 12%',display:'grid',placeItems:'center',textAlign:'center',overflow:'hidden'}},children));
}