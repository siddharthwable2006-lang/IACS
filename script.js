/* =========================
   CLOCK
========================= */

function updateClock() {

    const clock = document.getElementById("clock");

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


/* =========================
   TOAST
========================= */

function showToast(message) {

    const toast =
        document.getElementById("toast");

    if (!toast) {

        const newToast =
            document.createElement("div");

        newToast.id = "toast";

        newToast.className = "toast";

        newToast.textContent = message;

        document.body.appendChild(newToast);

        setTimeout(() => {
            newToast.classList.add("show");
        }, 20);

        setTimeout(() => {
            newToast.classList.remove("show");
        }, 2500);

        return;
    }

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);
}


/* =========================
   SIMULATED BATTERY DATA
========================= */

let soc = 78;

let voltage = 48.6;

let current = 6.4;

let temperature = 31.4;

let power = 311;


function simulateData() {

    soc += (Math.random() - .5) * .05;

    voltage += (Math.random() - .5) * .1;

    current += (Math.random() - .5) * .1;

    temperature += (Math.random() - .5) * .15;

    power = voltage * current;


    soc = Math.max(
        0,
        Math.min(100, soc)
    );

    current = Math.max(
        0,
        Math.min(10, current)
    );


    updateElement(
        "soc",
        Math.round(soc)
    );

    updateElement(
        "batterySOC",
        Math.round(soc) + "%"
    );

    updateElement(
        "socBar",
        "",
        true,
        soc
    );

    updateElement(
        "voltage",
        voltage.toFixed(1)
    );

    updateElement(
        "batteryVoltage",
        voltage.toFixed(1)
    );

    updateElement(
        "current",
        current.toFixed(1)
    );

    updateElement(
        "batteryCurrent",
        current.toFixed(1)
    );

    updateElement(
        "chargingCurrent",
        current.toFixed(1)
    );

    updateElement(
        "temperature",
        temperature.toFixed(1)
    );

    updateElement(
        "power",
        Math.round(power)
    );

    updateElement(
        "chargingPower",
        Math.round(power)
    );

    updateElement(
        "energyPower",
        Math.round(power) + " W"
    );
}


function updateElement(
    id,
    value,
    style = false,
    width = 0
) {

    const element =
        document.getElementById(id);

    if (!element) return;

    if (style) {

        element.style.width =
            width + "%";

        return;
    }

    element.textContent = value;
}


setInterval(
    simulateData,
    2500
);


/* =========================
   CHARGING SLIDER
========================= */

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

            const display =
                document.getElementById(
                    "chargingCurrent"
                );

            if (display) {

                display.textContent =
                    value.toFixed(1);
            }

        }
    );

}


function adjustCurrent(amount) {

    if (!slider) return;

    let value =
        Number(slider.value);

    value += amount;

    value =
        Math.max(
            0,
            Math.min(10, value)
        );

    slider.value =
        value.toFixed(1);

    const display =
        document.getElementById(
            "chargingCurrent"
        );

    if (display) {

        display.textContent =
            value.toFixed(1);
    }
}


function applyCharging() {

    const value =
        slider.value;

    current =
        Number(value);

    showToast(
        "Charging current set to " +
        Number(value).toFixed(1) +
        " A"
    );
}


/* =========================
   START / STOP CHARGING
========================= */

function startCharging() {

    const status =
        document.getElementById(
            "statusText"
        );

    const indicator =
        document.getElementById(
            "chargingStatus"
        );

    if (status) {

        status.textContent =
            "Charging Active";
    }

    if (indicator) {

        indicator.textContent = "●";

        indicator.style.color =
            "var(--green)";
    }

    showToast(
        "Charging started"
    );
}


function stopCharging() {

    const status =
        document.getElementById(
            "statusText"
        );

    const indicator =
        document.getElementById(
            "chargingStatus"
        );

    if (status) {

        status.textContent =
            "Charging Stopped";
    }

    if (indicator) {

        indicator.textContent = "●";

        indicator.style.color =
            "var(--danger)";
    }

    showToast(
        "Charging stopped"
    );
}


/* =========================
   G2V / V2G
========================= */

function setEnergyMode(mode) {

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


    if (mode === "V2G") {

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


/* =========================
   DASHBOARD CHART
========================= */

const powerCanvas =
    document.getElementById(
        "powerChart"
    );


if (powerCanvas) {

    const ctx =
        powerCanvas.getContext(
            "2d"
        );


    const labels = [];

    const values = [];


    for (
        let i = 0;
        i < 20;
        i++
    ) {

        labels.push("");

        values.push(
            250 +
            Math.random() * 100
        );

    }


    new Chart(
        ctx,
        {

            type: "line",

            data: {

                labels: labels,

                datasets: [

                    {
                        data: values,

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
                            color: "#8ca7a0"
                        }

                    }

                }

            }

        }
    );

}


/* =========================
   ANALYTICS CHART
========================= */

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

                        label:
                            "Power",

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
/* =========================
   CHARGING POWER ON / OFF
========================= */

let chargingPowerOn = true;


function toggleChargingPower() {

    chargingPowerOn = !chargingPowerOn;


    const button =
        document.getElementById("powerButton");

    const buttonText =
        document.getElementById("powerButtonText");

    const powerText =
        document.getElementById("powerText");

    const powerSubtext =
        document.getElementById("powerSubtext");

    const indicator =
        document.getElementById("powerIndicator");


    if (!button) return;


    if (chargingPowerOn) {

        /* POWER ON */

        button.classList.remove("off");

        button.classList.add("on");


        buttonText.textContent =
            "POWER ON";


        powerText.textContent =
            "POWER ON";


        powerSubtext.textContent =
            "Charging system is enabled";


        indicator.classList.remove("off");


        showToast(
            "Charging power turned ON"
        );

    }

    else {

        /* POWER OFF */

        button.classList.remove("on");

        button.classList.add("off");


        buttonText.textContent =
            "POWER OFF";


        powerText.textContent =
            "POWER OFF";


        powerSubtext.textContent =
            "Charging system is disabled";


        indicator.classList.add("off");


        showToast(
            "Charging power turned OFF"
        );

    }

}
function simulateData() {

    soc += (Math.random() - .5) * .05;

    voltage += (Math.random() - .5) * .1;

    current += (Math.random() - .5) * .1;


   function simulateData() {

    /*
       When charging power is OFF,
       don't increase charging current.
    */

    if (chargingPowerOn) {

        soc += 0.02;

        current += (Math.random() - .5) * .1;

    } else {

        current = 0;

    }


    voltage += (Math.random() - .5) * .1;

    temperature += (Math.random() - .5) * .15;


    soc = Math.max(
        0,
        Math.min(100, soc)
    );


    current = Math.max(
        0,
        Math.min(10, current)
    );


    power = voltage * current;


    updateElement(
        "chargingCurrent",
        current.toFixed(1)
    );


    updateElement(
        "batteryCurrent",
        current.toFixed(1)
    );


    updateElement(
        "power",
        Math.round(power)
    );


    updateElement(
        "chargingPower",
        Math.round(power)
    );

}
