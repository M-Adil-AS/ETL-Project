# ETL-Project
## Datawarehouse and Mining Project (Extract-Transform-Load) using Node JS Streams and MongoDB

### Tools and Technologies
![Node JS](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) ![Mongo DB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white) <a href='https://ejs.co/' target="_blank"><img alt='' src='https://img.shields.io/badge/EJS-100000?style=for-the-badge&logo=&logoColor=6F2020&labelColor=402FDD&color=B72222'/></a> ![Express JS](https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white) ![Axios](https://img.shields.io/badge/Axios-5A29E4.svg?style=for-the-badge&logo=Axios&logoColor=white) ![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white) ![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white) ![JS](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E) <a href='https://www.npmjs.com/package/JSONStream' target="_blank"><img alt='' src='https://img.shields.io/badge/JSONStream-100000?style=for-the-badge&logo=&logoColor=white&labelColor=black&color=EA7515'/></a> <a href='https://www.npmjs.com/package/csv-parser' target="_blank"><img alt='' src='https://img.shields.io/badge/csv-parser-100000?style=for-the-badge&logo=&logoColor=white&labelColor=black&color=C70E99'/></a>

This project demonstrates an ETL pipeline implemented using Node.JS Streams to ensure a memory-efficient data processing flow, particularly when dealing with large datasets. The pipeline's main goal is to gather data from diverse sources, transform it into a consistent format, and then load it into a MongoDB collection.

Step 1: Data is extracted from four distinct sources, including two APIs, a JSON file, and a CSV file. JSONStream and csv-parser libraries are employed to parse and transform JSON and CSV data.  

Step 2: The extracted data streams are then transformed using a custom transform stream. The data transformation logic is applied to each chunk of data as it flows through the stream.

Step 3: In the loading phase, the transformed data is directly loaded into a MongoDB collection using the initializeUnorderedBulkOp method.

Furthermore, to allow the visitors to view the data stored in the MongoDB database, an API endpoint streams data chunks to the frontend, enabling the browser to process and present large datasets with improved responsiveness.

https://github.com/M-Adil-AS/ETL-Project/assets/115668271/f540e4bd-6515-4d9b-acfa-7fcef0f49dc9
