'use strict';

angular.module('angularYeoApp')
  .controller('BonusCardCtrl', function($scope, $http, $filter, $location) {

    $scope.editVisible = false;

    function init() {
      $scope.filter = '';

      // var loc = $location;

      $scope.clientId = 1; //$stateParams.clientId;
      $scope.accountId = 1; //$stateParams.accountId;
      $scope.detailVisible = false;
      $scope.accountVisible = false;
      $scope.noCardForCustomer = true;


      //SHOW DETAIL PAGE
      if ($scope.accountId > 0) {
        $scope.detailVisible = true;
        $scope.accountVisible = true;
        $scope.loadAccountPage($scope.accountId);
        // $scope.loadDetailPage(storageItemId);
      }

      //GET customers
      $scope.loadCustomers();
    }

    $scope.loadCustomers = function() {
      $http.get('/blacksheep-service/bonuscard/customers.json').then(function(resp) {
        $scope.bonusCardCustomers = resp.data;
        if ($scope.bonusCardCustomer !== undefined) {
          angular.forEach($scope.bonusCardCustomers, function(customer) {
            if (customer.customerId == $scope.bonusCardCustomer.customerId) {
              $scope.selectCustomer(customer);
            }
          });

        }
      });
    }

    $scope.loadAccountPage = function(accountId) {
      $http.get('/blacksheep-service/bonuscard/card/' + $scope.clientId + '/history/' + accountId).then(function(resp) {
        $scope.account = resp.data;

        $scope.gridOptions2.data = $scope.account.accountItems;
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
        $scope.noCardForCustomer = false;
      } else {
        //NO CARD FOR CUSTOMER
        bonuscard = null;
        $scope.history = [];
        $scope.noCardForCustomer = true;
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
        $scope.gridOptions.data = $scope.history;

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
      $http.put('/blacksheep-service/bonuscard/customer/' + $scope.bonusCardCustomer.customerId + '/points/' + newPoints)
        .then(function(resp) {
          $scope.loadCustomers();
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

    $scope.gridOptions = {
      data: $scope.history,
      enableSorting: true,
      columnDefs: [{
        name: 'Points',
        field: 'bonusCardValue',
        // cellTemplate: '<span class="badge">{{ COL_FIELD }}</span>',
        type: 'number'
      }, {
        name: 'Datum',
        field: 'timeStamp'
      }, {
        name: 'accountId',
        field: 'accountId'
      }],
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      multiSelect: false,
    };

    $scope.gridOptions2 = {
      columnDefs: [{
        name: 'Name',
        field: 'salesItem.salesItemName',
        // cellTemplate: '<span class="badge">{{ COL_FIELD }}</span>',
      }, {
        name: 'Qty',
        field: 'accountQuantity',
        type: 'number'
      }, {
        name: 'Spolu',
        field: 'accountGrossPrice'
      }]
    };

    $scope.gridOptions.onRegisterApi = function(gridApi) {
      $scope.gridApi = gridApi;

      gridApi.selection.on.rowSelectionChanged($scope, function(row) {
        $scope.selectedHistory = row.entity;
        if ($scope.selectedHistory.accountId > 0) {
          $scope.loadAccountPage($scope.selectedHistory.accountId);
        }
      });

      gridApi.selection.on.rowSelectionChangedBatch($scope, function(rows) {

        rows.forEach($scope.SelectedProduct);
      });
    };



  });