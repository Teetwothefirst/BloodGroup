import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, doc, setDoc, collection, limit, addDoc, getDoc, onSnapshot, getDocs, query, where} from 'firebase/firestore';

import Chart from 'highcharts/es-modules/Core/Chart/Chart.js';
import ColumnSeries from 'highcharts/es-modules/Series/Column/ColumnSeries.js';

var Highcharts = require('highcharts');  
// Load module for Highcharts 
require('highcharts/modules/exporting')(Highcharts);  

//Firebase Configuration file
const firebaseConfig = {
  apiKey: "AIzaSyCWGyp8RLsL8GuCUDIFa0edgeQud8jyuPs",
  authDomain: "frontend-vuejs-assignmen-ab925.firebaseapp.com",
  projectId: "frontend-vuejs-assignmen-ab925",
  storageBucket: "frontend-vuejs-assignmen-ab925.appspot.com",
  messagingSenderId: "480810690536",
  appId: "1:480810690536:web:8c8db6b550b16241a8265d",
  measurementId: "G-0EMBL2W4GL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// const firestore = getFirestore();
const db = getFirestore(app);
//const healthData = doc(firestore, 'dataSample/patientData');
const healthData = collection(db, "dataSample");


  document.addEventListener("DOMContentLoaded", function () {
    const textElement = document.getElementById("typing-text");
    const textToType = "Hi there, Welcome to E-health";
  
    let index = 0;
  
    function type() {
      textElement.textContent = textToType.slice(0, index);
      index++;
  
      if (index <= textToType.length) {
        setTimeout(type, 100);
      }
    }
  
    type();
  });


async function writeToHealthData(){
  const bloodGroupArray = ['A','AB', 'B','O'];
  const bGArandomizer = Math.floor(Math.random() * bloodGroupArray.length);
  const ageArray = [22,29,45,67,80,12,5,6,7,10]
  const agerandomizer = Math.floor(Math.random() * ageArray.length)
  

    for (let i=0; i<20; i++){
    await setDoc(doc(healthData, `Person ${i}`), {
      name : `person ${i}`,
      bloodGroup: bloodGroupArray[bGArandomizer],
      age: ageArray[agerandomizer],
    })
    }
}

async function queryForDocument(){
  const querySnapshot = await getDocs(collection(db, "dataSample"), limit(20));
  let theDataDocArray = []
  querySnapshot.forEach((doc) =>{
    theDataDocArray.push(doc.data())
    console.log(doc.id, "=>", doc.data());
    let theDocData = JSON.stringify(doc.data());
    console.log(theDocData);
    window.localStorage.setItem("Patient", theDocData)
    
  })

  const StringAttachment = JSON.stringify(theDataDocArray);
  localStorage.setItem('OfflineData', StringAttachment)
}

function RetrieveFromStorage(){
  const storedData = localStorage.getItem('OfflineData');
  const ReturnToData = JSON.parse(storedData);
  console.log(ReturnToData)

// Process the data to match Highcharts series format
const processedData = {};
ReturnToData.forEach(item => {
  if (!processedData[item.bloodGroup]) {
    processedData[item.bloodGroup] = [];
  }
  processedData[item.bloodGroup].push(item.age);
});

// Convert the processed data into an array for Highcharts series
// const seriesData = Object.keys(processedData).map(bloodGroup => ({
//   name: bloodGroup,
//   data: processedData[bloodGroup]
// }));
const seriesData = ['O', 'A', 'B', 'AB'].map(bloodGroup => ({
  name: bloodGroup,
  data: processedData[bloodGroup] || [] // Default to an empty array if blood group not present
}));
// Create the Highcharts chart
Highcharts.chart('containerChart', {
  chart: {
    type: 'column'
  },
  title: {
    text: 'Stacked Ages by Blood Group'
  },
  xAxis: {
    //categories: Array.from(new Set(ReturnToData.map(item => item.bloodGroup)))
    categories: ['O', 'A', 'B', 'AB']
  },
  yAxis: {
    title: {
      text: 'Total Ages'
    }
  },
  series: seriesData
});


}
writeToHealthData()
queryForDocument()
RetrieveFromStorage()
 setTimeout(function() {
        location.reload();
    }, 2000);
