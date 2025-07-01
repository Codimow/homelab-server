const socket = io();

let devices = [];

socket.on('devices', (data) => {
  devices = data;
  renderGraph();
});

function renderGraph() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  d3.select('#graph').selectAll('*').remove();
  const svg = d3.select('#graph').append('svg')
    .attr('width', width)
    .attr('height', height);

  const nodes = devices.map(d => ({ id: d.id, label: d.name || d.id }));
  const links = devices.filter(d => d.parentId).map(d => ({ source: d.parentId, target: d.id }));

  const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).distance(120))
    .force('charge', d3.forceManyBody().strength(-400))
    .force('center', d3.forceCenter(width / 2, height / 2));

  const link = svg.append('g')
    .attr('stroke', '#aaa')
    .selectAll('line')
    .data(links)
    .enter().append('line')
    .attr('stroke-width', 2);

  const node = svg.append('g')
    .selectAll('circle')
    .data(nodes)
    .enter().append('circle')
    .attr('r', 30)
    .attr('fill', '#4f8cff')
    .attr('stroke', '#222')
    .attr('stroke-width', 2)
    .on('click', (event, d) => openTerminal(d.id));

  const label = svg.append('g')
    .selectAll('text')
    .data(nodes)
    .enter().append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', 5)
    .attr('font-size', 14)
    .attr('fill', '#fff')
    .text(d => d.label);

  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);
    node
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);
    label
      .attr('x', d => d.x)
      .attr('y', d => d.y);
  });
}

function openTerminal(deviceId) {
  // To be implemented: open ttyd/wetty for deviceId
  alert('Open SSH terminal for ' + deviceId);
} 