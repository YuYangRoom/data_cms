
		/*
			$(function(){

					if($('#searchbox').val()){
						alert($('UserGrid').datagrid);
						$('#UserGrid').datagrid.refresh();
					
					}
			});
		*/
			var AjaxDataSource = function (options) {
				this._formatter = options.formatter;
				this._columns = options.columns;
			};


			//this is the data source that tells Datagrid where to get the data from
			AjaxDataSource.prototype = {

				/**
				 * Returns stored column metadata
				 */
				columns: function () {
					return this._columns;
				},
				
				

				/**
				 * Called when Datagrid needs data. Logic should check the options parameter
				 * to determine what data to return, then return data by calling the callback.
				 * @param {object} options Options selected in datagrid (ex: {pageIndex:0,pageSize:5,search:'searchterm'})
				 * @param {function} callback To be called with the requested data.
				 */
				data: function (options, callback) {

					var url = '/getCountryCities/:countryname';
					var self = this;

					if (options.search) {

						// Search active.  Add URL parameters for API.
						url += '?q=' +  encodeURIComponent(options.search);
						url += '&perpage=' + options.pageSize;
						url += '&page=' + (options.pageIndex + 1);
						    if (options.sortProperty){
							url += "&sort="+options.sortProperty+"&sortdir="+options.sortDirection
						    }
						
						//alert(url); //use this to debug
						$.ajax(url, {

							// Set JSONP options for API
						       dataType: 'json',
							type: 'GET'

						}).done(function (response) {
							// console.log(response);
								//alert(response.data);
							
								// Prepare data to return to Datagrid
							var data = response.data;
							var count = response.count;
							var startIndex = (response.page - 1) * response.perpage;
							var endIndex = startIndex + response.perpage;
							var end = (endIndex > count) ? count : endIndex;
							var pages = response.pages;
							var page = response.page;
							var start = startIndex + 1;

							// SORTING is dealt with by the server
								
							// Allow client code to format the data
							if (self._formatter) self._formatter(data);

							// Return data to Datagrid
							callback({ data: data, start: start, end: end, count: count, pages: pages, page: page });

						});

					} else {

						// No search. Return zero results to Datagrid
						callback({ data: [], start: 0, end: 0, count: 0, pages: 0, page: 0 });
						


					}
					
					
				}
			};



			
			//this instantiates the datagrid and tells it which columns to display. Your Ajax could return other columns - they'd be ignored.
			$('#UserGrid').datagrid({
				// itemText: "User",			//name of a single item
				// itemsText: "Users",		//name of 2+ items
				stretchHeight: false,		//forces the datagrid to take up all the height of the containing HTML element. If false, it expands (& contracts) to fit the amount of data it contains.

				dataSource: new AjaxDataSource({
					// Column definitions for Datagrid
					columns: [{
						property: 'cityname',
						label: '城市名',
						sortable: false
						},{
						property: 'show_flag',
						label: '是否显示',
						sortable: false
						},{
						property: 'recommand_day',
						label: '推荐天数',
						sortable: true
						}],

					// this function transforms data for display - use for creating links & buttons, making emails clickable, bolding columns etc 
					formatter: function (items) {
						$.each(items, function (index, item) {
							item.EMAIL = '<a href="mailto:'+item.EMAIL+'">'+item.EMAIL+'</a>';
							item.additional1 = '<a class="btn btn-primary" href="edit.php?id='+item.ID+'">Edit</a>'
							item.additional2 = '<a class="btn btn-info" href="view.php?id='+item.ID+'">View</a>';
							cchecked = item.inbasket ? "CHECKED" : '';
							item.additional3 = '<input type="checkbox" '+cchecked+' onClick="cc(this)" name="cb_'+item.ID+'" />';
							item.ADD_DATE = formatdate(item.ADD_DATE);
						});
					}
				})
				
			});
