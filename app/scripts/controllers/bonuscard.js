'use strict';

angular.module('angularYeoApp')
  .controller('BonusCardCtrl', function($scope, $http, $filter, $location) {

      // $scope.$on('$routeChangeSuccess', function (event, routeData) {
      //      $scope.clientId = $stateParams.clientId;
      //      $scope.accountId = $stateParams.accountId;
      //  });

      // $scope.$on('$locationChangeSuccess', function (event) {
      //      $scope.clientId = $stateParams.clientId;
      //      $scope.accountId = $stateParams.accountId;
      //       console.log("$scope.accountId"+$scope.accountId);
      //  });

      $scope.editVisible = false;

      function init() {
        $scope.filter = '';

        // var loc = $location;

        $scope.clientId = 1; //$stateParams.clientId;
        $scope.accountId = 1; //$stateParams.accountId;
        $scope.detailVisible = false;
        $scope.accountVisible = false;


        //SHOW DETAIL PAGE
        if ($scope.accountId > 0) {
          $scope.detailVisible = true;
          $scope.accountVisible = true;
          $scope.loadAccountPage($scope.accountId);
          // $scope.loadDetailPage(storageItemId);
        }

        $scope.myData = [{
            "firstName": "Cox",
            "lastName": "Carney",
            "company": "Enormo",
            "employed": true
          }, {
            "firstName": "Lorraine",
            "lastName": "Wise",
            "company": "Comveyer",
            "employed": false
          }, {
            "firstName": "Nancy",
            "lastName": "Waters",
            "company": "Fuelton",
            "employed": false
          }];


          $http.get('/blacksheep-service/bonuscard/customers.json').then(function(resp) {
            $scope.bonusCardCustomers = resp.data;
            //AUTO SELECT
            // if($scope.storageGroupId > 0){
            //   angular.forEach($scope.storageGroups, function(item) {
            //     if(item.storageGroupId == $scope.storageGroupId){
            //       $scope.selectGroup(item);
            //     }
            //   });
            // }

          });
        }

        $scope.loadAccountPage = function(item) {

          $http.get('/blacksheep-service/bonuscard/card/' + $scope.clientId + '/history/' + $scope.accountId).then(function(resp) {
            $scope.account = resp.data;
          });
        };

        init();

        $scope.selectCustomer = function(item) {
          angular.forEach($scope.bonusCardCustomers, function(item) {
            item.selected = false;
          });
          $scope.bonusCardCustomer = item;
          $scope.bonusCardCustomer.selected = true;

          $scope.detailVisible = true;

          // $scope.filter = item.name;

          var bonuscard;
          if (item.bonusCards.length > 0) {
            bonuscard = item.bonusCards[0];
          } else {
            //NO CARD FOR CUSTOMER
            return;
          }

          $scope.getBonusCard(bonuscard);
        }

        $scope.getBonusCard = function(bonuscard) {
          $http.get('/blacksheep-service/bonuscard/card/' + bonuscard.bonusCardId + '/history').then(function(resp) {
            $scope.bonusCard = resp.data;

            var dataTable = $('#dataTable2');
            // $scope.resetDataTable('#dataTable2');

            $scope.history = $scope.bonusCard.history;


            // dataTable.dataTable({
            //   data: $scope.bonusCard.history,
            //   paging: false,
            //   columns: [{
            //     data: "bonusCardValue"
            //   }, {
            //     data: "timeStamp"
            //   }],
            //   columnDefs: [{
            //       render: function(data, type, row) {
            //         return '<a href="#apps/bonuscard/' + row.bonusCardId + '/history/' + row.accountId + '" ng-click="selectHistory(item)">' + data + '</a>';
            //       },
            //       targets: 1
            //     }, {
            //       render: function(data, type, row) {
            //         var type = 'bg-success';
            //         if (data < 0)
            //           type = 'bg-danger';

            //         return '<span class="badge ' + type + '">' + data + '</span>';
            //       },
            //       targets: 0
            //     }
            //     //{ "visible": false,  "targets": [ 3 ] }
            //   ]
            // });
          });


        };

        $scope.selectHistory = function(item) {

          $scope.bonusCardHistory = item;
          // $scope.bonusCard.selected = true;

          $scope.accountVisible = true;

          $http.get('/blacksheep-service/bonuscard/card/' + $scope.bonusCard.bonusCardId + '/history/' + $scope.bonusCardHistory.accountId)
            .then(function(resp) {
              $scope.account = resp.data;
              // $scope.loadDetailPage(item.storageItemId);

            });
        };

        $scope.edit = function(bonuscard) {
          $scope.editVisible = !$scope.editVisible;
        }
        $scope.editPoints = function(newPoints) {
          $scope.bonusCard.bonusCardValue = parseInt($scope.bonusCard.bonusCardValue) + parseInt(newPoints);
          $scope.editVisible = false;
          $http.put('/blacksheep-service/bonuscard/customer/' + $scope.bonusCard.bonusCardId + '/points/' + newPoints)
            .then(function(resp) {
              $scope.getBonusCard($scope.bonusCard);
            });


        }

        $scope.editItem = function(item) {
          if (item && item.selected) {
            item.editing = true;
          }
        };

        $scope.doneEditing = function(item) {
          item.editing = false;
        };

        $scope.resetDataTable = function(tableId) {
          if ($.fn.dataTable.isDataTable(tableId)) {
            table = $(tableId).DataTable();
            table.destroy();
          }
        }



        // $scope.setPagingData = function(data, page, pageSize){  
        //   // var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
        //   // $scope.myData = pagedData;
        //   $scope.myData = data;
        //   $scope.totalServerItems = data.length;
        //   if (!$scope.$$phase) {
        //     $scope.$apply();
        //   }        
        // };

        // $scope.gridOptions = {
        //   data: 'myData',
        //   columnDefs: 
        //     [{field: 'storageItemName', displayName: 'Name'},
        //      {field:'price', displayName:'Cena'},
        //      {field:'quantity', displayName:'Množstvo'}
        //      ],
        //   enablePaging: false,
        //   showFooter: false,
        //   totalServerItems: 'totalServerItems',
        //   pagingOptions: $scope.pagingOptions,
        //   filterOptions: $scope.filterOptions
        // };

        // $scope.filterOptions = {
        //   filterText: "",
        //   useExternalFilter: true
        // }; 
        // $scope.totalServerItems = 0;
        // $scope.pagingOptions = {
        //   pageSizes: [250, 500, 1000],
        //   pageSize: 250,
        //   currentPage: 1
        // }; 



      });