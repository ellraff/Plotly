function init() {

  var selector = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

init();

function optionChanged(newSample) {

  buildMetadata(newSample);
  buildCharts(newSample);
  
}

function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    console.log(data)
   
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    
    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");

    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}


function buildCharts(sample) {

  d3.json("samples.json").then((data) => {

    var samples = data.samples;

    var sampleArray = samples.filter(sampleObj => sampleObj.id == sample);  
    
    var metadata = data.metadata;
    var metaArray = metadata.filter(sampleObj => sampleObj.id == sample);

    // Bar Plot
    var result_s = sampleArray[0];
    var result_m = metaArray[0];

    var otu_ids = result_s.otu_ids
    var otu_labels = result_s.otu_labels
    var sample_values = result_s.sample_values


    var w_freq = parseFloat(result_m.wfreq);

    var yticks = otu_ids.slice(0,10).map(function(otuID) {
      return `OTU ${otuID}`;
    }).reverse();
    
    var barData = [
      {
        y:yticks,
        x:sample_values.slice(0,10).reverse(),
        text:otu_labels.slice(0,10).reverse(),
        type: "bar",
        orientation: "h"
      }
    ];
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
    };
    Plotly.newPlot("bar", barData, barLayout);

    // Bubble Data
    var bubbleData = [
      {
        x:otu_ids,
        y:sample_values,
        text:otu_labels,
        mode: 'markers',
        marker: {
          color: otu_ids,
          size: sample_values
        }
      }
    ];

    var bubbleLayout = {
      title: "Bacteria Cultures per Sample",
      xaxis: { title: "OTU_ID" }
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

    // Gauge Plot
    var gaugeData = [
      {
        value: w_freq,
        title: {text: '<b>Belly Button Washing Frequency</b><br> Scrubs per Week'},
        type: 'indicator',
        mode: "gauge+number",
        gauge: {
          axis: { range: [0, 10], tickwidth: 1, tickcolor: "black" },
          bar: { color: "black" },
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "darkorange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "limegreen" },
            { range: [8, 10], color: "blue" }
          ],
        }
      }
    ];

    var gaugeLayout = { 
      width: 500,
      height: 400,
    };

    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
