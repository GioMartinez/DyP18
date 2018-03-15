<?php
if(isset($_POST)&&!empty($_POST)){
	include_once'config.php';
	include_once'memInt.php';
	$cache=new Cache($memAddr,$memPort,$memExpi);
	function fetchCache($data){
		global$cache;
		$test=array();
		$test=$cache->get($data);
		return json_encode($test);
	}
	function getRTAlarms($dn){
		global$cache;
		$test=array();
		$test=$cache->get($dn);
		return json_encode($test);
	}
	function getSNMP($host){
		global$cache;
		$test=array();
		$test=$cache->get($host);
		return json_encode($test);
	}
	function getSeries($dn,$property){
		global$cache;
		$series=array();
		$series=$cache->get($dn."_".$property);
		foreach ($series as $key => $value){
			if(isset($value["timestamp"])&&isset($value["value"])){
				$series[$key][0] = ((strtotime($value["timestamp"])*1000)-(6*60*60*1000));
				$series[$key][1] = (intval($value["value"]));
				unset($series[$key]["timestamp"]);
				unset($series[$key]["value"]);
			}
			else{unset($series[$key]);}
		}
		function cmp($a,$b){return strcmp($a[0],$b[0]);}
		usort($series,"cmp");
		return json_encode($series);
	}
	function newSeries($dn,$property){
		global$cache;
		$series=array();
		$series=$cache->get($dn."_".$property);
		$fecha = new DateTime(null, new DateTimeZone('America/Mexico_City'));
		$offset = date_offset_get($fecha);
		foreach ($series as $key => $value) {
			$series[$key][0] = ($value['timestamp']*1)+($offset*1000);
			$series[$key][1] = intval($value['value']);
			unset($series[$key]['timestamp']);
			unset($series[$key]['value']);
		}
		function cmp($a,$b){return strcmp($a[0],$b[0]);}
		usort($series,"cmp");
		return json_encode($series);
	}
	if(isset($_POST['data'])&&!empty($_POST['data'])){
		echo fetchCache($_POST['data']);
	}
	elseif(isset($_POST['series'])&&!empty($_POST['series'])){
		echo getSeries($_POST['series'],$_POST['property']);
	}
	elseif(isset($_POST['ws'])&&!empty($_POST['ws'])){
		echo getRTAlarms($_POST['ws']);
	}
	elseif(isset($_POST['snmp'])&&!empty($_POST['snmp'])){
		echo getSNMP($_POST['snmp']);
	}
}
?>
