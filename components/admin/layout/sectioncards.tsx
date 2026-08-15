import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

export interface SectionCardItem {
  label: string;
  value: string | number;
  badgeText: string;
  positive?: boolean;
  headline: string;
  subtext: string;
  // Draws attention to the card (e.g. action needed) with an amber glow, independent of `positive`.
  highlight?: boolean;
}

export function SectionCards({ items }: { items: SectionCardItem[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {items.map((item) => (
        <Card
          key={item.label}
          className={cn(
            "@container/card",
            item.highlight && "animate-pending-glow border-amber-500/50"
          )}
        >
          <CardHeader>
            <CardDescription className="flex items-center gap-1.5">
              {item.highlight && <span className="size-1.5 shrink-0 rounded-full bg-amber-500" />}
              {item.label}
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl font-inter mt-4">
              {typeof item.value === "number" ? item.value.toLocaleString() : item.value}
            </CardTitle>
            <CardAction>
              <Badge
                variant="outline"
                className={cn(
                  item.positive && "border-emerald-600/20 bg-emerald-500/10 text-emerald-600 dark:border-emerald-400/20 dark:text-emerald-400"
                )}
              >
                {item.badgeText}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm p-4">
            <div className="line-clamp-1 flex gap-2 font-medium">{item.headline}</div>
            <div className={cn("text-muted-foreground", item.highlight && "text-amber-600 dark:text-amber-400 font-medium")}>
              {item.subtext}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
