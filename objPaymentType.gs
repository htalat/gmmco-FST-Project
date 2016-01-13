function PaymentType(id,val,blnIsShort)
{
  this.lngId = id;
  this.strValue = val;
  this.blnIsShort = blnIsShort;  
}

function fetchPaymentTypes()
{
  var row = CONSTANTS.cellProgramDataPaymentTypeIdHeader[0] + 1;
  
  var c1 =  CONSTANTS.cellProgramDataPaymentTypeIdHeader[1];
  var c2 =  CONSTANTS.cellProgramDataPaymentTypeValueHeader[1];
  var c3 =  CONSTANTS.cellProgramDataPaymentTypeIsShortHeader[1];
  
  var cellCondition = globalProgramDataSheet.getRange(row,c1).isBlank();
  
  while(!cellCondition)
  {
    var cell_PT_id      = globalProgramDataSheet.getRange(row, c1).getValue();
    var cell_PT_value   = globalProgramDataSheet.getRange(row, c2).getValue();
    var cell_PT_isShort = globalProgramDataSheet.getRange(row, c3).getValue();
       
    globalPaymentTypes.push(new PaymentType(cell_PT_id,cell_PT_value,cell_PT_isShort));
    row++;
    cellCondition = globalProgramDataSheet.getRange(row,c1).isBlank();
  }

}


function setPaymentType(cellPaymentType)
{
  var strValue = cellPaymentType.getValue();
  var lngId = getPaymentTypeId(strValue.toUpperCase()); 
  
  if(lngId != -1)
  {
    for(var i=0;i<globalPaymentTypes.length;i++)
    {
      if(globalPaymentTypes[i].blnIsShort === 0)
      {
        if(lngId === globalPaymentTypes[i].lngId) 
        {
          cellPaymentType.setValue(globalPaymentTypes[i].strValue);
        }
      }
    }
  }
}

function getPaymentTypeId(strValue)
{
  for(var i=0; i<globalPaymentTypes.length;i++)
  {
    if(globalPaymentTypes[i].strValue === strValue)
      return globalPaymentTypes[i].lngId;
  }
  return -1;
}