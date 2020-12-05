export const mockData = {
  id: '1',
  name: '编队',
  count: 123456,
  label: '编队1', // 编队
  status: 'B',
  WeightRatio: '',
  level: 0,
  control: '',
  variableUp: false,
  children: [{
      control: '+',
      id: '11',
      name: '船只',
      count: 123456,
      label: '船只1',
      status: 'R',
      level: 1,
      WeightRatio: 0.179,
      children: [{
          control: '-',
          id: '111',
          name: '装备',
          collapsed: true,
          count: 123456,
          label: '装备1',
          level: 2,
          status: 'B',
          WeightRatio: 0.27,
          parentId: '11'
        },
        {
          control: '-',
          id: '112',
          name: '装备',
          collapsed: true,
          count: 123456,
          label: '装备2',
          status: 'G',
          level: 2,
          WeightRatio: 0.259,
          parentId: '11'
        }
      ],
    },
    {
      control: '+',
      id: '12',
      name: '船只',
      count: 123456,
      label: '船只2',
      status: 'B',
      level: 1,
      WeightRatio: 0.221,
      children: [{
          control: '-',
          id: '121',
          name: '装备3',
          count: 123456,
          label: '装备6',
          status: 'R',
          WeightRatio: 0.120,
          level: 2,
          children: [],
          parentId: '12'
        },
        {
          control: '-',
          id: '122',
          name: '装备4',
          count: 123456,
          label: '装备7',
          status: 'G',
          level: 2,
          WeightRatio: 0.241,
          variableUp: false,
          parentId: '12',
          children: [],
        },
      ],
    }
  ],
};

export const colors = {
  B: '#5B8FF9',
  R: '#F46649',
  Y: '#EEBC20',
  G: '#5BD8A6',
  DI: '#A7A7A7'
}

export const props = {
  data: mockData,
  config: {
    padding: [20, 50],
    defaultLevel: 3,
    defaultZoom: 0.8,
    modes: {
      default: ['zoom-canvas', 'drag-canvas']
    },
  },
};

// 默认配置
export const defaultConfig = {
  modes: {
    default: ['zoom-canvas', 'drag-canvas'],
  },
  fitView: true,
  animate: true,
  defaultNode: {
    type: 'flow-rect'
  },
  defaultEdge: {
    type: 'cubic-horizontal',
    style: {
      stroke: '#CED4D9',
    },
  },
  layout: {
    type: 'indented',
    direction: 'LR',
    dropCap: false,
    indent: 300,
    getHeight: () => {
      return 60;
    },
  }
};