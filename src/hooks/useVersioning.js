import { useEffect, useState } from "react";

const useVersioning=()=>{

    const [currentVersion, setCurrentVersion] = useState(null);
    const checkForUpdates = async () => {
    try {
      const response = await fetch('/version.json', { cache: 'no-cache' });
      const latestData = await response.json();


      if (currentVersion && latestData.version !== currentVersion) {
        if (window.confirm('New updates of the app is available. Please refresh the page.')) {
          window.location.reload(); // Reload the app to get the latest version
        }
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
    }
  };
  
  useEffect(() => {
    // Fetch the current version on mount
    const fetchInitialVersion = async () => {
      try {
          const response = await fetch('/version.json', { cache: 'no-cache' });
          const initialData = await response.json();
        setCurrentVersion(initialData.version); 
      } catch (error) {
        console.error('Error fetching initial version:', error);
      }
    };

    fetchInitialVersion(); 

    const interval = setInterval(() => {
      checkForUpdates();
    }, 60000); // 60 seconds

    return () => clearInterval(interval); 
  }, [currentVersion]); 


}


export default useVersioning;
