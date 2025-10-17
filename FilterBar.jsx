export default function FilterBar({ maps, mapFilter, setMapFilter, query, setQuery }) {
  return (
    <div className="mt-4 flex gap-2 items-center">
      <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Procurar jogador, mapa, descrição..." className="flex-1 p-2 rounded-md bg-cardGrey border"/>
      <select value={mapFilter} onChange={e=>setMapFilter(e.target.value)} className="p-2 rounded-md bg-cardGrey border">
        {maps.map(m=> <option key={m} value={m}>{m}</option>)}
      </select>
    </div>
  )
}
