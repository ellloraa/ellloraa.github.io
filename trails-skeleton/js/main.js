// Global objects go here (outside of any functions)


/**
 * Load data from CSV file asynchronously and render charts
 */

let data, scatterplot, barchart; 
let difficultyFilter = [];
const dispatcher = d3.dispatch('filterCategories', 'selectPoints', 'reset');

d3.csv('data/vancouver_trails.csv')
   .then(_data => {
     data = _data; // for safety, so that we use a local copy of data.

     data.forEach(d => {
        d.time = +d.time;         // Convert time to a number (assumes it's numeric)
        d.distance = +d.distance;
     // ... data preprocessing etc. ... TODO: you add code here for numeric
     // Be sure to examine your data to fully understand the code
     });
     // Initialize scale
     console.log(data);

     const colorScale = d3.scaleOrdinal() // TODO: add an ordinal scale for the difficulty
     
     .domain(["easy", "intermediate", "difficult"]) // Adjust based on your actual data
     .range(["lightgreen", "green", "darkgreen"]);

     const scatterConfig = {
        parentElement: '#scatterplot',
        colorScale: colorScale
      };
      
      const barConfig = {
        parentElement: '#barchart',
        colorScale: colorScale
      };
      
     // See Lab 4 for help
     scatterplot = new Scatterplot(scatterConfig, data); //we will update config soon
     scatterplot.updateVis();
     
    
     barchart = new Barchart({
        parentElement: '#barchart',
        colorScale: colorScale
      }, dispatcher, data);
     barchart.updateVis();

   })
  .catch(error => console.error(error));

  dispatcher.on('filterCategories', function(filteredCategories) {
    if (filteredCategories.length === 0) {
      scatterplot.data = data;
    } else {
      scatterplot.data = data.filter(d =>
        filteredCategories.includes(d.difficulty)
      );
    }
    scatterplot.updateVis();
  });
  
/**
 * Use bar chart as filter and update scatter plot accordingly
 */

function filterData() {
    if (difficultyFilter.length === 0) {
      scatterplot.data = data; // Show all if no filters selected
    } else {
      scatterplot.data = data.filter(d =>
        difficultyFilter.includes(d.difficulty)
      );
    }
    scatterplot.updateVis();
  }

  