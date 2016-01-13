/*
Event Object:
  ID
  Value
  Type
  Default
  TypeId
  Is Short
  Charge Customer
*/
function Event(id,val,type,def,dataTypeId, blnIsShort,blnChargeCustomer)
{
  this.id          = id;
  this.value       = val;   
  this.type        = type;
  this.def         = def;
  this.dataTypeId  = dataTypeId;
  this.isShort   =   blnIsShort;
  this.chargeCustomer = blnChargeCustomer
}

function getEventType(cellVal)
{
  for(var i=0;i<globalEventTypes.length;i++)
  {
     if(globalEventTypes[i].value === cellVal)
     {
       return globalEventTypes[i].type; 
     }
  }
  return " ";
}
function getEventId(strVal)
{
  for(var i=0;i<globalEventTypes.length;i++)
  {
    if(globalEventTypes[i].value == strVal)
    {
      return globalEvenTypes[i].id;
    }
  }
}
function getEventDataTypeId(cellVal)
{
  for(var i=0;i<globalEventTypes.length;i++)
  {
     if(globalEventTypes[i].value === cellVal)
     {
       return globalEventTypes[i].dataTypeId; 
     }
  }
  return -1;
}

function getEventDefault(lngId)
{

  for(var i=0;i<globalEventTypes.length;i++)
  {
     if(globalEventTypes[i].id === lngId)
     {
       return globalEventTypes[i].def; 
     }
  }
  return -1;
}

function setEventName(cellEvent)
{
  var strValue = cellEvent.getValue();
  var lngId  = getEventId(strValue.toUpperCase());
  if(lngId != -1)
  {
    for(var i=0;i<globalEventTypes.length;i++)
    {
      if(!globalEventTypes[i].isShort)
      {
        if(lngId === globalEventTypes[i].id) 
        {
          cellEvent.setValue(globalEventTypes[i].value);
        }
      }
    }
  }
    
  

}

function getEventId(strValue)
{
  for(var i=0;i<globalEventTypes.length;i++)
  {
     if(globalEventTypes[i].value === strValue)
     {
       return globalEventTypes[i].id; 
     }
  }
  return -1; 
}

function getEventChargeCustomer(strValue)
{
  for(var i=0;i<globalEventTypes.length;i++)
  {
     if(globalEventTypes[i].value === strValue)
     {
       return globalEventTypes[i].chargeCustomer; 
     }
  }
  return -1; 
   
  
}
function fetchEventTypes()
{
   var row = CONSTANTS.cellProgramDataEventTypeIdHeader[0] + 1;
   var c1 = CONSTANTS.cellProgramDataEventTypeIdHeader[1];
   var c2 = CONSTANTS.cellProgramDataEventValueHeader[1];  
   var c3 = CONSTANTS.cellProgramDataTypeHeader[1];   
   var c4 = CONSTANTS.cellProgramDataDefaultHeader[1];
   var c5 = CONSTANTS.cellProgramDataTypeIdHeader[1];
   var c6 = CONSTANTS.cellProgramDataIsShortHeader[1];
   var c7 = CONSTANTS.cellProgramDataChargeCustomerHeader[1];
  
   var cellCondition = globalProgramDataSheet.getRange(row,c1).isBlank();
  
   while(!cellCondition)
   {
     var cell_E_Id            = globalProgramDataSheet.getRange(row, c1).getValue();
     var cell_E_value         = globalProgramDataSheet.getRange(row, c2).getValue();
     var cell_E_type          = globalProgramDataSheet.getRange(row, c3).getValue();
     var cell_E_default       = globalProgramDataSheet.getRange(row, c4).getValue();
     var cell_E_typeId        = globalProgramDataSheet.getRange(row, c5).getValue();
     var cell_E_isShort       = globalProgramDataSheet.getRange(row, c6).getValue();
     var cellE_chargeCustomer = globalProgramDataSheet.getRange(row, c7).getValue(); 
     
     globalEventTypes.push(new Event(cell_E_Id,cell_E_value,cell_E_type,cell_E_default,cell_E_typeId,cell_E_isShort,cellE_chargeCustomer));
     row++;
     cellCondition = globalProgramDataSheet.getRange(row,c1).isBlank();
   }
}
