# Ash Behavior Tracker

Privacy-first behavior tracking web application for children with autism, developmental delays, and behavior challenges.

## Features

- **Privacy-First**: Playful animal monikers protect children's identity
- **Fast Logging**: 3-5 second Quick Mode for rapid behavior tracking
- **ABC Data Collection**: Full antecedent-behavior-consequence methodology
- **Data Visualization**: Charts and insights to identify patterns
- **Professional Export**: CSV exports compatible with BCBA software
- **Local Storage**: All data stays in your browser (IndexedDB)
- **Accessible**: WCAG AA compliant, keyboard navigation, screen reader support
- **Responsive**: Works on mobile, tablet, and desktop

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui
- **State Management**: Zustand
- **Database**: IndexedDB (via Dexie.js)
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **Export**: PapaParse

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd ash

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
# Create production build
npm run build

# Run production server
npm start
```

## Usage

### 1. Create a Child Profile

Navigate to **Profiles** and click "New Profile". A playful animal name will be automatically generated (e.g., "Brave Panda").

### 2. Log Behaviors

- Click **Track** in the navigation
- Select a behavior type
- Use **Quick Mode** for fast logging (3-5 seconds)
- Switch to **Full ABC Mode** for detailed data entry

### 3. View Insights

Navigate to **Insights** to see:
- Frequency charts (7, 30, or 90 days)
- Behavior type breakdown
- Time of day patterns
- Common triggers

### 4. Export Data

Go to **Export** to download CSV files for:
- BCBA analysis
- Treatment planning
- Progress reports

## Data Privacy

- All data is stored locally in your browser's IndexedDB
- No accounts required, no cloud storage
- Animal monikers provide privacy protection
- Export controls let you choose what to share

**Important**: Exported CSV files contain behavior data. Handle according to HIPAA and privacy guidelines.

## Accessibility

This app is designed to be accessible to all users:

- ✅ WCAG AA compliant colors (4.5:1 contrast)
- ⌨️ Full keyboard navigation
- 🔊 Screen reader compatible
- 🎯 Clear focus indicators
- 📱 Touch-friendly (44x44px minimum targets)
- 🎨 Respects `prefers-reduced-motion`

### Keyboard Shortcuts

- `Tab` - Navigate between elements
- `Enter` - Activate buttons/links
- `Escape` - Close dialogs
- `Space` - Toggle checkboxes/select items

## Browser Compatibility

- Chrome 90+
- Safari 14+
- Firefox 88+
- Edge 90+

Requires IndexedDB support (available in all modern browsers).

## Development

### Project Structure

```
ash/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   │   ├── ui/          # Shadcn/ui primitives
│   │   ├── children/    # Child profile components
│   │   ├── tracking/    # Behavior logging components
│   │   ├── reports/     # Chart components
│   │   └── layout/      # Navigation, etc.
│   ├── lib/
│   │   ├── storage/     # IndexedDB (Dexie)
│   │   ├── utils/       # Utilities
│   │   └── hooks/       # Custom React hooks
│   ├── store/           # Zustand stores
│   └── types/           # TypeScript types
├── public/              # Static assets
└── package.json
```

### Adding New Behavior Types

Edit `src/lib/storage/db.ts` and add to the `BehaviorTemplate` array in `initializeBehaviorTemplates()`.

### Customizing Colors

Edit `src/app/globals.css` CSS variables for light/dark themes.

## Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Import repository at [vercel.com](https://vercel.com)
3. Configure:
   - Framework Preset: Next.js
   - Build Command: `next build`
   - Output Directory: `.next`
4. Deploy!

### Other Platforms

This is a standard Next.js app and can be deployed to:
- Netlify
- AWS Amplify
- Cloudflare Pages
- Any Node.js hosting

## Roadmap

### Future Enhancements

- [ ] Spanish and Arabic translations
- [ ] PDF report generation
- [ ] Photo attachments
- [ ] Goal tracking
- [ ] Cloud backup (optional)
- [ ] Progressive Web App (offline support)
- [ ] Multi-user with role permissions
- [ ] Advanced analytics (correlations, predictions)

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly (especially accessibility)
5. Submit a pull request

## License

[MIT License](LICENSE)

## Support

For issues or questions:
- Open an issue on GitHub
- Check existing issues for solutions

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

---

**Note**: This app is a tool for behavior tracking and data collection. It is not a substitute for professional behavioral analysis or medical advice. Always consult with qualified professionals (BCBAs, therapists, physicians) for treatment decisions.
