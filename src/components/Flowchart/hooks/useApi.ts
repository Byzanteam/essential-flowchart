import {
  IPosition,
} from '@/types';

export default function useApi (instance: any) {
  function zoom (delta: number) {
    const { config } = instance;
    config.scale = delta + config.scale;
  }

  function zoomIn () {
    zoom(0.2);
  }

  function zoomOut () {
    zoom(-0.2);
  }

  function getPosition (clientX: number, clientY: number): IPosition | null {
    const { canvasRef } = instance;
    if (canvasRef.value) {
      return canvasRef.value.getPosition(clientX, clientY);
    }
    return null;
  }

  return {
    zoom,
    zoomIn,
    zoomOut,
    getPosition,
  };
}
