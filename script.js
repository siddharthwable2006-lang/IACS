/* =========================================================
   IACS - GLOBAL STATE
========================================================= */


/*
    Master power:
    true  = power supply enabled
    false = power supply disabled
*/

let chargingPowerOn = true;


/*
    Charging operation:
    true  = charging is actively running
    false = charging stopped
*/

let chargingActive = true;


/*
    Energy mode
*/

let energyMode = "G2V";


/*
    Simulated sensor values
*/

let soc = 78;

let voltage = 48.6;

let current = 6.4;

let temperature = 31.4;

let power = voltage * current;



/* =========================================================
   CLOCK
========================================================= */

function updateClock() {

    const clock =
        document.getElementById("clock");

    if (!clock) return;


    const now = new Date();


    clock.textContent =
        now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });

}


setInterval(updateClock, 1000);

updateClock();



/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

    let toast =
        document.getElementById("toast");


    if (!toast) return;


    toast.textContent =
        message;


    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}



/* =========================================================
   ELEMENT UPDATE HELPER
========================================================= */

function setText(id, value) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value;

    }

}



/* =========================================================
   CHARGING POWER ON / OFF
========================================================= */

function toggleChargingPower() {

    chargingPowerOn =
        !chargingPowerOn;


    const button =
        document.getElementById(
            "powerButton"
        );


    const buttonText =
        document.getElementById(
            "powerButtonText"
        );


    const powerText =
        document.getElementById(
            "powerText"
        );


    const powerSubtext =
        document.getElementById(
            "powerSubtext"
        );


    const indicator =
        document.getElementById(
            "powerIndicator"
        );


    const badge =
        document.getElementById(
            "powerStateBadge"
        );


    if (!button) return;



    if (chargingPowerOn) {

        /*
            POWER ON
        */

        button.classList.remove("off");

        button.classList.add("on");


        buttonText.textContent =
            "POWER OFF";


        powerText.textContent =
            "POWER ON";


        powerSubtext.textContent =
            "Charging system is enabled";


        indicator.classList.remove("off");


        if (badge) {

            badge.textContent =
                "ON";

            badge.classList.add("on");

        }


        showToast(
            "Charging power turned ON"
        );

    }


    else {

        /*
            POWER OFF
        */

        button.classList.remove("on");

        button.classList.add("off");


        buttonText.textContent =
            "POWER ON";


        powerText.textContent =
            "POWER OFF";


        powerSubtext.textContent =
            "Charging system is disabled";


        indicator.classList.add("off");


        if (badge) {

            badge.textContent =
                "OFF";

            badge.classList.remove("on");

        }


        /*
            Turning master power OFF
            also stops charging.
        */

        chargingActive = false;


        updateChargingStatus();


        showToast(
            "Charging power turned OFF"
        );

    }

}



/* =========================================================
   START CHARGING
========================================================= */

function startCharging() {


    /*
        Cannot start if master power
        is OFF.
    */

    if (!chargingPowerOn) {

        showToast(
            "Turn POWER ON first"
        );

        return;

    }


    chargingActive = true;


    updateChargingStatus();


    showToast(
        "Charging started"
    );

}



/* =========================================================
   STOP CHARGING
========================================================= */

function stopCharging() {


    chargingActive = false;


    updateChargingStatus();


    showToast(
        "Charging stopped"
    );

}



/* =========================================================
   UPDATE CHARGING UI
========================================================= */

function updateChargingStatus() {


    const badge =
        document.getElementById(
            "chargingStateBadge"
        );


    const status =
        document.getElementById(
            "statusText"
        );


    const subtext =
        document.getElementById(
            "statusSubtext"
        );


    const startButton =
        document.getElementById(
            "startButton"
        );


    const stopButton =
        document.getElementById(
            "stopButton"
        );


    const sequence =
        document.getElementById(
            "sequenceStart"
        );


    /*
        CHARGING ACTIVE
    */

    if (
        chargingPowerOn &&
        chargingActive
    ) {


        if (badge) {

            badge.textContent =
                "CHARGING";

            badge.classList.add(
                "active"
            );

        }


        if (status) {

            status.textContent =
                "Charging Active";

        }


        if (subtext) {

            subtext.textContent =
                "Energy is being delivered to the vehicle";

        }


        if (startButton) {

            startButton.classList.add(
                "active"
            );

        }


        if (stopButton) {

            stopButton.classList.remove(
                "active"
            );

        }


        if (sequence) {

            sequence.classList.add(
                "completed"
            );

        }

        return;

    }


    /*
        STOPPED / OFF
    */

    if (badge) {

        badge.textContent =
            chargingPowerOn
                ? "STOPPED"
                : "POWER OFF";

        badge.classList.remove(
            "active"
        );

    }


    if (status) {

        status.textContent =
            chargingPowerOn
                ? "Charging Stopped"
                : "Power Disabled";

    }


    if (subtext) {

        subtext.textContent =
            chargingPowerOn
                ? "Press START CHARGING to begin"
                : "Turn master power ON first";

    }


    if (startButton) {

        startButton.classList.remove(
            "active"
        );

    }


    if (stopButton) {

        stopButton.classList.add(
            "active"
        );

    }


    if (sequence) {

        sequence.classList.remove(
            "completed"
        );

    }

}



/* =========================================================
   CURRENT SLIDER
========================================================= */

const slider =
    document.getElementById(
        "currentSlider"
    );


if (slider) {


    slider.addEventListener(
        "input",
        function () {


            const value =
                Number(this.value);


            setText(
                "chargingCurrent",
                value.toFixed(1)
            );


        }
    );

}



/* =========================================================
   ADJUST CURRENT
========================================================= */

function adjustCurrent(amount) {


    if (!slider) return;


    let value =
        Number(slider.value);


    value += amount;


    value =
        Math.max(
            0,
            Math.min(
                10,
                value
            )
        );


    slider.value =
        value.toFixed(1);


    setText(
        "chargingCurrent",
        value.toFixed(1)
    );

}



/* =========================================================
   APPLY CURRENT SETPOINT
========================================================= */

function applyCharging() {


    if (!chargingPowerOn) {

        showToast(
            "Power is OFF. Turn it ON first."
        );

        return;

    }


    current =
        Number(slider.value);


    setText(
        "liveCurrent",
        current.toFixed(1)
    );


    showToast(
        "Current setpoint applied: " +
        current.toFixed(1) +
        " A"
    );

}



/* =========================================================
   SIMULATED SENSOR DATA
========================================================= */

function simulateData() {


    /*
        If charging is active,
        simulate charging.
    */

    if (
        chargingPowerOn &&
        chargingActive
    ) {

        current +=
            (Math.random() - .5) *
            .08;


        /*
            Slowly increase SOC
        */

        soc += 0.01;

    }


    else {

        /*
            No charging
        */

        current = 0;

    }


    /*
        Voltage fluctuation
    */

    voltage +=
        (Math.random() - .5) *
        .08;


    /*
        Temperature fluctuation
    */

    temperature +=
        (Math.random() - .5) *
        .12;


    /*
        Limits
    */

    soc =
        Math.max(
            0,
            Math.min(
                100,
                soc
            )
        );


    voltage =
        Math.max(
            44,
            Math.min(
                54,
                voltage
            )
        );


    current =
        Math.max(
            0,
            Math.min(
                10,
                current
            )
        );


    /*
        Power
    */

    power =
        voltage *
        current;


    /*
        Update dashboard
    */

    setText(
        "soc",
        Math.round(soc)
    );


    setText(
        "batterySOC",
        Math.round(soc) + "%"
    );


    setText(
        "voltage",
        voltage.toFixed(1)
    );


    setText(
        "batteryVoltage",
        voltage.toFixed(1)
    );


    setText(
        "current",
        current.toFixed(1)
    );


    setText(
        "batteryCurrent",
        current.toFixed(1)
    );


    setText(
        "liveCurrent",
        current.toFixed(1)
    );


    setText(
        "temperature",
        temperature.toFixed(1)
    );


    setText(
        "power",
        Math.round(power)
    );


    setText(
        "chargingPower",
        Math.round(power)
    );


    setText(
        "gridPower",
        Math.round(power)
    );


    setText(
        "chargingVoltage",
        voltage.toFixed(1)
    );


    setText(
        "chargingSOC",
        Math.round(soc)
    );


    setText(
        "energyPower",
        Math.round(power) + " W"
    );


    /*
        Battery progress
    */

    const socBar =
        document.getElementById(
            "socBar"
        );


    if (socBar) {

        socBar.style.width =
            soc + "%";

    }

}


setInterval(
    simulateData,
    2500
);



/* =========================================================
   G2V / V2G
========================================================= */

function setEnergyMode(mode) {


    energyMode =
        mode;


    const g2v =
        document.getElementById(
            "g2vButton"
        );


    const v2g =
        document.getElementById(
            "v2gButton"
        );


    const title =
        document.getElementById(
            "energyModeTitle"
        );


    const description =
        document.getElementById(
            "modeDescription"
        );


    const arrow =
        document.getElementById(
            "energyArrow"
        );


    if (!g2v || !v2g) return;


    g2v.classList.remove(
        "selected"
    );


    v2g.classList.remove(
        "selected"
    );



    if (mode === "G2V") {


        g2v.classList.add(
            "selected"
        );


        if (title) {

            title.textContent =
                "Grid → Vehicle";

        }


        if (description) {

            description.textContent =
                "Energy is flowing from the grid into the vehicle battery.";

        }


        if (arrow) {

            arrow.textContent =
                "→";

        }


        showToast(
            "G2V mode activated"
        );

    }



    else {


        v2g.classList.add(
            "selected"
        );


        if (title) {

            title.textContent =
                "Vehicle → Grid";

        }


        if (description) {

            description.textContent =
                "Energy is flowing from the vehicle battery back to the grid.";

        }


        if (arrow) {

            arrow.textContent =
                "←";

        }


        showToast(
            "V2G mode activated"
        );

    }

}



/* =========================================================
   DASHBOARD CHART
========================================================= */

const powerCanvas =
    document.getElementById(
        "powerChart"
    );


if (powerCanvas) {


    const values = [];


    for (
        let i = 0;
        i < 20;
        i++
    ) {

        values.push(
            220 +
            Math.random() *
            120
        );

    }


    new Chart(
        powerCanvas,
        {

            type: "line",


            data: {

                labels:
                    new Array(20)
                    .fill(""),


                datasets: [

                    {

                        data:
                            values,

                        borderColor:
                            "#27d69a",

                        backgroundColor:
                            "rgba(39,214,154,.08)",

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

                        grid: {

                            color:
                                "rgba(255,255,255,.05)"

                        },


                        ticks: {

                            color:
                                "#8ca7a0"

                        }

                    }

                }

            }

        }
    );

}



/* =========================================================
   ANALYTICS CHART
========================================================= */

const analyticsCanvas =
    document.getElementById(
        "analyticsChart"
    );


if (analyticsCanvas) {


    new Chart(
        analyticsCanvas,
        {

            type: "line",


            data: {

                labels: [

                    "00:00",
                    "03:00",
                    "06:00",
                    "09:00",
                    "12:00",
                    "15:00",
                    "18:00",
                    "21:00"

                ],


                datasets: [

                    {

                        data: [

                            180,
                            220,
                            190,
                            280,
                            310,
                            295,
                            330,
                            290

                        ],


                        borderColor:
                            "#27d69a",

                        backgroundColor:
                            "rgba(39,214,154,.08)",

                        fill: true,

                        tension: .4

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

                    y: {

                        grid: {

                            color:
                                "rgba(255,255,255,.05)"

                        },

                        ticks: {

                            color:
                                "#8ca7a0"

                        }

                    },


                    x: {

                        grid: {
                            display: false
                        },

                        ticks: {

                            color:
                                "#8ca7a0"

                        }

                    }

                }

            }

        }
    );

}
