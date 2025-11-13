Component({
  options: {
    styleIsolation: 'apply-shared',
  },
  properties: {
    title: {
      type: String,
      value: 'Demo card',
    },
    description: {
      type: String,
      value: 'Use this area to describe your component.',
    },
  },
});
