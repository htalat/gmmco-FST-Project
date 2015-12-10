function parseXML()
{
  var  strXMLData = globalJobDataSheet.getRange(CONSTANTS.xmlData[0],CONSTANTS.xmlData[1]).getValue()
  if(globalJobDataSheet.getRange(CONSTANTS.xmlData[0],CONSTANTS.xmlData[1]).isBlank())
    return
  var document = XmlService.parse(strXMLData);
  var root = document.getRootElement();
  var entries= root.getChildren()
  var title = entries[0].getText(); 
  
  var row = CONSTANTS.JobData.cellJobNumberHeader[0]
  for(var i=0;i<entries.length;i++)
  {
   globalJobDataSheet.getRange(row,2).setValue(entries[i].getText())
   row++
  }
  
}
