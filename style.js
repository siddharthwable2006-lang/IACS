/* =====================================================
   IACS - INTELLIGENT ADAPTIVE CHARGING SYSTEM
   Dashboard JavaScript
===================================================== */


/* ================= CLOCK ================= */

function updateClock() {

    const now = new Date();

    const time =
        now.toLocaleTimeString("en-IN", {
            hour12: false
        });

    document.getElementById("clock").textContent = time;
}

setInterval(updateClock, 1000);

updateClock();



/* ================= VARIABLES ================= */

let charging = true;

let soc = 78;

let voltage = 48.6;

let current = 6.42;

let temperature = 31.8;

let vset = 54.2;



/* ================= CHARGING CONTROL ================= */

function toggleCharging() {

    charging = !charging;

    const button =
        document.getElementById("chargingButton");

    const icon =
        document.getElementById("chargingIcon");

    const decision =
        document.getElementById("decision");


    if (charging) {

        button.textContent = "Stop Charging";

        icon.textContent = "⏻";

        decision.textContent =
            "Maintain Charging";

    } else {

        button.textContent = "Start Charging";

        icon.textContent = "▶";

        decision.textContent =
            "Charging Stopped";
    }
}



/* ================= VOLTAGE SLIDER ================= */

const voltageSlider =
    document.getElementById("voltageSlider");

voltageSlider.addEventListener("input", function () {

    vset = parseFloat(this.value);

    document.getElementById("vset")
        .textContent = vset.toFixed(1);

    document.getElementById("sliderValue")
        .textContent = vset.toFixed(1) + " V";

});



/* =====================================================
   BATTERY CHART
===================================================== */

const batteryLabels = [];

const voltageData = [];

const currentData = [];

const socData = [];


/* Generate initial data */

for (let i = 0; i < 30; i++) {

    batteryLabels.push(
        "-" + (30 - i) + "m"
    );

    voltageData.push(
        45 + Math.random() * 4
    );

    currentData.push(
        5 + Math.random() * 3
    );

    socData.push(
        70 + i * 0.28
    );
}


const batteryCtx =
    document.getElementById("batteryChart");


const batteryChart =
    new Chart(batteryCtx, {

        type: "line",

        data: {

            labels: batteryLabels,

            datasets: [

                {
                    label: "Voltage (V)",

                    data: voltageData,

                    borderWidth: 2,

                    tension: 0.4
                },

                {
                    label: "Current (A)",

                    data: currentData,

                    borderWidth: 2,

                    tension: 0.4
                },

                {
                    label: "SOC (%)",

                    data: socData,

                    borderWidth: 2,

                    tension: 0.4
                }

            ]
        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {

                    labels: {
                        color: "#8d9aab"
                    }
                }
            },

            scales: {

                x: {

                    ticks: {
                        color: "#687789"
                    },

                    grid: {
                        color: "rgba(255,255,255,0.04)"
                    }
                },

                y: {

                    ticks: {
                        color: "#687789"
                    },

                    grid: {
                        color: "rgba(255,255,255,0.04)"
                    }
                }

            }
        }

    });


/* Chart height */

batteryCtx.parentElement.style.height =
    "300px";



/* =====================================================
   ENERGY CHART
===================================================== */

const hours = [
    "00", "02", "04", "06",
    "08", "10", "12", "14",
    "16", "18", "20", "22"
];


const energyData = [
    1.2,
    1.8,
    2.1,
    3.2,
    4.6,
    5.8,
    7.1,
    8.5,
    10.2,
    11.4,
    12.1,
    13.5
];


const energyCtx =
    document.getElementById("energyChart");


new Chart(energyCtx, {

    type: "bar",

    data: {

        labels: hours,

        datasets: [

            {
                label: "Energy Consumed (kWh)",

                data: energyData,

                borderRadius: 5
            }

        ]
    },

    options: {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

            legend: {

                labels: {
                    color: "#8d9aab"
                }
            }

        },

        scales: {

            x: {

                ticks: {
                    color: "#687789"
                },

                grid: {
                    display: false
                }
            },

            y: {

                ticks: {
                    color: "#687789"
                },

                grid: {
                    color: "rgba(255,255,255,0.04)"
                }
            }

        }

    }

});

energyCtx.parentElement.style.height =
    "320px";



/* =====================================================
   SIMULATED REAL-TIME BATTERY DATA
===================================================== */

function updateBattery() {

    if (!charging) {
        return;
    }


    /* SOC slowly increases */

    if (soc < 90) {

        soc += 0.02;

    }


    /* Voltage increases */

    voltage +=
        (Math.random() - 0.45) * 0.08;


    /* Current variation */

    current +=
        (Math.random() - 0.5) * 0.15;


    current =
        Math.max(2, Math.min(10, current));


    /* Temperature */

    temperature +=
        (Math.random() - 0.5) * 0.1;


    temperature =
        Math.max(25, Math.min(45, temperature));


    /* Update UI */

    document.getElementById("socValue")
        .textContent = Math.round(soc);


    document.getElementById("voltage")
        .textContent = voltage.toFixed(1);


    document.getElementById("current")
        .textContent = current.toFixed(2);


    document.getElementById("temperature")
        .textContent = temperature.toFixed(1);


    /* Progress bars */

    document.getElementById("voltageBar")
        .style.width =
        ((voltage / 60) * 100) + "%";


    document.getElementById("currentBar")
        .style.width =
        ((current / 10) * 100) + "%";


    /* Add data to graph */

    batteryChart.data.labels.push(
        new Date().toLocaleTimeString(
            "en-IN",
            {
                hour12: false,
                minute: "2-digit",
                second: "2-digit"
            }
        )
    );


    batteryChart.data.datasets[0]
        .data.push(voltage);


    batteryChart.data.datasets[1]
        .data.push(current);


    batteryChart.data.datasets[2]
        .data.push(soc);


    /* Keep last 30 readings */

    if (batteryChart.data.labels.length > 30) {

        batteryChart.data.labels.shift();

        batteryChart.data.datasets
            .forEach(dataset => {
                dataset.data.shift();
            });
    }


    batteryChart.update("none");


    /* Adaptive decision */

    adaptiveDecision();
}



/* Run every 3 seconds */

setInterval(updateBattery, 3000);



/* =====================================================
   ADAPTIVE DECISION LOGIC
===================================================== */

function adaptiveDecision() {

    const decision =
        document.getElementById("decision");


    if (temperature >= 42) {

        decision.textContent =
            "Reduce Charging Voltage";

        return;
    }


    if (current >= 9) {

        decision.textContent =
            "Reduce Charging Current";

        return;
    }


    if (soc >= 90) {

        decision.textContent =
            "Target SOC Reached";

        return;
    }


    if (voltage >= 57) {

        decision.textContent =
            "Reduce Voltage Setpoint";

        return;
    }


    decision.textContent =
        "Maintain Charging";
}



/* =====================================================
   SOC GAUGE
===================================================== */

function updateGauge() {

    const gauge =
        document.querySelector(".gauge-circle");


    gauge.style.background = `
        radial-gradient(
            circle,
            var(--card) 57%,
            transparent 58%
        ),
        conic-gradient(
            var(--blue) ${soc}%,
            #18283d 0
        )
    `;
}


setInterval(updateGauge, 1000);



/* =====================================================
   TARGET SOC
===================================================== */

document.getElementById("targetSOC")
    .textContent = "90%";



/* =====================================================
   EXPORT DATA
===================================================== */

document.querySelector(".download-btn")
    .addEventListener("click", function () {

        let csv =
            "Time,Voltage,Current,SOC,Temperature\n";

        for (let i = 0;
            i < batteryChart.data.labels.length;
            i++) {

            csv +=
                batteryChart.data.labels[i] + "," +
                batteryChart.data.datasets[0].data[i] + "," +
                batteryChart.data.datasets[1].data[i] + "," +
                batteryChart.data.datasets[2].data[i] + "," +
                temperature + "\n";
        }


        const blob =
            new Blob([csv], {
                type: "text/csv"
            });


        const url =
            URL.createObjectURL(blob);


        const a =
            document.createElement("a");


        a.href = url;

        a.download =
            "IACS_Battery_Data.csv";


        a.click();


        URL.revokeObjectURL(url);

    });
