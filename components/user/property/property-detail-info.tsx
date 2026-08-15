import {
  BedDouble,
  Bath,
  Maximize,
  MapPin,
  Building2,
  Calendar,
  CarFront,
  DoorOpen,
  Phone,
  User,
  CircleCheckBig,
  Eye,
} from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PublicPropertyDetail } from "@/lib/queries/properties"

const formatPrice = (price: number) => {
  if (price >= 1_00_00_000) return `₹${(price / 1_00_00_000).toFixed(price % 1_00_00_000 === 0 ? 0 : 2)} Cr`
  if (price >= 1_00_000) return `₹${(price / 1_00_000).toFixed(price % 1_00_000 === 0 ? 0 : 2)} L`
  return `₹${price.toLocaleString("en-IN")}`
}

const Stat = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | number }) => (
  <div className="flex items-center gap-2.5 rounded-xl bg-muted/60 px-4 py-3">
    <Icon size={18} className="shrink-0 text-yellow-500" />
    <div className="flex flex-col leading-tight">
      <span className="text-sm font-semibold">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  </div>
)

const PropertyDetailInfo = ({ property }: { property: PublicPropertyDetail }) => {
  const location = [property.address?.city, property.address?.state].filter(Boolean).join(", ")
  const stats: { icon: React.ElementType; label: string; value: string | number }[] = []

  if (typeof property.bedrooms === "number" && property.bedrooms > 0) {
    stats.push({ icon: BedDouble, label: "Bedrooms", value: property.bedrooms })
  }
  if (typeof property.bathrooms === "number" && property.bathrooms > 0) {
    stats.push({ icon: Bath, label: "Bathrooms", value: property.bathrooms })
  }
  if (typeof property.balconies === "number" && property.balconies > 0) {
    stats.push({ icon: DoorOpen, label: "Balconies", value: property.balconies })
  }
  if (typeof property.garages === "number" && property.garages > 0) {
    stats.push({ icon: CarFront, label: "Parking", value: property.garages })
  }
  if (property.area?.value) {
    stats.push({ icon: Maximize, label: "Area", value: `${property.area.value} ${property.area.unit ?? "sqft"}` })
  }
  if (property.propertyStatus) {
    stats.push({ icon: Building2, label: "Status", value: property.propertyStatus })
  }
  if (property.possessionDate) {
    stats.push({
      icon: Calendar,
      label: "Possession",
      value: new Date(property.possessionDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
    })
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {property.listingType?.name && (
            <span className="inline-flex items-center rounded-full bg-black/80 px-3 py-1 text-xs font-medium text-white dark:bg-white/10">
              {property.listingType.name}
            </span>
          )}
          {property.propertyType?.name && (
            <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium">
              {property.propertyType.name}
            </span>
          )}
        </div>
        <h1 className="font-playfair text-2xl font-bold md:text-3xl">{property.title}</h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {location && (
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin size={15} className="text-yellow-500" />
              {location}
            </p>
          )}
          {typeof property.views === "number" && (
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Eye size={15} className="text-yellow-500" />
              {property.views.toLocaleString("en-IN")} {property.views === 1 ? "view" : "views"}
            </p>
          )}
        </div>
        <div className="flex items-baseline gap-2 pt-1">
          <span className="font-playfair text-3xl font-bold text-foreground">
            {formatPrice(property.price)}
          </span>
          {property.priceLabel && (
            <span className="text-sm text-muted-foreground">{property.priceLabel}</span>
          )}
        </div>
      </div>

      {stats.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {stats.map((stat) => (
            <Stat key={stat.label} {...stat} />
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3">
        <h2 className="font-playfair text-xl font-semibold">Description</h2>
        <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground md:text-base">
          {property.description}
        </p>
      </div>

      {property.configurations && property.configurations.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="font-playfair text-xl font-semibold">Unit Configurations</h2>
          <div className="overflow-x-auto rounded-xl ring-1 ring-foreground/10">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Super Area</TableHead>
                  <TableHead>Carpet Area</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {property.configurations.map((config, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{config.type ?? "—"}</TableCell>
                    <TableCell>{config.superArea ? `${config.superArea} sqft` : "—"}</TableCell>
                    <TableCell>{config.carpetArea ? `${config.carpetArea} sqft` : "—"}</TableCell>
                    <TableCell className="text-right">{config.price ? formatPrice(config.price) : "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {property.amenities && property.amenities.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="font-playfair text-xl font-semibold">Amenities</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
            {property.amenities.map((amenity) => (
              <span key={amenity} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CircleCheckBig size={15} className="shrink-0 text-yellow-500" />
                {amenity}
              </span>
            ))}
          </div>
        </div>
      )}

      {property.highlights && property.highlights.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="font-playfair text-xl font-semibold">Highlights</h2>
          <div className="flex flex-wrap gap-2">
            {property.highlights.map((highlight) => (
              <span
                key={highlight}
                className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-600 dark:text-yellow-400"
              >
                {highlight}
              </span>
            ))}
          </div>
        </div>
      )}

      {(property.developer || property.reraNumber || property.projectArea || property.totalUnits || property.totalTowers) && (
        <div className="flex flex-col gap-3">
          <h2 className="font-playfair text-xl font-semibold">Project Details</h2>
          <div className="grid grid-cols-1 gap-4 rounded-xl bg-muted/60 p-4 sm:grid-cols-2 lg:grid-cols-3">
            {property.developer && (
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-muted-foreground">Developer</span>
                <span className="text-sm font-medium">{property.developer}</span>
              </div>
            )}
            {property.reraNumber && (
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-muted-foreground">RERA Number</span>
                <span className="text-sm font-medium wrap-break-word">{property.reraNumber}</span>
              </div>
            )}
            {property.projectArea && (
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-muted-foreground">Project Area</span>
                <span className="text-sm font-medium">{property.projectArea}</span>
              </div>
            )}
            {typeof property.totalUnits === "number" && (
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-muted-foreground">Total Units</span>
                <span className="text-sm font-medium">{property.totalUnits}</span>
              </div>
            )}
            {typeof property.totalTowers === "number" && (
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-muted-foreground">Total Towers</span>
                <span className="text-sm font-medium">{property.totalTowers}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {property.faqs && property.faqs.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="font-playfair text-xl font-semibold">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {property.faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}

      {(property.contactName || property.contactPhone) && (
        <div className="flex flex-col gap-3 rounded-2xl bg-card p-5 ring-1 ring-foreground/10 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-full bg-yellow-500/10">
              <User size={20} className="text-yellow-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Listed by</span>
              <span className="font-medium">{property.contactName ?? "Property Consultant"}</span>
            </div>
          </div>
          {property.contactPhone && (
            <a
              href={`tel:${property.contactPhone.replace(/\s+/g, "")}`}
              className="flex items-center justify-center gap-2 rounded-full bg-yellow-500 px-6 py-2.5 text-sm font-medium text-black transition-colors hover:bg-yellow-400"
            >
              <Phone size={16} />
              {property.contactPhone}
            </a>
          )}
        </div>
      )}
    </div>
  )
}

export default PropertyDetailInfo
