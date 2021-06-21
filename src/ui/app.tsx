import { h, FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import Mermaid from './components/mermaid';
import ScaleSlider from './components/scale-slider';
import ModelAutoSuggest from './components/model-auto-suggest';
import { waitFor } from './utils/common';
import { DataConfig, ModelsConfig } from '../interfaces';
import { save } from './utils/save-html-file';
import { includeEverythingRelatedTo } from './utils/filtering';
import { makeInheritanceTree } from './utils/inheritance-tree';

import './app.scss';

const App: FunctionComponent = function () {
  const [config, setConfig] = useState<ModelsConfig>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [scale, setScale] = useState(1);
  const [specificModel, setSpecificModel] = useState('');

  const allDescriptors = config?.descriptors;
  let descriptors = allDescriptors;
  let inheritanceMap = config?.inheritanceMap;
  if (specificModel !== '') {
    const included = includeEverythingRelatedTo(
      specificModel,
      descriptors,
      inheritanceMap,
      makeInheritanceTree(inheritanceMap)
    );
    descriptors = included.descriptors;
    inheritanceMap = included.inheritanceMap;
  }
  const models = Object.keys(allDescriptors || {});

  const onSaveHtmlClick = (e) => {
    e.preventDefault();
    save();
  };

  const onModelChange = modelName => {
    setSpecificModel(modelName);
  };

  useEffect(() => {
    waitFor<DataConfig>(window, 'EMBER_MODELS_GRAPH').then(({ error, data }) => {
      if (error) {
        setErrorMsg(error);
      } else {
        setConfig(data);
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
    {descriptors && <Mermaid map={descriptors} inheritanceMap={inheritanceMap} scale={scale} />}
    {errorMsg && <span>{errorMsg}</span>}
  </div>);
};

export default App;
