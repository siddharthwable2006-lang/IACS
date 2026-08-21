/* =========================================================
   IACS - INTELLIGENT ENERGY CONTROL SYSTEM
   Main JavaScript
   ========================================================= */


/* =========================================================
   DEFAULT SYSTEM STATE
   ========================================================= */

const defaultState = {

    powerOn: true,

    charging: true,

    voltage: 48.6,

    current: 6.4,

    soc: 78,

    mode: "G2V"

};


/* =========================================================
   LOAD SAVED STATE
   ========================================================= */

let systemState = loadState();


function loadState() {

    try {

        const saved =
            localStorage.getItem("iacsState");

        if (saved) {

            return {
                ...defaultState,
                ...JSON.parse(saved)
            };

        }

    } catch (error) {

        console.log(
            "Could not load saved state."
        );

    }

    return {
        ...defaultState
    };

}


/* =========================================================
   SAVE STATE
   ========================================================= */

function saveState() {

    try {

        localStorage.setItem(
            "iacsState",
            JSON.stringify(systemState)
        );

    } catch (error) {

        console.log(
            "Could not save state."
        );

    }

}


/* =========================================================
   DOM HELPER
   ========================================================= */

function get(id) {

    return document.getElementById(id);

}


/* =========================================================
   TOAST
   ========================================================= */

function showToast(message) {

    const toast = get("toast");

    if (!toast) return;

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(
        window.iacsToastTimer
    );

    window.iacsToastTimer =
        setTimeout(function () {

            toast.classList.remove("show");

        }, 2500);

}


/* =========================================================
   CLOCK
   ========================================================= */

function updateClock() {

    const clock = get("clock");

    if (!clock) return;

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
   VOLTAGE CONTROL
   ========================================================= */

function updateVoltageDisplay() {

    const slider =
        get("voltageSlider");

    const display =
        get("voltageSetpoint");

    if (!slider || !display) return;

    const value =
        Number(slider.value);

    display.textContent =
        value.toFixed(1);

}


/* ---------------------------------------------------------
   VOLTAGE SLIDER
   --------------------------------------------------------- */

const voltageSlider =
    get("voltageSlider");


if (voltageSlider) {

    voltageSlider.addEventListener(
        "input",
        function () {

            updateVoltageDisplay();

        }
    );

}


/* ---------------------------------------------------------
   VOLTAGE MINUS
   --------------------------------------------------------- */

const voltageMinus =
    get("voltageMinus");


if (voltageMinus) {

    voltageMinus.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            if (!voltageSlider) return;

            let value =
                Number(voltageSlider.value);

            value -= 0.1;

            value =
                Math.max(40, value);

            value =
                Math.round(value * 10) / 10;

            voltageSlider.value =
                value.toFixed(1);

            updateVoltageDisplay();

        }
    );

}


/* ---------------------------------------------------------
   VOLTAGE PLUS
   --------------------------------------------------------- */

const voltagePlus =
    get("voltagePlus");


if (voltagePlus) {

    voltagePlus.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            if (!voltageSlider) return;

            let value =
                Number(voltageSlider.value);

            value += 0.1;

            value =
                Math.min(60, value);

            value =
                Math.round(value * 10) / 10;

            voltageSlider.value =
                value.toFixed(1);

            updateVoltageDisplay();

        }
    );

}


/* ---------------------------------------------------------
   APPLY VOLTAGE
   --------------------------------------------------------- */

const applyVoltageButton =
    get("applyVoltage");


if (applyVoltageButton) {

    applyVoltageButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            if (!voltageSlider) return;

            const value =
                Number(voltageSlider.value);

            systemState.voltage =
                value;

            saveState();

            updateAllDisplays();

            showToast(
                "✓ Voltage setpoint updated to " +
                value.toFixed(1) +
                " V"
            );

        }
    );

}


/* =========================================================
   CURRENT CONTROL
   ========================================================= */

function updateCurrentDisplay() {

    const slider =
        get("currentSlider");

    const display =
        get("chargingCurrent");

    if (!slider || !display) return;

    display.textContent =
        Number(slider.value).toFixed(1);

}


const currentSlider =
    get("currentSlider");


if (currentSlider) {

    currentSlider.addEventListener(
        "input",
        function () {

            updateCurrentDisplay();

        }
    );

}


/* ---------------------------------------------------------
   CURRENT MINUS
   --------------------------------------------------------- */

const currentMinus =
    get("currentMinus");


if (currentMinus) {

    currentMinus.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            if (!currentSlider) return;

            let value =
                Number(currentSlider.value);

            value -= 0.5;

            value =
                Math.max(0, value);

            value =
                Math.round(value * 10) / 10;

            currentSlider.value =
                value.toFixed(1);

            updateCurrentDisplay();

        }
    );

}


/* ---------------------------------------------------------
   CURRENT PLUS
   --------------------------------------------------------- */

const currentPlus =
    get("currentPlus");


if (currentPlus) {

    currentPlus.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            if (!currentSlider) return;

            let value =
                Number(currentSlider.value);

            value += 0.5;

            value =
                Math.min(10, value);

            value =
                Math.round(value * 10) / 10;

            currentSlider.value =
                value.toFixed(1);

            updateCurrentDisplay();

        }
    );

}


/* ---------------------------------------------------------
   APPLY CURRENT
   --------------------------------------------------------- */

const applyCurrent =
    get("applyCurrent");


if (applyCurrent) {

    applyCurrent.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            if (!currentSlider) return;

            const value =
                Number(currentSlider.value);

            systemState.current =
                value;

            saveState();

            updateAllDisplays();

            showToast(
                "✓ Current setpoint updated to " +
                value.toFixed(1) +
                " A"
            );

        }
    );

}


/* =========================================================
   POWER ON / OFF
   ========================================================= */

function updatePowerUI() {

    const badge =
        get("powerStateBadge");

    const indicator =
        get("powerIndicator");

    const text =
        get("powerText");

    const subtext =
        get("powerSubtext");

    const button =
        get("powerButton");

    const buttonText =
        get("powerButtonText");

    if (!badge) return;


    if (systemState.powerOn) {

        badge.textContent =
            "ON";

        badge.classList.remove("off");
        badge.classList.add("on");


        if (indicator) {

            indicator.classList.add("on");
            indicator.classList.remove("off");

        }


        if (text) {

            text.textContent =
                "POWER ON";

        }


        if (subtext) {

            subtext.textContent =
                "Charging system is enabled";

        }


        if (button) {

            button.classList.add("on");
            button.classList.remove("off");

        }


        if (buttonText) {

            buttonText.textContent =
                "POWER OFF";

        }

    } else {

        badge.textContent =
            "OFF";

        badge.classList.remove("on");
        badge.classList.add("off");


        if (indicator) {

            indicator.classList.remove("on");
            indicator.classList.add("off");

        }


        if (text) {

            text.textContent =
                "POWER OFF";

        }


        if (subtext) {

            subtext.textContent =
                "Charging system is disabled";

        }


        if (button) {

            button.classList.remove("on");
            button.classList.add("off");

        }


        if (buttonText) {

            buttonText.textContent =
                "POWER ON";

        }

    }

}


/* ---------------------------------------------------------
   POWER BUTTON
   --------------------------------------------------------- */

const powerButton =
    get("powerButton");


if (powerButton) {

    powerButton.addEventListener(
        "click",
        function () {

            systemState.powerOn =
                !systemState.powerOn;


            if (!systemState.powerOn) {

                systemState.charging =
                    false;

                showToast(
                    "⏻ Charging power turned OFF"
                );

            } else {

                showToast(
                    "✓ Charging power turned ON"
                );

            }


            saveState();

            updateAllDisplays();

        }
    );

}


/* =========================================================
   START CHARGING
   ========================================================= */

const startButton =
    get("startButton");


if (startButton) {

    startButton.addEventListener(
        "click",
        function () {

            if (!systemState.powerOn) {

                showToast(
                    "⚠ Turn ON charging power first"
                );

                return;

            }


            systemState.charging =
                true;

            saveState();

            updateAllDisplays();

            showToast(
                "▶ Charging started"
            );

        }
    );

}


/* =========================================================
   STOP CHARGING
   ========================================================= */

const stopButton =
    get("stopButton");


if (stopButton) {

    stopButton.addEventListener(
        "click",
        function () {

            systemState.charging =
                false;

            saveState();

            updateAllDisplays();

            showToast(
                "■ Charging stopped"
            );

        }
    );

}


/* =========================================================
   CHARGING STATUS UI
   ========================================================= */

function updateChargingUI() {

    const badge =
        get("chargingStateBadge");

    const statusText =
        get("statusText");

    const statusSubtext =
        get("statusSubtext");

    const startButton =
        get("startButton");

    const stopButton =
        get("stopButton");

    const sequenceStart =
        get("sequenceStart");


    if (!badge) return;


    if (systemState.charging &&
        systemState.powerOn) {

        badge.textContent =
            "CHARGING";

        badge.classList.add("active");
        badge.classList.remove("idle");


        if (statusText) {

            statusText.textContent =
                "Charging Active";

        }


        if (statusSubtext) {

            statusSubtext.textContent =
                "Energy is being delivered to the vehicle";

        }


        if (startButton) {

            startButton.classList.add("active");

        }


        if (stopButton) {

            stopButton.classList.remove("active");

        }


        if (sequenceStart) {

            sequenceStart.classList.add("completed");

        }

    } else {

        badge.textContent =
            "IDLE";

        badge.classList.remove("active");
        badge.classList.add("idle");


        if (statusText) {

            statusText.textContent =
                "Charging Idle";

        }


        if (statusSubtext) {

            statusSubtext.textContent =
                "No energy is currently being delivered";

        }


        if (startButton) {

            startButton.classList.remove("active");

        }


        if (stopButton) {

            stopButton.classList.add("active");

        }


        if (sequenceStart) {

            sequenceStart.classList.remove("completed");

        }

    }

}


/* =========================================================
   ALL LIVE DISPLAY VALUES
   ========================================================= */

function updateAllDisplays() {


    /* ---------------- VOLTAGE ---------------- */

    const voltage =
        get("voltage");

    const chargingVoltage =
        get("chargingVoltage");

    const voltageSetpoint =
        get("voltageSetpoint");


    if (voltage) {

        voltage.textContent =
            systemState.voltage.toFixed(1);

    }


    if (chargingVoltage) {

        chargingVoltage.textContent =
            systemState.voltage.toFixed(1);

    }


    if (voltageSetpoint &&
        voltageSlider) {

        voltageSlider.value =
            systemState.voltage.toFixed(1);

        voltageSetpoint.textContent =
            systemState.voltage.toFixed(1);

    }


    /* ---------------- CURRENT ---------------- */

    const current =
        get("current");

    const liveCurrent =
        get("liveCurrent");

    const chargingCurrent =
        get("chargingCurrent");


    if (current) {

        current.textContent =
            systemState.current.toFixed(1);

    }


    if (liveCurrent) {

        liveCurrent.textContent =
            systemState.current.toFixed(1);

    }


    if (chargingCurrent &&
        currentSlider) {

        currentSlider.value =
            systemState.current.toFixed(1);

        chargingCurrent.textContent =
            systemState.current.toFixed(1);

    }


    /* ---------------- POWER ---------------- */

    const calculatedPower =
        systemState.charging &&
        systemState.powerOn

            ? Math.round(
                systemState.voltage *
                systemState.current
              )

            : 0;


    const power =
        get("power");

    const chargingPower =
        get("chargingPower");

    const gridPower =
        get("gridPower");


    if (power) {

        power.textContent =
            calculatedPower;

    }


    if (chargingPower) {

        chargingPower.textContent =
            calculatedPower;

    }


    if (gridPower) {

        gridPower.textContent =
            calculatedPower;

    }


    /* ---------------- SOC ---------------- */

    const soc =
        get("soc");

    const chargingSOC =
        get("chargingSOC");

    const socBar =
        get("socBar");


    if (soc) {

        soc.textContent =
            systemState.soc;

    }


    if (chargingSOC) {

        chargingSOC.textContent =
            systemState.soc;

    }


    if (socBar) {

        socBar.style.width =
            systemState.soc + "%";

    }


    /* ---------------- STATUS ---------------- */

    const dashboardStatus =
        get("dashboardChargingStatus");


    if (dashboardStatus) {

        if (
            systemState.charging &&
            systemState.powerOn
        ) {

            dashboardStatus.textContent =
                "● Charging";

            dashboardStatus.className =
                "positive";

        } else {

            dashboardStatus.textContent =
                "● Idle";

            dashboardStatus.className =
                "warning";

        }

    }


    updatePowerUI();

    updateChargingUI();

}


/* =========================================================
   SIMULATED LIVE DATA
   ========================================================= */

function simulateLiveData() {

    if (
        systemState.charging &&
        systemState.powerOn
    ) {

        let newSoc =
            systemState.soc +
            (Math.random() * 0.04);

        systemState.soc =
            Math.min(
                100,
                Number(newSoc.toFixed(1))
            );

    }


    updateAllDisplays();

    updateChart();

}


setInterval(
    simulateLiveData,
    3000
);


/* =========================================================
   CHART
   ========================================================= */

let powerChart = null;

let chartLabels = [];

let chartValues = [];


function createChart() {

    const canvas =
        get("powerChart");

    if (!canvas) return;


    if (typeof Chart === "undefined") {

        return;

    }


    const ctx =
        canvas.getContext("2d");


    const initialPower =
        Math.round(
            systemState.voltage *
            systemState.current
        );


    chartLabels = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8"
    ];


    chartValues = [
        initialPower,
        initialPower - 15,
        initialPower + 10,
        initialPower - 8,
        initialPower + 18,
        initialPower - 5,
        initialPower + 12,
        initialPower
    ];


    powerChart =
        new Chart(ctx, {

            type: "line",

            data: {

                labels: chartLabels,

                datasets: [{

                    label: "Power",

                    data: chartValues,

                    borderWidth: 3,

                    tension: 0.4,

                    fill: true

                }]

            },


            options: {

                responsive: true,

                maintainAspectRatio: false,

                animation: false,

                plugins: {

                    legend: {

                        display: false

                    }

                },


                scales: {

                    x: {

                        grid: {

                            display: false

                        }

                    },


                    y: {

                        beginAtZero: false

                    }

                }

            }

        });

}


function updateChart() {

    if (!powerChart) return;


    const power =
        systemState.charging &&
        systemState.powerOn

            ? Math.round(
                systemState.voltage *
                systemState.current
              )

            : 0;


    chartLabels.push(
        new Date().toLocaleTimeString()
    );


    chartValues.push(
        power
    );


    if (chartLabels.length > 12) {

        chartLabels.shift();
        chartValues.shift();

    }


    powerChart.update();

}


/* =========================================================
   INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateAllDisplays();

        updateVoltageDisplay();

        updateCurrentDisplay();

        createChart();

    }
);
