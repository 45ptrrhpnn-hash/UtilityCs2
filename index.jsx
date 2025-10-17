import { useState, useMemo } from 'react';
import LineupCard from '../components/LineupCard';
import FilterBar from '../components/FilterBar';
import Favorites from '../components/Favorites';

const SAMPLE = [
  {
    id: 'mirage-a-s1mple',
    map: 'Mirage',
    type: 'flash',
    player: 's1mple',
    team: 'Natus Vincere',
    side: 'T',
    description: 'Flash rápida para A default (rampa).',
    video: '/exemplo-videos/flash_mirage_s1mple.mp4',
    commands: 'sv_cheats 1\nmp_roundtime_defuse 60\n// jumpthrow'
  },
  {
    id: 'dust2-mid-niko',
    map: 'Dust2',
    type: 'smoke',
    player: 'NiKo',
    team: 'G2',
    side: 'T',
    description: 'Smoke para CT spawn desde tunnels.',
    video: '/exemplo-videos/smoke_dust2_niko.mp4',
    commands: 'sv_cheats 1\nmp_roundtime_defuse 60\n// jumpthrow'
  },
  {
    id: 'inferno-b-ropz',
    map: 'Inferno',
    type: 'molotov',
    player: 'ropz',
    team: 'Vitality',
    side: 'T',
    description: 'Molotov para banheira em B (forces rot).',
    video: '/exemplo-videos/molotov_inferno_ropz.mp4',
    commands: 'mp_roundtime_defuse 60\nmp_buy_anywhere 1'
  }
];

export default function Home() {
  const [query, setQuery] = useState('');
  const [mapFilter, setMapFilter] = useState('All');
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ut:favs')||'[]') } catch { return [] }
  });

  const maps = useMemo(()=>['All', ...new Set(SAMPLE.map(s=>s.map))],[]);
  const filtered = useMemo(()=>SAMPLE.filter(s=>{
    if(mapFilter!=='All' && s.map!==mapFilter) return false;
    if(!query) return true;
    const q = query.toLowerCase();
    return s.player.toLowerCase().includes(q) || s.map.toLowerCase().includes(q) || s.description.toLowerCase().includes(q);
  }),[query,mapFilter]);

  return (
    <div className="min-h-screen bg-bgDark text-textLight p-4">
      <header className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold">UtilityCS2</h1>
        <p className="text-textMuted">Lineups de pros atuais — Dark mode azul escuro + laranja.</p>
        <FilterBar maps={maps} mapFilter={mapFilter} setMapFilter={setMapFilter} query={query} setQuery={setQuery}/>
      </header>

      <main className="max-w-4xl mx-auto mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map(item => <LineupCard key={item.id} item={item} favorites={favorites} setFavorites={setFavorites} />)}
      </main>

      <aside className="max-w-4xl mx-auto mt-6">
        <Favorites favorites={favorites} sample={SAMPLE} setFavorites={setFavorites}/>
      </aside>
    </div>
  )
}
