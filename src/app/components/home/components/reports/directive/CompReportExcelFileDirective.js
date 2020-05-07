/**
 * Created by cherrera on 13/07/2016.
 */

import CompReportExcelFileTemplate from '../views/comp-report-excel-file.tpl';

class CompReportExcelFileDirective{

	constructor($parse) {
		this.$parse = $parse;
		let directive = {
			restrict: 'E',
			replace: true,
			templateUrl: CompReportExcelFileTemplate.name,
			scope: {
				label: '@',
				title: '@',
				jsonData: '=',
				fileName:'@',
				tableTitle : '@'
			},
			link: ((scope, element) => {

				function emitXmlHeader(colsName, level, size, tableTitle) {
					let headerRow = '<ss:Row ss:AutoFitHeight="0" ss:Height="15.9375" ss:StyleID="s69">\n';
					let numberColumns = 0;
					for (let colName in colsName) {
						headerRow += '  <ss:Cell ss:StyleID="s70" >\n';
						headerRow += '    <ss:Data ss:Type="String">';
						headerRow += colsName[colName][0] + '</ss:Data>\n';
						headerRow += '  </ss:Cell>\n';
						numberColumns++;
					}
					headerRow += '</ss:Row>\n';
					if(level === 1){
						let headerRow = '<?xml version="1.0"?>\n' +
							'<ss:Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:html="http://www.w3.org/TR/REC-html40">\n' +
							'<ss:Styles>\n' +
							'<ss:Style ss:ID="Default" ss:Name="Normal">\n' +
							'<ss:Alignment ss:Vertical="Bottom"/>\n' +
							'<ss:Borders/>\n' +
							'<ss:Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Color="#000000"/>\n' +
							'<ss:Interior/>\n' +
							'<ss:NumberFormat/>\n' +
							'<ss:Protection/>\n' +
							'</ss:Style>\n' +
							'<ss:Style ss:ID="s68">\n' +
							'<ss:Alignment ss:Horizontal="Center" ss:Vertical="Bottom"/>\n' +
							'<ss:Borders>\n' +
							'<ss:Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>\n' +
							'<ss:Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>\n' +
							'<ss:Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>\n' +
							'<ss:Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>\n' +
							'</ss:Borders>\n' +
							'<ss:Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="14" ss:Color="#2c4c74" ss:Bold="1"/>\n' +
							'</ss:Style>\n' +
							'<ss:Style ss:ID="s69">\n' +
							'<ss:Alignment ss:Horizontal="Center" ss:Vertical="Bottom"/>\n' +
							'<ss:Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Color="#000000" ss:Bold="1"/>\n' +
							'</ss:Style>\n' +
							'<ss:Style ss:ID="s70">\n' +
							'<ss:Alignment ss:Horizontal="Center" ss:Vertical="Bottom"/>\n' +
							'<ss:Borders>\n' +
							'<ss:Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>\n' +
							'<ss:Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>\n' +
							'<ss:Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>\n' +
							'<ss:Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>\n' +
							'</ss:Borders>\n' +
							'<ss:Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Color="#000000" ss:Bold="1"/>\n' +
							'</ss:Style>\n' +
							'<ss:Style ss:ID="s71">\n' +
							'<ss:Alignment ss:Horizontal="Center" ss:Vertical="Bottom"/>\n' +
							'<ss:Borders>\n' +
							'<ss:Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>\n' +
							'<ss:Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>\n' +
							'<ss:Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>\n' +
							'<ss:Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>\n' +
							'</ss:Borders>\n' +
							'</ss:Style>\n' +
							'<ss:Style ss:ID="s72">\n' +
							'<ss:Alignment ss:Horizontal="Left" ss:Vertical="Bottom"/>\n' +
							'<ss:Borders>\n' +
							'<ss:Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>\n' +
							'<ss:Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>\n' +
							'<ss:Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>\n' +
							'<ss:Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>\n' +
							'</ss:Borders>\n' +
							'</ss:Style>\n' +
							'<ss:Style ss:ID="s73">\n' +
							'<ss:Alignment ss:Horizontal="Right" ss:Vertical="Bottom"/>\n' +
							'<ss:Borders>\n' +
							'<ss:Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>\n' +
							'<ss:Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>\n' +
							'<ss:Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>\n' +
							'<ss:Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>\n' +
							'</ss:Borders>\n' +
							'</ss:Style>\n' +
							'</ss:Styles>\n' +
							'<ss:Worksheet ss:Name="Sheet1">\n' +
							'<ss:Table ss:ExpandedColumnCount="'+numberColumns+'" ss:ExpandedRowCount="'+size+'" x:FullColumns="1" x:FullRows="1" ss:DefaultColumnWidth="60" ss:DefaultRowHeight="20.9375">\n';

						for (let colName in colsName) {
							headerRow+='<ss:Column ss:Width="'+colsName[colName][2]+'"/>\n';
						}

						headerRow+='<ss:Row>\n' +
							'<ss:Cell ss:MergeAcross="'+(numberColumns-1)+'" ss:StyleID="s68">\n' +
							'<ss:Data ss:Type="String">\n';
						headerRow+=tableTitle+'</ss:Data>\n' +
							'</ss:Cell>\n' +
							'</ss:Row>\n';
						return headerRow;
					}else{
						return headerRow;
					}
				}

				function emitXmlFooter() {
					return '\n</ss:Table>\n' +
						'</ss:Worksheet>\n' +
						'</ss:Workbook>\n';
				}

				function jsonToSsXml(jsonData, tableTitle) {
					let xml = emitXmlHeader(jsonData.columns,1,jsonData.data.length+2, tableTitle);
					xml += emitXmlHeader(jsonData.columns,2, 0, tableTitle);
					for (let row = 0; row < jsonData.data.length; row++) {
						xml += '<ss:Row ss:AutoFitHeight="0" ss:Height="15.9375">\n';
						for (let col in jsonData.data[row]) {
							if(jsonData.columns[col][3] === 'center'){
								xml += '<ss:Cell ss:StyleID="s71">\n';
							}
							if(jsonData.columns[col][3] === 'left'){
								xml += '<ss:Cell ss:StyleID="s72">\n';
							}
							if(jsonData.columns[col][3] === 'rigth'){
								xml += '<ss:Cell ss:StyleID="s73">\n';
							}

							xml += '<ss:Data ss:Type="' + jsonData.columns[col][1] + '">';
							xml += jsonData.data[row][col] + '</ss:Data>\n';
							xml += '</ss:Cell>\n';
						}
						xml += '</ss:Row>\n';
					}
					xml += emitXmlFooter();
					return xml;
				}

				function downloadFileExcel(jsonData, fileName, tableTitle) {
					let xmlData = jsonToSsXml(jsonData, tableTitle);
					let fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
					let blob = new Blob([xmlData], {'type': fileType});
					let button = angular.element('<a></a>');
					button.attr('href',window.URL.createObjectURL(blob));
					button.attr('download', fileName);
					button[0].click();
				}
				element.bind('click', function(){
					scope.$apply(function(){
						downloadFileExcel(scope.jsonData, scope.fileName, scope.tableTitle);
					});
				});
			}).bind(this)
		};
		return directive;
	}

	static instance($parse) {
		'ngInject';
		return new CompReportExcelFileDirective($parse);
	}
}

export default CompReportExcelFileDirective;
