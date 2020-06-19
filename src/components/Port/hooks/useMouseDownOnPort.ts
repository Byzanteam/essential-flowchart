import {
  Id,
  INode, INodePort, IPosition,
  ILink,
  FlowchartStore,
} from '@/types';
import runPipeline from '@/pipelines/runPipeline';

function findTarget (el: HTMLElement): { nodeId: Id; portId: Id } | null {
  let curr: HTMLElement | null = el;
  let target = null;

  while (!target && curr) {
    const nodeId = curr.getAttribute && curr.getAttribute('data-node-id');
    const portId = curr.getAttribute && curr.getAttribute('data-port-id');

    if (portId && nodeId) {
      target = {
        portId,
        nodeId,
      };
    } else {
      curr = curr.parentElement;
    }
  }

  return target;
}

export default function useMouseDownOnPort (store: FlowchartStore, node: INode, port: INodePort) {
  const onMouseDown = (evt: MouseEvent) => {
    // prevent text selection
    evt.preventDefault();
    // prevent node move
    evt.stopPropagation();

    const fromNodeId = node.id;
    const fromPortId = port.id;

    // the id isnt set right now, it should be set in pipelines.
    const newLink = runPipeline({
      from: {
        nodeId: fromNodeId,
        portId: fromPortId,
      },
      to: {},
    } as ILink, store.state);

    function mouseMoveHandler (e: MouseEvent) {
      const toPosition: IPosition = {
        x: e.x,
        y: e.y,
      };

      store.commit('updateMousePosition', toPosition);
    }

    function mouseUpHandler (e: MouseEvent) {
      store.commit('updateMousePosition', null);

      // remove listeners
      window.removeEventListener('mouseup', mouseUpHandler, false);
      window.removeEventListener('mousemove', mouseMoveHandler, false);

      // mouseUpHandler added to mouseup event listeners unless a newLink.
      // if (!newLink) return;

      const target = findTarget(e.target as HTMLElement);

      if (target) { // complete link
        const {
          nodeId: toNodeId,
          portId: toPortId,
        } = target;

        const link = runPipeline({
          ...newLink as ILink,
          to: {
            nodeId: toNodeId,
            portId: toPortId,
          },
        }, store.state);

        if (link) {
          store.dispatch('addLink', { link });
        } else {
          store.dispatch('removeLink', (newLink as ILink).id);
        }
      } else { // delete link
        store.dispatch('removeLink', (newLink as ILink).id);
      }
    }

    if (newLink) {
      // new link when start
      store.dispatch('addLink', {
        link: newLink,
      });

      // add listeners
      window.addEventListener('mousemove', mouseMoveHandler, false);
      window.addEventListener('mouseup', mouseUpHandler, false);
    }
  };

  return {
    onMouseDown,
  };
}
