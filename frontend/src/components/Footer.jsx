export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-borderLight py-8 text-sm text-gray-500 bg-bgDark relative z-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">

        {/* Left: copyright */}
        <p className="font-mono">© {year} Nuwan MC. All rights reserved.</p>

        {/* Centre: nav links */}
        <div className="flex gap-6 text-xs font-mono text-gray-600">
          {['#about', '#skills', '#experience', '#projects', '#contact'].map((href) => (
            <a
              key={href}
              href={href}
              className="hover:text-primary transition-colors capitalize"
            >
              {href.slice(1)}
            </a>
          ))}
        </div>

        {/* Right: status badge */}
        <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/30 text-xs font-mono text-primary">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          SYSTEM: ONLINE
        </div>

      </div>
    </footer>
  )
}
