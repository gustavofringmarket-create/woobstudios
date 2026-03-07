import { getAllUGC } from "@/lib/data";
import UGCGrid from "@/components/UGCGrid";

export const revalidate = 300;

export default async function UGCPage() {
  const ugcItems = await getAllUGC();
  const forSale = ugcItems.filter((i) => i.isForSale);

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
          <h1 className="text-2xl font-bold">UGC Items</h1>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted">
            <span>{ugcItems.length} items</span>
            <span className="text-border">|</span>
            <span className="text-green-400">{forSale.length} on sale</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <UGCGrid items={ugcItems} />
      </div>
    </div>
  );
}
