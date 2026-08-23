import {useLocation} from "react-router-dom";

import {DelayedFallback} from "./DelayedFallback";
import {
  DetailPageSkeleton,
  FleetPageSkeleton,
  FormPageSkeleton,
  MapStageSkeleton,
  TablePageSkeleton,
} from "./LoadingSkeletons";

function resolveOutletSkeleton(pathname: string) {
  if (pathname === "/" || pathname === "/map" || pathname.startsWith("/map/")) {
    return <MapStageSkeleton />;
  }

  if (pathname === "/fleet") {
    return <FleetPageSkeleton />;
  }

  if (pathname.endsWith("/new")) {
    return <FormPageSkeleton />;
  }

  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 2) {
    return <DetailPageSkeleton />;
  }

  return <TablePageSkeleton />;
}

export function OutletRouteSkeleton() {
  const {pathname} = useLocation();

  return <DelayedFallback>{resolveOutletSkeleton(pathname)}</DelayedFallback>;
}
