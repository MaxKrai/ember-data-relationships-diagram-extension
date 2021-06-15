import './ui/index';

// import mermaid from 'mermaid';
// import { ModelDescriptorMap } from './interfaces';
// import { save } from './ui-2/save-html-file';
// import { buildGraph } from './ui-2/mermaid-graph-builder';
// import { waitFor } from './ui-2/utils';
// import './ui.scss';
//
// mermaid.mermaidAPI.initialize({
//   startOnLoad: false,
//   maxTextSize: 80000
// });
//
// const root = document.getElementById('root');
// const container = document.getElementById('graph');
// const saveHtmlButton = document.getElementById('save-html');
// const scaleRange = document.getElementById('scale-range');
// const currentScale = document.getElementById('current-scale');
//
// saveHtmlButton.addEventListener('click', () => {
//   save();
// });
//
// function insertGraph (svg) {
//   container.innerHTML = svg;
// }
//
// function render (source: string) {
//   const previousGraph = document.getElementById('graph-svg');
//   if (previousGraph) {
//     previousGraph.remove();
//   }
//
//   const element = document.createElement('div');
//   element.classList.add('graph');
//   element.id = 'graph-svg';
//   root.appendChild(element);
//   mermaid.mermaidAPI.render('graph-svg', source, insertGraph);
//
//   // avoid autoscaling by setting all possible width of container
//   const maxWidth = document.getElementById('graph-svg').style.maxWidth;
//   root.style.width = maxWidth;
// }
//
// type ProjectConfig = { error?: string, data?: ModelDescriptorMap };
//
// (async () => {
//   const { error, data } = await waitFor<ProjectConfig>(window, 'EMBER_MODELS_GRAPH');
//   if (!error) {
//     console.log(data);
//     const graphData = buildGraph(data);
//     console.log(graphData);
//     render(graphData);
//     console.log(graphData.length);
//     scaleRange.addEventListener('input', function (e) {
//       // @ts-ignore
//       const scale = e.target.value;
//       currentScale.innerText = scale;
//       container.style.zoom = scale;
//
//       // sync scaling and container width
//       const maxWidth = document.getElementById('graph-svg').style.maxWidth;
//       root.style.width = `${scale * parseFloat(maxWidth)}px`;
//     });
//   }
// })();
