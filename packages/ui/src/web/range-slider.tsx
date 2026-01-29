'use client'

import * as React from 'react'
import { cn } from '../shared/utils'

interface RangeSliderProps {
  min: number
  max: number
  step?: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  formatValue?: (value: number) => string
  label?: string
  className?: string
}

export function RangeSlider({
  min,
  max,
  step = 1,
  value,
  onChange,
  formatValue = (v) => v.toString(),
  label,
  className,
}: RangeSliderProps) {
  const [localValue, setLocalValue] = React.useState(value)
  const trackRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    setLocalValue(value)
  }, [value])

  const getPercent = (val: number) => ((val - min) / (max - min)) * 100

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.min(Number(e.target.value), localValue[1] - step)
    const newValue: [number, number] = [newMin, localValue[1]]
    setLocalValue(newValue)
    onChange(newValue)
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.max(Number(e.target.value), localValue[0] + step)
    const newValue: [number, number] = [localValue[0], newMax]
    setLocalValue(newValue)
    onChange(newValue)
  }

  const minPercent = getPercent(localValue[0])
  const maxPercent = getPercent(localValue[1])

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium">{label}</label>
          <span className="text-sm text-muted-foreground">
            {formatValue(localValue[0])} - {formatValue(localValue[1])}
          </span>
        </div>
      )}

      <div className="relative h-6 pt-2">
        {/* Track */}
        <div
          ref={trackRef}
          className="absolute h-2 w-full rounded-full bg-muted"
        />

        {/* Selected range */}
        <div
          className="absolute h-2 rounded-full bg-primary"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        />

        {/* Min thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue[0]}
          onChange={handleMinChange}
          className="pointer-events-none absolute h-2 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:shadow-md"
        />

        {/* Max thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue[1]}
          onChange={handleMaxChange}
          className="pointer-events-none absolute h-2 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:shadow-md"
        />
      </div>

      {/* Min/Max labels */}
      <div className="mt-1 flex justify-between text-xs text-muted-foreground">
        <span>{formatValue(min)}</span>
        <span>{formatValue(max)}</span>
      </div>
    </div>
  )
}
