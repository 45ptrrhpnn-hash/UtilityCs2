export default function Favorites({ favorites, sample, setFavorites }) {
  function remove(id){ setFavorites(prev=>prev.filter(x=>x!==id)); localStorage.setItem('ut:favs', JSON.stringify(favorites)) }
  return (
    <div className="bg-cardGrey p-3 rounded-md">
      <h4 className="font-semibold">Favoritos</h4>
      <div className="mt-2 space-y-2 text-sm text-textMuted">
        {favorites.length===0 && <div>Não tens favoritos ainda — clica na estrela nos cards.</div>}
        {favorites.map(id=>{
          const it = sample.find(s=>s.id===id);
          if(!it) return null;
          return <div key={id} className="flex justify-between"><div>{it.map} • {it.type} — {it.player}</div><button onClick={()=>remove(id)} className="text-red-400 text-xs">Remover</button></div>
        })}
      </div>
    </div>
  )
}
