export default function Loading() {
  return (
    <div className="min-h-[70vh] bg-background flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin shadow-sm" />
      <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-foreground">
        A carregar Algugest Serviços...
      </p>
    </div>
  );
}