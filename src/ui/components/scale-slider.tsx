import { h, FunctionComponent } from 'preact';
import './scale-slider.scss';

interface ScaleSliderProps {
  value: number,
  min: number,
  max: number,
  step: number,
  onChange: (val: number) => void
}

const ScaleSlider: FunctionComponent<ScaleSliderProps> = function ({ value, min, max, step, onChange }) {
  const onInput = (e) => {
    onChange(e.target.value);
  };

  return (<div class="scale-slider">
    <p>Scale: <span class="scale-slider-value">{value}</span></p>
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      step={step}
      class="scale-slider-input"
      onInput={onInput}
    />
  </div>);
};

export default ScaleSlider;
