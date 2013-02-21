// Generate the svg.
var width = 960,
    height = 700,
    radius = Math.min(width, height) / 2,
    color = d3.scale.category20(),
    duration = 1000;

var svg = d3.select("section").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var arc = d3.svg.arc()
    .startAngle(function(d) { return d.x; })
    .endAngle(function(d) { return d.x + d.dx; })
    .innerRadius(function(d) { return Math.sqrt(d.y); })
    .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

var partition = d3.layout.partition()
    .sort(null)
    .size([2 * Math.PI, radius * radius])
    .value(function(d) { return 1; });

d3.select(self.frameElement).style("height", height + "px");

// Updater.
function updateRing(ring) {

  // Redraw the partitions.
  var partitions = svg.selectAll("path")
      .data(partition.nodes(ring));

  partitions.enter()
    .append("path")
    .attr("display", function(d) { return d.depth ? null : "none"; })
    .attr("d", arc)
    .style("stroke", "#fff")
    .style("fill", function(d) { return color(d.name); })
    .style("fill-rule", "evenodd");

  partitions
    .style("opacity", function(d) { return d.down ? 0.5 : 1; })
    .transition()
      .delay(function(d, i) { return i / n_partitions * duration; })
      .duration(duration)
      .style("fill", function(d) { return color(d.name); });

}

// Defaults.
var n_nodes = 5;
var n_partitions = 32;

// Generate the ring.
function renderRing(n_nodes, n_partitions) {
  var partitions = [];

  for(var i = 0; i <= n_partitions; i++) {
    partitions.push({ id: i, name: "Node " + i % n_nodes });
  }

  // Redraw.
  updateRing({ name: "ring", children: partitions });
}

// Generate initial ring.
renderRing(n_nodes, n_partitions);

// Handle the ring events.
d3.selectAll("#add-node").on("click", function(click, i, e) {
  d3.event.preventDefault();

  n_nodes++;

  renderRing(n_nodes, n_partitions);
});

d3.selectAll("#remove-node").on("click", function(click) {
  d3.event.preventDefault();

  n_nodes--;

  if(n_nodes <= 0) {
    n_nodes = 1;
  }

  renderRing(n_nodes, n_partitions);
});
