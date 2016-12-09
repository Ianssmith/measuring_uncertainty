var margin = {top: 40, right: 20, bottom: 20, left: 40}
var w = 1200-margin.left-margin.right;
var h = 600-margin.top-margin.bottom;
var pad = 10;


d3.queue()
	.defer(d3.tsv, "a.tsv")
	.defer(d3.tsv, "w.tsv")
	.await(analyze)

function analyze(error,A,W){
	if(error){console.log(error)}
	
	console.log(A)//Asthma
	console.log(W)//Well Visit

	A.forEach(function(d){
		for(var i =0;i<A.length;i++){
			d.wc = d.comment_corp.split(" ").length
		}
	})

	W.forEach(function(d){
		for(var i =0;i<W.length;i++){
			d.wc = d.comment_corp.split(" ").length
		}
	})




	var maxScore = d3.max(A,function(d){return +d.Sentiment_score})
	var minScore = d3.min(A,function(d){return +d.Sentiment_score});

	//var agrade_yscale = 

	var a_yscale = d3.scaleLinear().domain(d3.extent(A, function(d){return +d.Sentiment_score})).range([h+pad,0-pad])
	var a_xscale = d3.scaleLinear().domain(d3.extent(A, function(d){return +d.usp_as_visit_length})).range([0+margin.left*2,w+pad])


	var wgrade_yscale = d3.scaleOrdinal().domain([3,2,1,0]).range([0,h/4,(h/4)*3,h])

	var w_yscale = d3.scaleLinear().domain(d3.extent(W, function(d){return +d.Sentiment_score})).range([h+pad,0-pad])
	var w_xscale = d3.scaleLinear().domain(d3.extent(W, function(d){return +d.usp_wv_visit_length})).range([0+margin.left*2,w+pad])

	var xAxis = d3.axisBottom(w_xscale)
	var yAxis = d3.axisLeft(a_yscale)

	var div = d3.select("#fancy-chart").append("div")	
		.style("position","absolute")
		.attr("class", "tooltip")				
		.style("opacity", 0);


	var svg = d3.select("#fancy-chart")
		.append("svg")
		.attr("width", w+margin.right+margin.left)
		.attr("height", h)
		.style("background", "#FF4136")
		.style("padding", margin.left+"px")
		.style("margin", margin.left+"px")
		.attr("transform", "translate(70,0)")
		.style("border", "0.5px solid #FFDC00");
		
	
	svg.append("g")
		.attr("class", "x_axis")
		.attr("transform", "translate(0,560)")
		.call(xAxis);

	svg.append("text")
		.attr("class", "xlabel")
		.attr("x",w/2)
		.attr("y",h -5)
		.style("text-anchor","middle")
		.style("font-weight","bold")
		.style("font-size", "26px")
		.text("Visit Length");

	svg.append("g")
		.attr("class", "y_axis")
		.attr("transform", "translate(30,0)")
		.call(yAxis);

	svg.append("text")
		.attr("class", "ylabel")
		.attr("transform", "rotate(-90)")
		.attr("x",-160)
		.attr("y",-10)
		.style("text-anchor","end")
		.style("font-weight","bold")
		.style("font-size", "26px")
		.text("Sentiment score");

	/*
	var updateA = svg.selectAll('g')
		.data(A).enter()
		.append('g')
		;
	var updateW = svg.selectAll('g')
		.data(W).enter()
		.append('g')
		;
	*/

/////// Well visit = black

	var well = svg.selectAll("ellipse")
		.data(W)
		.enter()
		.append("ellipse")
		.attr("cx", 0)
		.attr("cy", 0)
		.attr("rx", 0)
		.attr("ry", 0)
		.transition()
		//.delay(100)
		.delay(function(d,i){return i*4;})
		.duration(2000)
		.attr("cx", function(d,i){return w_xscale(+d.usp_wv_visit_length)})//participant_id)})
		.attr("cy", function(d){return w_yscale(+d.Sentiment_score)})
		.attr("rx", 4)
		.attr("ry", 4)
		.attr("fill", "#111111");

		d3.selectAll("ellipse").on("mouseover", function(d){
			d3.select(this).transition()
				//.style("opacity",1.0)
				.style("stroke", "white")
				.attr("rx", 6)
				.attr("ry", 6)
			div.transition()
				.style("background","#eeeeee")
				.style("border-radius","3px")
				.style("padding","2px")
				.style("color", "black")
				.style("opacity", 0.9);
			div.html(d.wc + " words -:- " + d.usp_wv_global_clinic + " out of 3")
				.style("left", (d3.event.pageX) + "px")
				.style("top", (d3.event.pageY - 28) + "px");

		})	
		svg.selectAll("ellipse").on("mouseout", function(){
			d3.select(this)
			.transition()
			.duration(1000)
			.style("stroke", "none")
			.attr("cx", function(d,i){return w_xscale(+d.usp_wv_visit_length)})//participant_id)})
			.attr("cy", function(d){return w_yscale(+d.Sentiment_score)})
			.attr("rx", 4)
			.attr("ry", 4)
			.attr("fill", "#111111")
		div.transition()
			.style("opacity",0)
		});


/////// Asthma = blueish

	var asth = svg.selectAll("circle")
		.data(A)
		.enter()
		.append("circle")
		.attr("cx",0)
		.attr("cy",0)
		.attr("r", 0)
		.transition()
		.delay(function(d,i){return i*4;})
		.duration(2000)
		.attr("cx", function(d,i){return a_xscale(+d.usp_as_visit_length)})//participant_id)})
		.attr("cy", function(d){return a_yscale(+d.Sentiment_score)})
		.attr("r", 4)
		.attr("fill", "#7FDBFF");

		d3.selectAll("circle").on("mouseover", function(d){
			d3.select(this).transition()
				//.style("opacity",1.0)
				.style("stroke", "white")
				.attr("r", 6)
			div.transition()
				.style("background","#eeeeee")
				.style("border-radius","3px")
				.style("padding","2px")
				.style("color", "black")
				.style("opacity", 0.9);
			div.html(d.wc + " words -:- " + d.usp_as_global_clinic + " out of 3")
				.style("left", (d3.event.pageX) + "px")
				.style("top", (d3.event.pageY - 28) + "px");
			/*
			pidiv.transition()
				.style("color", "white")
				.style("opacity", 0.9);
			pidiv.html(d.percity)
				.style("left", (d3.event.pageX) + "px")
				.style("top", (d3.event.pageY - 30)+ "px");
			*/

		})	

		svg.selectAll("circle").on("mouseout", function(){
			d3.select(this)
			.transition()
			.duration(1000)
			.style("stroke", "none")
			.attr("cx", function(d,i){return a_xscale(+d.usp_as_visit_length)})//participant_id)})
			.attr("cy", function(d){return a_yscale(+d.Sentiment_score)})
			.attr("r", 4)
			.attr("fill", "#7FDBFF")
		div.transition()
			.style("opacity",0)
		});


	d3.select("#WC").on("click",function(){
		d3.selectAll("ellipse")
		.transition()
			.duration(1200)
			.style("stroke", "none")
			.style("opacity",1)
			.attr("cx", function(d,i){return w_xscale(+d.usp_wv_visit_length)})//participant_id)})
			.attr("cy", function(d){return w_yscale(+d.Sentiment_score)})
			.attr("rx", function(d){return d.wc/100})
			.attr("ry", function(d){return d.wc/100})
			.attr("fill", "#111111");
		d3.selectAll("circle")
		.transition()
			.duration(1200)
			.style("stroke", "none")
			.style("opacity",.75)
			.attr("cx", function(d,i){return a_xscale(+d.usp_as_visit_length)})//participant_id)})
			.attr("cy", function(d){return a_yscale(+d.Sentiment_score)})
			.attr("r", function(d){return d.wc/100})
			.attr("fill", "#7FDBFF");
			})


	d3.select("#grade").on("click",function(){
		d3.selectAll("ellipse")
			.transition()
			.duration(2000)
			.style("opacity",1)
			.style("stroke", "none")
			.attr("cx", function(d,i){return w_xscale(+d.usp_wv_visit_length)})//participant_id)})
			.attr("cy", function(d){return wgrade_yscale(+d.usp_wv_global_clinic)})
			.attr("rx",4)
			.attr("ry",4)
			//.attr("rx", function(d){return d.wc/100})
			//.attr("ry", function(d){return d.wc/100})
			.attr("fill", "#111111");
		d3.selectAll("circle")
			.transition()
			.duration(2000)
			.style("opacity",.75)
			.style("stroke", "none")
			.attr("cx", function(d,i){return a_xscale(+d.usp_as_visit_length)})//participant_id)})
			.attr("cy", function(d){return wgrade_yscale(+d.usp_as_global_clinic)})
			.attr("r",4)
			//.attr("r", function(d){return d.wc/100})
			.attr("fill", "#7FDBFF");
		})
			
				



}

