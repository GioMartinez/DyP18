<?php
/*ini_set('display_errors','1');
ini_set('display_startup_errors','1');
ini_set('html_errors','1');
ini_set('log_errors','1');
ini_set('track_errors','1');*/
ini_set('variables_order','GPCS');
#error_reporting(E_ALL ^ E_DEPRECATED);
// NOC connection parameters
date_default_timezone_set("UTC");
$nocAddr = 'http://10.55.156.75:8084/wsapi/services/Moswsapi_1_1?wsdl';
$nocUser = 'admin';
$nocPass = 'formula';
$nocPass = base64_encode(hash('md5',$nocPass,true));
$memAddr = 'localhost';
$memPort = '11511';
$memExpi = 4;
$root = "org=DisponibilidadHW/gen_chart=DyP-Ejecutivo/root=Organizations";
$timeOffset = 30*24*60*60;
$seriesNames=array(
	"expMan"=>array(
		"portal01"=>array(
			"DN"=>"HTTP=001-tquifproohsx01/server_file=ServProxyUIF01/mgmt_source=Protocol+Synthetic+Tests/admin_analyzer=End+User+Experience/BEM+Root+Element=Experience+Manager/root=Elements",
			"value"=>"tqidnproocce01:6789.ServProxyUIF01.HTTP.001-tquifproohsx01.ResponseTime",
			"profile"=>"ElementProfile"
		),
		"portal02"=>array(
			"DN"=>"HTTP=001-ServProxyUIF02/server_file=ServProxyUIF02/mgmt_source=Protocol+Synthetic+Tests/admin_analyzer=End+User+Experience/BEM+Root+Element=Experience+Manager/root=Elements",
			"value"=>"tqidnproocce01:6789.ServProxyUIF02.HTTP.001-ServProxyUIF02.ResponseTime",
			"profile"=>"ElementProfile"
		)
	),
	"auth"=>array(
		"login"=>array(
			"DN"=>"ResumenAuth=AuthUIF/ResumenAuthUIF=ResumenAuthUIF/UIFResumenAuth=UIFResumenAuth/root=Elements",
			"value"=>"Login",
			"profile"=>"AuthUIF"
		),
		"logout"=>array(
			"DN"=>"ResumenAuth=AuthUIF/ResumenAuthUIF=ResumenAuthUIF/UIFResumenAuth=UIFResumenAuth/root=Elements",
			"value"=>"Logout",
			"profile"=>"AuthUIF"
		),
		"intentos"=>array(
			"DN"=>"ResumenAuth=AuthUIF/ResumenAuthUIF=ResumenAuthUIF/UIFResumenAuth=UIFResumenAuth/root=Elements",
			"value"=>"Intentos",
			"profile"=>"AuthUIF"
		)
	),
	"fiel"=>array(
		"activos"=>array(
			"DN"=>"FielCont=AuthFielCont/AuthFielCont=AuthFielCont/UIFAuthFielCont=UIFAuthFielCont/root=Elements",
			"value"=>"Activos",
			"profile"=>"AuthFiel"
		),
		"autenticados"=>array(
			"DN"=>"FielCont=AuthFielCont/AuthFielCont=AuthFielCont/UIFAuthFielCont=UIFAuthFielCont/root=Elements",
			"value"=>"Autenticados",
			"profile"=>"AuthFiel"
		),
		"caducos"=>array(
			"DN"=>"FielCont=AuthFielCont/AuthFielCont=AuthFielCont/UIFAuthFielCont=UIFAuthFielCont/root=Elements",
			"value"=>"Caducos",
			"profile"=>"AuthFiel"
		),
		"revocados"=>array(
			"DN"=>"FielCont=AuthFielCont/AuthFielCont=AuthFielCont/UIFAuthFielCont=UIFAuthFielCont/root=Elements",
			"value"=>"Revocados",
			"profile"=>"AuthFiel"
		),
		"noautenticados"=>array(
			"DN"=>"FielCont=AuthFielCont/AuthFielCont=AuthFielCont/UIFAuthFielCont=UIFAuthFielCont/root=Elements",
			"value"=>"NOAutenticados",
			"profile"=>"AuthFiel"
		)
	)
)
?>