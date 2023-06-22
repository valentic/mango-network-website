/*************************************************************************\
 *  Download and save a file 
 *
 *  Needed to support downloading assests from cross origin sites (CORS).
 *
 *  Based on standard approach outlined in this stackoverlow post:
 *
 *  https://stackoverflow.com/questions/41938718/how-to-download-files-using-axios
 *
 *  You can supply a filename or if unset, it will use the one in the URL.
 *
 *  2023-06-22  Todd Valentic
 *              Initial implementation
 *
\*************************************************************************/

import axios from 'axios'

const savefile = (url, filename) => {
    
    filename = filename || url.split('/').pop() 
    console.log(filename)

    axios({
        url: url, 
        method: 'GET',
        responseType: 'blob', // important
    }).then((response) => {
        console.log('response received')
        // create file link in browser's memory
        const href = URL.createObjectURL(response.data);
        
        // create an "a" HTML element with href to file & click
        const link = document.createElement('a');
        link.href = href;
        link.setAttribute('download', filename); 
        document.body.appendChild(link);
        console.log('element created')
        link.click();
        console.log('element clicked')
        
        // clean up "a" element & remove ObjectURL
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
        console.log('cleanup')
    });
}

export { savefile }
