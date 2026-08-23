import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import {
  MaterialReactTable,
  MRT_ToggleFiltersButton,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_RowData,
} from "material-react-table";
import {useState, type ReactNode} from "react";
import {useNavigate} from "react-router-dom";

import {useI18n} from "@/shared/preferences/PreferencesProvider";
import type {NamedEntity} from "@/shared/types/entities";
import {CloseIcon, PlaceholderIcon, SearchIcon} from "@/shared/ui/actions/action-icons";
import {ButtonLink} from "@/shared/ui/actions/Button";
import {EmptyState} from "@/shared/ui/feedback/EmptyState";
import {DesignSystemProvider} from "@/shared/ui/theme/DesignSystemProvider";
import {Tooltip} from "@/shared/ui/overlays/Tooltip";
import {TextLink} from "@/shared/ui/navigation/TextLink";

export type DataTableColumn<T extends MRT_RowData> = MRT_ColumnDef<T>;

type DataTableProps<T extends MRT_RowData> = {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  empty?: ReactNode;
  filterPlaceholder?: string;
  getRowHref?: (row: T) => string | undefined;
};

const THUMB_PX = 40;
const IMAGE_COL_PX = THUMB_PX + 16;
const ACTION_COL_PX = 64;

function fixedColumnCellProps(width: number) {
  return {
    sx: {
      width,
      minWidth: width,
      maxWidth: width,
      px: 1,
      flex: `0 0 ${width}px`,
    },
  } as const;
}

const flatSurfaceSx = {
  backgroundColor: "transparent",
  backgroundImage: "none",
  border: "none",
  boxShadow: "none",
} as const;

export function dataTableImageColumn<T extends MRT_RowData>(
  getSrc: (row: T) => string | null | undefined,
): DataTableColumn<T> {
  return {
    id: "image",
    header: " ",
    size: IMAGE_COL_PX,
    minSize: IMAGE_COL_PX,
    maxSize: IMAGE_COL_PX,
    grow: false,
    enableColumnFilter: false,
    enableSorting: false,
    enableResizing: false,
    muiTableHeadCellProps: fixedColumnCellProps(IMAGE_COL_PX),
    muiTableBodyCellProps: fixedColumnCellProps(IMAGE_COL_PX),
    Cell: ({row}) => <DataTableThumb alt="" src={getSrc(row.original)} />,
  };
}

export function dataTableLinkActionColumn<T extends MRT_RowData>(
  getHref: (row: T) => string | undefined,
  options: {header: string; icon: ReactNode; label: string},
): DataTableColumn<T> {
  return {
    id: "link-action",
    header: options.header,
    size: ACTION_COL_PX,
    minSize: ACTION_COL_PX,
    maxSize: ACTION_COL_PX,
    grow: false,
    enableColumnFilter: false,
    enableSorting: false,
    enableResizing: false,
    muiTableHeadCellProps: fixedColumnCellProps(ACTION_COL_PX),
    muiTableBodyCellProps: fixedColumnCellProps(ACTION_COL_PX),
    Cell: ({row}) => {
      const href = getHref(row.original);
      if (!href) {
        return null;
      }

      return <TableActionLink href={href} icon={options.icon} label={options.label} />;
    },
  };
}

export function dataTableEntityLinkColumn<T extends MRT_RowData>(
  id: string,
  header: string,
  getEntity: (row: T) => NamedEntity | null | undefined,
  getHref: (entity: NamedEntity) => string,
): DataTableColumn<T> {
  return {
    id,
    header,
    accessorFn: (row) => getEntity(row)?.name ?? "",
    filterVariant: "text",
    Cell: ({row}) => {
      const entity = getEntity(row.original);
      return entity ? <TextLink to={getHref(entity)}>{entity.name}</TextLink> : "-";
    },
  };
}

function TableActionLink({href, icon, label}: {href: string; icon: ReactNode; label: string}) {
  return (
    <Tooltip content={label} position="top">
      <ButtonLink aria-label={label} to={href} variant="text">
        {icon}
      </ButtonLink>
    </Tooltip>
  );
}

function DataTableThumb({src, alt = ""}: {src?: string | null; alt?: string}) {
  const [failed, setFailed] = useState(false);
  const resolved = typeof src === "string" ? src.trim() : "";
  const showImage = Boolean(resolved) && !failed;

  return (
    <Box
      aria-hidden={showImage ? undefined : true}
      sx={{
        display: "grid",
        placeItems: "center",
        width: THUMB_PX,
        height: THUMB_PX,
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        bgcolor: "background.default",
        backgroundImage: showImage
          ? undefined
          : "linear-gradient(145deg, var(--color-accent-soft), transparent 55%)",
        color: "text.secondary",
      }}
    >
      {showImage ? (
        <Box
          alt={alt}
          component="img"
          onError={() => setFailed(true)}
          src={resolved}
          sx={{display: "block", width: "100%", height: "100%", objectFit: "cover"}}
        />
      ) : (
        <PlaceholderIcon />
      )}
    </Box>
  );
}

export function DataTable<T extends MRT_RowData>(props: DataTableProps<T>) {
  return (
    <DesignSystemProvider>
      <DataTableInner {...props} />
    </DesignSystemProvider>
  );
}

function DataTableInner<T extends MRT_RowData>({
  columns,
  rows,
  getRowId,
  empty,
  filterPlaceholder,
  getRowHref,
}: DataTableProps<T>) {
  const navigate = useNavigate();
  const {t} = useI18n();
  const resolvedFilterPlaceholder = filterPlaceholder ?? t("common.search");
  const [searchValue, setSearchValue] = useState("");

  const table = useMaterialReactTable({
    columns,
    data: rows,
    getRowId,
    enableColumnActions: false,
    enableColumnFilters: true,
    enableColumnResizing: false,
    enableDensityToggle: false,
    enableFacetedValues: true,
    enableFullScreenToggle: false,
    enableGlobalFilter: true,
    enableHiding: false,
    enablePagination: rows.length > 25,
    enableSorting: true,
    layoutMode: "grid",
    initialState: {
      density: "compact",
      showColumnFilters: false,
      showGlobalFilter: true,
      pagination: {pageIndex: 0, pageSize: 25},
    },
    muiBottomToolbarProps: {
      sx: flatSurfaceSx,
    },
    muiFilterTextFieldProps: {
      variant: "outlined",
      size: "small",
      sx: {
        "& .MuiInputAdornment-positionEnd": {
          marginRight: "2px !important",
        },
      },
      slotProps: {
        select: {
          MenuProps: {
            disableScrollLock: true,
            sx: {
              "& .MuiMenuItem-root[value='']": {
                display: "none",
              },
            },
          },
          renderValue: (selected) => {
            if (selected === "" || selected == null) {
              return (
                <Box component="span" sx={{color: "text.secondary"}}>
                  {t("common.filter")}
                </Box>
              );
            }
            return selected as ReactNode;
          },
        },
      },
    },
    muiTableBodyRowProps: ({row}) => {
      const href = getRowHref?.(row.original);
      if (!href) {
        return {};
      }

      return {
        onClick: (event) => {
          const target = event.target as HTMLElement;
          if (target.closest("a,button,input,label,.MuiSelect-select")) {
            return;
          }
          navigate(href);
        },
        sx: {cursor: "pointer"},
      };
    },
    muiTableContainerProps: {
      sx: flatSurfaceSx,
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: flatSurfaceSx,
    },
    muiTableProps: {
      sx: {
        backgroundColor: "transparent",
      },
    },
    muiTopToolbarProps: {
      sx: {
        ...flatSurfaceSx,
        minHeight: 0,
      },
    },
    muiTableBodyCellProps: ({row, table}) => {
      if (row.id === "mrt-row-empty") {
        return {
          colSpan: table.getVisibleLeafColumns().length,
          sx: {
            border: "none",
            px: 0,
            py: 1,
            verticalAlign: "middle",
          },
        };
      }

      return {};
    },
    renderEmptyRowsFallback: () => (
      <Box sx={{width: "100%", boxSizing: "border-box"}}>
        <EmptyState message={t("common.noMatchingRows")} variant="table" />
      </Box>
    ),
    renderTopToolbar: ({table: instance}) => (
      <Box
        sx={{
          display: "flex",
          gap: 1,
          alignItems: "center",
          width: "100%",
          boxSizing: "border-box",
          pb: 1.5,
        }}
      >
        <TextField
          fullWidth
          onChange={(event) => {
            const next = event.target.value;
            setSearchValue(next);
            instance.setGlobalFilter(next.trim() ? next : undefined);
          }}
          placeholder={resolvedFilterPlaceholder}
          size="small"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start" sx={{color: "text.secondary"}}>
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchValue ? (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={t("common.clearSearch")}
                    edge="end"
                    onClick={() => {
                      setSearchValue("");
                      instance.setGlobalFilter(undefined);
                    }}
                    size="small"
                  >
                    <CloseIcon />
                  </IconButton>
                </InputAdornment>
              ) : null,
            },
          }}
          sx={{flex: 1, minWidth: 0}}
          value={searchValue}
        />
        <MRT_ToggleFiltersButton table={instance} />
      </Box>
    ),
  });

  if (rows.length === 0) {
    return <>{empty ?? null}</>;
  }

  return <MaterialReactTable table={table} />;
}
