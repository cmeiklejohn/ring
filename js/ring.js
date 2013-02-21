// Generate the svg.
var width = 960,
    height = 700,
    radius = Math.min(width, height) / 2,
    color = d3.scale.category20();

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
    .style("fill-rule", "evenodd")

  partitions
    .transition()
      .duration(900)
      .style("fill", function(d) { return color(d.name); });

}

// Defaults.
var s_nodes = 4;
var s_partitions = 32;

// Generate the ring.
function renderRing(s_nodes, s_partitions) {
  var partitions = [];

  for(var i = 0; i <= s_partitions; i++) {
    partitions.push({ id: i, name: "Node " + i % s_nodes });
  }

  console.log(s_nodes);

  // Redraw.
  updateRing({ name: "ring", children: partitions });
}

// Generate initial ring.
renderRing(s_nodes, s_partitions);

// Handle the ring events.
document.getElementById("add-node").addEventListener("click", function() {
  s_nodes++;
  renderRing(s_nodes, s_partitions);
});

document.getElementById("remove-node").addEventListener("click", function() {
  s_nodes--;

  if(s_nodes <= 0) {
    s_nodes = 1;
  }

  renderRing(s_nodes, s_partitions);
});
