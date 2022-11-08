import {
  Grid,
  LineSeries,
  XYChart,
  Axis,
  Tooltip,
  Annotation,
  AnnotationLabel,
  AnnotationConnector,
} from "@visx/xychart";
import { format, parseISO, parse, formatISO } from "date-fns";

import { data as stockPrices } from "./stockPrices";

const chartConfig = {
  xScale: { type: "band" },
  yScale: { type: "linear" },
  margin: { top: 50, right: 10, bottom: 50, left: 50 },
};

const labelXOffset = 50;
const labelYOffset = 50;

type ChartProps = {
  width: number | string;
  height: number | string;
};

const Chart = ({ width, height }: ChartProps) => (
  // @ts-ignore
  <XYChart {...chartConfig} width={width} height={height}>
    <Grid numTicks={20} />
    <LineSeries
      dataKey="line"
      data={stockPrices.sort(
        (a, b) =>
          parse(a.x, "MM/dd/yyyy", new Date()).getTime() -
          parse(b.x, "MM/dd/yyyy", new Date()).getTime()
      )}
      xAccessor={(d) => formatISO(parse(d.x, "MM/dd/yyyy", new Date()))}
      yAccessor={(d) => d.y}
    />
    <Axis
      orientation="bottom"
      numTicks={20}
      tickFormat={(v) => format(parseISO(v), "dd MMM yy")}
      label="Time"
    />
    <Axis orientation="left" numTicks={20} label="Stock Price" />
    <Tooltip<{ x: string; y: number }>
      snapTooltipToDatumX
      snapTooltipToDatumY
      showVerticalCrosshair
      showSeriesGlyphs
      renderTooltip={({ tooltipData }) => (
        <div>
          {format(
            parse(tooltipData!.nearestDatum!.datum.x, "MM/dd/yyyy", new Date()),
            "do MMM yyyy"
          )}
          <br />${tooltipData!.nearestDatum!.datum.y.toFixed(2)}
        </div>
      )}
    />
    {stockPrices
      .filter((d) => !!d.events)
      .map((datum, i) => (
        <Annotation
          key={i}
          dataKey="line" // use this Series's accessor functions, alternatively specify x/yAccessor here
          datum={datum}
          dx={i % 2 === 0 ? labelXOffset : -labelXOffset}
          dy={i % 2 === 0 ? labelYOffset * 5 : -labelYOffset}
        >
          <AnnotationLabel
            title={format(
              parse(datum.x, "MM/dd/yyyy", new Date()),
              "do MMM yyyy"
            )}
            subtitle={datum.events!.join(", ")}
            showAnchorLine={false}
            backgroundFill="rgba(0,150,150,0.1)"
          />
          <AnnotationConnector />
        </Annotation>
      ))}
  </XYChart>
);

export default Chart;
