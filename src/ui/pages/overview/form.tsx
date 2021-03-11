import { h, FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import { GraphType, DisplayType, OverviewForm } from '../../../interfaces';

import './form.scss';

interface FormProps {
  onSubmit: (obj: OverviewForm) => void;
}

const TYPES = [
  { value: 'graph', text: 'Graph' },
  { value: 'hierarchy', text: 'Hierarchy' }
];

const DISPLAY_TYPES = [
  { value: 'circle', text: 'Circle' },
  { value: 'concentric', text: 'Concentric Circle' },
  { value: 'breadthfirst', text: 'Breadthfirst' }
];

const Form: FunctionComponent<FormProps> = function ({ onSubmit }: FormProps) {
  const [state, setState] = useState<OverviewForm>({
    type: TYPES[0].value as GraphType,
    displayType: DISPLAY_TYPES[0].value as DisplayType,
    rootModel: '',
    filter: '',
    showConnectionsCount: false
  });

  const onFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(state);
  };

  const onChange = name => e => {
    setState({
      ...state,
      [name]: e.target.value
    });
  };

  const onChecked = name => e => {
    setState({
      ...state,
      [name]: e.target.checked
    })
  };

  const hierarchyOnly = (<div class="form-row">
    <label for="rootModel">Use model as root: </label>
    <input type="text" id="rootModel" value={state.rootModel} onInput={onChange('rootModel')} />
  </div>);
  const graphOnly = (<>
	  <div class="form-row">
		  <label for="filter">Use filter: </label>
      <input type="text" id="filter" value={state.filter} onInput={onChange('filter')} />
    </div>
    <div class="form-row">
		  <input type="checkbox" id="showConnectionsCount" checked={state.showConnectionsCount} onChange={onChecked('showConnectionsCount')} />
      <label for="showConnectionsCount">Show connections count</label>
    </div>
  </>)

  return (<form class="overview-form" onSubmit={onFormSubmit}>
    <div class="form-row">
      <label for="type">Choose a type:</label>
		  <select id="type" value={state.type} onChange={onChange('type')}>
        {TYPES.map(type => (<option value={type.value}>{type.text}</option>))}
      </select>
    </div>
    <div class="form-row">
      <label for="display-type">Choose a display type:</label>
		  <select id="display-type" value={state.displayType} onChange={onChange('displayType')}>
        {DISPLAY_TYPES.map(type => (<option value={type.value}>{type.text}</option>))}
      </select>
    </div>
    {state.type === TYPES[1].value ? hierarchyOnly : null}
    {state.type === TYPES[0].value ? graphOnly : null}
    <div class="form-row">
		  <button type="submit" id="submit">Visualize</button>
    </div>
  </form>);
};

export default Form;
