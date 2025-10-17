"""Scraper HLTV - utility lineups & stats (exemplo)
Este script faz scraping de páginas de HLTV para recolher info de utilitários usados por players ativos.
ATENÇÃO: HLTV não tem API pública oficial. Usa este script com responsabilidade e respeita termos de uso.
Requisitos: requests, beautifulsoup4
"""
import requests, json, time, re
from bs4 import BeautifulSoup
from pathlib import Path

BASE = 'https://www.hltv.org'
OUT = Path('../data/lineups.json')

# Lista de players a consultar (exemplo, atualiza conforme quiseres)
PLAYERS = [
    ('s1mple','1058'),
    ('NiKo','7998'),
    ('ropz','9316'),
    ('m0NESY','10939'),
    ('ZywOo','8870')
]

def fetch_player_stats(player_id):
    url = f"https://www.hltv.org/stats/players?startDate=all&matchType=All&player={player_id}"
    r = requests.get(url, headers={'User-Agent':'utilitycs2-bot/1.0'})
    r.raise_for_status()
    return r.text

def parse_and_extract(html, player_name):
    soup = BeautifulSoup(html, 'html.parser')
    results = []
    # Implementa aqui selectors reais conforme a estrutura da HLTV
    results.append({
        'id': f'{player_name}-example-1',
        'player': player_name,
        'team': 'Unknown',
        'map': 'Mirage',
        'type': 'flash',
        'description': f'Exemplo de lineup extraída para {player_name}',
        'video': '/exemplo-videos/placeholder.mp4',
        'commands': 'sv_cheats 1\nmp_roundtime_defuse 60'
    })
    return results

def main():
    all_lineups = []
    for name, pid in PLAYERS:
        try:
            html = fetch_player_stats(pid)
            lineups = parse_and_extract(html, name)
            all_lineups.extend(lineups)
            time.sleep(1.2)
        except Exception as e:
            print('erro', e)
    OUT.write_text(json.dumps(all_lineups, indent=2))
    print('Guardado', OUT)

if __name__ == '__main__':
    main()
