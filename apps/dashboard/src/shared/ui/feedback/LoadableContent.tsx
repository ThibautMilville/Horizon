import type {ReactNode} from "react";

import {Button} from "@/shared/ui/actions/Button";

import {DelayedFallback} from "./DelayedFallback";
import {EmptyState} from "./EmptyState";
import {ErrorState} from "./ErrorState";
import {
  DetailPageSkeleton,
  FleetPageSkeleton,
  FormPageSkeleton,
  TablePageSkeleton,
} from "./LoadingSkeletons";

type LoadingVariant = "table" | "detail" | "form" | "fleet";

type LoadableContentProps = {
  children: ReactNode;
  empty?: boolean;
  emptyMessage?: string;
  errorMessage?: string;
  errorTitle: string;
  loading: boolean;
  loadingVariant?: LoadingVariant;
  onRetry: () => void;
  retryLabel: string;
};

const loadingFallbacks: Record<LoadingVariant, ReactNode> = {
  table: <TablePageSkeleton />,
  detail: <DetailPageSkeleton />,
  form: <FormPageSkeleton />,
  fleet: <FleetPageSkeleton />,
};

export function LoadableContent({
  children,
  empty,
  emptyMessage,
  errorMessage,
  errorTitle,
  loading,
  loadingVariant = "table",
  onRetry,
  retryLabel,
}: LoadableContentProps) {
  if (errorMessage) {
    return (
      <ErrorState
        action={
          <Button onClick={onRetry} variant="secondary">
            {retryLabel}
          </Button>
        }
        message={errorMessage}
        title={errorTitle}
      />
    );
  }

  if (loading) {
    return <DelayedFallback>{loadingFallbacks[loadingVariant]}</DelayedFallback>;
  }

  if (empty && emptyMessage) {
    return <EmptyState message={emptyMessage} />;
  }

  return children;
}
