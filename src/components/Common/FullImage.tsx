
import FileViewer from 'react-native-file-viewer';
import RNFetchBlob from 'rn-fetch-blob';

export const viewFullImage = async ({ fullImage }) => {
    try {
       
        const docUrl = fullImage;
        // console.log("doc url", docUrl)
        const { config, fs } = RNFetchBlob;
        const { DocumentDir } = fs.dirs;

        const downloadDir = `${DocumentDir}/Downloads`;
        const fileName = fullImage.split('/').pop();
        const filePath = `${downloadDir}/${fileName}`;

        // Download the file if it doesn't exist
        const downloadTask = await config({ fileCache: true, path: filePath }).fetch('GET', docUrl);
     
        // Open the file immediately after initiating the download
        await FileViewer.open(filePath);

        // Note: We don't need to await the completion of the download task

    } catch (error) {
        if (error && error.message === 'No app associated with this mime type') {
            console.error('No app associated with this MIME type');
            // Handle this error case gracefully, e.g., display a message to the user
        } else {
            console.error('Error opening file:', error);
        }
    }
};
