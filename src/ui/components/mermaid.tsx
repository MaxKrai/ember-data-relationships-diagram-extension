import { h, FunctionComponent } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import mermaid from 'mermaid';
import { ModelDescriptorMap } from '../../interfaces';
import { buildGraph } from '../utils/build-graph';
import { MERMAID_CONFIG } from '../config';

interface MermaidProps {
  map: ModelDescriptorMap,
  scale: number
}

const Mermaid: FunctionComponent<MermaidProps> = function ({ map, scale }) {
  const container = useRef(null);
  const graph = useRef(null);

  useEffect(() => {
    mermaid.mermaidAPI.initialize({
      ...MERMAID_CONFIG
    });
  });

  useEffect(() => {
    if (!container.current || !map) {
      return;
    }

    const previousGraph = document.getElementById('graph-svg');
    if (previousGraph) {
      previousGraph.remove();
    }

    const insertGraph = svg => {
      graph.current.innerHTML = svg;
    };

    const element = document.createElement('div');
    element.classList.add('graph');
    element.id = 'graph-svg';
    container.current.appendChild(element);

    const source = buildGraph(map);

    try {
      mermaid.mermaidAPI.render('graph-svg', source, insertGraph);

      // avoid autoscaling by setting all possible width of container
      const maxWidth = document.getElementById('graph-svg').style.maxWidth;
      graph.current.style.width = maxWidth;
    } catch (e) {
      console.log(e);
    }
  }, [container, map]);

  useEffect(() => {
    const maxWidth = document.getElementById('graph-svg').style.maxWidth;
    graph.current.style.width = `${scale * parseFloat(maxWidth)}px`;
    graph.current.style.zoom = scale;
  }, [scale]);

  return (<div class="mermaid" ref={container}>
    <div id="graph" class="graph" ref={graph} />
  </div>);
}

export default Mermaid;
