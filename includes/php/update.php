<?php
include_once'config.php';
include_once'nocInt.php';
include_once'memInt.php';
$NOC=new NOCface($nocAddr,$nocUser,$nocPass);
$cache=new Cache($memAddr,$memPort,$memExpi);
function getAlarms(){
	global$NOC;
	global$cache;
	global$alarmsDNs;
	foreach($alarmsDNs as $name => $dn){
		$temp=$NOC->getAlarms($dn);
		$alarmsRT=array();
		foreach($temp['fields']['fields'] as $key => $data){
			if(($data['name']=='responseTime')||($data['name']=='responseTimeHigh')||($data['name']=='responseTimeLow')||($data['name']=='responseTimeAvg')){
				$alarmsRT+=array($data['name']=>$data['value']);
			}
		}
		$alarmsRT+=array("severity"=>$temp['severity']);
		$cache->set($name,$alarmsRT);
	}
}
function getAllSeries(){
	global$NOC;
	global$cache;
	global$timeOffset;
	global$seriesNames;
	foreach($seriesNames as $graph => $pltfrm){
		foreach($pltfrm as $key => $value){
			if($graph=="expMan"){$timeOffset=24*60*60;}
			else{$timeOffset=90*24*60*60;}
			$temp=$NOC->mySeries($value['DN'],$timeOffset,$value["value"],$value["profile"]);
			$cache->set($graph."_".$key,$temp);
			$NOC->allSeries=null;
		}
	}
}
function flood($dn,$tree,$depth){
	global$NOC;
	global$cache;
	$depth=$depth+1;
	if($depth<5){
		$result=$NOC->getChilds($dn);
		if(isset($result['DName'])){
			$tree=array("name"=>$result['displayName']);
			$tree+=array("condition"=>$result['condition']);
			$tree+=array("dname"=>$result['DName']);
			$childRight='includedRightDNames';
			if(isset($result[$childRight]['includedRightDNames'])){
				if(!isset($result[$childRight]['includedRightDNames'][0])){
					$tree+=array("children"=>array(0=>""));
					$tree['children'][0]=flood($result[$childRight]['item']['relatedDName'],$tree['children'][0],$depth);
					if(empty($tree['children'][0])){unset($tree['children']);}
				}
				else{
					if($childRight == 'includedRightDNames'){
						$tree+=array("children"=>array());
						foreach($result[$childRight]['includedRightDNames']as$key=>$value){
							$tree['children']+=array($key=>"");
							$tree['children'][$key]=flood($value,$tree['children'][$key],$depth);
							if($tree['children'][$key]==''){unset($tree['children'][$key]);}
						}
						if(empty($tree['children'])){unset($tree['children']);}
					}
					else{
						$tree+=array("children"=>array());
						foreach($result[$childRight]['includedRightDNames']as$key=>$value){
							$tree['children']+=array($key=>"");
							$tree['children'][$key]=flood($value,$tree['children'][$key],$depth);
							if($tree['children'][$key]==''){unset($tree['children'][$key]);}
						}
						if(empty($tree['children'])){unset($tree['children']);}
					}
				}
			}
		}
	};
	return$tree;
}

//getSNMP();
getAlarms();
$tree=array();
getAllSeries();
$tree=flood($root,$tree,0);
echo "tree<br>";
print_r($tree);
$cache->set("root",$tree);
$NOC->untie_from_NOC();
?>