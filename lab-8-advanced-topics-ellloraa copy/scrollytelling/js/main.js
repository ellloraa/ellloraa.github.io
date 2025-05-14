d3.csv('data/assignments.csv').then(data => {
  data.forEach(d => {
    d.time = +d.time;
    d.partner = d.partner === 'True';
  });

  const scrollerVis = new ScrollerVis({ parentElement: '#vis' }, data);

  // Count text updates
  d3.select('#assignments-count').text(data.length);
  d3.select('#easy-assignments-count').text(data.filter(d => d.difficulty === 'Easy').length);
  d3.select('#difficult-assignments-count').text(data.filter(d => d.difficulty === 'Difficult').length);

  const longest = data.reduce((a, b) => (a.time > b.time ? a : b));
  d3.select('#max-duration-assignment').text(longest.name);
  d3.select('#max-duration').text(longest.time);

  // Waypoints
  const steps = d3.selectAll('.step');
  steps.each(function(_, i) {
    new Waypoint({
      element: this,
      handler: function(direction) {
        const nextStep = direction === 'down' ? i : Math.max(0, i - 1);
        scrollerVis.goToStep(nextStep);
      },
      offset: '50%'
    });
  });
});
