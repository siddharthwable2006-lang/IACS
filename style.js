/* =========================================================
   IACS - INTELLIGENT ADAPTIVE CHARGING SYSTEM
   ========================================================= */


/* =========================================================
   GLOBAL STATE
   ========================================================= */

let charging = true;

let soc = 78;

let voltage = 48.6;

let current = 6.42;

let power = 312;

let energy = 2.84;

let efficiency = 94.6;


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const socValue =
    document.getElementById("socValue");

const socLarge =
    document.getElementById("socLarge");

const socCircle =
    document.getElementById("socCircle");

const voltageValue =
    document.getElementById("voltageValue");

const voltageBar =
    document.getElementById("voltageBar");

const currentValue =
    document.getElementById("currentValue");

const currentBar =
    document.getElementById("currentBar");

const powerValue =
    document.getElementById("powerValue");

const decision =
    document.getElementById("decision");

const chargingStatus =
    document.getElementById("chargingStatus");

const currentRange =
    document.getElementById("currentRange");

const setpointValue =
    document.getElementById("setpointValue");

const setpointMessage =
    document.getElementById("setpointMessage");

const startCharging =
    document.getElementById("startCharging");

const stopCharging =
    document.getElementById("stopCharging");

const clock =
    document.getElementById("clock");


/* =========================================================
   CLOCK
   ========================================================= */

function updateClock() {

    const now = new Date();

    const hours =
        String(now.getHours()).padStart(2, "0");

    const minutes =
        String(now.getMinutes()).padStart(2, "0");

    const seconds =
        String(now.getSeconds()).padStart(2, "0");

    clock.textContent =
        `${hours}:${minutes}:${seconds}`;
}


setInterval(updateClock, 1000);

updateClock();


/* =========================================================
   UPDATE DASHBOARD
   ========================================================= */

function updateDashboard() {

    /* SOC */

    socValue.textContent =
        `${Math.round(soc)}%`;

    socLarge.innerHTML =
        `${Math.round(soc)} <span>%</span>`;

    socCircle.style.setProperty(
        "--soc",
        `${soc}%`
    );


    /* VOLTAGE */

    voltageValue.textContent =
        voltage.toFixed(1);

    const voltagePercentage =
        Math.min(
            Math.max((voltage / 60) * 100, 0),
            100
        );

    voltageBar.style.width =
        `${voltagePercentage}%`;


    /* CURRENT */

    currentValue.textContent =
        current.toFixed(2);

    currentBar.style.width =
        `${Math.min(current * 10, 100)}%`;


    /* POWER */

    powerValue.textContent =
        Math.round(power);


    /* DECISION */

    if (charging) {

        decision.textContent =
            `Maintain charging at ${current.toFixed(1)} A`;

    } else {

        decision.textContent =
            "Charging paused by system";

    }

}


/* =========================================================
   CURRENT SETPOINT
   ========================================================= */

currentRange.addEventListener(
    "input",
    function () {

        const value =
            parseFloat(this.value);

        setpointValue.textContent =
            value.toFixed(1);

    }
);


document
    .getElementById("applySetpoint")
    .addEventListener(
        "click",
        function () {

            current =
                parseFloat(currentRange.value);

            power =
                voltage * current;

            setpointMessage.textContent =
                `Setpoint applied: ${current.toFixed(1)} A`;

            updateDashboard();

        }
    );


/* =========================================================
   START CHARGING
   ========================================================= */

startCharging.addEventListener(
    "click",
    function () {

        charging = true;

        chargingStatus.textContent =
            "CHARGING";

        chargingStatus.className =
            "badge badge-green";

        setpointMessage.textContent =
            "Charging started";

        updateDashboard();

    }
);


/* =========================================================
   STOP CHARGING
   ========================================================= */

stopCharging.addEventListener(
    "click",
    function () {

        charging = false;

        current = 0;

        power = 0;

        chargingStatus.textContent =
            "STOPPED";

        chargingStatus.className =
            "badge badge-red";

        setpointMessage.textContent =
            "Charging stopped";

        updateDashboard();

    }
);


/* =========================================================
   CHART DATA
   ========================================================= */

const labels = [];

const voltageData = [];

const currentData = [];

const socData = [];

const powerData = [];


/* Create initial data */

for (let i = 0; i < 20; i++) {

    labels.push(
        `${i + 1}m`
    );

    voltageData.push(
        46 + Math.random() * 3
    );

    currentData.push(
        5 + Math.random() * 2
    );

    socData.push(
        72 + i * 0.3
    );

    powerData.push(
        260 + Math.random() * 80
    );
}


/* =========================================================
   BATTERY CHART
   ========================================================= */

const batteryCanvas =
    document.getElementById("batteryChart");


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
                            "#15966a",

                        backgroundColor:
                            "rgba(21,150,106,0.08)",

                        borderWidth: 3,

                        pointRadius: 2,

                        pointHoverRadius: 5,

                        tension: 0.35,

                        fill: true
                    },


                    {
                        label: "Current",

                        data: currentData,

                        borderColor:
                            "#e58b24",

                        backgroundColor:
                            "rgba(229,139,36,0.07)",

                        borderWidth: 3,

                        pointRadius: 2,

                        pointHoverRadius: 5,

                        tension: 0.35,

                        fill: true
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

                        display: true,

                        labels: {

                            color:
                                "#66736b",

                            font: {

                                family: "Inter",

                                size: 10

                            },

                            usePointStyle: true
                        }

                    }

                },


                scales: {

                    x: {

                        grid: {

                            color:
                                "#edf1ee"

                        },

                        ticks: {

                            color:
                                "#8b9790",

                            font: {

                                size: 9

                            }

                        }

                    },


                    y: {

                        grid: {

                            color:
                                "#edf1ee"

                        },

                        ticks: {

                            color:
                                "#8b9790",

                            font: {

                                size: 9

                            }

                        }

                    }

                }

            }

        }
    );


/* =========================================================
   ENERGY CHART
   ========================================================= */

const energyCanvas =
    document.getElementById("energyChart");


const energyChart =
    new Chart(
        energyCanvas,
        {

            type: "line",

            data: {

                labels: [
                    "08:00",
                    "09:00",
                    "10:00",
                    "11:00",
                    "12:00",
                    "13:00",
                    "14:00",
                    "15:00",
                    "16:00",
                    "17:00"
                ],


                datasets: [

                    {

                        label: "Power",

                        data: [
                            120,
                            170,
                            210,
                            250,
                            280,
                            310,
                            300,
                            325,
                            340,
                            312
                        ],

                        borderColor:
                            "#2563a8",

                        backgroundColor:
                            "rgba(37,99,168,0.08)",

                        borderWidth: 3,

                        tension: 0.35,

                        fill: true,

                        pointRadius: 3

                    }

                ]

            },


            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {

                        display: true,

                        labels: {

                            color:
                                "#66736b",

                            font: {

                                family: "Inter",

                                size: 10

                            },

                            usePointStyle: true

                        }

                    }

                },


                scales: {

                    x: {

                        grid: {

                            color:
                                "#edf1ee"

                        },

                        ticks: {

                            color:
                                "#8b9790"

                        }

                    },


                    y: {

                        grid: {

                            color:
                                "#edf1ee"

                        },

                        ticks: {

                            color:
                                "#8b9790"

                        }

                    }

                }

            }

        }
    );


/* =========================================================
   LIVE SIMULATION
   ========================================================= */

function simulateSystem() {

    if (!charging) {

        updateDashboard();

        return;
    }


    /* Slight voltage fluctuation */

    voltage +=
        (Math.random() - 0.5) * 0.15;


    voltage =
        Math.max(
            46,
            Math.min(52, voltage)
        );


    /* Current follows setpoint */

    const targetCurrent =
        parseFloat(currentRange.value);


    current +=
        (targetCurrent - current) * 0.15;


    /* Power */

    power =
        voltage * current;


    /* Battery charging */

    if (current > 0) {

        soc +=
            current * 0.002;

    }


    soc =
        Math.min(100, soc);


    /* Energy */

    energy +=
        power / 3600000;


    document.getElementById(
        "energyToday"
    ).textContent =
        energy.toFixed(2);


    /* Add chart values */

    labels.push(
        new Date()
            .toLocaleTimeString()
    );

    voltageData.push(
        voltage
    );

    currentData.push(
        current
    );


    if (labels.length > 20) {

        labels.shift();

        voltageData.shift();

        currentData.shift();

    }


    batteryChart.update(
        "none"
    );


    updateDashboard();

}


/* Run every 2 seconds */

setInterval(
    simulateSystem,
    2000
);


/* =========================================================
   NAVIGATION
   ========================================================= */

const navLinks =
    document.querySelectorAll(
        ".nav a"
    );


navLinks.forEach(
    link => {

        link.addEventListener(
            "click",
            function () {

                navLinks.forEach(
                    item =>
                        item.classList.remove(
                            "active"
                        )
                );

                this.classList.add(
                    "active"
                );

            }
        );

    }
);


/* =========================================================
   CHART RANGE
   ========================================================= */

document
    .getElementById("chartRange")
    .addEventListener(
        "change",
        function () {

            const range =
                this.value;

            if (range === "live") {

                decision.textContent =
                    `Maintain charging at ${current.toFixed(1)} A`;

            }

            else if (range === "hour") {

                decision.textContent =
                    "Charging trend analyzed over 1 hour";

            }

            else {

                decision.textContent =
                    "Daily charging performance analyzed";

            }

        }
    );


/* =========================================================
   INITIALIZE
   ========================================================= */

updateDashboard();
