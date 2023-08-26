# ETL-Project
## Datawarehouse and Mining Project (Extract-Transform-Load) using Node JS Streams and MongoDB

This project demonstrates an ETL pipeline implemented using Node.JS Streams to ensure a memory-efficient data processing flow, particularly when dealing with large datasets. The pipeline's main goal is to gather data from diverse sources, transform it into a consistent format, and then load it into a MongoDB collection.

Step 1: Data is extracted from four distinct sources, including two APIs, a JSON file, and a CSV file. JSONStream and csv-parser libraries are employed to parse and transform JSON and CSV data.  

Step 2: The extracted data streams are then transformed using a custom transform stream. The data transformation logic is applied to each chunk of data as it flows through the stream.

Step 3: In the loading phase, the transformed data is directly loaded into a MongoDB collection using the initializeUnorderedBulkOp method.

Furthermore, to allow the visitors to view the data stored in the MongoDB database, an API endpoint streams data chunks to the frontend, enabling the browser to process and present large datasets with improved responsiveness.

https://github.com/M-Adil-AS/ETL-Project/assets/115668271/f540e4bd-6515-4d9b-acfa-7fcef0f49dc9
