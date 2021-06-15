import { h, FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import Mermaid from './components/mermaid';
import ScaleSlider from './components/scale-slider';
import ModelAutoSuggest from './components/model-auto-suggest';

import { waitFor } from './utils/common';
import { ProjectConfig } from '../interfaces';
import { save } from './utils/save-html-file';
import { includeEverythingRelatedTo } from './utils/filtering';

import './app.scss';

const App: FunctionComponent = function () {
  const [fullMap, setFullMap] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [scale, setScale] = useState(1);
  const [specificModel, setSpecificModel] = useState('');

  const map = specificModel === '' ?
    fullMap :
    includeEverythingRelatedTo(specificModel, fullMap);
  const models = Object.keys(fullMap || {});

  const onSaveHtmlClick = (e) => {
    e.preventDefault();
    save();
  };

  const onModelChange = modelName => {
    setSpecificModel(modelName);
  };

  useEffect(() => {
    waitFor<ProjectConfig>(window, 'EMBER_MODELS_GRAPH').then(({ error, data }) => {
      if (error) {
        setErrorMsg(error);
      } else {
        setFullMap(data);
      }
    });
  });

  return (<div class="app">
    <div class="panel">
      <ScaleSlider
        min={0.1}
        max={10}
        step={0.01}
        value={scale}
        onChange={setScale}
      />
      <ModelAutoSuggest onChange={onModelChange} pool={models} />
      <button onClick={onSaveHtmlClick}>Save as html file</button>
    </div>
    {map && <Mermaid map={map} scale={scale} />}
    {errorMsg && <span>{errorMsg}</span>}
  </div>);
};

export default App;
