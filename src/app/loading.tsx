export default function Loading() {
  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black">
      <div className="h-16 w-16 animate-spin rounded-full border-2 border-blood/30 border-t-blood shadow-[0_0_25px_rgba(255,26,26,0.6)]" />
      <p className="mt-6 font-display text-sm tracking-[0.3em] text-blood text-glow">
        LOADING THE STANDARD...
      </p>
    </div>
  );
}
