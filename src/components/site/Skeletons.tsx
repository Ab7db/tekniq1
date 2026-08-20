export function ProductSkeleton() {
  return (
    <div className="glass overflow-hidden rounded-xl">
      <div className="shimmer aspect-[4/5] w-full" />
      <div className="space-y-3 p-4">
        <div className="shimmer h-4 w-3/4 rounded" />
        <div className="shimmer h-3 w-1/2 rounded" />
        <div className="shimmer h-9 w-full rounded" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}

export function BlockSkeleton({ className = "h-24" }: { className?: string }) {
  return <div className={`shimmer rounded-xl ${className}`} />;
}
