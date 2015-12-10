/*
 this function is triggered when journalSheet is triggered.
*/
function journalSheet(e) 
{
    var cellSource = e.range;
    var cellSourceRow = cellSource.getRow();
    var cellSourceColumn = cellSource.getColumn();
    var strSourceData = cellSource.getValue();
  

   if(cellSourceRow > CONSTANTS.rangeTableBoundary[0][0] && cellSourceColumn <= (CONSTANTS.rangeTableBoundary[1][1]-1))
    {
      
      if(cellSourceColumn === CONSTANTS.cellEventTypeHeader[1])
      {
        clearJournalRowColors(cellSourceRow);
        var lngEventTypeId = getEventDataTypeId(strSourceData); 
        var cellEventSelected = globalJournalSheet.getRange(cellSourceRow,cellSourceColumn);
        var lngEventId = getEventId(strSourceData);
         colorJournalCells(lngEventTypeId,cellSourceRow,lngEventId);
        if(lngEventId != -1)
        {
          globalJournalSheet.getRange(cellSourceRow,CONSTANTS.cellEventIDHeader[1]).setValue(lngEventTypeId)
         var rowId = getNextAvailableRowID()
         globalJournalSheet.getRange(cellSourceRow,CONSTANTS.cellRowIDHeader[1]).setValue(rowId)  
        }
        else
        {
          globalJournalSheet.getRange(cellSourceRow,CONSTANTS.cellEventIDHeader[1]).clearContent()
          globalJournalSheet.getRange(cellSourceRow,CONSTANTS.cellRowIDHeader[1]).clearContent()
        }
          
       
      }
      if(cellSourceColumn === CONSTANTS.cellPaymentTypeHeader[1])
      {
        var cellPayment = globalJournalSheet.getRange(cellSourceRow,cellSourceColumn);
        setPaymentType(cellPayment);
        var lngPaymentTypeId = getPaymentTypeId(cellPayment.getValue())
        if(lngPaymentTypeId != -1)
          globalJournalSheet.getRange(cellSourceRow,CONSTANTS.cellPaymentTypeIDHeader[1]).setValue(lngPaymentTypeId)
        else
          globalJournalSheet.getRange(cellSourceRow,CONSTANTS.cellPaymentTypeIDHeader[1]).clearContent()  
      }
  
      if(cellSourceColumn === CONSTANTS.cellVehicleUsedHeader[1])
      { 
        var cellVehicleUsed = globalJournalSheet.getRange(cellSourceRow,cellSourceColumn);
        setVehicleUsed(cellVehicleUsed);
        var lngVehicleUsedId = getVehicleUsedId(cellVehicleUsed.getValue())
        if(lngVehicleUsedId != -1)
          globalJournalSheet.getRange(cellSourceRow,CONSTANTS.cellVehicleUsedIDHeader[1]).setValue(lngVehicleUsedId)
        else
          globalJournalSheet.getRange(cellSourceRow,CONSTANTS.cellVehicleUsedIDHeader[1]).clearContent()
        
      }

      validateRow(cellSourceRow);
        
    }
 
}
/*
  row validation
*/
function validateRow(row)
{
  var cellDate         = globalJournalSheet.getRange(row , CONSTANTS.cellDateHeader[1]);
  var cellEvent        = globalJournalSheet.getRange(row , CONSTANTS.cellEventTypeHeader[1]);
  var cellTimeStart    = globalJournalSheet.getRange(row , CONSTANTS.cellTimeStartHeader[1]); 
  var cellTimeStop     = globalJournalSheet.getRange(row , CONSTANTS.cellTimeStopHeader[1]);
  var cellMiles        = globalJournalSheet.getRange(row , CONSTANTS.cellMilesHeader[1]);
  var cellVehicleUsed  = globalJournalSheet.getRange(row , CONSTANTS.cellVehicleUsedHeader[1]);
  var cellAmount       = globalJournalSheet.getRange(row , CONSTANTS.cellAmountHeader[1]);
  var cellPaymentType  = globalJournalSheet.getRange(row , CONSTANTS.cellPaymentTypeHeader[1]);
  var cellError        = globalJournalSheet.getRange(row , CONSTANTS.cellErrorHeader[1]);
  cellError.setValue(" ");
  
  if(validateData(cellDate,cellEvent,cellTimeStart,cellTimeStop,cellMiles,cellVehicleUsed,cellAmount,cellPaymentType,cellError))
  {
    var blnValidated = validateEmpty(cellDate.isBlank(),cellEvent,cellTimeStart.isBlank(),cellTimeStop.isBlank(),cellMiles.isBlank(),
                cellVehicleUsed.isBlank(),cellAmount.isBlank(),cellPaymentType.isBlank(), cellError);

  //if(!blnValidated)
  //{
   // var rowId = getNextAvailableRowID()
    //globalJournalSheet.getRange(row,CONSTANTS.cellRowIDHeader[1]).setValue(rowId)
  //}
 
  }
}


/*
  given a type of event & row colors the cells which are not to be filled in that row
*/
function colorJournalCells(lngEventTypeId, row, lngEventId)
{

  if(lngEventTypeId === CONSTANTS.EventDataTypeId.lngAmount)
  {
    colorJournalCell(COLORS.Red, row , CONSTANTS.cellTimeStartHeader[1]);
    colorJournalCell(COLORS.Red, row , CONSTANTS.cellTimeStopHeader[1]);
    colorJournalCell(COLORS.Red, row , CONSTANTS.cellVehicleUsedHeader[1]);    
    colorJournalCell(COLORS.Red, row , CONSTANTS.cellMilesHeader[1]);
    
  }else if(lngEventTypeId === CONSTANTS.EventDataTypeId.lngMileage){
    colorJournalCell(COLORS.Red, row , CONSTANTS.cellTimeStartHeader[1]);
    colorJournalCell(COLORS.Red, row , CONSTANTS.cellTimeStopHeader[1]);
    colorJournalCell(COLORS.Red, row , CONSTANTS.cellAmountHeader[1]);
    colorJournalCell(COLORS.Red, row , CONSTANTS.cellPaymentTypeHeader[1]);
    
  }else if(lngEventTypeId === CONSTANTS.EventDataTypeId.lngTime){
    colorJournalCell(COLORS.Red, row , CONSTANTS.cellMilesHeader[1]);
    colorJournalCell(COLORS.Red, row , CONSTANTS.cellVehicleUsedHeader[1]);
    colorJournalCell(COLORS.Red, row , CONSTANTS.cellAmountHeader[1]);
    colorJournalCell(COLORS.Red, row , CONSTANTS.cellPaymentTypeHeader[1]);
  
  }else if(lngEventTypeId === CONSTANTS.EventDataTypeId.lngTimeAmount ){
    colorJournalCell(COLORS.Red, row , CONSTANTS.cellMilesHeader[1]);
    colorJournalCell(COLORS.Red, row , CONSTANTS.cellVehicleUsedHeader[1]);
    
    var lngEventDefault = getEventDefault(lngEventId);
    globalJournalSheet.getRange(row , CONSTANTS.cellAmountHeader[1]).setValue(lngEventDefault);
    var strEventPaymentDefault = globalProgramDataSheet.getRange(CONSTANTS.cellDefaultPaymentType[0],CONSTANTS.cellDefaultPaymentType[1]).getValue();
    globalJournalSheet.getRange(row , CONSTANTS.cellPaymentTypeHeader[1]).setValue(strEventPaymentDefault);
  }
}
/*
  given a row number, clear the cell color to white  for time start to payment type
*/
function clearJournalRowColors(row)
{
   colorJournalCell(COLORS.White, row , CONSTANTS.cellTimeStartHeader[1]);
   colorJournalCell(COLORS.White, row , CONSTANTS.cellTimeStopHeader[1]);
   colorJournalCell(COLORS.White, row , CONSTANTS.cellMilesHeader[1]);
   colorJournalCell(COLORS.White, row , CONSTANTS.cellVehicleUsedHeader[1]);   
   colorJournalCell(COLORS.White, row , CONSTANTS.cellAmountHeader[1]);
   colorJournalCell(COLORS.White, row , CONSTANTS.cellPaymentTypeHeader[1]);

}
/*
   given a Color (str), row (r) , column (c), colors the cell to the color inputted.
*/
function colorJournalCell(str, r , c)
{
  globalJournalSheet.getRange(r , c).setBackground(str);
}

var submitError = ""

function btnSubmitButton()
{
  var ui = SpreadsheetApp.getUi(); // Same variations.

  var result = ui.alert(
     'Please confirm',
     'Are you sure you want to submit?',
      ui.ButtonSet.YES_NO);

  if (result == ui.Button.YES) {
  
    
    if(checkForErrors() && checkPayrollClassification())
    {
    
      globalJournalSheet.getRange(CONSTANTS.cellSubmitDateValue[0],CONSTANTS.cellSubmitDateValue[1]).setValue(new Date())
    
    }
    else
      Browser.msgBox("There are some errors! Fix them first in order to submit\n" + submitError)
      
      
  } else {

    
  } 

}


function clearAllButton()
{
  var ui = SpreadsheetApp.getUi(); // Same variations.

  var result = ui.alert(
     'Please confirm',
     'Are you sure you want to clear all?',
      ui.ButtonSet.YES_NO);

  if (result == ui.Button.YES) {
  
    clearAll();
    
  } else {

    
  } 
}

function clearAll()
{
  var row = CONSTANTS.cellDateHeader[0] + 1
  var col = CONSTANTS.cellDateHeader[1]
  var cellTemp = globalJournalSheet.getRange(row,col)
  
  var col_1 = col
  var col_2 = CONSTANTS.cellTimeStopHeader[1]
  
  var col_3 = CONSTANTS.cellMilesHeader[1]
  var col_4 = CONSTANTS.cellRowIDHeader[1]+1
  
  var range1
  var range2
  
  while(!cellTemp.isBlank())
  {
  
    range1 = globalJournalSheet.getRange(row,col_1,1,4)
    range2 = globalJournalSheet.getRange(row,col_3,1,col_4-col_3)
    
    range1.clearContent()
    range2.clearContent()
    
    range1.setBackground(COLORS.White)
    range2.setBackground(COLORS.White)
  
 
    row++;
    cellTemp = globalJournalSheet.getRange(row,col)
  }
  
  emptyTimeReport();
  emptyExpenseReport();
  
}


function sortButton()
{
 var range = globalJournalSheet.getRange(CONSTANTS.cellDateHeader[0]+1,CONSTANTS.cellDateHeader[1],500,15)
 range.sort(1) 
}

function checkForErrors()
{
  var row = CONSTANTS.cellDateHeader[0] +1;
  var blnError = globalJournalSheet.getRange(row,CONSTANTS.cellDateHeader[1]).isBlank()


  while(!blnError)
  {
    
    var cellCheck = globalJournalSheet.getRange(row,CONSTANTS.cellErrorHeader[1]).isBlank()
    if(!cellCheck)
    {
      submitError = "Row: " + row + " not filled correctly\n"
      return false
    }
    
    row ++ 
    blnError = globalJournalSheet.getRange(row,CONSTANTS.cellErrorHeader[1]).isBlank()
  }

  return true

}


function checkPayrollClassification()
{
  if(globalEmployeePayrollClassification  == CONSTANTS.lngNonExemptFST)
    return true;

  var dateRange = []
  var row = CONSTANTS.cellDateHeader[0] +1
  var cell =  globalJournalSheet.getRange(row,CONSTANTS.cellDateHeader[1]).isBlank()
  var  countCells  = 0
  dateRange.push(new Date( globalJournalSheet.getRange(row,CONSTANTS.cellDateHeader[1]).getValue() ))

  while(!cell)
  {
    countCells++
    row++
    cell =  globalJournalSheet.getRange(row,CONSTANTS.cellDateHeader[1]).isBlank()  
  }

  dateRange.push(new Date(globalJournalSheet.getRange(row-1,CONSTANTS.cellDateHeader[1]).getValue()))

  var dates = getDates(dateRange[0],dateRange[1])
  var datesCount = new Array(dates.length)
  for(var d = 0;d<datesCount.length;d++)
  {
    datesCount[d] =0
  }
  
  row = CONSTANTS.cellDateHeader[0] +1
  cell =  globalJournalSheet.getRange(row,CONSTANTS.cellDateHeader[1]).isBlank()
  var indexFound = -1
  var tmpCount = 0
  while(!cell)
  {
    var tmp = new Date(globalJournalSheet.getRange(row,CONSTANTS.cellDateHeader[1]).getValue())
    for(var i=0;i<dates.length;i++)
    {
      if(( (dates[i].getDate() == tmp.getDate()) && (dates[i].getMonth() == tmp.getMonth()) && (dates[i].getYear() == tmp.getYear()) ))
      {
        datesCount[i]++
        continue;      
      }     
    }    
    row++
    cell =  globalJournalSheet.getRange(row,CONSTANTS.cellDateHeader[1]).isBlank()  
  } 

  for( var d = 0;d<datesCount.length;d++)
  {
   if(datesCount[d] == 0)
   {
    submitError = "Missing entry for: "+ (dates[d].getMonth()+1)+ "/"+ dates[d].getDate() +"/"+ dates[d].getYear() + "\n"
    return false;     
   }
  
  }
  return true;
}

function getDates(startDate, stopDate) 
{
  var dateArray = new Array();
  var currentDate = startDate;

  var tmpStart = startDate
  var startDay = tmpStart.getDay();
  
  while(startDay >1)
  {
    tmpStart = addDays(tmpStart,-1);
    dateArray.push(tmpStart)
    startDay = tmpStart.getDay()
    Logger.log("start: " + startDay)
  }
  
  while (currentDate <= stopDate) 
  {
    dateArray.push(currentDate)
    currentDate = addDays(currentDate,1);
  }
  
  var tmpStop = stopDate
  var endDay = tmpStop.getDay()
  
  while(endDay <6)
  {
    tmpStop = addDays(tmpStop,1);
    dateArray.push(tmpStop) 
    endDay = tmpStop.getDay()
    Logger.log("end: " + endDay)
  }
  
  return dateArray;
}

 function addDays(currentDate,days) 
{
  var dat = new Date(currentDate.valueOf())
  dat.setDate(dat.getDate() + days);
  return dat;
}
