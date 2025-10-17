import React from 'react';

export default function LineupCard({ item, favorites, setFavorites }) {
  function toggle() {
    setFavorites(prev => prev.includes(item.id) ? prev.filter(x=>x!==item.id) : [item.id,...prev]);
    localStorage.setItem('ut:favs', JSON.stringify(favorites));
  }
  function copyCommands() {
    navigator.clipboard.writeText(item.commands).then(()=>alert('Comandos copiados!'));
  }
  return (
    <article className="bg-cardGrey rounded-lg overflow-hidden border">
      <div className="aspect-video bg-black">
        <video src={item.video} muted loop playsInline onMouseEnter={e=>e.currentTarget.play()} onMouseLeave={e=>{e.currentTarget.pause(); e.currentTarget.currentTime=0}} className="w-full h-full object-cover"/>
      </div>
      <div className="p-3">
        <h3 className="font-semibold">{item.map} • {item.type.toUpperCase()}</h3>
        <p className="text-sm text-textMuted">{item.description}</p>
        <div className="mt-2 flex gap-2">
          <button className="flex-1 rounded-md py-2 border" onClick={copyCommands}>Copiar comandos</button>
          <button className="px-3 py-2 rounded-md bg-accentOrange text-black" onClick={toggle}>{favorites.includes(item.id)?'♥':'☆'}</button>
        </div>
      </div>
    </article>
  )
}
