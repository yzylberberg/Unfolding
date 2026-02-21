# Paris Metro Socio-Economic Visualization

A Next.js application that visualizes socio-economic characteristics along Paris metro lines.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Add Your Data

Place your metro line CSV files in the `public/data/` directory:

```
public/data/
  rank_M1.csv
  rank_M2.csv
  rank_M3.csv
  ...
```

The CSV files should follow the same structure as your uploaded `rank_M1.csv`.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

## Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Vercel will auto-detect Next.js and deploy
4. Make sure your CSV files are in the `public/data/` directory before deploying

## Project Structure

```
paris-metro-viz/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page
│   └── globals.css         # Global styles
├── components/
│   ├── MetroLineSelector.tsx
│   ├── CharacteristicSelector.tsx
│   └── MetroChart.tsx
├── lib/
│   └── dataUtils.ts        # Data processing utilities
├── types/
│   └── metro.ts            # TypeScript types
├── public/
│   └── data/               # CSV data files (add your files here)
└── package.json
```

## Features Implemented

✅ Metro line selector with RATP colors
✅ Characteristic selector grouped by category
✅ Interactive Highcharts visualization
✅ Station markers on charts
✅ Paris average reference line
✅ Toggle between all points vs. stations only
✅ Responsive tooltips with station details

## Next Steps

To expand the app:
1. Add more metro lines (just add CSV files and update `availableLines` array)
2. Implement multi-line comparison view
3. Add map visualization
4. Add filters and search
5. Implement characteristic profiles per station

## Data Format

Your CSV should include these key columns:
- `line`: Metro line name (e.g., "METRO 1")
- `name_station`: Station name (empty for intermediate points)
- `cumul_distance`: Distance along line in km
- `rank_station`: Station number
- `rank_intermediate`: Intermediate point number
- All characteristic columns (density_*, hhshare_*, etc.)

## Technologies

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Highcharts** - Data visualization
- **PapaParse** - CSV parsing
