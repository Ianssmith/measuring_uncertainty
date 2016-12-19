var margin = {top: 40, right: 0, bottom: 0, left: 40}
var w = 1200-margin.left-margin.right;
var h = 600-margin.top-margin.bottom;
var pad = 10;


d3.queue()
	.defer(d3.tsv, "ap.tsv")
	.defer(d3.tsv, "wp.tsv")
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




	//var maxScore = d3.max(W,function(d){return +d.usp_wv_visit_length})
	var maxScore = d3.max(W,function(d){return +d.Sentiment_score})
	//max sentiment asthma = 46
	//max sentiment well = 80

	//max wc asthma = 752
	//max wc well = 829

	//max visitlength asthma = 120
	//max visitlength well = 160
	console.log(maxScore)
	//var minScore = d3.min(W,function(d){return +d.usp_wv_visit_length});
	var minScore = d3.min(W,function(d){return +d.Sentiment_score});
	//min sentiment asthma = -11
	//min sentiment well = -11

	//min wc asthma = 1
	//min wc well = 1

	//min visitlength asthma = 0
	//min visitlength well = 15
	console.log(minScore)

var mean = 12.1139 //well
var stddev = 15.0258 //well

var Amean = 7.29697
var Astddev = 11.0594


	//var agrade_yscale = 
//asthma scales

	var a_yscale = d3.scaleLinear().domain(d3.extent(A, function(d){return +d.Sentiment_score})).range([h+pad,0-pad])
	var a_xscale = d3.scaleLinear().domain(d3.extent(A, function(d){return +d.usp_as_visit_length})).range([0+margin.left*2,w+pad])

	var wc_a_xscale = d3.scaleLinear().domain(d3.extent(A, function(d){return +d.wc})).range([0+margin.left*2,w+pad])
	var id_a_xscale = d3.scaleLinear().domain(d3.extent(A, function(d,i){return i})).range([0+margin.left*2,w-70])



//well visit scales
	var w_yscale = d3.scaleLinear().domain(d3.extent(W, function(d){return +d.Sentiment_score})).range([h-pad,0-pad])
	var w_xscale = d3.scaleLinear().domain(d3.extent(W, function(d){return +d.usp_wv_visit_length})).range([0+margin.left*2,w+pad])

	var wc_w_xscale = d3.scaleLinear().domain(d3.extent(W, function(d){return +d.wc})).range([0+margin.left*2,w+pad])
	var id_w_xscale = d3.scaleLinear().domain(d3.extent(W, function(d,i){return i})).range([0+margin.left*2,w-70])
	var id2_w_xscale = d3.scaleLinear().domain(d3.extent(W, function(d,i){return +d.participant_id})).range([0+margin.left*2,w+pad])


	//var wgrade_yscale = d3.scaleOrdinal().domain([3,2,1,0]).range([0,h/4,(h/4)*3,h-5])
	var wgrade_yscale = d3.scaleOrdinal().domain([3,2,1,0]).range([w_yscale(mean+stddev),w_yscale(mean),w_yscale(mean-stddev),w_yscale(mean-(2*stddev))])
	var agrade_yscale = d3.scaleOrdinal().domain([3,2,1,0]).range([a_yscale(Amean+Astddev),a_yscale(Amean),a_yscale(Amean-Astddev),a_yscale(Amean-(2*Astddev))])

	var xAxis = d3.axisBottom(id_w_xscale)
	var AxAxis = d3.axisBottom(id_a_xscale)
	var yAxis = d3.axisLeft(w_yscale)
	var AyAxis = d3.axisLeft(a_yscale)
	var gradeyAxis = d3.axisLeft(wgrade_yscale)
	var agradeyAxis = d3.axisLeft(agrade_yscale)

	var wdevAxis = d3.axisRight(wgrade_yscale)
	var adevAxis = d3.axisRight(agrade_yscale)


	var div = d3.select("#fancy-chart").append("div")	
		.style("position","absolute")
		.attr("class", "tooltip")				
		.style("opacity", 0);

	d3.select("body")
		.style("background-color", "#ffffff")

	var svg = d3.select("#fancy-chart")
		.append("svg")
		.attr("width", w+margin.right+margin.left)
		.attr("height", h)
		.style("background", "#fd6925")//"#FF4136")
		.style("padding", margin.left+"px")
		.style("margin", margin.left+"px")
		.style("margin-bottom", "0px")
		.attr("transform", "translate(70,0)")
		.style("border", "none");
		//.style("border", "0.5px solid #FFDC00");
		
	
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
var wellgroup = svg.append("g").attr("transform", "translate(70,0)")//"translate("+margin.left+","+margin.top+")");
var asthgroup = svg.append("g").attr("transform", "translate(70,0)")//"translate("+margin.left+","+margin.top+")");

d3.select(".well").on("click",function(){

//remove previous graph

asthgroup.selectAll("g").transition().duration(2000)
	.style("opacity",0)
	.remove();
asthgroup.selectAll("ellipse").transition().duration(2000)
	.style("opacity",0)
	.remove();
asthgroup.selectAll("line").transition().duration(2000)
	.style("opacity",0)
	.remove();
svg.select("g.x_axis").transition().duration(2000)
	.style("opacity",0)
	.remove()
svg.select("g.y_axis").transition().duration(2000)
	.style("opacity",0)
	.remove()
svg.select("text.xlabel").transition().duration(2000)
	.style("opacity",0)
	.remove()
svg.select("text.ylabel").transition().duration(2000)
	.style("opacity",0)
	.remove()
svg.select("g.grade_axis").transition().duration(2000)
	.style("opacity",0)
	.remove()
svg.select("g.stddev_axis").transition().duration(2000)
	.style("opacity",0)
	.remove()

svg.select("text.grade_label").transition().duration(2000)
	.style("opacity",0)
	.remove()

//axes well group


	svg.append("g")
		.attr("class", "x_axis")
		.attr("transform", "translate(70,560)")
		.call(xAxis);

	svg.append("text")
		.attr("class", "xlabel")
		.attr("x",w/2)
		.attr("y",h+37)
		.style("fill","black")
		.style("text-anchor","middle")
		.style("font-weight","bold")
		.style("font-size", "26px")
		.text("Visits");

	svg.append("g")
		.attr("class", "y_axis")
		.attr("transform", "translate(70,0)")
		//.style("fill", "white")
		.call(yAxis);

	svg.append("text")
		.attr("class", "ylabel")
		.attr("transform", "rotate(-90)")
		.attr("x",-60)
		.attr("y",45)
		.style("text-anchor","end")
		.style("font-weight","bold")
		.style("font-size", "26px")
		.style("fill", "white")
		.text("Sentiment Score");

	svg.append("g")
		.attr("class", "grade_axis")
		.attr("transform", "translate(10,0)")
		//.style("stroke", "#7FDBFF")
		.call(gradeyAxis);

	svg.append("text")
		.attr("class", "grade_label")
		.attr("transform", "rotate(-90)")
		.attr("x",-300)
		.attr("y",-10)
		.style("text-anchor","end")
		.style("font-weight","bold")
		.style("font-size", "26px")
		.style("fill", "#7FDBFF")
		.text("Grade Score 0-3");

	svg.append("g")
		.attr("class", "stddev_axis")
		.attr("transform", "translate(1210,0)")
		.style("stroke", "#ffffff")
		.call(wdevAxis);
/*
	svg.append("text")
		.attr("class", "stddev_label")
		.attr("transform", "rotate(90)")
		.attr("x",470)
		.attr("y",-1210)
		.style("text-anchor","end")
		.style("font-weight","regular")
		.style("font-size", "16px")
		.style("fill", "#ffffff")
		.text("Mean and standard deviations of Sentiment Score");
*/

//chart well group

wellgroup.selectAll("g")
	.data(W)
	.enter().append("g")
		.attr("class", function(d,i){return "wellvisitor"+i;})
	.append("circle")
		.attr("cx", function(d,i){return id_w_xscale(i)})
		.attr("cy", h)
		.attr("r", 0)
		.transition()
		.delay(function(d,i){return i*4;})
		.duration(2000)
		//.attr("cx", function(d,i){return w_xscale(+d.usp_wv_visit_length)})//participant_id)})
		//.attr("cx", function(d,i){return wc_w_xscale(+d.wc)})//participant_id)})
		//.attr("cx", function(d,i){return id2_w_xscale(+d.participant_id)})
		.attr("cx", function(d,i){return id_w_xscale(i)})
		.attr("cy", function(d,i){return w_yscale(+d.Sentiment_score)})
		.attr("r", 4)
		.style("opacity",.75)
		.attr("fill", "#ffffff");

	wellgroup.selectAll("ellipse")
		.data(W)
		.enter()
		.append("ellipse")
		.attr("cx",function(d,i){return id_w_xscale(i)})
		.attr("cy",0)
		.attr("rx", 0)
		.attr("ry", 0)
		.transition()
		.delay(2000)
		.transition()
		.delay(function(d,i){return i*4;})
		.duration(3000)
		//.attr("cx", function(d,i){return w_xscale(+d.usp_wv_visit_length)})//participant_id)})
		//.attr("cx", function(d,i){return wc_w_xscale(+d.wc)})//participant_id)})
		//.attr("cx", function(d,i){return id_a_xscale(+d.participant_id)})

		//.attr("cx", function(d,i){return id2_w_xscale(+d.participant_id)})
		//.attr("cy", function(d){return w_yscale(+d.Sentiment_score)})

		.attr("cx", function(d,i){return id_w_xscale(i)})
		.attr("cy", function(d){return wgrade_yscale(+d.usp_wv_global_clinic)})
		.attr("rx", 4)
		.attr("ry", 4)
		.style("opacity",.6)
		.attr("fill", "#7FDBFF");

	wellgroup.selectAll("line")
		.data(W)
		.enter()
		.append("line")
		.attr("class", "wline")
		//.attr("x1", function(d,i){return w_xscale(+d.usp_wv_visit_length)})//participant_id)})
		.attr("x1",function(d,i){return id_w_xscale(i)})
		//.attr("x1",function(d,i){return id2_w_xscale(+d.participant_id)})
		//.attr("x1", function(d,i){return wc_w_xscale(+d.wc)})//participant_id)})
		//.attr("x2", function(d,i){return w_xscale(+d.usp_wv_visit_length)})//participant_id)})
		.attr("x2",function(d,i){return id_w_xscale(i)})
		//.attr("x2",function(d,i){return id2_w_xscale(+d.participant_id)})
		//.attr("x2", function(d,i){return wc_w_xscale(+d.wc)})//participant_id)})
		.attr("y1",function(d){return w_yscale(+d.Sentiment_score)})//wgrade_yscale(+d.usp_wv_global_clinic)})
		.attr("y2",function(d){return w_yscale(+d.Sentiment_score)})//wgrade_yscale(+d.usp_wv_global_clinic)})
		.transition()
		.delay(4500)
		.transition()
		.delay(function(d,i){return i*8;})
		.duration(3000)
		.style("stroke", function(d,i){if(w_yscale(+d.Sentiment_score) > wgrade_yscale(+d.usp_wv_global_clinic)){return "black"}else{return "FFDC00"}})
		.style("stroke-width", "0.75px")
		//.attr("x1", function(d,i){return w_xscale(+d.usp_wv_visit_length)})//participant_id)})
		.attr("x1",function(d,i){return id_w_xscale(i)})
		//.attr("x1",function(d,i){return id2_w_xscale(+d.participant_id)})
		//.attr("x1", function(d,i){return wc_w_xscale(+d.wc)})//participant_id)})
		//.attr("x2", function(d,i){return w_xscale(+d.usp_wv_visit_length)})//participant_id)})
		.attr("x2",function(d,i){return id_w_xscale(i)})
		//.attr("x2",function(d,i){return id2_w_xscale(+d.participant_id)})
		//.attr("x1", function(d,i){return wc_w_xscale(+d.wc)})//participant_id)})
		.attr("y1",function(d){return w_yscale(+d.Sentiment_score)})
		.attr("y2",function(d){return wgrade_yscale(+d.usp_wv_global_clinic)})


		svg.selectAll("ellipse").on("mouseover", function(d){
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
			div.html(d.wc + " words <br>- " + d.usp_wv_global_clinic + " out of 3<br>Sentiment Score: "+d.Sentiment_score)
				.style("left", (d3.event.pageX) -60+ "px")
				.style("top", (d3.event.pageY) -90+ "px");

		})	
		svg.selectAll("ellipse").on("mouseout", function(){
			d3.select(this)
			.transition()
			.style("opacity",.75)
			.style("stroke", "none")
			//.attr("cx", function(d,i){return w_xscale(+d.usp_wv_visit_length)})//participant_id)})
			//.attr("cy", function(d){return w_yscale(+d.Sentiment_score)})
			.attr("rx", 4)
			.attr("ry", 4)
			.attr("fill", "#7FDBFF")
		div.transition()
			.style("opacity",0)

		});




		svg.selectAll("circle").on("mouseover", function(d){
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
			div.html(d.wc + " words <br>- " + d.usp_wv_global_clinic + " out of 3<br>Sentiment Score: "+d.Sentiment_score)
				.style("left", (d3.event.pageX) -60+ "px")
				.style("top", (d3.event.pageY) -90+ "px");
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
			.style("opacity",.75)
			.style("stroke", "none")
			//.attr("cx", function(d,i){return a_xscale(+d.usp_as_visit_length)})//participant_id)})
			//.attr("cy", function(d){return a_yscale(+d.Sentiment_score)})
			.attr("r", 4)
			.attr("fill", "white")
		div.transition()
			.style("opacity",0)
		});

d3.select(".removeP").on("click", function(){
	svg.selectAll("line.wline")
		.transition()
		.duration(2000)
		//.attr("y1",function(d){return w_yscale(+d.Sentiment_score)})
		.attr("y2", function(d,i){if(w_yscale(+d.Sentiment_score) > wgrade_yscale(+d.usp_wv_global_clinic)){return w_yscale(+d.Sentiment_score)}else{return wgrade_yscale(+d.usp_wv_global_clinic)}})
	})

d3.select(".removeN").on("click", function(){
	svg.selectAll("line.wline")
		.transition()
		.duration(2000)
		//.attr("y1",function(d){return w_yscale(+d.Sentiment_score)})
		.attr("y2", function(d,i){if(w_yscale(+d.Sentiment_score) > wgrade_yscale(+d.usp_wv_global_clinic)){return wgrade_yscale(+d.usp_wv_global_clinic)}else{return w_yscale(+d.Sentiment_score)}})
	})

})


///////WELL SECTION ^^^^^


///////ASTHMA SECTION VVVVV


d3.select(".asth").on("click",function(){

//remove old group

wellgroup.selectAll("g").transition().duration(2000)
	.style("opacity",0)
	.remove();
wellgroup.selectAll("ellipse").transition().duration(2000)
	.style("opacity",0)
	.remove();
wellgroup.selectAll("line").transition().duration(2000)
	.style("opacity",0)
	.remove();
svg.select("g.x_axis").transition().duration(2000)
	.style("opacity",0)
	.remove()
svg.select("g.y_axis").transition().duration(2000)
	.style("opacity",0)
	.remove()
svg.select("text.xlabel").transition().duration(2000)
	.style("opacity",0)
	.remove()
svg.select("text.ylabel").transition().duration(2000)
	.style("opacity",0)
	.remove()
svg.select("g.grade_axis").transition().duration(2000)
	.style("opacity",0)
	.remove()
svg.select("text.grade_label").transition().duration(2000)
	.style("opacity",0)
	.remove()
svg.select("g.stddev_axis").transition().duration(2000)
	.style("opacity",0)
	.remove()
//axes asthma group


	svg.append("g")
		.attr("class", "x_axis")
		.attr("transform", "translate(70,575)")
		.call(AxAxis);

	svg.append("text")
		.attr("class", "xlabel")
		.attr("x",w/2)
		.attr("y",h+37)
		.style("fill","black")
		.style("text-anchor","middle")
		.style("font-weight","bold")
		.style("font-size", "26px")
		.text("Visits");

	svg.append("g")
		.attr("class", "y_axis")
		.attr("transform", "translate(70,0)")
		//.style("stroke", "black")
		.call(AyAxis);

	svg.append("text")
		.attr("class", "ylabel")
		.attr("transform", "rotate(-90)")
		.attr("x",-60)
		.attr("y",45)
		.style("text-anchor","end")
		.style("font-weight","bold")
		.style("font-size", "26px")
		.style("fill", "#01FF70")
		.text("Sentiment Score");

	svg.append("g")
		.attr("class", "grade_axis")
		.attr("transform", "translate(10,0)")
		//.style("stroke", "#0074D9")
		.call(agradeyAxis);

	svg.append("text")
		.attr("class", "grade_label")
		.attr("transform", "rotate(-90)")
		.attr("x",-300)
		.attr("y",-10)
		.style("text-anchor","end")
		.style("font-weight","bold")
		.style("font-size", "26px")
		.style("fill", "#0074D9")
		.text("Grade Score 0-3");

	svg.append("g")
		.attr("class", "stddev_axis")
		.attr("transform", "translate(1210,0)")
		.style("stroke", "#ffffff")
		.call(adevAxis);
/*
	svg.append("text")
		.attr("class", "stddev_label")
		.attr("transform", "rotate(90)")
		.attr("x",470)
		.attr("y",-1210)
		.style("text-anchor","end")
		.style("font-weight","regular")
		.style("font-size", "16px")
		.style("fill", "#ffffff")
		.text("Mean and standard deviations of Sentiment Score");
*/

//chart well group

wellgroup.selectAll("g")
	.data(W)
	.enter().append("g")
		.attr("class", function(d,i){return "wellvisitor"+i;})
	.append("circle")

//chart asthma group

asthgroup.selectAll("g")
	.data(A)
	.enter().append("g")
		.attr("class", function(d,i){return "asthvisitor"+i;})
	.append("circle")
		.attr("cx",function(d,i){return id_a_xscale(i)})
		.attr("cy",0)
		.attr("r", 0)
		.transition()
		.delay(function(d,i){return i*4;})
		.duration(2000)
		//.attr("cx", function(d,i){return w_xscale(+d.usp_wv_visit_length)})//participant_id)})
		//.attr("cx", function(d,i){return wc_w_xscale(+d.wc)})//participant_id)})
		//.attr("cx", function(d,i){return id_a_xscale(+d.participant_id)})

		//.attr("cx", function(d,i){return id2_w_xscale(+d.participant_id)})
		//.attr("cy", function(d){return w_yscale(+d.Sentiment_score)})

		.attr("cx", function(d,i){return id_a_xscale(i)})
		.attr("cy", function(d,i){return a_yscale(+d.Sentiment_score)})
		.attr("r", 4)
		.style("opacity",.6)
		.attr("fill", "#01FF70");

asthgroup.selectAll("ellipse")
		.data(A)
		.enter()
		.append("ellipse")
		.attr("cx",function(d,i){return id_a_xscale(i)})
		.attr("cy",0)
		.attr("rx", 0)
		.attr("ry", 0)
		.transition()
		.delay(2000)
		.transition()
		.delay(function(d,i){return i*4;})
		.duration(3000)
		//.attr("cx", function(d,i){return w_xscale(+d.usp_wv_visit_length)})//participant_id)})
		//.attr("cx", function(d,i){return wc_w_xscale(+d.wc)})//participant_id)})
		//.attr("cx", function(d,i){return id_a_xscale(+d.participant_id)})

		//.attr("cx", function(d,i){return id2_w_xscale(+d.participant_id)})
		//.attr("cy", function(d){return w_yscale(+d.Sentiment_score)})

		.attr("cx", function(d,i){return id_a_xscale(i)})
		.attr("cy", function(d){return agrade_yscale(+d.usp_as_global_clinic)})
		.attr("rx", 4)
		.attr("ry", 4)
		.style("opacity",.75)
		.attr("fill", "#0074D9");

asthgroup.selectAll("line")
		.data(A)
		.enter()
		.append("line")
		.attr("class", "aline")
		//.attr("x1", function(d,i){return w_xscale(+d.usp_wv_visit_length)})//participant_id)})
		.attr("x1",function(d,i){return id_a_xscale(i)})
		//.attr("x1",function(d,i){return id2_w_xscale(+d.participant_id)})
		//.attr("x1", function(d,i){return wc_w_xscale(+d.wc)})//participant_id)})
		//.attr("x2", function(d,i){return w_xscale(+d.usp_wv_visit_length)})//participant_id)})
		.attr("x2",function(d,i){return id_a_xscale(i)})
		//.attr("x2",function(d,i){return id2_w_xscale(+d.participant_id)})
		//.attr("x2", function(d,i){return wc_w_xscale(+d.wc)})//participant_id)})
		.attr("y1",function(d){return a_yscale(+d.Sentiment_score)})//agrade_yscale(+d.usp_as_global_clinic)})
		.attr("y2",function(d){return a_yscale(+d.Sentiment_score)})//agrade_yscale(+d.usp_as_global_clinic)})
		.transition()
		.delay(4500)
		.transition()
		.delay(function(d,i){return i*8;})
		.duration(3000)
		.style("stroke",function(d,i){if(a_yscale(+d.Sentiment_score) > agrade_yscale(+d.usp_as_global_clinic)){return "black"}else{return "#FFDC00"}})
		.style("stroke-width", "0.75px")
		//.attr("x1", function(d,i){return w_xscale(+d.usp_wv_visit_length)})//participant_id)})
		.attr("x1",function(d,i){return id_a_xscale(i)})
		//.attr("x1",function(d,i){return id2_w_xscale(+d.participant_id)})
		//.attr("x1", function(d,i){return wc_w_xscale(+d.wc)})//participant_id)})
		//.attr("x2", function(d,i){return w_xscale(+d.usp_wv_visit_length)})//participant_id)})
		.attr("x2",function(d,i){return id_a_xscale(i)})
		//.attr("x2",function(d,i){return id2_w_xscale(+d.participant_id)})
		//.attr("x1", function(d,i){return wc_w_xscale(+d.wc)})//participant_id)})
		.attr("y1",function(d){return a_yscale(+d.Sentiment_score)})
		.attr("y2",function(d){return agrade_yscale(+d.usp_as_global_clinic)})

		svg.selectAll("ellipse").on("mouseover", function(d){
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
			div.html(d.wc + " words <br>- " + d.usp_as_global_clinic + " out of 3<br>Sentiment Score: "+d.Sentiment_score)
				.style("left", (d3.event.pageX) -60+ "px")
				.style("top", (d3.event.pageY) -90+ "px");

		})	
		svg.selectAll("ellipse").on("mouseout", function(){
			d3.select(this)
			.transition()
			.style("opacity",.75)
			.style("stroke", "none")
			//.attr("cx", function(d,i){return w_xscale(+d.usp_wv_visit_length)})//participant_id)})
			//.attr("cy", function(d){return w_yscale(+d.Sentiment_score)})
			.attr("rx", 4)
			.attr("ry", 4)
			.attr("fill", "#0074D9")
		div.transition()
			.style("opacity",0)
		});




		svg.selectAll("circle").on("mouseover", function(d){
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
			div.html(d.wc + " words <br>- " + d.usp_as_global_clinic + " out of 3<br>Sentiment Score: "+d.Sentiment_score)
				.style("left", (d3.event.pageX) -60+ "px")
				.style("top", (d3.event.pageY) -90+ "px");

		})	

		svg.selectAll("circle").on("mouseout", function(){
			d3.select(this)
			.transition()
			.style("opacity",.75)
			.style("stroke", "none")
			//.attr("cx", function(d,i){return a_xscale(+d.usp_as_visit_length)})//participant_id)})
			//.attr("cy", function(d){return a_yscale(+d.Sentiment_score)})
			.attr("r", 4)
			.attr("fill", "#01FF70") /////*****green
		div.transition()
			.style("opacity",0)
		});

d3.select(".removeP").on("click", function(){
	svg.selectAll("line.aline")
		.transition()
		.duration(2000)
		//.attr("y1",function(d){return w_yscale(+d.Sentiment_score)})
		.attr("y2", function(d,i){if(a_yscale(+d.Sentiment_score) > agrade_yscale(+d.usp_as_global_clinic)){return a_yscale(+d.Sentiment_score)}else{return agrade_yscale(+d.usp_as_global_clinic)}})
	})

d3.select(".removeN").on("click", function(){
	svg.selectAll("line.aline")
		.transition()
		.duration(2000)
		//.attr("y1",function(d){return w_yscale(+d.Sentiment_score)})
		.attr("y2", function(d,i){if(a_yscale(+d.Sentiment_score) > agrade_yscale(+d.usp_as_global_clinic)){return agrade_yscale(+d.usp_as_global_clinic)}else{return a_yscale(+d.Sentiment_score)}})
	})

})




	d3.select("#WC").on("click",function(){
		d3.selectAll("ellipse")
		.transition()
			.duration(1200)
			.style("stroke", "none")
			.attr("rx", function(d){return d.wc/75})
			.attr("ry", function(d){return d.wc/75})
		d3.selectAll("circle")
		.transition()
			.duration(1200)
			.style("stroke", "none")
			.attr("r", function(d){return d.wc/75})
			})

				
				



}


