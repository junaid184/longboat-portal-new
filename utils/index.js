import moment from 'moment';


export const formatBusinessTiming = (openTime, closeTime) =>
    `${moment(openTime).format('hh:mm A')} - ${moment(closeTime).format('hh:mm A')}`;

export const formatLatLng = (lat, lng) => `${lat}, ${lng}`;

export const formatTime = (time) => moment(time).format('hh:mm A');

export const formatDateWithDay = (date) => moment(date).format('ddd, MMM DD,  YYYY');

export const formatDate = (dateString) => {
    if (!dateString) return ''; // Handle null or undefined dates
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
  };
  export const formatDateWithTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    
    // Format date as YYYY-MM-DD
    const formattedDate = date.toISOString().split('T')[0];
    
    // Format time as HH:MM AM/PM
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert to 12-hour format and handle midnight as 12
    
    const formattedTime = `${hours}:${minutes} ${ampm}`;
    
    return `${formattedDate} ${formattedTime}`;
  };
  
  export const formatDateWithTime1 = (dateString) => {
    if (!dateString) return ''; // Handle null or undefined input
  
    const date = new Date(dateString);
  
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.error(`Invalid date string: ${dateString}`);
      return ''; // Return an empty string for invalid dates
    }
  
    // Format date as YYYY-MM-DD
    const formattedDate = date.toISOString().split('T')[0];
  
    // Format time as HH:MM AM/PM
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert to 12-hour format and handle midnight as 12
  
    const formattedTime = `${hours}:${minutes} ${ampm}`;
  
    return `${formattedDate} ${formattedTime}`;
  };
  

//   export const formatDateWithTime = (dateString) => {
//     if (!dateString) return '';
//     const date = new Date(dateString);
//     return `${date.toISOString().split('T')[0]} ${date.toTimeString().split(' ')[0]}`; // Format as YYYY-MM-DD HH:MM:SS
//   };
  

// Helper function to format the time in 12-hour format
export const formatTimeString = (timeString) => {
    // Assuming timeString is in 'HH:mm' format
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);

    return date.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: 'numeric' });
};

export const transformArrayOfObject = (category, subCategories) => {
    const combinedArray = [
        { id: category?.id, title: category?.title },
        ...subCategories.map(subCat => ({
            id: subCat?._id,
            title: subCat?.title
        }))
    ];
    return combinedArray;
};