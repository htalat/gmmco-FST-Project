/*
  this function is triggered when a cell in Event sheet is edited
*/
function eventSheet(e)
{
   var cellSource = e.range;
   var cellRow = cellSource.getRow();
   var cellCol = cellSource.getColumn();
   var cellVal  = cellSource.getValue();
   var cellError = globalEventSheet.getRange(CONSTANTS.cellEventStatusValue[0],CONSTANTS.cellEventStatusValue[1]);
   globalEventSheet.getRange(CONSTANTS.cellEventStatusValue[0] , CONSTANTS.cellEventStatusValue[1]).clearContent();
 
   if(cellRow == CONSTANTS.cellEventDateValue[0] && cellCol == CONSTANTS.cellEventDateValue[1])
   {
     var cellDate  = globalEventSheet.getRange(CONSTANTS.cellEventDateValue[0],CONSTANTS.cellEventDateValue[1]);
     
     if(!validateDate(cellDate,cellError))
       return;

   }
   else if (cellRow == CONSTANTS.cellEventTypeValue[0] && cellCol == CONSTANTS.cellEventTypeValue[1])
   {
      var lngEventTypeId = getEventDataTypeId(cellVal); 
      var lngEventId = getEventId(cellVal);
      var cellEventSelected = globalEventSheet.getRange(cellRow,cellCol);
      setEventName(cellEventSelected);
      colorEventCells(lngEventTypeId,lngEventId);   
   }
   else if((cellRow >= CONSTANTS.cellEventTimeStartValue[0]  || cellRow <= CONSTANTS.cellEventTimeStopValue[0])
           && 
           (cellCol >= CONSTANTS.cellEventTimeStartValue[1]  || cellCol <= CONSTANTS.cellEventTimeStopValue[1]))
   {
     var cellTimeStart = globalEventSheet.getRange(CONSTANTS.cellEventTimeStartValue[0] , CONSTANTS.cellEventTimeStartValue[1]);
     var cellTimeStop  = globalEventSheet.getRange(CONSTANTS.cellEventTimeStopValue[0] , CONSTANTS.cellEventTimeStopValue[1]);
     if(!validateTime(cellTimeStart,cellTimeStop,cellError))
       return;
   }
   
   if(cellRow === CONSTANTS.cellEventPaymentTypeValue[0] && cellCol === CONSTANTS.cellEventPaymentTypeValue[1])
   {
     var cellPayment = globalEventSheet.getRange(cellRow,cellCol);
     setPaymentType(cellPayment);
   }
  
   if(cellRow === CONSTANTS.cellEventVehicleUsedValue[0] && cellCol === CONSTANTS.cellEventVehicleUsedValue[1])
   {
     var cellVehicleUsed = globalEventSheet.getRange(cellRow,cellCol);
     setVehicleUsed(cellVehicleUsed);
   }
  
   
   if(cellRow == CONSTANTS.cellEventSubmit[0] && cellCol == CONSTANTS.cellEventSubmit[1])
   {
     var cellValue = globalEventSheet.getRange(cellRow,cellCol).getValue().toUpperCase();
     if(cellValue=== CONSTANTS.cellEventSubmitValue)
       doAutoSubmit();  
   }
   
   
  
}
function doAutoSubmit()
{
  submitButtonPressed();
}  

/*
  Depending on the event type color the appropriate cells in the event sheet
*/

function colorEventCells(lngEventTypeId,lngEventId)
{
  clearColors('F'); 
  if(lngEventTypeId == CONSTANTS.EventDataTypeId.lngTime)
  {
    colorEventCell(COLORS.Red, CONSTANTS.cellEventMilesValue[0] , CONSTANTS.cellEventMilesValue[1], globalEventSheet.getSheetName());
    colorEventCell(COLORS.Red, CONSTANTS.cellEventAmountValue[0] , CONSTANTS.cellEventAmountValue[1], globalEventSheet.getSheetName());
    colorEventCell(COLORS.Red, CONSTANTS.cellEventVehicleUsedValue[0] , CONSTANTS.cellEventVehicleUsedValue[1], globalEventSheet.getSheetName());
    colorEventCell(COLORS.Red, CONSTANTS.cellEventPaymentTypeValue[0] , CONSTANTS.cellEventPaymentTypeValue[1], globalEventSheet.getSheetName());
    var cellTmp = globalEventSheet.getRange(CONSTANTS.cellEventTimeStartValue[0] , CONSTANTS.cellEventTimeStartValue[1]);
    globalEventSheet.setActiveRange(cellTmp);
  
  }else if (lngEventTypeId == CONSTANTS.EventDataTypeId.lngAmount)
  {
    colorEventCell(COLORS.Red, CONSTANTS.cellEventMilesValue[0] , CONSTANTS.cellEventMilesValue[1], globalEventSheet.getSheetName());
    colorEventCell(COLORS.Red, CONSTANTS.cellEventTimeStartValue[0] , CONSTANTS.cellEventTimeStartValue[1], globalEventSheet.getSheetName());
    colorEventCell(COLORS.Red, CONSTANTS.cellEventTimeStopValue[0] , CONSTANTS.cellEventTimeStopValue[1], globalEventSheet.getSheetName());
    colorEventCell(COLORS.Red, CONSTANTS.cellEventVehicleUsedValue[0] , CONSTANTS.cellEventVehicleUsedValue[1], globalEventSheet.getSheetName());    
    var cellTmp = globalEventSheet.getRange(CONSTANTS.cellEventAmountValue[0] , CONSTANTS.cellEventAmountValue[1]);
    globalEventSheet.setActiveRange(cellTmp);
    
  }else if (lngEventTypeId == CONSTANTS.EventDataTypeId.lngMileage)
  {
    colorEventCell(COLORS.Red, CONSTANTS.cellEventTimeStartValue[0] , CONSTANTS.cellEventTimeStartValue[1], globalEventSheet.getSheetName());
    colorEventCell(COLORS.Red, CONSTANTS.cellEventTimeStopValue[0] , CONSTANTS.cellEventTimeStopValue[1], globalEventSheet.getSheetName());
    colorEventCell(COLORS.Red, CONSTANTS.cellEventAmountValue[0] , CONSTANTS.cellEventAmountValue[1], globalEventSheet.getSheetName());
    colorEventCell(COLORS.Red, CONSTANTS.cellEventPaymentTypeValue[0] , CONSTANTS.cellEventPaymentTypeValue[1], globalEventSheet.getSheetName());    
    var cellTmp = globalEventSheet.getRange(CONSTANTS.cellEventMilesValue[0] , CONSTANTS.cellEventMilesValue[1]);
    globalEventSheet.setActiveRange(cellTmp);
  } else if(lngEventTypeId === CONSTANTS.EventDataTypeId.lngTimeAmount)
  {
    colorEventCell(COLORS.Red, CONSTANTS.cellEventMilesValue[0] , CONSTANTS.cellEventMilesValue[1], globalEventSheet.getSheetName());
    colorEventCell(COLORS.Red, CONSTANTS.cellEventVehicleUsedValue[0] , CONSTANTS.cellEventVehicleUsedValue[1], globalEventSheet.getSheetName());
    var lngEventDefault = getEventDefault(lngEventId);
    globalEventSheet.getRange(CONSTANTS.cellEventAmountValue[0] , CONSTANTS.cellEventAmountValue[1]).setValue(lngEventDefault);
    var strEventPaymentDefault = globalProgramDataSheet.getRange(CONSTANTS.cellDefaultPaymentType[0],CONSTANTS.cellDefaultPaymentType[1]).getValue();
    globalEventSheet.getRange(CONSTANTS.cellEventPaymentTypeValue[0] , CONSTANTS.cellEventPaymentTypeValue[1]).setValue(strEventPaymentDefault);
    
  }
}
/*
   helper function, clears format/content or all depending on the option provided
*/
function clearColors(options)
{
  var rangeClear = globalEventSheet.getRange(CONSTANTS.cellEventTimeStartValue[0],CONSTANTS.cellEventTimeStartValue[1],CONSTANTS.cellEventAmountValue[0],CONSTANTS.cellEventAmountValue[1]);
  if(options === 'C')
    rangeClear.clearContent();
  else if (options == 'E')
    rangeClear.clear();
  else if (options == 'F')
    rangeClear.clearFormat();   
}


/*
  when the button is pressed, validate the data entered once and populate the journal sheet
*/
function submitButtonPressed()
{
 if(validateColumn())
   submit();
  
}

function validateColumn()
{

   var cellEvent       = globalEventSheet.getRange(CONSTANTS.cellEventTypeValue[0] , CONSTANTS.cellEventTypeValue[1]);
   var cellDate        = globalEventSheet.getRange(CONSTANTS.cellEventDateValue[0], CONSTANTS.cellEventDateValue[1]); 
   var cellTimeStart   = globalEventSheet.getRange(CONSTANTS.cellEventTimeStartValue[0], CONSTANTS.cellEventTimeStartValue[1]);
   var cellTimeStop    = globalEventSheet.getRange(CONSTANTS.cellEventTimeStopValue[0], CONSTANTS.cellEventTimeStopValue[1]);    
   var cellMiles       = globalEventSheet.getRange(CONSTANTS.cellEventMilesValue[0] , CONSTANTS.cellEventMilesValue[1]);    
   var cellVehicleUsed = globalEventSheet.getRange(CONSTANTS.cellEventVehicleUsedValue[0] , CONSTANTS.cellEventVehicleUsedValue[1]); 
   var cellAmount      = globalEventSheet.getRange(CONSTANTS.cellEventAmountValue[0] , CONSTANTS.cellEventAmountValue[1]);
   var cellPaymentType = globalEventSheet.getRange(CONSTANTS.cellEventPaymentTypeValue[0] , CONSTANTS.cellEventPaymentTypeValue[1]);
   var cellError       = globalEventSheet.getRange(CONSTANTS.cellEventStatusValue[0] , CONSTANTS.cellEventStatusValue[1]);
   cellError.setValue(" ");
  
  if(validateData(cellDate,cellEvent,cellTimeStart,cellTimeStop,cellMiles,cellVehicleUsed,cellAmount,cellPaymentType,cellError))
  {
    if(!validateEmpty(cellDate.isBlank(),cellEvent,cellTimeStart.isBlank(),cellTimeStop.isBlank(),cellMiles.isBlank(),
                cellVehicleUsed.isBlank(),cellAmount.isBlank(),cellPaymentType.isBlank(), cellError))
      return false;
    
  }else
    return false;
  
  return true;
}


/*
  submit the data entered to the Journal Sheet
*/


function submit()
{
   var cellEvent     = globalEventSheet.getRange(CONSTANTS.cellEventTypeValue[0] , CONSTANTS.cellEventTypeValue[1]);
   
   var strEvent       = cellEvent.getValue();
   var lngEventTypeId = getEventDataTypeId(strEvent);
   var strDate        = globalEventSheet.getRange(CONSTANTS.cellEventDateValue[0], CONSTANTS.cellEventDateValue[1]).getValue(); 
   var strTimeStart   = globalEventSheet.getRange(CONSTANTS.cellEventTimeStartValue[0], CONSTANTS.cellEventTimeStartValue[1]).getValue();
   var strTimeStop    = globalEventSheet.getRange(CONSTANTS.cellEventTimeStopValue[0], CONSTANTS.cellEventTimeStopValue[1]).getValue();    
   var strAmount      = globalEventSheet.getRange(CONSTANTS.cellEventAmountValue[0] , CONSTANTS.cellEventAmountValue[1]).getValue();
   var strPaymentType = globalEventSheet.getRange(CONSTANTS.cellEventPaymentTypeValue[0] , CONSTANTS.cellEventPaymentTypeValue[1]).getValue();
   var strMiles       = globalEventSheet.getRange(CONSTANTS.cellEventMilesValue[0] , CONSTANTS.cellEventMilesValue[1]).getValue();    
   var strVehicleUsed = globalEventSheet.getRange(CONSTANTS.cellEventVehicleUsedValue[0] , CONSTANTS.cellEventVehicleUsedValue[1]).getValue();
   var strNotes       = globalEventSheet.getRange(CONSTANTS.cellEventNotesValue[0],CONSTANTS.cellEventNotesValue[1]).getValue(); 
   var cellStatus     = globalEventSheet.getRange(CONSTANTS.cellEventStatusValue[0] , CONSTANTS.cellEventStatusValue[1]);
   
  submitDataToJournal(strEvent,strDate,strTimeStart,strTimeStop,strAmount,strPaymentType,strMiles,strVehicleUsed,strNotes)
  clearValues();
  cellStatus.setValue("Submitted to Journal!");
}  

function submitDataToJournal(strEvent,strDate,strTimeStart,strTimeStop,strAmount,strPaymentType,strMiles,strVehicleUsed,strNotes)
{
  var row = getEmptyRowInJournal(CONSTANTS.cellDateHeader[0] +1, CONSTANTS.cellDateHeader[1])
  var lngEventTypeId = getEventDataTypeId(strEvent)
      
  globalJournalSheet.getRange(row,CONSTANTS.cellDateHeader[1]).setValue(strDate);
  globalJournalSheet.getRange(row,CONSTANTS.cellEventTypeHeader[1]).setValue(strEvent);  
  globalJournalSheet.getRange(row,CONSTANTS.cellTimeStartHeader[1]).setValue(strTimeStart);
  globalJournalSheet.getRange(row,CONSTANTS.cellTimeStopHeader[1]).setValue(strTimeStop);
  globalJournalSheet.getRange(row,CONSTANTS.cellAmountHeader[1]).setValue(strAmount);
  globalJournalSheet.getRange(row,CONSTANTS.cellPaymentTypeHeader[1]).setValue(strPaymentType);  
  globalJournalSheet.getRange(row,CONSTANTS.cellMilesHeader[1]).setValue(strMiles);
  globalJournalSheet.getRange(row,CONSTANTS.cellVehicleUsedHeader[1]).setValue(strVehicleUsed);
  
  globalJournalSheet.getRange(row,CONSTANTS.cellNotesHeader[1]).setValue(strNotes);

  
  // setting eventTypeID , payment type id , row id
  
  
  var lngEventId = getEventId(strEvent)
  if(lngEventId != -1)
    globalJournalSheet.getRange(row,CONSTANTS.cellEventIDHeader[1]).setValue(lngEventId)
  else
    globalJournalSheet.getRange(row,CONSTANTS.cellEventIDHeader[1]).clearContent()


  if(lngEventTypeId == CONSTANTS.EventDataTypeId.lngAmount || lngEventTypeId == CONSTANTS.EventDataTypeId.lngTimeAmount)
  {
    var lngPaymentTypeId = getPaymentTypeId(strPaymentType);
    Logger.log(lngPaymentTypeId);
   if(lngPaymentTypeId != -1)
     globalJournalSheet.getRange(row,CONSTANTS.cellPaymentTypeIDHeader[1]).setValue(lngPaymentTypeId)
   else
     globalJournalSheet.getRange(row,CONSTANTS.cellPaymentTypeIDHeader[1]).clearContent()   
    
  }else if (lngEventTypeId == CONSTANTS.EventDataTypeId.lngMileage)
  {
    var lngVehicleUsedId = getVehicleUsedId(strVehicleUsed)
    if(lngVehicleUsedId != -1)
      globalJournalSheet.getRange(row,CONSTANTS.cellVehicleUsedIDHeader[1]).setValue(lngVehicleUsedId)
    else
      globalJournalSheet.getRange(row,CONSTANTS.cellVehicleUsedIDHeader[1]).clearContent()
  }
  //  ADD A ROW ID HERE
  var rowId = getNextAvailableRowID()
  globalJournalSheet.getRange(row, CONSTANTS.cellRowIDHeader[1]).setValue(rowId);
  

  //  COLORING THE APPROPRIATE CELLS 
  if(lngEventTypeId === CONSTANTS.EventDataTypeId.lngTime)
    colorForTime(row)  
  else if(lngEventTypeId === CONSTANTS.EventDataTypeId.lngAmount)
    colorForAmount(row)
  else if(lngEventTypeId === CONSTANTS.EventDataTypeId.lngMileage)
    colorForMileage(row)
  else if(lngEventTypeId === CONSTANTS.EventDataTypeId.lngTimeAmount) 
    colorForTimeAmount(row)

}


function colorForTime(row)
{
  colorJournalCell(COLORS.Red,row,CONSTANTS.cellMilesHeader[1]);
  colorJournalCell(COLORS.Red,row,CONSTANTS.cellVehicleUsedHeader[1]);
  colorJournalCell(COLORS.Red,row,CONSTANTS.cellAmountHeader[1]);
  colorJournalCell(COLORS.Red,row,CONSTANTS.cellPaymentTypeHeader[1]);
 
}

function colorForAmount(row)
{
  colorJournalCell(COLORS.Red,row,CONSTANTS.cellMilesHeader[1]);
  colorJournalCell(COLORS.Red,row,CONSTANTS.cellVehicleUsedHeader[1]);
  colorJournalCell(COLORS.Red,row,CONSTANTS.cellTimeStartHeader[1]);
  colorJournalCell(COLORS.Red,row,CONSTANTS.cellTimeStopHeader[1]);
}


function colorForMileage(row)
{
  colorJournalCell(COLORS.Red,row,CONSTANTS.cellAmountHeader[1]);
  colorJournalCell(COLORS.Red,row,CONSTANTS.cellPaymentTypeHeader[1]);  
  colorJournalCell(COLORS.Red,row,CONSTANTS.cellTimeStartHeader[1]);
  colorJournalCell(COLORS.Red,row,CONSTANTS.cellTimeStopHeader[1]);
}


function colorForTimeAmount(row)
{
   colorJournalCell(COLORS.Red,row,CONSTANTS.cellMilesHeader[1]);  
   colorJournalCell(COLORS.Red,row,CONSTANTS.cellVehicleUsedHeader[1]);
}

// clearing all fields after hitting the submit button
function clearValues()
{
  globalEventSheet.getRange(CONSTANTS.cellEventTypeValue[0] , CONSTANTS.cellEventTypeValue[1]).clear();
  globalEventSheet.getRange(CONSTANTS.cellEventTimeStartValue[0], CONSTANTS.cellEventTimeStartValue[1]).clear();
  globalEventSheet.getRange(CONSTANTS.cellEventTimeStopValue[0], CONSTANTS.cellEventTimeStopValue[1]).clear();    
  globalEventSheet.getRange(CONSTANTS.cellEventAmountValue[0] , CONSTANTS.cellEventAmountValue[1]).clear();
  globalEventSheet.getRange(CONSTANTS.cellEventMilesValue[0] , CONSTANTS.cellEventMilesValue[1]).clear();
  globalEventSheet.getRange(CONSTANTS.cellEventVehicleUsedValue[0] , CONSTANTS.cellEventVehicleUsedValue[1]).clear();
  globalEventSheet.getRange(CONSTANTS.cellEventPaymentTypeValue[0] , CONSTANTS.cellEventPaymentTypeValue[1]).clear();
  globalEventSheet.getRange(CONSTANTS.cellEventNotesValue[0] , CONSTANTS.cellEventNotesValue[1]).clear();
  globalEventSheet.getRange(CONSTANTS.cellEventSubmit[0],CONSTANTS.cellEventSubmit[1]).clear(); 
}

// returns the row number which is empty in the journal sheet
function getEmptyRowInJournal(row,col)
{
   var cellTemp = globalJournalSheet.getRange(row,col);
   var blnCellTemp = cellTemp.isBlank();
 
   while(!blnCellTemp)
   {  
     row++; 
     blnCellTemp = globalJournalSheet.getRange(row,col).isBlank();
   } 
   return row;
}

// color a event sheet cell
function colorEventCell(str,r,c)
{
  globalEventSheet.getRange(r , c).setBackground(str);
}