function onOpen()
{
  var ui = SpreadsheetApp.getUi();

  ui.createMenu('Generate PDF')
      .addItem('Time Report PDF', 'createTimeReportPdf')
      .addSeparator()
      .addToUi();

}

function onEdit(e)
{
  loadData();
  
  var eventSource = e.source;
  

  if(eventSource.getSheetName() === globalJournalSheet.getSheetName())
    journalSheet(e);

  if(eventSource.getSheetName() == globalEventSheet.getSheetName())
    eventSheet(e);

  compileTimeData();
  compileExpenseData();
  //parseXML()  

}

function loadData()
{
  fetchEventTypes();
  fetchPaymentTypes();
  fetchVehicleUsed();
}



function createTimeReportPdf()
{
  var strTimeReportFileName = "Time Report"
  var newSpreadSheet = SpreadsheetApp.create(strTimeReportFileName)
  var temp = globalTimeReportSheet.copyTo(newSpreadSheet)
  newSpreadSheet.getSheetByName('Sheet1').activate();
  newSpreadSheet.deleteActiveSheet();

  var pdf = DriveApp.getFileById(newSpreadSheet.getId()).getAs('application/pdf')
  DriveApp.createFile(pdf)
  DriveApp.removeFile(DriveApp.getFileById(newSpreadSheet.getId()))
}

