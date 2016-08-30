$("document").ready(function(){

	var svg = d3.select("svg").attr("width", 1000).attr("height", 1000),
		width = +svg.attr("width"),
    	height = +svg.attr("height"),
		g = svg.append("g").attr("transform", "translate(40,0)");

	var cluster = d3.cluster()
		.size([height, width-160]);

	function updateWithRetrieve() {
		d3.json("http://localhost/~chris/SkillTree/resources/assets/php/retrieveData.php", function(error, data) {
			if (error) throw error;

			function update(data) {
				svg.selectAll("g").selectAll("*").remove();		
				var stratify = d3.stratify()
					.id(function(d) { 
						var test = d.SkillID;
						return test; 
					})
					.parentId(function(d) { 
						var test = d.ParentID;
						return test;
					});
					(data)
				
				var root = stratify(data);	
				
				cluster(root);
			
				var link = g.selectAll(".link")
				  .data(root.descendants().slice(1))
				.enter().append("path")
				  .attr("class", "link")
				  .attr("d", function(d) {
					var test = "M" + d.y + "," + d.x
						+ "C" + (d.parent.y + 100) + "," + d.x
						+ " " + (d.parent.y + 100) + "," + d.parent.x
						+ " " + d.parent.y + "," + d.parent.x;

					return test;
				  });

				var node = g.selectAll(".node")
					.data(root.descendants())
				.enter().append("g")
					.attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
					.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

				var circle = node.append("circle")
					.attr("r", 10.0);


				var text = node.append("text")
					.attr("type", "text")
					.attr("dy", 3)
					.attr("x", function(d) { return d.children ? -15 : 15; })
					.attr("editable", "simple")
					.style("text-anchor", function(d) { return d.children ? "end" : "start"; })
					.text(function(d) { return d.data.Name; });
				
				circle.on("click", function(d) {
					addNode(data, d);
				});

				node.on("contextmenu", function(d, i) {
					d3.event.preventDefault();
					removeNode(data, d);
				});

				text.on("click", function(d, i, nodes) {
					if ($(".editTxt > input")) {
						$(".editTxt").remove();
					}
					var selectedText = d3.select(this);
					d3.select("body").append("div")
						.attr("class", "editTxt")
						.html(function(d) {
						return "<input type='text' name='editSkillName'><br>";
					});

					var editInput = $(".editTxt > input");

					editInput.focus();
					
					editInput.on("keyup", function(e) {
						if (e.keyCode == 13) {
							updateSkillName(data, d);				
							$(".editTxt").remove();	
						}
					});
				});
			}

			update(data);
		
			function addNode(data, parentNode) {
				var name = "newSkill";
				var parentID = parentNode.data.SkillID

				$.ajax({
					type: "POST",
					url: "../resources/assets/php/skillTree.php",
					data: {
						action: "add",
						name: name,
						parentID, parentID
					},
					success: function() {
						updateWithRetrieve();
					}
				});
			}
			
			function removeNode(data, nodeToRemove) {
				var skillIDArray = [];

				$.each(nodeToRemove.descendants(), function(i, node) {
					skillIDArray.push(node.data.SkillID);
				});

				$.ajax({
					type: "POST",
					url: "../resources/assets/php/skillTree.php",
					data: {
						action: "remove",
						skillIDArray: skillIDArray
					},
					success: function() {
						updateWithRetrieve();
					}
				});
			}

			function updateSkillName(data, node) {
				var name = $("input[name='editSkillName']").val();
				var skillID = node.data.SkillID; 

				$.ajax({
					type: "POST",
					url: "../resources/assets/php/skillTree.php",
					data: {
						action: "edit",
						skillID: skillID,
						name: name
					},
					success: function(data) {
						updateWithRetrieve();
					}
				});
			}

			function retrieveData() {
				$.ajax({
					type: "GET",
					url: "../resources/assets/php/retrieveData.php",
					datatype: "json",
					success: function() {
						alert("DATA RETRIEVED");
					},
					error: function() {
						alert("ERROR OCCURRED");
					}
				});
			}

			$(function() {
			    $("form").submit(function() { return false; });
			});
		});
	}

	updateWithRetrieve();
});
