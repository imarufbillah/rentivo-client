import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbSegment {
  label: string;
  href?: string;
}

interface AppBreadcrumbProps {
  segments: BreadcrumbSegment[];
}

export const AppBreadcrumb = ({ segments }: AppBreadcrumbProps) => {
  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink render={<Link href="/">Home</Link>} />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {segments.map((segment, i) => {
          const isLast = i === segments.length - 1;
          return [
            <BreadcrumbItem key={segment.href || segment.label}>
              {isLast || !segment.href ? (
                <BreadcrumbPage>{segment.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink render={<Link href={segment.href}>{segment.label}</Link>} />
              )}
            </BreadcrumbItem>,
            !isLast && <BreadcrumbSeparator key={`sep-${i}`} />,
          ];
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
