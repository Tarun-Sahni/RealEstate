import { verifyAdminSession } from "@/lib/dal"
import connectDB from "@/lib/database"
import { ContactUs, Property, User, VisitBooking } from "@/models"
import { ChartAreaInteractive } from "@/components/admin/layout/chart"
import { SectionCardItem, SectionCards } from "@/components/admin/layout/sectioncards"

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
    newPropertiesThisWeek,
    totalInquiries,
    newInquiriesThisWeek,
    totalUsers,
    newUsersThisWeek,
    totalTourRequests,
    newTourRequestsThisWeek,
    propertyDailyRaw,
    inquiryDailyRaw,
  ] = await Promise.all([
    Property.countDocuments(),
    Property.countDocuments({ isActive: true }),
    Property.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
    ContactUs.countDocuments(),
    ContactUs.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
    User.countDocuments({ role: { $ne: "ADMIN" } }),
    User.countDocuments({ role: { $ne: "ADMIN" }, createdAt: { $gte: sevenDaysAgo } }),
    VisitBooking.countDocuments(),
    VisitBooking.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
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

  const stats: SectionCardItem[] = [
    {
      label: "Total Properties",
      value: totalProperties,
      badgeText: newPropertiesThisWeek > 0 ? `${newPropertiesThisWeek} this week` : "No change",
      positive: newPropertiesThisWeek > 0,
      headline: newPropertiesThisWeek > 0 ? "New listings added this week" : "No new listings this week",
      subtext: `${activeProperties} active · ${inactiveProperties} inactive`,
    },
    {
      label: "Tour Requests",
      value: totalTourRequests,
      badgeText: newTourRequestsThisWeek > 0 ? `${newTourRequestsThisWeek} this week` : "No change",
      positive: newTourRequestsThisWeek > 0,
      headline: newTourRequestsThisWeek > 0 ? "Tour requests coming in this week" : "No tour requests this week",
      subtext: `${totalTourRequests} all-time requests`,
    },
    {
      label: "Inquiries",
      value: totalInquiries,
      badgeText: newInquiriesThisWeek > 0 ? `${newInquiriesThisWeek} this week` : "No change",
      positive: newInquiriesThisWeek > 0,
      headline: newInquiriesThisWeek > 0 ? "Inquiries coming in this week" : "No inquiries this week",
      subtext: `${totalInquiries} all-time submissions`,
    },
    {
      label: "Registered Users",
      value: totalUsers,
      badgeText: newUsersThisWeek > 0 ? `${newUsersThisWeek} this week` : "No change",
      positive: newUsersThisWeek > 0,
      headline: newUsersThisWeek > 0 ? "New signups this week" : "No new signups this week",
      subtext: `${totalUsers} total accounts, excluding admins`,
    },
  ]

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-inter text-2xl font-semibold tracking-tight capitalize">Welcome back, {username}</h1>
        <p className="text-sm text-muted-foreground">Here&apos;s an overview of your real estate platform.</p>
      </div>
      <SectionCards items={stats} />
      <ChartAreaInteractive data={activityData} />
    </div>
  )
}

export default Home
