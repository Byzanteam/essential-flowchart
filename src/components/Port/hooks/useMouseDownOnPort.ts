import {
  INode, INodePort, ILink, Id,
} from '@/types';

import emitter from '@/emitter';
import { ADD_DRAFT_LINK, UPDATE_DRAFT_LINK, ADD_LINK } from '@/emitter/events';

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

export default function useMouseDownOnPort (portProps: { node: INode; port: INodePort; draftLink: ILink }) {
  const { node, port } = portProps;
  const onMouseDown = (evt: MouseEvent) => {
    // prevent text selection
    evt.preventDefault();
    // prevent node move
    evt.stopPropagation();

    emitter.emit(ADD_DRAFT_LINK, {
      node,
      port,
      event: evt,
    });

    function mouseMoveHandler (e: MouseEvent) {
      if (!portProps.draftLink) return;
      emitter.emit(UPDATE_DRAFT_LINK, e);
    }

    function mouseUpHandler (e: MouseEvent) {
      window.removeEventListener('mouseup', mouseUpHandler, false);
      window.removeEventListener('mousemove', mouseMoveHandler, false);

      if (!portProps.draftLink) return;

      const target = findTarget(e.target as HTMLElement);

      emitter.emit(ADD_LINK, target);
    }

    //   // add listeners
    window.addEventListener('mousemove', mouseMoveHandler, false);
    window.addEventListener('mouseup', mouseUpHandler, false);
    // }
  };

  return {
    onMouseDown,
  };
}
