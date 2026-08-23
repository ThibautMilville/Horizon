import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {useI18n} from "@/shared/preferences/PreferencesProvider";
import {satelliteStatusTone, stationStatusTone, type StatusTone} from "@/shared/lib/status-tone";
import {Card} from "@/shared/ui/data-display/Card";

import {
  STATION_NETWORK_STATUSES,
  type FleetReadinessDatum,
  type StationNetworkDatum,
} from "./fleet-overview";

import styles from "./FleetAnalytics.module.scss";

type FleetAnalyticsProps = {
  satelliteReadiness: FleetReadinessDatum[];
  stationNetworkHealth: StationNetworkDatum[];
};

const tooltipStyle = {
  background: "var(--color-overlay)",
  border: "1px solid var(--color-overlay-border)",
  borderRadius: "var(--radius-sm)",
  color: "var(--color-text)",
};

const TONE_COLORS: Record<StatusTone, string> = {
  neutral: "var(--color-text-muted)",
  ok: "var(--color-ok)",
  warn: "var(--color-warn)",
  danger: "var(--color-danger)",
};

export function FleetAnalytics({satelliteReadiness, stationNetworkHealth}: FleetAnalyticsProps) {
  const {t} = useI18n();

  return (
    <div className={styles.root}>
      <Card title={t("fleet.fleetReadiness")}>
        <div aria-label={t("fleet.fleetReadinessChartLabel")} className={styles.chart} role="img">
          <ResponsiveContainer height="100%" width="100%">
            <BarChart data={satelliteReadiness} margin={{top: 8, right: 8, bottom: 0, left: 0}}>
              <CartesianGrid
                stroke="var(--color-hairline)"
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis dataKey="status" stroke="var(--color-text-muted)" tick={{fontSize: 11}} />
              <YAxis allowDecimals={false} stroke="var(--color-text-muted)" width={32} />
              <Tooltip contentStyle={tooltipStyle} cursor={{fill: "var(--color-accent-soft)"}} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {satelliteReadiness.map((entry) => (
                  <Cell fill={TONE_COLORS[satelliteStatusTone(entry.status)]} key={entry.status} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card title={t("fleet.groundSegmentHealth")}>
        <div aria-label={t("fleet.groundSegmentChartLabel")} className={styles.chart} role="img">
          <ResponsiveContainer height="100%" width="100%">
            <BarChart
              data={stationNetworkHealth}
              layout="vertical"
              margin={{top: 8, right: 12, left: 8}}
            >
              <CartesianGrid
                horizontal={false}
                stroke="var(--color-hairline)"
                strokeDasharray="3 3"
              />
              <XAxis allowDecimals={false} stroke="var(--color-text-muted)" type="number" />
              <YAxis
                dataKey="network"
                stroke="var(--color-text-muted)"
                type="category"
                width={72}
              />
              <Tooltip contentStyle={tooltipStyle} cursor={{fill: "var(--color-accent-soft)"}} />
              {STATION_NETWORK_STATUSES.map((status) => (
                <Bar
                  dataKey={status}
                  fill={TONE_COLORS[stationStatusTone(status)]}
                  key={status}
                  radius={[0, 2, 2, 0]}
                  stackId="network"
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
