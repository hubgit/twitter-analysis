var chart = function(text) {
    var values = event.target.result.split(/\n+/).map(function(item) {
        try {
            return JSON.parse(item)
        } catch (e) {
            console.log(e, item);
            return {};
        }
    }).filter(function(item) {
        return item.created_at;
    }).map(function(item) {
        try {
            return new Date(item.created_at);
        } catch (e) {
            console.log(e, item);
            return null;
        }
    }).filter(function(item) {
        return item;
    });

    var minDate = new Date(Math.min.apply(null, values));
    var maxDate = new Date(Math.max.apply(null, values));

    var bins = 20;

    var formatCount = d3.format(',.0f');
    var formatDate = d3.time.format('%y-%m-%d');

    var width = 800;
    var height = 400;

    var x = d3.time.scale()
        .domain([maxDate, minDate])
        .range([0, width]);

    var data = d3.layout.histogram()
        .bins(x.ticks(bins))(values);

    var y = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d.y; })])
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom')
        .tickFormat(formatDate);

    var svg = d3.select('body').append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g');

    var bar = svg.selectAll('.bar')
        .data(data)
      .enter().append('g')
        .attr('class', 'bar')
        .attr('transform', function(d) { return 'translate(' + x(d.x) + ',' + y(d.y) + ')'; });

    bar.append('rect')
        .attr('x', 1)
        .attr('width', x(data[0].dx) - 1)
        .attr('height', function(d) { return height - y(d.y); });

    bar.append('text')
        .attr('dy', '.75em')
        .attr('y', 6)
        .attr('x', x(data[0].dx) / 2)
        .attr('text-anchor', 'middle')
        .text(function(d) { return formatCount(d.y); });

    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);
}