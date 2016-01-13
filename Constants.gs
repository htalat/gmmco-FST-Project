var CONSTANTS = {
 
  xmlData: [1,3],
  // FOR EVENT SHEET
  cellEventDateValue:        [1,1],
  cellEventTypeValue:        [2,1],
  cellEventTimeStartValue:   [3,1],
  cellEventTimeStopValue:    [4,1],
  cellEventMilesValue:       [5,1],
  cellEventVehicleUsedValue: [6,1],
  cellEventAmountValue:      [7,1],
  cellEventPaymentTypeValue: [8,1],
  cellEventNotesValue:       [9,1],
  cellEventStatusValue:      [14,1],
  cellAutoSubmitValue:       [15,1],
  
  // FOR JOURNAL SHEET
  
  rangeTableBoundary:    [[13,1], [13,11]], // A13 -> J13
  cellDateHeader:        [13,1],           // DATE header         A13
  cellEventTypeHeader:   [13,2],           // EVENT TYPE header   B13
  cellTimeStartHeader:   [13,3],           // TIME START header   C13
  cellTimeStopHeader:    [13,4],           // TIME STOP header    D13
  cellDurationHeader:    [13,5],           // DURATION header     E13
  cellMilesHeader:       [13,6],           // MILES header        F13
  cellVehicleUsedHeader: [13,7],           // VEHICLE USED header G13
  cellAmountHeader:      [13,8],           // AMOUNT header       H13
  cellPaymentTypeHeader: [13,9],           // PAYMENT TYPE header I13
  cellNotesHeader:       [13,10],           // NOTES header        J13
  cellErrorHeader:       [13,11],          // ERROR header        K13
  
  cellEventIDHeader:       [13,12],
  cellPaymentTypeIDHeader: [13,13],
  cellVehicleUsedIDHeader: [13,14],
  cellRowIDHeader:         [13,15],
  
  cellTechnicianValue: [5,7],
  cellSerialNumberValue:[4,9],
  cellHourMeterValue: [5,9],
  cellContactValue: [6,9],
  cellPhoneValue: [7,9],
  cellEmailValue: [8,9],
 
  cellSubmitDateValue:[8,7],
  // FOR PROGRAM DATA SHEET
  
  cellProgramDataEventTypeIdHeader:   [7,1],    //Event Type ID        header A7
  cellProgramDataEventValueHeader:    [7,2],    //Event Value          header B7
  cellProgramDataTypeHeader:          [7,3],    //Event Type           header C7
  cellProgramDataDefaultHeader:       [7,4],    //Event Default        header D7
  cellProgramDataTypeIdHeader:        [7,5],    //Event Data Type ID   header E7
  cellProgramDataIsShortHeader:       [7,6],    //Event isShort        header F7
  cellProgramDataChargeCustomerHeader:[7,7],   //Event chargeCustomer  header G7
  
  cellProgramDataPaymentTypeIdHeader:       [2,8],   // PAYMENT TYPE ID       H2
  cellProgramDataPaymentTypeValueHeader:    [2,9],  // PAYMENT TYPE VALUE     I2
  cellProgramDataPaymentTypeIsShortHeader:  [2,10],  // PAYMENT TYPE IS SHORT J2
  
  cellProgramDataVehicleUsedIdHeader:       [2,11],   // VEHICLE USED ID       K2
  cellProgramDataVehicleUsedValueHeader:    [2,12],   // VEHICLE USED VALUE    L2
  cellProgramDataVehicleUsedIsShortHeader:  [2,13],   // VEHICLE USED IS SHORT M2
  

  cellTimeReportDateHeader:        [10,1],
  cellTimeReportRegularTimeHeader: [10,2],
  cellTimeReportOverTimeHeader:    [10,3],
  cellTimeReportHolidayTimeHeader: [10,4],
  cellTimeReportTravelTimeHeader:  [10,5],
  cellTimeReportDailyTotalHeader:  [10,6],
  cellTimeReportNotesHeader:       [10,7],
  
 
  ExpenseReport:{
    cellDateHeader:        [14,1],
    cellRoadTravelCCHeader:[14,2],
    cellRoadTravelOPHeader:[14,3],
    cellAirTravelCCHeader: [14,4],
    cellAirTravelOPHeader: [14,5],
    cellLodgingCCHeader:   [14,6],
    cellLodgingOPHeader:   [14,7],
    cellFoodCCHeader:      [14,8],
    cellFoodOPHeader:      [14,9],
    cellOtherCCHeader:     [14,10],
    cellOtherOPHeader:     [14,11],
    cellMileageRate:       [10,7],
  },
  
  JobData:{
    cellJobNumberHeader: [3,1],
    cellPlanStopDateHeader: [13,1]
  
  },
  
  milliSecondsIn1Day  : 1000*60*60*24,
  milliSecondsIn1Hour : 1000*60*60,  
  intMaximumShiftHours: 8,
  cellDefaultPaymentType:[4,9], 
  
  
  EventDataTypeId:
  {
   lngTime:       1,
   lngAmount:     2,
   lngMileage:    3,
   lngTimeAmount: 4,
  }
  

  
};


var COLORS = {
  Red : "red", 
  Blue: "#7082ff",
  White: "white"
};


  /* 
  ** Global Variables
  */
  var globalSpreadSheet = SpreadsheetApp.getActive();

  var globalJournalSheet       = globalSpreadSheet.getSheetByName('Journal')
  var globalProgramDataSheet   = globalSpreadSheet.getSheetByName('Program Data')
  var globalEventSheet         = globalSpreadSheet.getSheetByName('Event')
  var globalTimeReportSheet    = globalSpreadSheet.getSheetByName('Time Report')
  var globalExpenseReportSheet = globalSpreadSheet.getSheetByName('Expense Report') 
  var globalJobDataSheet       = globalSpreadSheet.getSheetByName('Job Data')
  

  var globalEventTypes   = [];  
  var globalPaymentTypes = [];
  var globalVehicleUsed  = [];
  var globalObjTimeReportRows = [];
  var globalObjExpenseReportRows = [];

  var globalTimeReportTotal=
   {
     regularTime: 0,
     overTime:    0,
     holidayTime: 0,
     travelTime:  0,
     dailyTotal:  0,
     notes: " "
   };

  var globalExpenseReportTotal=
  {
    roadCC:0,
    roadOP:0,
    airCC:0,
    airOP:0,
    lodgingCC:0,
    lodgingOP:0,
    foodCC:0,
    foodOP:0,
    otherCC:0,
    otherOP:0
  }
  
  var globalRowID = 1
  
  
function getNextAvailableRowID()
{
  var r = CONSTANTS.cellRowIDHeader[0]+1
   var cellRowId = globalJournalSheet.getRange( r, CONSTANTS.cellRowIDHeader[1])
  if (cellRowId.isBlank()) 
    return 1
  
  var max = 1
  while(!cellRowId.isBlank())
  {
    if(cellRowId.getValue() > max)
    {
      max = cellRowId.getValue() 
    }
  
    
    r++
    cellRowId = globalJournalSheet.getRange(r, CONSTANTS.cellRowIDHeader[1])  
    
  }
  max++
  return max
}
  