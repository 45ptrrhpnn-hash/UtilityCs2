
import React, { useEffect, useState, useRef } from 'react'

export default function App() {
  const [dataIndex, setDataIndex] = useState(null)
  const [selectedMap, setSelectedMap] = useState(null)
  const [utilityFilter, setUtilityFilter] = useState('all')
  const [showOnlyPro, setShowOnlyPro] = useState(true)
  const canvasRef = useRef(null)
  const imgRef = useRef(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [heatmapMode, setHeatmapMode] = useState(false)

  useEffect(() => {
    fetch('/data/index.json').then(r => r.json()).then(j => { setDataIndex(j); const first = Object.keys(j.maps||{})[0]; setSelectedMap(first) }).catch(e=>console.error(e))
    window.addEventListener('resize', draw)
    return ()=> window.removeEventListener('resize', draw)
  }, [])

  useEffect(()=> draw(), [dataIndex, selectedMap, utilityFilter, showOnlyPro, mapLoaded, heatmapMode])

  function getUtilities() {
    if (!dataIndex || !selectedMap) return []
    const arr = dataIndex.maps[selectedMap].utilities || []
    return arr.filter(u => (utilityFilter==='all' || u.utility_type.toLowerCase()===utilityFilter) && (!showOnlyPro || u.is_pro))
  }

  function aggregate() {
    const arr = getUtilities()
    const stats = {}
    for (const u of arr) {
      const key = `${u.utility_type}::${Math.round(u.x)}::${Math.round(u.y)}`
      stats[key] = stats[key] || { count:0, utility_type:u.utility_type, x:u.x, y:u.y, samples:[] }
      stats[key].count++
      stats[key].samples.push(u)
    }
    return Object.values(stats).sort((a,b)=>b.count-a.count)
  }

  function draw() {
    const canvas = canvasRef.current; const img = imgRef.current
    if (!canvas || !img || !img.complete) return
    const ctx = canvas.getContext('2d')
    const rect = img.getBoundingClientRect()
    canvas.width = rect.width; canvas.height = rect.height
    ctx.clearRect(0,0,canvas.width,canvas.height)
    if (heatmapMode) return drawHeatmap(ctx, canvas.width, canvas.height)
    // draw aggregated circles
    const stats = aggregate()
    const max = stats.length? Math.max(...stats.map(s=>s.count)):1
    for (const s of stats) {
      const cx = s.x/100 * canvas.width; const cy = s.y/100 * canvas.height
      const r = 6 + (s.count/max)*20
      ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2)
      ctx.lineWidth = 2 + (s.count/max)*6
      ctx.strokeStyle = strokeFor(s.utility_type)
      ctx.stroke()
      ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.font='12px Arial'; ctx.fillText(s.count, cx+r+4, cy+4)
    }
  }

  function drawHeatmap(ctx, w, h) {
    const pts = getUtilities()
    // create an offscreen accumulation
    const grid = new Array(w*h).fill(0)
    for (const p of pts) {
      const x = Math.round(p.x/100 * w); const y = Math.round(p.y/100 * h)
      const r = Math.max(8, Math.round((p.weight||1)*10))
      for (let dx=-r; dx<=r; dx++) for (let dy=-r; dy<=r; dy++) {
        const nx = x+dx, ny=y+dy
        if (nx>=0 && nx<w && ny>=0 && ny<h) {
          const d2 = dx*dx+dy*dy; if (d2<=r*r) grid[ny*w+nx] += Math.max(0, r-Math.sqrt(d2))
        }
      }
    }
    // normalize and paint
    const max = Math.max(...grid,1)
    const img = ctx.createImageData(w,h)
    for (let i=0;i<w*h;i++) {
      const v = Math.min(255, Math.round((grid[i]/max)*255))
      // simple red-yellow scale
      img.data[i*4+0] = Math.min(255, v*2)
      img.data[i*4+1] = Math.min(255, v)
      img.data[i*4+2] = Math.floor(v/2)
      img.data[i*4+3] = v>0? 180:0
    }
    ctx.putImageData(img,0,0)
  }

  function strokeFor(type) {
    const t = (type||'').toLowerCase()
    if (t.includes('smoke')) return 'rgba(40,40,40,0.95)'
    if (t.includes('flash')) return 'rgba(220,220,220,0.95)'
    if (t.includes('molotov')||t.includes('incen')) return 'rgba(180,90,30,0.95)'
    if (t.includes('he')||t.includes('grenade')) return 'rgba(120,20,20,0.95)'
    return 'rgba(100,100,100,0.9)'
  }

  function exportCSV() {
    const rows = getUtilities().map(u=>({
      match_id: u.match_id, map: selectedMap, type: u.utility_type, x: u.x, y: u.y, player: u.player||'', team: u.team||'', round: u.round||'', demo: u.demo||''
    }))
    const header = Object.keys(rows[0]||{})
    const csv = [header.join(',')].concat(rows.map(r=>header.map(h=>`"${(''+r[h]).replace(/"/g,'""')}"`).join(','))).join('\\n')
    const blob = new Blob([csv], {type: 'text/csv'})
    const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`utilities_${selectedMap||'map'}.csv`; a.click(); URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen p-6 bg-slate-50 text-slate-900">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">CS2 Pro Utilities — Mix Visual+Stats</h1>
        <div className="space-x-3">
          <button onClick={()=>setHeatmapMode(!heatmapMode)} className="px-3 py-1 border rounded">{heatmapMode? 'Mostrar pontos':'Mostrar heatmap'}</button>
          <button onClick={exportCSV} className="px-3 py-1 border rounded">Export CSV</button>
        </div>
      </header>
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <section className="lg:col-span-2 bg-white p-3 rounded shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <label>Mapa:</label>
              <select value={selectedMap||''} onChange={e=>{setSelectedMap(e.target.value); setMapLoaded(false)}} className="px-2 py-1 border rounded">
                {(dataIndex? Object.keys(dataIndex.maps||{}):[]).map(m=> <option key={m} value={m}>{m}</option>)}
              </select>
              <select value={utilityFilter} onChange={e=>setUtilityFilter(e.target.value)} className="px-2 py-1 border rounded">
                <option value="all">Todos</option><option value="smoke">Smoke</option><option value="flash">Flash</option>
                <option value="molotov">Molotov</option><option value="he">HE</option>
              </select>
              <label className="ml-2"><input type="checkbox" checked={showOnlyPro} onChange={e=>setShowOnlyPro(e.target.checked)}/> Jogos pro</label>
            </div>
            <div>{getUtilities().length} utilitários</div>
          </div>
          <div className="relative border rounded overflow-hidden">
            {selectedMap && dataIndex && (
              <>
                <img ref={imgRef} src={dataIndex.maps[selectedMap].image} alt={selectedMap} style={{width:'100%',display:'block'}} onLoad={()=>setMapLoaded(true)} />
                <canvas ref={canvasRef} onClick={(e)=>{
                  // get click position, find nearest sample and open demo link if available
                  const rect = e.target.getBoundingClientRect(); const x = (e.clientX-rect.left)/rect.width*100; const y=(e.clientY-rect.top)/rect.height*100
                  const near = getUtilities().find(u=> Math.hypot(u.x-x,u.y-y) < 3)
                  if (near && near.demo) window.open(near.demo, '_blank')
                }} style={{position:'absolute', left:0, top:0, pointerEvents:'auto'}} />
              </>
            )}
          </div>
        </section>

        <aside className="bg-white p-3 rounded shadow">
          <h2 className="font-semibold mb-2">Top spots</h2>
          <div className="space-y-2 max-h-[60vh] overflow-auto">
            {aggregate().map(s=> (
              <div key={`${s.utility_type}-${s.x}-${s.y}`} className="p-2 border rounded flex justify-between items-center">
                <div>
                  <div className="font-medium">{s.utility_type} • {s.count}x</div>
                  <div className="text-sm">{Math.round(s.x)}%, {Math.round(s.y)}%</div>
                </div>
                <div>
                  <button onClick={()=>{ /* simple pulse */ const c=canvasRef.current; if(!c) return; const ctx=c.getContext('2d'); const cx=s.x/100*c.width; const cy=s.y/100*c.height; let r=2; const id=setInterval(()=>{ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.strokeStyle='rgba(0,0,0,0.6)';ctx.lineWidth=2;ctx.stroke(); r+=3; if(r>30) clearInterval(id)},30)}} className="px-2 py-1 border rounded mr-2">Ver</button>
                  <button onClick={()=>{ /* focus */ window.alert('Abrir lista de demos com este ponto (não implementado no mock)') }} className="px-2 py-1 border rounded">Demos</button>
                </div>
              </div>
            ))}
            {aggregate().length===0 && <div className="text-sm text-slate-500">Nenhum utilitário.</div>}
          </div>
        </aside>
      </main>

      <footer className="mt-4 text-sm text-slate-600">
        Dados: CS2Lens + HLTV. Clique num ponto com demo associada para abrir a demo (se existir).
      </footer>
    </div>
  )
}
