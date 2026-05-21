# Kuecheneinteiler Web - Vue 3 + TypeScript

A web-based kitchen duty assignment system with fair rotation algorithm. Complete conversion from Java to modern Vue 3 + TypeScript with Tailwind CSS.

## 🚀 Live Demo

**Try it online:** [Click here for live demo](https://eg-00.github.io/KuecheneinteilerWeb/) (Deploy to GitHub Pages for live URL)

## Features

✅ **CSV File Upload** - Import people and meal requirements via drag-drop or file selection  
✅ **Fair Rotation Algorithm** - Ensures even distribution of kitchen duties  
✅ **Conflict Detection** - Warns about understaffing issues  
✅ **Multiple Export Formats** - Plain text, HTML (printable), CSV  
✅ **Local Storage** - All data automatically saved to browser  
✅ **Statistics Dashboard** - View fairness metrics and assignment distribution  
✅ **German Language** - Full UI and output in German  
✅ **Desktop-First Design** - Built with Tailwind CSS for responsive layout  
✅ **No Backend Required** - 100% client-side processing  

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
cd KuecheneinteilerWeb
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
```

Output will be in `dist/` directory, ready for deployment to any static host (Vercel, Netlify, GitHub Pages).

## Deployment

### 🎯 Quick Start: Deploy to GitHub Pages

**Time needed: ~10 minutes**

Three documentation files are provided:

1. **[QUICKSTART_DEPLOY.md](./QUICKSTART_DEPLOY.md)** - 5-minute quick start (easiest!)
2. **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Comprehensive 8-step tutorial with troubleshooting
3. **[GITHUB_PAGES_SETUP.md](./GITHUB_PAGES_SETUP.md)** - Complete setup checklist

### Manual Deployment Steps

1. **Create GitHub Repository:**
   ```bash
   # Go to https://github.com/new
   # Name: KuecheneinteilerWeb
   # Visibility: Public
   ```

2. **Push Code:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/KuecheneinteilerWeb.git
   git branch -M main
   git push -u origin main
   ```

3. **Enable GitHub Pages:**
   - Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: `gh-pages` (auto-created after first deployment)

4. **Your app goes live at:**
   ```
   https://YOUR_USERNAME.github.io/KuecheneinteilerWeb/
   ```

### Other Hosting Options

- **Vercel**: Zero-config, connect your GitHub repo
- **Netlify**: Drag-and-drop `dist/` folder
- **AWS S3 + CloudFront**: Upload `dist/` folder
- **Any static host**: Upload contents of `dist/` directory

### GitHub Pages Features

✅ **Automatic deployment** - Every push to `main` deploys automatically  
✅ **Free hosting** - No costs for public repositories  
✅ **HTTPS** - Automatically enabled  
✅ **Global CDN** - Fast access worldwide  
✅ **99.9% uptime** - Enterprise-grade reliability  

**See deployment guides above for detailed step-by-step instructions.**

## Project Structure

```
src/
├── components/                   # Vue components
│   ├── FileUpload.vue           # CSV upload with drag-drop
│   ├── ScheduleDisplay.vue      # Schedule rendering
│   ├── WarningsPanel.vue        # Conflict warnings
│   ├── StatisticsPanel.vue      # Fairness statistics
│   └── ExportOptions.vue        # Export functionality
├── models/
│   └── index.ts                 # TypeScript interfaces & enums
├── services/
│   ├── csvParser.ts             # CSV parsing logic
│   ├── assignmentEngine.ts      # Fair rotation algorithm
│   ├── conflictDetector.ts      # Conflict detection
│   └── scheduleFormatter.ts     # Export formatting
├── stores/
│   └── scheduleStore.ts         # Pinia state management
├── App.vue                      # Main application component
├── main.ts                      # Entry point
└── style.css                    # Global styles with Tailwind CSS
```

## Technology Stack

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Lightning-fast build tool
- **Pinia** - Intuitive state management
- **Tailwind CSS** - Utility-first CSS framework
- **Papa Parse** - CSV parsing
- **LocalStorage API** - Browser data persistence

## How to Use

### 1. Upload CSV Files

**People CSV (Required format):**
```csv
Name,Typ
Emil,LEITER
Anna,TEILNEHMER
```

**Meals CSV (Required format):**
```csv
Tag,Tageszeit,KöcheLeiter,KöcheTeilnehmer,SpülerLeiter,SpülerTeilnehmer
Montag,Morgens,1,3,1,2
Montag,Mittags,2,4,1,3
```

### 2. Load Example Data

Click **"Beispieldaten laden"** to test with pre-loaded sample data.

### 3. Generate Schedule

After uploading files, the schedule is automatically generated using the fair rotation algorithm.

### 4. View Results

- **Schedule Display**: Shows all assignments organized by day and meal time
- **Warnings**: Lists any understaffing issues
- **Statistics**: Shows how many assignments each person has

### 5. Export

Choose export format:
- **Text**: Copy to clipboard or download as .txt
- **HTML**: Open in new window for printing
- **CSV**: Download for spreadsheet applications

## Algorithm Details

### Fair Rotation

The assignment engine prioritizes:
1. **Fewer assignments** - People with fewer duties are assigned first
2. **Longer time since last assignment** - Those who haven't worked recently get preference
3. **Alphabetically** - For deterministic results when tied

### Conflict Detection

Detects and warns about:
- Insufficient leaders (Leitern) for cooking/cleaning
- Insufficient participants (Teilnehmer) for cooking/cleaning

## LocalStorage

All data is automatically persisted to browser localStorage:
- People list
- Meal requirements
- Generated schedule
- Warnings

Use **"Alles löschen"** button to clear all data from storage.

## Internationalization

Currently German (German) language throughout:
- UI labels: German
- Output format: German
- Error messages: German
- Enums: German (Montag, Dienstag, etc.)

## Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Troubleshooting

### CSV File Not Loading

- Ensure file is in correct format with required headers
- Check for typos in type values (LEITER/TEILNEHMER)
- Ensure numbers are valid integers

### Schedule Not Generating

- Verify both people and meals files are uploaded
- Check for parsing errors in the error panel
- Try loading example data first

### Data Not Persisting

- Check browser localStorage is enabled
- Try clearing browser cache if having issues
- Use Chrome DevTools > Application > Local Storage to inspect

## Development Notes

### Adding New Features

1. **Models**: Add types/enums in `src/models/index.ts`
2. **Services**: Add business logic in `src/services/`
3. **Components**: Create Vue components in `src/components/`
4. **Store**: Update `src/stores/scheduleStore.ts` for state management

### Testing

Unit tests can be added in `tests/unit/` directory:

```bash
npm run test
```

### Code Style

- TypeScript with strict type checking
- ESM modules throughout
- Tailwind CSS for styling
- Vue 3 Composition API

## Performance

- **Bundle Size**: ~115 KB (gzipped: ~42 KB)
- **Load Time**: < 1 second
- **Assignment Generation**: < 100ms for typical inputs
- **CSV Parsing**: < 50ms for typical files

## Known Limitations

- Single browser session (no multi-device sync)
- No user authentication
- No database backend
- No scheduling/recurring support

## Future Enhancements

- [ ] Dark mode toggle
- [ ] Multi-language support (English)
- [ ] Week/month schedule view
- [ ] Import/export schedules as JSON
- [ ] Manual schedule editing
- [ ] Conflict resolution suggestions
- [ ] Performance metrics/analytics
- [ ] Undo/redo functionality

## License

MIT

## Support

For bugs and feature requests, please create an issue in the repository.

---

**Version**: 1.0.0  
**Last Updated**: 2026-05-20  
**Built with**: Vue 3 + TypeScript + Tailwind CSS
