function VehicleUsed(id,val,blnIsShort)
{
  this.lngId = id;
  this.strValue = val;
  this.blnIsShort = blnIsShort;  
}

function fetchVehicleUsed()
{
  var row = CONSTANTS.cellProgramDataVehicleUsedIdHeader[0] + 1;
  
  var c1 =  CONSTANTS.cellProgramDataVehicleUsedIdHeader[1];
  var c2 =  CONSTANTS.cellProgramDataVehicleUsedValueHeader[1];
  var c3 =  CONSTANTS.cellProgramDataVehicleUsedIsShortHeader[1];
  
  var cellCondition = globalProgramDataSheet.getRange(row,c1).isBlank();
  
  while(!cellCondition)
  {
    var cell_VU_id      = globalProgramDataSheet.getRange(row, c1).getValue();
    var cell_VU_value   = globalProgramDataSheet.getRange(row, c2).getValue();
    var cell_VU_isShort = globalProgramDataSheet.getRange(row, c3).getValue();
   
    globalVehicleUsed.push(new VehicleUsed(cell_VU_id,cell_VU_value,cell_VU_isShort));
    row++;
    cellCondition = globalProgramDataSheet.getRange(row,c1).isBlank();
  } 

}


function setVehicleUsed(cellVehicleUsed)
{
  var strValue = cellVehicleUsed.getValue();
  var lngId = getVehicleUsedId(strValue.toUpperCase());
  
  if(lngId != -1)
  {
    for(var i=0;i<globalVehicleUsed.length;i++)
    {    
      if(globalVehicleUsed[i].blnIsShort === 0)
      {
        if(lngId === globalVehicleUsed[i].lngId) 
        {
          cellVehicleUsed.setValue(globalVehicleUsed[i].strValue);
        }
      }
    }
  }
}

function getVehicleUsedId(strValue)
{
  for(var i=0; i< globalVehicleUsed.length;i++)
  {
    if(globalVehicleUsed[i].strValue === strValue)
      return globalVehicleUsed[i].lngId;
  }
  return -1;
}