// main.js

const WHATSAPP_NUMBER = '224612908366';
const GROUP_LINK = 'https://chat.whatsapp.com/KH0VmnftjfSIvFqtdBASGe?mode=gi_t';

// Produits
const products = [
  { name:'Bot WhatsApp complet', price:25000, category:'Bots', free:false, desc:'Bot complet, prêt à utiliser, pour automatiser et booster ton activité.', prompt:'futuristic whatsapp bot neon interface premium' },
  { name:'Telegram premium', price:10000, category:'Réseaux', free:false, desc:'Accès premium pour Telegram avec style et utilité digitale.', prompt:'telegram premium cyberpunk glowing card' },
  { name:'API_KEY YOUTUBE', price:6000, category:'API', free:false, desc:'Clé API YouTube pour projets, outils et automatisations.', prompt:'youtube api key futuristic data dashboard' },
  { name:'50 APIS POUR BOT', price:35000, category:'API', free:false, desc:'Pack complet pour développer un bot plus puissant et polyvalent.', prompt:'many apis for bot futuristic server room' },
  { name:'50 PROMPT CHATGPT EN PDF', price:10000, category:'IA', free:false, desc:'Pack PDF de prompts pour accélérer la création de contenu et d’idées.', prompt:'chatgpt prompt book pdf cyber aesthetic' },
  { name:'TIKTOK MONETISATION', price:8000, category:'Formation', free:false, desc:'Méthode et accompagnement pour mieux structurer la monétisation TikTok.', prompt:'tiktok monetization futuristic analytics' },
  { name:'FORMATION CREATION DE BOT', price:30000, category:'Formation', free:false, desc:'Formation pour comprendre et construire tes propres bots.', prompt:'learning to build bots futuristic classroom' },
  { name:'REJOINDRE LE GROUPE', price:0, category:'Gratuit', free:true, desc:'Accès au groupe WhatsApp pour suivre les nouveautés.', prompt:'whatsapp group futuristic community' },
  { name:'5 PROMPT GPT', price:0, category:'Gratuit', free:true, desc:'Petit pack gratuit pour découvrir des idées de prompts.', prompt:'five prompts gpt free futuristic cards' },
  { name:'NETFLIX GRATUIT', price:12000, category:'Divertissement', free:false, desc:'Offre présentée dans la boutique, avec prise de contact pour détails.', prompt:'streaming service neon cinematic card' }
];

const categories = ['Tous', ...new Set(products.map(p => p.category))];
let cart = [];
let activeCategory = 'Tous';

// Helpers
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const toast = msg => {
  const t = $('#toast');
  if(!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => t.classList.remove('show'), 1800);
};
const money = n => `${Number(n).toLocaleString('fr-FR')} FG`;
const whatsappMessage = text => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

// Clock
function updateClock(){
  const d = new Date();
  const el = $('#clock');
  if(el) el.textContent = d.toLocaleString('fr-FR', { weekday:'short', year:'numeric', month:'short', day:'2-digit', hour:'2-digit', minute:'2-digit', second:'2-digit' });
}
updateClock();
setInterval(updateClock, 1000);
const yearEl = $('#year');
if(yearEl) yearEl.textContent = new Date().getFullYear();

// Rendu des produits
function productCard(p){
  return `
<article class="card" data-name="${p.name.toLowerCase()}" data-category="${p.category.toLowerCase()}">
<img loading="lazy" src="https://image.pollinations.ai/prompt/${encodeURIComponent(p.prompt)}" alt="${p.name}">
<div class="meta">
<span class="tag">${p.category}${p.free ? ' • Gratuit' : ''}</span>
<h4>${p.name}</h4>
<p class="desc">${p.desc}</p>
<div class="price-row">
<div class="price">${p.price === 0 ? 'GRATUIT 🎉' : money(p.price)}</div>
<div class="mini-note">Disponible maintenant</div>
</div>
<div class="actions">
<button class="btn buy small" data-buy="${p.name}">Infos WhatsApp</button>
<button class="btn small" data-cart="${p.name}">Ajouter au panier</button>
</div>
</div>
</article>`;
}

function renderProducts(){
  const queryEl = $('#productSearch');
  const query = queryEl ? queryEl.value.trim().toLowerCase() : '';
  const grid = $('#productGrid');
  if(!grid) return;
  const filtered = products.filter(p => {
    const catOk = activeCategory === 'Tous' || p.category === activeCategory;
    const queryOk = !query || [p.name,p.category,p.desc].join(' ').toLowerCase().includes(query);
    return catOk && queryOk;
  });
  grid.innerHTML = filtered.map(productCard).join('') || '<div class="panel">Aucun produit trouvé.</div>';
  $$('#productGrid .btn.buy').forEach(btn => btn.onclick = () => openWhatsApp(btn.dataset.buy));
  $$('#productGrid .btn[data-cart]').forEach(btn => btn.onclick = () => addToCart(btn.dataset.cart));
}

// Panier
function addToCart(productName){
  const p = products.find(x=>x.name===productName);
  if(!p) return;
  const existing = cart.find(x=>x.name===p.name);
  if(existing) existing.qty += 1;
  else cart.push({...p, qty:1});
  renderCart();
  toast(`${p.name} ajouté au panier`);
}

function removeFromCart(productName){
  cart = cart.filter(x=>x.name!==productName);
  renderCart();
  toast('Produit retiré');
}

function clearCart(){
  cart = [];
  renderCart();
  toast('Panier vidé');
}

function renderCart(){
  const list = $('#cartList');
  const countEl = $('#cartCount');
  const totalEl = $('#cartTotal');
  const count = cart.reduce((a,b)=>a+b.qty,0);
  const total = cart.reduce((a,b)=>a+(b.price*b.qty),0);
  if(countEl) countEl.textContent = count;
  if(totalEl) totalEl.textContent = money(total);
  if(!list) return;
  if(!cart.length){
    list.innerHTML = '<div class="panel" style="padding:14px;margin:0">Ton panier est vide.</div>';
    $('#cartSummary').textContent = 'Aucun article ajouté.';
    return;
  }
  list.innerHTML = cart.map(item=>`
<div class="cart-item">
<div><b>${item.name}</b><br><small>${item.qty} × ${item.price ===0?'GRATUIT':money(item.price)}</small></div>
<button class="btn small danger" data-remove="${item.name}">Supprimer</button>
</div>`).join('');
  $$('[data-remove]').forEach(btn=>btn.onclick=()=>removeFromCart(btn.dataset.remove));
}

function checkoutWhatsApp(){
  if(!cart.length){ toast('Le panier est vide'); return; }
  const total = cart.reduce((a,b)=>a+b.price*b.qty,0);
  const details = cart.map(i=>`- ${i.name} x${i.qty} (${i.price===0?'GRATUIT':money(i.price)})`).join('\n');
  const message = `Bonjour, je veux commander :\n${details}\n\nTotal : ${money(total)}\n\nJe veux plus d'informations sur les produits.`;
  window.open(whatsappMessage(message),'_blank','noopener');
  toast('Commande envoyée vers WhatsApp');
}

// IA Photo
const randomPrompts = ['robot cyberpunk premium sur fond néon','boutique futuriste noire et bleue ultra détaillée','hacker élégant dans une salle de serveurs lumineuse','interface IA moderne avec hologrammes et lumières vertes','pack produit digital premium style science-fiction'];

function generateImage(){
  const promptEl = $('#prompt');
  if(!promptEl) return;
  const prompt = promptEl.value.trim();
  if(!prompt){ toast('Écris un texte pour générer l’image'); return; }
  const img = $('#generatedImage');
  if(img) img.src=`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
  toast('Image en cours de génération');
}

function setRandomPrompt(){
  const promptEl = $('#prompt');
  if(!promptEl) return;
  promptEl.value = randomPrompts[Math.floor(Math.random()*randomPrompts.length)];
}

// Support
const supportEl = $('#supportWhatsApp');
if(supportEl) supportEl.href = whatsappMessage('Bonjour, j’ai besoin d’aide sur un produit de NOIR ACHATS.');
const paymentEl = $('#paymentWhatsApp');
if(paymentEl) paymentEl.href = whatsappMessage('Bonjour, je viens de faire le paiement Orange Money et je souhaite confirmer ma commande.');

// Init
renderProducts();
renderCart();
setRandomPrompt();
