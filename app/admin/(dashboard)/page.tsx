import {
  Badge,
} from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { verifyAdminSession } from "@/lib/dal"
import connectDB from "@/lib/database"
import { cn } from "@/lib/utils"
import { ContactUs, Property, User } from "@/models"
import { Building2, Minus, MessageSquareText, Star, TrendingUp, Users } from "lucide-react"
import { ChartAreaInteractive } from "@/components/admin/layout/chart"

const ACTIVITY_HISTORY_DAYS = 90;

const getSevenDaysAgo = () => new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

const getStartOfToday = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

const getDaysAgo = (days: number) => {
  const date = getStartOfToday();
  date.setDate(date.getDate() - days);
  return date;
}

const toDateKey = (date: Date) => date.toISOString().slice(0, 10);

interface DailyCount {
  _id: string;
  count: number;
}

function buildActivitySeries(propertyCounts: DailyCount[], inquiryCounts: DailyCount[]) {
  const propertyMap = new Map(propertyCounts.map((entry) => [entry._id, entry.count]));
  const inquiryMap = new Map(inquiryCounts.map((entry) => [entry._id, entry.count]));
  const today = getStartOfToday();

  return Array.from({ length: ACTIVITY_HISTORY_DAYS }, (_, index) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (ACTIVITY_HISTORY_DAYS - 1 - index));
    const key = toDateKey(date);
    return {
      date: key,
      properties: propertyMap.get(key) ?? 0,
      inquiries: inquiryMap.get(key) ?? 0,
    }
  })
}

const Home = async () => {
  const { username } = await verifyAdminSession();
  await connectDB();

  const sevenDaysAgo = getSevenDaysAgo();
  const activityStartDate = getDaysAgo(ACTIVITY_HISTORY_DAYS - 1);

  const [
    totalProperties,
    activeProperties,
    featuredProperties,
    newPropertiesThisWeek,
    totalInquiries,
    newInquiriesThisWeek,
    totalUsers,
    newUsersThisWeek,
    propertyDailyRaw,
    inquiryDailyRaw,
  ] = await Promise.all([
    Property.countDocuments(),
    Property.countDocuments({ isActive: true }),
    Property.countDocuments({ isFeatured: true }),
    Property.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
    ContactUs.countDocuments(),
    ContactUs.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
    User.countDocuments({ role: { $ne: "ADMIN" } }),
    User.countDocuments({ role: { $ne: "ADMIN" }, createdAt: { $gte: sevenDaysAgo } }),
    Property.aggregate<DailyCount>([
      { $match: { createdAt: { $gte: activityStartDate } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
    ]),
    ContactUs.aggregate<DailyCount>([
      { $match: { createdAt: { $gte: activityStartDate } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
    ]),
  ]);

  const activityData = buildActivitySeries(propertyDailyRaw, inquiryDailyRaw);
  const inactiveProperties = totalProperties - activeProperties;
  const featuredShare = totalProperties ? Math.round((featuredProperties / totalProperties) * 100) : 0;

  const stats = [
    {
      label: "Total Properties",
      value: totalProperties,
      icon: Building2,
      accent: "blue",
      badge: newPropertiesThisWeek > 0
        ? { icon: TrendingUp, text: `${newPropertiesThisWeek} this week`, positive: true }
        : { icon: Minus, text: "No change", positive: false },
      headline: newPropertiesThisWeek > 0 ? "New listings added this week" : "No new listings this week",
      subtext: `${activeProperties} active · ${inactiveProperties} inactive`,
    },
    {
      label: "Featured Properties",
      value: featuredProperties,
      icon: Star,
      accent: "amber",
      badge: { icon: Star, text: `${featuredShare}% featured`, positive: false },
      headline: `${featuredShare}% of listings are featured`,
      subtext: `${featuredProperties} of ${totalProperties} properties`,
    },
    {
      label: "Inquiries",
      value: totalInquiries,
      icon: MessageSquareText,
      accent: "violet",
      badge: newInquiriesThisWeek > 0
        ? { icon: TrendingUp, text: `${newInquiriesThisWeek} this week`, positive: true }
        : { icon: Minus, text: "No change", positive: false },
      headline: newInquiriesThisWeek > 0 ? "Inquiries coming in this week" : "No inquiries this week",
      subtext: `${totalInquiries} all-time submissions`,
    },
    {
      label: "Registered Users",
      value: totalUsers,
      icon: Users,
      accent: "emerald",
      badge: newUsersThisWeek > 0
        ? { icon: TrendingUp, text: `${newUsersThisWeek} this week`, positive: true }
        : { icon: Minus, text: "No change", positive: false },
      headline: newUsersThisWeek > 0 ? "New signups this week" : "No new signups this week",
      subtext: `${totalUsers} total accounts, excluding admins`,
    },
  ] as const

  const accentClasses = {
    blue: { icon: "bg-blue-500/10 text-blue-600 dark:text-blue-400", glow: "bg-blue-500" },
    amber: { icon: "bg-amber-500/10 text-amber-600 dark:text-amber-400", glow: "bg-amber-500" },
    violet: { icon: "bg-violet-500/10 text-violet-600 dark:text-violet-400", glow: "bg-violet-500" },
    emerald: { icon: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", glow: "bg-emerald-500" },
  } satisfies Record<string, { icon: string; glow: string }>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-inter text-2xl font-semibold tracking-tight capitalize">Welcome back, {username}</h1>
        <p className="text-sm text-muted-foreground">Here&apos;s an overview of your real estate platform.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const accent = accentClasses[stat.accent];
          return (
            <Card
              key={stat.label}
              className="@container/card relative gap-4 overflow-hidden shadow-xs transition-shadow duration-300 hover:shadow-lg"
            >
              <div
                className={cn(
                  "pointer-events-none absolute -top-10 -right-10 size-32 rounded-full opacity-15 blur-3xl",
                  accent.glow
                )}
              />
              <CardHeader className="gap-4">
                <div className="flex items-start justify-between">
                  <div className={cn("flex size-11 items-center justify-center rounded-xl", accent.icon)}>
                    <stat.icon className="size-5" />
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "gap-1",
                      stat.badge.positive && "border-emerald-600/20 bg-emerald-500/10 text-emerald-600 dark:border-emerald-400/20 dark:text-emerald-400"
                    )}
                  >
                    <stat.badge.icon className="size-3" />
                    {stat.badge.text}
                  </Badge>
                </div>
                <div>
                  <CardDescription>{stat.label}</CardDescription>
                  <CardTitle className="font-sans text-3xl font-bold tracking-tight tabular-nums @[250px]/card:text-4xl">
                    {stat.value.toLocaleString()}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1 border-t text-sm">
                <div className="line-clamp-1 font-medium">{stat.headline}</div>
                <div className="text-muted-foreground">{stat.subtext}</div>
              </CardFooter>
            </Card>
          )
        })}
      </div>
      <ChartAreaInteractive data={activityData} />
    </div>
  )
}

export default Home
