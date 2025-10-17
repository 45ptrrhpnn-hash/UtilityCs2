# CS2 Pro Utility Site (scaffold)

This is a scaffolded Vite + React project with Tailwind CSS that visualizes CS2 utility usage from professional matches.
It includes:
- Map canvas with aggregated points
- Heatmap mode
- CSV export of filtered utilities
- Click-to-open demo links (if present in data)

How to run locally:
1. `npm install`
2. `npm run dev`
3. Put your data in `public/data/index.json` and images in `public/data/maps/` as described below.

Data format:
```
{
  "maps": {
    "Mirage": {
      "image": "/data/maps/mirage.png",
      "utilities": [
        {"match_id":"1234","is_pro":true,"utility_type":"smoke","x":47.5,"y":22.1,"player":"s1mple","team":"NAVI","round":12,"demo":"https://cslens.example/demo/1234"}
      ]
    }
  }
}
```

This bundle was auto-generated inside the environment and includes the provided `utilitycs2_full.zip` contents (if present) processed into `public/data/`.
