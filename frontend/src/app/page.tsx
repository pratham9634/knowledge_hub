import Link from "next/link"
import { BookOpen, ArrowRight, Sparkles, Shield, Zap } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-background">

      {/* ── Animated Background ── */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] animate-float" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-chart-2/8 blur-[140px] animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] rounded-full bg-primary/5 blur-[100px] animate-pulse-glow" />
      </div>

      {/* ── Grid Pattern ── */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(oklch(0.95 0.005 270) 1px, transparent 1px), linear-gradient(90deg, oklch(0.95 0.005 270) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">

        {/* Badge */}
        <div className="animate-fade-in mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Your personal knowledge vault</span>
          </div>
        </div>

        {/* Logo */}
        <div className="animate-slide-up flex items-center gap-3 mb-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 border border-primary/20 shadow-lg shadow-primary/10">
            <BookOpen className="h-7 w-7 text-primary" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="animate-slide-up text-5xl md:text-7xl font-bold tracking-tight text-center max-w-3xl leading-[1.1]" style={{ animationDelay: '0.1s' }}>
          <span className="gradient-text">Knowledge</span>
          <br />
          <span className="text-foreground">Hub</span>
        </h1>

        {/* Subtitle */}
        <p className="animate-slide-up mt-6 text-lg md:text-xl text-muted-foreground text-center max-w-xl leading-relaxed" style={{ animationDelay: '0.2s' }}>
          Organize links, articles, files, images, and videos — all in one beautifully crafted space.
        </p>

        {/* CTA Buttons */}
        <div className="animate-slide-up flex flex-col sm:flex-row gap-4 mt-10" style={{ animationDelay: '0.3s' }}>
          <Link
            href="/login"
            className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-[15px] font-semibold text-primary-foreground transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5"
            style={{ background: 'var(--accent-gradient)' }}
          >
            Get Started
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>

          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-[15px] font-semibold glass text-foreground transition-all duration-300 hover:bg-accent hover:-translate-y-0.5"
          >
            Create Account
          </Link>
        </div>

        {/* Feature Pills */}
        <div className="animate-slide-up flex flex-wrap justify-center gap-3 mt-16" style={{ animationDelay: '0.4s' }}>
          {[
            { icon: Shield, label: "Secure & Private" },
            { icon: Zap, label: "Fast & Organized" },
            { icon: Sparkles, label: "Beautiful UI" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 border border-border/50 text-sm text-muted-foreground">
              <Icon className="h-3.5 w-3.5 text-primary/70" />
              {label}
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
