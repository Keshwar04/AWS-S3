"use client";
import React, { useEffect } from 'react'
import { S3Client, ListObjectsCommand, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import './App.css'
import axios from 'axios'

const App = () => {
  const accessKeyId = process.env.REACT_APP_AWS_ACCESS_KEY_ID
  const secretAccessKey = process.env.REACT_APP_AWS_SECRET_ACCESS_KEY

  useEffect(() => {
    listObjects()
    asyncFunc()
  }, [])

  async function handleDeleteObject() {
    const bucketName = 'windows-s3-file-upload';
    const objectKey = 'tree-736885_1280.jpg';

    // Create an S3 client
    const s3Client = new S3Client({
      region: 'eu-north-1',
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey
      }
    });

    // Prepare parameters for the DeleteObjectCommand
    const params = {
      Bucket: bucketName,
      Key: objectKey
    };

    try {
      // Delete the object from S3
      const data = await s3Client.send(new DeleteObjectCommand(params));
      console.log('Object deleted successfully:', data);
    } catch (error) {
      console.error('Error deleting object:', error);
    }
  }

  const asyncFunc = async () => {
    try {
      const res = await axios.get('https://windows-s3-file-upload.s3.eu-north-1.amazonaws.com/tree-736885_1280.jpg')
      console.log(res);
    }catch(e){
      console.log(e);
    }
  }


  async function listObjects() {
    // Create an S3 client
    const s3Client = new S3Client({
      region: 'eu-north-1',
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey
      }
    });

    // Specify parameters for the ListObjectsCommand
    const commandParams = {
      Bucket: 'windows-s3-file-upload'
    };

    try {
      // Send the ListObjectsCommand
      const data = await s3Client.send(new ListObjectsCommand(commandParams));
      console.log('Objects in bucket:', data.Contents);
    } catch (error) {
      console.error('Error listing object:', error);
    }
  }
  async function handleFileUpload(event) {
    const file = event.target.files[0];
    console.log('file===>', file);
    // Create an S3 client
    const s3Client = new S3Client({
      region: 'eu-north-1',
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey
      }
    });

    // Prepare parameters for the PutObjectCommand
    const params = {
      Bucket: 'windows-s3-file-upload',
      Key: file.name, // Use the file name as the object key
      Body: file,
      ContentType: file.type // Optional: set content type based on file type
    };

    try {
      // Upload the file to S3
      const data = await s3Client.send(new PutObjectCommand(params));
      console.log('File uploaded successfully:', data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }
  return (
    <div>
      <h1>S3 Fetch object</h1>
      <img alt='err' src='https://kswindowsbucket.s3.ap-south-1.amazonaws.com/mayil.jpg' height='200px' width='200px' />
      <h1>S3 File Upload</h1>
      <input type="file" onChange={handleFileUpload} />
      <h1>S3 Delete object</h1>
      <button onClick={handleDeleteObject}>Delete</button>
    </div>
  )
}

export default App;

