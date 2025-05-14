class ForceDirectedGraph {

  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: 600,
      containerHeight: 600,
      margin: {top: 25, right: 20, bottom: 20, left: 35}
    }
    this.data = _data;
    this.initVis();
  }

  initVis() {
    let vis = this;

    vis.config.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.config.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    vis.colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    vis.svg = d3.select(vis.config.parentElement).append('svg')
      .attr('width', vis.config.containerWidth)
      .attr('height', vis.config.containerHeight);

    vis.chart = vis.svg.append('g')
      .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

    // Initialize force simulation
    vis.simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id(d => d.id))
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(vis.config.width / 2, vis.config.height / 2));

    vis.updateVis();
  }

  updateVis() {
    let vis = this;

    vis.simulation.nodes(vis.data.nodes);
    vis.simulation.force('link').links(vis.data.links);

    vis.colorScale.domain(vis.data.nodes.map(d => d.group));

    vis.renderVis();
  }

  renderVis() {
    let vis = this;

    // Add links
    const links = vis.chart.selectAll('line')
      .data(vis.data.links, d => [d.source, d.target])
      .join('line')
      .attr('stroke', '#aaa');

    // Add nodes
    const nodes = vis.chart.selectAll('circle')
      .data(vis.data.nodes, d => d.id)
      .join('circle')
      .attr('r', 5)
      .attr('fill', d => vis.colorScale(d.group));

    // Update positions on each tick
    vis.simulation.on('tick', () => {
      links
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      nodes
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
    });
  }
}
