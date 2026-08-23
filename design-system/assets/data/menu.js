// Officiële menudata Tajine2Go (bron: eigenaar, aug 2026). Prijzen M/L of vast.
const menu = {
  tajines: {label:{nl:'Tajines',fr:'Tajines',en:'Tagines'},sizes:['M','L'],items:[
    {nl:'Tajine Royal (Runds)',fr:'Tajine Royale (bœuf)',en:'Tajine Royal (beef)',M:'€ 17',L:'€ 22'},
    {nl:'Tajine Kefta',fr:'Tajine Kefta',en:'Kefta tagine',M:'€ 13',L:'€ 18'},
    {nl:'Tajine Kip en groenten',fr:'Tajine Poulet et légumes',en:'Chicken & vegetable tagine',M:'€ 15',L:'€ 20'},
    {nl:'Tajine Veggie',fr:'Tajine Végé',en:'Veggie tagine',M:'€ 13',L:'€ 18'},
    {nl:'Tajine Kip met citroen en olijven',fr:'Tajine Poulet au citron et olives',en:'Chicken tagine with lemon & olives',M:'€ 15',L:'€ 20'}]},
  couscous: {label:{nl:'Couscous',fr:'Couscous',en:'Couscous'},sizes:['M','L'],items:[
    {nl:'Couscous Kip Merguez',fr:'Couscous Poulet Merguez',en:'Chicken & merguez couscous',M:'€ 17',L:'€ 22'},
    {nl:'Couscous Kip',fr:'Couscous Poulet',en:'Chicken couscous',M:'€ 15',L:'€ 20'},
    {nl:'Couscous Runds',fr:'Couscous Bœuf',en:'Beef couscous',M:'€ 17',L:'€ 22'},
    {nl:'Couscous Veggie',fr:'Couscous Végé',en:'Veggie couscous',M:'€ 13',L:'€ 18'}]},
  stoofpotjes: {label:{nl:'Stoofpotjes',fr:'Mijotés',en:'Stews'},sizes:['M'],items:[
    {nl:'Lamsstoofpotje',fr:"Mijoté d'agneau",en:'Lamb stew',M:'€ 23'}]},
  bstilla: {label:{nl:'Bstilla en soep',fr:'Bstilla et soupe',en:'Bstilla & soup'},sizes:[],items:[
    {nl:'Bstilla Kip',fr:'Bstilla Poulet',en:'Chicken bstilla',prijs:'€ 9'},
    {nl:'Bstilla Vis',fr:'Bstilla Poisson',en:'Fish bstilla',prijs:'€ 12'},
    {nl:'Bstilla Groenten',fr:'Bstilla Légumes',en:'Vegetable bstilla',prijs:'€ 9'},
    {nl:'Harira',fr:'Harira',en:'Harira',prijs:'€ 5'}]},
  dranken: {label:{nl:'Dranken',fr:'Boissons',en:'Drinks'},sizes:[],items:[
    {nl:'Thee',fr:'Thé',en:'Mint tea',prijs:'€ 2,5'},
    {nl:'Koffie',fr:'Café',en:'Coffee',prijs:'€ 3'},
    {nl:'Frisdranken',fr:'Boissons fraîches',en:'Soft drinks',prijs:'€ 2,5'}]},
  zoet: {label:{nl:'Zoet',fr:'Douceurs',en:'Sweet'},sizes:[],items:[
    {nl:'Thee + koekjes',fr:'Thé + biscuits',en:'Tea + cookies',prijs:'€ 5,5'},
    {nl:'Koekje pack',fr:'Pack de biscuits',en:'Cookie pack',prijs:'€ 6'}]}
};
if(typeof window!=='undefined')window.tajine2goMenu=menu;
