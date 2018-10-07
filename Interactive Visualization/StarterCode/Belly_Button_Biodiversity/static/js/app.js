function buildMetadata(sample) {
  var metaselector = d3.select("#sample-metadata")

  // Use `d3.json` to fetch the metadata for a sample

  d3.json("/metadata/"+sample).then((metadata) => {
    console.log(metadata)

    // Use `.html("") to clear any existing metadata
      metaselector.html("")
      Object.entries(metadata).forEach(([key, value]) => {
      console.log(`Key: ${key} and Value ${value}`);
      metaselector.append("p").text(`${key}: ${value}`)
    
    });
    buildGauge(metadata.WFREQ);
  });

}

function buildCharts(sample) {
  

//   data = {
//     "otu_ids": sample_data.otu_id.values.tolist(),
//     "sample_values": sample_data[sample].values.tolist(),
//     "otu_labels": sample_data.otu_label.tolist(),
// }

d3.json("/samples/"+sample).then((metadata) => {

var bubble_trace = {
  x:metadata.otu_ids ,
  y:metadata.sample_values ,
  mode: 'markers',
  marker: {
    color: metadata.otu_ids,
    size: metadata.sample_values
  }
};
var layout = {
  title: 'Bubble Chart',
  showlegend: false,
  height: 800,
  width: 1500
};

data = [bubble_trace]
Plotly.newPlot('bubble', data, layout);



var piechart_trace = {
  values:metadata.sample_values.slice(0,10) ,
  labels:metadata.otu_ids.slice(0,10) ,
  type: 'pie',
  hoverinfo: metadata.otu_ids.slice(0,10),
  textinfo: 'none'
};


data = [piechart_trace]
Plotly.newPlot('pie', data);
});

}


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);

    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}



function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard

init();