/*
  helper function for data validation
*/

function validateData(cellDate,cellEvent,cellTimeStart,cellTimeStop,cellMiles,cellVehicleUsed,cellAmount,cellPaymentType,cellError)
{
  if(!validateDate(cellDate,cellError))
    return false;
  
  var lngEventTypeId = getEventDataTypeId(cellEvent.getValue());
  
 if(lngEventTypeId === CONSTANTS.EventDataTypeId.lngAmount)
 {
   
   if(!validateAmountEvent(cellAmount, cellTimeStart, cellTimeStop, cellMiles, cellVehicleUsed ,cellError))
     return false;
 }
 if(lngEventTypeId === CONSTANTS.EventDataTypeId.lngTime)
 {
   var blnIsTravel = false;
   
   var intTest = cellEvent.getValue().indexOf("Travel");
   if(intTest > -1)
     blnIsTravel = true;
   else
     blnTravel = false;
   
   if(!validateTimeEvent(cellTimeStart, cellTimeStop,cellMiles, cellVehicleUsed, cellAmount, cellPaymentType,blnIsTravel,cellError))
     return false;
 }
 if(lngEventTypeId === CONSTANTS.EventDataTypeId.lngMileage)
 {
   
   if(!validateMileageEvent(cellMiles, cellTimeStart, cellTimeStop, cellAmount,cellPaymentType, cellError))
     return false;
 }
 if(lngEventTypeId ===  CONSTANTS.EventDataTypeId.lngTimeAmount)
 {
   var blnIsTravel = false;
   if(!validateTimeAmountEvent(cellTimeStart,cellTimeStop,cellAmount,cellPaymentType,cellMiles,cellVehicleUsed,blnIsTravel,cellError))
      return false;
   
 }
  return true;
}

// validate amount event

function validateAmountEvent(cellAmount, cellTimeStart, cellTimeStop, cellMiles, cellVehicleUsed ,cellError)
{
   if(!validateAmount(cellAmount,cellError))
     return false;
   
   var blnTimeStart = cellTimeStart.isBlank();
   var blnTimeStop  = cellTimeStop.isBlank();
   var blnMiles = cellMiles.isBlank();
   var blnVehicleUsed = cellVehicleUsed.isBlank();
   
   if(!blnTimeStop || !blnTimeStart || !blnMiles || !blnVehicleUsed)
   {cellError.setValue("Red Cells must be empty!"); return false;}
 
  return true;

}


// validate time event
function validateTimeEvent(cellTimeStart, cellTimeStop,cellMiles, cellVehicleUsed, cellAmount, cellPaymentType,blnIsTravel,cellError)
{

  if(!validateTime(cellTimeStart,cellTimeStop,blnIsTravel,cellError))
    return false;
  
  
  var blnAmount = cellAmount.isBlank();
  var blnPaymentType = cellPaymentType.isBlank();
  var blnMiles = cellMiles.isBlank();
  var blnVehicleUsed = cellVehicleUsed.isBlank();
   
  if(!blnAmount || !blnPaymentType || !blnMiles || !blnVehicleUsed)
  {  cellError.setValue("Red Cells must be empty!"); return false;}

  return true;
}



// validate mileage event
function validateMileageEvent(cellMiles,cellTimeStart, cellTimeStop, cellAmount,cellPaymentType, cellError)
{
  if(!validateMiles(cellMiles,cellError))
     return false;
   
  var blnTimeStart = cellTimeStart.isBlank();
  var blnTimeStop  = cellTimeStop.isBlank();
  if(!blnTimeStart || !blnTimeStop)
  {  cellError.setValue("Red Cells must be empty!"); return false;}   

  return true;
}

function validateTimeAmountEvent(cellTimeStart,cellTimeStop,cellAmount,cellPaymentType,cellMiles,cellVehicleUsed,blnIsTravel,cellError)
{
  if(!validateTime(cellTimeStart,cellTimeStop,blnIsTravel,cellError))
    return false;
  
  if(!validateAmount(cellAmount,cellError))
    return false;

   var blnMiles = cellMiles.isBlank();
   var blnVehicleUsed= cellVehicleUsed.isBlank();
   
  if(!blnMiles || !blnVehicleUsed)
  { cellError.setValue("Red Cells must be empty!"); return false; }

  return true;
}

/*
  helper function for row validation
*/

function validateEmpty(blnDate,cellEvent,blnTimeStart,blnTimeStop,blnMiles,blnVehicleUsed,blnAmount,blnPaymentType,cellError)
{ 

  var blnEvent = cellEvent.isBlank();
  if(!blnDate){
  if(blnEvent)
    {cellError.setValue("Select the Event Type !"); return false;}
  }

  var lngEventId = getEventDataTypeId(cellEvent.getValue());
  

  if(!cellEvent.isBlank()){
    if(blnDate)
    { cellError.setValue("Enter Date first!"); return false;}
  }

  if(lngEventId === CONSTANTS.EventDataTypeId.lngTime)
  {
    if(blnTimeStart)
    {cellError.setValue("Enter Time Start!"); return false;}

    if(blnTimeStop)
    {cellError.setValue("Enter Time Stop! "); return false;}

  }
  if(lngEventId === CONSTANTS.EventDataTypeId.lngMileage)
  {
    if(blnMiles)
    {cellError.setValue("Enter number of miles"); return false;}

    if(blnVehicleUsed)
    {cellError.setValue("Select which vehicle was used"); return false;}

  }
  if(lngEventId === CONSTANTS.EventDataTypeId.lngAmount)
  {
    if(blnAmount)
    {cellError.setValue("Enter Amount"); return false;}
    
    if(blnPaymentType)
    {cellError.setValue("Select mode of payment"); return false;}

  }
  if(lngEventId === CONSTANTS.EventDataTypeId.lngTimeAmount)
  {
    
    if(blnTimeStart)
    {cellError.setValue("Enter Time Start!"); return false;}

    if(blnTimeStop)
    {cellError.setValue("Enter Time Stop! "); return false;}   
    
    if(blnAmount)
    {cellError.setValue("Enter Amount"); return false;}
    
    if(blnPaymentType)
    {cellError.setValue("Select mode of payment"); return false;} 
    
  }
  
  if(blnDate && blnEvent)
  {
   if(!blnTimeStart || !blnTimeStop || !blnMiles || !blnVehicleUsed || !blnAmount || !blnPaymentType)
     cellError.setValue("Select Event Type First!"); return false;
  }
  return true;
}

/* 
  validate miles
*/

function validateMiles(cellMiles,cellError)
{
  if(isNaN(cellMiles.getValue()))
  { cellError.setValue("Enter a number!"); return false;}
  
  return true;
}

/*
  validate amount
*/

function validateAmount(cellAmount,cellError)
{
 if(isNaN(cellAmount.getValue()))
 { cellError.setValue("Enter a valid amount!");return false;}

  return true;
}


/*
  validate date
*/

function validateDate(cellDate,cellError)
{
  if(!cellDate.isBlank())
  {
    
    var objDate = Date.parse(cellDate.getValue());
    if(isNaN(objDate)) // isNaN a default js function checks if given input is not a number
    {cellError.setValue("Invalid date");return false;}
  }  
  return true;
}


/*
  validate time
*/

function validateTime(cellTimeStart,cellTimeStop,blnIsTravel,cellError)
{
  var milliSecondsIn1Day = 24*60*60*1000;
  var milliSecondsIn1Hour = 1000*60*60;
  
  var blnTimeStart = cellTimeStart.isBlank();
  var blnTimeStop  = cellTimeStop.isBlank();
   
  var objTimeStart = Date.parse(cellTimeStart.getValue());
  var objTimeStop = Date.parse(cellTimeStop.getValue());
  var lngDirectDifference = objTimeStop - objTimeStart;
  var lngDirectDifferenceHours  =(lngDirectDifference/milliSecondsIn1Hour);
  
  var blnFlip = false;
  if(!blnIsTravel)
  {
    if(lngDirectDifference >0)
      blnFlip = true;
    else
      blnFlip = false;
  }
  var objTmp = Date.parse(cellTimeStop.getValue());

  objTmp += milliSecondsIn1Day;
  var objTimeStopNextDay = new Date(objTmp);
  var lngDifference = (objTimeStopNextDay - objTimeStart)/(milliSecondsIn1Hour);
  
  if(!blnTimeStart){
    
    if(isNaN(objTimeStart))
    { cellError.setValue("Invalid Time Start!");return false;}
    
  }
  if(!blnTimeStop){
    if(isNaN(objTimeStop))
    { cellError.setValue("Invalid Time Stop!");return false;}
    
    if(!blnIsTravel)
    {
      if(!blnFlip){
        if(lngDifference > CONSTANTS.intMaximumShiftHours)
        {cellError.setValue("Maximum shift of 8 hours allowed!");return false;}
      }else{
        if(lngDirectDifferenceHours > CONSTANTS.intMaximumShiftHours)
        {cellError.setValue("Too long a time for an event");return false;}
      
        if(objTimeStart > objTimeStop)
        {cellError.setValue("Time Start can not be after Time Stop!");return false;}
      }
    }
    
  }
  return true;
}
/*
function validateTime(cellTimeStart,cellTimeStop,cellError)
{
  var milliSecondsIn1Day = 24*60*60*1000;
  var milliSecondsIn1Hour = 1000*60*60;
  
  var blnTimeStart = cellTimeStart.isBlank();
  var blnTimeStop  = cellTimeStop.isBlank();
   
  var objTimeStart = Date.parse(cellTimeStart.getValue());
  var objTimeStop = Date.parse(cellTimeStop.getValue());
  var lngDirectDifference = objTimeStop - objTimeStart;
  var lngDirectDifferenceHours  =(lngDirectDifference/milliSecondsIn1Hour);
  
  var blnFlip = false;
  if(lngDirectDifference >0)
    blnFlip = true;
  else
    blnFlip = false;
  
  var objTmp = Date.parse(cellTimeStop.getValue());

  objTmp += milliSecondsIn1Day;
  var objTimeStopNextDay = new Date(objTmp);
  var lngDifference = (objTimeStopNextDay - objTimeStart)/(milliSecondsIn1Hour);
  
  if(!blnTimeStart){
    
    if(isNaN(objTimeStart))
    { cellError.setValue("Invalid Time Start!");return false;}
    
  }
  if(!blnTimeStop){
    if(isNaN(objTimeStop))
    { cellError.setValue("Invalid Time Stop!");return false;}
    
    if(!blnFlip){
      if(lngDifference > CONSTANTS.intMaximumShiftHours)
       {cellError.setValue("Maximum shift of 8 hours allowed!");return false;}
    }else{
      if(lngDirectDifferenceHours > CONSTANTS.intMaximumShiftHours)
      {cellError.setValue("Too long a time for an event");return false;}
      
      if(objTimeStart > objTimeStop)
      {cellError.setValue("Time Start can not be after Time Stop!");return false;}
      
    }
  }
  return true;
}
*/