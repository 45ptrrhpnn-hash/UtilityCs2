export default function LineupCard({ item }) {
  return (
    <article className="bg-cardGrey rounded-lg overflow-hidden border">
      <div className="aspect-video bg-black">
        <video src={item.video || '/exemplo-videos/placeholder.mp4'} muted loop playsInline className="w-full h-full object-cover" />
      </div>
      <div className="p-3">
        <h3 className="font-semibold">{item.map} • {item.type.toUpperCase()}</h3>
        <p className="text-sm text-textMuted">{item.description}</p>
        <div className="mt-2 text-xs text-textMuted">{item.player} — {item.team}</div>
        <div className="mt-3 flex gap-2">
          <button className="flex-1 rounded-md py-2 border" onClick={()=>navigator.clipboard.writeText(item.commands||'')}>Copiar comandos</button>
          <a className="px-3 py-2 rounded-md bg-accentOrange text-black" href={item.video||'#'}>Ver</a>
        </div>
      </div>
    </article>
  )
}
