<template>
  <div id="app">
    <flowchart
      ref="flowchartRef"
      :nodes="state.nodes"
      :links="state.links"
      :draft-link="state.draftLink"
      @node-position-change="handleNodePositionChange"
      @add-draft-link="handleAddDraftLink"
      @update-draft-link="handleUpdateDraftLink"
      @add-link="handleAddLink"
    />
  </div>
</template>

<script>
import Vue from 'vue';
import Flowchart from './components/Flowchart/Flowchart.vue';

const rawState = {
  nodes: {
    node1: {
      id: 'node1',
      x: -100,
      y: 50,
      width: 50,
      height: 50,
      ports: {
        port1: {
          id: 'port1',
          direction: 'bottom',
        },
      },
    },
    node2: {
      id: 'node2',
      x: 100,
      y: -100,
      width: 50,
      height: 50,
      ports: {
        port1: {
          id: 'port1',
          direction: 'top',
        },
        port2: {
          id: 'port2',
          direction: 'right',
        },
        port3: {
          id: 'port3',
          direction: 'bottom',
        },
        port4: {
          id: 'port4',
          direction: 'left',
        },
      },
    },
    node3: {
      id: 'node3',
      x: 300,
      y: 100,
      width: 50,
      height: 50,
      ports: {
        port1: {
          id: 'port1',
          direction: 'top',
        },
        port2: {
          id: 'port2',
          direction: 'right',
        },
        port3: {
          id: 'port3',
          direction: 'bottom',
        },
        port4: {
          id: 'port4',
          direction: 'left',
        },
      },
    },
    node4: {
      id: 'node4',
      x: 500,
      y: 150,
      width: 50,
      height: 50,
      ports: {
        port1: {
          id: 'port1',
          direction: 'top',
        },
        port2: {
          id: 'port2',
          direction: 'right',
        },
        port3: {
          id: 'port3',
          direction: 'bottom',
        },
        port4: {
          id: 'port4',
          direction: 'left',
        },
      },
    },
    node5: {
      id: 'node5',
      x: 1000,
      y: 300,
      width: 50,
      height: 50,
      ports: {
        port1: {
          id: 'port1',
          direction: 'top',
        },
        port2: {
          id: 'port2',
          direction: 'right',
        },
        port3: {
          id: 'port3',
          direction: 'bottom',
        },
        port4: {
          id: 'port4',
          direction: 'left',
        },
      },
    },
    node6: {
      id: 'node6',
      x: 1000,
      y: 600,
      width: 50,
      height: 50,
      ports: {
        port1: {
          id: 'port1',
          direction: 'top',
        },
        port2: {
          id: 'port2',
          direction: 'right',
        },
        port3: {
          id: 'port3',
          direction: 'bottom',
        },
        port4: {
          id: 'port4',
          direction: 'left',
        },
      },
    },
  },
  links: {
    link1: {
      id: 'link1',
      from: {
        nodeId: 'node1',
        portId: 'port1',
      },
      to: {
        nodeId: 'node2',
        portId: 'port1',
      },
    },
    link2: {
      id: 'link2',
      from: {
        nodeId: 'node2',
        portId: 'port1',
      },
      to: {
        nodeId: 'node3',
        portId: 'port1',
      },
    },
    link3: {
      id: 'link3',
      from: {
        nodeId: 'node3',
        portId: 'port2',
      },
      to: {
        nodeId: 'node4',
        portId: 'port4',
      },
    },
    link4: {
      id: 'link4',
      from: {
        nodeId: 'node3',
        portId: 'port3',
      },
      to: {
        nodeId: 'node5',
        portId: 'port2',
      },
    },
    link5: {
      id: 'link5',
      from: {
        nodeId: 'node3',
        portId: 'port4',
      },
      to: {
        nodeId: 'node6',
        portId: 'port1',
      },
    },
  },
  draftLink: null,
};

export default {
  name: 'App',

  components: {
    Flowchart,
  },

  data () {
    return {
      state: rawState,
    };
  },

  methods: {
    handleNodePositionChange ({ node, position }) {
      node.x = position.x;
      node.y = position.y;
    },
    handleAddDraftLink ({ node, port, event }) {
      if (this.$refs.flowchartRef) {
        const position = this.$refs.flowchartRef.getPosition(event.clientX, event.clientY);
        this.state.draftLink = {
          from: {
            nodeId: node.id,
            portId: port.id,
          },
          mousePosition: position,
        };
      }
    },
    handleUpdateDraftLink (event) {
      if (this.$refs.flowchartRef) {
        const position = this.$refs.flowchartRef.getPosition(event.clientX, event.clientY);
        this.state.draftLink = {
          ...this.state.draftLink || {},
          mousePosition: position,
        };
      }
    },
    handleAddLink (event) {
      if (event) {
        Vue.set(this.state.links, `${Date.now()}`, {
          from: this.state.draftLink.from,
          to: event,
        });
      }
      this.state.draftLink = null;
    },
  },
};
</script>

<style lang="scss">
html
body {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.canvas {
  background-color: rgba(green, 0.5);

  &__outer {
    background-color: purple;
  }
}
</style>
