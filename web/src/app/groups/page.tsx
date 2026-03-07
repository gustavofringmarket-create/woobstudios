import Image from "next/image";
import { Users } from "lucide-react";
import { getAllGroups } from "@/lib/data";
import { formatNumber } from "@/lib/roblox";
import VerifiedBadge from "@/components/VerifiedBadge";

export const revalidate = 300;

export default async function GroupsPage() {
  const groups = await getAllGroups();
  const totalMembers = groups.reduce((s, g) => s + g.memberCount, 0);

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
          <div className="flex items-center gap-2.5 mb-3">
            <Users className="w-5 h-5 text-primary-light" />
            <span className="text-xs text-primary-light uppercase tracking-widest font-medium">Groups</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Our Groups</h1>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-4">
            <div className="flex items-center gap-2 text-sm text-muted">
              <span className="text-xl sm:text-2xl font-bold text-foreground">{groups.length}</span> groups
            </div>
            <span className="w-px h-5 bg-border" />
            <div className="flex items-center gap-2 text-sm text-muted">
              <span className="text-xl sm:text-2xl font-bold text-foreground">{formatNumber(totalMembers)}</span> members
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {groups.map((group) => (
            <a
              key={group.id}
              href={`https://www.roblox.com/groups/${group.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="card rounded-xl p-6 flex items-center gap-5"
            >
              <div className="relative w-20 h-20 rounded-xl overflow-hidden ring-1 ring-border shrink-0">
                {group.icon ? (
                  <Image src={group.icon} alt={group.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary-light text-2xl font-bold">
                    {group.name[0]}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg line-clamp-1">{group.name}</h3>
                  {group.hasVerifiedBadge && <VerifiedBadge size={18} />}
                </div>
                <p className="text-sm text-muted mt-1.5 flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  {formatNumber(group.memberCount)} members
                </p>
              </div>
            </a>
          ))}
        </div>

        {groups.length === 0 && (
          <div className="text-center py-24">
            <Users className="w-12 h-12 text-border mx-auto mb-4" />
            <p className="text-muted">No groups yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
