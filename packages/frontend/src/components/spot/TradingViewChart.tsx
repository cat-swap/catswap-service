import React, { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickData, HistogramData, Time, CandlestickSeries, HistogramSeries } from 'lightweight-charts';
import { CandleData, TradingPair } from '../../types';

type TimeFrame = '1m' | '5m' | '15m' | '1H' | '4H' | '1D' | '1W';

interface TradingViewChartProps {
  selectedPair: TradingPair;
  candleData: CandleData[];
  timeFrame: TimeFrame;
  onTimeFrameChange: (tf: TimeFrame) => void;
}

const TIME_FRAMES: { value: TimeFrame; label: string }[] = [
  { value: '1m', label: '1m' },
  { value: '5m', label: '5m' },
  { value: '15m', label: '15m' },
  { value: '1H', label: '1H' },
  { value: '4H', label: '4H' },
  { value: '1D', label: '1D' },
  { value: '1W', label: '1W' },
];

export const TradingViewChart: React.FC<TradingViewChartProps> = ({
  selectedPair,
  candleData,
  timeFrame,
  onTimeFrameChange,
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);
  const [isChartReady, setIsChartReady] = useState(false);

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: 'transparent' },
        textColor: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim() || '#888',
      },
      grid: {
        vertLines: { color: getComputedStyle(document.documentElement).getPropertyValue('--border-primary').trim() || '#2B2B43', style: 1 },
        horzLines: { color: getComputedStyle(document.documentElement).getPropertyValue('--border-primary').trim() || '#2B2B43', style: 1 },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: getComputedStyle(document.documentElement).getPropertyValue('--text-tertiary').trim() || '#758696',
          style: 2,
          width: 1,
          labelBackgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--bg-tertiary').trim() || '#758696',
        },
        horzLine: {
          color: getComputedStyle(document.documentElement).getPropertyValue('--text-tertiary').trim() || '#758696',
          style: 2,
          width: 1,
          labelBackgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--bg-tertiary').trim() || '#758696',
        },
      },
      rightPriceScale: {
        borderColor: getComputedStyle(document.documentElement).getPropertyValue('--border-primary').trim() || '#2B2B43',
        scaleMargins: {
          top: 0.1,
          bottom: 0.2,
        },
      },
      timeScale: {
        borderColor: getComputedStyle(document.documentElement).getPropertyValue('--border-primary').trim() || '#2B2B43',
        timeVisible: true,
        secondsVisible: false,
      },
      handleScroll: {
        vertTouchDrag: false,
      },
    });

    // Candlestick series
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#0ECB81',
      downColor: '#F6465D',
      borderUpColor: '#0ECB81',
      borderDownColor: '#F6465D',
      wickUpColor: '#0ECB81',
      wickDownColor: '#F6465D',
    });

    // Volume series
    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: '#26a69a',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
    });
    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.85,
        bottom: 0,
      },
    });

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;
    volumeSeriesRef.current = volumeSeries;
    setIsChartReady(true);

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(chartContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
      volumeSeriesRef.current = null;
    };
  }, []);

  // Update data when candleData changes
  useEffect(() => {
    if (!candleSeriesRef.current || !volumeSeriesRef.current || !isChartReady) return;

    const formattedCandles: CandlestickData[] = candleData.map(d => ({
      time: (d.time / 1000) as Time,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
    }));

    const formattedVolumes: HistogramData[] = candleData.map(d => ({
      time: (d.time / 1000) as Time,
      value: d.volume,
      color: d.close >= d.open ? '#0ECB81' : '#F6465D',
    }));

    candleSeriesRef.current.setData(formattedCandles);
    volumeSeriesRef.current.setData(formattedVolumes);

    // Fit content
    chartRef.current?.timeScale().fitContent();
  }, [candleData, isChartReady]);

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return (volume / 1e9).toFixed(2) + 'B';
    if (volume >= 1e6) return (volume / 1e6).toFixed(2) + 'M';
    if (volume >= 1e3) return (volume / 1e3).toFixed(2) + 'K';
    return volume.toFixed(2);
  };

  const priceChangeColor = selectedPair.change24h >= 0 ? 'text-[var(--color-buy)]' : 'text-[var(--color-sell)]';
  const priceChangeSign = selectedPair.change24h >= 0 ? '+' : '';

  return (
    <div className="flex flex-col h-full bg-[var(--bg-secondary)]">
      {/* Stats Bar */}
      <div className="flex items-center gap-6 px-4 py-2 border-b border-[var(--border-primary)] overflow-x-auto">
        <div className="flex flex-col">
          <span className="text-[10px] text-[var(--text-tertiary)] uppercase">Mark Price</span>
          <span className={`text-sm font-semibold ${priceChangeColor}`}>
            {formatPrice(selectedPair.price)}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-[var(--text-tertiary)] uppercase">Index Price</span>
          <span className="text-sm font-medium text-[var(--text-primary)]">
            {formatPrice(selectedPair.price * 0.9998)}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-[var(--text-tertiary)] uppercase">24h High</span>
          <span className="text-sm font-medium text-[var(--text-primary)]">
            {formatPrice(selectedPair.high24h)}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-[var(--text-tertiary)] uppercase">24h Low</span>
          <span className="text-sm font-medium text-[var(--text-primary)]">
            {formatPrice(selectedPair.low24h)}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-[var(--text-tertiary)] uppercase">24h Volume</span>
          <span className="text-sm font-medium text-[var(--text-primary)]">
            {formatVolume(selectedPair.volume24h)}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-[var(--text-tertiary)] uppercase">24h Change</span>
          <span className={`text-sm font-medium ${priceChangeColor}`}>
            {priceChangeSign}{selectedPair.change24h}%
          </span>
        </div>
      </div>

      {/* Time Frame Selector */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-[var(--border-primary)]">
        {TIME_FRAMES.map((tf) => (
          <button
            key={tf.value}
            onClick={() => onTimeFrameChange(tf.value)}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              timeFrame === tf.value
                ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)]'
                : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
            }`}
          >
            {tf.label}
          </button>
        ))}
      </div>

      {/* Chart Container */}
      <div ref={chartContainerRef} className="flex-1 min-h-0" />
    </div>
  );
};

export default TradingViewChart;
