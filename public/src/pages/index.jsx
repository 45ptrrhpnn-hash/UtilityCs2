import { useEffect, useState } from 'react';
import LineupCard from '../components/LineupCard';

export default function Home() {
  const [lineups, setLineups] = useState([]);

  useEffect(()=>{
    fetch('/data/lineups.json').then(r=>r.json()).then(setLineups).catch(()=>{})
  },[]);

  return (
    <div className="min-h-screen p-4 max-w-5xl mx-auto">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">UtilityCS2</h1>
        <div className="text-sm text-textMuted">Dark blue + orange • Pros atuais (HLTV)</div>
      </header>

      <main className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {lineups.length===0 && <div className="col-span-full text-center text-textMuted">Sem dados. Executa o scraper ou substitui data/lineups.json.</div>}
        {lineups.map(l=> <LineupCard key={l.id} item={l} />)}
      </main>
    </div>
  )
}
