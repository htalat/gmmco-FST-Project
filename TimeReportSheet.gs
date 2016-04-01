
function compileTimeData()
{
  var row = CONSTANTS.cellDateHeader[0]+1
  var cellDate = globalJournalSheet.getRange(row,CONSTANTS.cellDateHeader[1]);
  var objTime1
  var objTime2
  var lngDifference
  var intEventId
  var objTimeRow
  var strNotes
  
  var strEvent = globalJournalSheet.getRange(row,CONSTANTS.cellEventTypeHeader[1]).getValue();
  var strDate  = cellDate.getValue();
  var blnChargeCustomer
  
  while(!cellDate.isBlank())
  {
    strDate = cellDate.getValue();
    strEvent = globalJournalSheet.getRange(row,CONSTANTS.cellEventTypeHeader[1]).getValue()
    intEventId = getEventDataTypeId(strEvent)
    if(intEventId === CONSTANTS.EventDataTypeId.lngTime)
    {
      if( globalObjTimeReportRows[strDate] == null)
        globalObjTimeReportRows[strDate] = new objTimeReportRow(strDate,0,0,0,0,0)
     
      objTimeRow = globalObjTimeReportRows[strDate];
      objTime1 = Date.parse(globalJournalSheet.getRange(row,CONSTANTS.cellTimeStartHeader[1]).getValue())
      objTime2 = Date.parse(globalJournalSheet.getRange(row,CONSTANTS.cellTimeStopHeader[1]).getValue())
      
      strNotes = globalJournalSheet.getRange(row,CONSTANTS.cellNotesHeader[1]).getValue()
      
      lngDifference = ((objTime2 - objTime1)/CONSTANTS.milliSecondsIn1Hour)
      blnChargeCustomer = getEventChargeCustomer(strEvent)
      
      if(blnChargeCustomer)
      {
        if(strEvent.indexOf("Travel") != -1)
        {
          if(lngDifference < 0)
            objTimeRow.travelTime+= handleNextDayTime(objTime1,objTime2)
          else
            objTimeRow.travelTime += lngDifference
        }
        
        if(strEvent.indexOf('Work') != -1)
        {
          if(lngDifference < 0)
            objTimeRow.regularTime+= handleNextDayTime(objTime1,objTime2)
          else
            objTimeRow.regularTime += lngDifference
          
          if(objTimeRow.regularTime > CONSTANTS.intMaximumShiftHours)
          {
            var tmp = objTimeRow.regularTime - CONSTANTS.intMaximumShiftHours
            objTimeRow.overTime = tmp
            objTimeRow.regularTime = CONSTANTS.intMaximumShiftHours
          }
        }
        objTimeRow.holidayTime = 0
        objTimeRow.dailyTotal = objTimeRow.regularTime + objTimeRow.overTime + objTimeRow.holidayTime +objTimeRow.travelTime
       // objTimeRow.notes = strNotes
        

      }
      
        
     
    }
    row++;
    cellDate = globalJournalSheet.getRange(row,CONSTANTS.cellDateHeader[1]);
    
  }

 fillTimeReport();
}

function emptyTimeReport()
{
  var row = CONSTANTS.cellTimeReportDateHeader[0] +1;
  globalTimeReportSheet.getRange(row,2,50,7).breakApart()
  globalTimeReportSheet.getRange(row,2,50,7).setBorder(false,false,false,false,false,false)
  globalTimeReportSheet.getRange(row,1,50,7).clearContent()  
}


function fillTimeReport()
{
  var row = CONSTANTS.cellTimeReportDateHeader[0] +1;
  var cellD  = globalTimeReportSheet.getRange(row, CONSTANTS.cellTimeReportDateHeader[1]);
 
  emptyTimeReport();

    for( x in globalObjTimeReportRows)
    {
      
      globalTimeReportTotal.regularTime +=  globalObjTimeReportRows[x].regularTime 
      globalTimeReportTotal.overTime    +=  globalObjTimeReportRows[x].overTime        
      globalTimeReportTotal.holidayTime +=  globalObjTimeReportRows[x].holidayTime
      globalTimeReportTotal.travelTime  +=  globalObjTimeReportRows[x].travelTime
      globalTimeReportTotal.dailyTotal  +=  globalObjTimeReportRows[x].dailyTotal    
      
      
      globalTimeReportSheet.getRange(row,CONSTANTS.cellTimeReportDateHeader[1]).setValue(globalObjTimeReportRows[x].date);
      globalTimeReportSheet.getRange(row,CONSTANTS.cellTimeReportRegularTimeHeader[1]).setValue(globalObjTimeReportRows[x].regularTime);
      globalTimeReportSheet.getRange(row,CONSTANTS.cellTimeReportOverTimeHeader[1]).setValue(globalObjTimeReportRows[x].overTime);
      globalTimeReportSheet.getRange(row,CONSTANTS.cellTimeReportHolidayTimeHeader[1]).setValue(globalObjTimeReportRows[x].holidayTime);
      globalTimeReportSheet.getRange(row,CONSTANTS.cellTimeReportTravelTimeHeader[1]).setValue(globalObjTimeReportRows[x].travelTime);
      globalTimeReportSheet.getRange(row,CONSTANTS.cellTimeReportDailyTotalHeader[1]).setValue(globalObjTimeReportRows[x].dailyTotal);
      
      row++;  
    }
    
  
  row += 1
  
  globalTimeReportSheet.getRange(row,CONSTANTS.cellTimeReportDateHeader[1]).setValue("TOTAL")
  globalTimeReportSheet.getRange(row,CONSTANTS.cellTimeReportRegularTimeHeader[1]).setValue(globalTimeReportTotal.regularTime)
  globalTimeReportSheet.getRange(row,CONSTANTS.cellTimeReportOverTimeHeader[1]).setValue(globalTimeReportTotal.overTime)
  globalTimeReportSheet.getRange(row,CONSTANTS.cellTimeReportHolidayTimeHeader[1]).setValue(globalTimeReportTotal.holidayTime)
  globalTimeReportSheet.getRange(row,CONSTANTS.cellTimeReportTravelTimeHeader[1]).setValue(globalTimeReportTotal.travelTime)
  globalTimeReportSheet.getRange(row,CONSTANTS.cellTimeReportDailyTotalHeader[1]).setValue(globalTimeReportTotal.dailyTotal)
  
  row += 1
  
  
  globalTimeReportSheet.getRange(++row,1).setValue("Technician:")
  globalTimeReportSheet.getRange(row,2).setValue(globalJournalSheet.getRange(CONSTANTS.cellTechnicianValue[0],CONSTANTS.cellTechnicianValue[1]).getValue())
  
  globalTimeReportSheet.getRange(++row,1).setValue("Serial No:")
  globalTimeReportSheet.getRange(row,2).setValue(globalJournalSheet.getRange(CONSTANTS.cellSerialNumberValue[0],CONSTANTS.cellSerialNumberValue[1]).getValue())
  globalTimeReportSheet.getRange(++row,1).setValue("Hour Meter:")
  globalTimeReportSheet.getRange(row,2).setValue(globalJournalSheet.getRange(CONSTANTS.cellHourMeterValue[0],CONSTANTS.cellHourMeterValue[1]).getValue())
  globalTimeReportSheet.getRange(++row,1).setValue("Signed By:")
  globalTimeReportSheet.getRange(row,2).setValue(globalJournalSheet.getRange(CONSTANTS.cellContactValue[0],CONSTANTS.cellContactValue[1]).getValue())
  globalTimeReportSheet.getRange(++row,1).setValue("Phone:")
  globalTimeReportSheet.getRange(row,2).setValue(globalJournalSheet.getRange(CONSTANTS.cellPhoneValue[0],CONSTANTS.cellPhoneValue[1]).getValue())
  globalTimeReportSheet.getRange(++row,1).setValue("Email:")
  globalTimeReportSheet.getRange(row,2).setValue(globalJournalSheet.getRange(CONSTANTS.cellEmailValue[0],CONSTANTS.cellEmailValue[1]).getValue())
  row+= 2
  globalTimeReportSheet.getRange(row,2,5,3).merge()
  globalTimeReportSheet.getRange(row,2,5,3).setBorder(true,true,true,true,false,false)
  globalTimeReportSheet.getRange(++row,1).setValue("Signature:")
  
}


function getTimeReportRowIndex(strDate)
{
  for(var i=0;i<globalObjTimeReportRows.length;i++)
  {
    if(globalObjTimeReportRows[i].date == strDate)
    {
      return i;
    }
   
  }
   return -1;
}
function handleNextDayTime(objTime1,objTime2)
{
  var objTmp = objTime2
  objTmp += CONSTANTS.milliSecondsIn1Day
  var objTime2NextDay = new Date(objTmp)
  return (objTime2NextDay - objTime1)/(CONSTANTS.milliSecondsIn1Hour)

}
