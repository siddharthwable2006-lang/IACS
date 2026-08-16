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
/* =====================================================
   IACS DASHBOARD JAVASCRIPT
===================================================== */


/* =====================================================
   INITIALIZE ICONS
===================================================== */

lucide.createIcons();



/* =====================================================
   SYSTEM VARIABLES
===================================================== */

let charging = true;

let soc = 78;

let voltage = 48.6;

let current = 6.42;

let temperature = 31.8;

let vset = 54.2;



/* =====================================================
   CLOCK
===================================================== */

function updateClock() {

    const now = new Date();

    const time = now.toLocaleTimeString(
        "en-IN",
        {
            hour12: false
        }
    );

    document.getElementById("clock")
        .textContent = time;

}

setInterval(updateClock, 1000);

updateClock();



/* =====================================================
   CHARGING BUTTON
===================================================== */

function toggleCharging() {

    charging = !charging;

    const button =
        document.getElementById("chargingButton");

    if (charging) {

        button.innerHTML = `

            <i data-lucide="square"></i>

            <span>
                Stop Charging
            </span>

        `;

        showNotification(
            "Charging started"
        );

    } else {

        button.innerHTML = `

            <i data-lucide="play"></i>

            <span>
                Start Charging
            </span>

        `;

        showNotification(
            "Charging stopped"
        );

    }

    lucide.createIcons();

}



/* =====================================================
   VOLTAGE SLIDER
===================================================== */

const slider =
    document.getElementById(
        "voltageSlider"
    );


slider.addEventListener(
    "input",
    function () {

        vset =
            parseFloat(this.value);

        document.getElementById(
            "vset"
        ).textContent =
            vset.toFixed(1);


        document.getElementById(
            "sliderValue"
        ).textContent =
            vset.toFixed(1) + " V";

    }
);



/* =====================================================
   BATTERY GRAPH DATA
===================================================== */

const labels = [];

const voltageData = [];

const currentData = [];

const socData = [];


for (
    let i = 0;
    i < 30;
    i++
) {

    labels.push(
        "-" + (30 - i) + " min"
    );

    voltageData.push(
        45 +
        (i * 0.12) +
        Math.random()
    );

    currentData.push(
        5 +
        Math.random() * 2
    );

    socData.push(
        70 +
        i * 0.27
    );

}



/* =====================================================
   BATTERY CHART
===================================================== */

const batteryCanvas =
    document.getElementById(
        "batteryChart"
    );


const batteryChart =
    new Chart(
        batteryCanvas,
        {

            type: "line",

            data: {

                labels: labels,

                datasets: [

                    {

                        label: "Voltage",

                        data: voltageData,

                        borderColor:
                            "#22d3ee",

                        backgroundColor:
                            "rgba(34,211,238,0.08)",

                        borderWidth: 2,

                        pointRadius: 0,

                        tension: 0.4,

                        fill: true

                    },

                    {

                        label: "Current",

                        data: currentData,

                        borderColor:
                            "#a78bfa",

                        borderWidth: 2,

                        pointRadius: 0,

                        tension: 0.4

                    },

                    {

                        label: "SOC",

                        data: socData,

                        borderColor:
                            "#38a9ff",

                        borderWidth: 2,

                        pointRadius: 0,

                        tension: 0.4

                    }

                ]

            },


            options: {

                responsive: true,

                maintainAspectRatio: false,

                interaction: {

                    intersect: false,

                    mode: "index"

                },


                plugins: {

                    legend: {

                        position: "top",

                        align: "start",

                        labels: {

                            color:
                                "#8190a5",

                            boxWidth: 8,

                            boxHeight: 8,

                            usePointStyle: true,

                            pointStyle:
                                "circle",

                            font: {

                                size: 9,

                                family:
                                    "Inter"

                            }

                        }

                    },


                    tooltip: {

                        backgroundColor:
                            "#101a29",

                        borderColor:
                            "rgba(255,255,255,0.1)",

                        borderWidth: 1,

                        titleColor:
                            "#ffffff",

                        bodyColor:
                            "#9aa8ba",

                        padding: 10

                    }

                },


                scales: {

                    x: {

                        grid: {

                            color:
                                "rgba(255,255,255,0.035)"

                        },

                        ticks: {

                            color:
                                "#4f5d70",

                            font: {

                                size: 8

                            },

                            maxTicksLimit: 7

                        }

                    },


                    y: {

                        grid: {

                            color:
                                "rgba(255,255,255,0.035)"

                        },

                        ticks: {

                            color:
                                "#4f5d70",

                            font: {

                                size: 8

                            }

                        }

                    }

                }

            }

        }
    );



/* =====================================================
   ENERGY CHART
===================================================== */

const energyCanvas =
    document.getElementById(
        "energyChart"
    );


new Chart(
    energyCanvas,
    {

        type: "bar",

        data: {

            labels: [

                "00",
                "02",
                "04",
                "06",
                "08",
                "10",
                "12",
                "14",
                "16",
                "18",
                "20",
                "22"

            ],

            datasets: [

                {

                    label:
                        "Energy (kWh)",

                    data: [

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

                    ],

                    backgroundColor:
                        "rgba(56,169,255,0.55)",

                    borderRadius: 5,

                    borderSkipped: false

                }

            ]

        },


        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {

                    labels: {

                        color:
                            "#8190a5",

                        font: {

                            size: 9

                        }

                    }

                }

            },


            scales: {

                x: {

                    grid: {

                        display: false

                    },

                    ticks: {

                        color:
                            "#4f5d70",

                        font: {

                            size: 8

                        }

                    }

                },


                y: {

                    grid: {

                        color:
                            "rgba(255,255,255,0.035)"

                    },

                    ticks: {

                        color:
                            "#4f5d70",

                        font: {

                            size: 8

                        }

                    }

                }

            }

        }

    }
);



/* =====================================================
   UPDATE SOC GAUGE
===================================================== */

function updateSOCGauge() {

    const circumference =
        2 * Math.PI * 48;

    const offset =
        circumference -
        (soc / 100) *
        circumference;


    const ring =
        document.getElementById(
            "socRing"
        );


    ring.style.strokeDasharray =
        circumference;


    ring.style.strokeDashoffset =
        offset;


    document.getElementById(
        "socValue"
    ).textContent =
        Math.round(soc);

}


updateSOCGauge();



/* =====================================================
   REAL-TIME SIMULATION
===================================================== */

function updateBattery() {

    if (!charging) {

        return;

    }


    /* SOC */

    if (soc < 90) {

        soc += 0.02;

    }


    /* Voltage */

    voltage +=
        (Math.random() - 0.45)
        * 0.08;


    voltage =
        Math.max(
            44,
            Math.min(
                58,
                voltage
            )
        );


    /* Current */

    current +=
        (Math.random() - 0.5)
        * 0.12;


    current =
        Math.max(
            2,
            Math.min(
                10,
                current
            )
        );


    /* Temperature */

    temperature +=
        (Math.random() - 0.5)
        * 0.08;


    temperature =
        Math.max(
            25,
            Math.min(
                45,
                temperature
            )
        );


    /* UPDATE TEXT */

    document.getElementById(
        "socValue"
    ).textContent =
        Math.round(soc);


    document.getElementById(
        "voltage"
    ).textContent =
        voltage.toFixed(1);


    document.getElementById(
        "current"
    ).textContent =
        current.toFixed(2);


    document.getElementById(
        "temperature"
    ).textContent =
        temperature.toFixed(1);


    /* PROGRESS */

    document.getElementById(
        "voltageBar"
    ).style.width =
        (voltage / 60 * 100)
        + "%";


    document.getElementById(
        "currentBar"
    ).style.width =
        (current / 10 * 100)
        + "%";


    /* GAUGE */

    updateSOCGauge();


    /* GRAPH */

    const now =
        new Date()
        .toLocaleTimeString(
            "en-IN",
            {
                hour12: false
            }
        );


    batteryChart.data.labels.push(
        now
    );


    batteryChart.data.datasets[0]
        .data.push(
            voltage
        );


    batteryChart.data.datasets[1]
        .data.push(
            current
        );


    batteryChart.data.datasets[2]
        .data.push(
            soc
        );


    /* KEEP LAST 30 */

    if (
        batteryChart.data.labels.length
        > 30
    ) {

        batteryChart.data.labels.shift();

        batteryChart.data.datasets
            .forEach(
                dataset => {

                    dataset.data.shift();

                }
            );

    }


    batteryChart.update(
        "none"
    );


    /* ADAPTIVE LOGIC */

    adaptiveDecision();

}



/* =====================================================
   ADAPTIVE DECISION
===================================================== */

function adaptiveDecision() {

    const decision =
        document.getElementById(
            "decision"
        );


    const decisionText =
        document.getElementById(
            "decisionText"
        );


    if (
        temperature >= 42
    ) {

        decision.textContent =
            "Reduce Charging Voltage";

        decisionText.textContent =
            "Battery temperature is approaching the safety threshold.";

        return;

    }


    if (
        current >= 9
    ) {

        decision.textContent =
            "Reduce Charging Current";

        decisionText.textContent =
            "Charging current is approaching the configured maximum.";

        return;

    }


    if (
        voltage >= 57
    ) {

        decision.textContent =
            "Reduce Voltage Setpoint";

        decisionText.textContent =
            "Battery voltage is approaching the upper operating region.";

        return;

    }


    if (
        soc >= 90
    ) {

        decision.textContent =
            "Target SOC Reached";

        decisionText.textContent =
            "Battery has reached the configured target SOC.";

        return;

    }


    decision.textContent =
        "Maintain Charging";


    decisionText.textContent =
        "Battery conditions are within safe operating limits.";

}



/* =====================================================
   EXPORT CSV
===================================================== */

function exportData() {

    let csv =
        "Time,Voltage,Current,SOC,Temperature\n";


    for (
        let i = 0;
        i < batteryChart.data.labels.length;
        i++
    ) {

        csv +=

            batteryChart.data.labels[i]
            + "," +

            batteryChart.data.datasets[0]
                .data[i]
            + "," +

            batteryChart.data.datasets[1]
                .data[i]
            + "," +

            batteryChart.data.datasets[2]
                .data[i]
            + "," +

            temperature.toFixed(1)
            + "\n";

    }


    const blob =
        new Blob(
            [csv],
            {
                type: "text/csv"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;

    link.download =
        "IACS_Battery_Data.csv";


    link.click();


    URL.revokeObjectURL(
        url
    );


    showNotification(
        "CSV exported successfully"
    );

}



/* =====================================================
   NOTIFICATION
===================================================== */

function showNotification(message) {

    const old =
        document.querySelector(
            ".toast"
        );


    if (old) {

        old.remove();

    }


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        "toast";


    toast.innerHTML = `

        <div class="toast-icon">
            ✓
        </div>

        <span>
            ${message}
        </span>

    `;


    document.body.appendChild(
        toast
    );


    setTimeout(
        () => {

            toast.classList.add(
                "hide"
            );

            setTimeout(
                () => toast.remove(),
                300
            );

        },
        2500
    );

}



/* =====================================================
   TOAST CSS FROM JS
===================================================== */

const toastStyle =
document.createElement("style");


toastStyle.textContent = `

.toast {

    position: fixed;

    right: 25px;

    bottom: 25px;

    z-index: 9999;

    display: flex;

    align-items: center;

    gap: 10px;

    padding: 12px 16px;

    border-radius: 11px;

    background: #101b2b;

    border: 1px solid rgba(255,255,255,0.1);

    box-shadow: 0 15px 40px rgba(0,0,0,0.4);

    color: #f4f7fb;

    font-size: 10px;

    animation: toastIn 0.3s ease;

}


.toast-icon {

    width: 22px;

    height: 22px;

    display: flex;

    align-items: center;

    justify-content: center;

    border-radius: 7px;

    color: #35d58b;

    background: rgba(53,213,139,0.1);

}


.toast.hide {

    opacity: 0;

    transform: translateY(10px);

    transition: 0.3s;

}


@keyframes toastIn {

    from {

        opacity: 0;

        transform: translateY(10px);

    }

    to {

        opacity: 1;

        transform: translateY(0);

    }

}

`;


document.head.appendChild(
    toastStyle
);



/* =====================================================
   UPDATE EVERY 3 SECONDS
===================================================== */

setInterval(
    updateBattery,
    3000
);
document.getElementById("loginBtn").addEventListener("click", function () {
    window.location.href = "login.html";
});

document.getElementById("contactForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
        alert("Please fill in all fields.");
        return;
    }

    alert("Your message has been submitted successfully!");
});

const menuBtn = document.querySelector(".menu-btn");
const nav = document.querySelector(".nav-links");

menuBtn.addEventListener("click", () => {
    nav.classList.toggle("active");
});
