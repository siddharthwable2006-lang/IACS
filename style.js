/* =========================================================
   IACS V2
   Intelligent Adaptive Charging System
   Frontend Simulation
   ========================================================= */


/* =========================================================
   STATE
   ========================================================= */

const state = {

    charging: true,

    mode: "G2V",

    soc: 78,

    voltage: 48.6,

    current: 6.42,

    power: 312,

    temperature: 29.4,

    energy: 2.84,

    efficiency: 94.6,

    chargingSeconds: 2 * 3600 + 34 * 60

};


/* =========================================================
   DOM
   ========================================================= */

const $ = id =>
    document.getElementById(id);


/* =========================================================
   CLOCK
   ========================================================= */

function updateClock() {

    const now = new Date();

    const h =
        String(now.getHours()).padStart(2, "0");

    const m =
        String(now.getMinutes()).padStart(2, "0");

    const s =
        String(now.getSeconds()).padStart(2, "0");

    $("clock").textContent =
        `${h}:${m}:${s}`;
}


setInterval(updateClock, 1000);

updateClock();


/* =========================================================
   TOAST
   ========================================================= */

function showToast(title, message, icon = "✓") {

    const container =
        $("toastContainer");


    const toast =
        document.createElement("div");


    toast.className =
        "toast";


    toast.innerHTML = `

        <div class="toast-icon">
            ${icon}
        </div>

        <div>

            <strong>
                ${title}
            </strong>

            <span>
                ${message}
            </span>

        </div>

    `;


    container.appendChild(toast);


    setTimeout(() => {

        toast.style.opacity = "0";

        toast.style.transform =
            "translateY(10px)";

        toast.style.transition =
            ".25s ease";


        setTimeout(() => {

            toast.remove();

        }, 250);

    }, 3000);
}


/* =========================================================
   SOC GAUGE
   ========================================================= */

function updateGauge(element, percentage, circumference) {

    const offset =
        circumference -
        (percentage / 100) * circumference;


    element.style.strokeDashoffset =
        offset;
}


function updateSOC() {

    const value =
        Math.round(state.soc);


    $("socValue").textContent =
        value;


    $("largeSoc").textContent =
        `${value}%`;


    updateGauge(
        $("socGauge"),
        state.soc,
        314
    );


    updateGauge(
        $("largeSocGauge"),
        state.soc,
        471
    );


    $("decisionSoc").textContent =
        `${value}%`;
}


/* =========================================================
   DASHBOARD VALUES
   ========================================================= */

function updateValues() {

    const voltage =
        state.voltage.toFixed(1);


    const current =
        state.current.toFixed(2);


    const power =
        Math.round(state.power);


    $("voltageValue").textContent =
        voltage;


    $("currentValue").textContent =
        current;


    $("powerValue").textContent =
        power;


    $("batteryVoltage").textContent =
        voltage;


    $("batteryCurrent").textContent =
        current;


    $("batteryPower").textContent =
        power;


    $("temperature").textContent =
        state.temperature.toFixed(1);


    $("flowPower").textContent =
        `${power} W`;


    $("gridPower").textContent =
        `${power} W`;


    $("decisionCurrent").textContent =
        `${state.current.toFixed(1)} A`;


    $("decisionPower").textContent =
        `${power} W`;


    $("energyToday").textContent =
        state.energy.toFixed(2);


    $("efficiency").textContent =
        state.efficiency.toFixed(1);


    $("currentProgress").style.width =
        `${Math.min(
            state.current / 10 * 100,
            100
        )}%`;


    updateSOC();


    updateDecision();


    updateChargingTime();
}


/* =========================================================
   CHARGING TIME
   ========================================================= */

function updateChargingTime() {

    const total =
        Math.floor(state.chargingSeconds);


    const hours =
        Math.floor(total / 3600);


    const minutes =
        Math.floor(
            (total % 3600) / 60
        );


    $("chargingTime").textContent =
        `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}


/* =========================================================
   ADAPTIVE DECISION
   ========================================================= */

function updateDecision() {

    const title =
        $("decisionText");

    const subtitle =
        $("decisionSubtext");


    if (!state.charging) {

        title.textContent =
            "Charging paused";

        subtitle.textContent =
            "System is waiting for a charging command.";

        return;
    }


    if (state.soc >= 90) {

        title.textContent =
            "Reduce charging current";

        subtitle.textContent =
            "Battery SOC is approaching the upper operating range.";

    }

    else if (state.temperature >= 35) {

        title.textContent =
            "Thermal protection active";

        subtitle.textContent =
            "Charging current is being reduced to maintain safe temperature.";

    }

    else {

        title.textContent =
            "Maintain charging";

        subtitle.textContent =
            "Current demand is within the adaptive operating range.";

    }
}


/* =========================================================
   START CHARGING
   ========================================================= */

$("startButton")
    .addEventListener(
        "click",
        () => {

            state.charging = true;


            $("chargingState")
                .textContent =
                "CHARGING";


            $("chargingState").style.background =
                "var(--green-light)";


            $("chargingState").style.color =
                "var(--green-dark)";


            showToast(
                "Charging started",
                `Adaptive charging is active at ${state.current.toFixed(1)} A.`
            );


            updateValues();
        }
    );


/* =========================================================
   STOP CHARGING
   ========================================================= */

$("stopButton")
    .addEventListener(
        "click",
        () => {

            state.charging = false;

            state.current = 0;

            state.power = 0;


            $("chargingState")
                .textContent =
                "STOPPED";


            $("chargingState").style.background =
                "var(--red-light)";


            $("chargingState").style.color =
                "var(--red)";


            showToast(
                "Charging stopped",
                "The charging output has been disabled.",
                "!"
            );


            updateValues();
        }
    );


/* =========================================================
   CURRENT SLIDER
   ========================================================= */

const slider =
    $("currentSlider");


slider.addEventListener(
    "input",
    () => {

        const value =
            parseFloat(slider.value);


        $("setpointValue").textContent =
            value.toFixed(1);


        document
            .querySelectorAll(".quick-values button")
            .forEach(button => {

                button.classList.toggle(
                    "selected",
                    parseFloat(
                        button.dataset.current
                    ) === value
                );

            });

    }
);


/* =========================================================
   APPLY SETPOINT
   ========================================================= */

slider.addEventListener(
    "change",
    () => {

        const value =
            parseFloat(slider.value);


        state.current =
            value;


        if (state.charging) {

            state.power =
                state.voltage * state.current;

        }


        showToast(
            "Setpoint updated",
            `Charging current limit set to ${value.toFixed(1)} A.`
        );


        updateValues();
    }
);


/* =========================================================
   QUICK CURRENT BUTTONS
   ========================================================= */

document
    .querySelectorAll(".quick-values button")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const value =
                    parseFloat(
                        button.dataset.current
                    );


                slider.value =
                    value;


                $("setpointValue")
                    .textContent =
                    value.toFixed(1);


                document
                    .querySelectorAll(
                        ".quick-values button"
                    )
                    .forEach(btn =>
                        btn.classList.remove(
                            "selected"
                        )
                    );


                button.classList.add(
                    "selected"
                );


                state.current =
                    value;


                if (state.charging) {

                    state.power =
                        state.voltage *
                        state.current;

                }


                showToast(
                    "Current selected",
                    `Charging setpoint: ${value.toFixed(1)} A`
                );


                updateValues();

            }
        );

    });


/* =========================================================
   G2V / V2G
   ========================================================= */

document
    .querySelectorAll(".grid-mode")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const mode =
                    button.dataset.mode;


                state.mode =
                    mode;


                document
                    .querySelectorAll(".grid-mode")
                    .forEach(btn =>
                        btn.classList.remove(
                            "active"
                        )
                    );


                button.classList.add(
                    "active"
                );


                updateGridMode();


                showToast(
                    "Grid mode changed",
                    mode === "G2V"
                        ? "Grid-to-vehicle energy transfer selected."
                        : "Vehicle-to-grid energy transfer selected."
                );

            }
        );

    });


function updateGridMode() {

    const g2v =
        state.mode === "G2V";


    $("activeGridMode")
        .textContent =
        state.mode;


    $("flowMode")
        .textContent =
        state.mode;


    $("gridDirection")
        .textContent =
        g2v
            ? "Grid → EV"
            : "EV → Grid";


    $("flowDirection")
        .textContent =
        g2v
            ? "Grid → Vehicle"
            : "Vehicle → Grid";


    $("flowMode").style.background =
        g2v
            ? "var(--green-light)"
            : "var(--orange-light)";


    $("flowMode").style.color =
        g2v
            ? "var(--green-dark)"
            : "var(--orange)";

}


/* =========================================================
   CHART DATA
   ========================================================= */

const timeLabels = [];

const voltageData = [];

const currentData = [];

const powerData = [];


for (let i = 0; i < 25; i++) {

    timeLabels.push(
        `${i + 1}m`
    );


    voltageData.push(
        47.5 +
        Math.random() * 2
    );


    currentData.push(
        5 +
        Math.random() * 2
    );


    powerData.push(
        250 +
        Math.random() * 80
    );
}


/* =========================================================
   BATTERY CHART
   ========================================================= */

const batteryChart =
    new Chart(
        $("batteryChart"),
        {

            type: "line",

            data: {

                labels: timeLabels,

                datasets: [

                    {

                        label: "Voltage",

                        data: voltageData,

                        borderColor:
                            "#15966a",

                        backgroundColor:
                            "rgba(21,150,106,.07)",

                        borderWidth: 2.5,

                        pointRadius: 0,

                        tension: .4,

                        fill: true

                    },


                    {

                        label: "Current",

                        data: currentData,

                        borderColor:
                            "#e58b24",

                        backgroundColor:
                            "rgba(229,139,36,.04)",

                        borderWidth: 2.5,

                        pointRadius: 0,

                        tension: .4,

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
                        display: false
                    },

                    tooltip: {

                        backgroundColor:
                            "#17231d",

                        titleFont: {
                            size: 10
                        },

                        bodyFont: {
                            size: 9
                        },

                        padding: 10,

                        cornerRadius: 8

                    }

                },


                scales: {

                    x: {

                        grid: {
                            display: false
                        },

                        ticks: {

                            color:
                                "#9aa59f",

                            font: {
                                size: 8
                            },

                            maxTicksLimit: 7

                        }

                    },


                    y: {

                        border: {
                            display: false
                        },

                        grid: {

                            color:
                                "#edf1ee"

                        },

                        ticks: {

                            color:
                                "#9aa59f",

                            font: {
                                size: 8
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

const energyLabels = [

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

];


const energyValues = [

    110,
    145,
    190,
    225,
    250,
    280,
    295,
    315,
    328,
    312

];


const energyChart =
    new Chart(
        $("energyChart"),
        {

            type: "line",

            data: {

                labels: energyLabels,

                datasets: [

                    {

                        label: "Power",

                        data: energyValues,

                        borderColor:
                            "#3276b5",

                        backgroundColor:
                            "rgba(50,118,181,.08)",

                        borderWidth: 2.5,

                        pointRadius: 3,

                        pointBackgroundColor:
                            "#3276b5",

                        tension: .4,

                        fill: true

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

                        grid: {
                            display: false
                        },

                        ticks: {

                            color:
                                "#9aa59f",

                            font: {
                                size: 8
                            }

                        }

                    },


                    y: {

                        border: {
                            display: false
                        },

                        grid: {

                            color:
                                "#edf1ee"

                        },

                        ticks: {

                            color:
                                "#9aa59f",

                            font: {
                                size: 8
                            }

                        }

                    }

                }

            }

        }
    );


/* =========================================================
   LIVE SIMULATION
   ========================================================= */

function simulate() {

    if (state.charging) {

        /* Voltage variation */

        state.voltage +=
            (Math.random() - .5) * .12;


        state.voltage =
            Math.max(
                46,
                Math.min(
                    51,
                    state.voltage
                )
            );


        /* Current gradually approaches setpoint */

        const target =
            parseFloat(
                slider.value
            );


        state.current +=
            (target - state.current) * .18;


        /* Power */

        state.power =
            state.voltage *
            state.current;


        /* SOC */

        state.soc +=
            state.current * .001;


        state.soc =
            Math.min(
                state.soc,
                100
            );


        /* Temperature */

        state.temperature +=
            (Math.random() - .5) * .15;


        state.temperature =
            Math.max(
                27,
                Math.min(
                    38,
                    state.temperature
                )
            );


        /* Energy */

        state.energy +=
            state.power /
            3600000;


        /* Charging time */

        state.chargingSeconds += 2;

    }


    else {

        /* Slowly settle */

        state.current *= .85;

        state.power =
            state.voltage *
            state.current;

    }


    /* Chart update */

    timeLabels.push(
        new Date()
            .toLocaleTimeString(
                [],
                {
                    minute: "2-digit",
                    second: "2-digit"
                }
            )
    );


    voltageData.push(
        state.voltage
    );


    currentData.push(
        state.current
    );


    powerData.push(
        state.power
    );


    if (timeLabels.length > 25) {

        timeLabels.shift();

        voltageData.shift();

        currentData.shift();

        powerData.shift();

    }


    batteryChart.update("none");


    /* Energy chart */

    energyValues[
        energyValues.length - 1
    ] = state.power;


    energyChart.update("none");


    updateValues();

}


setInterval(
    simulate,
    2000
);


/* =========================================================
   CHART FILTER BUTTONS
   ========================================================= */

document
    .querySelectorAll(".chart-filter")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".chart-filter"
                    )
                    .forEach(btn =>
                        btn.classList.remove(
                            "active"
                        )
                    );


                button.classList.add(
                    "active"
                );


                showToast(
                    "Chart range",
                    `Viewing ${button.textContent.trim()} telemetry.`
                );

            }
        );

    });


/* =========================================================
   NAVIGATION ACTIVE STATE
   ========================================================= */

const sections =
    document.querySelectorAll(
        ".page-section"
    );


const navLinks =
    document.querySelectorAll(
        ".nav-link"
    );


const observer =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    const id =
                        entry.target.id;


                    navLinks.forEach(link => {

                        link.classList.toggle(
                            "active",
                            link.getAttribute(
                                "href"
                            ) === `#${id}`
                        );

                    });

                }

            });

        },

        {
            rootMargin:
                "-25% 0px -65% 0px"
        }
    );


sections.forEach(section =>
    observer.observe(section)
);


/* =========================================================
   MOBILE SIDEBAR
   ========================================================= */

$("mobileMenu")
    .addEventListener(
        "click",
        () => {

            $("sidebar")
                .classList.toggle(
                    "open"
                );

        }
    );


navLinks.forEach(link => {

    link.addEventListener(
        "click",
        () => {

            if (
                window.innerWidth <= 700
            ) {

                $("sidebar")
                    .classList.remove(
                        "open"
                    );

            }

        }
    );

});


/* =========================================================
   NOTIFICATION BUTTON
   ========================================================= */

$("notificationButton")
    .addEventListener(
        "click",
        () => {

            showToast(
                "System status",
                "All IACS protection checks are currently normal."
            );

        }
    );


/* =========================================================
   INITIALIZATION
   ========================================================= */

updateGridMode();

updateValues();

showToast(
    "IACS ready",
    "Intelligent charging dashboard initialized."
);
