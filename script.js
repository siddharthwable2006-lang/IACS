/* =========================================================
   IACS V2
   Intelligent EV Charging System
========================================================= */


/* ================= STATE ================= */

const state = {

    voltage: 48.0,

    current: 6.4,

    soc: 78,

    charging: false,

    mode: "G2V",

    power: 0

};


/* ================= ELEMENTS ================= */

const voltageSlider =
    document.getElementById("voltageSlider");

const currentSlider =
    document.getElementById("currentSlider");


/* ================= CLOCK ================= */

function updateClock() {

    const now = new Date();

    const time =
        now.toLocaleTimeString([], {
            hour12: false
        });

    document.getElementById("clock")
        .textContent = time;
}


setInterval(updateClock, 1000);

updateClock();


/* =========================================================
   UPDATE UI
========================================================= */

function updateUI() {

    /* POWER */

    state.power =
        state.charging
            ? state.voltage * state.current
            : 0;


    /* MAIN METRICS */

    document.getElementById("socValue")
        .textContent = Math.round(state.soc);

    document.getElementById("bigSoc")
        .textContent =
        Math.round(state.soc) + "%";

    document.getElementById("socBar")
        .style.width =
        state.soc + "%";


    document.getElementById("voltageValue")
        .textContent =
        state.voltage.toFixed(1);


    document.getElementById("currentValue")
        .textContent =
        state.current.toFixed(1);


    document.getElementById("powerValue")
        .textContent =
        Math.round(state.power);


    /* CONTROL VALUES */

    document.getElementById("targetVoltage")
        .textContent =
        state.voltage.toFixed(1);


    document.getElementById("targetCurrent")
        .textContent =
        state.current.toFixed(1);


    /* BATTERY */

    document.getElementById("batteryVoltage")
        .textContent =
        state.voltage.toFixed(1) + " V";


    document.getElementById("batteryCurrent")
        .textContent =
        state.charging
            ? state.current.toFixed(1) + " A"
            : "0.0 A";


    /* RING */

    const degree =
        state.soc * 3.6;


    document.querySelectorAll(".battery-ring")
        .forEach(ring => {

            ring.style.background =
                `conic-gradient(
                    var(--green) 0deg ${degree}deg,
                    #e6eeeb ${degree}deg 360deg
                )`;

        });


    /* POWER FLOW */

    document.getElementById("flowPower")
        .textContent =
        Math.round(state.power) + " W";


    document.getElementById("gridPower")
        .textContent =
        Math.round(state.power);


    document.getElementById("gridCurrent")
        .textContent =
        state.charging
            ? (state.power / 230).toFixed(2)
            : "0.00";


    /* PAGE BATTERY */

    document.getElementById("batteryPageSoc")
        .textContent =
        Math.round(state.soc) + "%";


    document.getElementById("batteryPageVoltage")
        .textContent =
        state.voltage.toFixed(1) + " V";


    document.getElementById("batteryPageCurrent")
        .textContent =
        state.charging
            ? state.current.toFixed(1) + " A"
            : "0.0 A";


    /* PAGE CHARGING */

    document.getElementById("pageVoltage")
        .textContent =
        state.voltage.toFixed(1) + " V";


    document.getElementById("pageCurrent")
        .textContent =
        state.current.toFixed(1) + " A";


    /* STATUS */

    const statuses =
        document.querySelectorAll(
            "#chargingStatus, #chargingStatusPage"
        );


    statuses.forEach(status => {

        if (state.charging) {

            status.classList.remove("stopped");

            status.classList.add("running");

            status.textContent =
                "● CHARGING ACTIVE";

        } else {

            status.classList.remove("running");

            status.classList.add("stopped");

            status.textContent =
                "● CHARGING STOPPED";

        }

    });


    /* FLOW */

    const flowStatus =
        document.getElementById("flowStatus");

    if (state.charging) {

        flowStatus.textContent =
            state.mode;

        document
            .querySelector(".power-flow")
            .classList.add("charging-active");

        document
            .getElementById("powerStatus")
            .textContent =
            "Charging active";

    } else {

        flowStatus.textContent =
            "IDLE";

        document
            .querySelector(".power-flow")
            .classList.remove("charging-active");

        document
            .getElementById("powerStatus")
            .textContent =
            "System idle";

    }


    /* SLIDERS */

    voltageSlider.value =
        state.voltage;

    currentSlider.value =
        state.current;


    /* CHART */

    addChartPoint();

}


/* =========================================================
   VOLTAGE CONTROL
========================================================= */

voltageSlider.addEventListener(
    "input",
    function () {

        state.voltage =
            parseFloat(this.value);

        updateUI();

    }
);


/* PLUS */

document
    .getElementById("voltagePlus")
    .addEventListener("click", () => {

        state.voltage =
            Math.min(
                60,
                state.voltage + 0.5
            );

        updateUI();

        showToast(
            "Voltage Updated",
            `Target voltage: ${state.voltage.toFixed(1)} V`
        );

    });


/* MINUS */

document
    .getElementById("voltageMinus")
    .addEventListener("click", () => {

        state.voltage =
            Math.max(
                0,
                state.voltage - 0.5
            );

        updateUI();

        showToast(
            "Voltage Updated",
            `Target voltage: ${state.voltage.toFixed(1)} V`
        );

    });


/* =========================================================
   CURRENT CONTROL
========================================================= */

currentSlider.addEventListener(
    "input",
    function () {

        state.current =
            parseFloat(this.value);

        updateUI();

    }
);


/* PLUS */

document
    .getElementById("currentPlus")
    .addEventListener("click", () => {

        state.current =
            Math.min(
                10,
                state.current + 0.1
            );

        updateUI();

        showToast(
            "Current Updated",
            `Target current: ${state.current.toFixed(1)} A`
        );

    });


/* MINUS */

document
    .getElementById("currentMinus")
    .addEventListener("click", () => {

        state.current =
            Math.max(
                0,
                state.current - 0.1
            );

        updateUI();

        showToast(
            "Current Updated",
            `Target current: ${state.current.toFixed(1)} A`
        );

    });


/* =========================================================
   START CHARGING
========================================================= */

function startCharging() {

    if (state.current <= 0) {

        showToast(
            "Cannot Start",
            "Set a current greater than 0 A."
        );

        return;
    }


    if (state.voltage <= 0) {

        showToast(
            "Cannot Start",
            "Set a voltage greater than 0 V."
        );

        return;
    }


    state.charging = true;


    updateUI();


    showToast(
        "Charging Started",
        `${state.mode}: ${state.voltage.toFixed(1)} V / ${state.current.toFixed(1)} A`
    );

}


document
    .getElementById("startCharging")
    .addEventListener(
        "click",
        startCharging
    );


/* =========================================================
   STOP CHARGING
========================================================= */

function stopCharging() {

    state.charging = false;


    updateUI();


    showToast(
        "Charging Stopped",
        "The charging system is now idle."
    );

}


document
    .getElementById("stopCharging")
    .addEventListener(
        "click",
        stopCharging
    );


/* =========================================================
   G2V / V2G
========================================================= */

document
    .querySelectorAll(".mode-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".mode-btn")
                    .forEach(btn =>
                        btn.classList.remove("active")
                    );


                button.classList.add("active");


                state.mode =
                    button.dataset.mode;


                updateUI();


                showToast(
                    "Energy Mode Changed",
                    state.mode === "G2V"
                        ? "Grid → EV"
                        : "EV → Grid"
                );

            }
        );

    });


/* =========================================================
   NAVIGATION
========================================================= */

document
    .querySelectorAll(".nav-item")
    .forEach(item => {

        item.addEventListener(
            "click",
            event => {

                event.preventDefault();


                const page =
                    item.dataset.page;


                /* NAV */

                document
                    .querySelectorAll(".nav-item")
                    .forEach(nav =>
                        nav.classList.remove("active")
                    );


                item.classList.add("active");


                /* PAGE */

                document
                    .querySelectorAll(".page")
                    .forEach(section =>
                        section.classList.remove(
                            "active-page"
                        )
                    );


                document
                    .getElementById(page)
                    .classList.add(
                        "active-page"
                    );


                /* TITLE */

                const title =
                    item.textContent.trim();


                document
                    .getElementById("pageTitle")
                    .textContent =
                    title;


                /* MOBILE */

                document
                    .querySelector(".sidebar")
                    .classList.remove("open");

            }
        );

    });


/* =========================================================
   MOBILE SIDEBAR
========================================================= */

document
    .getElementById("mobileMenu")
    .addEventListener(
        "click",
        () => {

            document
                .querySelector(".sidebar")
                .classList.toggle("open");

        }
    );


/* =========================================================
   TOAST
========================================================= */

let toastTimer;


function showToast(title, message) {

    const toast =
        document.getElementById("toast");


    document
        .getElementById("toastTitle")
        .textContent =
        title;


    document
        .getElementById("toastMessage")
        .textContent =
        message;


    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            3000
        );

}


/* =========================================================
   POWER CHART
========================================================= */

const chartLabels = [];

const chartData = [];


for (let i = 0; i < 20; i++) {

    chartLabels.push("");

    chartData.push(0);

}


const chartCanvas =
    document.getElementById("powerChart");


const powerChart =
    new Chart(
        chartCanvas,
        {

            type: "line",

            data: {

                labels: chartLabels,

                datasets: [

                    {

                        label: "Power",

                        data: chartData,

                        borderColor: "#12a878",

                        backgroundColor:
                            "rgba(18,168,120,.08)",

                        fill: true,

                        tension: .4,

                        borderWidth: 2,

                        pointRadius: 0

                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {

                        display: false

                    }

                },

                scales: {

                    x: {

                        display: false

                    },

                    y: {

                        beginAtZero: true,

                        grid: {

                            color: "#edf2f0"

                        }

                    }

                }

            }

        }
    );


function addChartPoint() {

    chartData.push(
        Math.round(state.power)
    );

    chartData.shift();


    powerChart.update(
        "none"
    );

}


/* =========================================================
   ANALYTICS CHART
========================================================= */

const analyticsCanvas =
    document.getElementById(
        "analyticsChart"
    );


const analyticsChart =
    new Chart(
        analyticsCanvas,
        {

            type: "line",

            data: {

                labels: Array(20).fill(""),

                datasets: [

                    {

                        label: "Power",

                        data: Array(20).fill(0),

                        borderColor: "#12a878",

                        backgroundColor:
                            "rgba(18,168,120,.08)",

                        fill: true,

                        tension: .4,

                        pointRadius: 0

                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        display: false
                    }

                },

                scales: {

                    x: {
                        display: false
                    },

                    y: {
                        beginAtZero: true
                    }

                }

            }

        }
    );


/* =========================================================
   SIMULATION
========================================================= */

setInterval(
    () => {

        if (state.charging) {

            /*
             * Simulated battery charging.
             */

            state.soc =
                Math.min(
                    100,
                    state.soc + 0.03
                );

        }


        /* Analytics */

        analyticsChart
            .data
            .datasets[0]
            .data
            .push(
                Math.round(state.power)
            );


        analyticsChart
            .data
            .datasets[0]
            .data
            .shift();


        analyticsChart.update(
            "none"
        );


        updateUI();

    },
    2000
);


/* =========================================================
   SECONDARY CHARGING PAGE CONTROLS
========================================================= */


/* Voltage + */

document
    .getElementById("pageVoltagePlus")
    .addEventListener(
        "click",
        () => {

            state.voltage =
                Math.min(
                    60,
                    state.voltage + .5
                );

            updateUI();

        }
    );


/* Voltage - */

document
    .getElementById("pageVoltageMinus")
    .addEventListener(
        "click",
        () => {

            state.voltage =
                Math.max(
                    0,
                    state.voltage - .5
                );

            updateUI();

        }
    );


/* Current + */

document
    .getElementById("pageCurrentPlus")
    .addEventListener(
        "click",
        () => {

            state.current =
                Math.min(
                    10,
                    state.current + .1
                );

            updateUI();

        }
    );


/* Current - */

document
    .getElementById("pageCurrentMinus")
    .addEventListener(
        "click",
        () => {

            state.current =
                Math.max(
                    0,
                    state.current - .1
                );

            updateUI();

        }
    );


/* Page start */

document
    .getElementById("pageStart")
    .addEventListener(
        "click",
        startCharging
    );


/* Page stop */

document
    .getElementById("pageStop")
    .addEventListener(
        "click",
        stopCharging
    );


/* =========================================================
   INITIALIZE
========================================================= */

updateUI();
