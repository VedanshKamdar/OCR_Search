const {
  BlobServiceClient,
  generateBlobSASQueryParameters,
} = require('@azure/storage-blob');
require('dotenv').config();

const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);

const uploadFile = async (containerName, blobName, stream) => {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.uploadData(stream, {
    blobHTTPHeaders: { blobContentType: 'application/pdf' },
  });
};

const deleteFile = async (containerName, blobName) => {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  await containerClient.deleteBlob(blobName);
};

const generateSASUrl = async (containerName, blobName, expiryMinutes = 100) => {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobClient = containerClient.getBlobClient(blobName);

  const startDate = new Date();
  const expiryDate = new Date(startDate);
  expiryDate.setMinutes(startDate.getMinutes() + expiryMinutes);
  startDate.setMinutes(startDate.getMinutes() - 100);

  const sasToken = generateBlobSASQueryParameters(
    {
      containerName,
      blobName,
      permissions: 'r',
      startsOn: startDate,
      expiresOn: expiryDate,
    },
    blobServiceClient.credential
  ).toString();

  return `${blobClient.url}?${sasToken}`;
};

module.exports = {
  uploadFile,
  deleteFile,
  generateSASUrl,
};
