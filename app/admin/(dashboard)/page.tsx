import {
  Badge,
} from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { verifyAdminSession } from "@/lib/dal"
import connectDB from "@/lib/database"
import { ContactUs, Property, User } from "@/models"
import { Building2, MessageSquareText, Star, TrendingDown, TrendingUp, Users } from "lucide-react"
import data from "@/lib/data.json"

const getSevenDaysAgo = () => new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

const Home = async () => {
  const { username } = await verifyAdminSession();
  await connectDB();

  const sevenDaysAgo = getSevenDaysAgo();

  const [
    totalProperties,
    activeProperties,
    featuredProperties,
    newPropertiesThisWeek,
    totalInquiries,
    newInquiriesThisWeek,
    totalUsers,
    newUsersThisWeek,
  ] = await Promise.all([
    Property.countDocuments(),
    Property.countDocuments({ isActive: true }),
    Property.countDocuments({ isFeatured: true }),
    Property.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
    ContactUs.countDocuments(),
    ContactUs.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
    User.countDocuments({ role: { $ne: "ADMIN" } }),
    User.countDocuments({ role: { $ne: "ADMIN" }, createdAt: { $gte: sevenDaysAgo } }),
  ]);

  const inactiveProperties = totalProperties - activeProperties;
  const featuredShare = totalProperties ? Math.round((featuredProperties / totalProperties) * 100) : 0;

  const stats = [
    {
      label: "Total Properties",
      value: totalProperties,
      icon: Building2,
      trendValue: newPropertiesThisWeek,
      trendLabel: `${newPropertiesThisWeek} this week`,
      headline: newPropertiesThisWeek > 0 ? "New listings added this week" : "No new listings this week",
      subtext: `${activeProperties} active · ${inactiveProperties} inactive`,
    },
    {
      label: "Featured Properties",
      value: featuredProperties,
      icon: Star,
      trendValue: featuredShare,
      trendLabel: `${featuredShare}%`,
      headline: `${featuredShare}% of listings are featured`,
      subtext: `${featuredProperties} of ${totalProperties} properties`,
    },
    {
      label: "Inquiries",
      value: totalInquiries,
      icon: MessageSquareText,
      trendValue: newInquiriesThisWeek,
      trendLabel: `${newInquiriesThisWeek} this week`,
      headline: newInquiriesThisWeek > 0 ? "Inquiries coming in this week" : "No inquiries this week",
      subtext: `${totalInquiries} all-time submissions`,
    },
    {
      label: "Registered Users",
      value: totalUsers,
      icon: Users,
      trendValue: newUsersThisWeek,
      trendLabel: `${newUsersThisWeek} this week`,
      headline: newUsersThisWeek > 0 ? "New signups this week" : "No new signups this week",
      subtext: `${totalUsers} total accounts, excluding admins`,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-inter text-2xl font-semibold tracking-tight capitalize">Welcome back, {username}</h1>
        <p className="text-sm text-muted-foreground">Here&apos;s an overview of your real estate platform.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const TrendIcon = stat.trendValue > 0 ? TrendingUp : TrendingDown;
          return (
            <Card key={stat.label} className="@container/card bg-linear-to-t from-primary/5 to-card shadow-xs dark:bg-card">
              <CardHeader>
                <CardDescription>{stat.label}</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {stat.value.toLocaleString()}
                </CardTitle>
                <CardAction>
                  <Badge variant="outline">
                    <TrendIcon />
                    {stat.trendLabel}
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                  {stat.headline} <stat.icon className="size-4" />
                </div>
                <div className="text-muted-foreground">{stat.subtext}</div>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default Home
