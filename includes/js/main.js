$(function(){ // document ready
	var normalOptions={
		chart:{
			type:'areaspline',
			marginRight:60,
			marginBottom:20,
			marginLeft:35,
			spacing:[25,0,0,20]
		},
		legend:{
			layout:'vertical',
			enabled:true,
			align:'left',
			verticalAlign:'top'
		},
		exporting:{
			buttons:{
				contextButton:{
					menuItems:[
						{textKey:'downloadJPEG',onclick:function(){this.exportChart({type:'image/jpeg'});}},
						{textKey:'downloadPDF',onclick:function(){this.exportChart({type:'application/pdf'});}},
						{textKey:'downloadCSV',onclick:function(){this.downloadCSV();}},
						{textKey:'downloadXLS',onclick:function(){this.downloadXLS();}}
					]
				}
			}
		},
		navigator:{enabled:false},
		scrollbar:{enabled:false},
		rangeSelector:{
			inputEnabled:false,
			selected:0,
			allButtonsEnabled:true,
			buttons:[
				{type:'day',count:1,text:'1d'},
				{type:'week',count:1,text:'1w'},
				{type:'month',count:1,text:'1m'},
				{type:'month',count:3,text:'3m'}
			]
		},
		plotOptions:{series:{dataGrouping:{enabled:true}}},
		xAxis:{
			type:'datetime',
			visible:true,
			labels:{enabled:true}
		},
		yAxis:{
			visible:true,
			opposite:false,
			labels:{enabled:true}
		},
		series:[{data:[]}]
	};
	var sparkOptions={
		chart:{type:'areaspline'},
		exporting:{enabled:false},
		tooltip:{pointFormat:'<span style="color:{point.color}">\u25CF</span> <b>{point.y}</b><br/>',},
		series:[{data:[]}]
	};
	// mis llamadas
	var activosFIEL={series:"fiel",property:"activos"};
	intentosChart=Highcharts.stockChart("1",normalOptions);
	function update(){
		var x = (new Date()).getTime();
		$.post('includes/php/render.php',intentosAUTH,function(result){
			intentosChart.series[0].setData(result);
			intentosChart.legend.allItems[0].update({name:"Intentos"});
			intentosChart.redraw();
		},"json");
		$.post('includes/php/render.php',activosFIEL,function(result){
			fielChart.series[0].setData(result);
			fielChart.legend.allItems[0].update({name:"Activos"});
			fielChart.redraw();
		},"json");
		$.post('includes/php/render.php',autenticadosFIEL,function(result){
			fielChart.series[1].setData(result);
			fielChart.legend.allItems[1].update({name:"Autenticados"});
			fielChart.redraw();
		},"json");
		$.post('includes/php/render.php',noautenticadosFIEL,function(result){
			authChart.series[0].setData(result);
			authChart.legend.allItems[0].update({name:"No Autenticado"});
			authChart.redraw();
		},"json");
		$.post('includes/php/render.php',caducosFIEL,function(result){
			authChart.series[1].setData(result);
			authChart.legend.allItems[1].update({name:"Caducos"});
			authChart.redraw();
		},"json");
		$.post('includes/php/render.php',revocadosFIEL,function(result){
			authChart.series[2].setData(result);
			authChart.redraw();
		},"json");
		$.post('includes/php/render.php',expPortal01,function(result){
			portal01Spark.series[0].setData(result);
			portal01Spark.redraw();
		},"json");
		$.post('includes/php/render.php',expPortal02,function(result){
			portal02Spark.series[0].setData(result);
			portal02Spark.redraw();
		},"json");
		$.post('includes/php/render.php',{data:"root"},function(result){
			for(var i in result.children){ // get the different areas
				var b=result.children[i];
				var balOK=0;
				var balWr=0;
				var balCr=0;
				var balIn=0;
				var balStat='';
				var balName='';
				var balCont='';
				var balCodCol='';
				var balIcon='';
				var balDn='';
				$('#accordion-'+b.name).empty();
				for(var j in b.children){ // get the platform
					var srvOK=0;
					var srvWr=0;
					var srvCr=0;
					var srvIn=0;
					var srvStat='';
					var srvName='';
					var srvCont='';
					var srvCodCol='';
					var srvIcon='';
					var srvDn='';
					var c=b.children[j];
					//$('#accordion-'+b.name+'-'+c.name).empty();
					for(var k in c.children){ // get the server
						if(c.children[k].condition=="OK"){srvOK++;srvCodCol="5cb85c";srvIcon="check";}
						else if((c.children[k].condition=="MINOR")||(c.children[k].condition=="MAJOR")){srvWr++;srvCodCol="f0ad4e";srvIcon="exclamation";}
						else if(c.children[k].condition=="CRITICAL"){srvCr++;srvCodCol="d9534f";srvIcon="times";}
						else{srvIn++;srvCodCol="5bc0de";srvIcon="question";}
						srvStat=c.children[k].condition;
						srvStat=$('<i class="fa fa-'+srvIcon+'" style="float:right;color:#'+srvCodCol+'" aria-hidden="true"></i>').append(" - "+srvStat);
						srvName=c.children[k].name;
						srvDn=c.children[k].dname;
						var id='#accordion-'+b.name+'-'+c.name+'-'+c.children[k].name;
						if($(id).length){$(id).empty();$(id).append(srvName,srvStat);}
						else{
							srvName=$('<a role="button" id="accordion-'+b.name+'-'+c.name+'-'+c.children[k].name+'" data-toggle="collapse" data-parent="#accordion-'+b.name+'-'+c.name+'" href="#'+srvName+'" aria-expanded="false" aria-controls="'+srvName+'"></a>').append(srvName,srvStat);
							srvName=$('<h4 class="panel-title"></h4>').append(srvName);
							srvName=$('<div class="panel-heading" role="tab" id="heading-'+c.children[k].name+'"></div>').append(srvName);
							srvCont=$('<div class="panel-body" id="content-'+c.children[k].name+'"></div>');
							srvCont=$('<div data-dn="'+srvDn+'" id="'+c.children[k].name+'" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading-'+c.children[k].name+'"></div>').append(srvCont);
							srvName=$('<div class="panel panel-sat"></div>').append(srvName,srvCont);
							$('#accordion-'+b.name+'-'+c.name).append(srvName);
							
						}
					}
					var i,switching,x,shouldSwitch;
					switching=true;
					while(switching){
						switching=false;
						x=$('#accordion-'+b.name+'-'+c.name+' .panel-sat');
						for(i=0;i<(x.length-1);i++){
							shouldSwitch=false;
							if(x[i].innerHTML.toLowerCase()>x[i+1].innerHTML.toLowerCase()){
								shouldSwitch=true;
								break;
							}
						}
						if(shouldSwitch){
							x[i].parentNode.insertBefore(x[i+1],x[i]);
							switching=true;
						}
					}
					var elem=document.getElementById(b.name+"-"+c.name+"-OK");
					elem.innerHTML=srvOK;
					elem.style.display='block';
					if(srvOK==0){elem.style.display='none';}
					elem=document.getElementById(b.name+"-"+c.name+"-Wr");
					elem.innerHTML=srvWr;
					elem.style.display='block';
					if(srvWr==0){elem.style.display='none';}
					elem=document.getElementById(b.name+"-"+c.name+"-Cr");
					elem.innerHTML=srvCr;
					elem.style.display='block';
					if(srvCr==0){elem.style.display='none';}
					elem=document.getElementById(b.name+"-"+c.name+"-In");
					elem.innerHTML=srvIn;
					elem.style.display='block';
					if(srvIn==0){elem.style.display='none';}
					
				}
			}
			$(".panel-collapse").on("shown.bs.collapse",function(e){
				var dn=$(e.target).attr('data-dn');
				var srv=$(e.target).attr('id');
				var alarmName='';
				var alarmValue='';
				$.post('includes/php/servers.php',{dn:dn},function(result){
					var status='info';
					var id="#content-"+srv;
					$(id).empty();
					id=$(id).append('<ul class="list-group"></ul>');
					id=$(id).children();
					var severity=0;
					for(var i in result){
						if(result[i].status=='OK'){status='success';severity=4;}
						else if((result[i].status=='MINOR')||(result[i].status=='MAJOR')){status='warning';severity=3;}
						else if(result[i].status=='CRITICAL'){status='danger';severity=2;}
						else{status='info';severity=1;}
						alarmName=$('<span style="font-weight:bold;"></span>').append(result[i].alarm.substr(result[i].alarm.indexOf("-") + 1));
						alarmValue=$('<span style="float:right;text-align:right;"></span>').append(result[i].value.substr(result[i].value.indexOf("-") + 1));
						alarmValue=$('<li class="list-group-item list-group-item-'+status+'" severity="'+severity+'"></li>').append(alarmName,alarmValue);
						$(id).append(alarmValue);
					}
					var i,switching,b,shouldSwitch;
					switching=true;
					while(switching){
						switching=false;
						b=$("#content-"+srv+" li");
						for(i=0;i<(b.length-1);i++){
							shouldSwitch=false;
							if(b[i].innerHTML.toLowerCase()>b[i+1].innerHTML.toLowerCase()){
								shouldSwitch=true;
								break;
							}
						}
						if(shouldSwitch){
							b[i].parentNode.insertBefore(b[i+1],b[i]);
							switching=true;
						}
					}
					switching=true;
					while(switching){
						switching=false;
						b=$("#content-"+srv+" li");
						for(i=0;i<(b.length-1);i++){
							shouldSwitch=false;
							if(b[i].getAttribute("severity")>b[i+1].getAttribute("severity")){
								shouldSwitch=true;
								break;
							}
						}
						if(shouldSwitch){
							b[i].parentNode.insertBefore(b[i+1],b[i]);
							switching=true;
						}
					}
				},"json");
			});
		},"json");
	}
	$(".modal").on("show.bs.modal",function(e){$(".panel-collapse").collapse('hide');});
	$('[data-toggle="tooltip"]').tooltip();
	update();
	window.setInterval(function(){
		update();
	},1*60*1000);
});