import { format, parse } from "date-fns";

export function convertISOToCustomFormat(dateString) {
  const parts = dateString.split("-");
  const partDay = parts[2].split('T')[0]
     return `${parts[1]}/${partDay}/${parts[0]}`;
   }

   export function stringDateRangeFormate(dateString) {
    const [startDateString, endDateString] = dateString.split(" - ");

    const startDate = parse(startDateString, "MM/dd/yyyy", new Date());
    const endDate = parse(endDateString, "MM/dd/yyyy", new Date());
    
    const formattedStartDate = format(startDate, "dd MMMM yyyy");
    const formattedEndDate = format(endDate, "dd MMMM yyyy");
    
    const formattedRange = `${formattedStartDate} - ${formattedEndDate}`;
    return formattedRange
    
     } 
   