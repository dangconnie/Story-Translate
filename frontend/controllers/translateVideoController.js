app.controller('translateVideoController',['$scope', '$location', '$http', '$sce', function($scope, $location, $http, $sce){
	var paramsId = $location.$$path.slice(16)
	var onLoadUrl = 'http://dangconnie.com:3030/transcript/' + paramsId
	$scope.seeFinishedButton = 'finishedButtonHide'
	$scope.timeRangeConflict = ''
	$http({
    	method: "GET",
    	url: onLoadUrl
  	}).then(
    	function successFunction(onLoadData){
      		var transcriptString = onLoadData.data[0].transcript
      		var entireTranscript = JSON.parse(transcriptString)
      		entireTranscript.sort(function(a, b){return a.startTime-b.startTime});
      		// console.log(entireTranscript)
      		$scope.entireTranscript = entireTranscript
      		var timeRangeArray = []
       		$scope.entireTranscript.map((eachTranscript, index)=>{
				timeRangeArray.push({
					startTime: Math.floor(eachTranscript.startTime*100),
					endTime: Math.floor(eachTranscript.endTime*100),
				})				
			})
			$scope.timeRange = timeRangeArray
    	},
    	function failedFunction(onLoadData){
		} 
  	)
	$scope.videoToTranslateUrl = ''
	var tempUrl = 'http://dangconnie.com:3030/videos'
	$http({
    	method: "GET",
    	url: tempUrl
  	}).then(
    	function successFunction(videoData){
      		videoData.data.map((eachVideo, index)=>{
       			if(eachVideo.token == paramsId){
        			var tempVideoPath = eachVideo.path.slice(7)
        			$scope.familyName = eachVideo.familyName
			        // console.log(tempVideoPath)
        			var myUrl = 'http://dangconnie.com:3030/' + tempVideoPath
        			$scope.pleasWork = $sce.trustAsResourceUrl(myUrl)
       			}
      		})
    	},
    	function failedFunction(videoData){
		}
  	)
  	$scope.rangePossible = false;
	$scope.entireTranscript = [];
	$scope.clickedTranscriptIndex=-1 
	$scope.editOrAddButton = 'Add to Transcript >>'
	$scope.addButtonClass = 'btn #0d47a1 light-blue darken-4 waves-effect'

	// Adding transcripts to video (shows on the right)
	$scope.submitEachSection = function(){
		$scope.entireTranscript.sort(function(a, b){return a.startTime-b.startTime});
		
		// $scope.tempEditTranscript = $scope.entireTranscript[$scope.clickedTranscriptIndex]
		// $scope.entireTranscript.splice($scope.clickedTranscriptIndex, 1 )	    
	  var tempRange = []
	  var timeRangeArray = $scope.timeRange
	  
	  var startTime = Math.floor($scope.startTime*100)
	  var endTime = Math.floor($scope.endTime*100)
	  for(let i = 0; i < timeRangeArray.length; i++){
	    if(startTime < timeRangeArray[i].endTime){
	      tempRange.push(timeRangeArray[i])
	    }
	  }
	  
	  var inBetween = true
	  for(let j = 0; j<tempRange.length; j++){
	    if(endTime < tempRange[j].startTime){
	    }else{
	    	inBetween = false
	    }
	  }  
	  
	  var beforeEverything = true;
	  for(let i = 0; i < timeRangeArray.length; i++){
	    if((endTime < timeRangeArray[i].startTime)&&(endTime < timeRangeArray[i].endTime)){
	    }else{
	    	beforeEverything = false;
	    }
	  }
	  
	  var afterEverything = true;
	  for(let i = 0; i<timeRangeArray.length; i++){
	    if((startTime > timeRangeArray[i].startTime)&&(startTime > timeRangeArray[i].endTime)){
	    }else{
	    	afterEverything = false;
	    }
	  }  

		console.log(inBetween, beforeEverything, afterEverything)
		if((inBetween)||(beforeEverything)||(afterEverything)){
			$scope.timeRange = timeRangeArray;
		    
		    // $scope.entireTranscript.splice($scope.clickedTranscriptIndex, 0, $scope.tempEditTranscript);
		    $scope.timeRange.push({
		    	startTime: startTime,
		    	endTime: endTime
		    })
		    
		    
			$scope.editOrAddButton = 'Add to Transcript'
	    	$scope.addButtonClass = 'btn #0d47a1 light-blue darken-4 waves-effect'
			var index = $scope.clickedTranscriptIndex
			var date = new Date();
			var day = (date.getUTCDate()).toString();
			var month = (date.getMonth()+1).toString(); 
			var year = (date.getUTCFullYear()).toString(); 

			var startMinutes = Math.floor($scope.startTime / 60);
			if(startMinutes < 10){
				startMinutes = '0'+ startMinutes;
			}
			var startSeconds = Math.floor($scope.startTime - startMinutes * 60);
			if(startSeconds < 10){
				startSeconds = "0"+ startSeconds;
			}
			var endMinutes = Math.floor($scope.endTime / 60);
			if(endMinutes < 10){
				endMinutes =  "0"+endMinutes;
			}
			var endSeconds = Math.floor($scope.endTime - endMinutes * 60);
			if(endSeconds < 10){
				endSeconds = "0"+ endSeconds;
			}

	        if(index == -1){
	        	$scope.entireTranscript.push({
					startTime: $scope.startTime,
					endTime: $scope.endTime,
					transcript: $scope.transcript,
					postedTime: month+'/'+day+'/'+year,
					startMinsSecs: startMinutes+":"+startSeconds,
					endMinsSecs: endMinutes+":"+endSeconds
				})    
			}else{
				// edit (on yellow button click)
				if($scope.clickedTranscriptIndex > -1){
					var date = new Date();
					var day = (date.getUTCDate()).toString();
					var month = (date.getMonth()+1).toString(); 
					var year = (date.getUTCFullYear()).toString(); 

					var startMinutes = Math.floor($scope.startTime / 60);
					if(startMinutes < 10){
						startMinutes = '0'+ startMinutes;
					}
					var startSeconds = Math.floor($scope.startTime - startMinutes * 60);
					if(startSeconds < 10){
						startSeconds = "0"+ startSeconds;
					}
					var endMinutes = Math.floor($scope.endTime / 60);
					if(endMinutes < 10){
						endMinutes =  "0"+endMinutes;
					}
					var endSeconds = Math.floor($scope.endTime - endMinutes * 60);
					if(endSeconds < 10){
						endSeconds = "0"+ endSeconds;
					}

			        $scope.entireTranscript[$scope.clickedTranscriptIndex] = {
			      		startTime: $scope.startTime,
			        	endTime: $scope.endTime,
			          	transcript: $scope.transcript,
			          	postedTime: month+'/'+day+'/'+year,
			          	startMinsSecs: startMinutes+":"+startSeconds,
						endMinsSecs: endMinutes+":"+endSeconds
			          	
			        }
			        $scope.editOrAddButton = 'Add to Transcript >>'
			    	$scope.addButtonClass = 'btn #0d47a1 light-blue darken-4 waves-effect'
			    	$scope.clickedTranscriptIndex = -1
			    	$scope.transcript = ''
					$scope.startTimes = '00:00'
					$scope.endTimes = '00:00'
					// $scope.saveForm();
					// window.location.reload()
				}		
			}
			$scope.clickedTranscriptIndex = -1
			$scope.transcript = ''
			$scope.startTimes = '00:00'
			$scope.endTimes = '00:00'
			$scope.timeRangeConflict = ''
		}else{
			$scope.timeRangeConflict = 'Invalid time range, current range overlaps with a previously saved transcript'
		}
	}	
  	$scope.clearForm = function(){
		$scope.editOrAddButton = 'Add to Transcript >>'
    	$scope.addButtonClass = 'btn #0d47a1 light-blue darken-4 waves-effect'
    	$scope.clickedTranscriptIndex = -1
    	$scope.transcript = ''
		$scope.startTimes = '00:00'
		$scope.endTimes = '00:00'  
		$scope.timeRange.splice($scope.clickedTranscriptIndex, 0, $scope.tempTimeRange)  	
  	}  	
  	$scope.startTimeFunc = function(){
    	var theVid = document.getElementById("theVid")
    	$scope.startTime = theVid.currentTime.toFixed(0)
		var startMinutes = Math.floor($scope.startTime / 60);
		if(startMinutes < 10){
			startMinutes = '0'+ startMinutes;
		}
		var startSeconds = Math.floor($scope.startTime - startMinutes * 60);
		if(startSeconds < 10){
			startSeconds = "0"+ startSeconds;
		}
		$scope.startMins = startMinutes
		$scope.startSeconds = startSeconds
		$scope.startTimes = startMinutes+":"+startSeconds
		theVid.play(); 
  	}

  	$scope.endTimeFunc = function(){
		var theVid = document.getElementById("theVid")
		var endTempTime = theVid.currentTime.toFixed(0);
		
			$scope.endTime = endTempTime
			var endMinutes = Math.floor($scope.endTime / 60);
			if(endMinutes < 10){
				endMinutes =  "0"+endMinutes;
			}
			var endSeconds = Math.floor($scope.endTime - endMinutes * 60);
			if(endSeconds < 10){
				endSeconds = "0"+ endSeconds;
			}
			$scope.endMins = endMinutes
			$scope.endSecs = endSeconds
			$scope.endTimes = endMinutes+":"+endSeconds
			theVid.pause(); 
		
		
  	}
  	$scope.rewind = function(){
    	var theVid = document.getElementById("theVid")
    	theVid.currentTime -= 3
    	theVid.currentTime = theVid.currentTime
  	}	 
  	$scope.forward = function(){
    	var theVid = document.getElementById("theVid")
    	theVid.currentTime += 3
  	}	   	
  	$scope.pause = function(){
    	var theVid = document.getElementById("theVid")
    	theVid.pause();
  	}
  	$scope.play = function(){
    	var theVid = document.getElementById("theVid")
    	theVid.play();
  	}	   	  	  		   	  	
	$scope.changeFamilyName = function(){
		$scope.familyName = $scope.tempFamilyName
		var tempDataToSend = {
			familyName : $scope.familyName,
			token: $location.$$path.slice(16)
		}
  	    $http({
			method:'POST',
      		url: 'http://dangconnie.com:3030/changeFamilyName/',
      		data: tempDataToSend
    	}).then(
	      	function successFunction(data){
		        console.log(data)
    		  },
      		function failedFunction(data){
        		console.log("fail")
      		}
    	)
  	}

  	// send transcript to the backend
	$scope.saveForm = function(){
		var transcriptUrl = 'http://dangconnie.com:3030/transcript/' + $location.$$path.slice(16)
		$http({
			method:'POST',
      		url: transcriptUrl,
      		data: $scope.entireTranscript
    	}).then(
      		function successFunction(data){
        	// console.log(data)
        	// console.log("form submitted!")
        	$scope.submissionStatus = "Form Saved Successfully"
	      	},
    	  	function failedFunction(data){
	    	    console.log("fail")
			}
  		)
  	} 

	$scope.submitForm = function(){
		console.log($scope.entireTranscript)
		
		var transcriptUrl = 'http://dangconnie.com:3030/transcript/' + $location.$$path.slice(16);
		$http({
			method:'POST',
      		url: transcriptUrl,
      		data: $scope.entireTranscript
    	}).then(
      		function successFunction(data){			
				var finishedUrl = 'http://dangconnie.com:3030/finished/' + $location.$$path.slice(16);
				var dataArray = [1]
				$http({
					method:'POST',
		      		url: finishedUrl,
		      		data: dataArray
		    	}).then(
		      		function successFunction(data){
			        	// console.log(data)
			        	// console.log('worked')
			        	$scope.submissionStatus = "Form submission success"
			        	$scope.seeFinishedButton = 'seeFinishedButton'
				    },
		    	  	function failedFunction(data){
			    	    console.log("fail")
			    	    $scope.submissionStatus = "Form submission NOT successful, please try again"
					}
		  		)  		
	      	},
    	  	function failedFunction(data){
	    	    console.log("fail")
			}
  		)

  	}

	$scope.editTranscript = function(index){
	    $scope.editOrAddButton = 'Save Edited Transcript >>'
	    $scope.addButtonClass = 'btn #ffcc80 orange lighten-2 waves-effect'
	    $scope.transcript = $scope.entireTranscript[index].transcript;
	    $scope.startTime = $scope.entireTranscript[index].startTime;
	    $scope.endTime = $scope.entireTranscript[index].endTime;
	    $scope.clickedTranscriptIndex = index;
		// $scope.tempEditTranscript = $scope.entireTranscript[$scope.clickedTranscriptIndex]
		// $scope.entireTranscript.splice($scope.clickedTranscriptIndex, 1 )	    
	    var endTempTime = $scope.endTime
	    	if(endTempTime > $scope.startTime){
			$scope.endTime = endTempTime
			var endMinutes = Math.floor($scope.endTime / 60);
			if(endMinutes < 10){
				endMinutes =  "0"+endMinutes;
			}
			var endSeconds = Math.floor($scope.endTime - endMinutes * 60);
			if(endSeconds < 10){
				endSeconds = "0"+ endSeconds;
			}
			$scope.endMins = endMinutes
			$scope.endSecs = endSeconds
			$scope.endTimes = endMinutes+":"+endSeconds
		}
		var startMinutes = Math.floor($scope.startTime / 60);
		if(startMinutes < 10){
			startMinutes = '0'+ startMinutes;
		}
		var startSeconds = Math.floor($scope.startTime - startMinutes * 60);
		if(startSeconds < 10){
			startSeconds = "0"+ startSeconds;
		}
		$scope.startMins = startMinutes
		$scope.startSeconds = startSeconds
		$scope.startTimes = startMinutes+":"+startSeconds				
		$scope.tempTimeRange = $scope.timeRange[index]
	  	$scope.timeRange.splice(index, 1)
	}

	$scope.deleteTranscript = function(index){
		var deleteThis = confirm('Are you sure you want to delete this translation?');
		if(deleteThis){
			$scope.entireTranscript.splice(index, 1)
			var transcriptUrl = 'http://dangconnie.com:3030/transcript/' + $location.$$path.slice(16)
			$http({
				method:'POST',
	      		url: transcriptUrl,
	      		data: $scope.entireTranscript
	    	}).then(
	      		function successFunction(data){
	        	// console.log(data)
		      	},
	    	  	function failedFunction(data){
		    	    // console.log("fail")
				}
	  		)
    	}
	}

	$scope.bringToFinal = function(){
		var vidToken = $location.$$path.slice(16)
		$location.path('videoProduct/'+ vidToken)
	}
	


	// $(function(){
 //        $( "#draggable" ).draggable({ axis: "x", containment: "#containment-wrapper", scroll: false }).resizable({minHeight:90, containment: "#containment-wrapper" });
 //    });
    
    // $scope.draggableVidz = function (){
    //     var draggable = $('#draggable')
    //     $scope.theVid = document.getElementById("theVid")
    //     var duration = theVid.duration
    //     var offset = draggable[0].offsetLeft;
    //     var width = draggable[0].offsetWidth;
    //     var parent = $('#containment-wrapper')[0].offsetWidth;
    //     // $scope.startTimes = $('#draggable')[0].offsetLeft
    //     // abcde = $('#draggable')[0].offsetLeft
    //     $scope.theVid.currentTime = Math.floor((offset * ( duration / parent )))
    //     $scope.timez = $scope.theVid.currentTime
    //     // console.log(parent)
    //     // theVid.currentTime = 0
    //     // console.log(offset*(duration/parent))
    //     // offleft(duration/parent) = setStart
    // }
    
    // // $scope.startTimes = abcde
    
    // setTimeout(setInterval($scope.draggableVidz,50),1000);
    // function aaa(){
    // 	console.log($scope.timeRange)
    // }
    // setInterval(aaa, 3000)
}]);
