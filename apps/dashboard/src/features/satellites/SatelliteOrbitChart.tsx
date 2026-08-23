import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

import {useI18n} from "@/shared/preferences/PreferencesProvider";
import {Card} from "@/shared/ui/data-display/Card";

import type {OrbitalAltitudeSample, OrbitalAltitudeSummary} from "./satellite-orbit";
import {formatAltitudeKm} from "./satellite-format";

import styles from "./SatelliteOrbitChart.module.scss";

type SatelliteOrbitChartProps = {
  samples: OrbitalAltitudeSample[];
  summary: OrbitalAltitudeSummary;
};

const tooltipStyle = {
  background: "var(--color-overlay)",
  border: "1px solid var(--color-overlay-border)",
  borderRadius: "var(--radius-sm)",
  color: "var(--color-text)",
};

export function SatelliteOrbitChart({samples, summary}: SatelliteOrbitChartProps) {
  const {t} = useI18n();

  return (
    <Card info={t("satellites.orbitAltitudeInfo")} title={t("satellites.orbitAltitude")}>
      <div aria-label={t("satellites.orbitAltitudeChartLabel")} className={styles.chart} role="img">
        <ResponsiveContainer height="100%" width="100%">
          <LineChart data={samples} margin={{top: 8, right: 12, bottom: 0, left: 4}}>
            <CartesianGrid stroke="var(--color-hairline)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="minute"
              stroke="var(--color-text-muted)"
              tick={{fontSize: 11}}
              tickFormatter={(value) => `${value}`}
            />
            <YAxis
              domain={[Math.floor(summary.minKm - 5), Math.ceil(summary.maxKm + 5)]}
              stroke="var(--color-text-muted)"
              tick={{fontSize: 11}}
              width={40}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value) => [formatAltitudeKm(Number(value)), t("satellites.altitude")]}
              labelFormatter={(minute) => t("satellites.orbitMinute", {minute: String(minute)})}
            />
            <Line
              dataKey="altitudeKm"
              dot={false}
              stroke="var(--color-map-satellite)"
              strokeWidth={2}
              type="monotone"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
