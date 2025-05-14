class ScrollerVis {
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: 400,
      containerHeight: 600,
      cellWidth: 50,
      cellHeight: 50,
      cellSpacing: 12,
      yAxisWidth: 150,
      barHeight: 50,
      barSpacing: 5,
      margin: {top: 5, right: 30, bottom: 5, left: 5},
      steps: ['step0', 'step1', 'step2', 'step3', 'step4']
    };
    this.data = _data;
    this.initVis();
  }

  initVis() {
    const vis = this;

    const dataTop5 = [...vis.data].sort((a, b) => b.time - a.time).slice(0, 5);
    const namesTop5 = dataTop5.map(d => d.name);
    vis.data.forEach(d => {
      d.rank = namesTop5.indexOf(d.name);
    });

    vis.dataLongest = [...vis.data].sort((a,b) => b.time - a.time)[0];

    vis.config.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.config.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    vis.xScale = d3.scaleLinear()
        .range([0, vis.config.width - vis.config.yAxisWidth])
        .domain([0, d3.max(dataTop5, d => d.time)]);

    vis.svg = d3.select(vis.config.parentElement).append('svg')
        .attr('width', vis.config.containerWidth)
        .attr('height', vis.config.containerHeight);

    vis.chart = vis.svg.append('g')
        .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

    vis.colorScale = d3.scaleOrdinal()
        .range(['#9dfcb6', '#e63946', '#b0c7b6'])
        .domain(['default', 'highlighted', 'inactive']);

    vis.config.columns = Math.floor(vis.config.width / (vis.config.cellWidth + vis.config.cellSpacing));
    vis.config.rows = Math.ceil(vis.data.length / vis.config.columns);

    vis.rect = vis.chart.selectAll('rect')
        .data(vis.data, d => d.name).join('rect');

    vis.step0();
  }

  step0() {
    const vis = this;
    vis.rect.transition()
      .attr('fill', vis.colorScale('default'))
      .attr('width', vis.config.cellWidth)
      .attr('height', vis.config.cellHeight)
      .attr('x', (d, i) => i % vis.config.columns * (vis.config.cellWidth + vis.config.cellSpacing))
      .attr('y', (d, i) => Math.floor(i / vis.config.columns) % vis.config.rows * (vis.config.cellHeight + vis.config.cellSpacing));
  }

  step1() {
    const vis = this;
    vis.rect.transition()
      .attr('fill', d => d.difficulty === 'Easy' ? vis.colorScale('highlighted') : vis.colorScale('default'));
  }

  step2() {
    const vis = this;
    vis.rect.transition()
      .attr('fill', d => d.difficulty === 'Difficult' ? vis.colorScale('highlighted') : vis.colorScale('default'));
  }

  step3() {
    const vis = this;
    vis.rect.transition()
      .attr('opacity', 1)
      .attr('fill', d => d.name === vis.dataLongest.name ? vis.colorScale('highlighted') : vis.colorScale('inactive'))
      .attr('width', vis.config.cellWidth)
      .attr('height', vis.config.cellHeight)
      .attr('x', (d, i) => i % vis.config.columns * (vis.config.cellWidth + vis.config.cellSpacing))
      .attr('y', (d, i) => Math.floor(i / vis.config.columns) % vis.config.rows * (vis.config.cellHeight + vis.config.cellSpacing));

    if (vis.textG) vis.textG.remove();
  }

  step4() {
    const vis = this;

    vis.rect
      .attr('fill', vis.colorScale('default'))
      .transition().duration(500)
        .attr('opacity', 0)
      .filter(d => d.rank >= 0)
        .attr('opacity', 1)
        .attr('x', vis.config.yAxisWidth)
        .attr('y', d => d.rank * (vis.config.barHeight + vis.config.barSpacing))
        .attr('height', vis.config.barHeight)
        .attr('width', d => vis.xScale(d.time));

    vis.textG = vis.chart.selectAll('g')
      .data(vis.data.filter(d => d.rank >= 0))
      .join('g')
      .attr('opacity', 0)
      .attr('transform', d => `translate(${vis.config.yAxisWidth},${d.rank * (vis.config.barHeight + vis.config.barSpacing)})`);

    vis.textG.append('text')
      .attr('class', 'chart-label chart-label-name')
      .attr('text-anchor', 'end')
      .attr('dy', '0.35em')
      .attr('x', -3)
      .attr('y', vis.config.barHeight/2)
      .text(d => d.name);

    vis.textG.append('text')
      .attr('class', 'chart-label chart-label-val')
      .attr('dy', '0.35em')
      .attr('x', 5)
      .attr('y', vis.config.barHeight/2)
      .text(d => d.time);

    vis.textG.transition().duration(800)
      .attr('opacity', 1);
  }

  goToStep(stepIndex) {
    this[this.config.steps[stepIndex]]();
  }
}
