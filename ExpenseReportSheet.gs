
function compileExpenseData()
{
  SpreadsheetApp.flush()
  var row = CONSTANTS.cellDateHeader[0] +1
  var cellDate = globalJournalSheet.getRange(row,CONSTANTS.cellDateHeader[1]);
 
  var mnyAirCC,mnyAirOP,mnyRoadCC,mnyRoadOP,mnyLodgingCC,mnyLodgingOP,mnyFoodCC,mnyFoodOP,mnyOtherCC,mnyOtherOP
  var objExpenseRow
  
  var strDate,strEvent,intEventId,strPaymentType,strAmount
  strEvent = globalJournalSheet.getRange(row,CONSTANTS.cellEventTypeHeader[1]).getValue();
  strDate  = cellDate.getValue();
  
  while(!cellDate.isBlank())
  {
    strDate = cellDate.getValue();
    strEvent = globalJournalSheet.getRange(row,CONSTANTS.cellEventTypeHeader[1]).getValue()
    intEventId = getEventDataTypeId(strEvent) 
    
    if(intEventId != CONSTANTS.EventDataTypeId.lngTime)
    {
       if( globalObjExpenseReportRows[strDate] == null)
         globalObjExpenseReportRows[strDate] = new objExpenseReportRow(strDate,0,0,0,0,0,0,0,0,0,0)
     
         objExpenseRow = globalObjExpenseReportRows[strDate];   
         mnyAirCC      = objExpenseRow.airCC
         mnyAirOP      = objExpenseRow.airOP
         mnyRoadCC     = objExpenseRow.roadCC
         mnyRoadOP     = objExpenseRow.roadOP
         mnyLodgingCC  = objExpenseRow.lodgingCC
         mnyLodgingOP  = objExpenseRow.lodgingOP
         mnyFoodCC     = objExpenseRow.foodCC
         mnyFoodOP     = objExpenseRow.foodOP
         mnyOtherCC    = objExpenseRow.otherCC
         mnyOtherOP    = objExpenseRow.otherOP

      if(intEventId === CONSTANTS.EventDataTypeId.lngMileage)
      { 
        var strVehicleUsed  = globalJournalSheet.getRange(row,CONSTANTS.cellVehicleUsedHeader[1]).getValue()
        if(strVehicleUsed.indexOf('Personal') != -1)
        { 
          var strMiles    = globalJournalSheet.getRange(row,CONSTANTS.cellMilesHeader[1]).getValue()
          var rateMileage = globalExpenseReportSheet.getRange(CONSTANTS.ExpenseReport.cellMileageRate[0],CONSTANTS.ExpenseReport.cellMileageRate[1]).getValue() 
          var mnyMileage  = rateMileage * strMiles
          mnyRoadOP += mnyMileage
        
        }
      }

       strPaymentType = globalJournalSheet.getRange(row,CONSTANTS.cellPaymentTypeHeader[1]).getValue()
       strAmount      = globalJournalSheet.getRange(row,CONSTANTS.cellAmountHeader[1]).getValue()
      
      if(intEventId === CONSTANTS.EventDataTypeId.lngAmount)
      {
        if( (strEvent.indexOf('Air') != -1) || (strEvent.indexOf('Baggage') != -1) )
        {
          if((strPaymentType.indexOf('Pocket') != -1) || strPaymentType.indexOf('OOP') != -1)
            mnyAirOP += strAmount
          else if ((strPaymentType.indexOf('Company') != -1) || (strPaymentType.indexOf('CC') != -1))
            mnyAirCC += strAmount
        }
        
        if( (strEvent.indexOf('Rental') != -1) || (strEvent.indexOf('Fuel') != -1) || (strEvent.indexOf('Parking') != -1 ) || (strEvent.indexOf('Taxi') != -1))
        {
          if((strPaymentType.indexOf('Pocket') != -1) || strPaymentType.indexOf('OOP') != -1)
            mnyRoadOP += strAmount
          else if ((strPaymentType.indexOf('Company') != -1) || (strPaymentType.indexOf('CC') != -1))
            mnyRoadCC += strAmount
        }
        
        if( (strEvent.indexOf('Lodging') != -1))
        {
          if((strPaymentType.indexOf('Pocket') != -1) || strPaymentType.indexOf('OOP') != -1)
            mnyLodgingOP += strAmount
          else if ((strPaymentType.indexOf('Company') != -1) || (strPaymentType.indexOf('CC') != -1))
            mnyLodgingCC += strAmount
        }
        
        if( (strEvent.indexOf('Other') != -1) )
        {
          if((strPaymentType.indexOf('Pocket') != -1) || strPaymentType.indexOf('OOP') != -1)
            mnyOtherOP += strAmount
          else if ((strPaymentType.indexOf('Company') != -1) || (strPaymentType.indexOf('CC') != -1))
            mnyOtherCC += strAmount
        }
      }
      
      if(intEventId === CONSTANTS.EventDataTypeId.lngTimeAmount)
      {
        if((strPaymentType.indexOf('Pocket') != -1) || strPaymentType.indexOf('OOP') != -1)
          mnyFoodOP += strAmount
       else if ((strPaymentType.indexOf('Company') != -1) || (strPaymentType.indexOf('CC') != -1))
          mnyFoodCC += strAmount
      }
      
      
      
      objExpenseRow.airCC     = mnyAirCC
      objExpenseRow.airOP     = mnyAirOP
      objExpenseRow.roadCC    = mnyRoadCC
      objExpenseRow.roadOP    = mnyRoadOP
      objExpenseRow.lodgingCC = mnyLodgingCC
      objExpenseRow.lodgingOP = mnyLodgingOP
      objExpenseRow.foodCC    = mnyFoodCC
      objExpenseRow.foodOP    = mnyFoodOP
      objExpenseRow.otherCC   = mnyOtherCC
      objExpenseRow.otherOP   = mnyOtherOP
      
      
    }
    row++
    cellDate = globalJournalSheet.getRange(row,CONSTANTS.cellDateHeader[1])
  }
  
  fillExpenseData();
}
function emptyExpenseReport()
{
  var row = CONSTANTS.ExpenseReport.cellDateHeader[0] +1;
  globalExpenseReportSheet.getRange(row,1,50,14).breakApart()
  globalExpenseReportSheet.getRange(row,1,50,14).setBorder(false,false,false,false,false,false)
  globalExpenseReportSheet.getRange(row,1,50,14).clearContent()
  globalExpenseReportSheet.getRange(row,1,50,14).setFontWeight('normal')
  globalExpenseReportSheet.getRange(row,1,50,14).setHorizontalAlignment("center")    
}

function fillExpenseData()
{
  var row = CONSTANTS.ExpenseReport.cellDateHeader[0] +1;
  emptyExpenseReport();
 var cellD  = globalTimeReportSheet.getRange(row, CONSTANTS.ExpenseReport.cellDateHeader[1]);
   
  for( x in globalObjExpenseReportRows)
    {
      
      globalExpenseReportTotal.roadCC +=  globalObjExpenseReportRows[x].roadCC 
      globalExpenseReportTotal.roadOP +=  globalObjExpenseReportRows[x].roadOP        
      
      globalExpenseReportTotal.airCC  +=  globalObjExpenseReportRows[x].airCC
      globalExpenseReportTotal.airOP  +=  globalObjExpenseReportRows[x].airOP
      
      globalExpenseReportTotal.lodgingCC  +=  globalObjExpenseReportRows[x].lodgingCC    
      globalExpenseReportTotal.lodgingOP  +=  globalObjExpenseReportRows[x].lodgingOP
      
      globalExpenseReportTotal.foodCC  +=  globalObjExpenseReportRows[x].foodCC    
      globalExpenseReportTotal.foodOP  +=  globalObjExpenseReportRows[x].foodOP    
      
      globalExpenseReportTotal.otherCC  +=  globalObjExpenseReportRows[x].otherCC    
      globalExpenseReportTotal.otherOP  +=  globalObjExpenseReportRows[x].otherOP    
            
      globalExpenseReportSheet.getRange(row,CONSTANTS.ExpenseReport.cellDateHeader[1]).setValue(globalObjExpenseReportRows[x].date);
      
      globalExpenseReportSheet.getRange(row,CONSTANTS.ExpenseReport.cellAirTravelCCHeader[1]).setValue(globalObjExpenseReportRows[x].airCC);
      globalExpenseReportSheet.getRange(row,CONSTANTS.ExpenseReport.cellAirTravelOPHeader[1]).setValue(globalObjExpenseReportRows[x].airOP);
      
      globalExpenseReportSheet.getRange(row,CONSTANTS.ExpenseReport.cellRoadTravelCCHeader[1]).setValue(globalObjExpenseReportRows[x].roadCC);
      globalExpenseReportSheet.getRange(row,CONSTANTS.ExpenseReport.cellRoadTravelOPHeader[1]).setValue(globalObjExpenseReportRows[x].roadOP);
      
      globalExpenseReportSheet.getRange(row,CONSTANTS.ExpenseReport.cellLodgingCCHeader[1]).setValue(globalObjExpenseReportRows[x].lodgingCC);
      globalExpenseReportSheet.getRange(row,CONSTANTS.ExpenseReport.cellLodgingOPHeader[1]).setValue(globalObjExpenseReportRows[x].lodgingOP);
      
      
      globalExpenseReportSheet.getRange(row,CONSTANTS.ExpenseReport.cellFoodCCHeader[1]).setValue(globalObjExpenseReportRows[x].foodCC);
      globalExpenseReportSheet.getRange(row,CONSTANTS.ExpenseReport.cellFoodOPHeader[1]).setValue(globalObjExpenseReportRows[x].foodOP);
      
      globalExpenseReportSheet.getRange(row,CONSTANTS.ExpenseReport.cellOtherCCHeader[1]).setValue(globalObjExpenseReportRows[x].otherCC);
      globalExpenseReportSheet.getRange(row,CONSTANTS.ExpenseReport.cellOtherOPHeader[1]).setValue(globalObjExpenseReportRows[x].otherOP);
      
      row++;  
    }
  
  
  
    row += 1
  
    var totalRow = row
    
    globalExpenseReportSheet.getRange(row,1).setValue("TOTAL").setFontWeight('bold')
    globalExpenseReportSheet.getRange(row,1,1,11).setBorder(true,false,false,false,false,false)
    globalExpenseReportSheet.getRange(row,CONSTANTS.ExpenseReport.cellAirTravelCCHeader[1]).setValue(globalExpenseReportTotal.airCC).setFontWeight('bold')
    globalExpenseReportSheet.getRange(row,CONSTANTS.ExpenseReport.cellAirTravelOPHeader[1]).setValue(globalExpenseReportTotal.airOP).setFontWeight('bold')
    
    globalExpenseReportSheet.getRange(row,CONSTANTS.ExpenseReport.cellRoadTravelCCHeader[1]).setValue(globalExpenseReportTotal.roadCC).setFontWeight('bold')
    globalExpenseReportSheet.getRange(row,CONSTANTS.ExpenseReport.cellRoadTravelOPHeader[1]).setValue(globalExpenseReportTotal.roadOP).setFontWeight('bold')

    globalExpenseReportSheet.getRange(row,CONSTANTS.ExpenseReport.cellLodgingCCHeader[1]).setValue(globalExpenseReportTotal.lodgingCC).setFontWeight('bold')
    globalExpenseReportSheet.getRange(row,CONSTANTS.ExpenseReport.cellLodgingOPHeader[1]).setValue(globalExpenseReportTotal.lodgingOP).setFontWeight('bold')    
    
  
    globalExpenseReportSheet.getRange(row,CONSTANTS.ExpenseReport.cellFoodCCHeader[1]).setValue(globalExpenseReportTotal.foodCC).setFontWeight('bold')
    globalExpenseReportSheet.getRange(row,CONSTANTS.ExpenseReport.cellFoodOPHeader[1]).setValue(globalExpenseReportTotal.foodOP).setFontWeight('bold')    
  
  
    globalExpenseReportSheet.getRange(row,CONSTANTS.ExpenseReport.cellOtherCCHeader[1]).setValue(globalExpenseReportTotal.otherCC).setFontWeight('bold')
    globalExpenseReportSheet.getRange(row,CONSTANTS.ExpenseReport.cellOtherOPHeader[1]).setValue(globalExpenseReportTotal.otherOP).setFontWeight('bold')      
  
  
    row +=2
    var totalCC  = globalExpenseReportTotal.airCC + globalExpenseReportTotal.roadCC + globalExpenseReportTotal.lodgingCC + globalExpenseReportTotal.foodCC + globalExpenseReportTotal.otherCC
    var totalOP  = globalExpenseReportTotal.airOP + globalExpenseReportTotal.roadOP + globalExpenseReportTotal.lodgingOP + globalExpenseReportTotal.foodOP + globalExpenseReportTotal.otherOP
    
    globalExpenseReportSheet.getRange(row,1).setValue("Charged To Company Total:").setFontWeight('bold')
    globalExpenseReportSheet.getRange(row,3).setValue(totalCC).setFontWeight('bold') 
    
    row ++
    globalExpenseReportSheet.getRange(row,1).setValue("Out Of Pocket Total:").setFontWeight('bold')
    globalExpenseReportSheet.getRange(row,3).setValue(totalOP).setFontWeight('bold')
    row ++
  
  
}




function getExpenseReportRowIndex(strDate)
{
  for(var i=0;i<globalObjExpenseReportRows.length;i++)
  {
    if(globalObjExpenseReportRows[i].date == strDate)
    {
      return i;
    }
   
  }
   return -1;
}
