import { h, FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import './model-auto-suggest.scss';

const MAX_SUGGEST_QUANTITY = 5;

interface ModelAutoSuggestProps {
  onChange: (val: string) => void,
  pool: string[]
}

const ModelAutoSuggest: FunctionComponent<ModelAutoSuggestProps> = function ({ onChange, pool }) {
  const [search, onSearchChange] = useState('');
  const onTextChange = e => {
    e.preventDefault();
    onSearchChange(e.target.value);
  };
  const onSelect = val => {
    onSearchChange(val);
    onChange(val);
  };

  const models = (search === '' ? pool : pool.filter(model => model.includes(search)))
    .slice(0, MAX_SUGGEST_QUANTITY);
  return (<div class="model-auto-suggest">
    <input class="search-field" type="text" value={search} onInput={onTextChange} />
    <div class="model-selector">
      <div class="item" onClick={() => onSelect('')}>All</div>
      {models.map(model => (<div class="item" onClick={() => onSelect(model)}>{model}</div>))}
    </div>
  </div>);
}

export default ModelAutoSuggest;
