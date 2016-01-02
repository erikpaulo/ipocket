define([ 'app' ], function(app) {
	app.controller('DashboardController', ['$rootScope', '$scope', '$timeout', '$filter', '$locale',
	function($rootScope, $scope, $timeout, $filter, $locale) {
	$rootScope.appContext.contextPage = 'Dashboard';

        $scope.dashboard = {};
        $scope.dashboard.todoList = {text: null}
        $scope.dashboard.todos = [
            {done: false, description: 'Planejamento Financeiro 2016'},
            {done: true, description: 'Verificar valor do seguro do golzim e lançar'},
            {done: false, description: 'Movimentar saldo de 2015 para Maxime DI - Melhor opção?'}
        ]
        $scope.dashboard.nextBills = [
            {date: new Date(2016, 0, 5), category:'Household:Condomínio', amount:1256},
            {date: new Date(2016, 0, 12), category:'Educação : Escola de Inglês', amount:310},
            {date: new Date(2016, 0, 28), category:'House:Financiamento Santander', amount:6000}
        ]

        $scope.addTodo = function(){
            $scope.dashboard.todos.push({done:false, description:$scope.todoList.text});
            $scope.dashboard.todoList.text = null;
        }

        $scope.savingChartConfig = {
            options:{
                chart:{
                    type:"areaspline"
                },
                plotOptions:{
                    series:{
                        stacking:""
                    }
                },
                tooltip: {
                    shared: true,
                    pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>R$ {point.y: ,.2f}</b><br/>',
                    headerFormat: ''
                }
            },
            func: function(chart) {
                $timeout(function() {
                    chart.reflow();
                }, 0);
            },
            series:[
                {name:"Acumulado", data:[1200,2776,3121,7653,12653, 18085, 20430, 24214, 24448, 24641, 32276, 34276],id:"series-0"},
                {name:"Mensal",data:[1200,1576,345,4532,5000,5432, 2345, 3784,234,193,7635,2000],type:"column",id:"series-1"}
            ],
            title:{text:""},
            credits:{enabled:false},
            loading:false,
            size:{
                height:230
            },
            xAxis: {
                labels: {
                    enabled: false
                },
                lineWidth: 1
            },
            yAxis: {
                title: {
                    enabled: false
                },
                labels: {
                    enabled: true
                },
                gridLineWidth: 1
            }
        }

        $scope.savingPlanChartConfig = {
            options: {
                chart: {
                    type: 'solidgauge'
                },
                pane: {
                    center: ['50%', '85%'],
                    size: '140%',
                    startAngle: -90,
                    endAngle: 90,
                    background: {
                        backgroundColor:'#EEE',
                        innerRadius: '60%',
                        outerRadius: '100%',
                        shape: 'arc'
                    }
                },
                solidgauge: {
                    dataLabels: {
                        y: -30,
                        borderWidth: 0,
                        useHTML: true
                    }
                }
            },
            series: [{
                data: [8348.87],
                dataLabels: {
                    enabled: false,
                    format: '<div style="text-align:center">' +
                            '<span style="font-size:12px;color:silver;text-align:center">R$</span><br/>' +
                            '<span style="font-size:12px;color:black">{y: ,.2f} - {x}</span>' +
                            '</div>'
                }
            }],
            title: {
                text: ""
            },
            size:{
                height:185,
            },
            func: function(chart) {
                $timeout(function() {
                    chart.reflow();
                }, 0);
            },
            yAxis: {
                currentMin: 0,
                currentMax: 23000,
                title: {
//                    y: 220
                },
                stops: [
                    [0.3, '#DF5353'], // red
                    [0.7, '#DDDF0D'], // yellow
                    [0.9, '#55BF3B'] // green
                ],
                lineWidth: 0,
                tickPixelInterval: 0,
                tickWidth: 0,
                labels: {
                    y: 15,
                    step: 25,
                    enabled: false
                }
            },
            loading: false
            }
	}]);
});