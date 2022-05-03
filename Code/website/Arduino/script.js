let firstRenderDone = false;
let dataSetups = [];
let chart;
let rows = [];
var massimo = 10;

function updateMassimo(nuovoMax){
	massimo = nuovoMax;
	document.getElementById("lblMassimo").innerHTML = nuovoMax;
}

function getData(xhrResponse) { //draws the plots
    if (!firstRenderDone) { //check if the plot has already been rendered, if not draws the first set of data

		chart = new Chart(document.getElementById("chartCanvas"), {
					type: "line",
					data: {
					labels: [xhrResponse.Head.Timestamp],
						datasets: [{
							label: "Temperatura",
							data: [xhrResponse.Body.Data.TEMP.Value],
							fill: false,
							tension: 0.1,
							borderColor: "#e44"
						}]
					},
					options: {
						responsive: true,
						maintainAspectRatio: false,
						scales: {
							yAxes: [{
								ticks: {
									beginAtZero:true
								}
							}]
						}
					},
				});
        
        firstRenderDone = true;
    } else { //if already rendered adds another set of data
        let property = "TEMP";
		
		chart.data.labels.push(xhrResponse.Head.Timestamp);		
		while(chart.data.labels.length > massimo) chart.data.labels.shift();
		chart.data.datasets[0].data.push(xhrResponse.Body.Data.TEMP.Value);
		while(chart.data.datasets[0].data.length > massimo) chart.data.datasets[0].data.shift();
		
		chart.update();
    }
}

function updatePage() { //gets the Json and draws the table
    const table = document.getElementById("table");
    const timestampOut = document.getElementById("timestamp");
    const xhr = new XMLHttpRequest();
    xhr.open('GET', "http://rigatti.altervista.org/index.php");
    
    xhr.responseType = 'json';

    xhr.onload = function (e) {
        table.innerHTML = "";

        if (this.status == 200) {
            //stamp of the update date and time
            console.log(this.response.Head.Timestamp);
            var date = new Date(this.response.Head.Timestamp);
			console.log(date.getMonth());
            var dayOfMonth = date.getDate() > 9 ? (date.getDate()) : ("0" + date.getDate());
            var month = date.getMonth() + 1 > 9 ? (date.getMonth() + 1) : ("0" + (date.getMonth() + 1));
            var year = date.getFullYear();
            var hours = date.getHours() > 9 ? date.getHours() : "0" + date.getHours();
            var minutes = date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes();
            var seconds = date.getSeconds() > 9 ? date.getSeconds() : "0" + date.getSeconds();
            document.getElementById("time_refresh").innerHTML = "Date : " + dayOfMonth + " / " + month + " / " + year + "<br>Time : " +
                hours + " : " + minutes + " : " + seconds;

            console.log(this.response.Body.Data); // Json response  
            const firstRow = table.insertRow(0);

            firstRow.innerHTML += "<th>Data</th>";            
			firstRow.innerHTML += "<th>" + "Temp." + " [" + this.response.Body.Data.TEMP.Unit + "]" + "</th>";

			rows.push({
				temp: this.response.Body.Data.TEMP.Value,
				ora: this.response.Head.Timestamp
			});         

			while(rows.length > massimo) rows.shift();

            let rigaCorrente;
            let HTMLdaAggiungere = "";

            for (row of rows) {
                rigaCorrente = table.insertRow(-1); // adds a row to the bottom of the table
                HTMLdaAggiungere = "<td>" + row.ora + "</td>";

                HTMLdaAggiungere += "<td>" + row.temp + "</td>"

                rigaCorrente.innerHTML += HTMLdaAggiungere;
            }
            getData(this.response);
        }
    };
    xhr.send();
}

updatePage(); //calls the updatePage() function as soon as we open the link

setInterval(function () { //calls the updatePage() function every 5 seconds
    updatePage()
}, 5000);