export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0 animate-aurora opacity-30 pointer-events-none scale-150"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, oklch(70% 0.15 250 / 0.15) 0%, transparent 50%),
            radial-gradient(circle at 100% 0%, oklch(75% 0.12 200 / 0.1) 0%, transparent 40%),
            radial-gradient(circle at 0% 100%, oklch(65% 0.2 300 / 0.1) 0%, transparent 40%)
          `,
          backgroundSize: "200% 200%",
          filter: "blur(80px)",
        }}
      />
      {/* Noise texture for that premium 2026 look */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}
